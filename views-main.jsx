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

// ───────────────────── READING (已修復扇形與托盤) ─────────────────────
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
        <div className="reading-stage">
          <div className="question-stage">
            <div className="question-prompt-tc">向 牌 堆 提 出 問 題</div>
            <textarea className="question-input" placeholder="例如：這份新工作的發展前景如何？" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <button className="btn-primary" onClick={() => setStep('shuffle')} disabled={!question.trim()}>確認問題 · 開始洗牌</button>
          </div>
        </div>
      )}
      
      {step === 'shuffle' && (
        <div className="reading-stage">
          <div className="shuffle-stage">
            <div className="shuffle-status">洗牌中 · 請靜心呼吸...</div>
          </div>
        </div>
      )}
      
      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            
            {/* 設定選單 */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)} style={isFaceUpDraw ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>
                {isFaceUpDraw ? '切換為背面抽牌 (盲抽)' : '切換為正面抽牌 (直觀)'}
              </button>
              <select className="btn-ghost" value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{ background: 'var(--midnight)' }}>
                <option value="random">正逆位：隨機</option>
                <option value="upright">正逆位：全正位</option>
                <option value="reversed">正逆位：全逆位</option>
              </select>
            </div>

            <div className="fan-counter">
              CHOOSE {spread.count} CARDS · {picked.length} / {spread.count} SELECTED
            </div>

            {/* 扇形牌堆 (已修復 inline-style 展開效果) */}
            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
                return (
                  <div
                    key={i}
                    className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`}
                    style={{ '--rot': `rotate(${angle}deg) translateX(${offsetX}px)`, transform: `rotate(${angle}deg) translateX(${offsetX}px)`, zIndex: i }}
                    onClick={() => togglePick(i)}
                  >
                    <TarotCard card={isFaceUpDraw ? card : null} faceDown={!isFaceUpDraw} reversed={isFaceUpDraw ? card.isReversed : false} size="sm" />
                  </div>
                );
              })}
            </div>

            {/* 托盤 (已修復) */}
            <div className="picked-tray">
              {Array.from({ length: spread.count }).map((_, i) => (
                <div key={i} className="picked-slot">
                  <div className="picked-slot-label">{spread.positions[i].name}</div>
                  {picked[i] !== undefined ? (
                    <TarotCard faceDown size="sm" />
                  ) : (
                    <div className="picked-empty">{i + 1}</div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── RESULT (WebGPU 預載整合版) ─────────────────────
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
          if (window.tarotAI && window.tarotAI.status === 'ready') {
            clearInterval(timer);
            generateInterpretation();
          } else if (window.tarotAI && window.tarotAI.status === 'error') {
            clearInterval(timer);
            setAiInterpretation("召喚失敗。請確認瀏覽器支援 WebGPU。");
            setLoading(false);
          }
        }, 1000);
      } else {
        generateInterpretation();
      }
    };

    const generateInterpretation = async () => {
      setLoading(true);
      try {
        const engine = window.tarotAI.engine;
        const prompt = `你是一位專業且具備同理心的塔羅大師。
使用者提問：「${result.question}」
牌陣：「${result.spread.name}」
抽出的牌：
${result.cards.map((c, i) => `- ${result.spread.positions[i].name}：${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n')}

請結合牌義與牌陣，給出約 300 字優雅的深度解析。`;

        const reply = await engine.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });

        setAiInterpretation(reply.choices[0].message.content);
      } catch (e) {
        setAiInterpretation("解讀過程發生干擾，請嘗試重新占卜。");
      } finally {
        setLoading(false);
      }
    };

    checkAndRun();
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <h2 className="view-title-tc">解 讀 之 章</h2>
      </header>
      
      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow">
          <span className={loading ? "ai-pulse loading" : "ai-pulse"} />
          <Eyebrow>WEBGPU ORACLE · 終端靈魂</Eyebrow>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 12 }}>正在連結星辰之腦...</div>
            <div style={{ fontSize: '12px', color: 'var(--mist)' }}>背景載入進度：{localProgress}%</div>
          </div>
        ) : (
          <div className="ai-synthesis-body">
            {aiInterpretation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
      </div>

      <div className="interpretation-grid" style={{ marginTop: 40 }}>
        {result.cards.map((c, i) => (
          <div key={i} className="interp-card-detail" style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            <TarotCard card={c} reversed={c.isReversed} size="sm" />
            <div style={{ flex: 1 }}>
              <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
              <h4 style={{ color: 'var(--gold)' }}>{c.name} {c.isReversed ? '(逆位)' : '(正位)'}</h4>
              <p style={{ fontSize: '14px', color: 'var(--mist)', lineHeight: '1.6' }}>
                {c.isReversed ? c.reversed : c.upright}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="result-actions" style={{ textAlign: 'center', marginTop: 40 }}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
