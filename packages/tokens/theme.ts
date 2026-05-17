import tokens from "./tokens.json";

export const themeTokens = tokens;

export const designSystemTheme = {
  spacing: tokens.spacing,
  borderRadius: tokens.radius,
  motion: tokens.motion,
  zIndex: tokens.layer,
} as const;

export type ThemeTokens = typeof themeTokens;
