// ============================================================
// 塔羅牌資料 — 大阿爾克那 22 張深度解析版
// ============================================================

const MAJOR_ARCANA = [
  { num: 0,  name: '愚者',      en: 'The Fool',           glyph: '0',   element: '風', planet: '天王星',
    keywords: ['新開始', '冒險', '純真', '自由', '未知', '潛能'],
    upright: '宇宙正在向你發出一份毫無保證的邀請。這是一個放下既有包袱、憑藉純粹的直覺與信念躍入未知的時刻。不要讓過度分析或對失敗的恐懼困住你。現在需要的不是完美的計畫，而是敢於犯錯的勇氣。相信生命之流會接住你，即使跌倒也是旅程的一部分。',
    reversed: '你可能正處於極度的焦慮中，抗拒改變；或是相反地，正在採取魯莽、毫無準備的冒險。逆位的愚者提醒你檢視自己：是因為害怕未知而停滯不前，還是為了逃避現實而盲目跳躍？找回你的中心，評估眼前的風險，但別讓恐懼扼殺了可能性。',
    story: '愚者站在懸崖邊緣，身穿華麗而襤褸的衣裳，行囊裡裝著他少得可憐的過往經驗。一隻白狗在腳邊吠叫，或許是警告，或許是催促。他沒有看著深淵，而是仰望天空，準備踏出那看似瘋狂的一步。在煉金術中，愚者代表著「原初物質」，是所有可能性尚未定型的最初起點。' },
  { num: 1,  name: '魔術師',    en: 'The Magician',       glyph: 'I',   element: '風', planet: '水星',
    keywords: ['顯化', '意志', '創造', '溝通', '專注', '資源'],
    upright: '你擁有完成此事所需的一切資源——知識、經驗、人脈或靈感，現在都已齊備在你的桌面上。這是化被動為主動的時刻，將你腦中的藍圖透過專注的意志力轉化為現實。不要再等待更好的時機，你就是那個推動齒輪運轉的源頭。',
    reversed: '你可能感覺江郎才盡，或是手邊的資源無法整合。有時候，這代表著你正在自我懷疑，不敢展現真實的能力；或是警告你，周遭可能有人正在利用話術或操控技巧來誤導你。將渙散的注意力重新集中，先從最小的行動開始找回掌控感。',
    story: '魔術師高舉右手握著權杖指向天空，左手食指指地，象徵著「如其在上，如其在下」（As above, so below）的宇宙法則。他是連結靈性與物質的通道。桌面上擺著聖杯、寶劍、權杖與星幣，代表構成世界的四大元素。他不是在變戲法，而是在展現純粹的創造意志。' },
  { num: 2,  name: '女祭司',    en: 'The High Priestess', glyph: 'II',  element: '水', planet: '月亮',
    keywords: ['直覺', '潛意識', '神秘', '靜默', '等待', '內在智慧'],
    upright: '答案並不在外面的世界，而在你的內心深處。現在不是採取積極行動的時候，而是需要退一步，保持靜默與觀察。傾聽你的夢境、直覺與那些說不出口的感受。有些事情尚未完全顯露，讓時間去揭開面紗，你內在的智慧已經知道該怎麼做。',
    reversed: '你可能過度忽視了自己內在的聲音，讓外界的喧囂或他人的意見淹沒了你的直覺。這也可能暗示著某個隱藏的秘密即將曝光，或是你對某段關係或局勢感到迷惘，無法看清真相。花點時間獨處，重新與你的潛意識建立連結。',
    story: '她端坐於所羅門神殿的黑白雙柱（波阿斯與雅斤）之間，象徵著二元對立與平衡。她膝上托著半隱蔽的《托拉》經卷，身後是一幅畫滿石榴與棕櫚樹的帷幕，擋住了通往潛意識海洋的入口。月亮在她的腳邊盈虧，潮汐隨著她的呼吸起伏。她是通往奧秘的守門人。' },
  { num: 3,  name: '皇后',      en: 'The Empress',        glyph: 'III', element: '土', planet: '金星',
    keywords: ['豐盛', '創造力', '母性', '感官', '滋養', '自然'],
    upright: '生命正以豐沛的方式流向你。這是一個充滿創造力、愛與滋養的時期。無論是孕育一個新生命、一個藝術專案，或是一段關係，只要你投入關愛，它就會如繁花般盛開。擁抱你的感官享受，去接觸大自然，對自己好一點，你值得這一切的豐盛。',
    reversed: '你可能在情感上感到枯竭，過度付出卻得不到回報，或是陷入了過度保護與窒息的愛之中。在某些情況下，它暗示著創造力受阻，或是你忽略了自我照顧。請停止不斷向外給予，先將愛與滋養的能量流回自己身上。',
    story: '皇后慵懶地倚靠在鋪滿天鵝絨的軟座上，身處於金黃色的麥田與茂密的森林之中，瀑布在背景潺潺流動。她頭戴由十二顆星組成的皇冠，象徵十二星座與宇宙的節律；心形的盾牌上刻著金星的符號。她是大地之母的化身，掌管著萬物的生長、繁衍與無條件的愛。' },
  { num: 4,  name: '皇帝',      en: 'The Emperor',        glyph: 'IV',  element: '火', planet: '白羊座',
    keywords: ['權威', '結構', '父性', '掌控', '秩序', '責任'],
    upright: '現在需要的是紀律、結構與清晰的界線。這不是感性用事的時候，你必須站出來擔當領導者的角色，用理性與遠見來打造你的領地。為混亂帶來秩序，建立長遠的規矩。你的堅持與邏輯將會是你目前最強大的武器。',
    reversed: '權力可能正在被濫用，或是你正處於一個過度專制、僵化且缺乏彈性的環境中。有時它反映了你內心的無力感，缺乏自律，無法為自己的生活負起責任。問問自己：你是過度控制了一切，還是完全放棄了對生活的主導權？',
    story: '皇帝威嚴地坐在一張由堅硬石頭雕刻而成的王座上，王座的四角裝飾著公羊的頭像，象徵白羊座的開創與好戰。他雖然身穿象徵世俗權力的紅色長袍，但長袍之下卻穿著鋼鐵盔甲——他是一位永遠準備好捍衛領土與秩序的統治者。他的力量來自於歷練與不可動搖的原則。' },
  { num: 5,  name: '教皇',      en: 'The Hierophant',     glyph: 'V',   element: '土', planet: '金牛座',
    keywords: ['傳統', '信仰', '指導', '體制', '教育', '群體認同'],
    upright: '在尋找答案的路上，你可以向傳統智慧、專業導師或既有的體制尋求指引。這是一段適合學習、進修或融入某個群體與信仰體系的時期。遵循既定的規則與儀式能為你帶來安全感。現在不是破壞框架的時候，而是理解框架為何存在的時刻。',
    reversed: '你正在經歷一場靈性或觀念上的叛逆。你開始質疑權威、挑戰傳統，並渴望打破那些不再適用於你的社會規範或教條。雖然這會帶來孤獨感，但也標誌著你正在尋找屬於自己內在的真理。小心盲從，是時候走出自己的一條路了。',
    story: '教皇高坐在兩根宏偉的柱子之間，高舉右手結出祝福的印契，左手持著象徵精神、靈魂與物質界的三重十字權杖。頭戴三重冠冕，腳下有兩支交叉的鑰匙，那是開啟天堂與世俗知識的鎖匙。兩位僧侶跪在他面前，象徵著知識的傳承與人類對神聖指引的渴望。' },
  { num: 6,  name: '戀人',      en: 'The Lovers',         glyph: 'VI',  element: '風', planet: '雙子座',
    keywords: ['關係', '抉擇', '結合', '價值觀', '和諧', '真誠'],
    upright: '一個深刻的連結正在形成，這可能是浪漫的愛情、完美的合作夥伴，或是靈魂深處的共鳴。除了關係，戀人牌更代表著一個與「核心價值觀」有關的重大抉擇。你被召喚去做出一個忠於自己真實心意的選擇。愛，是看見彼此，也是對自己的完全坦誠。',
    reversed: '關係中出現了失衡、溝通不良或信任危機。這可能暗示著一段充滿誘惑但價值觀不合的關係，或是你在面臨選擇時，因為害怕承擔後果而逃避、妥協。請誠實面對自己內心的矛盾，不要為了迎合他人而背叛自己的靈魂。',
    story: '亞當與夏娃赤裸地站在伊甸園中，沒有偽裝與隱藏。夏娃身後是知識之樹與盤繞的蛇，亞當身後是生命之樹。大天使拉斐爾（療癒之神）在雲端展現雙翼，為他們祈福。這個畫面象徵著意識與潛意識的結合，以及人類在純真與慾望之間、在神性與人性之間所面臨的永恆抉擇。' },
  { num: 7,  name: '戰車',      en: 'The Chariot',        glyph: 'VII', element: '水', planet: '巨蟹座',
    keywords: ['意志', '勝利', '前進', '掌握', '克服障礙', '決心'],
    upright: '這是一場需要高度專注與意志力的征途。你正處於兩股對立的能量之間，你不能讓牠們失控，必須用強大的內在決心駕馭牠們。保持目標明確，毫不動搖地前進，勝利將屬於堅持到最後的人。',
    reversed: '你感覺失去了方向感，或是生活正像一輛失控的馬車般橫衝直撞。這可能是因為你對自己過度施壓，或是內在的衝突讓你停滯不前。有時候，逆位的戰車提醒你：過度的控制欲反而會導致失敗。學會適時放手，重新評估你的目標與路徑。',
    story: '一位年輕的戰士站在戰車上，頭戴八角星的冠冕，肩膀上有著新月的肩甲。最奇特的是，這輛戰車沒有韁繩。戰士前方趴著一黑一白的斯芬克斯，代表著正面與負面、光明與黑暗的力量。戰士不靠物理的束縛，而是憑藉著純粹的精神意志來統御這兩股矛盾的力量，驅動戰車向前。' },
  { num: 8,  name: '力量',      en: 'Strength',           glyph: 'VIII',element: '火', planet: '獅子座',
    keywords: ['勇氣', '溫柔', '內在力量', '耐心', '包容', '馴服'],
    upright: '真正的力量不是來自於壓倒性的武力或暴怒，而是來自於內在的堅韌、耐心與無盡的慈悲。你正面臨一個需要極大包容力的挑戰。用溫柔去馴服那些狂野、恐懼或憤怒的能量（無論是來自他人還是你自己內心）。以柔克剛，是這個階段的最高智慧。',
    reversed: '你可能正被自我懷疑所淹沒，感到軟弱無力，或是無法控制自己的情緒，任由憤怒、嫉妒或原始的慾望掌控了你的行為。這表示你內在的「野獸」正在反撲。不要去壓抑或痛恨這些陰影面，去理解牠們，才能重新找回平靜的力量。',
    story: '一位頭頂著無限大符號（∞）的白衣少女，在陽光下平靜地低著頭，雙手溫柔卻堅定地撫摸著一頭雄獅的上下顎。獅子象徵著人類內在的獸性、激情與原始本能。少女沒有使用武器，也沒有恐懼，她用愛與理解馴服了狂野。這代表著靈性對物質本能的超越與整合。' },
  { num: 9,  name: '隱者',      en: 'The Hermit',         glyph: 'IX',  element: '土', planet: '處女座',
    keywords: ['獨處', '內省', '指引', '智慧', '尋道', '沉澱'],
    upright: '世界的喧囂暫時與你無關。這是一個需要退隱、深思與自我探索的時刻。答案不在外面的花花世界，你必須點亮內心的燈籠，獨自走入靈魂的深處去尋找。這段孤獨的旅程將為你帶來無價的智慧。你的體悟，日後也將成為照亮他人的光。',
    reversed: '你可能因為害怕面對自己而過度投入社交，拒絕安靜下來；或是相反地，你將自己過度封閉，陷入了病態的孤立與憂鬱之中。逆位的隱者提醒你，孤獨是為了尋找答案，而不是為了逃避世界。是時候從山洞裡走出來，或是尋求外部的協助了。',
    story: '一位身穿灰色斗篷的老者，獨自佇立在冰天雪地的山巔。他右手高舉著一盞提燈，燈內閃耀著一顆六芒星（所羅門之星），象徵著真理與內在的光芒；左手拄著一根智慧的權杖。他已經走到了世俗成就的頂點，現在，他轉向了精神的高峰。他既是尋道者，也是為後來者照路的引路人。' },
  { num: 10, name: '命運之輪',  en: 'Wheel of Fortune',   glyph: 'X',   element: '火', planet: '木星',
    keywords: ['循環', '轉折', '命運', '機運', '無常', '順勢而為'],
    upright: '齒輪已經轉動，生命正迎來無法預期的轉折。這通常代表著好運、突如其來的機會，或是一個命中註定的改變。你無法控制外在環境的變化，唯一能做的就是順應這股潮流。記住，凡事皆有週期，處於高處時保持謙卑，跌落谷底時抱持希望。',
    reversed: '你可能感覺厄運連連，或是陷入了某個難以打破的惡性循環之中。你強烈地抗拒改變，試圖抓住那些已經逝去的人事物。逆位的命運之輪提醒你，越是掙扎，越會被困在輪子的底部。接受眼前的無常，放下控制欲，是破局的第一步。',
    story: '巨大的輪子懸浮在空中，象徵著宇宙的法則與生命的無常。輪轂的四角有著四大福音書作者的生靈（獅子、飛鷹、公牛、人），代表著命運的穩定支架。阿努比斯（胡狼神）隨著輪子上升，而提豐（蛇）則向下滑落，獅身人面像端坐輪頂。這幅畫訴說著：興衰交替，唯有處於輪子中心的觀照者能得安寧。' },
  { num: 11, name: '正義',      en: 'Justice',            glyph: 'XI',  element: '風', planet: '天秤座',
    keywords: ['平衡', '真相', '因果', '抉擇', '客觀', '責任'],
    upright: '種瓜得瓜，種豆得豆。這是一個講求因果與客觀事實的時刻。真相終將浮出水面，如果你一直秉持誠實與正直，將會獲得應有的回報或公平的裁決。在做出任何決定時，請放下個人情緒，用最理性的態度去權衡利弊。為自己的行為負起全責。',
    reversed: '你可能正遭遇不公平的對待，或是陷入了某種偏見與歧視之中。另一方面，這也可能警告你正在逃避某個責任，試圖用謊言或推諉來掩飾錯誤。你內心的天秤已經失衡，如果不誠實面對自己，這份業力遲早會以另一種方式找上你。',
    story: '正義女神端坐於兩柱之間，紫色的帷幕象徵著高貴與智慧。她右手高舉雙刃劍，代表著理性的決斷與斬斷迷惘的力量；左手持著精確的天秤，用以衡量道德、因果與人心。值得注意的是，塔羅牌的正義女神並未蒙上雙眼——她不需要盲目，她用清晰的雙眼直視世間的一切真相。' },
  { num: 12, name: '吊人',      en: 'The Hanged Man',     glyph: 'XII', element: '水', planet: '海王星',
    keywords: ['暫停', '臣服', '視角轉換', '犧牲', '等待', '頓悟'],
    upright: '事情卡住了，但這不是壞事。這是一個被宇宙強迫按下暫停鍵的時刻。不要再做無謂的掙扎。當你自願臣服於目前的處境，倒過來看待世界時，你會獲得前所未有的洞察力與頓悟。為了獲得更高的智慧或更長遠的目標，短暫的犧牲與等待是必要的。',
    reversed: '你可能正在做著無謂的犧牲，扮演受害者的角色，卻得不到任何回報；或是你固執己見，極度抗拒改變，不願意換個角度思考問題。這導致你陷入了無止境的停滯與精神內耗。停止做那些白費力氣的掙扎，承認目前的方法已經行不通了。',
    story: '一名男子被一條繩索倒吊在呈 T 字型的生命之樹上。他的右腿被綁住，左腿彎曲成十字，雙手背在身後形成一個三角形。最奇妙的是，他的臉上沒有痛苦，反而帶著平靜與安詳的微笑，頭部甚至散發著金色的光環。這不是懲罰，而是一種主動選擇的修行，透過顛倒的視角獲得神聖的啟示。' },
  { num: 13, name: '死神',      en: 'Death',              glyph: 'XIII',element: '水', planet: '天蠍座',
    keywords: ['結束', '蛻變', '釋放', '重生', '不可逆', '清除'],
    upright: '某個階段、關係或舊有的模式已經徹底走到盡頭。不要害怕這張牌，它通常不代表肉體的死亡，而是象徵著「不可逆的深層蛻變」。就像毛毛蟲必須死去才能成為蝴蝶。主動放手那些不再服務於你的事物，騰出空間，全新的生命正在廢墟中等待破土。',
    reversed: '你出於恐懼，死命地抓住那些早該結束的人事物不放。這可能是對改變的極度抗拒，或是深陷在痛苦的過往中無法自拔。這種停滯狀態只會讓痛苦無限期地延長。宇宙正在逼迫你清創，痛快地割捨，總比讓傷口持續化膿來得好。',
    story: '身穿黑色盔甲的骸骨騎士騎著一匹白馬，緩緩踐踏過滿地的人們。無論是國王、主教、婦女或小孩，在死神面前一律平等，無人能倖免。死神手中拿著一面黑色旗幟，上面畫著象徵純潔與重生的白玫瑰（Mystic Rose）。遠方的地平線上，兩座塔之間，一輪新日正在冉冉升起——死亡只是為了迎接下一個黎明。' },
  { num: 14, name: '節制',      en: 'Temperance',         glyph: 'XIV', element: '火', planet: '射手座',
    keywords: ['平衡', '調和', '耐心', '療癒', '中庸', '煉金術'],
    upright: '你正在經歷一個深層的療癒與整合過程。現在不是走極端的時候，你需要將看似矛盾的元素（例如工作與生活、感性與理性）調和在一起，找到那個微妙的平衡點。保持耐心，用適度與妥協的態度處理事情，奇蹟會在安靜的融合中自然發生。',
    reversed: '生活中出現了嚴重的失衡或過度消耗。這可能表現在飲食、消費、情緒的極端波動，或是你在人際關係中發生了激烈的衝突與不協調。你急於求成，缺乏耐心，導致一切變得混亂。請深呼吸，重新找回你的中心點，停止極端的行為。',
    story: '一位擁有紅色雙翼的天使，一隻腳踏在流動的池水中（潛意識/情感），另一隻腳踏在堅實的土地上（意識/物質）。天使手中拿著兩個聖杯，將水在兩個杯子之間傾倒交流，水流呈現不可思議的角度卻不灑落一滴。這是心靈的煉金術，象徵著將兩種不同的本質完美融合，創造出全新的和諧。' },
  { num: 15, name: '惡魔',      en: 'The Devil',          glyph: 'XV',  element: '土', planet: '摩羯座',
    keywords: ['束縛', '慾望', '陰影', '物質', '成癮', '幻覺'],
    upright: '你感覺自己被困住了，可能是被有害的關係、物質成癮、金錢焦慮或是自身恐懼所束縛。惡魔代表著過度沉溺於物質世界與低階慾望。然而，這張牌最深刻的啟示是：這些鎖鏈其實很鬆。困住你的不是外界，而是你自願交出權力的恐懼與執念。',
    reversed: '這是一個強大的覺醒時刻。你看穿了那些恐嚇你的幻象，決定掙脫長久以來的束縛。這可能代表戒除一個壞習慣、離開一段有毒的關係，或是從極度的物質焦慮中解放出來。雖然過程中可能伴隨著戒斷症狀或恐懼，但你終於重獲自由。',
    story: '在幽暗的洞穴中，坐著長著蝙蝠翅膀、羊角與獸腿的巴風特（Baphomet）。他頭頂著倒立的五芒星，右手舉著火把。在他座下，一男一女赤裸著被鐵鍊拴在石柱上，他們頭上也長出了小角，象徵著他們正在獸化。然而，只要仔細看，他們脖子上的鎖鏈其實非常寬鬆，只要他們願意，隨時可以套出來離開。' },
  { num: 16, name: '高塔',      en: 'The Tower',          glyph: 'XVI', element: '火', planet: '火星',
    keywords: ['崩解', '頓悟', '解放', '震撼', '破壞', '真理'],
    upright: '突如其來的衝擊將徹底摧毀你建立在虛假基礎上的事物。這可能是一次信仰崩塌、關係破裂或事業的劇變。這過程必定伴隨著痛苦與震撼，但這是宇宙必要的干預。它摧毀了那座禁錮你的高塔，雖然讓你跌落塵埃，但也將你從謊言與自我欺騙中解放出來。',
    reversed: '你已經預感到災難的來臨，卻拚命掩飾裂痕，試圖維持表面的和平，抗拒必要的崩塌。這種逃避只會讓內心的恐懼日益加深，並且拉長痛苦的時間。另一種可能是，劇變已經發生過了，但你仍在廢墟中徘徊，不願意接受現實並重新開始。',
    story: '一道閃電從漆黑的天空中劈下，擊碎了建在孤獨山巔的高塔，塔頂象徵著人類傲慢與僵化權威的王冠被震落。火焰從窗戶中噴出，兩個人頭下腳上地從塔中墜落。這座塔是人類用自我（Ego）與錯誤信念築起的監獄，而閃電則是來自宇宙真理的覺醒之光。' },
  { num: 17, name: '星星',      en: 'The Star',           glyph: 'XVII',element: '風', planet: '水瓶座',
    keywords: ['希望', '療癒', '靈感', '指引', '平靜', '信心'],
    upright: '在經歷了高塔的風暴與破壞之後，星光終於為你亮起。這是一段極度平靜、充滿希望與靈感湧現的時期。你的身心靈正在進行深層的療癒。請保持純真與對宇宙的信任，未來的願景非常清晰，你正走在正確的道路上。大膽地許願吧。',
    reversed: '你可能感到絕望、悲觀，失去了對未來的信心。過去的創傷讓你緊閉心門，覺得自己被宇宙遺棄了。逆位的星星並不是說沒有希望，而是你選擇閉上眼睛不看星光。請停止沉溺在消極的情緒中，找回你的信念，療癒的泉水其實一直都在你身邊。',
    story: '在寧靜的夜空下，一顆巨大的金色八角星在中央閃耀，周圍環繞著七顆較小的星星。一位完全赤裸的女子單膝跪在水池邊，她沒有任何防備與隱藏，象徵著純粹與真實。她雙手各拿著一個水壺，一壺倒在土地上滋養萬物，一壺倒回水池中生生不息。背景樹上的朱鷺鳥，代表著埃及智慧之神托特，見證著這安寧的一刻。' },
  { num: 18, name: '月亮',      en: 'The Moon',           glyph: 'XVIII',element: '水', planet: '雙魚座',
    keywords: ['幻象', '潛意識', '恐懼', '直覺', '迷惘', '未知'],
    upright: '事情並非如表面所見。你正走入一段充滿迷霧的時期，潛意識的恐懼、焦慮與過去的陰影紛紛浮現。這是一個難以用邏輯判斷的時刻，容易產生誤會或被欺騙。不要急著做出重大決定。去感受你的恐懼，傾聽夢境的訊息，學會在黑暗中運用直覺導航。',
    reversed: '迷霧正在散去，那些隱藏的真相、謊言或不為人知的秘密終於顯露出來。你從長期的焦慮、幻覺或自我欺騙中醒來，重新獲得了清晰的視野。雖然面對真相可能有點刺眼，但你終於可以擺脫無名的恐懼，腳踏實地往前走了。',
    story: '夜空中懸掛著一輪擁有三種面貌（盈、虧、滿）的月亮，正滴下金色的甘露。下方是一潭深邃的水池，一隻代表深層原始潛意識的龍蝦正從水中爬出。岸邊，一隻被馴化的狗與一隻野生的狼正對著月亮狂吠，象徵著人類內在的理智與野性在月光下的躁動。一條蜿蜒的小路穿越兩座塔，通往未知的遠方。' },
  { num: 19, name: '太陽',      en: 'The Sun',            glyph: 'XIX', element: '火', planet: '太陽',
    keywords: ['喜悅', '成功', '生命力', '清晰', '活力', '光明'],
    upright: '這是塔羅牌中最美好、最積極的牌之一。黑暗已經過去，一切都清晰明朗。你將迎來成功、豐盛、健康與純粹的喜悅。你的生命力旺盛，散發著自信的光芒，吸引著好運與貴人。像個孩子一樣去感受活著的快樂吧，你不需要向任何人證明自己。',
    reversed: '太陽的光芒被暫時的烏雲遮蔽了。這不代表失敗，而是你可能感到短暫的低潮、缺乏熱情，或是對自己的成就感到懷疑。有時候，它也暗示著過度樂觀、自我膨脹或精力耗竭。調整一下步伐，找回你內心那個純粹快樂的小孩，陽光很快就會再次露臉。',
    story: '一輪巨大的太陽佔據了畫面的上方，光芒四射，充滿了溫暖與生命力。一堵磚牆前種滿了盛開的向日葵。一個赤裸的孩童（象徵著重生、純真與毫無防備的快樂）頭戴花環與紅色羽毛，騎在一匹沒有馬鞍的白馬上，手中揮舞著紅色的旗幟。這是一個充滿慶祝與勝利的耀眼時刻。' },
  { num: 20, name: '審判',      en: 'Judgement',          glyph: 'XX',  element: '火', planet: '冥王星',
    keywords: ['覺醒', '召喚', '寬恕', '重生', '回顧', '業力釋放'],
    upright: '這是一個靈魂覺醒與生命清算的時刻。你聽到了內在更高的召喚，促使你回顧過去的所有經歷。這不是為了懲罰，而是為了理解、寬恕與釋放。原諒別人，更要原諒自己。當你整合了過去的一切，你將獲得徹底的重生，準備好踏入一個全新層次的生命軌跡。',
    reversed: '你可能聽到了內心的召喚，卻因為恐懼、自我懷疑或過度在意他人眼光而拒絕改變。你可能深陷在過往的錯誤中，不斷地自我批判，無法原諒自己。這種逃避無法阻止業力的推進，只會讓你錯失重生的機會。勇敢面對過去的陰影吧。',
    story: '大天使加百列在雲端吹響了帶有十字旗幟的金色號角。下方的海洋中漂浮著無數的棺木，人們從棺材中站立起來，張開雙臂仰望天空。他們蒼白的皮膚象徵著他們曾死去。這是死者甦醒的審判日，但畫面中沒有恐懼，只有被喚醒的狂喜與救贖。' },
  { num: 21, name: '世界',      en: 'The World',          glyph: 'XXI', element: '土', planet: '土星',
    keywords: ['完成', '整合', '圓滿', '成就', '循環', '旅程終點'],
    upright: '恭喜你，一個漫長而艱辛的循環終於達到了完美的終點。你成功地整合了沿途的所有經驗，實現了目標，內心感到無比的圓滿與充實。這是一個值得慶祝的成就時刻。隨著這個篇章的完美落幕，你也準備好了，帶著更完整的自己，去迎接下一個更高維度的「愚者」旅程。',
    reversed: '你離終點只有一步之遙，卻卡住了。可能是因為缺乏一個正式的收尾（例如不願好好道別、專案拖延），或是你在最後關頭失去了動力，導致事情無法圓滿。這也可能代表你雖然獲得了外在的成功，但內心卻覺得空虛，尚未完成真正的自我整合。把最後一哩路走完吧。',
    story: '一位雌雄同體（完美整合）的舞者，手中拿著兩根權杖，在一個由月桂樹枝編織而成的巨大橢圓形花環中輕盈地盤旋跳舞。花環的上下用紅色的無限大緞帶綁著。畫面的四個角落，再次出現了命運之輪中的四個生靈（獅、鷹、牛、人），但此時輪子已不再轉動，一切都達到了永恆的和諧與穩定。' },
];

