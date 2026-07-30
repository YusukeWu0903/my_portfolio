"use client";

import { useState, useCallback, useEffect } from "react";

// 科技感配色定義
const COLOR_MAP: { [key: string]: string } = {
  R: "bg-red-500",
  G: "bg-emerald-500",
  B: "bg-blue-500",
  Y: "bg-yellow-400",
  C: "bg-cyan-500",
  M: "bg-fuchsia-500",
  O: "bg-orange-500",
};

// 獨立的反向推演生成器
function generateLevel(numColors = 4, numEmpty = 2, shuffleSteps = 60) {
  const colors = Object.keys(COLOR_MAP);
  const selectedColors = colors.slice(0, numColors);
  const state: string[][] = selectedColors.map((c) => [c, c, c, c]);
  for (let i = 0; i < numEmpty; i++) state.push([]);

  for (let i = 0; i < shuffleSteps; i++) {
    const moves = [];
    for (let src = 0; src < state.length; src++) {
      if (state[src].length === 0) continue;
      
      const top = state[src][state[src].length - 1];
      let count = 0;
      for (let j = state[src].length - 1; j >= 0; j--) {
        if (state[src][j] === top) count++;
        else break;
      }
      
      const maxK = count === state[src].length ? count : count - 1;
      
      for (let dst = 0; dst < state.length; dst++) {
        if (src === dst || state[dst].length >= 4) continue;
        const space = 4 - state[dst].length;
        for (let k = 1; k <= Math.min(maxK, space); k++) {
          moves.push({ src, dst, k });
        }
      }
    }
    
    if (moves.length === 0) break;
    
    const { src, dst, k } = moves[Math.floor(Math.random() * moves.length)];
    for (let j = 0; j < k; j++) state[dst].push(state[src].pop()!);
  }
  return state;
}

