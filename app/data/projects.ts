export type ProjectCategory = 'games' | 'tools' | 'art';
export type CityDistrict = 'works' | 'expansion';

export type PortfolioProject = {
  id: string;
  title: string;
  category: ProjectCategory;
  featured?: boolean;
  caseStudy?: string;
  cityDistrict?: CityDistrict;
  citySlot?: number;
  description: string;
  tags: string[];
  link: string;
  image: string;
  imageAlt: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: 'left' | 'center';
  badge: string;
  span: string;
  retroBg: string;
  retroColor: string;
};

export const getCityDistrict = (project: PortfolioProject): CityDistrict => project.cityDistrict ?? 'works';

// cityDistrict selects the street; citySlot optionally preserves a specific parcel.
// Add a project here with its preview image in public/project-previews/.
// Every layout and the works-first carousel use this same list.
export const projects: PortfolioProject[] = [
  {
    id: 'hex-grid',
    title: 'Hex Grid 戰棋遊戲',
    category: 'games',
    description: '基於六角網格（Hex Grid）的策略戰棋網頁遊戲，具備精密的戰術移動、回合制對戰與動態路徑計算機制。',
    tags: ['Next.js', 'Tailwind', 'Tactical Strategy'],
    link: 'https://game-hex-grid-4bj7.vercel.app/',
    image: '/project-previews/hex-grid.png',
    imageAlt: 'Hex Grid 戰棋遊戲的戰前部署與六角格地圖',
    badge: 'Featured Game',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    retroBg: 'bg-[#FFE500]',
    retroColor: 'text-black',
  },
  {
    id: 'visual-novel',
    title: 'AI 視覺小說引擎',
    category: 'games',
    description: '現代網頁視覺小說框架。支援結構化劇本解析、動態背景音效與沉浸式互動介面。',
    tags: ['Next.js', 'Tailwind', 'Python Pipeline'],
    link: 'https://game-visual-novel.vercel.app/',
    image: '/project-previews/visual-novel-20261024.jpg',
    imageAlt: '視覺小說新版首頁，左側遊戲選單與右側 Sophia 動態角色',
    imageFit: 'contain',
    badge: 'Engine v1.0',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    retroBg: 'bg-[#FF007F]',
    retroColor: 'text-white',
  },
  {
    id: 'pivotlens',
    title: 'PivotLens 台股選股分析',
    category: 'tools',
    featured: true,
    caseStudy: '/projects/pivotlens',
    description: '以均線轉折與量價雙引擎篩選台股，結合 K 線診斷、歷史訊號統計與每日資料更新的選股分析工具。',
    tags: ['Python', 'Streamlit', 'Data Analysis'],
    link: 'https://pivotlens-stock-app-jynp9vfi7zghuaums3kgrk.streamlit.app/',
    image: '/project-previews/pivotlens.png',
    imageAlt: 'PivotLens 的勝率統計與股價走勢圖',
    badge: 'FinTech',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    retroBg: 'bg-[#00FF66]',
    retroColor: 'text-black',
  },
  {
    id: 'fruit-slot',
    title: '復古水果盤 · Unity 6',
    category: 'games',
    featured: true,
    caseStudy: '/projects/fruit-slot',
    citySlot: 3,
    description: '從 Cocos2d 移植至 Unity 的四排水果盤互動展示，包含 40 條支付線、Wild 判賞、緩衝停輪與復古機台介面。',
    tags: ['Unity 6', 'C#', 'WebGL'],
    link: 'https://unity-fruit-slot.vercel.app/',
    image: '/project-previews/fruit-slot-20261105.png',
    imageAlt: 'Unity 6 復古水果盤正式站的紫金機台、四排水果與支付線',
    imageFit: 'contain',
    badge: 'Unity 6 · WebGL',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    retroBg: 'bg-[#7C3AED]',
    retroColor: 'text-white',
  },
  {
    id: 'material-library',
    title: 'AI 影音素材庫與自動化爬蟲',
    category: 'tools',
    description: '整合 YAMNet AI 音訊特徵分析與 SQLite WAL 並發資料庫的內部素材檢索系統。',
    tags: ['Python', 'YAMNet AI', 'SQLite'],
    link: 'https://material-downloader-ttnv95mw5cqepbglpwog2j.streamlit.app/',
    image: '/project-previews/material-library.png',
    imageAlt: '影音素材庫的狀態、分類、搜尋與結果介面',
    badge: 'Automation',
    span: 'col-span-1 md:col-span-2 lg:col-span-2',
    retroBg: 'bg-[#9D4EDD]',
    retroColor: 'text-white',
  },
  {
    id: 'miffy',
    title: 'Miffy · 互動角色展示',
    category: 'art',
    description: '角色全身動態與六種口形的互動展示，可調整身體、頭部與髮絲動作。',
    tags: ['WebGL', 'Character Art', 'Interactive Motion'],
    link: '/miffy-demo/',
    image: '/project-previews/miffy.png',
    imageAlt: 'Miffy 全身角色與互動動態控制面板',
    imagePosition: 'left',
    badge: 'Interactive Art',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    retroBg: 'bg-[#F7A8C4]',
    retroColor: 'text-black',
  },
  {
    id: 'mimi',
    title: 'Mimi · 互動角色展示',
    category: 'art',
    featured: true,
    caseStudy: '/projects/mimi',
    description: '原生高解析分層角色動態，包含肩膀、裙襬與髮梢擺動；嘟嘴表情依序先閉眼、再嘟嘴。階段展示中。',
    tags: ['WebGL', 'Character Art', 'Motion Preview'],
    link: '/mimi-demo/',
    image: '/project-previews/mimi-v95-20261107.png',
    imageAlt: 'Mimi v95 的完整角色動態展示與互動控制面板',
    imagePosition: 'left',
    badge: '階段展示 · v95',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    retroBg: 'bg-[#C9B2FF]',
    retroColor: 'text-black',
  },
  {
    id: 'eris',
    title: 'Eris · AI 角色分層互動展示',
    category: 'art',
    description: '以語義 RGBA 圖層、WebGL 變形與受限視線／眨眼系統打造的即時 2D 角色展示。支援呼吸、髮絲、姿勢、視線與核准的肩頸修補。',
    tags: ['WebGL', 'RGBA Layers', 'Interactive Rig'],
    link: '/eris-demo/',
    image: '/project-previews/eris-20261005.png',
    imageAlt: 'Eris 角色在互動展示中的完整站姿',
    imageFit: 'contain',
    badge: 'AI Art Rig',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    retroBg: 'bg-[#9D4EDD]',
    retroColor: 'text-white',
  },
  {
    id: 'water-sort',
    title: 'AI 製作倒水遊戲',
    category: 'games',
    cityDistrict: 'expansion',
    citySlot: 3,
    description: '結合 Gemini 與自動化驗證的益智倒水遊戲，支援多層次關卡編輯器與防死鎖演算法。',
    tags: ['Next.js', 'React', 'Puzzle'],
    link: 'https://water-sort-local.vercel.app/',
    image: '/project-previews/water-sort-game.png',
    imageAlt: '倒水遊戲的彩色水柱與關卡選擇介面',
    badge: 'Casual',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    retroBg: 'bg-[#00F0FF]',
    retroColor: 'text-black',
  },
];
