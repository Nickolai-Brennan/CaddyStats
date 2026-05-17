const FONT_STACK_SANS = [
  '"Inter"',
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'sans-serif',
].join(', ');

const FONT_STACK_MONO = [
  '"IBM Plex Mono"',
  'ui-monospace',
  'SFMono-Regular',
  'Menlo',
  'Monaco',
  'Consolas',
  '"Liberation Mono"',
  'monospace',
].join(', ');

export const typographySystem = {
  fontFamily: {
    sans: FONT_STACK_SANS,
    mono: FONT_STACK_MONO,
  },
  scale: {
    display: {
      xl: 'clamp(2.75rem, 6vw, 4.75rem)',
      lg: 'clamp(2.25rem, 4.5vw, 3.75rem)',
    },
    heading: {
      h1: 'clamp(2.125rem, 4vw, 3.25rem)',
      h2: 'clamp(1.75rem, 3vw, 2.5rem)',
      h3: 'clamp(1.5rem, 2.25vw, 2rem)',
      h4: '1.375rem',
      h5: '1.125rem',
      h6: '1rem',
    },
    body: {
      lg: '1.125rem',
      md: '1rem',
      sm: '0.9375rem',
    },
    caption: {
      md: '0.8125rem',
      sm: '0.75rem',
    },
  },
  metrics: {
    percentageDigits: 1,
    tabularVariant: 'tabular-nums',
  },
} as const;

export const typographyClasses = {
  displayXl: 'font-semibold tracking-tight text-balance',
  displayLg: 'font-semibold tracking-tight text-balance',
  h1: 'font-semibold tracking-tight text-balance',
  h2: 'font-semibold tracking-tight text-balance',
  h3: 'font-semibold tracking-tight',
  h4: 'font-semibold tracking-tight',
  h5: 'font-semibold tracking-tight',
  h6: 'font-semibold uppercase tracking-wide',
  bodyLg: 'leading-8 text-slate-200',
  body: 'leading-7 text-slate-300',
  bodySm: 'leading-6 text-slate-400',
  caption: 'text-slate-500 uppercase tracking-[0.2em]',
  metric: 'font-mono tabular-nums tracking-tight',
} as const;

export function applyTypographySystem(target: HTMLElement = document.documentElement) {
  target.style.setProperty('--font-sans', typographySystem.fontFamily.sans);
  target.style.setProperty('--font-mono', typographySystem.fontFamily.mono);
  target.style.setProperty('--text-display-xl', typographySystem.scale.display.xl);
  target.style.setProperty('--text-display-lg', typographySystem.scale.display.lg);
  target.style.setProperty('--text-h1', typographySystem.scale.heading.h1);
  target.style.setProperty('--text-h2', typographySystem.scale.heading.h2);
  target.style.setProperty('--text-h3', typographySystem.scale.heading.h3);
  target.style.setProperty('--text-h4', typographySystem.scale.heading.h4);
  target.style.setProperty('--text-h5', typographySystem.scale.heading.h5);
  target.style.setProperty('--text-h6', typographySystem.scale.heading.h6);
  target.style.setProperty('--text-body-lg', typographySystem.scale.body.lg);
  target.style.setProperty('--text-body-md', typographySystem.scale.body.md);
  target.style.setProperty('--text-body-sm', typographySystem.scale.body.sm);
  target.style.setProperty('--text-caption-md', typographySystem.scale.caption.md);
  target.style.setProperty('--text-caption-sm', typographySystem.scale.caption.sm);
  target.dataset.typography = 'ds4';
}

export function formatPercentage(value: number, digits = typographySystem.metrics.percentageDigits) {
  return `${value.toFixed(digits)}%`;
}

export function formatOdds(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
