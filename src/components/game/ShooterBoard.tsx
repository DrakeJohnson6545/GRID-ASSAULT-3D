import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, GRID_HEIGHT, GRID_WIDTH } from "../../store";
import { Box, Text, Instance, Instances } from "@react-three/drei";
import { getPaletteByLevel } from "../../constants";
import * as THREE from "three";

export const ShooterBoard = () => {
  const playerPos = useStore((state) => state.playerPos);
  const bullets = useStore((state) => state.bullets);
  const enemies = useStore((state) => state.enemies);
  const tick = useStore((state) => state.tick);
  const isGameOver = useStore((state) => state.isGameOver);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const level = useStore((state) => state.level);

  const palette = useMemo(() => getPaletteByLevel(level), [level]);

  // Game Loop
  const lastTick = useRef(0);
  useFrame((state) => {
    if (isMenuOpen || isGameOver) return;
    tick();
  });

  return (
    <group position={[-GRID_WIDTH / 2, GRID_HEIGHT / 2, 0]}>
      {/* Board Frame */}
      <Box args={[GRID_WIDTH + 0.5, GRID_HEIGHT + 0.5, 0.2]} position={[GRID_WIDTH / 2 - 0.5, -GRID_HEIGHT / 2 + 0.5, -0.1]}>
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </Box>

      {/* Grid Background */}
      <gridHelper 
        args={[GRID_WIDTH, GRID_HEIGHT, palette.grid, "#1e1e1e"]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[GRID_WIDTH / 2 - 0.5, -GRID_HEIGHT / 2 + 0.5, -0.05]} 
      />

      {/* Player Ship */}
      <mesh position={[playerPos, -GRID_HEIGHT + 2, 0]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color={palette.player} emissive={palette.player} emissiveIntensity={2} />
      </mesh>

      {/* Bullets */}
      {bullets.map((bullet) => (
        <mesh key={bullet.id} position={[bullet.position[1], -bullet.position[0], 0]}>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={palette.bullets} emissive={palette.bullets} emissiveIntensity={5} />
        </mesh>
      ))}

      {/* Enemies */}
      {enemies.map((enemy) => {
        const enemyColor = palette.enemies[enemy.type % palette.enemies.length];
        return (
          <mesh key={enemy.id} position={[enemy.position[1], -enemy.position[0], 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial 
              color={enemyColor} 
              emissive={enemyColor} 
              emissiveIntensity={1} 
            />
          </mesh>
        );
      })}

      {isGameOver && (
        <group position={[GRID_WIDTH / 2 - 0.5, -GRID_HEIGHT / 2, 5]}>
          <Text
            fontSize={1.5}
            color="#ff0000"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff"
          >
            SYSTEM FAILURE
          </Text>
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            CRITICAL GRID BREACH DETECTED
          </Text>
        </group>
      )}
    </group>
  );
};
