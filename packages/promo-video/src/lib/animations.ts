export const spring = {
  default: { damping: 20, stiffness: 100, mass: 0.8 },
  gentle: { damping: 30, stiffness: 80, mass: 1 },
  snappy: { damping: 15, stiffness: 200, mass: 0.5 },
} as const;

export const timing = {
  fast: 10,
  normal: 20,
  slow: 40,
} as const;

export const ease = {
  inOut: [0.4, 0, 0.2, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
} as const;
