export const theme = {
  primary: "#24998B",
  accent: "#24998B",
  success: "green",
  warning: "yellow",
  muted: "gray",
  text: "white",
  background: "black",
} as const;

export type ThemeColor = (typeof theme)[keyof typeof theme];

export const icons = {
  bullet: "›",
  arrow: "→",
  dot: "•",
  separator: "│",
  check: "✓",
} as const;
