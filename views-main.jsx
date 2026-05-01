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
const QUESTION_CATEGORIES = [
  {
    id: 'self', label: '自我', en: 'SELF',
    questions: [
      '我此刻最需要看見什麼？',
      '什麼信念正在限制我的發展？',
      '我的靈魂這個月在學習什麼課題？',
      '如何找回內心的平衡？',
      '我現在最需要放下的是什麼？',
    ],
  },
  {
    id: 'love', label: '愛情', en: 'LOVE',
    questions: [
      '這段關係現在處於什麼階段？',
      '是什麼阻礙了我在感情中的前進？',
      '這段關係對我的成長有什麼意義？',
      '我應該如何表達自己的感受？',
      '這份愛值得繼續投入嗎？',
    ],
  },
  {
    id: 'career', label: '事業', en: 'CAREER',
    questions: [
      '目前工作中我最需要注意的是什麼？',
      '轉換跑道的時機到了嗎？',
      '我的職業天賦在哪個方向最能發揮？',
      '與同事或上司的關係如何改善？',
      '這個職業決定的潛在影響是什麼？',
    ],
  },
  {
    id: 'wealth', label: '財運', en: 'WEALTH',
    questions: [
      '目前財務狀況有哪些我忽略的風險？',
      '這項投資是否適合現在的我？',
      '如何改善我與金錢的關係？',
      '吸引財富最需要調整的心態是什麼？',
      '短期財務壓力的根源在哪裡？',
    ],
  },
  {
    id: 'wellness', label: '身心靈', en: 'WELLNESS',
    questions: [
      '我的身體現在最需要什麼？',
      '近期情緒波動的深層原因是什麼？',
      '哪種靈性練習最適合我現在的狀態？',
      '我需要放下什麼才能獲得平靜？',
      '下一步靈性成長的方向是什麼？',
    ],
  },
  {
    id: 'social', label: '人際', en: 'SOCIAL',
    questions: [
      '這段友誼的真實樣貌是什麼？',
      '如何修復受損的關係？',
      '我在這段關係中扮演什麼角色？',
      '是否該結束這段關係？',
      '如何建立更深層的連結？',
    ],
  },
];

