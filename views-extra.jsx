// ============================================================
// 視圖 (續)：每日、牌義百科、歷史紀錄
// ============================================================

const { useState: uS2, useEffect: uE2, useMemo: uM2 } = React;

// ───────────────────── DAILY ─────────────────────
function DailyView({ onNav }) {
  const [card, setCard] = uS2(null);
  const [revealed, setRevealed] = uS2(false);

  uE2(() => { setCard(getDailyCard()); }, []);

  const today = new Date();
  const dateStr = `${today.getFullYear()} · ${String(today.getMonth() + 1).padStart(2, '0')} · ${String(today.getDate()).padStart(2, '0')}`;
  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][today.getDay()];
  const weekdayTC = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()];

  if (!card) return null;

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>05 · CARD OF THE DAY</Eyebrow>
          <h2 className="view-title-tc">每 日 一 牌</h2>
          <div className="view-title-en">A single card to walk with you today</div>
        </div>
        <div className="view-header-meta">
          <div>{dateStr}</div>
          <div>{weekday} · 星期{weekdayTC}</div>
        </div>
      </header>

      <div className="daily-stage">
        <div>
          <div className="daily-date">{dateStr} · {weekday}</div>
          {revealed ? (
            <>
              <h3 className="daily-title-tc">{card.name}</h3>
              <div className="daily-title-en">{card.en}</div>
              <div className="daily-keywords">
                {card.keywords.map((k) => <span key={k} className="interp-kw">{k}</span>)}
              </div>
              <div className="daily-divider" />
              <p className="daily-summary">
                {card.reversed ? '（逆位）' : ''}{card.upright}
              </p>
              <p className="daily-story">{card.story}</p>

              <div className="daily-meta-grid">
                <div className="daily-meta-cell">
                  <div className="daily-meta-label">ELEMENT</div>
                  <div className="daily-meta-value">{card.element}</div>
                </div>
                <div className="daily-meta-cell">
                  <div className="daily-meta-label">RULER</div>
                  <div className="daily-meta-value">{card.planet}</div>
                </div>
                <div className="daily-meta-cell">
                  <div className="daily-meta-label">ORIENT</div>
                  <div className="daily-meta-value">{card.reversed ? '逆位' : '正位'}</div>
                </div>
              </div>

              <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
                <button className="btn-primary" onClick={() => onNav('spreads')}>展開深度占卜 →</button>
                <button className="btn-ghost" onClick={() => onNav('codex')}>於牌義中查閱</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="daily-title-tc">今 日<br/>之 牌</h3>
              <div className="daily-title-en">— what walks beside you today.</div>
              <p className="daily-summary" style={{ marginTop: 32 }}>
                每一天都有一張屬於你的牌。<br/>
                它不預言今日的事件，而是低語：<br/>
                「以這個能量去過今天。」
              </p>
              <button className="btn-primary" style={{ marginTop: 40 }} onClick={() => setRevealed(true)}>
                揭 開 今 日 之 牌 · Reveal →
              </button>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--mist)', marginTop: 32, textTransform: 'uppercase' }}>
                每日固定 · 隔天更新 · NEXT REVEAL · 00:00
              </p>
            </>
          )}
        </div>

        <div className="daily-card-frame">
          <div className="card-glow" />
          <div className="compass">
            <AstroCompass size={560} opacity={0.3} />
          </div>
          {revealed ? (
            <div style={{ position: 'relative', zIndex: 2, animation: 'float 6s ease-in-out infinite' }}>
              <TarotCard card={card} reversed={card.reversed} size="xl" />
            </div>
          ) : (
            <div style={{ position: 'relative', zIndex: 2, cursor: 'pointer' }} onClick={() => setRevealed(true)}>
              <TarotCard faceDown size="xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────── CODEX (牌義百科) ─────────────────────
function CodexView() {
  const [filter, setFilter] = uS2('all');
  const [search, setSearch] = uS2('');
  const [active, setActive] = uS2(null);
  const [apiKeyInput, setApiKeyInput] = uS2(() => localStorage.getItem('tarot_claude_key') || '');
  const [keySaved, setKeySaved] = uS2(false);
  const saveApiKey = () => {
    localStorage.setItem('tarot_claude_key', apiKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const filtered = uM2(() => {
    let list = MAJOR_ARCANA;
    if (filter !== 'all') {
      list = list.filter((c) => c.element === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) =>
        c.name.includes(q) || c.en.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q))
      );
    }
    return list;
  }, [filter, search]);

  const counts = uM2(() => {
    const all = MAJOR_ARCANA.length;
    const byEl = {};
    MAJOR_ARCANA.forEach((c) => { byEl[c.element] = (byEl[c.element] || 0) + 1; });
    return { all, ...byEl };
  }, []);

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>06 · CODEX OF MEANINGS</Eyebrow>
          <h2 className="view-title-tc">牌 義 百 科</h2>
          <div className="view-title-en">The major arcana, twenty-two keys</div>
        </div>
        <div className="view-header-meta">
          <div>22 MAJOR ARCANA</div>
          <div>{filtered.length} SHOWING</div>
        </div>
      </header>

      <div className="codex-layout">
        <aside className="codex-sidebar">
          <input
            className="codex-search"
            placeholder="搜尋牌名、關鍵字..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="codex-filter-group">
            <div className="codex-sidebar-title">SUITS · 牌組</div>
            <button className={`codex-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              大阿爾克那 <span className="codex-filter-count">{counts.all}</span>
            </button>
          </div>
          <div className="codex-filter-group">
            <div className="codex-sidebar-title">ELEMENT · 元素</div>
            {['火', '水', '風', '土'].map((el) => (
              <button key={el} className={`codex-filter ${filter === el ? 'active' : ''}`} onClick={() => setFilter(el)}>
                {el === '火' ? '火 · Fire' : el === '水' ? '水 · Water' : el === '風' ? '風 · Air' : '土 · Earth'}
                <span className="codex-filter-count">{counts[el] || 0}</span>
              </button>
            ))}
          </div>
          <div className="codex-filter-group">
            <div className="codex-sidebar-title">DEPTH · 深度</div>
            <div style={{ fontFamily: 'var(--tc)', fontSize: 12, color: 'var(--mist)', lineHeight: 1.8, padding: '0 16px', borderLeft: '1px solid var(--line-dim)' }}>
              點擊任一張牌查看完整牌義、神話故事與正逆位指引。
            </div>
          </div>
          <div className="codex-filter-group" style={{ marginTop: 8 }}>
            <div className="codex-sidebar-title">AI · 解讀設定</div>
            <div style={{ padding: '0 16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--mist)', letterSpacing: '0.15em', marginBottom: 6 }}>
                CLAUDE API KEY
              </div>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                style={{
                  width: '100%',
                  background: 'var(--midnight)',
                  border: '1px solid var(--line-dim)',
                  color: 'var(--parchment)',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  padding: '7px 10px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={saveApiKey}
                className="btn-ghost"
                style={{ marginTop: 8, width: '100%', fontSize: 11, padding: '6px 0' }}
              >
                {keySaved ? '已儲存 ✓' : '儲存 API Key'}
              </button>
              <div style={{ fontFamily: 'var(--tc)', fontSize: 11, color: 'var(--mist)', marginTop: 8, lineHeight: 1.7 }}>
                Key 僅存於本機，不上傳。<br/>輸入後占卜解讀將由 AI 生成。
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="codex-grid">
            {filtered.map((c) => (
              <div key={c.num} className="codex-item" onClick={() => setActive(c)}>
                <TarotCard card={c} size="md" />
                <div className="codex-item-meta">
                  <span>{c.glyph}</span>
                  <span>{c.element} · {c.planet}</span>
                </div>
                <div className="codex-item-name">{c.name}</div>
                <div className="codex-item-en">{c.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div className="codex-modal-backdrop" onClick={() => setActive(null)}>
          <div className="codex-modal" onClick={(e) => e.stopPropagation()}>
            <button className="codex-modal-close" onClick={() => setActive(null)}>✕</button>
            <div>
              <TarotCard card={active} size="lg" />
              <div className="daily-meta-grid" style={{ marginTop: 24, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="daily-meta-cell">
                  <div className="daily-meta-label">ELEMENT</div>
                  <div className="daily-meta-value">{active.element}</div>
                </div>
                <div className="daily-meta-cell" style={{ borderRight: 'none' }}>
                  <div className="daily-meta-label">RULER</div>
                  <div className="daily-meta-value">{active.planet}</div>
                </div>
              </div>
            </div>
            <div>
              <Eyebrow>{active.glyph} · MAJOR ARCANA · {String(active.num).padStart(2, '0')}</Eyebrow>
              <h3 style={{ fontFamily: 'var(--tc)', fontSize: 56, fontWeight: 300, letterSpacing: '0.12em', color: 'var(--parchment)', marginTop: 16 }}>{active.name}</h3>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--gold)', marginTop: 4 }}>{active.en}</div>

              <div className="interp-keywords" style={{ marginTop: 24 }}>
                {active.keywords.map((k) => <span key={k} className="interp-kw">{k}</span>)}
              </div>

              <div style={{ marginTop: 32 }}>
                <Eyebrow>STORY · 神話</Eyebrow>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.8, color: 'var(--parchment)', marginTop: 12, fontStyle: 'italic' }}>
                  {active.story}
                </p>
              </div>

              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <Eyebrow>UPRIGHT · 正位</Eyebrow>
                  <p style={{ fontFamily: 'var(--tc)', fontSize: 14, lineHeight: 1.9, color: 'var(--parchment)', marginTop: 12 }}>{active.upright}</p>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--ember)' }}>REVERSED · 逆位</div>
                  <p style={{ fontFamily: 'var(--tc)', fontSize: 14, lineHeight: 1.9, color: 'var(--parchment)', marginTop: 12 }}>{active.reversed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── ARCHIVE ─────────────────────
function ArchiveView({ onNav }) {
  const [history, setHistory] = uS2(() => loadReadingHistory());
  const entries = history.length ? history : HISTORY_FIXTURES;
  const [activeId, setActiveId] = uS2(() => entries[0]?.id || null);
  const active = entries.find((entry) => entry.id === activeId) || entries[0];

  const mostDrawn = uM2(() => {
    const tally = {};
    history.forEach((entry) => entry.cards?.forEach((name) => { tally[name] = (tally[name] || 0) + 1; }));
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || '星星';
  }, [history]);

  const favoriteSpread = uM2(() => {
    const tally = {};
    history.forEach((entry) => { tally[entry.spread] = (tally[entry.spread] || 0) + 1; });
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || '時間三象';
  }, [history]);

  const handleDelete = (id) => {
    const next = deleteReadingHistory(id);
    setHistory(next);
    setActiveId(next[0]?.id || HISTORY_FIXTURES[0]?.id || null);
  };

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <div>
          <Eyebrow>07 · YOUR ARCHIVE</Eyebrow>
          <h2 className="view-title-tc">占 卜 紀 錄</h2>
          <div className="view-title-en">The chronicle of your inquiries</div>
        </div>
        <div className="view-header-meta">
          <div>{history.length ? 'LOCAL ARCHIVE' : 'SAMPLE ARCHIVE'}</div>
          <div>{entries.length} READINGS</div>
        </div>
      </header>

      <div className="archive-stats">
        <div className="archive-stat">
          <div className="archive-stat-num">{entries.length}</div>
          <div className="archive-stat-label">TOTAL READINGS · 總占卜次數</div>
        </div>
        <div className="archive-stat">
          <div className="archive-stat-num">{mostDrawn}</div>
          <div className="archive-stat-label">MOST DRAWN · 最常出現</div>
        </div>
        <div className="archive-stat">
          <div className="archive-stat-num">{favoriteSpread}</div>
          <div className="archive-stat-label">FAVORITE SPREAD · 偏好牌陣</div>
        </div>
        <div className="archive-stat">
          <div className="archive-stat-num">{history.length ? '本機' : '範例'}</div>
          <div className="archive-stat-label">DAY STREAK · 連續天數</div>
        </div>
      </div>

      <div className="archive-layout">
        <div className="archive-timeline">
          <Eyebrow dim>TIMELINE · 時間軸</Eyebrow>
          <div style={{ marginTop: 32 }}>
            {entries.map((h) => (
              <div
                key={h.id}
                className={`archive-entry ${active?.id === h.id ? 'active' : ''}`}
                onClick={() => setActiveId(h.id)}
              >
                <span className="archive-date">{h.date} · {h.time}</span>
                <span className="archive-spread">{h.spread}</span>
                <div className="archive-question">{h.question}</div>
                <div className="archive-cards">
                  {h.cards.map((c, i) => (
                    <span key={i}>{c}{i < h.cards.length - 1 ? ' · ' : ''}</span>
                  ))}
                </div>
                <p className="archive-summary">{h.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="archive-detail">
          {active && (
            <>
              <div className="archive-detail-header">
                <Eyebrow>READING DETAIL</Eyebrow>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.25em', color: 'var(--gold)', marginTop: 12 }}>
                  {active.date} · {active.time}
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--parchment)', marginTop: 16, lineHeight: 1.4 }}>
                  「{active.question}」
                </h3>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Eyebrow dim>SPREAD · 牌陣</Eyebrow>
                <div style={{ fontFamily: 'var(--tc)', fontSize: 16, color: 'var(--parchment)', marginTop: 8, letterSpacing: '0.1em' }}>{active.spread}</div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Eyebrow dim>CARDS DRAWN · 抽出</Eyebrow>
                <div className="archive-detail-cards" style={{ marginTop: 12 }}>
                  {active.cards.map((c, i) => {
                    const detail = active.cardDetails?.[i];
                    const cardData = MAJOR_ARCANA.find((m) => m.name === c || m.num === detail?.num);
                    return cardData ? <TarotCard key={`${c}-${i}`} card={cardData} reversed={detail?.isReversed} size="xs" /> : null;
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Eyebrow dim>MOOD · 心境</Eyebrow>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--gold)', marginTop: 8 }}>{active.mood || '—'}</div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Eyebrow dim>SYNTHESIS · 摘要</Eyebrow>
                <p style={{ fontFamily: 'var(--tc)', fontSize: 14, lineHeight: 1.9, color: 'var(--parchment)', marginTop: 8 }}>{active.summary}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32 }}>
                <button className="btn-ghost" style={{ width: '100%' }} onClick={() => onNav('spreads')}>再問一次相似問題</button>
                {history.length > 0 && (
                  <button className="btn-ghost" style={{ width: '100%' }} onClick={() => handleDelete(active.id)}>從本機紀錄移除</button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { DailyView, CodexView, ArchiveView });
