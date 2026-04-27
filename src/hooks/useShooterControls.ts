import { useEffect } from "react";
import { useStore } from "../store";

export const useShooterControls = () => {
  const setMovingLeft = useStore((state) => state.setMovingLeft);
  const setMovingRight = useStore((state) => state.setMovingRight);
  const shoot = useStore((state) => state.shoot);
  const setShooting = useStore((state) => state.setShooting);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const isGameOver = useStore((state) => state.isGameOver);

  useEffect(() => {
    const activeFireKeys = new Set<string>();
    let isMouseDown = false;

    const updateShooting = () => {
      setShooting(isMouseDown || activeFireKeys.size > 0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMenuOpen || isGameOver) return;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          e.preventDefault();
          setMovingLeft(true);
          break;
        case "ArrowRight":
        case "KeyD":
          e.preventDefault();
          setMovingRight(true);
          break;
        case "Space":
        case "KeyW":
        case "ArrowUp":
          e.preventDefault();
          if (!activeFireKeys.has(e.code)) {
            activeFireKeys.add(e.code);
            updateShooting();
            shoot(); // Instant first shot
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          e.preventDefault();
          setMovingLeft(false);
          break;
        case "ArrowRight":
        case "KeyD":
          e.preventDefault();
          setMovingRight(false);
          break;
        case "Space":
        case "KeyW":
        case "ArrowUp":
          e.preventDefault();
          activeFireKeys.delete(e.code);
          updateShooting();
          break;
      }
    };

    const handleMouseDown = () => {
      if (isMenuOpen || isGameOver) return;
      isMouseDown = true;
      updateShooting();
      shoot();
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      updateShooting();
    };

    const handleBlur = () => {
      activeFireKeys.clear();
      isMouseDown = false;
      updateShooting();
      setMovingLeft(false);
      setMovingRight(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleBlur);
      // Ensure state is cleared on unmount
      setShooting(false);
      setMovingLeft(false);
      setMovingRight(false);
    };
  }, [isMenuOpen, isGameOver, setMovingLeft, setMovingRight, shoot, setShooting]);
};
