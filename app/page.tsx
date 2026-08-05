import WaterSort from "./WaterSort";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <section className="flex flex-col items-start justify-center pt-4 pb-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Creative <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Portfolio.
          </span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          專注於 AI 工具開發與現代前端工程。探索技術的邊界，將複雜的邏輯轉化為俐落的使用者體驗。
        </p>
        <a 
          href="#projects" 
          className="px-8 py-3 rounded-md bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
        >
          查看作品集
        </a>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-10">
        <h2 className="text-2xl font-mono font-bold mb-10 flex items-center gap-3">
          <span className="text-cyan-500">{">"}</span> 作品分類瀏覽
        </h2>

        {/* Categories Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-cyan-500">#</span> 工具 (Tools)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Project Card 2: AI 影音素材庫與自動化爬蟲 */}
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between">
              <div>
                <div className="h-48 bg-neutral-950 border-b border-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-transparent transition-all duration-300 z-10"></div>
                  <img 
                    src="/material-downloader.png" 
                    alt="AI 影音素材庫專案介面" 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">AI 影音素材庫與自動化爬蟲</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v2.0.0</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    整合 YAMNet AI 音訊特徵分析與 SQLite WAL 並發資料庫的內部素材檢索庫。內建雙向中文標籤翻譯，並採用賽博龐克 FUI 介面。
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Python</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Streamlit FUI</span>
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">YAMNet AI</span>
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SQLite</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-4 pt-4">
                <a 
                  href="https://material-downloader-ttnv95mw5cqepbglpwog2j.streamlit.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all"
                >
                  <span>開啟系統 (Live Demo)</span>
                  <span>↗</span>
                </a>
                <span className="text-xs font-mono text-neutral-500">Streamlit Cloud</span>
              </div>
            </div>

            {/* New Project: PivotLens Stock App */}
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between">
              <div>
                <div className="h-48 bg-neutral-950 border-b border-neutral-800 relative overflow-hidden flex items-center justify-center">
                  <div className="text-neutral-500 text-sm font-mono">APP PREVIEW</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">PivotLens Stock App</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v1.0.0</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    即時股票數據分析平台，提供專業的 Pivot Lens 技術指標視覺化工具。
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Python</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Streamlit</span>
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Data Analysis</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-4 pt-4">
                <a 
                  href="https://pivotlens-stock-app-jynp9vfi7zghuaums3kgrk.streamlit.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all"
                >
                  <span>開啟系統 (Live Demo)</span>
                  <span>↗</span>
                </a>
                <span className="text-xs font-mono text-neutral-500">Streamlit Cloud</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-cyan-500">#</span> 遊戲 (Games)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Card 1: AI 視覺小說引擎 */}
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between">
              <div>
                <div className="h-48 bg-neutral-950 border-b border-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-transparent transition-all duration-300 z-10"></div>
                  <img 
                    src="/visual-novel.png" 
                    alt="AI 視覺小說引擎介面" 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">AI 視覺小說引擎</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v1.0.0</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    基於 Next.js 與自動化管道建構的現代網頁視覺小說框架。支援結構化劇本解析、動態背景音效與沉浸式互動介面。
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Next.js</span>
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Tailwind</span>
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Python Pipeline</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-4 pt-4">
                <a 
                  href="https://game-visual-novel.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all"
                >
                  <span>立即遊玩 (Live Demo)</span>
                  <span>↗</span>
                </a>
                <span className="text-xs font-mono text-neutral-500">Vercel Deployed</span>
              </div>
            </div>

            {/* Project Card 3: AI 製作倒水遊戲 */}
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between">
              <div>
                <div className="h-48 bg-neutral-950 border-b border-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-transparent transition-all duration-300 z-10"></div>
                  <img 
                    src="/water-sort.png" 
                    alt="AI 製作倒水遊戲介面" 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">AI 製作倒水遊戲</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v1.0.0</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    用GOOGLE GEMINI搭配HERMES AGENT，花一天製作市面上流行的倒水遊戲。
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Next.js</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Tailwind</span>
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">React</span>
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Typescript</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-4 pt-4">
                <a 
                  href="https://water-sort-local.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all"
                >
                  <span>立即遊玩 (Live Demo)</span>
                  <span>↗</span>
                </a>
                <span className="text-xs font-mono text-neutral-500">Vercel Deployed</span>
              </div>
            </div>

            {/* New Project: Hex Grid Tactical Game */}
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between">
              <div>
                <div className="h-48 bg-neutral-950 border-b border-neutral-800 relative overflow-hidden flex items-center justify-center">
                  <div className="text-neutral-500 text-sm font-mono">TACTICAL MAP PREVIEW</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">Hex Grid 戰棋遊戲</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v1.0.0</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    基於六角網格（Hex Grid）的策略戰棋網頁遊戲，具備精密的戰術移動與回合制對戰機制。
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Next.js</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Tailwind</span>
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Tactical Strategy</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-4 pt-4">
                <a 
                  href="https://game-hex-grid-4bj7.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all"
                >
                  <span>立即遊玩 (Live Demo)</span>
                  <span>↗</span>
                </a>
                <span className="text-xs font-mono text-neutral-500">Vercel Deployed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
