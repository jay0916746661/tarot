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
            <button className="btn-primary" onClick={() => onNav('spreads')}>
              開始一次占卜 · Begin →
            </button>
            <button className="btn-ghost" onClick={() => onNav('daily')}>
              今日之牌
            </button>
            <span className="home-actions-meta">{time} · TPE</span>
          </div>

          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-num">78</div>
              <div className="home-stat-label">CARDS</div>
              <div className="home-stat-tc">完整牌庫</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-num">06</div>
              <div className="home-stat-label">SPREADS</div>
              <div className="home-stat-tc">經典牌陣</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-num">24</div>
              <div className="home-stat-label">SESSIONS</div>
              <div className="home-stat-tc">本月占卜</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-num">∞</div>
              <div className="home-stat-label">INSIGHTS</div>
              <div className="home-stat-tc">無盡啟示</div>
            </div>
          </div>
        </div>

        <div className="home-altar">
          <div className="home-altar-compass">
            <AstroCompass size={520} opacity={0.35} />
          </div>
          <div className="home-altar-card">
            {feature && <TarotCard card={feature} reversed={feature.reversed} size="xl" />}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 80 }}>
        <Eyebrow>本月召喚 · THIS MOON CYCLE</Eyebrow>
        <div style={{
          marginTop: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--line-dim)',
          border: '1px solid var(--line-dim)',
        }}>
          {[
            { tc: '提問之術', en: 'The Art of Asking', body: '一個好問題比答案珍貴。學習如何向牌堆發問。', tag: 'GUIDE' },
            { tc: '逆位之意', en: 'On Reversals', body: '逆位不是壞牌——它是同一能量的內向版本。', tag: 'STUDY' },
            { tc: '元素對話', en: 'Elemental Dialog', body: '火、水、風、土在你的牌陣中如何對話？', tag: 'DEEP' },
          ].map((it, i) => (
            <div key={i} style={{ background: 'var(--midnight)', padding: 32, cursor: 'pointer' }} onClick={() => onNav('codex')}>
              <Eyebrow>{it.tag}</Eyebrow>
              <div style={{ fontFamily: 'var(--tc)', fontSize: 24, marginTop: 16, letterSpacing: '0.1em', color: 'var(--parchment)' }}>{it.tc}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', marginTop: 4 }}>{it.en}</div>
              <div style={{ fontFamily: 'var(--tc)', fontSize: 14, lineHeight: 1.8, color: 'var(--mist)', marginTop: 20 }}>{it.body}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: '0.25em', marginTop: 32 }}>READ →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────── SPREADS ─────────────────────
function SpreadMini({ layout, count }) {
  const arrange = (() => {
    if (layout === 'single') return [{ x: 0, y: 0 }];
    if (layout === 'three') return [{ x: -32, y: 0 }, { x: 0, y: 0 }, { x: 32, y: 0 }];
    if (layout === 'celtic') return [
      { x: 0, y: 0 }, { x: 0, y: 0, rot: 90 },
      { x: 0, y: 30 }, { x: -34, y: 0 }, { x: 0, y: -30 }, { x: 34, y: 0 },
      { x: 60, y: 30 }, { x: 60, y: 10 }, { x: 60, y: -10 }, { x: 60, y: -30 },
    ];
    if (layout === 'relation') return [
      { x: -50, y: 0 }, { x: 50, y: 0 },
      { x: 0, y: -22 }, { x: 0, y: 0 }, { x: 0, y: 22 },
    ];
    if (layout === 'horseshoe') return [
      { x: -56, y: 18 }, { x: -36, y: 0 }, { x: -16, y: -12 }, { x: 0, y: -16 },
      { x: 16, y: -12 }, { x: 36, y: 0 }, { x: 56, y: 18 },
    ];
    return [];
  })();
  return (
    <div className="spread-mini">
      {arrange.map((p, i) => (
        <div key={i} className="mini-card" style={{
          position: 'absolute',
          transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot || 0}deg)`,
        }} />
      ))}
    </div>
  );
}

function SpreadsView({ onNav, onSelectSpread }) {
  const [picked, setPicked] = uS(null);
  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>02 · CHOOSE YOUR ARRAY</Eyebrow>
          <h2 className="view-title-tc">擇 一 牌 陣</h2>
          <div className="view-title-en">Six configurations of inquiry</div>
        </div>
        <div className="view-header-meta">
          <div>06 SPREADS AVAILABLE</div>
          <div>FROM 1 → 10 CARDS</div>
        </div>
      </header>

      <div className="spreads-grid">
        {SPREADS.map((s, i) => (
          <div key={s.id}
            className={`spread-cell ${picked === s.id ? 'selected' : ''}`}
            onClick={() => setPicked(s.id)}
            onDoubleClick={() => { onSelectSpread(s); onNav('reading'); }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="spread-num">{String(i + 1).padStart(2, '0')} / 06</div>
              <div className="spread-num" style={{ color: 'var(--mist)' }}>
                {'◆'.repeat(s.difficulty)}{'◇'.repeat(5 - s.difficulty)}
              </div>
            </div>
            <SpreadMini layout={s.layout} count={s.count} />
            <div className="spread-cell-title">{s.name}</div>
            <div className="spread-cell-en">{s.en}</div>
            <p className="spread-cell-desc">{s.description}</p>
            <div className="spread-cell-meta">
              <span className="spread-cell-stat">{s.count} CARDS · {s.duration}</span>
              {picked === s.id && (
                <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); onSelectSpread(s); onNav('reading'); }}>
                  選擇 →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--mist)', textAlign: 'center', textTransform: 'uppercase' }}>
        TIP · 點擊選擇 · 雙擊直接開始
      </div>
    </div>
  );
}

// ───────────────────── READING (流程) ─────────────────────
function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS(spread ? 'question' : 'no-spread');
  const [question, setQuestion] = uS('');
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const fanCount = 22;

  uE(() => {
    if (step === 'shuffle') {
      const t = setTimeout(() => {
        setDrawn(drawCards(fanCount, Date.now()));
        setStep('cut');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCut = () => {
    setDrawn(prev => {
      const pivot = Math.floor(Math.random() * prev.length);
      return [...prev.slice(pivot), ...prev.slice(0, pivot)];
    });
    setStep('pick');
  };

  if (!spread) {
    return (
      <div className="view-container fade-in">
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <Eyebrow>PLEASE SELECT A SPREAD</Eyebrow>
          <h2 className="view-title-tc" style={{ marginTop: 24 }}>請先選擇牌陣</h2>
          <button className="btn-primary" style={{ marginTop: 32 }} onClick={() => onNav('spreads')}>前往牌陣 →</button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'question', label: '提問', en: 'Inquire' },
    { id: 'shuffle',  label: '洗牌', en: 'Shuffle' },
    { id: 'cut',      label: '切牌', en: 'Cut' },
    { id: 'pick',     label: '擇牌', en: 'Choose' },
    { id: 'reveal',   label: '揭曉', en: 'Reveal' },
  ];
  const stepIdx = steps.findIndex((s) => s.id === step);

  const togglePick = (idx) => {
    if (picked.includes(idx)) {
      setPicked(picked.filter((p) => p !== idx));
    } else if (picked.length < spread.count) {
      const next = [...picked, idx];
      setPicked(next);
      if (next.length === spread.count) {
        setTimeout(() => {
          const finalCards = next.map((i) => drawn[i]);
          onComplete({ spread, question, cards: finalCards, ts: Date.now() });
        }, 800);
      }
    }
  };

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>03 · THE RITUAL</Eyebrow>
          <h2 className="view-title-tc">儀 式 進 行</h2>
          <div className="view-title-en">{spread.name} · {spread.en}</div>
        </div>
        <div className="view-header-meta">
          <div>{spread.count} CARDS</div>
          <div>{spread.duration}</div>
        </div>
      </header>

      <div className="ritual-step-indicator">
        {steps.map((s, i) => (
          <div key={s.id} className={`ritual-step ${stepIdx === i ? 'active' : ''} ${stepIdx > i ? 'done' : ''}`}>
            <span className="ritual-step-dot" />
            <span>{String(i + 1).padStart(2, '0')} · {s.label} · {s.en}</span>
          </div>
        ))}
      </div>

      {step === 'question' && (
        <div className="reading-stage">
          <div className="question-stage">
            <div>
              <div className="question-prompt-tc">向 牌 堆<br/>提 出 一 個 問 題</div>
              <div className="question-prompt-en">— and the cards will answer.</div>
              <p className="question-hint">問題越具體，啟示越清晰。塔羅不擅長回答「會不會」，</p>
              <p className="question-hint">它擅長回答「為什麼」、「如何」、「現在」。</p>
              <button
                className="btn-primary"
                style={{ marginTop: 40 }}
                disabled={!question.trim()}
                onClick={() => setStep('shuffle')}
              >
                確認問題 · 進入洗牌 →
              </button>
            </div>
            <div>
              <div className="question-input-wrap">
                <Eyebrow>YOUR INQUIRY</Eyebrow>
                <textarea
                  className="question-input"
                  placeholder="例如：在這份工作裡，我真正在追尋的是什麼？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, 140))}
                  style={{ marginTop: 16 }}
                />
                <div className="question-counter">
                  <span>{question.length} / 140</span>
                  <span>{spread.name} · {spread.count} CARDS</span>
                </div>
              </div>
              <div className="question-suggestions">
                {[
                  '我此刻最需要看見什麼？',
                  '與 ___ 的關係將走向何處？',
                  '這個決定背後我真正在害怕什麼？',
                  '本月我的核心課題是什麼？',
                  '靈魂層面想要對我說什麼？',
                ].map((q) => (
                  <button key={q} className="question-chip" onClick={() => setQuestion(q)}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'shuffle' && (
        <div className="reading-stage">
          <div className="shuffle-stage">
            <div className="shuffle-question">「{question}」</div>
            <div className="shuffle-status">SHUFFLING · 洗牌中 · 請靜心呼吸</div>
            <div className="shuffle-deck">
              {[0,1,2,3,4,5].map((i) => <div key={i} className="shuffle-card" />)}
            </div>
          </div>
        </div>
      )}

      {step === 'cut' && (
        <div className="reading-stage" style={{ textAlign: 'center' }}>
          <Eyebrow>03 · RITUAL CUT · 切 牌 儀 式</Eyebrow>
          <div className="shuffle-question" style={{ marginTop: 24 }}>「{question}」</div>
          <p className="question-hint" style={{ marginTop: 12 }}>點擊牌堆切牌，打破預設的能量排列</p>
          <div
            className="shuffle-deck"
            style={{ cursor: 'pointer', marginTop: 60, display: 'inline-block' }}
            onClick={handleCut}
          >
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className="shuffle-card"
                style={{ animation: 'none', transform: `translateY(${i * -8}px)` }}
              />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.25em',
                       color: 'var(--mist)', marginTop: 48, textTransform: 'uppercase' }}>
            CLICK TO CUT · 點 擊 切 牌
          </p>
        </div>
      )}

      {step === 'pick' && (
        <div className="reading-stage">
          <div className="fan-stage">
            <div className="fan-instruction">「{question}」</div>
            <div className="fan-counter">CHOOSE {spread.count} CARDS · {picked.length} / {spread.count} SELECTED</div>
            <div className="fan-container">
              {drawn.map((_, i) => {
                const total = drawn.length;
                const angle = ((i - (total - 1) / 2) / total) * 60;
                const offsetX = ((i - (total - 1) / 2) / total) * 900;
                return (
                  <div
                    key={i}
                    className={`fan-card-wrap ${picked.includes(i) ? 'picked' : ''}`}
                    style={{
                      '--rot': `rotate(${angle}deg) translateX(${offsetX}px)`,
                      transform: `rotate(${angle}deg) translateX(${offsetX}px)`,
                      zIndex: i,
                    }}
                    onClick={() => togglePick(i)}
                  >
                    <TarotCard faceDown size="sm" />
                  </div>
                );
              })}
            </div>

            <div className="picked-tray">
              {Array.from({ length: spread.count }).map((_, i) => (
                <div key={i} className="picked-slot">
                  <div className="picked-slot-label">{spread.positions[i].name} · {String(i + 1).padStart(2, '0')}</div>
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

// ───────────────────── RESULT 解讀 ─────────────────────
function PositionPlacement({ result }) {
  const { spread, cards } = result;
  const layout = spread.layout;

  if (layout === 'single') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PositionCard idx={0} card={cards[0]} pos={spread.positions[0]} size="lg" />
      </div>
    );
  }
  if (layout === 'three' || layout === 'relation') {
    return (
      <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
        {cards.map((c, i) => (
          <PositionCard key={i} idx={i} card={c} pos={spread.positions[i]} size="md" />
        ))}
      </div>
    );
  }
  if (layout === 'horseshoe') {
    return (
      <div style={{ position: 'relative', height: 420, width: '100%' }}>
        {cards.map((c, i) => {
          const total = cards.length;
          const a = ((i / (total - 1)) - 0.5) * Math.PI * 0.7;
          const x = Math.sin(a) * 320;
          const y = -Math.cos(a) * 90 + 120;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(${x}px, ${y - 200}px)`,
            }}>
              <PositionCard idx={i} card={c} pos={spread.positions[i]} size="sm" />
            </div>
          );
        })}
      </div>
    );
  }
  if (layout === 'celtic') {
    const positions = [
      { x: -100, y: 0 },             // 1 核心
      { x: -100, y: 0, rot: 90 },    // 2 挑戰（橫）
      { x: -100, y: 160 },           // 3 根基
      { x: -260, y: 0 },             // 4 過去
      { x: -100, y: -160 },          // 5 可能
      { x: 60, y: 0 },               // 6 近未來
      { x: 240, y: 220 },            // 7 自我
      { x: 240, y: 80 },             // 8 環境
      { x: 240, y: -60 },            // 9 希望恐懼
      { x: 240, y: -200 },           // 10 結局
    ];
    return (
      <div style={{ position: 'relative', height: 600, width: '100%' }}>
        {cards.map((c, i) => {
          const p = positions[i];
          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(${p.x}px, ${p.y - 130}px) ${p.rot ? `rotate(${p.rot}deg)` : ''}`,
              zIndex: i === 1 ? 5 : 1,
            }}>
              <PositionCard idx={i} card={c} pos={spread.positions[i]} size="xs" hideLabel />
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

function PositionCard({ idx, card, pos, size, hideLabel }) {
  return (
    <div className="position-card">
      {!hideLabel && (
        <div>
          <div className="position-num">{String(idx + 1).padStart(2, '0')}</div>
          <div className="position-label">{pos.name}</div>
        </div>
      )}
      <TarotCard card={card} reversed={card.reversed} size={size} />
    </div>
  );
}

function ResultView({ result, onNav, onNew }) {
  if (!result) {
    return (
      <div className="view-container fade-in">
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <h2 className="view-title-tc">尚 無 解 讀</h2>
          <button className="btn-primary" style={{ marginTop: 32 }} onClick={() => onNav('spreads')}>開始一次占卜 →</button>
        </div>
      </div>
    );
  }

  const { spread, question, cards, ts } = result;
  const date = new Date(ts);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  // 假 AI 整體解讀
  const synthesis = uM(() => {
    const dominant = cards[0];
    const last = cards[cards.length - 1];
    const reversedCount = cards.filter((c) => c.reversed).length;
    return [
      `從牌面整體浮現的能量來看，這個提問正處於 ${dominant.element} 元素為主導的階段——${dominant.reversed ? '但以內向、潛意識的方式運作' : '以外顯的、可被感知的方式發生'}。`,
      `「${dominant.name}」於起首位現身，意味著 ${dominant.upright.split('。')[0]}。${reversedCount > 0 ? `其中 ${reversedCount} 張為逆位，這提醒你：答案不在你以為的方向，而在你尚未願意直視的角落。` : '所有牌皆為正位，能量是清明且向外流動的。'}`,
      `而最終以「${last.name}」收束——這不是預言，而是一個邀請：當你願意以 ${last.element} 的方式回應，事件將自然走向 ${last.reversed ? '一個需要再次審視的轉折' : '一個明朗的階段'}。`,
      `*記住：牌只是鏡子。它映照的，是你內在已經知道、卻尚未承認的真相。*`,
    ];
  }, [cards]);

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>04 · INTERPRETATION</Eyebrow>
          <h2 className="view-title-tc">解 讀 之 章</h2>
          <div className="view-title-en">A reading from {spread.en}</div>
        </div>
        <div className="view-header-meta">
          <div>{dateStr}</div>
          <div>{spread.name} · {cards.length} CARDS</div>
        </div>
      </header>

      <div className="reading-result-header">
        <Eyebrow>QUESTION</Eyebrow>
        <div className="result-question">{question}</div>
        <div className="result-meta">
          <div>SEED · {String(ts).slice(-6)}</div>
          <div>{cards.filter((c) => c.reversed).length} REVERSED</div>
        </div>
      </div>

      <div className="spread-canvas">
        <div className="spread-canvas-inner" style={{ minHeight: spread.layout === 'celtic' ? 640 : 480 }}>
          <PositionPlacement result={result} />
        </div>
      </div>

      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow">
          <span className="ai-pulse" />
          <Eyebrow>SYNTHESIS · 整體解讀 · ORACLE SPEAKS</Eyebrow>
        </div>
        <h3 className="ai-synthesis-title">當 牌 與 牌 相 遇</h3>
        <div className="ai-synthesis-body">
          {synthesis.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 56 }}>
        <Eyebrow>逐張解讀 · CARD BY CARD</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 32 }}>
          {cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ display: 'flex', gap: 32 }}>
              <TarotCard card={c} reversed={c.reversed} size="sm" />
              <div style={{ flex: 1 }}>
                <div className="interp-pos-tag">{String(i + 1).padStart(2, '0')} · {spread.positions[i].name}</div>
                <h4 className="interp-card-name">{c.name}</h4>
                <div className="interp-card-en">{c.en}</div>
                <div className={`interp-card-orient ${c.reversed ? 'reversed' : ''}`}>
                  {c.reversed ? 'REVERSED · 逆位' : 'UPRIGHT · 正位'} · {c.element} · {c.planet}
                </div>
                <div className="interp-keywords">
                  {c.keywords.map((k) => <span key={k} className="interp-kw">{k}</span>)}
                </div>
                <p className="interp-text">
                  <strong style={{ color: 'var(--gold)', fontWeight: 500 }}>位置含義 — </strong>
                  {spread.positions[i].meaning}。
                </p>
                <p className="interp-text">
                  {c.reversed ? c.reversed === true ? c.upright : c.reversed : c.upright}
                  {c.reversed && <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>（{c.reversed === true ? '能量內收，需向內觀照' : ''}）</em>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={onNew}>新的占卜 · New Reading</button>
        <button className="btn-ghost" onClick={() => onNav('archive')}>儲存至紀錄</button>
        <button className="btn-ghost">輸出 PDF</button>
        <button className="btn-ghost">分享</button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
