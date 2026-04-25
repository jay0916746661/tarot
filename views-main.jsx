// ============================================================
// 靈樞 Lumen Arcana - 終極穩定功能版 ( views-main.jsx )
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
          <div className="home-eyebrow"><span className="home-eyebrow-line" /><Eyebrow>EST · 2026 · TAIPEI</Eyebrow></div>
          <h1 className="home-title-tc">靈<span className="accent">·</span>樞</h1>
          <div className="home-title-en"><em>Lumen</em> Arcana</div>
          <p className="home-quote">一副牌，一個問題，一束從你內心折射出的光——<br/>塔羅不告訴你未來，它讓你看見自己。</p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => onNav('spreads')}>開始占卜 · Begin →</button>
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

// ───────────────────── SPREADS (修復圖片與描述) ─────────────────────
function SpreadsView({ onNav, onSelectSpread }) {
  return (
    <div className="view-container fade-in">
      <header className="view-header"><div><Eyebrow>02 · CHOOSE YOUR ARRAY</Eyebrow><h2 className="view-title-tc">擇 一 牌 陣</h2></div></header>
      <div className="spreads-grid">
        {SPREADS.map((s) => (
          <div key={s.id} className="spread-cell" onClick={() => { onSelectSpread(s); onNav('reading'); }}>
             <div className="spread-cell-icon">{s.count}</div>
            <div className="spread-cell-title">{s.name}</div>
            <p className="spread-cell-desc">{s.description}</p>
            <div className="spread-cell-meta">{s.count} CARDS · {s.id.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────── READING (包含問題引導、切牌、正確顯示選牌) ─────────────────────
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
        setStep('cut');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCut = () => {
    const pivot = Math.floor(Math.random() * drawn.length);
    const newDrawn = [...drawn.slice(pivot), ...drawn.slice(0, pivot)];
    setDrawn(newDrawn);
    setStep('pick'); // 切完牌立即進入選牌階段
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
            <div>
              <div className="question-prompt-tc">向 牌 堆<br/>提 出 一 個 問 題</div>
              <button className="btn-primary" style={{ marginTop: 40 }} disabled={!question.trim()} onClick={() => setStep('shuffle')}>確認問題 · 開始洗牌 →</button>
            </div>
            <div>
              <div className="question-input-wrap">
                <Eyebrow>YOUR INQUIRY</Eyebrow>
                <textarea className="question-input" placeholder="例如：這份新工作的發展前景如何？" value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 140))} style={{ marginTop: 16 }} />
                <div className="question-counter"><span>{question.length} / 140</span><span>{spread.name} · {spread.count} CARDS</span></div>
              </div>
              <div className="question-suggestions">
                {['我此刻最需要看見什麼？', '目前的壓力源頭來自哪裡？', '與對方的關係將如何發展？', '這項投資是否適合當下的我？'].map((q) => (
                  <button key={q} className="question-chip" onClick={() => setQuestion(q)}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 'shuffle' && <div className="reading-stage"><div className="shuffle-stage">洗牌中 · 請靜心呼吸...</div></div>}
      
      {step === 'cut' && (
        <div className="reading-stage" style={{textAlign:'center'}}>
          <Eyebrow>STEP 02 · RITUAL CUT</Eyebrow>
          <h3 className="view-title-tc" style={{marginTop:20}}>切 牌 儀 式</h3>
          <p style={{color:'var(--mist)', marginTop:12}}>點擊牌堆以完成切牌，打破預設能量</p>
          <div className="shuffle-deck" style={{cursor:'pointer', marginTop:60, display:'inline-block'}} onClick={handleCut}>
            {[0,1,2,3,4].map(i => <div key={i} className="shuffle-card" style={{transform: `translateY(${i*-8}px)`}} />)}
          </div>
        </div>
      )}

      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <button className="btn-ghost" onClick={() => setIsFaceUpDraw(!isFaceUpDraw)} style={isFaceUpDraw ? {borderColor:'var(--gold)', color:'var(--gold)'} : {}}>
                {isFaceUpDraw ? '背面盲抽' : '正面直觀'}
              </button>
              <select className="btn-ghost" value={drawMode} onChange={(e) => setDrawMode(e.target.value)} style={{ background: 'var(--midnight)', color:'white' }}>
                <option value="random">隨機正逆位</option>
                <option value="upright">全正位</option>
                <option value="reversed">全逆位</option>
              </select>
            </div>

            <div className="fan-container">
              {drawn.map((card, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 920;
                return (
                  <div key={i} className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`} 
                       style={{ transform: `rotate(${angle}deg) translateX(${offsetX}px)`, zIndex: i }} onClick={() => togglePick(i)}>
                    <TarotCard card={card} faceDown={!isFaceUpDraw} reversed={drawMode==='reversed'?true:(drawMode==='upright'?false:card.isReversed)} size="sm" />
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

// ───────────────────── RESULT (長文解析 + 順序優化) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiText, setAiText] = uS('');
  const [loading, setLoading] = uS(true);

  uE(() => {
    if (!result) return;
    setTimeout(() => {
      const c1 = result.cards[0];
      const last = result.cards[result.cards.length - 1];
      const revs = result.cards.filter(c => c.isReversed).length;
      
      const text = `【命運核心定論】\n針對你詢問的「${result.question}」，牌面顯示目前局勢正處於一個「${c1.element}」元素主導的階段。這代表這件事${c1.isReversed ? '目前受到情緒或外界雜訊的干擾，能量較為內收' : '正處於積極發展的上升期，動力十足'}。核心結論是：不要在此刻過度追求「答案」，答案就在你的行動之中。\n\n【能量交織深度解析】\n你抽出的 ${result.cards.map(c=>c.name).join('、')} 構成了一個特殊的感應矩陣。${revs > 0 ? `其中有 ${revs} 張逆位，這強烈暗示了你內心對於這件事存在著隱形的安全感缺失。` : '全數正位的排布顯示你的能量非常通透，沒有多餘的阻礙。'} 最終以 ${last.name} 為收尾，預示了只要你保持「${last.keywords[0]}」的精神，最終能撥雲見日。\n\n【全方位運勢展望】\n● 事業/財運：目前的僵局只是假象，建議在下週二前不要做重大財務決定，觀望是更好的策略。\n● 感情/人際：彼此的信任正在經受考驗，誠實地面對內心需求比維持表面和諧更重要。\n● 身心靈提醒：你的能量過度集中在腦部，最近是否感覺思慮過重？建議多走入大自然，平衡能量。\n\n【大師級具體行動指南】\n1. 明早起床後，寫下你對這件事的第一個直覺反應，那通常是靈魂的聲音。\n2. 找一個安靜的半小時，徹底斷開手機與外界的聯繫，靜坐呼吸。\n3. 在接下來的三天內，主動處理一件你一直逃避的小事，這會啟動能量流轉。`;
      
      setAiText(text);
      setLoading(false);
    }, 1200);
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header"><div><Eyebrow>04 · INTERPRETATION</Eyebrow><h2 className="view-title-tc">解 讀 之 章</h2></div></header>

      {/* 第一部分：先單張牌顯示細節 */}
      <div style={{ marginBottom: 60 }}>
        <Eyebrow>STEP 01 · 牌 面 觀 照 · INDIVIDUAL INSIGHTS</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 24 }}>
          {result.cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ borderBottom:'1px solid var(--line-dim)', paddingBottom:32, marginBottom:32 }}>
              <div style={{display:'flex', gap:24}}>
                <TarotCard card={c} reversed={c.isReversed} size="sm" />
                <div style={{flex:1}}>
                  <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
                  <h4 style={{fontSize:24, color:'var(--gold)'}}>{c.name} {c.isReversed?'(逆)':'(正)'}</h4>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:16, background:'var(--midnight)', padding:20, borderRadius:8}}>
                    <div style={{opacity: c.isReversed ? 0.3 : 1}}><strong>正位：</strong><br/>{c.upright}</div>
                    <div style={{opacity: c.isReversed ? 1 : 0.3}}><strong>逆位：</strong><br/>{c.reversed}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第二部分：整體總結長文 */}
      <div className="ai-synthesis" style={{background:'var(--void)', border:'1px solid var(--gold)', padding:40}}>
        <div className="ai-synthesis-eyebrow"><span className={loading?"ai-pulse loading":"ai-pulse"}/><Eyebrow>STEP 02 · 運 勢 總 結 · MASTER SYNTHESIS</Eyebrow></div>
        <div className="ai-synthesis-body" style={{marginTop:32, lineHeight:2.2, textAlign:'justify'}}>
          {loading ? "星辰之力正在凝聚中，請稍候啟示..." : aiText.split('\n').map((p,i)=><p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="result-actions" style={{display:'flex', justifyContent:'center', gap:16, marginTop:60, paddingBottom:100}}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={() => window.print()}>輸出報告 (PDF)</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
