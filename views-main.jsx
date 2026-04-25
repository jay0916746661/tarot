// ───────────────────── RESULT (WebGPU 預載整合版) ─────────────────────
function ResultView({ result, onNav, onNew }) {
  const [aiInterpretation, setAiInterpretation] = uS('');
  const [loading, setLoading] = uS(true);
  const [localProgress, setLocalProgress] = uS(window.tarotAI.progress);

  uE(() => {
    if (!result) return;

    const checkAndRun = async () => {
      // 如果還在下載，就啟動監聽器直到完成
      if (window.tarotAI.status !== 'ready') {
        const timer = setInterval(() => {
          setLocalProgress(window.tarotAI.progress);
          if (window.tarotAI.status === 'ready') {
            clearInterval(timer);
            generateInterpretation();
          } else if (window.tarotAI.status === 'error') {
            clearInterval(timer);
            setAiInterpretation("召喚失敗。請確認瀏覽器支援 WebGPU (建議使用最新版 Chrome/Edge)。");
            setLoading(false);
          }
        }, 1000);
      } else {
        generateInterpretation();
      }
    };

    const generateInterpretation = async () => {
      setLoading(true);
      try {
        const engine = window.tarotAI.engine;
        const prompt = `你是一位專業且具備同理心的塔羅大師。
使用者提問：「${result.question}」
牌陣：「${result.spread.name}」
抽出的牌：
${result.cards.map((c, i) => `- ${result.spread.positions[i].name}：${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n')}

請結合牌義與牌陣，給出約 300 字優雅的深度解析。`;

        const reply = await engine.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });

        setAiInterpretation(reply.choices[0].message.content);
      } catch (e) {
        setAiInterpretation("解讀過程發生干擾，請嘗試重新占卜。");
      } finally {
        setLoading(false);
      }
    };

    checkAndRun();
  }, [result]);

  return (
    <div className="view-container fade-in">
      <header className="view-header">
        <h2 className="view-title-tc">解 讀 之 章</h2>
      </header>
      
      <div className="ai-synthesis">
        <div className="ai-synthesis-eyebrow">
          <span className={loading ? "ai-pulse loading" : "ai-pulse"} />
          <Eyebrow>WEBGPU ORACLE · 終端靈魂</Eyebrow>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 12 }}>正在連結星辰之腦...</div>
            <div style={{ fontSize: '12px', color: 'var(--mist)' }}>背景載入進度：{localProgress}%</div>
            {localProgress < 100 && <div style={{ fontSize: '10px', marginTop: 10 }}>初次使用需下載模型，請稍候</div>}
          </div>
        ) : (
          <div className="ai-synthesis-body">
            {aiInterpretation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
      </div>

      {/* 這裡保留原本的逐張牌義顯示區塊... */}
      <div className="result-actions">
        <button className="btn-primary" onClick={onNew}>重新占卜</button>
      </div>
    </div>
  );
}