const SPREADS = [
  { id: 'single', name: '單張啟示', en: 'Single Draw', count: 1, duration: '1–2 分鐘', difficulty: 1, description: '直接、純粹的回應。當下宇宙最想對你說的一句話。', positions: [{ name: '此刻', meaning: '當下能量、即時指引' }], layout: 'single' },
  { id: 'three', name: '時間三象', en: 'Past · Present · Future', count: 3, duration: '3–5 分鐘', difficulty: 1, description: '最古老的線性敘事——從何而來、立於何處、走向何方。', positions: [{ name: '過去', meaning: '事件的根源、累積的能量' }, { name: '現在', meaning: '當下的處境、需要面對的課題' }, { name: '未來', meaning: '若依循此路徑將形成的趨勢' }], layout: 'three' },
  { id: 'situation', name: '處境三角', en: 'Situation · Action · Outcome', count: 3, duration: '3–5 分鐘', difficulty: 2, description: '面對抉擇時的實用工具。看清局勢、應對之策、可能結果。', positions: [{ name: '處境', meaning: '事件的真實面貌' }, { name: '行動', meaning: '建議採取的態度' }, { name: '結果', meaning: '若如此行的可能走向' }], layout: 'three' },
  { id: 'celtic', name: '凱爾特十字', en: 'Celtic Cross', count: 10, duration: '15–25 分鐘', difficulty: 4, description: '塔羅最經典的深度展開。十個位置編織出立體的命運圖。', positions: [{ name: '核心', meaning: '事件的本質' }, { name: '挑戰', meaning: '橫亙其上的力量' }, { name: '根基', meaning: '深層動因' }, { name: '過去', meaning: '正在離去的能量' }, { name: '可能', meaning: '理想的可能性' }, { name: '近未來', meaning: '即將到來' }, { name: '自我', meaning: '你的態度' }, { name: '環境', meaning: '他人與外界' }, { name: '希望恐懼', meaning: '內心的雙面' }, { name: '結局', meaning: '最終結果' }], layout: 'celtic' },
  { id: 'relation', name: '關係之鏡', en: 'Relationship Mirror', count: 5, duration: '8–12 分鐘', difficulty: 3, description: '兩人之間流動的能量地形——你看見的、對方看見的、共振之處。', positions: [{ name: '你', meaning: '你在關係中的位置' }, { name: '對方', meaning: '對方在關係中的位置' }, { name: '連結', meaning: '兩人之間的本質' }, { name: '挑戰', meaning: '需要面對的課題' }, { name: '走向', meaning: '若繼續會通往哪裡' }], layout: 'relation' },
  { id: 'horseshoe', name: '馬蹄七星', en: 'Horseshoe', count: 7, duration: '10–15 分鐘', difficulty: 3, description: '馬蹄形展開的決策之路，從過去走到結局，七個轉彎。', positions: [{ name: '過去', meaning: '帶到現在的能量' }, { name: '現況', meaning: '當前處境' }, { name: '隱情', meaning: '尚未察覺的因素' }, { name: '阻礙', meaning: '需要跨越的關卡' }, { name: '他人', meaning: '周圍的態度' }, { name: '建議', meaning: '應對之策' }, { name: '結局', meaning: '可能結果' }], layout: 'horseshoe' },
];

