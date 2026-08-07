'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Wrench, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all' | 'games' | 'tools'>('all');

  const projects = [
    {
      title: "Hex Grid 戰棋遊戲",
      category: "games",
      description: "基於六角網格（Hex Grid）的策略戰棋網頁遊戲，具備精密的戰術移動、回合制對戰與動態路徑計算機制。",
      tags: ["Next.js", "Tailwind", "Tactical Strategy"],
      link: "https://game-hex-grid-4bj7.vercel.app/",
      badge: "Featured Game",
      span: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      borderColor: "group-hover:border-cyan-400/50",
      shadow: "hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]",
      image: "/water-sort.png"
    },
    {
      title: "AI 視覺小說引擎",
      category: "games",
      description: "現代網頁視覺小說框架。支援結構化劇本解析、動態背景音效與沉浸式互動介面。",
      tags: ["Next.js", "Tailwind", "Python Pipeline"],
      link: "https://game-visual-novel.vercel.app/",
      badge: "Engine v1.0",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      borderColor: "group-hover:border-purple-400/50",
      shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]",
      image: "/visual-novel.png"
    },
    {
      title: "PivotLens Stock App",
      category: "tools",
      description: "即時股票數據分析平台，提供專業的 Pivot Lens 技術指標視覺化與自動化推導工具。",
      tags: ["Python", "Streamlit", "Data Analysis"],
      link: "https://pivotlens-stock-app-jynp9vfi7zghuaums3kgrk.streamlit.app/",
      badge: "FinTech",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "group-hover:border-emerald-400/50",
      shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
      image: "/material-downloader.png"
    },
    {
      title: "AI 製作倒水遊戲",
      category: "games",
      description: "結合 Gemini 與自動化驗證的益智倒水遊戲，支援多層次關卡編輯器與防死鎖演算法。",
      tags: ["Next.js", "React", "Puzzle"],
      link: "https://water-sort-local.vercel.app/",
      badge: "Casual",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      borderColor: "group-hover:border-cyan-400/50",
      shadow: "hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]",
      image: "/water-sort.png"
    },
    {
      title: "AI 影音素材庫與自動化爬蟲",
      category: "tools",
      description: "整合 YAMNet AI 音訊特徵分析與 SQLite WAL 並發資料庫的內部素材檢索系統。",
      tags: ["Python", "YAMNet AI", "SQLite"],
      link: "https://material-downloader-ttnv95mw5cqepbglpwog2j.streamlit.app/",
      badge: "Automation",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
      gradient: "from-rose-500/20 via-orange-500/10 to-transparent",
      borderColor: "group-hover:border-rose-400/50",
      shadow: "hover:shadow-[0_0_40px_rgba(255,0,60,0.2)]",
      image: "/material-downloader.png"
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden font-sans">
      
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[700px] bg-rose-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-6 pt-16 pb-32 z-10">
        
        {/* Top Launcher Header Status Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-12 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM_READY // LAUNCHER_v2.5</div>
              <div className="text-sm font-bold text-zinc-200">AI ENGINEERING & GAME CORE</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ONLINE VERCEL CLOUD
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-start justify-center pt-4 pb-16 max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AWWWARDS LEVEL INTERACTIVE SHOWCASE</span>
          </motion.div>

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
        </motion.section>

        {/* Bento Grid Projects Section */}
        <section id="projects" className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[340px]">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden flex flex-col justify-between p-8 transition-all duration-500 ${project.span} ${project.borderColor} ${project.shadow}`}
              >
                {/* Ambient Card Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

                {/* Top Badge & Icon */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 backdrop-blur-md">
                    {project.badge}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-all duration-300">
                    {project.category === 'games' ? <Gamepad2 className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 my-auto">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Bar */}
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

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500"
        >
          <div>© 2026 CREATIVE PORTFOLIO. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">TERMS // PROTOCOL</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">SECURE_CHANNEL</span>
          </div>
        </motion.footer>

      </main>
    </div>
  );
}
