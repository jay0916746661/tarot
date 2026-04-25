// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果
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

// ───────────────────── READING (包含提問引導 & 正逆位選項) ─────────────────────
function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS('question');
  const [question, setQuestion] = uS('');
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const [isFaceUpDraw, setIsFaceUpDraw] = uS(false); // 正面/背面抽牌
  const [drawMode, setDrawMode] = uS('random'); // 正逆位設定

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
            // 根據選單設定套用正逆位
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
        <div className="reading-stage">
          <div className="question-stage">
            <div>
              <div className="question-prompt-tc">向 牌 堆<br/>提 出 一 個 問 題</div>
              <div className="question-prompt-en">— and the cards will answer.</div>
              <p className="question-hint">問題越具體，啟示越清晰。</p>
              <button className="btn-primary" style={{ marginTop: 40 }} disabled={!question.trim()} onClick={() => setStep('shuffle')}>確認問題 · 進入洗牌 →</button>
            </div>
            <div>
              <div className="question-input-wrap">
                <Eyebrow>YOUR INQUIRY</Eyebrow>
                <textarea className="question-input" placeholder="輸入您的困惑..." value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 140))} style={{ marginTop: 16 }} />
                <div className="question-counter"><span>{question.length} / 140</span><span>{spread.name} · {spread.count} CARDS</span></div>
              </div>
              <div className="question-suggestions">
                {['我此刻最需要看見什麼？', '轉職的決定是否正確？', '這段關係的阻礙是什麼？', '本月我的核心課題？'].map((q) => (
                  <button key={q} className="question-chip" onClick={() => setQuestion(q)}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 'shuffle' && <div className="reading-stage"><div className="shuffle-stage">洗牌中 · 請靜心呼吸...</div></div>}
      
      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            
            {/* 恢復：正逆位與抽牌設定選單 */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)} style={isFaceUpDraw ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>
                {isFaceUpDraw ? '背面抽牌 (盲抽)' : '正面抽牌 (直觀)'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--midnight)', padding: '0 12px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '10px', color: 'var(--mist)', fontFamily: 'var(--mono)' }}>ORIENT:</span>
                <select value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{ background: 'transparent', color: 'var(--parchment)', border: 'none', padding: '10px 0', outline: 'none', cursor: 'pointer' }}>
                  <option value="random">隨機</option>
                  <option value="upright">全正位</option>
                  <option value="reversed">全逆位</option>
                </select>
              </div>
            </div>

            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
                // 即時反映選單設定
                const cardReversed = drawMode === 'random' ? card.isReversed : (drawMode === 'reversed');
                return (
                  <div key={i} className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`} style={{ '--rot': `rotate(${angle}deg) translateX(${offsetX}px)`, transform: `rotate(${angle}deg) translateX(${offsetX}px)`, zIndex: i }} onClick={() => togglePick(i)}>
                    <TarotCard card={isFaceUpDraw ? card : null} faceDown={!isFaceUpDraw} reversed={isFaceUpDraw ? cardReversed : false} size="sm" />
                  </div>
                );
              })}
            </div>

            <div className="picked-tray">
              {Array.from({ length: spread.count }).map((_, i) => (
                <div key={i} className="picked-slot">
                  <div className="picked-slot-label">{spread.positions[i].name}</div>
                  {picked[i] !== undefined ? <TarotCard faceDown size="sm" /> : <div className="picked-empty">{i + 1}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── RESULT (強化 AI 直觀解答 + 功能按鈕) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiInterpretation, setAiInterpretation] = uS('');
  const [loading, setLoading] = uS(true);
  const [localProgress, setLocalProgress] = uS(window.tarotAI ? window.tarotAI.progress : 0);

  uE(() => {
    if (!result) return;
    const checkAndRun = async () => {
      if (!window.tarotAI || window.tarotAI.status !== 'ready') {
        const timer = setInterval(() => {
          if (window.tarotAI) setLocalProgress(window.tarotAI.progress);
          if (window.tarotAI && window.tarotAI.status === 'ready') { clearInterval(timer); generateInterpretation(); }
        }, 1000);
      } else { generateInterpretation(); }
    };

    const generateInterpretation = async () => {
      setLoading(true);
      try {
        const engine = window.tarotAI.engine;
        const prompt = `你是一位一針見血、精準且具備同理心的塔羅大師。
使用者提問：「${result.question}」
抽到的牌：
${result.cards.map((c, i) => `- ${result.spread.positions[i].name}：${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n')}

請給出 300 字解析。嚴格要求：
1. 第一段必須【直接回答】使用者的核心困惑，不要含糊。
2. 結合牌面給出明確的【因果解釋】。
3. 給出一個現實中可以立刻去做的【具體建議】。
語氣專業且堅定。`;

        const reply = await engine.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        setAiInterpretation(reply.choices[0].message.content);
      } catch (e) { setAiInterpretation("解讀失敗，請檢查 WebGPU 環境。"); } finally { setLoading(false); }
    };
    checkAndRun();
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header"><h2 className="view-title-tc">解 讀 之 章</h2></header>
      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow"><span className={loading ? "ai-pulse loading" : "ai-pulse"} /><Eyebrow>WEBGPU AI 解讀</Eyebrow></div>
        <div className="ai-synthesis-body">
          {loading ? `星辰連結中 (${localProgress}%)...` : aiInterpretation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="interpretation-grid" style={{ marginTop: 40 }}>
        {result.cards.map((c, i) => (
          <div key={i} className="interp-card-detail" style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            <TarotCard card={c} reversed={c.isReversed} size="sm" />
            <div style={{ flex: 1 }}>
              <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
              <h4 style={{ color: 'var(--gold)' }}>{c.name} {c.isReversed ? '(逆位)' : '(正位)'}</h4>
              <p style={{ fontSize: '14px', color: 'var(--mist)', lineHeight: '1.6' }}>{c.isReversed ? c.reversed : c.upright}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 40, paddingBottom: 60 }}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={() => alert('已儲存至瀏覽器暫存區')}>儲存至紀錄</button>
        <button className="btn-ghost" onClick={() => window.print()}>輸出 PDF</button>
        <button className="btn-ghost" onClick={() => navigator.share ? navigator.share({title:'靈樞塔羅', url:window.location.href}) : alert('不支援分享')}>分享</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
