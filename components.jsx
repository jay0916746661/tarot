// ============================================================
// 共用元件：卡牌視覺、導覽軌道、儀式裝飾
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

// ───── 塔羅牌正面（程式繪製，不依賴外部圖） ─────
function TarotCard({ card, reversed, size = 'md', faceDown = false, onClick, style, className = '' }) {
  const sizes = {
    xs: { w: 60,  h: 100, fs: 9 },
    sm: { w: 90,  h: 150, fs: 11 },
    md: { w: 140, h: 230, fs: 13 },
    lg: { w: 200, h: 330, fs: 16 },
    xl: { w: 280, h: 460, fs: 20 },
  };
  const s = sizes[size];

  if (faceDown) {
    return (
      <div
        className={`tarot-card-back ${className}`}
        onClick={onClick}
        style={{ width: s.w, height: s.h, ...style }}
      >
        <div className="tarot-card-back-inner">
          <div className="tarot-back-pattern" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`tarot-card ${reversed ? 'reversed' : ''} ${className}`}
      onClick={onClick}
      style={{ width: s.w, height: s.h, ...style }}
    >
      <div className="tarot-inner" style={{ transform: reversed ? 'rotate(180deg)' : 'none' }}>
        <div className="tarot-corner tl">{card?.glyph}</div>
        <div className="tarot-corner br">{card?.glyph}</div>
        <div className="tarot-art">
          <CardGlyph card={card} size={s.w} />
        </div>
        <div className="tarot-name" style={{ fontSize: s.fs }}>
          {card?.name}
        </div>
        <div className="tarot-name-en" style={{ fontSize: s.fs * 0.65 }}>
          {card?.en}
        </div>
      </div>
    </div>
  );
}

