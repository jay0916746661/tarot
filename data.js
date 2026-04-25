// ============================================================
// 塔羅牌資料 — 大阿爾克那 22 張 + 部分小阿爾克那
// ============================================================

const MAJOR_ARCANA = [
  { num: 0,  name: '愚者',      en: 'The Fool',           glyph: '0',   element: '風', planet: '天王星',
    keywords: ['新開始', '冒險', '純真', '自由'],
    upright: '一個全新的旅程正在召喚。放下既有的安全感，相信內在的指引。',
    reversed: '魯莽、缺乏計畫，或恐懼讓你停滯不前。',
    story: '愚者站在懸崖邊，背包輕盈，白狗追隨。他不擔心墜落，因為宇宙會接住純粹之心。' },
  { num: 1,  name: '魔術師',    en: 'The Magician',       glyph: 'I',   element: '風', planet: '水星',
    keywords: ['顯化', '意志', '創造', '溝通'],
    upright: '你擁有完成此事所需的一切資源。專注意志，將想法化為現實。',
    reversed: '操弄、欺瞞，或才能未被善用。',
    story: '魔術師舉起權杖指向天空，另一手指地。如其在上，如其在下，他是天地之間的通道。' },
  { num: 2,  name: '女祭司',    en: 'The High Priestess', glyph: 'II',  element: '水', planet: '月亮',
    keywords: ['直覺', '潛意識', '神秘', '靜默'],
    upright: '答案在內心深處。傾聽夢境與直覺，無需立即行動。',
    reversed: '忽視內在聲音、秘密被揭露、與直覺脫節。',
    story: '她坐於黑白雙柱之間，膝上托拉經卷半藏於袍下。月亮在她腳邊，潮汐隨她呼吸。' },
  { num: 3,  name: '皇后',      en: 'The Empress',        glyph: 'III', element: '土', planet: '金星',
    keywords: ['豐盛', '創造力', '母性', '感官'],
    upright: '生命正以豐沛的方式流向你。擁抱身體、自然與創造的喜悅。',
    reversed: '創造力受阻、過度依賴、忽略自我照顧。',
    story: '皇后躺在金黃麥田上，懷中孕育大地。星冠十二顆，呼應宇宙的節律。' },
  { num: 4,  name: '皇帝',      en: 'The Emperor',        glyph: 'IV',  element: '火', planet: '白羊座',
    keywords: ['權威', '結構', '父性', '掌控'],
    upright: '建立秩序與界線。用紀律與遠見打造你的領地。',
    reversed: '專制、僵化、濫用權力。',
    story: '他坐於石製王座，公羊雕飾兩側。盔甲未卸——統治者永遠值勤。' },
  { num: 5,  name: '教皇',      en: 'The Hierophant',     glyph: 'V',   element: '土', planet: '金牛座',
    keywords: ['傳統', '信仰', '指導', '體制'],
    upright: '尋求導師或傳統智慧。在既有架構中找到歸屬。',
    reversed: '挑戰權威、跳脫框架、靈性叛逆。',
    story: '教皇高舉祝福之手，三重冠冕，腳下兩支交叉鑰匙開啟天地之門。' },
  { num: 6,  name: '戀人',      en: 'The Lovers',         glyph: 'VI',  element: '風', planet: '雙子座',
    keywords: ['關係', '抉擇', '結合', '價值觀'],
    upright: '一個與心相符的選擇。靈魂層面的連結正在形成。',
    reversed: '失衡的關係、價值觀衝突、錯誤的選擇。',
    story: '兩個赤裸的人站於伊甸園，天使展翼於上。愛是看見彼此的選擇。' },
  { num: 7,  name: '戰車',      en: 'The Chariot',        glyph: 'VII', element: '水', planet: '巨蟹座',
    keywords: ['意志', '勝利', '前進', '掌握'],
    upright: '駕馭對立的力量。專注、決心，將贏得這場戰役。',
    reversed: '失控、方向迷失、內外衝突。',
    story: '戰士駕馭黑白雙獅芬克斯，星辰華蓋之下，憑意志而非韁繩前行。' },
  { num: 8,  name: '力量',      en: 'Strength',           glyph: 'VIII',element: '火', planet: '獅子座',
    keywords: ['勇氣', '溫柔', '內在力量', '耐心'],
    upright: '溫柔比強硬更有力。以慈悲馴服內在的野性。',
    reversed: '自我懷疑、缺乏信心、暴怒。',
    story: '少女輕撫獅口，無懼。力量不是壓制，而是與野性共舞。' },
  { num: 9,  name: '隱者',      en: 'The Hermit',         glyph: 'IX',  element: '土', planet: '處女座',
    keywords: ['獨處', '內省', '指引', '智慧'],
    upright: '退入內在尋找答案。你的提燈將為他人也為自己照路。',
    reversed: '孤立、拒絕協助、迷失於自我。',
    story: '老人立於山巔，手持六芒星之燈。他不下山，只等願意攀登的人。' },
  { num: 10, name: '命運之輪',  en: 'Wheel of Fortune',   glyph: 'X',   element: '火', planet: '木星',
    keywords: ['循環', '轉折', '命運', '機運'],
    upright: '輪轉啟動。你正進入新的命運篇章——順勢而行。',
    reversed: '阻力、運勢下滑、抗拒改變。',
    story: '輪轂上四生靈守護，輪轉不停。坐輪頂者終將下降，下降者終將上升。' },
  { num: 11, name: '正義',      en: 'Justice',            glyph: 'XI',  element: '風', planet: '天秤座',
    keywords: ['平衡', '真相', '因果', '抉擇'],
    upright: '真相將浮現。你的行為將收到誠實的回應。',
    reversed: '不公、逃避責任、偏見。',
    story: '她坐於雙柱之間，劍指上天，秤量人心。看不見蒙眼布——她直視真相。' },
  { num: 12, name: '吊人',      en: 'The Hanged Man',     glyph: 'XII', element: '水', planet: '海王星',
    keywords: ['暫停', '臣服', '視角轉換', '犧牲'],
    upright: '主動的暫停。倒過來看，世界給你新的答案。',
    reversed: '無謂的犧牲、停滯不前、抗拒。',
    story: '他倒掛於T形十字架上，面容平靜，光環璀璨。他選擇了這個視角。' },
  { num: 13, name: '死神',      en: 'Death',              glyph: 'XIII',element: '水', planet: '天蠍座',
    keywords: ['結束', '蛻變', '釋放', '重生'],
    upright: '某事必須結束，才能讓新的進入。蛻變正在發生。',
    reversed: '抗拒結束、停滯、害怕改變。',
    story: '骸骨騎士手持黑旗，旗上白玫瑰。他不挑選——但所到之處，舊我皆落下。' },
  { num: 14, name: '節制',      en: 'Temperance',         glyph: 'XIV', element: '火', planet: '射手座',
    keywords: ['平衡', '調和', '耐心', '療癒'],
    upright: '混合對立的元素。中道而行，奇蹟自然發生。',
    reversed: '失衡、極端、不耐煩。',
    story: '天使一足踏水一足踩地，將兩杯液體在不可能的角度傾倒交融。' },
  { num: 15, name: '惡魔',      en: 'The Devil',          glyph: 'XV',  element: '土', planet: '摩羯座',
    keywords: ['束縛', '慾望', '陰影', '物質'],
    upright: '看見你正自願戴著的枷鎖。鎖鏈鬆的，可以脫下。',
    reversed: '解放、看穿幻象、擺脫成癮。',
    story: '惡魔倒五芒星於額，男女赤裸鏈於座下。但鏈圈寬鬆——他們可以離開。' },
  { num: 16, name: '高塔',      en: 'The Tower',          glyph: 'XVI', element: '火', planet: '火星',
    keywords: ['崩解', '頓悟', '解放', '震撼'],
    upright: '虛假結構的崩塌。痛但必要——騰出空間給真實。',
    reversed: '逃避必要的崩解、災難延後。',
    story: '雷擊塔頂，王冠墜落，兩人從燃燒的窗口落下。但天空之後將清明。' },
  { num: 17, name: '星星',      en: 'The Star',           glyph: 'XVII',element: '風', planet: '水瓶座',
    keywords: ['希望', '療癒', '靈感', '指引'],
    upright: '在風暴後，星光出現。願景清晰，療癒展開。',
    reversed: '失去信心、絕望、與靈性脫節。',
    story: '裸女跪於池畔，雙手各持水瓶傾倒。一星於頂，七星環繞——她不再隱藏。' },
  { num: 18, name: '月亮',      en: 'The Moon',           glyph: 'XVIII',element: '水', planet: '雙魚座',
    keywords: ['幻象', '潛意識', '恐懼', '直覺'],
    upright: '事情並非表面所見。穿越迷霧，潛意識正在說話。',
    reversed: '幻象消散、真相顯現、恐懼釋放。',
    story: '月在天頂垂淚，狼與犬同吠，螯從水中爬出。月光之下，幻覺與真實同行。' },
  { num: 19, name: '太陽',      en: 'The Sun',            glyph: 'XIX', element: '火', planet: '太陽',
    keywords: ['喜悅', '成功', '生命力', '清晰'],
    upright: '光明降臨。喜悅、成功、生命的純粹綻放。',
    reversed: '暫時的陰影、過度樂觀、能量耗竭。',
    story: '孩子騎白馬手揮紅旗，太陽笑望。向日葵不需要證明自己面向光。' },
  { num: 20, name: '審判',      en: 'Judgement',          glyph: 'XX',  element: '火', planet: '冥王星',
    keywords: ['覺醒', '召喚', '寬恕', '重生'],
    upright: '一個更高的召喚。回顧過往，寬恕自己，迎接新生。',
    reversed: '自我批判、忽略召喚、抗拒蛻變。',
    story: '加百列吹響號角，群屍從棺中起立。不是審判，是重新被認出的自己。' },
  { num: 21, name: '世界',      en: 'The World',          glyph: 'XXI', element: '土', planet: '土星',
    keywords: ['完成', '整合', '圓滿', '成就'],
    upright: '一個循環完滿。所有的努力結出果實——慶祝它。',
    reversed: '尚未完成、缺乏結束、卡在最後一哩。',
    story: '舞者於月桂環中盤旋，四方各有生靈見證。她已成為自己的一切。' },
];

