import { useEffect } from "react";
import { useStore } from "../../store";
import { useFrame } from "@react-three/fiber";

export const DemoController = () => {
  const isDemoMode = useStore((state) => state.isDemoMode);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const isConnected = useStore((state) => state.isConnected);
  const movePlayer = useStore((state) => state.movePlayer);
  const shoot = useStore((state) => state.shoot);
  const isGameOver = useStore((state) => state.isGameOver);
  const startGame = useStore((state) => state.startGame);

  // Auto-start game in demo mode after connection
  useEffect(() => {
    if (isDemoMode && isMenuOpen && isConnected) {
      const timer = setTimeout(() => {
        startGame();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDemoMode, isMenuOpen, isConnected, startGame]);

  // Handle Game Over in Demo Mode
  useEffect(() => {
    if (isDemoMode && isGameOver) {
      const timer = setTimeout(() => {
        startGame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDemoMode, isGameOver, startGame]);

  // Random moves in demo mode
  useEffect(() => {
    if (!isDemoMode || isMenuOpen || isGameOver) return;

    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.2) movePlayer(-1);
      else if (rand < 0.4) movePlayer(1);
      
      if (Math.random() < 0.4) shoot();
    }, 150);

    return () => clearInterval(interval);
  }, [isDemoMode, isMenuOpen, isGameOver, movePlayer, shoot]);

  return null;
};