function drawCards(count, seed) {
  const deck = [...MAJOR_ARCANA];
  let s = seed || Date.now();
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count).map((c) => ({
    ...c,
    isReversed: rand() < 0.32, // 修復：改為 isReversed，不再覆蓋文字描述
  }));
}

const QUESTION_CONTEXTS = {
  self: {
    label: '自我',
    field: '你和自己的關係',
    plain: '這題比較像是在問：我現在到底怎麼了、哪裡卡住、下一步要怎麼對自己誠實。',
    action: '先不要急著變成更好的人，先把真正的感受講清楚。',
  },
  love: {
    label: '感情',
    field: '關係裡的互動、需求與界線',
    plain: '這題的重點不是對方到底愛不愛，而是你們之間的能量現在怎麼流動。',
    action: '先看互動模式，再決定要靠近、溝通，還是拉出界線。',
  },
  career: {
    label: '事業',
    field: '工作選擇、職涯節奏與成就感',
    plain: '這題不是只問工作好不好，而是在問這條路有沒有讓你用對力氣。',
    action: '把焦點放回可執行的下一步，而不是只盯著結果。',
  },
  wealth: {
    label: '財務',
    field: '安全感、風險與資源配置',
    plain: '這題表面在問錢，底層常常是在問安全感和風險感。',
    action: '先降低模糊和衝動，再談擴張。',
  },
  wellness: {
    label: '身心靈',
    field: '情緒、身體訊號與內在修復',
    plain: '這題更像身體和情緒在提醒你：某件事已經累積很久。',
    action: '先照顧能量，再處理事件。',
  },
  social: {
    label: '人際',
    field: '互信、距離、角色與溝通',
    plain: '這題在問你和他人之間的距離是不是擺在舒服的位置。',
    action: '不要只看誰對誰錯，要看這段互動讓你變成什麼樣子。',
  },
};