// 牌陣
const SPREADS = [
  {
    id: 'single',
    name: '單張啟示',
    en: 'Single Draw',
    count: 1,
    duration: '1–2 分鐘',
    difficulty: 1,
    description: '直接、純粹的回應。當下宇宙最想對你說的一句話。',
    positions: [
      { name: '此刻', meaning: '當下能量、即時指引' },
    ],
    layout: 'single',
  },
  {
    id: 'three',
    name: '時間三象',
    en: 'Past · Present · Future',
    count: 3,
    duration: '3–5 分鐘',
    difficulty: 1,
    description: '最古老的線性敘事——從何而來、立於何處、走向何方。',
    positions: [
      { name: '過去', meaning: '事件的根源、累積的能量' },
      { name: '現在', meaning: '當下的處境、需要面對的課題' },
      { name: '未來', meaning: '若依循此路徑將形成的趨勢' },
    ],
    layout: 'three',
  },
  {
    id: 'situation',
    name: '處境三角',
    en: 'Situation · Action · Outcome',
    count: 3,
    duration: '3–5 分鐘',
    difficulty: 2,
    description: '面對抉擇時的實用工具。看清局勢、應對之策、可能結果。',
    positions: [
      { name: '處境', meaning: '事件的真實面貌' },
      { name: '行動', meaning: '建議採取的態度' },
      { name: '結果', meaning: '若如此行的可能走向' },
    ],
    layout: 'three',
  },
  {
    id: 'celtic',
    name: '凱爾特十字',
    en: 'Celtic Cross',
    count: 10,
    duration: '15–25 分鐘',
    difficulty: 4,
    description: '塔羅最經典的深度展開。十個位置編織出立體的命運圖。',
    positions: [
      { name: '核心', meaning: '事件的本質' },
      { name: '挑戰', meaning: '橫亙其上的力量' },
      { name: '根基', meaning: '深層動因' },
      { name: '過去', meaning: '正在離去的能量' },
      { name: '可能', meaning: '理想的可能性' },
      { name: '近未來', meaning: '即將到來' },
      { name: '自我', meaning: '你的態度' },
      { name: '環境', meaning: '他人與外界' },
      { name: '希望恐懼', meaning: '內心的雙面' },
      { name: '結局', meaning: '最終結果' },
    ],
    layout: 'celtic',
  },
  {
    id: 'relation',
    name: '關係之鏡',
    en: 'Relationship Mirror',
    count: 5,
    duration: '8–12 分鐘',
    difficulty: 3,
    description: '兩人之間流動的能量地形——你看見的、對方看見的、共振之處。',
    positions: [
      { name: '你', meaning: '你在關係中的位置' },
      { name: '對方', meaning: '對方在關係中的位置' },
      { name: '連結', meaning: '兩人之間的本質' },
      { name: '挑戰', meaning: '需要面對的課題' },
      { name: '走向', meaning: '若繼續會通往哪裡' },
    ],
    layout: 'relation',
  },
  {
    id: 'horseshoe',
    name: '馬蹄七星',
    en: 'Horseshoe',
    count: 7,
    duration: '10–15 分鐘',
    difficulty: 3,
    description: '馬蹄形展開的決策之路，從過去走到結局，七個轉彎。',
    positions: [
      { name: '過去', meaning: '帶到現在的能量' },
      { name: '現況', meaning: '當前處境' },
      { name: '隱情', meaning: '尚未察覺的因素' },
      { name: '阻礙', meaning: '需要跨越的關卡' },
      { name: '他人', meaning: '周圍的態度' },
      { name: '建議', meaning: '應對之策' },
      { name: '結局', meaning: '可能結果' },
    ],
    layout: 'horseshoe',
  },
];

