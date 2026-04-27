import { useStore } from "../../store";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Crosshair, Trophy, Info } from "lucide-react";
import { getPaletteByLevel } from "../../constants";

export const HUD = () => {
  const score = useStore((state) => state.score);
  const level = useStore((state) => state.level);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const startGame = useStore((state) => state.startGame);
  const isConnected = useStore((state) => state.isConnected);
  const isDemoMode = useStore((state) => state.isDemoMode);
  const setDemoMode = useStore((state) => state.setDemoMode);

  const palette = useMemo(() => getPaletteByLevel(level), [level]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none font-sans overflow-hidden">
      {/* Server Status Indicator */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-50">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'}`} />
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">
            {isConnected ? 'Neural Link Stable' : 'Establishing Link...'}
          </span>
        </div>
        {!isConnected && (
          <div className="text-[9px] text-yellow-500/60 uppercase tracking-tighter bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            Waiting for backend response
          </div>
        )}
      </div>

      {/* Auto-Pilot Indicator */}
      {isDemoMode && !isMenuOpen && (
        <div className="absolute top-16 right-4 flex items-center gap-2 px-3 py-1 bg-blue-600/20 backdrop-blur-md rounded-lg border border-blue-500/30 z-50 animate-pulse">
          <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black">
            Auto-Pilot Active
          </span>
        </div>
      )}

      {/* Background Glows (Subtle in HUD, Stronger in Menu) */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${isMenuOpen ? 'opacity-40' : 'opacity-10'}`} 
           style={{ backgroundImage: `radial-gradient(circle at 20% 30%, ${palette.player} 0%, transparent 40%), radial-gradient(circle at 80% 70%, ${palette.enemies[0]} 0%, transparent 40%)` }}>
      </div>

      {/* Crosshair */}
      {!isMenuOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40">
          <Crosshair size={24} strokeWidth={1} />
        </div>
      )}

      {/* Main HUD Container */}
      <div className="absolute inset-0 p-10 flex flex-col justify-between">
        {/* Top Row: Info & Leaderboard */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl flex items-center gap-8 shadow-2xl shadow-blue-500/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">Total Score</span>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md border" style={{ backgroundColor: `${palette.player}22`, borderColor: `${palette.player}44` }}>
                    <Trophy style={{ color: palette.player }} size={16} />
                  </div>
                  <span className="text-white font-black text-2xl tracking-tighter uppercase">{score}</span>
                </div>
              </div>
              
              <div className="w-px h-10 bg-white/10" />
              
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">Sector</span>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md border" style={{ backgroundColor: `${palette.enemies[0]}22`, borderColor: `${palette.enemies[0]}44` }}>
                    <Info style={{ color: palette.enemies[0] }} size={16} />
                  </div>
                  <span className="text-white font-black text-2xl tracking-tighter uppercase">{palette.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 px-2 border-r-2" style={{ borderColor: palette.player }}>Threat Level</div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-center min-w-[120px]">
              <span className="text-white font-black text-4xl tracking-widest">{level}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: palette.player }} />
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Sector Stability</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-black text-5xl tracking-tighter italic">{score}</span>
              <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Eliminations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0A0A0F] pointer-events-auto flex items-center justify-center p-6"
          >
            {/* Background Gradients from design */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #3B82F6 0%, transparent 40%), radial-gradient(circle at 80% 70%, #EF4444 0%, transparent 40%)' }}></div>
            
            <div className="max-w-xl w-full flex flex-col relative z-10">
              <div className="flex items-center gap-8 mb-16 justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <span className="font-black text-4xl text-white">X</span>
                </div>
                <div className="flex flex-col text-left">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-white italic">
                    Grid <span className="text-blue-500 underline decoration-4 underline-offset-8 not-italic">Assault</span>
                  </h1>
                  <span className="text-xs text-white/40 uppercase tracking-[0.4em] font-bold mt-2">Cortex Combat v3.1.2</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div 
                  onClick={() => setDemoMode(!isDemoMode)}
                  className="group relative w-full h-16 bg-black/40 border border-white/10 hover:border-blue-500/50 transition-all rounded-xl cursor-pointer flex items-center justify-between px-8"
                >
                  <div className="flex flex-col text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-1">Targeting Mode</span>
                    <span className="block text-lg font-black uppercase italic text-white leading-none">
                      {isDemoMode ? "AI Hunter" : "Manual Pilot"}
                    </span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDemoMode ? 'bg-blue-600' : 'bg-white/10'}`}>
                    <motion.div 
                      className="w-4 h-4 bg-white rounded-full"
                      animate={{ x: isDemoMode ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => startGame()}
                  className="group relative w-full h-24 bg-red-600 hover:bg-red-500 transition-all rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40 flex items-center justify-between px-10"
                >
                  <div className="absolute inset-0 bg-white/10 animate-shimmer opacity-20 pointer-events-none z-0" />
                  <div className="text-left relative z-10">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-red-200/60 mb-1">Defense Array Ready</span>
                    <span className="block text-3xl font-black uppercase italic text-white leading-none">Initiate Game</span>
                  </div>
                  <Crosshair className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
              </div>

              <div className="mb-12 text-center">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                  Click anywhere after entering to lock controls
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Directives</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">1,402 Servers Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8 text-left">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-tighter mb-1">Navigation</span>
                    <span className="text-white font-mono text-lg font-black uppercase">A / D</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-tighter mb-1">Engagement</span>
                    <span className="text-white font-mono text-lg font-black uppercase">W / SPACE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-tighter mb-1">Precision</span>
                    <span className="text-white font-mono text-lg font-black uppercase">MOUSE 1</span>
                  </div>
                </div>
              </div>

              <p className="mt-12 text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold text-center">Pointer Lock requested on deployment</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
