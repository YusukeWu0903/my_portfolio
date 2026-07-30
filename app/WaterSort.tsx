"use client";

import { useState, useCallback, useEffect } from "react";
import { WaterSortLevelData } from "@/app/types/level";
import { DEFAULT_LEVELS as INITIAL_LEVELS } from "@/app/data/levels";

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

// 檢查單一瓶子是否為 4 層滿且同色
function isFullySameColor(bottle: string[]) {
  return bottle.length === 4 && new Set(bottle).size === 1;
}

// 獨立的反向推演生成器（加入防同色滿管驗證）
function generateLevel(numColors = 4, numEmpty = 2, shuffleSteps = 60) {
  const colors = Object.keys(COLOR_MAP);
  const selectedColors = colors.slice(0, Math.min(numColors, colors.length));
  
  let state: string[][] = [];
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    attempts++;
    const candidate: string[][] = selectedColors.map((c) => [c, c, c, c]);
    for (let i = 0; i < numEmpty; i++) candidate.push([]);

    for (let i = 0; i < shuffleSteps; i++) {
      const moves = [];
      for (let src = 0; src < candidate.length; src++) {
        if (candidate[src].length === 0) continue;
        
        const top = candidate[src][candidate[src].length - 1];
        let count = 0;
        for (let j = candidate[src].length - 1; j >= 0; j--) {
          if (candidate[src][j] === top) count++;
          else break;
        }
        
        const maxK = count === candidate[src].length ? count : count - 1;
        
        for (let dst = 0; dst < candidate.length; dst++) {
          if (src === dst || candidate[dst].length >= 4) continue;
          const space = 4 - candidate[dst].length;
          for (let k = 1; k <= Math.min(maxK, space); k++) {
            moves.push({ src, dst, k });
          }
        }
      }
      
      if (moves.length === 0) break;
      
      const { src, dst, k } = moves[Math.floor(Math.random() * moves.length)];
      for (let j = 0; j < k; j++) candidate[dst].push(candidate[src].pop()!);
    }

    const hasAlreadySolvedBottle = candidate.some((bottle) => isFullySameColor(bottle));
    if (!hasAlreadySolvedBottle) {
      state = candidate;
      break;
    }
  }

  if (state.length === 0) {
    state = selectedColors.map((c) => [c, c, c, c]);
    for (let i = 0; i < numEmpty; i++) state.push([]);
  }

  return state;
}

