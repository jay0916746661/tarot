// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果 (切牌+雙解析模式版)
// ============================================================

const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

// ───────────────────── HOME ─────────────────────
function HomeView({ onNav }) {
  const [feature, setFeature] = uS(null);
  uE(() => { setFeature(getDailyCard()); }, []);
  return (
    <div className="view-container fade-in">
      <div className="home-hero">
        <div>
          <div className="home-eyebrow"><span className="home-eyebrow-line" /><Eyebrow>EST · 2026 · TAIPEI · MMXXVI</Eyebrow></div>
          <h1 className="home-title-tc">靈<span className="accent">·</span>樞</h1>
          <div className="home-title-en"><em>Lumen</em> Arcana</div>
          <p className="home-quote">一副牌，一個問題，一束從你內心折射出的光——<br/>塔羅不告訴你未來，它讓你看見自己。</p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => onNav('spreads')}>開始一次占卜 · Begin →</button>
            <button className="btn-ghost" onClick={() => onNav('daily')}>今日之牌</button>
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
      <header className="view-header"><div><Eyebrow>02 · CHOOSE YOUR ARRAY</Eyebrow><h2 className="view-title-tc">擇 一 牌 陣</h2></div></header>
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

// ───────────────────── READING (加入切牌流程) ─────────────────────
function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS('question');
  const [question, setQuestion] = uS('');
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const [isFaceUpDraw, setIsFaceUpDraw] = uS(false);
  const [drawMode, setDrawMode] = uS('random');
  const [cutCount, setCutCount] = uS(0);

  uE(() => {
    if (step === 'shuffle') {
      const t = setTimeout(() => { setDrawn(drawCards(22, Date.now())); setStep('cut'); }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCut = () => {
    // 簡單模擬切牌：把陣列隨機截斷重組
    const pivot = Math.floor(Math.random() * drawn.length);
    const newDrawn = [...drawn.slice(pivot), ...drawn.slice(0, pivot)];
    setDrawn(newDrawn);
    setCutCount(c => c + 1);
    if (cutCount >= 1) { // 切兩次牌後進入擇牌
       setTimeout(() => setStep('pick'), 600);
    }
  };

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
            <div><div className="question-prompt-tc">向 牌 堆 提 出 問 題</div><button className="btn-primary" style={{marginTop:40}} disabled={!question.trim()} onClick={()=>setStep('shuffle')}>進入洗牌 →</button></div>
            <div>
              <div className="question-input-wrap">
                <Eyebrow>YOUR INQUIRY</Eyebrow>
                <textarea className="question-input" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="輸入問題..." />
              </div>
              <div className="question-suggestions">
                {['未來一個月的運勢？','這個計畫可行嗎？','我該如何面對這段關係？'].map(q=><button key={q} className="question-chip" onClick={()=>setQuestion(q)}>{q}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 'shuffle' && <div className="reading-stage"><div className="shuffle-stage">洗牌中 · 凝聚能量...</div></div>}
      
      {/* 切牌儀式 */}
      {step === 'cut' && (
        <div className="reading-stage">
          <div style={{textAlign:'center'}}>
            <Eyebrow>STEP 02 · RITUAL CUT</Eyebrow>
            <h3 className="view-title-tc" style={{marginTop:20}}>切 牌 儀 式</h3>
            <p style={{color:'var(--mist)', marginTop:12}}>請點擊牌堆進行切牌，打破既定能量</p>
            <div className="shuffle-deck" style={{cursor:'pointer', marginTop:40}} onClick={handleCut}>
              {[0,1,2,3].map(i => <div key={i} className="shuffle-card" style={{transform: `translateY(${i*-10}px)`}} />)}
            </div>
            <div style={{marginTop:40, fontFamily:'var(--mono)', color:'var(--gold)'}}>CUT COUNT: {cutCount}/2</div>
          </div>
        </div>
      )}

      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)}>{isFaceUpDraw ? '切換為背面盲抽' : '切換為正面直觀'}</button>
              <select className="btn-ghost" value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{background:'var(--midnight)'}}>
                <option value="random">隨機正逆位</option>
                <option value="upright">強制正位</option>
                <option value="reversed">強制逆位</option>
              </select>
            </div>
            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
                return (
                  <div key={i} className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`} style={{ '--rot': `rotate(${angle}deg) translateX(${offsetX}px)`, transform: `rotate(${angle}deg) translateX(${offsetX}px)`, zIndex: i }} onClick={() => togglePick(i)}>
                    <TarotCard card={isFaceUpDraw ? card : null} faceDown={!isFaceUpDraw} reversed={isFaceUpDraw ? card.isReversed : false} size="sm" />
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

// ───────────────────── RESULT (雙模式 AI 解讀) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [interp, setInterp] = uS('');
  const [loading, setLoading] = uS(true);
  const [mode, setMode] = uS('master'); // master 或 fortune
  const [localProgress, setLocalProgress] = uS(0);

  uE(() => {
    if (!result) return;
    const generate = async () => {
      setLoading(true);
      try {
        const engine = window.tarotAI.engine;
        const promptMaster = `你是一位一針見血的塔羅大師。問題：「${result.question}」。牌陣：${result.cards.map(c=>c.name+(c.isReversed?'(逆)':'')).join(',')}。請給予長篇深度解讀，包含核心定論與具體行動指南。`;
        const promptFortune = `你是一位直觀的占卜師。針對問題：「${result.question}」。請分別對「感情、事業、健康、財運」給予具體運勢評分(1-5星)與短評。`;
        
        const reply = await engine.chat.completions.create({
          messages: [{ role: "user", content: mode === 'master' ? promptMaster : promptFortune }],
          temperature: 0.7,
        });
        setInterp(reply.choices[0].message.content);
      } catch (e) { setInterp("AI 載入中或發生錯誤..."); } finally { setLoading(false); }
    };
    
    if(window.tarotAI && window.tarotAI.status === 'ready') generate();
    else {
      const t = setInterval(() => {
        if(window.tarotAI) setLocalProgress(window.tarotAI.progress);
        if(window.tarotAI?.status === 'ready') { clearInterval(t); generate(); }
      }, 1000);
    }
  }, [result, mode]);

  return (
    <div className="view-container fade-in">
      <header className="view-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div><Eyebrow>04 · INTERPRETATION</Eyebrow><h2 className="view-title-tc">解 讀 之 章</h2></div>
        <div style={{display:'flex', gap:8}}>
          <button className={`btn-ghost ${mode === 'master' ? 'active' : ''}`} onClick={()=>setMode('master')} style={mode === 'master' ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>大師深度模式</button>
          <button className={`btn-ghost ${mode === 'fortune' ? 'active' : ''}`} onClick={()=>setMode('fortune')} style={mode === 'fortune' ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>直觀運勢模式</button>
        </div>
      </header>

      {/* 單張牌顯示 */}
      <div className="interpretation-grid" style={{ marginTop: 40 }}>
        {result.cards.map((c, i) => (
          <div key={i} className="interp-card-detail" style={{ borderBottom:'1px solid var(--line-dim)', paddingBottom:32, marginBottom:32 }}>
            <div style={{display:'flex', gap:24}}>
              <TarotCard card={c} reversed={c.isReversed} size="sm" />
              <div style={{flex:1}}>
                <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
                <h4 style={{fontSize:24, color:'var(--gold)'}}>{c.name} {c.isReversed?'(逆)':'(正)'}</h4>
                <p style={{marginTop:16, fontSize:14, color:'var(--mist)'}}>{c.isReversed ? c.reversed : c.upright}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI 整體解讀 */}
      <div className="ai-synthesis" style={{background:'var(--midnight)', padding:40, border:'1px solid var(--gold)'}}>
        <div className="ai-synthesis-eyebrow"><span className={loading?"ai-pulse loading":"ai-pulse"}/><Eyebrow>{mode==='master'?'MASTER SYNTHESIS':'FORTUNE REPORT'}</Eyebrow></div>
        <div className="ai-synthesis-body" style={{marginTop:24, lineHeight:2, textAlign:'justify'}}>
          {loading ? `星辰計算中 (${localProgress}%)...` : interp.split('\n').map((p,i)=><p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="result-actions" style={{display:'flex', justifyContent:'center', gap:16, marginTop:60}}>
        <button className="btn-primary" onClick={onNew}>新的占卜</button>
        <button className="btn-ghost" onClick={()=>window.print()}>列印報告</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
