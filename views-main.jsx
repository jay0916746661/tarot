// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果 (急速穩定版)
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
            <Eyebrow>EST · 2026 · TAIPEI</Eyebrow>
          </div>
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

// ───────────────────── READING (修復卡牌圖片顯示 + 切牌) ─────────────────────
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
      const t = setTimeout(() => { 
        setDrawn(drawCards(22, Date.now())); 
        setStep('cut'); 
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCut = () => {
    const pivot = Math.floor(Math.random() * drawn.length);
    const newDrawn = [...drawn.slice(pivot), ...drawn.slice(0, pivot)];
    setDrawn(newDrawn);
    setCutCount(c => c + 1);
    if (cutCount >= 1) { setTimeout(() => setStep('pick'), 600); }
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
            <div><div className="question-prompt-tc">提 出 問 題</div><button className="btn-primary" style={{marginTop:40}} disabled={!question.trim()} onClick={()=>setStep('shuffle')}>開始洗牌 →</button></div>
            <div>
              <textarea className="question-input" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="你想知道什麼？" />
              <div className="question-suggestions">
                {['未來運勢？','這個決定好嗎？'].map(q=><button key={q} className="question-chip" onClick={()=>setQuestion(q)}>{q}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 'shuffle' && <div className="reading-stage">洗牌中...</div>}
      {step === 'cut' && (
        <div className="reading-stage" style={{textAlign:'center'}}>
          <Eyebrow>RITUAL CUT</Eyebrow><h3 className="view-title-tc" style={{marginTop:20}}>切 牌 儀 式</h3>
          <div className="shuffle-deck" style={{cursor:'pointer', marginTop:40}} onClick={handleCut}>
            {[0,1,2,3].map(i => <div key={i} className="shuffle-card" style={{transform: `translateY(${i*-8}px)`}} />)}
          </div>
        </div>
      )}
      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)}>{isFaceUpDraw ? '背面抽牌' : '正面抽牌'}</button>
              <select className="btn-ghost" value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{background:'var(--midnight)', color:'white'}}>
                <option value="random">隨機正逆</option><option value="upright">全正位</option><option value="reversed">全逆位</option>
              </select>
            </div>
            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
                const isR = drawMode === 'random' ? card.isReversed : (drawMode === 'reversed');
                return (
                  <div key={i} className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`} 
                    style={{ transform: `rotate(${angle}deg) translateX(${offsetX}px)`, zIndex: i }} onClick={() => togglePick(i)}>
                    {/* 修復：確保 TarotCard 正確接收 card 參數 */}
                    <TarotCard card={card} faceDown={!isFaceUpDraw} reversed={isFaceUpDraw ? isR : false} size="sm" />
                  </div>
                );
              })}
            </div>
            <div className="picked-tray">
              {Array.from({ length: spread.count }).map((_, i) => (
                <div key={i} className="picked-slot">
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

// ───────────────────── RESULT (優化解析順序 + 偽 AI 長文) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiText, setAiText] = uS('');
  const [loading, setLoading] = uS(true);

  uE(() => {
    if (!result) return;
    // 偽 AI 邏輯：根據牌面生成長文，速度極快
    const generate = () => {
      setLoading(true);
      setTimeout(() => {
        const c1 = result.cards[0];
        const last = result.cards[result.cards.length - 1];
        const revCount = result.cards.filter(c => c.isReversed).length;
        
        const content = `【命運核心定論】\n針對你提問的「${result.question}」，目前的能量場顯示出極強的「${c1.element}」元素導向。這代表這件事${c1.isReversed ? '目前處於內耗期，雖然表面平靜但暗流湧動' : '正處於爆發期，事情的進展會比你預期的快'}。核心結論是：不要再回頭看，能量正在推動你向前。\n\n【能量交織深度解析】\n你抽出的牌組中，${c1.name} 作為開端，定下了${c1.isReversed ? '謹慎' : '開創'}的基調。而 ${revCount > 0 ? `其中有 ${revCount} 張逆位，說明你內心對於這件事還有未處理的恐懼。` : '全數正位顯示你的身心高度合一，這是難得的吉兆。'} 最終以 ${last.name} 收尾，這是一個強烈的信號，暗示這件事的結局將會與「${last.keywords[0]}」密切相關。\n\n【全方位運勢展望】\n● 事業/財運：現在是累積資源的階段，雖然短期內看不見大錢，但地基正在穩固。\n● 感情/人際：彼此的信任感是目前的重點，如果感到壓抑，那是因為你沒說出真心話。\n● 身心靈提醒：你的直覺最近很準，請多留意夢境中的暗示。\n\n【大師級行動指南】\n1. 停止向外尋求認同，明天早上醒來後第一件想起的事，就是你的答案。\n2. 找一個有水的地方靜坐，清洗掉多餘的焦慮。\n3. 在接下來的三天內，主動聯繫一位你信任的長輩。`;
        
        setAiText(content);
        setLoading(false);
      }, 1000);
    };
    generate();
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header"><div><Eyebrow>啟 示 錄</Eyebrow><h2 className="view-title-tc">占 卜 結 果</h2></div></header>

      {/* 1. 先看單張牌細節 */}
      <div style={{ marginBottom: 60 }}>
        <Eyebrow>STEP 01 · 牌面觀照</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 24 }}>
          {result.cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ borderBottom:'1px solid var(--line-dim)', paddingBottom:32, marginBottom:32 }}>
              <div style={{display:'flex', gap:24}}>
                <TarotCard card={c} reversed={c.isReversed} size="sm" />
                <div style={{flex:1}}>
                  <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
                  <h4 style={{fontSize:24, color:'var(--gold)'}}>{c.name} {c.isReversed?'(逆)':'(正)'}</h4>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:16, background:'var(--midnight)', padding:20}}>
                    <div style={{opacity: c.isReversed ? 0.3 : 1}}><strong>正位：</strong>{c.upright}</div>
                    <div style={{opacity: c.isReversed ? 1 : 0.3}}><strong>逆位：</strong>{c.reversed}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 再看整體長篇總結 */}
      <div className="ai-synthesis" style={{background:'var(--void)', border:'1px solid var(--gold)', padding:40}}>
        <div className="ai-synthesis-eyebrow"><span className={loading?"ai-pulse loading":"ai-pulse"}/><Eyebrow>STEP 02 · 運勢大師總結</Eyebrow></div>
        <div className="ai-synthesis-body" style={{marginTop:32, lineHeight:2.2, textAlign:'justify'}}>
          {loading ? "星辰連結中..." : aiText.split('\n').map((p,i)=><p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="result-actions" style={{display:'flex', justifyContent:'center', gap:16, marginTop:60, paddingBottom:80}}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={() => window.print()}>輸出 PDF</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
