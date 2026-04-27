import { create } from "zustand";
import { io, Socket } from "socket.io-client";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export interface Bullet {
  id: string;
  position: [number, number];
}

export interface Enemy {
  id: string;
  position: [number, number];
  type: number;
  health: number;
}

interface GameState {
  playerPos: number; // Horizontal position
  bullets: Bullet[];
  enemies: Enemy[];
  score: number;
  level: number;
  isGameOver: boolean;
  isDemoMode: boolean;
  isMenuOpen: boolean;
  isConnected: boolean;
  isShooting: boolean;
  movingLeft: boolean;
  movingRight: boolean;
  fireTimer: number;
  localPlayerId: string | null;
  
  initialize: () => void;
  startGame: () => void;
  setMovingLeft: (moving: boolean) => void;
  setMovingRight: (moving: boolean) => void;
  movePlayer: (dc: number) => void;
  setShooting: (isShooting: boolean) => void;
  shoot: () => void;
  setDemoMode: (isDemo: boolean) => void;
  tick: () => void;
}

export const useStore = create<GameState>((set, get) => ({
  playerPos: 5,
  bullets: [],
  enemies: [],
  score: 0,
  level: 1,
  isGameOver: false,
  isDemoMode: false,
  isMenuOpen: true,
  isConnected: false,
  isShooting: false,
  movingLeft: false,
  movingRight: false,
  fireTimer: 0,
  localPlayerId: null,

  initialize: () => {
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
    socket.on("connect", () => set({ localPlayerId: socket.id, isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));
  },

  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),

  startGame: () => {
    set({
      playerPos: 5,
      bullets: [],
      enemies: [],
      score: 0,
      level: 1,
      isGameOver: false,
      isMenuOpen: false,
      isShooting: false,
      movingLeft: false,
      movingRight: false,
      fireTimer: 0,
    });
  },

  setMovingLeft: (moving) => set({ movingLeft: moving }),
  setMovingRight: (moving) => set({ movingRight: moving }),

  movePlayer: (dc) => {
    set((state) => ({
      playerPos: Math.max(0, Math.min(GRID_WIDTH - 1, state.playerPos + dc))
    }));
  },

  setShooting: (isShooting) => set({ isShooting, fireTimer: isShooting ? get().fireTimer : 0 }),

  shoot: () => {
    const { playerPos, isGameOver, isMenuOpen } = get();
    if (isGameOver || isMenuOpen) return;

    set((state) => ({
      bullets: [
        ...state.bullets, 
        { id: Math.random().toString(), position: [GRID_HEIGHT - 2, playerPos - 0.15] },
        { id: Math.random().toString(), position: [GRID_HEIGHT - 2, playerPos + 0.15] }
      ]
    }));
  },

  tick: () => {
    const { bullets, enemies, isGameOver, isMenuOpen, level, score, isShooting, movingLeft, movingRight, fireTimer, playerPos } = get();
    if (isGameOver || isMenuOpen) return;

    let nextFireTimer = fireTimer;
    let nextPlayerPos = playerPos;

    // Movement logic
    if (movingLeft && !movingRight) {
      nextPlayerPos = Math.max(0, Math.min(GRID_WIDTH - 1, nextPlayerPos - 0.15));
    } else if (movingRight && !movingLeft) {
      nextPlayerPos = Math.max(0, Math.min(GRID_WIDTH - 1, nextPlayerPos + 0.15));
    }

    // Auto-fire logic with a fixed rate (every 4 frames for rapid fire)
    let currentBullets = [...bullets];
    if (isShooting) {
      nextFireTimer++;
      if (nextFireTimer >= 4) {
        currentBullets.push(
          { id: Math.random().toString(), position: [GRID_HEIGHT - 2, nextPlayerPos - 0.15] },
          { id: Math.random().toString(), position: [GRID_HEIGHT - 2, nextPlayerPos + 0.15] }
        );
        nextFireTimer = 0;
      }
    } else {
      nextFireTimer = 0;
    }

    // Move Bullets
    const nextBullets = currentBullets
      .map(b => ({ ...b, position: [b.position[0] - 0.4, b.position[1]] as [number, number] }))
      .filter(b => b.position[0] >= 0);

    // Spawn Enemies
    const nextEnemies = [...enemies];
    if (Math.random() < 0.05 + (level * 0.02)) {
      nextEnemies.push({
        id: Math.random().toString(),
        position: [-1, Math.floor(Math.random() * GRID_WIDTH)],
        type: Math.floor(Math.random() * 3),
        health: 1
      });
    }

    // Move Enemies
    const movedEnemies = nextEnemies.map(e => ({ ...e, position: [e.position[0] + 0.04 + (level * 0.01), e.position[1]] as [number, number] }));

    // Collision Detection
    let finalEnemies = [...movedEnemies];
    let finalBullets = [...nextBullets];
    let hits = 0;

    finalBullets = finalBullets.filter(b => {
      const hitIndex = finalEnemies.findIndex(e => 
        Math.abs(e.position[0] - b.position[0]) < 0.8 && 
        Math.abs(e.position[1] - b.position[1]) < 0.8
      );
      if (hitIndex !== -1) {
        finalEnemies.splice(hitIndex, 1);
        hits++;
        return false;
      }
      return true;
    });

    // Check Game Over
    const reachedBottom = finalEnemies.some(e => e.position[0] >= GRID_HEIGHT - 2);
    if (reachedBottom) {
      set({ isGameOver: true });
      return;
    }

    const nextScore = score + hits * 10;
    set({
      bullets: finalBullets,
      enemies: finalEnemies,
      score: nextScore,
      level: Math.floor(nextScore / 1000) + 1,
      fireTimer: nextFireTimer,
      playerPos: nextPlayerPos
    });
  },
}));