const QUESTION_INTENTS = [
  { id: 'decision', label: '選擇', test: /(該不該|要不要|是否|值得|可以嗎|能不能|適合|接受|離開|繼續|選擇|決定)/ },
  { id: 'action', label: '行動', test: /(如何|怎麼|怎樣|下一步|改善|修復|調整|面對|處理|做什麼)/ },
  { id: 'cause', label: '原因', test: /(為什麼|原因|根源|阻礙|卡住|限制|問題在哪|盲點)/ },
  { id: 'trend', label: '走向', test: /(未來|走向|發展|結果|接下來|趨勢|會不會|能否)/ },
];

const READING_TONES = {
  gentle: {
    label: '溫柔陪伴',
    en: 'Gentle',
    lead: '我會用比較溫柔的方式陪你看這題，先不急著逼自己做決定。',
    advice: '今天先做一件能讓自己穩下來的小事。',
  },
  direct: {
    label: '直接點破',
    en: 'Direct',
    lead: '我會直接一點講：這題真正卡住的地方，可能不是你表面問的那件事。',
    advice: '把最不想承認的那個答案寫下來，先不要急著美化它。',
  },
  practical: {
    label: '務實行動',
    en: 'Practical',
    lead: '我會把這次解讀收斂成可以執行的方向，不讓它只停在感覺。',
    advice: '把下一步縮到一個 24 小時內能完成的動作。',
  },
};

