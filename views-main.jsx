// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果、每日、牌義、紀錄
// ============================================================

const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

// ───────────────────── HOME ─────────────────────
function HomeView({ onNav }) {
  const [feature, setFeature] = uS(null);
  uE(() => { setFeature(getDailyCard()); }, []);
  const time = useClock();

  return (
    <div className="view-container fade-in">
      <div className="home-hero">
        <div>
          <div className="home-eyebrow">
            <span className="home-eyebrow-line" />
            <Eyebrow>EST · 2026 · TAIPEI · MMXXVI</Eyebrow>
          </div>
          <h1 className="home-title-tc">靈<span className="accent">·</span>樞</h1>
          <div className="home-title-en"><em>Lumen</em> Arcana</div>
          <p className="home-quote">
            一副牌，一個問題，一束從你內心折射出的光——<br/>
            塔羅不告訴你未來，它讓你看見自己。
          </p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => onNav('spreads')}>開始一次占卜 · Begin →</button>
            <button className="btn-ghost" onClick={() => onNav('daily')}>今日之牌</button>
            <span className="home-actions-meta">{time} · TPE</span>
          </div>
        </div>
        <div className="home-altar">
          <div className="home-altar-compass"><AstroCompass size={520} opacity={0.35} /></div>
          <div className="home-altar-card">{feature && <TarotCard card={feature} reversed={feature.isReversed} size="xl" />}</div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────── SPREADS ─────────────────────
function SpreadsView({ onNav, onSelectSpread }) {
  const [picked, setPicked] = uS(null);
  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div><Eyebrow>02 · CHOOSE YOUR ARRAY</Eyebrow><h2 className="view-title-tc">擇 一 牌 陣</h2></div>
      </header>
      <div className="spreads-grid">
        {SPREADS.map((s, i) => (
          <div key={s.id} className={`spread-cell ${picked === s.id ? 'selected' : ''}`} onClick={() => setPicked(s.id)} onDoubleClick={() => { onSelectSpread(s); onNav('reading'); }}>
            <div className="spread-cell-title">{s.name}</div>
            <p className="spread-cell-desc">{s.description}</p>
            <button className="btn-ghost" onClick={() => { onSelectSpread(s); onNav('reading'); }}>選擇 →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────── READING ─────────────────────
function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS('question');
  const [question, setQuestion] = uS('');
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const [isFaceUpDraw, setIsFaceUpDraw] = uS(false);
  const [drawMode, setDrawMode] = uS('random');

  uE(() => {
    if (step === 'shuffle') {
      const t = setTimeout(() => {
        setDrawn(drawCards(22, Date.now()));
        setStep('pick');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const togglePick = (idx) => {
    if (picked.length < spread.count && !picked.includes(idx)) {
      const next = [...picked, idx];
      setPicked(next);
      if (next.length === spread.count) {
        setTimeout(() => {
          const finalCards = next.map(i => {
            const c = {...drawn[i]};
            if (drawMode === 'upright') c.isReversed = false;
            else if (drawMode === 'reversed') c.isReversed = true;
            return c;
          });
          onComplete({ spread, question, cards: finalCards, ts: Date.now() });
        }, 800);
      }
    }
  };

  return (
    <div className="view-container fade-in">
      {step === 'question' && (
        <div className="question-stage">
          <textarea className="question-input" placeholder="輸入你的問題..." value={question} onChange={(e) => setQuestion(e.target.value)} />
          <button className="btn-primary" onClick={() => setStep('shuffle')}>開始洗牌</button>
        </div>
      )}
      {step === 'shuffle' && <div className="shuffle-stage">洗牌中...</div>}
      {step === 'pick' && (
        <div className="fan-stage">
          <div className="fan-container">
            {drawn.map((card, i) => (
              <div key={i} className="fan-card-wrap" onClick={() => togglePick(i)}>
                <TarotCard card={isFaceUpDraw ? card : null} faceDown={!isFaceUpDraw} reversed={isFaceUpDraw ? card.isReversed : false} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── RESULT (核心 AI 修改處) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiInterpretation, setAiInterpretation] = uS('正在連接靈魂維度，請稍候...');
  const [loading, setLoading] = uS(true);

  uE(() => {
    if (!result) return;

    const askAI = async () => {
      setLoading(true);
      try {
        // 這裡設定為連線到你本地的 Ollama (預設連接埠 11434)
        // 如果你使用 OpenClaw 或其他服務，請修改此 URL
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'llama3', // 請確認你本地已下載的模型名稱
            prompt: `你是一位神秘、專業且具備同理心的塔羅大師。
使用者問了這個問題：「${result.question}」
抽到的牌陣是：「${result.spread.name}」
抽到的牌包含：
${result.cards.map((c, i) => `- 位置 ${result.spread.positions[i].name}：${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n')}

請針對使用者的問題，結合牌義與牌陣位置給出深刻的整體分析，字數約 300 字，口吻要優雅且富有啟示性。`,
            stream: false
          }),
        });

        const data = await response.json();
        setAiInterpretation(data.response);
      } catch (error) {
        setAiInterpretation("目前無法連接到本地 AI 大腦。請確保 Ollama 已啟動，或手動進行解讀。");
      } finally {
        setLoading(false);
      }
    };

    askAI();
  }, [result]);

  if (!result) return null;

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <h2 className="view-title-tc">解 讀 之 章</h2>
      </header>
      <div className="result-question">問題：{result.question}</div>
      
      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow">
          <span className={loading ? "ai-pulse loading" : "ai-pulse"} />
          <Eyebrow>ORACLE SPEAKS · AI 專屬解讀</Eyebrow>
        </div>
        <div className="ai-synthesis-body">
          {aiInterpretation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="interpretation-grid">
        {result.cards.map((c, i) => (
          <div key={i} className="interp-card-detail">
            <TarotCard card={c} reversed={c.isReversed} size="sm" />
            <div>
              <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
              <h4>{c.name} ({c.isReversed ? '逆位' : '正位'})</h4>
              <p>{c.isReversed ? c.reversed : c.upright}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onNew}>重新占卜</button>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
