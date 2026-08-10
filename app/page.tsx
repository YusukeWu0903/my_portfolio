'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Wrench, 
  ExternalLink, 
  Sparkles, 
  ArrowUpRight,
  Zap,
  Activity,
  LayoutGrid,
  BookOpen,
  ChevronDown
} from 'lucide-react';

export default function Home() {
  const [layoutMode, setLayoutMode] = useState<'cyberpunk' | 'editorial'>('cyberpunk');
  const [activeTab, setActiveTab] = useState<'all' | 'games' | 'tools'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const projects = [
    {
      title: "Hex Grid 戰棋遊戲",
      category: "games",
      description: "基於六角網格（Hex Grid）的策略戰棋網頁遊戲，具備精密的戰術移動、回合制對戰與動態路徑計算機制。",
      tags: ["Next.js", "Tailwind", "Tactical Strategy"],
      link: "https://game-hex-grid-4bj7.vercel.app/",
      badge: "Featured Game",
      span: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
    },
    {
      title: "AI 視覺小說引擎",
      category: "games",
      description: "現代網頁視覺小說框架。支援結構化劇本解析、動態背景音效與沉浸式互動介面。",
      tags: ["Next.js", "Tailwind", "Python Pipeline"],
      link: "https://game-visual-novel.vercel.app/",
      badge: "Engine v1.0",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: "PivotLens Stock App",
      category: "tools",
      description: "即時股票數據分析平台，提供專業的 Pivot Lens 技術指標視覺化與自動化推導工具。",
      tags: ["Python", "Streamlit", "Data Analysis"],
      link: "https://pivotlens-stock-app-jynp9vfi7zghuaums3kgrk.streamlit.app/",
      badge: "FinTech",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: "AI 製作倒水遊戲",
      category: "games",
      description: "結合 Gemini 與自動化驗證的益智倒水遊戲，支援多層次關卡編輯器與防死鎖演算法。",
      tags: ["Next.js", "React", "Puzzle"],
      link: "https://water-sort-local.vercel.app/",
      badge: "Casual",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: "AI 影音素材庫與自動化爬蟲",
      category: "tools",
      description: "整合 YAMNet AI 音訊特徵分析與 SQLite WAL 並發資料庫的內部素材檢索系統。",
      tags: ["Python", "YAMNet AI", "SQLite"],
      link: "https://material-downloader-ttnv95mw5cqepbglpwog2j.streamlit.app/",
      badge: "Automation",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className={`min-h-screen transition-colors duration-700 relative overflow-hidden font-sans ${
      layoutMode === 'cyberpunk' 
        ? 'bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200' 
        : 'bg-[#12100E] text-[#F5F0EB] selection:bg-amber-500/30 selection:text-amber-200'
    }`}>
      
      {/* Dynamic Background Ambiance */}
      {layoutMode === 'cyberpunk' ? (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[180px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-6 pt-10 pb-32 z-10">
        
        {/* Header Layout Switcher Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-wrap items-center justify-between gap-4 mb-12 p-4 rounded-2xl backdrop-blur-xl border transition-colors duration-500 ${
            layoutMode === 'cyberpunk' 
              ? 'bg-white/[0.02] border-white/10 text-cyan-400' 
              : 'bg-white/[0.03] border-amber-500/20 text-amber-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
              layoutMode === 'cyberpunk' 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {layoutMode === 'cyberpunk' ? <Activity className="w-5 h-5 animate-pulse" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-mono tracking-wider">
                {layoutMode === 'cyberpunk' ? 'SYSTEM_READY // LAUNCHER_v2.5' : 'EDITORIAL_EDITION // VOL. 04'}
              </div>
              <div className={`text-sm font-bold ${layoutMode === 'cyberpunk' ? 'text-zinc-200' : 'text-[#F5F0EB]'}`}>
                {layoutMode === 'cyberpunk' ? 'AI ENGINEERING & GAME CORE' : 'FASHION & WARM ARCHITECTURE'}
              </div>
            </div>
          </div>

          {/* Layout Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono border transition-all duration-300 ${
                layoutMode === 'cyberpunk'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>版型: {layoutMode === 'cyberpunk' ? 'Cyberpunk Launcher' : 'Fashion Editorial'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-60 rounded-2xl border shadow-2xl overflow-hidden z-50 backdrop-blur-2xl ${
                    layoutMode === 'cyberpunk'
                      ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
                      : 'bg-[#1C1815]/90 border-amber-900/40 text-[#F5F0EB]'
                  }`}
                >
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { setLayoutMode('cyberpunk'); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                        layoutMode === 'cyberpunk' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-white/5 text-zinc-400'
                      }`}
                    >
                      <span>⚡ Cyberpunk Launcher</span>
                      {layoutMode === 'cyberpunk' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                    <button
                      onClick={() => { setLayoutMode('editorial'); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                        layoutMode === 'editorial' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-white/5 text-zinc-400'
                      }`}
                    >
                      <span>✨ Fashion Editorial (Warm)</span>
                      {layoutMode === 'editorial' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Layout Switcher Renderer */}
        <AnimatePresence mode="wait">
          {layoutMode === 'cyberpunk' ? (
            /* ==================== CYBERPUNK LAUNCHER LAYOUT ==================== */
            <motion.div
              key="cyberpunk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <section className="flex flex-col items-start justify-center pt-4 pb-16 max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AWWWARDS LEVEL INTERACTIVE SHOWCASE</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                  Engineering <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                    Immersive Realities.
                  </span>
                </h1>

                <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-normal">
                  融合高階 AI 自動化管道與次世代網頁遊戲架構。探索極致流暢的互動體驗與精準的工程美學。
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'all' 
                        ? 'bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_25px_rgba(0,240,255,0.4)]' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>全部專案 (All)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('games')}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'games' 
                        ? 'bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_25px_rgba(0,240,255,0.4)]' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>互動遊戲 (Games)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'tools' 
                        ? 'bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_25px_rgba(0,240,255,0.4)]' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>高階工具 (Tools)</span>
                  </button>
                </div>
              </section>

              {/* Bento Grid */}
              <section className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[340px]">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className={`group relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden flex flex-col justify-between p-8 transition-all duration-500 ${project.span} group-hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex justify-between items-start mb-6">
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 backdrop-blur-md">
                          {project.badge}
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/45 transition-all duration-300">
                          {project.category === 'games' ? <Gamepad2 className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                        </div>
                      </div>

                      <div className="relative z-10 my-auto">
                        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group/btn"
                        >
                          <span>LAUNCH DEMO</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                        <span className="text-xs font-mono text-zinc-500">VERCEL CLOUD</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            /* ==================== EDITORIAL FASHION WARM LAYOUT ==================== */
            <motion.div
              key="editorial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Editorial Hero Section */}
              <section className="flex flex-col items-start justify-center pt-6 pb-20 max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-6">
                  <span>CURATED COLLECTION // 2026 EDITORIAL</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-serif font-light tracking-tight mb-6 leading-[1.15] text-[#F5F0EB]">
                  Timeless Code, <br />
                  <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-orange-400">
                    Warm Aesthetics.
                  </span>
                </h1>

                <p className="text-[#A39B93] text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-light">
                  以大地暖色調與優雅雜誌排版（Editorial Magazine）重新定義數位作品集。將頂尖 AI 邏輯與溫潤質感完美交織。
                </p>

                {/* Editorial Filter Tabs */}
                <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4 w-full">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`text-sm font-mono tracking-wider transition-colors pb-2 relative ${
                      activeTab === 'all' ? 'text-amber-300 font-bold' : 'text-[#A39B93] hover:text-[#F5F0EB]'
                    }`}
                  >
                    [01] ALL WORKS
                    {activeTab === 'all' && <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-amber-400" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('games')}
                    className={`text-sm font-mono tracking-wider transition-colors pb-2 relative ${
                      activeTab === 'games' ? 'text-amber-300 font-bold' : 'text-[#A39B93] hover:text-[#F5F0EB]'
                    }`}
                  >
                    [02] INTERACTIVE GAMES
                    {activeTab === 'games' && <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-amber-400" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className={`text-sm font-mono tracking-wider transition-colors pb-2 relative ${
                      activeTab === 'tools' ? 'text-amber-300 font-bold' : 'text-[#A39B93] hover:text-[#F5F0EB]'
                    }`}
                  >
                    [03] CRAFTED TOOLS
                    {activeTab === 'tools' && <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-amber-400" />}
                  </button>
                </div>
              </section>

              {/* Editorial Magazine Grid */}
              <section className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group relative rounded-3xl border border-amber-500/15 bg-[#1C1815]/60 backdrop-blur-md p-10 flex flex-col justify-between transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_10px_40px_rgba(245,158,11,0.08)]"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-8">
                          <span className="text-xs font-mono tracking-widest text-amber-400/80 uppercase">
                            // 0{index + 1} — {project.badge}
                          </span>
                          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {project.category.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-3xl font-serif font-light mb-4 group-hover:text-amber-200 transition-colors text-[#F5F0EB]">
                          {project.title}
                        </h3>

                        <p className="text-[#A39B93] text-base leading-relaxed mb-8 font-light">
                          {project.description}
                        </p>

                        <div className="flex gap-2 flex-wrap mb-10">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4CFC7]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-mono tracking-wider text-amber-300 hover:text-amber-200 transition-colors group/link"
                        >
                          <span className="border-b border-amber-400/40 pb-0.5 group-hover/link:border-amber-300">EXPLORE LIVE EXPERIENCE</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                        <span className="text-xs font-mono text-[#78716C]">EDITION 2026</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mt-32 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono transition-colors duration-500 ${
            layoutMode === 'cyberpunk' ? 'border-white/10 text-zinc-500' : 'border-white/10 text-[#78716C]'
          }`}
        >
          <div>© 2026 CREATIVE PORTFOLIO. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-6">
            <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">CURATED WITH PASSION</span>
            <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">DUAL-MODE ARCHITECTURE</span>
          </div>
        </motion.footer>

      </main>
    </div>
  );
}