const CARD_HUMAN_LENSES = {
  0:  { core: '你其實已經站在新階段門口，只是還沒拿到安全感保證。', upright: '可以先小步試，不必等到完全準備好。', reversed: '先別用衝動假裝勇敢，也別用害怕假裝理性。', action: '做一個低風險的嘗試。', watch: '不要把未知直接解讀成危險。' },
  1:  { core: '你手上不是沒有資源，而是還沒把資源集中成一個明確動作。', upright: '主動開口、整合工具、把想法落地。', reversed: '你可能在懷疑自己，或被漂亮話帶偏。', action: '列出你現在真正能動用的三個資源。', watch: '別把準備工作當成拖延。' },
  2:  { core: '答案已經在你的直覺裡，只是外界太吵。', upright: '先觀察，不急著表態。', reversed: '你可能明明有感覺，卻一直說服自己不要相信。', action: '留一點安靜時間，把直覺和焦慮分開。', watch: '不要把沉默誤認成沒答案。' },
  3:  { core: '這件事需要滋養，不是只靠意志硬推。', upright: '讓事情長出來，而不是一直催它快點證明成果。', reversed: '你可能付出過頭，卻忘了自己也需要被照顧。', action: '補回能量、資源和耐心。', watch: '別把照顧別人變成消耗自己。' },
  4:  { core: '問題需要結構、界線和負責任的決策。', upright: '定規則、排優先順序，別讓事情散掉。', reversed: '太控制或太放任都會讓局面失衡。', action: '把不可退讓的底線寫清楚。', watch: '不要用強硬掩飾不安。' },
  5:  { core: '你需要一套可依靠的方法，或一個比你有經驗的人。', upright: '傳統、制度、老師或前輩能幫你少走冤枉路。', reversed: '別人的標準不一定適合你，你要分辨哪些規則已經過期。', action: '找一個可信的參照系。', watch: '不要為了合群放棄自己的真實感。' },
  6:  { core: '這張牌在問：你的選擇有沒有忠於真正的價值觀。', upright: '真誠連結會讓答案變清楚。', reversed: '關係或選擇裡可能有失衡、逃避或自我背叛。', action: '把你真正想要的和正在妥協的分開。', watch: '不要把心動誤認成適合。' },
  7:  { core: '現在需要方向感，不只是努力。', upright: '目標清楚時，你有能力推進。', reversed: '你可能同時想往太多方向，結果哪裡都到不了。', action: '只選一個主戰場。', watch: '別把硬撐當成掌控。' },
  8:  { core: '真正的力量不是壓下去，而是穩穩地接住。', upright: '用溫柔但堅定的方式面對。', reversed: '你可能已經累到開始懷疑自己。', action: '先安撫情緒，再談解決。', watch: '不要因為怕衝突就一直退讓。' },
  9:  { core: '你需要往內找答案，而不是一直問外界認不認可。', upright: '獨處會讓你看見真正重要的線索。', reversed: '你可能把自己關太久，或害怕面對內在聲音。', action: '暫時降低噪音，留下能思考的空間。', watch: '不要把孤立包裝成清醒。' },
  10: { core: '局勢正在轉動，你能控制的是姿態，不是整個輪子。', upright: '順勢而為，抓住正在開的門。', reversed: '越抗拒變化，越容易卡在同一個循環。', action: '辨認哪個變化已經不可逆。', watch: '不要把暫時不穩看成全盤失敗。' },
  11: { core: '這題需要誠實、對等和清楚的責任。', upright: '把事實攤開，答案會比想像中簡單。', reversed: '你可能在逃避某個代價，或承受不公平。', action: '回到證據、承諾和邊界。', watch: '不要只挑自己想看的事實。' },
  12: { core: '卡住不一定是壞事，它可能是在逼你換角度。', upright: '先暫停，答案會從另一個視角浮出來。', reversed: '你可能正在做不必要的犧牲。', action: '問自己：我到底在等什麼？', watch: '不要把拖延說成臣服。' },
  13: { core: '某個舊模式已經走到尾聲，繼續抓著只會更累。', upright: '結束不是懲罰，是替新階段騰空間。', reversed: '你可能知道該放手，卻還在跟過去談條件。', action: '明確停止一個不再服務你的習慣。', watch: '不要把失去和失敗畫上等號。' },
  14: { core: '這件事需要調和，不需要極端答案。', upright: '慢慢混合兩邊需求，會出現第三條路。', reversed: '失衡已經很明顯，不能再靠忍耐撐過去。', action: '把節奏調回可長期維持。', watch: '不要用過度配合換和平。' },
  15: { core: '你以為被困住，但真正的鎖可能是恐懼、慾望或依賴。', upright: '看清楚自己把權力交給了什麼。', reversed: '你正在有機會脫離一個綁住你的模式。', action: '把成癮、執念或不健康依附說出口。', watch: '不要用短暫快感掩蓋長期代價。' },
  16: { core: '真相正在拆掉不穩的結構。這會痛，但也會清醒。', upright: '不要再替搖搖欲墜的東西補牆。', reversed: '你可能已經看到裂縫，卻還想假裝沒事。', action: '承認哪件事不能再照舊。', watch: '不要把震動都看成壞消息。' },
  17: { core: '你需要的是重新相信，而不是立刻證明。', upright: '療癒和希望正在回來，給自己一點時間。', reversed: '不是沒有光，是你太累所以看不見。', action: '做一件會讓你恢復信心的小事。', watch: '不要因為失望過就拒絕期待。' },
  18: { core: '這題有霧，先別急著下定論。', upright: '情緒、恐懼和想像可能混在一起。', reversed: '霧正在散，你會開始看懂之前不懂的地方。', action: '把事實和腦補分成兩欄。', watch: '不要在不清楚時做永久決定。' },
  19: { core: '這張牌把事情拉回簡單、明亮和生命力。', upright: '你可以更坦率，也可以更相信自己的喜悅。', reversed: '不是沒有好結果，而是你可能被短期低潮遮住。', action: '選擇讓你更有活力的方向。', watch: '不要用過度樂觀跳過細節。' },
  20: { core: '你正在被提醒：該醒來了，別再用舊版本的自己回答新問題。', upright: '回顧、原諒、整合，然後做出更成熟的選擇。', reversed: '你可能聽到內在召喚，卻怕改變後回不了頭。', action: '承認一件你其實早就知道的事。', watch: '不要用自責代替真正的修正。' },
  21: { core: '一個循環正在靠近完成，你需要好好收尾。', upright: '整合經驗，讓成果真正落袋。', reversed: '最後一步拖住了，可能是缺少告別或收尾。', action: '完成一個該完成的結尾。', watch: '不要在快完成時突然否定整段路。' },
};

