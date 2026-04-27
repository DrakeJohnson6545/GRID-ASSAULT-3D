import { Canvas } from "@react-three/fiber";
import { Sky, Stars, Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useStore } from "./store";
import { HUD } from "./components/ui/HUD";
import { DemoController } from "./components/game/DemoController";
import { ShooterBoard } from "./components/game/ShooterBoard";
import { useShooterControls } from "./hooks/useShooterControls";
import { getPaletteByLevel } from "./constants";

export default function App() {
  const initialize = useStore((state) => state.initialize);
  const level = useStore((state) => state.level);
  useShooterControls();

  const palette = useMemo(() => getPaletteByLevel(level), [level]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 30], fov: 40 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <DemoController />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} minDistance={15} maxDistance={50} />
        <fog attach="fog" args={[palette.grid, 35, 100]} />
        <ambientLight intensity={0.5} />
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        
        <ShooterBoard />
      </Canvas>

      <HUD />
    </div>
  );
}