function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS(spread ? 'question' : 'no-spread');
  const [question, setQuestion] = uS('');
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const [selectedCat, setSelectedCat] = uS('self');
  const fanCount = 22;

  const handleStopShuffle = () => {
    setDrawn(drawCards(fanCount, Date.now()));
    setStep('cut');
  };

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
              <div className="question-cat-panel">
                <div className="question-cats">
                  {QUESTION_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`question-cat-btn ${selectedCat === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat.id)}
                    >
                      <span className="question-cat-label">{cat.label}</span>
                      <span className="question-cat-en">{cat.en}</span>
                    </button>
                  ))}
                </div>
                <div className="question-sublist">
                  {QUESTION_CATEGORIES.find(c => c.id === selectedCat)?.questions.map(q => (
                    <button
                      key={q}
                      className={`question-subitem ${question === q ? 'active' : ''}`}
                      onClick={() => setQuestion(q)}
                    >
                      <span className="question-subitem-arrow">→</span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'shuffle' && (
        <div className="reading-stage">
          <div className="shuffle-stage">
            <div className="shuffle-question">「{question}」</div>
            <div className="shuffle-status">SHUFFLING · 洗牌中 · 靜心呼吸，準備好時停下</div>
            <div className="shuffle-deck">
              {[0,1,2,3,4,5].map((i) => <div key={i} className="shuffle-card" />)}
            </div>
            <button className="btn-primary" style={{ marginTop: 48 }} onClick={handleStopShuffle}>
              停止洗牌 · 已準備好 →
            </button>
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
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const angle = ((i - (total - 1) / 2) / total) * (isMobile ? 50 : 60);
                const offsetX = ((i - (total - 1) / 2) / total) * (isMobile ? 280 : 900);
                const isPicked = picked.includes(i);
                return (
                  <div
                    key={i}
                    className={`fan-card-wrap ${isPicked ? 'picked' : ''}`}
                    style={{
                      '--rot': `rotate(${angle}deg) translateX(${offsetX}px)`,
                      transform: isPicked
                        ? `translateY(-72px) rotate(${angle}deg) translateX(${offsetX}px)`
                        : `rotate(${angle}deg) translateX(${offsetX}px)`,
                      zIndex: isPicked ? 50 + i : i,
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
      <TarotCard card={card} reversed={card.isReversed} size={size} />
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

  // 靜態解讀（無 API Key 時的備用）
  const staticSynthesis = uM(() => {
    const dominant = cards[0];
    const last = cards[cards.length - 1];
    const reversedCount = cards.filter((c) => c.isReversed).length;
    const midCards = cards.slice(1, -1);

    const p1 = `針對「${question}」，牌陣以「${dominant.name}」${dominant.isReversed ? '（逆位）' : '（正位）'}開場。在「${spread.positions[0].name}」這個位置，它揭示了${spread.positions[0].meaning}。${dominant.isReversed ? `逆位的能量暗示你對這件事的感受仍在向內收縮——有些想法或情緒尚未被承認，但它們就在那裡。` : `正位能量清晰可辨，指出你已具備面對「${question}」的內在資源，只是還沒有充分調動它。`}`;

    const p2 = cards.length > 1
      ? `${midCards.length > 0 ? `中間的牌——${midCards.map((c, idx) => `「${c.name}」（${spread.positions[idx + 1].name}）`).join('、')}——共同說明了：` : ''}${reversedCount > 0 ? `有 ${reversedCount} 股能量仍是潛伏、尚未顯化的狀態。這通常意味著你的內心比外在行動更早知道答案，只是還在等待一個被看見的時機。` : '整體能量是流動且向外的，沒有明顯的阻礙。這是一個採取行動的好時機，牌給出的是背書，不是警告。'}`
      : `${reversedCount > 0 ? '逆位的出現提醒你，關於「' + question + '」的答案，需要往內探尋，而非急著在外界尋求確認。' : '正位能量顯示你與這個問題的關係是清明的，你已比自己以為的更準備好了。'}`;

    const p3 = `最終，「${last.name}」在「${spread.positions[spread.positions.length - 1].name}」位收束。針對「${question}」，這張牌指出：${last.isReversed ? `此刻還不是最終答案的時刻——「${last.keywords[0]}」的主題在你生命中仍有尚未完成的功課，需要再多一點耐心與誠實。` : `「${last.keywords[0]}」與「${last.keywords[1] || last.element}」是你前進的關鍵字。方向已在牌中清楚呈現，缺少的只是你邁出的那一步。`}`;

    const p4 = `*塔羅不是算命。它是一面鏡子——把你對「${question}」的答案，從潛意識層照進意識裡。你問對了問題，就已經走了一半。*`;

    return [p1, p2, p3, p4];
  }, [cards, question, spread]);

  // AI 解讀
  const [aiSynthesis, setAiSynthesis] = uS(null);
  const [isLoading, setIsLoading] = uS(false);

  uE(() => {
    const apiKey = localStorage.getItem('tarot_claude_key') || '';
    if (!apiKey) return;

    setIsLoading(true);
    setAiSynthesis(null);

    const cardLines = cards.map((c, i) =>
      `位置${i + 1}「${spread.positions[i].name}」（${spread.positions[i].meaning}）\n` +
      `牌：${c.name}（${c.isReversed ? '逆位' : '正位'}）\n` +
      `牌義：${c.isReversed ? c.reversed : c.upright}`
    ).join('\n\n');

    const prompt =
      `你是一位精通塔羅的解讀師。\n\n` +
      `【使用者的問題】\n${question}\n\n` +
      `【牌陣】${spread.name}\n\n` +
      `【抽到的牌】\n${cardLines}\n\n` +
      `請寫 4 段解讀（每段 80-120 字），用繁體中文，風格神秘詩意，` +
      `但每段都必須具體回應「${question}」這個問題：\n` +
      `第1段：第一張牌如何呼應問題核心\n` +
      `第2段：中間牌的能量流動（單張牌陣則深入探討這張牌）\n` +
      `第3段：最後一張牌的指引方向\n` +
      `第4段：整合所有牌，給出針對問題的具體建議\n\n` +
      `直接輸出4段文字，段落間空一行，不加標題或符號。`;

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error.message);
        const text = data.content?.[0]?.text || '';
        setAiSynthesis(text.split('\n\n').filter((p) => p.trim()));
      })
      .catch((err) => {
        setAiSynthesis([`AI 解讀失敗：${err.message || '請確認 API Key 是否正確'}`]);
      })
      .finally(() => setIsLoading(false));
  }, [cards, question, spread]);

  const synthesis = aiSynthesis || staticSynthesis;

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
          <div>{cards.filter((c) => c.isReversed).length} REVERSED</div>
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
          {isLoading ? (
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--mono)', letterSpacing: '0.2em', fontSize: 13 }}>
              ✦ &nbsp;星象推演中，請稍候…
            </p>
          ) : (
            synthesis.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: 56 }}>
        <Eyebrow>逐張解讀 · CARD BY CARD</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 32 }}>
          {cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ display: 'flex', gap: 32 }}>
              <TarotCard card={c} reversed={c.isReversed} size="sm" />
              <div style={{ flex: 1 }}>
                <div className="interp-pos-tag">{String(i + 1).padStart(2, '0')} · {spread.positions[i].name}</div>
                <h4 className="interp-card-name">{c.name}</h4>
                <div className="interp-card-en">{c.en}</div>
                <div className={`interp-card-orient ${c.isReversed ? 'reversed' : ''}`}>
                  {c.isReversed ? 'REVERSED · 逆位' : 'UPRIGHT · 正位'} · {c.element} · {c.planet}
                </div>
                <div className="interp-keywords">
                  {c.keywords.map((k) => <span key={k} className="interp-kw">{k}</span>)}
                </div>
                <p className="interp-text">
                  <strong style={{ color: 'var(--gold)', fontWeight: 500 }}>位置含義 — </strong>
                  {spread.positions[i].meaning}。
                </p>
                <p className="interp-text">
                  {c.isReversed ? c.reversed : c.upright}
                  {c.isReversed && <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>（能量內收，需向內觀照）</em>}
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