// 隨機抽牌（含正逆位）
function drawCards(count, seed) {
  const deck = [...MAJOR_ARCANA];
  // 簡易 PRNG (種子)
  let s = seed || Date.now();
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count).map((c) => ({
    ...c,
    reversed: rand() < 0.32,
  }));
}

// 假歷史紀錄
const HISTORY_FIXTURES = [
  { id: 'h7', date: '2026.04.23', time: '23:14', spread: '凱爾特十字', question: '我該接受這個工作機會嗎？',
    cards: ['命運之輪', '高塔', '星星'], mood: '焦慮 → 釋然', summary: '輪轉已啟動，舊結構崩塌正是新生開始。' },
  { id: 'h6', date: '2026.04.21', time: '08:02', spread: '時間三象', question: '與 J 的關係將走向何處？',
    cards: ['戀人', '吊人', '太陽'], mood: '困惑', summary: '需要從不同角度看待，光明終將降臨。' },
  { id: 'h5', date: '2026.04.18', time: '14:30', spread: '單張啟示', question: '今天我需要知道什麼？',
    cards: ['女祭司'], mood: '平靜', summary: '靜默之中，答案已在你心。' },
  { id: 'h4', date: '2026.04.15', time: '21:45', spread: '處境三角', question: '創業計畫該如何推進？',
    cards: ['魔術師', '隱者', '世界'], mono: '專注', summary: '資源齊備，先獨處沉澱，圓滿在前方。' },
  { id: 'h3', date: '2026.04.12', time: '11:18', spread: '關係之鏡', question: '與母親之間的張力？',
    cards: ['皇后', '皇帝', '節制', '死神', '正義'], mood: '沉重', summary: '對立的能量需要調和，舊模式正在轉化。' },
  { id: 'h2', date: '2026.04.09', time: '07:00', spread: '單張啟示', question: '本週主題',
    cards: ['星星'], mood: '希望', summary: '療癒之星，相信內在指引。' },
  { id: 'h1', date: '2026.04.05', time: '23:55', spread: '時間三象', question: '搬家的決定',
    cards: ['月亮', '戰車', '太陽'], mood: '猶豫 → 堅定', summary: '穿越迷霧後，明確前進。' },
];

// 每日一牌（基於日期種子）
function getDailyCard() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return drawCards(1, seed)[0];
}

Object.assign(window, {
  MAJOR_ARCANA, SPREADS, drawCards, HISTORY_FIXTURES, getDailyCard,
});
