"use client";

import { useState, useCallback } from "react";

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

// 獨立的反向推演生成器：確保 100% 可解，並真正打亂顏色
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
  const [currentLevel, setCurrentLevel] = useState(1);
  const MAX_LEVELS = 3;

  const [gameState, setGameState] = useState<string[][]>(() => generateLevel(3, 2, 60));
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback((level: number) => {
    const numColors = level + 2; 
    const numEmpty = 2;
    const shuffleSteps = 40 + (level * 20);

    setGameState(generateLevel(numColors, numEmpty, shuffleSteps));
    setSelectedBottle(null);
    setIsWon(false);
  }, []);

  const handleNextLevel = () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    initGame(next);
  };

  const handleRestartAll = () => {
    setCurrentLevel(1);
    initGame(1);
  };

  const handleBottleClick = (idx: number) => {
    if (isWon) return;

    if (selectedBottle === null) {
      if (gameState[idx].length > 0) setSelectedBottle(idx);
    } else {
      if (selectedBottle === idx) {
        setSelectedBottle(null);
      } else {
        const src = [...gameState[selectedBottle]];
        const dst = [...gameState[idx]];

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

          if (newState.every(b => b.length === 0 || (b.length === 4 && new Set(b).size === 1))) {
            setIsWon(true);
          }
        }
        setSelectedBottle(null);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-neutral-950 min-h-[500px] text-neutral-100 rounded-xl relative">
      
      <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-mono">
        LEVEL: <span className="text-cyan-400 font-bold">{currentLevel} / {MAX_LEVELS}</span>
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

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {gameState.map((bottle, idx) => (
          <div
            key={idx}
            onClick={() => handleBottleClick(idx)}
            className={`w-16 h-52 border-2 border-neutral-700 rounded-b-xl flex flex-col-reverse p-1 gap-1 cursor-pointer transition-all duration-300 ${
              selectedBottle === idx ? "-translate-y-4 ring-2 ring-cyan-400 bg-neutral-900 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "bg-neutral-800"
            }`}
          >
            {[0, 1, 2, 3].map((layerIdx) => (
              <div 
                key={layerIdx} 
                className={`w-full flex-1 rounded-sm transition-colors duration-300 ${
                  bottle[layerIdx] ? COLOR_MAP[bottle[layerIdx]] : 'bg-neutral-900/50'
                }`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
