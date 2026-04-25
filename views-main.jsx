const { useState: uS, useEffect: uE } = React;

// ───────────────────── HOME ─────────────────────
function HomeView({ onNav }) {
  const [feature, setFeature] = uS(null);
  uE(() => { setFeature(getDailyCard()); }, []);
  return (
    <div className="view-container fade-in">
      <div className="home-hero">
        <div>
          <div className="home-eyebrow"><span className="home-eyebrow-line" /><Eyebrow>EST · 2026 · TAIPEI</Eyebrow></div>
          <h1 className="home-title-tc">靈<span className="accent">·</span>樞</h1>
          <div className="home-title-en"><em>Lumen</em> Arcana</div>
          <p className="home-quote">塔羅不告訴你未來，它讓你看見自己。</p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => onNav('spreads')}>開始占卜 →</button>
          </div>
        </div>
        <div className="home-altar">
          <div className="home-altar-card">{feature && <TarotCard card={feature} reversed={feature.isReversed} size="xl" />}</div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────── SPREADS ─────────────────────
function SpreadsView({ onNav, onSelectSpread }) {
  return (
    <div className="view-container fade-in">
      <header className="view-header"><h2 className="view-title-tc">擇 一 牌 陣</h2></header>
      <div className="spreads-grid">
        {SPREADS.map((s) => (
          <div key={s.id} className="spread-cell" onClick={() => { onSelectSpread(s); onNav('reading'); }}>
            <div className="spread-cell-title">{s.name}</div>
            <p>{s.description}</p>
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
      setTimeout(() => { setDrawn(drawCards(22, Date.now())); setStep('cut'); }, 1500);
    }
  }, [step]);

  const handleCut = () => {
    const pivot = Math.floor(Math.random() * drawn.length);
    setDrawn([...drawn.slice(pivot), ...drawn.slice(0, pivot)]);
    setStep('pick');
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
          onComplete({ spread, question, cards: finalCards });
        }, 800);
      }
    }
  };

  return (
    <div className="view-container fade-in">
      {step === 'question' && (
        <div className="question-stage">
          <textarea className="question-input" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="輸入問題..." />
          <button className="btn-primary" onClick={()=>setStep('shuffle')}>開始洗牌</button>
        </div>
      )}
      {step === 'shuffle' && <div className="shuffle-stage">能量凝聚中...</div>}
      {step === 'cut' && (
        <div className="reading-stage" style={{textAlign:'center'}}>
          <h3 className="view-title-tc">切 牌 儀 式</h3>
          <div className="shuffle-deck" style={{marginTop:40, cursor:'pointer'}} onClick={handleCut}>
            {[0,1,2].map(i => <div key={i} className="shuffle-card" style={{transform:`translateY(${i*-10}px)`}} />)}
          </div>
          <p style={{marginTop:20, color:'var(--gold)'}}>點擊牌堆完成切牌</p>
        </div>
      )}
      {step === 'pick' && (
        <div className="fan-stage">
          <div style={{display:'flex', gap:12, justifyContent:'center', marginBottom:20}}>
            <button className="btn-ghost" onClick={()=>setIsFaceUpDraw(!isFaceUpDraw)}>{isFaceUpDraw?'隱藏牌面':'顯示牌面'}</button>
            <select className="btn-ghost" value={drawMode} onChange={(e)=>setDrawMode(e.target.value)} style={{background:'#000'}}>
              <option value="random">隨機正逆</option><option value="upright">全正位</option><option value="reversed">全逆位</option>
            </select>
          </div>
          <div className="fan-container">
            {drawn.map((card, i) => (
              <div key={i} className="fan-card-wrap" onClick={()=>togglePick(i)}>
                <TarotCard card={card} faceDown={!isFaceUpDraw} size="sm" />
              </div>
            ))}
          </div>
          <div className="picked-tray">
             {picked.map((p, i) => <div key={i} className="picked-slot"><TarotCard faceDown size="xs" /></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── RESULT (急速解析版本) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [summary, setSummary] = uS('');
  const [loading, setLoading] = uS(true);

  uE(() => {
    // 這裡我們用一個專業的邏輯模擬大師，1秒產出
    setTimeout(() => {
      const c1 = result.cards[0];
      const last = result.cards[result.cards.length - 1];
      const revs = result.cards.filter(c => c.isReversed).length;

      const text = `【命運核心定論】\n針對你的提問「${result.question}」，牌面顯示目前的局面正處於一個「${c1.element}」元素主導的階段。這代表這件事${c1.isReversed ? '目前受到情緒或外界雜訊的干擾，能量較為內收' : '正處於積極發展的上升期，動力十足'}。核心結論是：現在不宜過度焦慮，應專注於當下的微小變動。\n\n【能量交織深度解析】\n你抽出的 ${result.cards.map(c=>c.name).join('、')} 構成了一個特殊的矩陣。${revs > 1 ? '多張逆位提醒你，你對這件事的認知可能存在盲點，或者是過去的陰影在拉扯你。' : '穩定的正位分佈顯示你的目標感很強。'} 以 ${last.name} 為終局，預示了只要你保持「${last.keywords[0]}」的精神，最終能撥雲見日。\n\n【全方位運勢展望】\n● 事業/財運：目前的僵局只是假象，建議在下週二前不要做重大財務決定。\n● 感情/人際：彼此的信任正在經受考驗，誠實的面對內心需求比維持表面和諧更重要。\n● 身心靈提醒：你的能量過度集中在腦部，建議多走入大自然，平衡土元素能量。\n\n【大師級具體行動指南】\n1. 明早起床後，寫下你對這件事的第一個直覺反應。\n2. 找一個安靜的半小時，斷開手機與外界的聯繫。\n3. 在接下來的三天內，主動處理一件你一直逃避的小事。`;
      
      setSummary(text);
      setLoading(false);
    }, 1000);
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header"><h2 className="view-title-tc">啟 示 錄</h2></header>

      {/* 先看單張牌細節 */}
      <div className="interpretation-grid" style={{marginTop:30}}>
        {result.cards.map((c, i) => (
          <div key={i} className="interp-card-detail" style={{borderBottom:'1px solid #333', paddingBottom:30, marginBottom:30}}>
            <div style={{display:'flex', gap:20}}>
              <TarotCard card={c} reversed={c.isReversed} size="sm" />
              <div style={{flex:1}}>
                <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
                <h4 style={{color:'var(--gold)', fontSize:20}}>{c.name} {c.isReversed?'(逆)':'(正)'}</h4>
                <p style={{fontSize:14, color:'var(--mist)', marginTop:10}}>{c.isReversed ? c.reversed : c.upright}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 再看整體總結 */}
      <div className="ai-synthesis" style={{background:'#0a0a0a', border:'1px solid var(--gold)', padding:30}}>
        <div className="ai-synthesis-eyebrow"><Eyebrow>MASTER SYNTHESIS · 運勢總結</Eyebrow></div>
        <div className="ai-synthesis-body" style={{marginTop:20, lineHeight:2}}>
          {loading ? "星辰共振中..." : summary.split('\n').map((p,i)=><p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="result-actions" style={{display:'flex', justifyContent:'center', gap:16, marginTop:40, paddingBottom:60}}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={()=>window.print()}>輸出報告</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
