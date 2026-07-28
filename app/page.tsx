export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <section className="flex flex-col items-start justify-center pt-10 pb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          SYSTEM.ONLINE
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Building <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Intelligent Systems.
          </span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          專注於 AI 工具開發與現代前端工程。探索技術的邊界，將複雜的邏輯轉化為俐落的使用者體驗。
        </p>
        <button className="px-8 py-3 rounded-md bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
          INITIATE_CONTACT()
        </button>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-10">
        <h2 className="text-2xl font-mono font-bold mb-10 flex items-center gap-3">
          <span className="text-cyan-500">{">"}</span> 專案展示
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Card */}
          <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="h-48 bg-neutral-950 flex items-center justify-center border-b border-neutral-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-transparent z-10"></div>
              <span className="text-neutral-600 font-mono text-sm">[ IMAGE RENDER_PORT ]</span>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">AI 視覺小說引擎</h3>
                <span className="text-xs font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">v1.0.0</span>
              </div>
              <p className="text-neutral-400 text-sm mb-6 line-clamp-2">
                基於 Next.js 與 Python 腳本自動化建構的現代視覺小說框架，支援 CSV 劇本解析與智慧型資源預載。
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Next.js</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Tailwind</span>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Python</span>
              </div>
              <a href="#" className="inline-flex items-center text-sm font-bold text-neutral-300 hover:text-cyan-400 transition-colors">
                View Source <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
