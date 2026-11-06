export type CaseStudy = {
  id: string;
  discipline: string;
  heading: string;
  introduction: string;
  status: string;
  scope: string[];
  facts: { value: string; label: string }[];
  decisions: { title: string; problem: string; approach: string }[];
  result: string;
  next: string;
  collaboration: string;
  source: { label: string; href: string };
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'fruit-slot',
    discipline: 'GAME DEVELOPMENT',
    heading: '把舊遊戲邏輯，重新組成一台水果機。',
    introduction: '從 Cocos2d-x Quick Lua 的既有水果機出發，在 Unity 6 重構規則與轉輪，補上完整四排判賞，再以復古機台介面帶到瀏覽器中。',
    status: '互動原型 · 已上線',
    scope: ['移植與規則整理', '轉輪與判賞實作', '機台介面與 WebGL 發布'],
    facts: [{ value: '5 × 4', label: '五軸、四排完整盤面' }, { value: '40', label: '固定支付線' }, { value: 'Unity 6', label: 'C# / WebGL' }],
    decisions: [
      {
        title: '讓畫面中的四排，都參與判賞',
        problem: '原先盤面顯示四排，支付線卻只涵蓋上方三排；規則與訪客看見的畫面並不一致。',
        approach: '整理為 40 條固定支付線，每一排都有橫線，也加入折線。鈴鐺保留 Wild 的例外規則，不替代 GOOD LUCK 與 BAR，並在介面中明確說明。',
      },
      {
        title: '找出停輪疊格與缺圖的原因',
        problem: '轉輪停在半格位置時，各圖案分別取整，可能讓兩張圖疊在同一格，另一格空缺，回合因盤面不完整而停住。',
        approach: '改成整軸共用同一相位、格點與停輪位移，保持相鄰圖案的固定間距；保留完整盤面檢查，再以邊界案例與實際場景回歸驗證。',
      },
      {
        title: '讓遊戲的狀態一眼可讀',
        problem: '純功能介面不易讓人理解機台操作；預覽支付線與真正中獎的路徑也需要清楚區別。',
        approach: '整合紫金機框、兩側線號與大型 START／STOP；將支付線與命中框加粗，保留主動選線預覽，並在載入時呈現進度，啟動完成後關閉提示。',
      },
    ],
    result: '完成可直接在瀏覽器操作的機台展示。停輪修正的紀錄包含 12 項 PlayMode 測試通過，以及實際機台場景的 100 輪加速回歸；這些屬於 Unity 測試紀錄，並非 100 輪人工網頁操作。',
    next: '目前聚焦轉輪、連線判定與互動展示，沒有金幣帳本或實際金錢結算。手機建議橫向觀看，真機操作仍是後續驗證項目。',
    collaboration: '以需求確認、程式實作、錯誤重現與回歸驗證的方式迭代；AI 協助程式修改與查核，判賞例外、四排規則與機台外觀由專案需求逐步確認。',
    source: { label: '原始碼與重構紀錄', href: 'https://github.com/YusukeWu0903/Cocos2d-to-Unity-Slot-Refactoring/tree/codex/unity6-upgrade' },
  },
  {
    id: 'mimi',
    discipline: 'INTERACTIVE CHARACTER ART',
    heading: '讓角色原畫，從靜態走進互動。',
    introduction: '以 Mimi 的角色圖層為基礎，透過 WebGL 網格變形組合身體、肩膀、裙襬與髮梢的細微動態，探索從靜態美術到可操作角色的製作流程。',
    status: 'v95 · 階段展示',
    scope: ['角色分層與組裝', '局部變形與動態調整', '表情時序與互動展示'],
    facts: [{ value: '1280', label: '原生貼圖尺寸' }, { value: 'WebGL', label: '分層與網格變形' }, { value: 'v95', label: '目前展示階段' }],
    decisions: [
      {
        title: '把靜態圖層組成能活動的角色',
        problem: '角色的身體、衣料與頭髮需要一起活動，同時維持圖層之間的遮擋與連接。',
        approach: '以圖層組裝與局部變形場分別控制身體、肩膀、裙襬及髮梢，再將它們整合到同一個即時展示器中，提供暫停、重置與參數調整。',
      },
      {
        title: '表情需要順序，而不只是換圖',
        problem: '嘟嘴若直接和其他表情同時切換，容易產生突兀的過渡；眼睛與嘴型需要有明確的先後關係。',
        approach: '加入「先閉眼、再嘟嘴」的表情時序，回到原始表情時也分階段處理，讓眼睛與嘴型的切換可以分別調整與檢視。',
      },
      {
        title: '保留可以比較與修正的展示階段',
        problem: '美術動態的品質不能只靠程式通過，髮絲接縫、變形與表情節奏都需要直接觀看。',
        approach: '將目前版本標示為階段展示，保留參數控制與回到原位的操作；視線跟隨維持停用，待確認的髮絲修正與表情過渡如實列出。',
      },
    ],
    result: '完成可在網頁操作的角色動態展示，包含身體、肩膀、裙襬、髮梢與表情控制。訪客可以直接暫停動態、調整參數，觀察靜態圖層如何組成活動角色。',
    next: '目前仍為 v95 階段展示：視線跟隨停用，髮絲修正與閉眼／嘟嘴節奏仍待視覺驗收。這個版本呈現製作進度，尚未宣稱為完成的角色綁定成品。',
    collaboration: 'AI 輔助美術與程式迭代，配合逐步檢視與版本保留；作品重點是角色分層、動態組裝與互動驗證的整合流程。',
    source: { label: '展示原始碼與版本資料', href: 'https://github.com/YusukeWu0903/my_portfolio/tree/main/public/mimi-demo' },
  },
  {
    id: 'pivotlens',
    discipline: 'DATA TOOLS & AUTOMATION',
    heading: '把台股量價資料，整理成可探索的選股條件。',
    introduction: 'PivotLens 是台股均線轉折選股系統，將量價策略、篩選條件、K 線診斷與歷史訊號統計放進同一個 Streamlit 介面，並以排程整理每日資料。',
    status: '台股分析工具 · 已上線',
    scope: ['量價策略與條件整理', '資料快取與更新流程', '互動篩選與統計介面'],
    facts: [{ value: '雙引擎', label: '潛伏與動能策略' }, { value: '5 / 10 / 20', label: '歷史訊號觀察期數' }, { value: 'Python', label: 'Streamlit / Parquet' }],
    decisions: [
      {
        title: '讓策略條件可以被理解與比較',
        problem: '只有股票清單，難以理解為何入選，也不方便比較不同週期與量價條件。',
        approach: '區分拉回支撐／反彈遇壓的潛伏引擎，與創高／破底的動能引擎，配合流動性、量縮及 K 棒條件，將篩選結果與圖表診斷放在一起。',
      },
      {
        title: '把資料更新與畫面操作分開',
        problem: '每次調整條件都重新下載市場資料或重跑全部計算，會增加等待，也讓雲端展示更難維護。',
        approach: '以 Parquet 保存市場資料，使用 Streamlit 快取處理讀取與基礎掃描；GitHub Actions 負責分輪更新，介面依資料變更重新計算，並顯示資料日期。',
      },
      {
        title: '讓統計對應目前的篩選條件',
        problem: '歷史統計若與畫面中的條件不一致，數字就失去比較的意義。',
        approach: '依所選條件回算近一年歷史訊號，呈現 5／10／20 期結果，讓使用者搭配 K 線與資料日期檢視，而非只看單一比例。',
      },
    ],
    result: '將資料讀取、策略掃描、條件篩選與結果圖表整合成可操作的選股工具，並建立 GitHub Actions 到 Streamlit 的每日資料更新流程。',
    next: '展示以每日市場快取為基礎，資料新鮮度以 App 顯示日期為準；歷史訊號統計用於分析比較，不代表未來交易結果。',
    collaboration: '以策略條件整理、資料管線與介面驗證持續迭代，搭配 AI 協助開發與文件整理；案例著重資料如何從更新流程進入可操作的分析介面。',
    source: { label: '原始碼與系統說明', href: 'https://github.com/YusukeWu0903/PivotLens-stock-app' },
  },
];