function inferQuestionContext(question, explicitCategory) {
  const normalized = question || '';
  const categoryRules = [
    ['love', /(感情|愛情|關係|對方|伴侶|復合|分手|喜歡|曖昧|愛|婚|他|她|J)/i],
    ['career', /(工作|事業|職涯|公司|同事|上司|面試|轉職|離職|升遷|案子|客戶)/i],
    ['wealth', /(錢|財|投資|收入|支出|存款|債|價格|成本|生意|業績)/i],
    ['wellness', /(身體|健康|情緒|壓力|焦慮|睡眠|療癒|能量|靈性|平靜)/i],
    ['social', /(朋友|人際|家人|同學|合作|團隊|溝通|衝突|修復)/i],
  ];
  const category = explicitCategory || categoryRules.find(([, rule]) => rule.test(normalized))?.[0] || 'self';
  const intent = QUESTION_INTENTS.find((item) => item.test.test(normalized)) || { id: 'reflection', label: '看見' };
  return {
    category,
    intent: intent.id,
    label: QUESTION_CONTEXTS[category]?.label || '自我',
    intentLabel: intent.label,
  };
}

function getPositionTone(positionName, intent) {
  const pos = positionName || '此刻';
  if (/過去|根基|隱情|核心/.test(pos)) return '先看這件事背後真正的成因';
  if (/現在|處境|自我|你|此刻/.test(pos)) return '它正在描述你現在的狀態';
  if (/行動|建議/.test(pos)) return '它給的是可執行的下一步';
  if (/挑戰|阻礙|希望恐懼/.test(pos)) return '它指出真正卡住的地方';
  if (/未來|走向|結果|結局/.test(pos)) return '它不是定論，而是在說照目前節奏會走向哪裡';
  if (/對方|他人|環境/.test(pos)) return '它把外界或對方的影響拉進來看';
  if (intent === 'decision') return '它在幫你分辨這個選擇背後的代價';
  if (intent === 'action') return '它比較像一個行動提醒';
  if (intent === 'cause') return '它比較像把真正原因翻出來';
  return '它正在補上這個問題的關鍵視角';
}

