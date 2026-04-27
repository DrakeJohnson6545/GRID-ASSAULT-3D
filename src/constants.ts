export const COLOR_PALETTES = [
  {
    name: "Classic Cyber",
    player: "#3b82f6", // Blue
    bullets: "#ffffff",
    enemies: ["#ef4444", "#f59e0b", "#ec4899"], // Red, Orange, Pink
    grid: "#3b82f6"
  },
  {
    name: "Neon Forest",
    player: "#10b981", // Emerald
    bullets: "#ecfdf5",
    enemies: ["#fef08a", "#f97316", "#84cc16"], // Yellow, Orange, Lime
    grid: "#10b981"
  },
  {
    name: "Purple Haze",
    player: "#8b5cf6", // Violet
    bullets: "#f5f3ff",
    enemies: ["#ec4899", "#d946ef", "#a855f7"], // Pink, Fuchsia, Purple
    grid: "#8b5cf6"
  },
  {
    name: "Molten Core",
    player: "#f97316", // Orange
    bullets: "#fff7ed",
    enemies: ["#dc2626", "#b91c1c", "#991b1b"], // Red shades
    grid: "#f97316"
  },
  {
    name: "Deep Space",
    player: "#0ea5e9", // Sky
    bullets: "#f0f9ff",
    enemies: ["#6366f1", "#4f46e5", "#4338ca"], // Indigo shades
    grid: "#0ea5e9"
  },
  {
    name: "Matrix",
    player: "#22c55e", // Green
    bullets: "#f0fdf4",
    enemies: ["#15803d", "#166534", "#14532d"], // Dark green shades
    grid: "#22c55e"
  }
];

export const getPaletteByLevel = (level: number) => {
  return COLOR_PALETTES[(level - 1) % COLOR_PALETTES.length];
};