export default function WaterSort() {
  const MAX_LEVELS = 3;
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // 遊戲盤面與互動狀態
  const [gameState, setGameState] = useState<string[][]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 商業化經濟系統
  const [credits, setCredits] = useState(50);
  const [unlockCost, setUnlockCost] = useState(10);
  const [lockedBottlesCount, setLockedBottlesCount] = useState(1);

  // ---------- 【優化 1：解鎖動畫反饋狀態】 ----------
  const [unlockAnimText, setUnlockAnimText] = useState<string | null>(null);
  const [isUnlockingAnim, setIsUnlockingAnim] = useState(false);

  // ---------- 【優化 2：檢查單一瓶子是否已完賽 (4層滿且同色)】 ----------
  const isBottleCompleted = (bottle: string[]) => {
    return bottle.length === 4 && new Set(bottle).size === 1;
  };

  const initGame = useCallback((level: number) => {
    const numColors = level + 2; 
    const numEmpty = 2;
    const shuffleSteps = 40 + (level * 20);

    setGameState(generateLevel(numColors, numEmpty, shuffleSteps));
    setSelectedBottle(null);
    setIsWon(false);
    setLockedBottlesCount(1);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    initGame(1);
  }, [initGame]);

  const handleNextLevel = () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    initGame(next);
  };

  const handleRestartAll = () => {
    setCurrentLevel(1);
    initGame(1);
  };

  // 觸發付費解鎖（並播放解鎖特效）
  const handleUnlockBottle = () => {
    if (isWon || lockedBottlesCount <= 0) return;

    if (credits >= unlockCost) {
      setCredits((prev) => prev - unlockCost);
      setLockedBottlesCount((prev) => prev - 1);
      setGameState((prev) => [...prev, []]);

      // 觸發 700 毫秒的科技感解鎖動畫與漂浮字
      setIsUnlockingAnim(true);
      setUnlockAnimText(`-${unlockCost} CREDITS // BOTTLE_UNLOCKED`);
      setTimeout(() => {
        setIsUnlockingAnim(false);
        setUnlockAnimText(null);
      }, 700);

    } else {
      alert("INSUFFICIENT_CREDITS // 點數不足，無法解鎖空瓶！");
    }
  };

  const handleBottleClick = (idx: number) => {
    if (isWon) return;

    // 【核心邏輯保護】：如果點擊的瓶子已經完成，直接忽略！禁止倒出或倒入
    if (isBottleCompleted(gameState[idx])) {
      setSelectedBottle(null);
      return;
    }

    if (selectedBottle === null) {
      if (gameState[idx].length > 0) setSelectedBottle(idx);
    } else {
      if (selectedBottle === idx) {
        setSelectedBottle(null);
      } else {
        const src = [...gameState[selectedBottle]];
        const dst = [...gameState[idx]];

        // 再次確保目標瓶不是已完賽瓶（雙重保險）
        if (isBottleCompleted(dst)) {
          setSelectedBottle(null);
          return;
        }

        if (dst.length < 4 && (dst.length === 0 || dst[dst.length - 1] === src[src.length - 1])) {
          const color = src[src.length - 1];
          let x = 0;
          for (let i = src.length - 1; i >= 0; i--) {
            if (src[i] === color) x++;
            else break;
          }
          const y = 4 - dst.length;
          const amount = Math.min(x, y);

          for (let i = 0; i < amount; i++) dst.push(src.pop()!);

          const newState = [...gameState];
          newState[selectedBottle] = src;
          newState[idx] = dst;
          setGameState(newState);

          if (newState.every(b => b.length === 0 || isBottleCompleted(b))) {
            setIsWon(true);
          }
        }
        setSelectedBottle(null);
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-neutral-950 min-h-[500px] rounded-xl">
        <p className="text-cyan-400 font-mono animate-pulse">INITIALIZING_SYSTEM...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-neutral-950 min-h-[500px] text-neutral-100 rounded-xl relative overflow-hidden">
      
      {/* 上方資訊列：顯示關卡與玩家付費點數 */}
      <div className="absolute top-6 left-6 flex items-center gap-4 font-mono text-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400">
          LEVEL: <span className="text-cyan-400 font-bold">{currentLevel} / {MAX_LEVELS}</span>
        </div>
        
        {/* 付費看板 (解鎖時會觸發綠色閃波) */}
        <div className={`relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border transition-all duration-300 ${
          isUnlockingAnim 
            ? 'border-emerald-400 bg-emerald-950/40 scale-110 shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
            : 'border-yellow-500/30 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
        }`}>
          CREDITS: <span className="text-white font-bold">{credits}</span>

          {/* 解鎖成功瞬間向上升起的綠色動態漂浮字 */}
          {unlockAnimText && (
            <span className="absolute -bottom-8 left-0 text-emerald-400 font-mono text-[10px] font-bold whitespace-nowrap animate-bounce">
              {unlockAnimText}
            </span>
          )}
        </div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3">
        <span className="text-emerald-400 font-mono text-xs px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
          v1.4.0-LOCKED-CAP
        </span>
        <button 
          onClick={() => setIsDebug(!isDebug)}
          className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-mono hover:text-white transition-colors"
        >
          DEBUG: {isDebug ? "ON" : "OFF"}
        </button>
      </div>

      {isWon && (
        <div className="mb-8 text-center animate-bounce">
          {currentLevel < MAX_LEVELS ? (
            <>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">LEVEL {currentLevel} CLEARED!</h2>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-lg transition"
              >
                NEXT_LEVEL()
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-purple-400 mb-4">SYSTEM CONQUERED!</h2>
              <p className="text-neutral-400 mb-6 font-mono">恭喜完成所有演算法測試。</p>
              <button
                onClick={handleRestartAll}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold rounded-lg transition"
              >
                REBOOT_SYSTEM()
              </button>
            </>
          )}
        </div>
      )}

      {/* 遊戲盤面：整合完賽封口蓋 UI 與付費鎖頭 */}
      <div className="flex flex-wrap justify-center items-end gap-6 mt-12">
        {gameState.map((bottle, idx) => {
          const completed = isBottleCompleted(bottle);
          const isSelected = selectedBottle === idx;

          return (
            <div key={idx} className="flex flex-col items-center">
              
              {/* 【優化 2 視覺】：完賽自動蓋上科技感蓋子與 FULL 標誌 */}
              {completed ? (
                <div className="flex flex-col items-center mb-1 animate-fade-in">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-tighter">✓ FULL</span>
                  <div className="w-12 h-2.5 bg-cyan-400 rounded-t-sm shadow-[0_0_8px_rgba(34,211,238,0.8)] border-b border-neutral-950" />
                </div>
              ) : (
                /* 平常保留相同高度的透明佔位，避免水管忽高忽低 */
                <div className="h-6" />
              )}

              {/* 水管主體：完賽後外框亮起螢光藍、禁用鼠標指針 */}
              <div
                onClick={() => handleBottleClick(idx)}
                className={`w-16 h-52 border-2 rounded-b-xl flex flex-col p-1 gap-1 transition-all duration-300 ${
                  completed
                    ? "border-cyan-400 bg-neutral-900/80 shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-not-allowed opacity-90"
                    : isSelected
                    ? "-translate-y-4 ring-2 ring-cyan-400 bg-neutral-900 border-neutral-600 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
                    : "border-neutral-700 bg-neutral-800 cursor-pointer hover:border-neutral-600"
                }`}
              >
                {[3, 2, 1, 0].map((layerIdx) => (
                  <div 
                    key={layerIdx} 
                    className={`w-full flex-1 rounded-sm transition-colors duration-300 ${
                      bottle[layerIdx] ? COLOR_MAP[bottle[layerIdx]] : 'bg-neutral-900/50'
                    }`} 
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* 🔒 付費鎖住的瓶子 UI (解鎖瞬間伴隨脈衝放大) */}
        {Array.from({ length: lockedBottlesCount }).map((_, idx) => (
          <div key={`locked-${idx}`} className="flex flex-col items-center">
            <div className="h-6" /> {/* 對齊標籤空間 */}
            <div
              onClick={handleUnlockBottle}
              className={`w-16 h-52 border-2 border-dashed rounded-b-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group ${
                isUnlockingAnim
                  ? "border-emerald-400 bg-emerald-500/20 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                  : "border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500"
              }`}
              title="點擊花費點數解鎖額外空瓶"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {isUnlockingAnim ? "🔓" : "🔒"}
              </span>
              <span className="text-[10px] font-mono text-yellow-400/80 group-hover:text-yellow-400 text-center font-bold">
                +{unlockCost} <br /> CREDITS
              </span>
              <span className="text-[9px] font-mono text-neutral-500 group-hover:text-neutral-300">
                [UNLOCK]
              </span>
            </div>
          </div>
        ))}
      </div>

      {isDebug && (
        <div className="w-full max-w-3xl mt-12 p-4 bg-neutral-900 border border-red-500/50 rounded-lg text-xs font-mono text-green-400 overflow-auto max-h-64 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <p className="text-red-400 mb-2 border-b border-red-500/30 pb-1">// SYSTEM_DEBUGGER_ACTIVE - VERSION 1.4.0 (LOCKED-CAP)</p>
          <div className="flex gap-8 mb-4">
            <p>Selected Bottle: <span className="text-white font-bold">{selectedBottle !== null ? selectedBottle : "null"}</span></p>
            <p>Is Won: <span className="text-white font-bold">{isWon.toString()}</span></p>
            <p>Credits: <span className="text-yellow-400 font-bold">{credits}</span></p>
          </div>
          <p className="mb-1">Current State Array (gameState):</p>
          <pre className="text-green-300">{JSON.stringify(gameState, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}