function buildHumanCardReading(card, position, question, contextInfo) {
  const lens = CARD_HUMAN_LENSES[card.num] || CARD_HUMAN_LENSES[0];
  const ctx = QUESTION_CONTEXTS[contextInfo.category] || QUESTION_CONTEXTS.self;
  const orientation = card.isReversed ? lens.reversed : lens.upright;
  const tone = getPositionTone(position?.name, contextInfo.intent);
  const bridge = contextInfo.intent === 'decision'
    ? '所以這不是單純的好或不好，而是要看你願不願意承擔它帶來的改變。'
    : contextInfo.intent === 'action'
      ? '所以重點不是想更多，而是把下一步縮小到今天真的做得到。'
      : contextInfo.intent === 'cause'
        ? '所以真正的原因可能不在表面事件，而在你一直重複的反應模式。'
        : '所以它給你的不是預言，而是一個更貼近現況的提醒。';

  return `在「${position?.name || '此刻'}」這個位置，${card.name}${card.isReversed ? '逆位' : '正位'}${tone}。針對「${question}」，我會把它翻成比較白話的說法：${lens.core}${orientation} 放到${ctx.field}裡看，${ctx.plain}${bridge} 你現在可以做的是：${lens.action} 但要小心：${lens.watch}`;
}

function buildHumanSynthesis(result) {
  const { spread, question, cards, category, readingTone } = result;
  const contextInfo = inferQuestionContext(question, category);
  const ctx = QUESTION_CONTEXTS[contextInfo.category] || QUESTION_CONTEXTS.self;
  const tone = READING_TONES[readingTone] || READING_TONES.gentle;
  const reversedCount = cards.filter((c) => c.isReversed).length;
  const first = cards[0];
  const last = cards[cards.length - 1];
  const firstLens = CARD_HUMAN_LENSES[first.num] || CARD_HUMAN_LENSES[0];
  const lastLens = CARD_HUMAN_LENSES[last.num] || CARD_HUMAN_LENSES[0];

  const opening = `${tone.lead} 你這題我會先放在「${ctx.label}」來看，而且它比較像是在問「${contextInfo.intentLabel}」。所以我不會只說${first.name}代表什麼，而是直接回到你的問題：「${question}」。${ctx.plain}`;
  const core = `整個牌陣的核心語氣是：${firstLens.core}${first.isReversed ? firstLens.reversed : firstLens.upright} 這表示你現在最需要看見的，不是標準答案，而是你在這件事裡一直重複的姿態。`;
  const flow = cards.length > 1
    ? `中間幾張牌把細節攤開：${cards.slice(1, -1).map((card, idx) => `「${card.name}」在${spread.positions[idx + 1].name}`).join('、') || '這是一張牌的直接回應'}。${reversedCount ? `有 ${reversedCount} 張逆位，代表有些能量不是不能動，而是還卡在心裡、關係裡或習慣裡。` : '幾乎都是正位，代表事情已經很清楚，真正差的是行動和承認。'}`
    : `${first.name}單獨出現時，訊息很集中：它不是叫你把事情想得更玄，而是要你看清楚現在最該面對的那一點。`;
  const advice = `最後用「${last.name}」收束，我會給你一句比較像真人會說的建議：${lastLens.action} ${last.isReversed ? '先不要逼自己立刻有漂亮答案，逆位比較像在說：你要先把卡住的地方鬆開。' : '如果你照這個方向走，事情不一定立刻完美，但會更接近你的真實狀態。'}`;
  const close = `總結來說，這副牌不是在替你決定命運，而是在提醒你：${ctx.action} ${tone.advice} 你可以把這次解讀當成一段對話，而不是判決。`;
  return [opening, core, flow, advice, close];
}

