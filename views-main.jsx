// ============================================================
// 視圖：首頁、牌陣、占卜、解牌結果、每日、牌義、紀錄
// ============================================================

const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

// ───────────────────── HOME ─────────────────────
function HomeView({ onNav }) {
  const [feature, setFeature] = uS(null);
  uE(() => { setFeature(getDailyCard()); }, []);
  const time = useClock();
  const quickActions = [
    { title: '不知道怎麼問', body: '先用狀態詞推薦牌陣，再幫你整理問題。', action: '用導引開始', nav: 'spreads', primary: true },
    { title: '已經有問題', body: '直接選牌陣、輸入問題、抽牌看結果。', action: '直接占卜', nav: 'spreads' },
    { title: '只想看今天', body: '抽一張今日提醒，不需要完整流程。', action: '今日之牌', nav: 'daily' },
  ];

  return (
    <div className="view-container fade-in">
      <div className="home-hero home-hero-simple">
        <div>
          <div className="home-start-mark">
            <Eyebrow>靈樞 Lumen Arcana · {time} TPE</Eyebrow>
          </div>
          <h1 className="home-title-tc home-title-clear">今天想問什麼？</h1>
          <p className="home-quote home-quote-clear">
            選一個入口就能開始。問題還不清楚也沒關係，我會先幫你整理成適合占卜的問法。
          </p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => onNav('spreads')}>
              開始占卜 →
            </button>
            <button className="btn-ghost" onClick={() => onNav('daily')}>
              今日之牌
            </button>
          </div>

          <div className="home-quick-grid">
            {quickActions.map((item, i) => (
              <button
                key={item.title}
                className={`home-quick-card ${item.primary ? 'primary' : ''}`}
                type="button"
                onClick={() => onNav(item.nav)}
              >
                <span className="home-quick-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
                <em>{item.action} →</em>
              </button>
            ))}
          </div>

          <div className="home-flow">
            {['選入口', '輸入或語音提問', '抽牌看解讀'].map((step, i) => (
              <div key={step} className="home-flow-step">
                <span>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="home-altar">
          <div className="home-altar-compass">
            <AstroCompass size={520} opacity={0.35} />
          </div>
          <div className="home-altar-card">
            {feature && <TarotCard card={feature} reversed={feature.reversed} size="xl" />}
          </div>
          <button className="home-daily-shortcut" type="button" onClick={() => onNav('daily')}>
            今日之牌 · {feature?.name || '抽一張'} →
          </button>
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

const SPREAD_GUIDE_CHIPS = [
  { id: 'quick', label: '只想要一句提醒', weights: { single: 5, three: 1 }, note: '你需要的是一個清楚的當下提示，不必把事情拆太深。' },
  { id: 'trend', label: '想看接下來走向', weights: { three: 5, horseshoe: 2, celtic: 1 }, note: '你正在看時間線，適合用過去、現在、未來把脈絡接起來。' },
  { id: 'choice', label: '正在做決定', weights: { situation: 5, horseshoe: 3, three: 1 }, note: '這題重點是局勢、行動和代價，適合用比較務實的牌陣。' },
  { id: 'relationship', label: '跟某個人有關', weights: { relation: 5, situation: 2, celtic: 1 }, note: '關係題需要看兩個人的位置，也要看中間真正流動的是什麼。' },
  { id: 'messy', label: '很多層糾在一起', weights: { celtic: 5, horseshoe: 3, relation: 1 }, note: '狀況已經不只一件事，深一點的牌陣會比較像把房間燈打開。' },
  { id: 'hidden', label: '感覺有隱情', weights: { horseshoe: 5, celtic: 3, relation: 1 }, note: '你需要看見還沒浮上檯面的因素，而不是只問表面結果。' },
  { id: 'repair', label: '想知道怎麼修復', weights: { situation: 4, relation: 3, three: 1 }, note: '修復題需要看現在能做什麼，答案要落在行動上。' },
  { id: 'spiritual', label: '想深度整理自己', weights: { celtic: 4, horseshoe: 3, single: 1 }, note: '這比較像內在整理，不一定急著要結論，但需要完整看見。' },
];

function getSpreadRecommendation(selectedGuide) {
  const scores = {};
  const notes = [];
  selectedGuide.forEach((id) => {
    const chip = SPREAD_GUIDE_CHIPS.find((item) => item.id === id);
    if (!chip) return;
    notes.push(chip.note);
    Object.entries(chip.weights).forEach(([spreadId, value]) => {
      scores[spreadId] = (scores[spreadId] || 0) + value;
    });
  });
  const ranked = SPREADS
    .map((spread) => ({ spread, score: scores[spread.id] || 0 }))
    .sort((a, b) => b.score - a.score || a.spread.count - b.spread.count);
  const primary = ranked[0]?.score ? ranked[0].spread : SPREADS.find((s) => s.id === 'three');
  const alternate = ranked.find((item) => item.spread.id !== primary.id && item.score > 0)?.spread
    || SPREADS.find((s) => s.id === (primary.id === 'three' ? 'single' : 'three'));
  return {
    primary,
    alternate,
    reason: notes[0] || '如果還說不準，就先用三張牌看整體脈絡，通常最穩。',
  };
}

function SpreadsView({ onNav, onSelectSpread }) {
  const [picked, setPicked] = uS(null);
  const [selectedGuide, setSelectedGuide] = uS([]);
  const recommendation = uM(() => getSpreadRecommendation(selectedGuide), [selectedGuide]);
  const toggleGuide = (chipId) => {
    setSelectedGuide((current) => (
      current.includes(chipId)
        ? current.filter((id) => id !== chipId)
        : [...current, chipId].slice(-3)
    ));
  };
  const startRecommended = (spread) => {
    onSelectSpread(spread);
    onNav('reading');
  };

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

      <div className="spread-guide-panel">
        <div className="spread-guide-copy">
          <Eyebrow>QUESTION GUIDE · 先 感 受 再 選 牌 陣</Eyebrow>
          <h3>不知道該選哪一種，就先說你現在像什麼狀態</h3>
          <p>選 1-3 個最貼近的詞，我會替你推薦牌陣。這比較接近真人占卜師先聽你描述，再決定要怎麼展牌。</p>
        </div>
        <div className="spread-guide-workspace">
          <div className="spread-guide-chips">
            {SPREAD_GUIDE_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`spread-guide-chip ${selectedGuide.includes(chip.id) ? 'active' : ''}`}
                onClick={() => toggleGuide(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="spread-guide-result">
            <div>
              <div className="spread-guide-kicker">RECOMMENDED · {selectedGuide.length || 0} / 3</div>
              <div className="spread-guide-name">{recommendation.primary.name}</div>
              <p>{recommendation.reason}</p>
              <div className="spread-guide-alt">也可以改看：{recommendation.alternate.name} · {recommendation.alternate.count} 張牌</div>
            </div>
            <div className="spread-guide-actions">
              <button className="btn-primary" onClick={() => startRecommended(recommendation.primary)}>
                用推薦牌陣開始 →
              </button>
              <button className="btn-ghost" onClick={() => startRecommended(recommendation.alternate)}>
                改用替代牌陣
              </button>
            </div>
          </div>
        </div>
      </div>

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

const PENDING_QUESTION_KEY = 'lumen_pending_question_v1';

const GUIDE_CHIPS = [
  { id: 'unclear', label: '很模糊', category: 'self', tone: 'gentle', prompt: '我現在說不清楚，但心裡一直卡住的事情是什麼？' },
  { id: 'choice', label: '要做選擇', category: 'self', tone: 'practical', prompt: '面對這個選擇，我真正需要看清的代價是什麼？' },
  { id: 'love_wait', label: '感情卡住', category: 'love', tone: 'gentle', prompt: '這段關係現在卡住的真正原因是什麼？' },
  { id: 'need_action', label: '想知道下一步', category: 'self', tone: 'practical', prompt: '我現在最適合採取的第一個小行動是什麼？' },
  { id: 'truth', label: '想聽真話', category: 'self', tone: 'direct', prompt: '這件事裡，我最不想承認但需要面對的真相是什麼？' },
  { id: 'career_shift', label: '工作迷惘', category: 'career', tone: 'practical', prompt: '目前工作裡，我該繼續投入還是調整方向？' },
  { id: 'anxiety', label: '很焦慮', category: 'wellness', tone: 'gentle', prompt: '我的焦慮真正想提醒我什麼？' },
  { id: 'boundary', label: '界線問題', category: 'social', tone: 'direct', prompt: '這段互動裡，我需要重新設定什麼界線？' },
];

function loadPendingQuestion() {
  try {
    const pending = localStorage.getItem(PENDING_QUESTION_KEY) || '';
    if (pending) localStorage.removeItem(PENDING_QUESTION_KEY);
    return pending;
  } catch (err) {
    return '';
  }
}

function ReadingView({ spread, onComplete, onNav }) {
  const [step, setStep] = uS(spread ? 'question' : 'no-spread');
  const [question, setQuestion] = uS(loadPendingQuestion);
  const [drawn, setDrawn] = uS([]);
  const [picked, setPicked] = uS([]);
  const [revealedCards, setRevealedCards] = uS([]);
  const [selectedCat, setSelectedCat] = uS('self');
  const [guidePicked, setGuidePicked] = uS([]);
  const [isListening, setIsListening] = uS(false);
  const [voiceStatus, setVoiceStatus] = uS('idle');
  const [readingTone, setReadingTone] = uS('gentle');
  const recognitionRef = uR(null);
  const fanCount = 22;
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

  uE(() => () => recognitionRef.current?.stop(), []);

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      setVoiceStatus('unsupported');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceStatus('stopped');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    let finalTranscript = question.trim();

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('listening');
    };
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          finalTranscript = `${finalTranscript} ${transcript}`.trim();
        } else {
          interim = transcript;
        }
      }
      setQuestion(`${finalTranscript}${interim ? ` ${interim}` : ''}`.slice(0, 140));
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceStatus(event.error === 'not-allowed' ? 'denied' : 'error');
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceStatus((current) => current === 'listening' ? 'stopped' : current);
    };
    recognition.start();
  };

  const downloadQuestionText = () => {
    if (!question.trim()) return;
    const blob = new Blob([question.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumen-inquiry-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const guideSuggestions = uM(() => {
    const pickedItems = guidePicked.map((id) => GUIDE_CHIPS.find((item) => item.id === id)).filter(Boolean);
    const baseQuestions = QUESTION_CATEGORIES.find((c) => c.id === selectedCat)?.questions || [];
    const prompts = pickedItems.map((item) => item.prompt);
    return [...new Set([...prompts, ...baseQuestions])].slice(0, 3);
  }, [guidePicked, selectedCat]);

  const toggleGuideChip = (chip) => {
    setGuidePicked((current) => {
      const exists = current.includes(chip.id);
      const next = exists ? current.filter((id) => id !== chip.id) : [...current, chip.id].slice(-3);
      if (!exists) {
        setSelectedCat(chip.category);
        setReadingTone(chip.tone);
        if (!question.trim()) setQuestion(chip.prompt);
      }
      return next;
    });
  };

  const voiceStatusText = {
    idle: '語音輸入會自動轉成提問文字',
    listening: '正在聆聽，說完可再點一次停止',
    stopped: '語音已轉入文字，可再修一下句子',
    unsupported: '此瀏覽器不支援語音辨識，GitHub Pages HTTPS 上較穩定',
    denied: '麥克風權限被拒絕，請在瀏覽器允許麥克風',
    error: '語音辨識暫時失敗，請再試一次',
  };

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
        const finalCards = next.map((i) => drawn[i]);
        setRevealedCards(finalCards);
        setStep('reveal');
        setTimeout(() => {
          onComplete({ spread, question, category: selectedCat, readingTone, cards: finalCards, ts: Date.now() });
        }, 1800);
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
                <div className="voice-tools">
                  <button
                    className={`voice-tool-btn ${isListening ? 'active' : ''}`}
                    onClick={handleVoiceInput}
                    type="button"
                  >
                    {isListening ? '停止錄音' : '語音提問'}
                  </button>
                  <button
                    className="voice-tool-btn"
                    onClick={downloadQuestionText}
                    disabled={!question.trim()}
                    type="button"
                  >
                    下載文字檔
                  </button>
                  <span className="voice-tool-status">{voiceStatusText[voiceStatus]}</span>
                </div>
                <div className="guided-question-panel">
                  <div className="guided-question-head">
                    <div>
                      <div className="guided-question-label">導引式提問 · AI QUESTION GUIDE</div>
                      <p>先選 1-3 個現在最像你的狀態，我會幫你把問題整理成比較能被牌回應的句子。</p>
                    </div>
                    <div className="guided-question-count">{guidePicked.length} / 3</div>
                  </div>
                  <div className="guided-chip-list">
                    {GUIDE_CHIPS.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className={`guided-chip ${guidePicked.includes(chip.id) ? 'active' : ''}`}
                        onClick={() => toggleGuideChip(chip)}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  <div className="guided-suggestion-list">
                    {guideSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`guided-suggestion ${question === item ? 'active' : ''}`}
                        onClick={() => setQuestion(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="question-cat-panel">
                <div className="question-tone-panel">
                  <div className="question-tone-label">解讀語氣 · READING TONE</div>
                  <div className="question-tone-options">
                    {Object.entries(READING_TONES).map(([id, tone]) => (
                      <button
                        key={id}
                        type="button"
                        className={`question-tone-btn ${readingTone === id ? 'active' : ''}`}
                        onClick={() => setReadingTone(id)}
                      >
                        <span>{tone.label}</span>
                        <small>{tone.en}</small>
                      </button>
                    ))}
                  </div>
                </div>
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

      {step === 'reveal' && (
        <div className="reading-stage">
          <div className="reveal-stage">
            <Eyebrow>04 · REVEAL · 揭 牌</Eyebrow>
            <div className="reveal-question">「{question}」</div>
            <div className="reveal-grid" style={{ '--reveal-count': revealedCards.length }}>
              {revealedCards.map((card, i) => (
                <div key={`${card.num}-${i}`} className="reveal-card-wrap" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="reveal-position">{String(i + 1).padStart(2, '0')} · {spread.positions[i].name}</div>
                  <TarotCard card={card} reversed={card.isReversed} size={revealedCards.length > 5 ? 'xs' : 'sm'} />
                </div>
              ))}
            </div>
            <div className="reveal-status">READING THE PATTERN · 牌義正在交會</div>
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
  const staticSynthesis = uM(() => buildHumanSynthesis(result), [result]);
  const questionMirror = uM(() => buildQuestionMirror(result), [result]);
  const followUps = uM(() => buildFollowUpQuestions(result), [result]);
  const actionSteps = uM(() => buildActionSteps(result), [result]);
  const choicePaths = uM(() => buildChoicePaths(result), [result]);
  const savedResultRef = uR(null);

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
      `請寫 5 段解讀（每段 70-110 字），用繁體中文，像真人塔羅師口語說明，` +
      `但每段都必須具體回應「${question}」這個問題：\n` +
      `第1段：先把這個問題翻成白話，說明使用者真正想確認的是什麼\n` +
      `第2段：第一張牌如何貼到使用者的現況，必須引用問題中的人、事或選擇\n` +
      `第3段：中間牌的能量流動（單張牌陣則深入探討這張牌），要說明現況如何形成\n` +
      `第4段：最後一張牌的指引方向，要說清楚如果照目前做法會怎麼走\n` +
      `第5段：給出非常具體、可執行、像人會說的建議，包含今天可以做的一件事\n\n` +
      `請避免教科書式牌義，不要說空泛的「宇宙能量」，不要只列關鍵字。每段至少一次回扣使用者問題的具體情境，直接輸出5段文字，段落間空一行，不加標題或符號。`;

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
  const [saveState, setSaveState] = uS('idle');
  const [availableVoices, setAvailableVoices] = uS([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = uS('');
  const [isSpeaking, setIsSpeaking] = uS(false);

  const readingVoiceText = [
    `你的問題是：${question}`,
    `這次使用${spread.name}。`,
    ...synthesis.map((p) => p.replace(/\*(.+?)\*/g, '$1').replace(/<[^>]*>/g, '')),
    `接下來有三條可能路線。`,
    ...choicePaths.map((path) => `${path.title}：${path.body}${path.risk}`),
  ].join('\n\n');

  uE(() => {
    if (!('speechSynthesis' in window)) return;

    const scoreVoice = (voice) => {
      const haystack = `${voice.name} ${voice.lang}`.toLowerCase();
      let score = 0;
      if (/zh[-_](tw|hant)/i.test(voice.lang)) score += 80;
      if (/zh/i.test(voice.lang)) score += 40;
      if (/siri|premium|enhanced|natural|mei|jia|ting|sin|yue|han/i.test(haystack)) score += 25;
      if (voice.localService) score += 8;
      if (/google|compact|default/i.test(haystack)) score -= 6;
      return score;
    };

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const zhVoices = voices
        .filter((voice) => /zh|cmn|yue/i.test(`${voice.lang} ${voice.name}`))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
      const next = zhVoices.length ? zhVoices : voices;
      setAvailableVoices(next);
      setSelectedVoiceURI((current) => current || next[0]?.voiceURI || '');
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const shareText = [
    `靈樞 Lumen Arcana · ${spread.name}`,
    `問題：${question}`,
    `牌：${cards.map((c, i) => `${spread.positions[i].name} ${c.name}${c.isReversed ? '（逆位）' : ''}`).join(' / ')}`,
    `摘要：${synthesis[0]?.replace(/<[^>]*>/g, '') || ''}`,
  ].join('\n');

  const handleSave = () => {
    try {
      saveReadingHistory(result);
      savedResultRef.current = result.ts;
      setSaveState('saved');
    } catch (err) {
      console.error(err);
      setSaveState('error');
    }
  };

  uE(() => {
    if (!result?.ts || savedResultRef.current === result.ts) return;
    try {
      saveReadingHistory(result);
      savedResultRef.current = result.ts;
      setSaveState('auto-saved');
    } catch (err) {
      console.error(err);
    }
  }, [result]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: '靈樞塔羅解讀', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      setSaveState('shared');
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        setSaveState('share-error');
      }
    }
  };

  const handleQueueFollowUp = async (item) => {
    try {
      localStorage.setItem(PENDING_QUESTION_KEY, item);
      await navigator.clipboard?.writeText(item);
    } catch (err) {
      console.warn('Unable to queue follow-up question', err);
    }
    setSaveState('queued-question');
    onNav('spreads');
    window.scrollTo(0, 0);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(readingVoiceText);
    const voice = availableVoices.find((item) => item.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'zh-TW';
    utterance.rate = 0.86;
    utterance.pitch = 0.96;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

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

      <div className="question-mirror-panel">
        <div>
          <Eyebrow>QUESTION MIRROR · 先 把 問 題 看 準</Eyebrow>
          <div className="question-mirror-title">這次不是先講牌義，而是先確認你真正想問什麼</div>
        </div>
        <div className="question-mirror-grid">
          {questionMirror.map((item, i) => (
            <div key={item.title} className="question-mirror-card">
              <div className="question-mirror-num">{String(i + 1).padStart(2, '0')}</div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow">
          <span className="ai-pulse" />
          <Eyebrow>SYNTHESIS · 整體解讀 · ORACLE SPEAKS</Eyebrow>
        </div>
        <h3 className="ai-synthesis-title">當 牌 與 牌 相 遇</h3>
        <div className="synthesis-quick-actions">
          <button className="btn-ghost" onClick={handleSpeak}>
            {isSpeaking ? '停止朗讀' : '懶人聽重點'}
          </button>
          <span>{availableVoices.find((voice) => voice.voiceURI === selectedVoiceURI)?.name || '使用系統中文語音'}</span>
        </div>
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

      <div className="action-plan-panel">
        <div>
          <Eyebrow>ACTION · 這 次 要 做 的 事</Eyebrow>
          <div className="action-plan-title">不要只停在解讀，把牌落到生活裡</div>
        </div>
        <div className="action-plan-grid">
          {actionSteps.map((step, i) => (
            <div key={step.title} className="action-plan-card">
              <div className="action-plan-num">{String(i + 1).padStart(2, '0')}</div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="choice-path-panel">
        <div>
          <Eyebrow>RELATIVE PATHS · 相 對 可 能</Eyebrow>
          <div className="choice-path-title">不是命定答案，而是三種走法</div>
          <p className="choice-path-note">
            同一副牌會因為你的行動而改變意義。這裡把它翻成三條路線，讓你比較哪一條最接近你真正想成為的狀態。
          </p>
        </div>
        <div className="choice-path-grid">
          {choicePaths.map((path) => (
            <div key={path.tag} className="choice-path-card">
              <div className="choice-path-tag">{path.tag}</div>
              <h4>{path.title}</h4>
              <p>{path.body}</p>
              <div className="choice-path-risk">{path.risk}</div>
            </div>
          ))}
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
                <p className="interp-text interp-human">
                  <strong style={{ color: 'var(--gold)', fontWeight: 500 }}>針對你的問題 — </strong>
                  {buildHumanCardReading(c, spread.positions[i], question, inferQuestionContext(question, result.category))}
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

      <div className="voice-readout-panel">
        <div>
          <Eyebrow>VOICE · 語 音 朗 讀</Eyebrow>
          <div className="voice-readout-title">讓解讀用較自然的中文聲音唸出來</div>
          <p className="voice-readout-note">
            會優先使用你裝置裡的中文高品質語音；若覺得太機械，可在 macOS 系統設定下載更自然的 Siri / 中文語音。
          </p>
        </div>
        <div className="voice-readout-controls">
          <select
            className="voice-select"
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            disabled={!availableVoices.length || isSpeaking}
          >
            {availableVoices.length ? (
              availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} · {voice.lang}
                </option>
              ))
            ) : (
              <option>系統尚未提供可用語音</option>
            )}
          </select>
          <button className="btn-primary" onClick={handleSpeak}>
            {isSpeaking ? '停止朗讀' : '朗讀解讀'}
          </button>
        </div>
      </div>

      <div className="followup-panel">
        <div>
          <Eyebrow>FOLLOW-UP · 追 問 建 議</Eyebrow>
          <div className="followup-title">如果要讓下一次解讀更準，可以接著問</div>
        </div>
        <div className="followup-list">
          {followUps.map((item) => (
            <button
              key={item}
              className="followup-chip"
              onClick={() => handleQueueFollowUp(item)}
            >
              {item}
              <span>帶入下一次占卜 →</span>
            </button>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={onNew}>新的占卜 · New Reading</button>
        <button className="btn-ghost" onClick={handleSave}>
          {saveState === 'auto-saved' ? '已自動紀錄' : saveState === 'saved' ? '已儲存至紀錄' : saveState === 'error' ? '儲存失敗' : '儲存至紀錄'}
        </button>
        <button className="btn-ghost" onClick={() => onNav('archive')}>查看紀錄</button>
        <button className="btn-ghost" onClick={() => window.print()}>輸出 PDF</button>
        <button className="btn-ghost" onClick={handleShare}>
          {saveState === 'shared' ? '已複製 / 分享' : saveState === 'queued-question' ? '已帶入追問' : saveState === 'share-error' ? '分享失敗' : '分享'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, SpreadsView, ReadingView, ResultView });