// 每張牌的程式化裝飾圖樣（抽象、星象式）
function CardGlyph({ card, size }) {
  if (!card) return null;
  // 用 num 決定圖形主題
  const seed = card.num;
  const cx = size / 2;
  const cy = size * 0.35;
  const r = size * 0.22;

  // 不同類型用不同基礎元素
  const variants = [
    'sun', 'moon', 'star', 'eye', 'rose', 'cup', 'sword', 'wheel', 'tower', 'snake',
    'angel', 'crown', 'tree', 'flame', 'fish', 'pillar', 'bird', 'orb', 'leaf', 'arrow', 'scale', 'circle',
  ];
  const v = variants[seed % variants.length];

  return (
    <svg viewBox={`0 0 ${size} ${size * 1.2}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={`g-${seed}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="oklch(82% 0.13 85)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="oklch(50% 0.1 75)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(20% 0.06 280)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 背景光暈 */}
      <circle cx={cx} cy={cy} r={r * 1.6} fill={`url(#g-${seed})`} />

      {/* 環形星象 */}
      <circle cx={cx} cy={cy} r={r * 1.1} fill="none" stroke="oklch(82% 0.13 85)" strokeWidth="0.5" opacity="0.45" />
      <circle cx={cx} cy={cy} r={r * 0.95} fill="none" stroke="oklch(82% 0.13 85)" strokeWidth="0.3" opacity="0.3" strokeDasharray="2 3" />

      {/* 主圖樣 */}
      <g transform={`translate(${cx}, ${cy})`} fill="none" stroke="oklch(88% 0.08 88)" strokeWidth="0.8">
        {v === 'sun' && (
          <>
            <circle r={r * 0.55} fill="oklch(82% 0.13 85)" fillOpacity="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * r * 0.65} y1={Math.sin(a) * r * 0.65} x2={Math.cos(a) * r * 0.95} y2={Math.sin(a) * r * 0.95} />;
            })}
          </>
        )}
        {v === 'moon' && (
          <>
            <circle r={r * 0.6} fill="oklch(70% 0.08 85)" fillOpacity="0.3" />
            <circle cx={r * 0.2} r={r * 0.55} fill="oklch(15% 0.05 280)" />
          </>
        )}
        {v === 'star' && (
          <>
            <polygon points={Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
              const rr = i % 2 === 0 ? r * 0.7 : r * 0.3;
              return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
            }).join(' ')} fill="oklch(82% 0.13 85)" fillOpacity="0.4" />
          </>
        )}
        {v === 'eye' && (
          <>
            <ellipse rx={r * 0.7} ry={r * 0.35} fill="oklch(15% 0.05 280)" />
            <ellipse rx={r * 0.7} ry={r * 0.35} />
            <circle r={r * 0.2} fill="oklch(82% 0.13 85)" fillOpacity="0.7" />
            <circle r={r * 0.08} fill="oklch(15% 0.05 280)" />
          </>
        )}
        {v === 'rose' && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} rx={r * 0.5} ry={r * 0.18} transform={`rotate(${i * 36})`} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            ))}
            <circle r={r * 0.15} fill="oklch(82% 0.13 85)" />
          </>
        )}
        {v === 'cup' && (
          <>
            <path d={`M ${-r * 0.4} ${-r * 0.3} L ${-r * 0.4} ${r * 0.2} A ${r * 0.4} ${r * 0.4} 0 0 0 ${r * 0.4} ${r * 0.2} L ${r * 0.4} ${-r * 0.3} Z`} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            <line x1={0} y1={r * 0.5} x2={0} y2={r * 0.7} />
            <ellipse cy={r * 0.7} rx={r * 0.3} ry={r * 0.08} fill="oklch(82% 0.13 85)" fillOpacity="0.4" />
          </>
        )}
        {v === 'sword' && (
          <>
            <line x1={0} y1={-r * 0.7} x2={0} y2={r * 0.6} strokeWidth="1.2" />
            <line x1={-r * 0.3} y1={r * 0.4} x2={r * 0.3} y2={r * 0.4} strokeWidth="1.2" />
            <circle cy={-r * 0.7} r={r * 0.08} fill="oklch(82% 0.13 85)" />
          </>
        )}
        {v === 'wheel' && (
          <>
            <circle r={r * 0.7} />
            <circle r={r * 0.25} fillOpacity="0.3" fill="oklch(82% 0.13 85)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * r * 0.25} y1={Math.sin(a) * r * 0.25} x2={Math.cos(a) * r * 0.7} y2={Math.sin(a) * r * 0.7} />;
            })}
          </>
        )}
        {v === 'tower' && (
          <>
            <rect x={-r * 0.3} y={-r * 0.7} width={r * 0.6} height={r * 1.3} fillOpacity="0.2" fill="oklch(62% 0.18 30)" />
            <polygon points={`${-r * 0.4},${-r * 0.7} ${r * 0.4},${-r * 0.7} 0,${-r}`} fill="oklch(62% 0.18 30)" fillOpacity="0.5" />
            <line x1={-r * 0.5} y1={-r * 0.4} x2={-r * 0.8} y2={r * 0.2} strokeWidth="0.5" />
          </>
        )}
        {v === 'snake' && (
          <>
            <path d={`M ${-r * 0.7} 0 Q ${-r * 0.3} ${-r * 0.5}, 0 0 T ${r * 0.7} 0`} strokeWidth="1.2" fill="none" />
            <circle cx={r * 0.7} r={r * 0.08} fill="oklch(82% 0.13 85)" />
          </>
        )}
        {v === 'angel' && (
          <>
            <circle cy={-r * 0.4} r={r * 0.18} fillOpacity="0.4" fill="oklch(82% 0.13 85)" />
            <path d={`M ${-r * 0.6} ${-r * 0.2} Q ${-r * 0.3} ${-r * 0.5}, 0 ${-r * 0.2} Q ${r * 0.3} ${-r * 0.5}, ${r * 0.6} ${-r * 0.2}`} />
            <line x1={0} y1={-r * 0.2} x2={0} y2={r * 0.6} />
          </>
        )}
        {v === 'crown' && (
          <>
            <path d={`M ${-r * 0.6} ${r * 0.2} L ${-r * 0.6} ${-r * 0.1} L ${-r * 0.3} ${-r * 0.4} L 0 ${-r * 0.1} L ${r * 0.3} ${-r * 0.4} L ${r * 0.6} ${-r * 0.1} L ${r * 0.6} ${r * 0.2} Z`} fillOpacity="0.3" fill="oklch(82% 0.13 85)" />
          </>
        )}
        {v === 'tree' && (
          <>
            <line x1={0} y1={r * 0.7} x2={0} y2={-r * 0.3} strokeWidth="1.2" />
            <circle cy={-r * 0.3} r={r * 0.5} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI - Math.PI / 4;
              return <line key={i} x1={0} y1={-r * 0.2} x2={Math.cos(a) * r * 0.4} y2={-r * 0.2 + Math.sin(a) * r * 0.4} />;
            })}
          </>
        )}
        {v === 'flame' && (
          <path d={`M 0 ${r * 0.6} Q ${-r * 0.4} ${r * 0.2}, ${-r * 0.2} ${-r * 0.2} Q 0 ${-r * 0.4}, ${r * 0.1} ${-r * 0.6} Q ${r * 0.3} ${-r * 0.2}, ${r * 0.4} ${r * 0.2} Q ${r * 0.2} ${r * 0.5}, 0 ${r * 0.6} Z`} fillOpacity="0.4" fill="oklch(62% 0.18 30)" />
        )}
        {v === 'fish' && (
          <>
            <path d={`M ${-r * 0.7} 0 Q 0 ${-r * 0.4}, ${r * 0.5} 0 Q 0 ${r * 0.4}, ${-r * 0.7} 0 Z`} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            <path d={`M ${r * 0.5} 0 L ${r * 0.8} ${-r * 0.2} L ${r * 0.8} ${r * 0.2} Z`} fillOpacity="0.3" fill="oklch(82% 0.13 85)" />
          </>
        )}
        {v === 'pillar' && (
          <>
            <rect x={-r * 0.6} y={-r * 0.6} width={r * 0.25} height={r * 1.2} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            <rect x={r * 0.35} y={-r * 0.6} width={r * 0.25} height={r * 1.2} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            <line x1={-r * 0.7} y1={-r * 0.7} x2={r * 0.7} y2={-r * 0.7} />
          </>
        )}
        {v === 'bird' && (
          <path d={`M ${-r * 0.7} 0 Q ${-r * 0.3} ${-r * 0.4}, 0 0 Q ${r * 0.3} ${-r * 0.4}, ${r * 0.7} 0`} strokeWidth="1.2" />
        )}
        {v === 'orb' && (
          <>
            <circle r={r * 0.65} fillOpacity="0.2" fill="oklch(82% 0.13 85)" />
            <circle r={r * 0.65} />
            <line x1={-r * 0.65} y1={0} x2={r * 0.65} y2={0} strokeDasharray="2 2" />
            <ellipse rx={r * 0.65} ry={r * 0.25} fill="none" />
          </>
        )}
        {v === 'leaf' && (
          <>
            <path d={`M 0 ${-r * 0.6} Q ${r * 0.5} 0, 0 ${r * 0.6} Q ${-r * 0.5} 0, 0 ${-r * 0.6}`} fillOpacity="0.3" fill="oklch(82% 0.13 85)" />
            <line x1={0} y1={-r * 0.6} x2={0} y2={r * 0.6} />
          </>
        )}
        {v === 'arrow' && (
          <>
            <line x1={-r * 0.6} y1={r * 0.6} x2={r * 0.6} y2={-r * 0.6} strokeWidth="1.2" />
            <line x1={r * 0.6} y1={-r * 0.6} x2={r * 0.3} y2={-r * 0.6} />
            <line x1={r * 0.6} y1={-r * 0.6} x2={r * 0.6} y2={-r * 0.3} />
          </>
        )}
        {v === 'scale' && (
          <>
            <line x1={-r * 0.6} y1={-r * 0.3} x2={r * 0.6} y2={-r * 0.3} />
            <line x1={0} y1={-r * 0.5} x2={0} y2={r * 0.5} />
            <ellipse cx={-r * 0.5} cy={r * 0.1} rx={r * 0.2} ry={r * 0.06} fill="oklch(82% 0.13 85)" fillOpacity="0.4" />
            <ellipse cx={r * 0.5} cy={r * 0.1} rx={r * 0.2} ry={r * 0.06} fill="oklch(82% 0.13 85)" fillOpacity="0.4" />
          </>
        )}
        {v === 'circle' && (
          <>
            <circle r={r * 0.7} />
            <circle r={r * 0.45} />
            <circle r={r * 0.2} fill="oklch(82% 0.13 85)" fillOpacity="0.5" />
          </>
        )}
      </g>

      {/* 羅馬數字 */}
      <text x={cx} y={size * 0.78} textAnchor="middle" fill="oklch(82% 0.13 85)" fontFamily="Cormorant Garamond" fontSize={size * 0.18} fontStyle="italic" opacity="0.55">
        {card.glyph}
      </text>

      {/* 元素標記 */}
      <text x={cx} y={size * 0.92} textAnchor="middle" fill="oklch(70% 0.04 290)" fontFamily="JetBrains Mono" fontSize={size * 0.06} letterSpacing={size * 0.01}>
        {card.element?.toUpperCase()} · {card.planet}
      </text>
    </svg>
  );
}