function buildFollowUpQuestions(result) {
  const contextInfo = inferQuestionContext(result.question, result.category);
  const first = result.cards[0];
  const last = result.cards[result.cards.length - 1];
  const byIntent = {
    decision: [
      `如果我選擇繼續，真正要承擔的代價是什麼？`,
      `如果我選擇離開，我最害怕失去的是什麼？`,
    ],
    action: [
      `我今天可以做的第一個小步驟是什麼？`,
      `我現在最該停止的行為模式是什麼？`,
    ],
    cause: [
      `這件事真正的根源是外在事件，還是我的反應模式？`,
      `我一直看不見的盲點是什麼？`,
    ],
    trend: [
      `如果照目前狀態走下去，三個月後會形成什麼局面？`,
      `我要改變哪個習慣，才會讓走向不同？`,
    ],
    reflection: [
      `我此刻最需要承認的真相是什麼？`,
      `這張牌提醒我不要再逃避什麼？`,
    ],
  };
  const contextual = {
    love: `在這段關係裡，我真正想被怎麼對待？`,
    career: `這份工作現在是在滋養我，還是在消耗我？`,
    wealth: `我對金錢的焦慮，真正來自哪一種不安全感？`,
    wellness: `我的身體或情緒正在替我說出哪句話？`,
    social: `這段互動裡，我需要重新設定什麼界線？`,
    self: `如果我不再取悅任何人，我會怎麼選？`,
  };
  return [
    ...(byIntent[contextInfo.intent] || byIntent.reflection),
    contextual[contextInfo.category],
    `如果用「${first?.name || '第一張牌'}」到「${last?.name || '最後一張牌'}」當線索，我下一次最適合追問什麼？`,
  ];
}

const HISTORY_FIXTURES = [
  { id: 'h7', date: '2026.04.23', time: '23:14', spread: '凱爾特十字', question: '我該接受這個工作機會嗎？', cards: ['命運之輪', '高塔', '星星'], mood: '焦慮 → 釋然', summary: '輪轉已啟動，舊結構崩塌正是新生開始。' },
  { id: 'h6', date: '2026.04.21', time: '08:02', spread: '時間三象', question: '與 J 的關係將走向何處？', cards: ['戀人', '吊人', '太陽'], mood: '困惑', summary: '需要從不同角度看待，光明終將降臨。' },
];

const HISTORY_STORAGE_KEY = 'lumen_arcana_reading_history_v1';

function formatReadingDate(ts) {
  const date = new Date(ts);
  return {
    date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
    time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
  };
}

function summarizeReading(result) {
  const first = result.cards[0];
  const contextInfo = inferQuestionContext(result.question, result.category);
  const lens = CARD_HUMAN_LENSES[first?.num] || CARD_HUMAN_LENSES[0];
  return `這題偏向「${contextInfo.label}／${contextInfo.intentLabel}」。${first?.name || '這張牌'}提醒你：${lens.core}${first?.isReversed ? lens.reversed : lens.upright} 下一步可以先做：${lens.action}`;
}

function resultToHistoryEntry(result) {
  const stamped = formatReadingDate(result.ts || Date.now());
  return {
    id: `r-${result.ts || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: result.ts || Date.now(),
    date: stamped.date,
    time: stamped.time,
    spread: result.spread.name,
    spreadId: result.spread.id,
    category: result.category || inferQuestionContext(result.question).category,
    readingTone: result.readingTone || 'gentle',
    question: result.question,
    cards: result.cards.map((c) => c.name),
    cardDetails: result.cards.map((c) => ({
      num: c.num,
      name: c.name,
      isReversed: !!c.isReversed,
    })),
    mood: `${result.cards.filter((c) => c.isReversed).length} 張逆位`,
    summary: summarizeReading(result),
  };
}

function loadReadingHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Unable to load reading history', err);
    return [];
  }
}

function saveReadingHistory(result) {
  const entry = resultToHistoryEntry(result);
  const history = loadReadingHistory();
  const next = [entry, ...history].slice(0, 60);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  return entry;
}

function deleteReadingHistory(id) {
  const next = loadReadingHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function getDailyCard() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return drawCards(1, seed)[0];
}

Object.assign(window, {
  MAJOR_ARCANA,
  SPREADS,
  drawCards,
  HISTORY_FIXTURES,
  getDailyCard,
  loadReadingHistory,
  saveReadingHistory,
  deleteReadingHistory,
  resultToHistoryEntry,
  inferQuestionContext,
  buildHumanCardReading,
  buildHumanSynthesis,
  buildFollowUpQuestions,
  READING_TONES,
});