export default function WaterSort() {
  // 使用 state 管理關卡清單，支援動態新增與持久化
  const [levels, setLevels] = useState<WaterSortLevelData[]>(() => {
    if (typeof window !== 'undefined') {
      const savedList = localStorage.getItem("watersort_all_levels");
      if (savedList) {
        try {
          return JSON.parse(savedList);
        } catch (e) {}
      }
    }
    return INITIAL_LEVELS;
  });

  const MAX_LEVELS = levels.length;
  
  // 關卡索引與資料狀態
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentLevelData, setCurrentLevelData] = useState<WaterSortLevelData>(levels[0]);
  
  // 模式狀態與編輯器畫筆
  const [mode, setMode] = useState<'PLAY' | 'EDITOR'>('PLAY');
  const [activeBrush, setActiveBrush] = useState<string>("R");
  const [isViewJsonOpen, setIsViewJsonOpen] = useState(false);

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

  // 解鎖動畫反饋狀態
  const [unlockAnimText, setUnlockAnimText] = useState<string | null>(null);
  const [isUnlockingAnim, setIsUnlockingAnim] = useState(false);

  // 初始化遊戲（確保若該關卡有 customLayout 則優先讀取固定佈局，杜絕每次隨機變動）
  const initGame = useCallback((levelData: WaterSortLevelData) => {
    setCurrentLevelData(levelData);

    if (levelData.customLayout?.enabled && levelData.customLayout.state && levelData.customLayout.state.length > 0) {
      setGameState(levelData.customLayout.state.map(bottle => [...bottle]));
    } else {
      const { numColors, numEmpty, shuffleSteps } = levelData.generation;
      setGameState(generateLevel(numColors, numEmpty, shuffleSteps));
    }

    setUnlockCost(levelData.economy.unlockCost);
    setLockedBottlesCount(levelData.economy.lockedBottlesCount);

    setSelectedBottle(null);
    setIsWon(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    initGame(levels[0]);
  }, [initGame, levels]);

  const handleNextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < levels.length) {
      setCurrentLevelIndex(nextIndex);
      initGame(levels[nextIndex]);
    }
  };

  const handleRestartAll = () => {
    setCurrentLevelIndex(0);
    initGame(levels[0]);
  };

  // 核心功能：動態新增一關 (Add New Level)
  const handleAddNewLevel = () => {
    const newId = levels.length > 0 ? Math.max(...levels.map(l => Number(l.id) || 0)) + 1 : 1;
    const newLevelName = `Custom Level #${newId}`;
    
    const defaultState = [
      ["R", "G", "B", "R"],
      ["G", "B", "R", "G"],
      ["B", "R", "G", "B"],
      [],
      []
    ];

    const newLevelData: WaterSortLevelData = {
      id: newId,
      name: newLevelName,
      generation: { numColors: 3, numEmpty: 2, shuffleSteps: 40 },
      economy: { unlockCost: 10, lockedBottlesCount: 1 },
      customLayout: {
        enabled: true,
        state: defaultState
      }
    };

    const updatedLevels = [...levels, newLevelData];
    setLevels(updatedLevels);
    setCurrentLevelIndex(updatedLevels.length - 1);
    initGame(newLevelData);
    setMode("EDITOR");

    localStorage.setItem("watersort_all_levels", JSON.stringify(updatedLevels));
    alert(`// SUCCESS: 已成功建立新關卡 #${newId} (${newLevelName})！\n已自動切換至編輯模式，您可以開始自訂此關卡。`);
  };

  // 編輯器控制面板：新增/刪除/清空瓶子
  const handleAddBottle = () => {
    const newState = [...gameState, []];
    setGameState(newState);
    setCurrentLevelData(prev => ({
      ...prev,
      customLayout: {
        enabled: true,
        state: newState
      }
    }));
  };

  const handleRemoveBottle = () => {
    if (gameState.length <= 2) return;
    const newState = gameState.slice(0, gameState.length - 1);
    setGameState(newState);
    setCurrentLevelData(prev => ({
      ...prev,
      customLayout: {
        enabled: true,
        state: newState
      }
    }));
  };

  const handleClearAllBottles = () => {
    const newState = gameState.map(() => []);
    setGameState(newState);
    setCurrentLevelData(prev => ({
      ...prev,
      customLayout: {
        enabled: true,
        state: newState
      }
    }));
  };

  // 關卡編輯儲存與驗證邏輯 (Save Level & Export JSON)
  const handleSaveLevel = () => {
    // 1. 檢查每個顏色的總數是否為 4 的倍數
    const colorCounts: { [key: string]: number } = {};
    gameState.forEach(bottle => {
      bottle.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
    });

    const invalidColors = Object.entries(colorCounts).filter(([color, count]) => count !== 4);
    if (invalidColors.length > 0) {
      const errorMsg = invalidColors.map(([c, count]) => `色塊 [${c}]: 目前有 ${count} 個 (必須剛好為 4 個)`).join('\n');
      alert(`// VALIDATION_ERROR: 關卡配置不符合完整 4 層規範！\n\n${errorMsg}`);
      return;
    }

    // 2. 驗證通過，更新當前關卡資料，設定 customLayout.enabled = true，確保確定性讀取
    const updatedLevelData: WaterSortLevelData = {
      ...currentLevelData,
      customLayout: {
        enabled: true,
        state: gameState.map(b => [...b])
      }
    };

    const updatedLevels = levels.map((lvl, idx) => idx === currentLevelIndex ? updatedLevelData : lvl);
    setLevels(updatedLevels);
    setCurrentLevelData(updatedLevelData);

    try {
      localStorage.setItem("watersort_all_levels", JSON.stringify(updatedLevels));
      
      // 同時提供一鍵下載 JSON 檔案功能，方便開發者將關卡固化進專案中
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedLevelData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `level_${updatedLevelData.id}_spec.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      alert(`// SUCCESS: 關卡 #${currentLevelIndex + 1} (${updatedLevelData.name}) 已成功儲存、驗證並導出 JSON 檔案！\n切換關卡或重新整理後將完美固定為此佈局。`);
    } catch (e) {
      alert(`// SUCCESS: 關卡已成功驗證並儲存於瀏覽器記憶體！`);
    }
  };

  // 觸發付費解鎖（並播放解鎖特效）
  const handleUnlockBottle = () => {
    if (isWon || lockedBottlesCount <= 0) return;

    if (credits >= unlockCost) {
      setCredits((prev) => prev - unlockCost);
      setLockedBottlesCount((prev) => prev - 1);
      setGameState((prev) => [...prev, []]);

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

  // 編輯器專屬的圖層點擊處理器
  const handleLayerClick = (e: React.MouseEvent, bottleIdx: number, layerIdx: number) => {
    if (mode !== "EDITOR") return;
    e.stopPropagation();

    const newState = gameState.map((bottle) => [...bottle]);
    const targetBottle = newState[bottleIdx];

    if (activeBrush === "ERASE") {
      if (targetBottle[layerIdx]) {
        targetBottle.splice(layerIdx, 1);
      }
    } else {
      if (layerIdx < targetBottle.length) {
        targetBottle[layerIdx] = activeBrush;
      } else if (layerIdx === targetBottle.length && targetBottle.length < 4) {
        targetBottle.push(activeBrush);
      }
    }

    setGameState(newState);
    setCurrentLevelData((prev) => ({
      ...prev,
      customLayout: {
        enabled: true,
        state: newState,
      },
    }));
  };

  const handleBottleClick = (idx: number) => {
    if (mode === "EDITOR") return; // 編輯模式下不執行倒水操作
    if (isWon) return;

    // 已完成的瓶子禁止任何操作
    if (isFullySameColor(gameState[idx])) {
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

        if (isFullySameColor(dst)) {
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

          if (newState.every(b => b.length === 0 || isFullySameColor(b))) {
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
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-neutral-950 min-h-[600px] text-neutral-100 rounded-xl relative overflow-hidden w-full max-w-5xl mx-auto">
      
      {/* 頂部導航與控制面板：完美置中雙群組佈局 */}
      <div className="w-full flex flex-wrap items-center justify-center gap-4 mb-8 pb-4 border-b border-neutral-800 font-mono text-xs">
        
        {/* 左側群組：LEVEL 選單、新增關卡按鈕與 CREDITS 點數 */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700">
            <span className="text-neutral-400">LEVEL:</span>
            <select
              value={currentLevelIndex}
              onChange={(e) => {
                const targetIdx = Number(e.target.value);
                setCurrentLevelIndex(targetIdx);
                initGame(levels[targetIdx]);
              }}
              className="bg-neutral-950 text-cyan-400 font-bold rounded px-1.5 py-0.5 border border-neutral-700 focus:outline-none focus:border-cyan-400 cursor-pointer max-h-60 overflow-y-auto"
            >
              {levels.map((level, idx) => (
                <option key={level.id} value={idx}>
                  #{idx + 1} // {level.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddNewLevel}
            className="px-3 py-1.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/40 text-xs font-mono transition cursor-pointer font-bold"
            title="新增一個全新的自訂關卡"
          >
            + NEW_LEVEL
          </button>
          
          {mode === "PLAY" && (
            <div className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border transition-all duration-300 ${
              isUnlockingAnim 
                ? 'border-emerald-400 bg-emerald-950/40 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                : 'border-yellow-500/30 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
            }`}>
              CREDITS: <span className="text-white font-bold">{credits}</span>

              {unlockAnimText && (
                <span className="absolute -bottom-6 left-0 text-emerald-400 font-mono text-[10px] font-bold whitespace-nowrap animate-bounce">
                  {unlockAnimText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 右側群組：MODE、VIEW_JSON、VERSION、DEBUG 按鈕 */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => {
              setSelectedBottle(null);
              setMode(mode === "PLAY" ? "EDITOR" : "PLAY");
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 cursor-pointer ${
              mode === "EDITOR"
                ? "bg-purple-500 text-neutral-950 font-bold border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-neutral-900 text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
            }`}
          >
            {mode === "EDITOR" ? "🛠️ MODE: EDITOR" : "🕹️ MODE: PLAY"}
          </button>

          <button 
            onClick={() => setIsViewJsonOpen(true)}
            className="px-3 py-1.5 rounded-full bg-neutral-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/10 transition-colors cursor-pointer"
          >
            [VIEW_JSON]
          </button>

          <span className="text-emerald-400 font-mono text-xs px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/25 hidden sm:inline-block">
            v2.5.0-DETERMINISTIC-EXPORT
          </span>

          <button 
            onClick={() => setIsDebug(!isDebug)}
            className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 text-xs font-mono hover:text-white transition-colors cursor-pointer"
          >
            DEBUG: {isDebug ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* JSON 規格預覽彈窗 */}
      {isViewJsonOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-cyan-500/50 rounded-xl p-6 max-w-lg w-full font-mono text-xs text-neutral-300 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-neutral-800 text-cyan-400 font-bold">
              <span>// CURRENT_LEVEL_SPECIFICATION</span>
              <button onClick={() => setIsViewJsonOpen(false)} className="hover:text-white cursor-pointer">✕</button>
            </div>
            <pre className="bg-neutral-950 p-4 rounded-lg overflow-auto max-h-80 text-emerald-400 border border-neutral-800">
              {JSON.stringify(currentLevelData, null, 2)}
            </pre>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(currentLevelData, null, 2))}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-md transition cursor-pointer"
              >
                COPY_JSON()
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯器專屬調色盤工具列 */}
      {mode === "EDITOR" && (
        <div className="w-full max-w-4xl mb-8 p-3 bg-neutral-900/90 border border-purple-500/40 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-[0_0_20px_rgba(168,85,247,0.15)] mx-auto">
          
          {/* 左側：調色盤畫筆選擇區 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-purple-400 text-xs font-mono font-bold mr-1">// PALETTE:</span>
            
            {Object.keys(COLOR_MAP).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setActiveBrush(colorKey)}
                className={`w-7 h-7 rounded-md transition-all duration-200 cursor-pointer ${
                  COLOR_MAP[colorKey]
                } ${
                  activeBrush === colorKey
                    ? "ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "opacity-70 hover:opacity-100"
                }`}
                title={`Brush: ${colorKey}`}
              />
            ))}

            <button
              onClick={() => setActiveBrush("ERASE")}
              className={`px-2.5 h-7 rounded-md font-mono text-xs border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                activeBrush === "ERASE"
                  ? "bg-red-500 text-white border-red-400 font-bold ring-2 ring-white"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white"
              }`}
            >
              [X] ERASE
            </button>
          </div>

          {/* 右側：盤面控制台 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveLevel}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-mono font-bold transition cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              title="儲存並驗證目前編輯的關卡 (檢查所有顏色總數是否為 4 的倍數，並自動下載 JSON 檔)"
            >
              💾 SAVE & EXPORT JSON
            </button>
            <button
              onClick={handleAddBottle}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-600 rounded text-xs font-mono transition cursor-pointer"
              title="在盤面最後增加一個空瓶"
            >
              + BOTTLE
            </button>
            <button
              onClick={handleRemoveBottle}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-600 rounded text-xs font-mono transition cursor-pointer"
              title="移除最後一個瓶子"
            >
              - BOTTLE
            </button>
            <button
              onClick={handleClearAllBottles}
              className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 rounded text-xs font-mono transition cursor-pointer"
              title="清空所有瓶子內的水"
            >
              CLEAR()
            </button>
          </div>
        </div>
      )}

      {isWon && mode === "PLAY" && (
        <div className="mb-8 text-center animate-bounce">
          {currentLevelIndex < MAX_LEVELS - 1 ? (
            <>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">LEVEL {currentLevelIndex + 1} CLEARED!</h2>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-lg transition cursor-pointer"
              >
                NEXT_LEVEL()
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-purple-400 mb-4">SYSTEM CONQUERED!</h2>
              <p className="text-neutral-400 mb-6 font-mono">恭喜完成所有關卡測試。</p>
              <button
                onClick={handleRestartAll}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold rounded-lg transition cursor-pointer"
              >
                REBOOT_SYSTEM()
              </button>
            </>
          )}
        </div>
      )}

      {/* 遊戲盤面區塊 */}
      <div className="flex flex-wrap justify-center items-end gap-4 my-6">
        {gameState.map((bottle, idx) => {
          const completed = isFullySameColor(bottle);
          const isSelected = selectedBottle === idx;

          return (
            <div key={idx} className="flex flex-col items-center">
              
              {completed && mode === "PLAY" ? (
                <div className="flex flex-col items-center mb-1 animate-fade-in">
                  <span className="text-[8px] font-mono font-bold text-cyan-400 tracking-tighter">✓ FULL</span>
                  <div className="w-9 h-2 bg-cyan-400 rounded-t-sm shadow-[0_0_8px_rgba(34,211,238,0.8)] border-b border-neutral-950" />
                </div>
              ) : (
                <div className="h-5 flex items-center justify-center">
                  {mode === "EDITOR" && (
                    <span className="text-[9px] font-mono text-purple-400/70">#{idx + 1}</span>
                  )}
                </div>
              )}

              <div
                onClick={() => handleBottleClick(idx)}
                className={`w-12 h-36 border-2 rounded-b-xl flex flex-col p-1 gap-1 transition-all duration-300 ${
                  mode === "EDITOR"
                    ? "border-purple-500/40 bg-neutral-900/60 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                    : completed
                    ? "border-cyan-400 bg-neutral-900/80 shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-not-allowed opacity-90"
                    : isSelected
                    ? "-translate-y-4 ring-2 ring-cyan-400 bg-neutral-900 border-neutral-600 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
                    : "border-neutral-700 bg-neutral-800 cursor-pointer hover:border-neutral-600"
                }`}
              >
                {[3, 2, 1, 0].map((layerIdx) => (
                  <div 
                    key={layerIdx} 
                    onClick={(e) => handleLayerClick(e, idx, layerIdx)}
                    className={`w-full flex-1 rounded-sm transition-all duration-200 ${
                      bottle[layerIdx] ? COLOR_MAP[bottle[layerIdx]] : 'bg-neutral-900/50'
                    } ${
                      mode === "EDITOR" && layerIdx === bottle.length && bottle.length < 4
                        ? "border border-dashed border-purple-500/45 hover:bg-purple-500/20"
                        : ""
                    } ${
                      mode === "EDITOR" ? "hover:brightness-125 cursor-cell" : ""
                    }`} 
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* 🔒 付費鎖住的瓶子 UI (僅在 PLAY 模式顯示) */}
        {mode === "PLAY" && Array.from({ length: lockedBottlesCount }).map((_, idx) => (
          <div key={`locked-${idx}`} className="flex flex-col items-center">
            <div className="h-5" />
            <div
              onClick={handleUnlockBottle}
              className={`w-12 h-36 border-2 border-dashed rounded-b-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 group ${
                isUnlockingAnim
                  ? "border-emerald-400 bg-emerald-500/20 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                  : "border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500"
              }`}
              title="點擊花費點數解鎖額外空瓶"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {isUnlockingAnim ? "🔓" : "🔒"}
              </span>
              <span className="text-[9px] font-mono text-yellow-400/80 group-hover:text-yellow-400 text-center font-bold leading-tight">
                +{unlockCost} <br /> CREDITS
              </span>
              <span className="text-[8px] font-mono text-neutral-500 group-hover:text-neutral-300">
                [UNLOCK]
              </span>
            </div>
          </div>
        ))}
      </div>

      {isDebug && (
        <div className="w-full max-w-3xl mt-8 p-4 bg-neutral-900 border border-red-500/50 rounded-lg text-xs font-mono text-green-400 overflow-auto max-h-64 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <p className="text-red-400 mb-2 border-b border-red-500/30 pb-1">// SYSTEM_DEBUGGER_ACTIVE - VERSION 2.5.0 (DETERMINISTIC-EXPORT)</p>
          <div className="flex gap-8 mb-4">
            <p>Current Mode: <span className="text-purple-400 font-bold">{mode}</span></p>
            <p>Active Brush: <span className="text-white font-bold">{activeBrush}</span></p>
            <p>Current Level: <span className="text-cyan-400 font-bold">{currentLevelData.name}</span></p>
          </div>
          <p className="mb-1">Current Level Data Spec:</p>
          <pre className="text-green-300 mb-4">{JSON.stringify(currentLevelData, null, 2)}</pre>
          <p className="mb-1">Current State Array (gameState):</p>
          <pre className="text-green-300">{JSON.stringify(gameState, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