// ───── 占星羅盤裝飾 ─────
function AstroCompass({ size = 200, opacity = 0.4 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  return (
    <svg width={size} height={size} style={{ opacity }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke="var(--gold)" strokeWidth="0.3" />
      <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="var(--gold)" strokeWidth="0.3" strokeDasharray="2 4" />
      {signs.map((sym, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * r * 0.93;
        const y = cy + Math.sin(a) * r * 0.93;
        return (
          <text key={i} x={x} y={y + 4} textAnchor="middle" fill="var(--gold)" fontSize="11" fontFamily="Cormorant Garamond">{sym}</text>
        );
      })}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * r * 0.78;
        const y1 = cy + Math.sin(a) * r * 0.78;
        const x2 = cx + Math.cos(a) * r * 0.85;
        const y2 = cy + Math.sin(a) * r * 0.85;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gold)" strokeWidth="0.4" />;
      })}
    </svg>
  );
}

// ───── 軌道導覽（左側固定） ─────
function OrbitNav({ current, onNav }) {
  const items = [
    { id: 'home',    label: '殿堂', en: 'Temple',   glyph: '◉' },
    { id: 'spreads', label: '牌陣', en: 'Spreads',  glyph: '⊕' },
    { id: 'reading', label: '占卜', en: 'Reading',  glyph: '✦' },
    { id: 'daily',   label: '日課', en: 'Daily',    glyph: '☉' },
    { id: 'codex',   label: '牌義', en: 'Codex',    glyph: '✸' },
    { id: 'archive', label: '紀錄', en: 'Archive',  glyph: '◐' },
  ];
  return (
    <nav className="orbit-nav">
      <div className="orbit-mark">
        <div className="orbit-glyph">✦</div>
        <div className="orbit-brand">
          <div className="orbit-brand-tc">靈樞</div>
          <div className="orbit-brand-en">LUMEN ARCANA</div>
        </div>
      </div>
      <div className="orbit-line" />
      <div className="orbit-items">
        {items.map((it, i) => (
          <button
            key={it.id}
            className={`orbit-item ${current === it.id ? 'active' : ''}`}
            onClick={() => onNav(it.id)}
          >
            <span className="orbit-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="orbit-glyph-sm">{it.glyph}</span>
            <span className="orbit-label">
              <span className="orbit-tc">{it.label}</span>
              <span className="orbit-en">{it.en}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="orbit-foot">
        <div className="orbit-time" id="orbit-time">--:--</div>
        <div className="orbit-moon">☾ 漸盈凸月</div>
      </div>
    </nav>
  );
}

// 月相&時間
function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ───── 點題標籤 ─────
function Eyebrow({ children, dim = false }) {
  return <div className={dim ? 'eyebrow-dim' : 'eyebrow'}>{children}</div>;
}

function GoldDivider() { return <div className="divider-gold" />; }

// 浮動星塵
function FloatingDust() {
  return (
    <div className="floating-dust">
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} className="dust" style={{
          left: `${(i * 67) % 100}%`,
          top: `${(i * 43) % 100}%`,
          animationDelay: `${i * 1.3}s`,
          animationDuration: `${15 + (i % 5) * 4}s`,
        }} />
      ))}
    </div>
  );
}

Object.assign(window, {
  TarotCard, CardGlyph, AstroCompass, OrbitNav, useClock, Eyebrow, GoldDivider, FloatingDust,
});
