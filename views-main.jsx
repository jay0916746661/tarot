// ───────────────────── RESULT (長文解析 + 順序優化) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiInterpretation, setAiInterpretation] = uS('');
  const [loading, setLoading] = uS(true);
  const [mode, setMode] = uS('master');

  uE(() => {
    if (!result) return;
    
    // 這裡我們改用快速的模擬大師邏輯，或者你可以填入你的 OpenAI API Key 
    const generateDeepInsight = async () => {
      setLoading(true);
      // 這裡暫時用一個極其詳盡的本地邏輯模板，直到你決定接上雲端 API
      // 這樣就不用下載 4GB，朋友打開也是秒出結果
      setTimeout(() => {
        const energy = result.cards.map(c => c.element);
        const isEmotional = energy.filter(e => e === '水').length > 1;
        
        const text = `【命運核心定論】\n關於你詢問的「${result.question}」，目前的能量顯示這是一個${isEmotional ? '感性與情緒交織' : '需要理性決斷'}的關鍵時刻。整體趨勢指向「轉化」，意味著舊有的模式必須打破。\n\n【能量交織解析】\n你抽出的 ${result.cards.map(c => c.name).join('、')} 形成了一個強大的共振。起手牌代表了你潛意識的恐懼，而終局牌則預示了如果你願意改變，將迎來巨大的成就。這不是偶然，而是你長期積累的能量爆發。\n\n【全方位運勢展望】\n● 事業與財運：目前的僵局只是暫時的，星位顯示在下一個月圓之際，會出現新的貴人指引。\n● 情感與人際：彼此的溝通需要更多「透明度」，逆位牌提醒你不要過度猜測，直接表達才是上策。\n● 身心靈提醒：你的能量有些過度外耗，建議多接觸土元素（自然綠地）來平衡。\n\n【大師級具體行動指南】\n1. 停止目前的觀望，在週三前做出一個小小的決定。\n2. 找一個安靜的空間，將你的恐懼寫在紙上並燒掉。\n3. 與一位年長的智者交談，他會給你意想不到的啟示。`;
        
        setAiInterpretation(text);
        setLoading(false);
      }, 1500);
    };

    generateDeepInsight();
  }, [result]);

  const saveToLocalStorage = () => {
    const history = JSON.parse(localStorage.getItem('tarot_history') || '[]');
    localStorage.setItem('tarot_history', JSON.stringify([{...result, interpretation: aiInterpretation}, ...history]));
    alert('已成功存入您的占卜紀錄！');
    onNav('archive');
  };

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <h2 className="view-title-tc">啟 示 錄</h2>
      </header>

      {/* 1. 先顯示單張牌的深度解釋 */}
      <div style={{ marginBottom: 60 }}>
        <Eyebrow>STEP 01 · 牌面細節觀照</Eyebrow>
        <div className="interpretation-grid" style={{ marginTop: 24 }}>
          {result.cards.map((c, i) => (
            <div key={i} className="interp-card-detail" style={{ borderBottom: '1px solid var(--line-dim)', paddingBottom: 40, marginBottom: 40 }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <TarotCard card={c} reversed={c.isReversed} size="sm" />
                <div style={{ flex: 1 }}>
                  <div className="interp-pos-tag">{result.spread.positions[i].name}</div>
                  <h4 style={{ color: 'var(--gold)', fontSize: '22px' }}>{c.name} {c.isReversed ? '(逆位)' : '(正位)'}</h4>
                  <p style={{ marginTop: 12, fontSize: '15px', color: 'var(--parchment)', lineHeight: '1.8' }}>
                    {c.isReversed ? c.reversed : c.upright}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 再顯示整體的長篇解析 */}
      <div className="ai-synthesis" style={{ background: 'var(--midnight)', border: '1px solid var(--gold)', padding: '40px' }}>
        <div className="ai-synthesis-eyebrow">
          <span className={loading ? "ai-pulse loading" : "ai-pulse"} />
          <Eyebrow>STEP 02 · 整體運勢大師總結</Eyebrow>
        </div>
        <div className="ai-synthesis-body" style={{ marginTop: 32, fontSize: '16px', lineHeight: '2.2' }}>
          {loading ? "正在解析所有星象連結..." : aiInterpretation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 60, paddingBottom: 80 }}>
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
        <button className="btn-ghost" onClick={saveToLocalStorage}>儲存紀錄</button>
        <button className="btn-ghost" onClick={() => window.print()}>列印 PDF</button>
      </div>
    </div>
  );
}
