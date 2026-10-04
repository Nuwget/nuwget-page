// All coordinates are percentages of the hero illustration (1600 × 1067).
export const SCENE = {
  width: 1600,
  height: 1067,
  focusX: 0.4, // Dudu's horizontal center, used to keep him in frame on narrow screens
  eyes: {
    left: { x: 26.4, y: 46.3, w: 3.6, h: 7.2, dy: 7.3 },
    right: { x: 38.2, y: 47.0, w: 4.5, h: 8.0, dy: 8.2 },
  },
  glows: {
    moon: { x: 85, y: 7 },
    lamp: { x: 93.5, y: 20.5 },
    candle: { x: 92.3, y: 57.5 },
    lantern: { x: 6, y: 35.5 },
    screen: { x: 36, y: 66 },
  },
  src: {
    full: "/images/dudu-hero-1600.webp",
    small: "/images/dudu-hero-1000.webp",
  },
} as const;
