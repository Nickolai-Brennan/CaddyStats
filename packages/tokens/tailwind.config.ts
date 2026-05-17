import type { Config } from "tailwindcss";
import { designSystemTheme } from "./theme";

export const tokenizedTailwindTheme = {
  spacing: designSystemTheme.spacing,
  borderRadius: designSystemTheme.borderRadius,
  zIndex: designSystemTheme.zIndex,
  transitionDuration: {
    fast: designSystemTheme.motion["duration-fast"],
    DEFAULT: designSystemTheme.motion["duration-default"],
    slow: designSystemTheme.motion["duration-slow"],
  },
  transitionTimingFunction: {
    standard: designSystemTheme.motion["easing-standard"],
    emphasized: designSystemTheme.motion["easing-emphasized"],
  },
} as const;

const config: Pick<Config, "theme"> = {
  theme: {
    extend: tokenizedTailwindTheme,
  },
};

export default config;
