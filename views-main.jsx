// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果 (終極長文 AI 版)
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
          <p className="home-quote">一副牌，一個問題，一束從你內心折射出的光——<br/>塔羅不告訴你未來，它讓你看見自己。</p>
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
        <div className="reading-stage">
          <div className="question-stage">
            <div>
              <div className="question-prompt-tc">向 牌 堆<br/>提 出 一 個 問 題</div>
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
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)} style={isFaceUpDraw ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>{isFaceUpDraw ? '背面抽牌' : '正面抽牌'}</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--midnight)', padding: '0 12px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '10px', color: 'var(--mist)', fontFamily: 'var(--mono)' }}>ORIENT:</span>
                <select value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{ background: 'transparent', color: 'var(--parchment)', border: 'none', padding: '10px 0', outline: 'none', cursor: 'pointer' }}>
                  <option value="random">隨機</option><option value="upright">全正位</option><option value="reversed">全逆位</option>
                </select>
              </div>
            </div>
            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
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

// ───────────────────── RESULT (長文 AI 版本) ─────────────────────
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
        const prompt = `你是一位極具深度、解析詳盡且一針見血的塔羅大師。
使用者提問：「${result.question}」
抽到的牌：
${result.cards.map((c, i) => `- 【${result.spread.positions[i].name}】：${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n')}

請為使用者撰寫一份內容極其豐富、長度約 600-800 字的深度運勢報告。
報告必須包含以下四大區塊，且每個區塊都要深入挖掘，不要草草帶過：

1. 【命運定論】：針對問題給出最直觀、最核心的結論。
2. 【能量交織解析】：詳細分析這幾張牌如何在牌陣位置中互相影響，揭露事情的隱藏動機與因果。
3. 【全方位運勢分析】：
   - 【事業/財運】：目前的局勢與機會。
   - 【情感/人際】：能量流動狀態。
   - 【心靈/健康】：潛意識的提醒。
4. 【大師級行動指南】：給予三個極其具體、現實中可以立刻執行的具體建議。

語氣請展現神祕感但言之有物，像是一位真正的大師在為其指點迷津。`;

        const reply = await engine.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        setAiInterpretation(reply.choices[0].message.content);
      } catch (e) { setAiInterpretation("解讀失敗。"); } finally { setLoading(false); }
    };
    checkAndRun();
  }, [result]);

  const saveToArchive = () => {
    const history = JSON.parse(localStorage.getItem('tarot_history') || '[]');
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      question: result.question,
      spread: result.spread.name,
      cards: result.cards.map(c => `${c.name}${c.isReversed ? '(逆)' : ''}`),
      summary: aiInterpretation.slice(0, 100) + '...'
    };
    localStorage.setItem('tarot_history', JSON.stringify([newEntry, ...history]));
    alert('占卜結果已成功存入您的靈魂紀錄中。');
    onNav('archive');
  };

  return (
    <div className="view-container fade-in">
      <header className="view-header"><h2 className="view-title-tc">解 讀 之 章</h2></header>
      
      {/* 順序翻轉：先顯示單張牌細節 */}
      <div style={{ marginBottom: 60 }}>
        <Eyebrow>STEP 01 · 牌 面 觀 照 · INDIVIDUAL INSIGHTS</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 32 }}>
          {result.cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--line-dim)' }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <TarotCard card={c} reversed={c.isReversed} size="sm" />
                <div style={{ flex: 1 }}>
                  <div className="interp-pos-tag">{result.spread.positions[i].name} · {result.spread.positions[i].meaning}</div>
                  <h4 style={{ color: 'var(--gold)', fontSize: '24px' }}>{c.name} {c.isReversed ? '(逆位)' : '(正位)'}</h4>
                  <div className="interp-keywords" style={{ margin: '12px 0' }}>{c.keywords.map(k => <span key={k} className="interp-kw">{k}</span>)}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: 'var(--midnight)', padding: 24, borderRadius: 8 }}>
                <div style={{ opacity: c.isReversed ? 0.3 : 1 }}><Eyebrow dim>正位含義</Eyebrow><p style={{ fontSize: '13px', lineHeight: 1.8, marginTop: 10 }}>{c.upright}</p></div>
                <div style={{ opacity: c.isReversed ? 1 : 0.3 }}><Eyebrow dim>逆位含義</Eyebrow><p style={{ fontSize: '13px', lineHeight: 1.8, marginTop: 10 }}>{c.reversed}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 總結區塊 */}
      <div className="ai-synthesis" style={{ background: 'var(--void)', border: '1px solid var(--gold)', padding: '48px' }}>
        <div className="ai-synthesis-eyebrow" style={{ justifyContent: 'center' }}>
          <span className={loading ? "ai-pulse loading" : "ai-pulse"} />
          <Eyebrow>STEP 02 · 運 勢 總 結 · MASTER SYNTHESIS</Eyebrow>
        </div>
        <div className="ai-synthesis-body" style={{ marginTop: 32, fontSize: '16px', lineHeight: '2.2', textAlign: 'justify' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--gold)' }}>
              正在凝聚所有牌面的共振能量，請耐心等待啟示... ({localProgress}%)
            </div>
          ) : (
            aiInterpretation.split('\n').map((p, i) => <p key={i} style={{ marginBottom: '1.5em' }}>{p}</p>)
          )}
        </div>
      </div>

      <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 60, paddingBottom: 100 }}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={saveToArchive}>儲存至紀錄</button>
        <button className="btn-ghost" onClick={() => window.print()}>列印報告 (PDF)</button>
        <button className="btn-ghost" onClick={() => navigator.share ? navigator.share({title:'靈樞塔羅解讀', url:window.location.href}) : alert('不支援分享')}>分享</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
