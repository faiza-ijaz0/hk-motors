/**
 * TypeScript mirror of the brand primitives in src/styles/tokens.css.
 * Use for contexts that can't read CSS custom properties directly
 * (e.g. <meta theme-color>, canvas/chart libraries, email templates).
 * The CSS custom properties remain the source of truth for styling.
 */
export const brand = {
  primary: "#C00000",
  secondary: "#D9D9D9",
  background: "#050505",
} as const;

export const chartPalette = [
  "#C00000",
  "#D9D9D9",
  "#7A7A7A",
  "#6E0000",
  "#F5F5F5",
] as const;

export type BrandColor = keyof typeof brand;
