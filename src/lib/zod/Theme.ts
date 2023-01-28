export const THEME_SYSTEM = 'system';
export const THEME_NAMES = ['Lilac', 'Honey', 'Mint', 'Rose', 'Sky'] as const;
export const THEME_VALUES = ['lilac', 'gold', 'teal', 'pink', 'sky'] as const;

export type ThemeName = (typeof THEME_NAMES)[number];
export type ThemeValue = (typeof THEME_VALUES)[number];
export type ThemeAnyValue = ThemeValue | typeof THEME_SYSTEM;
