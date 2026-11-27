import { beforeEach, describe, expect, it } from 'vitest';
import {
  contrastRatio,
  DEFAULT_THEME_PREFERENCE,
  getThemeAccent,
  readThemePreference,
  themePalettes,
} from './theme';

beforeEach(() => {
  window.localStorage.clear();
});

describe('ALINEO appearance palettes', () => {
  it('offers the 18 distinct gradients from the supplied palette sheet', () => {
    expect(themePalettes).toHaveLength(18);
    expect(new Set(themePalettes.map(({ id }) => id)).size).toBe(18);
    expect(themePalettes.every(({ colors }) => colors.length === 3)).toBe(true);
  });

  it('keeps the selected accent and its foreground legible in both color modes', () => {
    for (const palette of themePalettes) {
      for (const mode of ['light', 'dark'] as const) {
        const accent = getThemeAccent({ palette: palette.id, mode });
        const surfaces = mode === 'light' ? ['#FFFFFF', '#F7F8FB'] : ['#111722', '#171E2A'];
        const bestForeground = Math.max(contrastRatio(accent, '#FFFFFF'), contrastRatio(accent, '#171B28'));

        for (const surface of surfaces) {
          expect(contrastRatio(accent, surface), `${palette.name} on ${surface} in ${mode} mode`).toBeGreaterThanOrEqual(4.5);
        }
        expect(bestForeground, `${palette.name} button text in ${mode} mode`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('uses the dark lagoon theme by default and restores a saved choice', () => {
    expect(readThemePreference()).toEqual(DEFAULT_THEME_PREFERENCE);
    window.localStorage.setItem('alineo.theme.v1', JSON.stringify({ mode: 'light', palette: 'mint-iris' }));
    expect(readThemePreference()).toEqual({ mode: 'light', palette: 'mint-iris' });
  });

  it('falls back safely when saved theme data is invalid', () => {
    window.localStorage.setItem('alineo.theme.v1', '{not valid');
    expect(readThemePreference()).toEqual(DEFAULT_THEME_PREFERENCE);
    window.localStorage.setItem('alineo.theme.v1', JSON.stringify({ mode: 'solar', palette: 'unknown' }));
    expect(readThemePreference()).toEqual(DEFAULT_THEME_PREFERENCE);
  });
});
