export const themePalettes = [
  { id: 'lagoon', name: 'Lagune', colors: ['#75D0D3', '#BADCC3', '#DBA380'] },
  { id: 'coral-sunset', name: 'Corail solaire', colors: ['#DD528D', '#FF8A7A', '#FBAF51'] },
  { id: 'sea-glass', name: 'Verre de mer', colors: ['#1C7883', '#A9BDBB', '#EC7356'] },
  { id: 'ember-plum', name: 'Prune ardente', colors: ['#3D1667', '#DF3562', '#FEB97E'] },
  { id: 'orchid', name: 'Orchidée', colors: ['#5809B0', '#C78DC7', '#F496A6'] },
  { id: 'sunset', name: 'Coucher de soleil', colors: ['#393F73', '#FB743A', '#E83123'] },
  { id: 'forest-gold', name: 'Forêt dorée', colors: ['#113035', '#A7CB8E', '#F3A42E'] },
  { id: 'mango', name: 'Mangue', colors: ['#F8BF54', '#EB5544', '#9020A6'] },
  { id: 'berry-pop', name: 'Baie électrique', colors: ['#FB485E', '#C4659F', '#7D8AFC'] },
  { id: 'neon-mint', name: 'Menthe électrique', colors: ['#47FDCC', '#9877A6', '#D31181'] },
  { id: 'velvet-plum', name: 'Prune velours', colors: ['#5A0C4A', '#E28EB0', '#6A49BE'] },
  { id: 'aurora', name: 'Aurore', colors: ['#6DECDD', '#A787F4', '#EE7A6D'] },
  { id: 'lilac-sky', name: 'Ciel lilas', colors: ['#4FBCF4', '#B05AD5', '#F0B6E8'] },
  { id: 'blue-lagoon', name: 'Lagon bleu', colors: ['#2950B9', '#559ADD', '#905DC4'] },
  { id: 'berry-velvet', name: 'Baie velours', colors: ['#F27796', '#AC5C99', '#623E96'] },
  { id: 'turquoise-pop', name: 'Turquoise pop', colors: ['#4DC3F5', '#42FECB', '#980CD1'] },
  { id: 'mint-iris', name: 'Menthe iris', colors: ['#54E5D6', '#A786F7', '#6A47C9'] },
  { id: 'mimosa', name: 'Mimosa framboise', colors: ['#FBCE13', '#EA7295', '#861FA4'] },
] as const;

export type ThemePaletteId = (typeof themePalettes)[number]['id'];
export type ThemeMode = 'light' | 'dark';

export interface ThemePreference {
  mode: ThemeMode;
  palette: ThemePaletteId;
}

export const DEFAULT_THEME_PREFERENCE: ThemePreference = {
  mode: 'dark',
  palette: 'lagoon',
};

const STORAGE_KEY = 'alineo.theme.v1';
const DARK_SURFACE = '#111722';
const LIGHT_SURFACE = '#FFFFFF';
const INK = '#171B28';
const PAPER = '#FFFFFF';

function findPalette(id: ThemePaletteId) {
  return themePalettes.find((palette) => palette.id === id) ?? themePalettes[0];
}

function isThemePaletteId(value: unknown): value is ThemePaletteId {
  return typeof value === 'string' && themePalettes.some((palette) => palette.id === value);
}

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_THEME_PREFERENCE;
    const value: unknown = JSON.parse(stored);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('mode' in value) ||
      !('palette' in value) ||
      (value.mode !== 'light' && value.mode !== 'dark') ||
      !isThemePaletteId(value.palette)
    ) {
      return DEFAULT_THEME_PREFERENCE;
    }
    return { mode: value.mode, palette: value.palette };
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

type Rgb = readonly [number, number, number];

function parseHex(hex: string): Rgb {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as unknown as Rgb;
}

function linearChannel(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([red, green, blue]: Rgb) {
  return 0.2126 * linearChannel(red) + 0.7152 * linearChannel(green) + 0.0722 * linearChannel(blue);
}

export function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(parseHex(first));
  const secondLuminance = relativeLuminance(parseHex(second));
  const brightest = Math.max(firstLuminance, secondLuminance);
  const darkest = Math.min(firstLuminance, secondLuminance);
  return (brightest + 0.05) / (darkest + 0.05);
}

function rgbToHsl([red, green, blue]: Rgb): [number, number, number] {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return [hue, saturation, lightness];
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSection = hue / 60;
  const secondary = chroma * (1 - Math.abs((hueSection % 2) - 1));
  const rgb: [number, number, number] =
    hueSection < 1 ? [chroma, secondary, 0] :
    hueSection < 2 ? [secondary, chroma, 0] :
    hueSection < 3 ? [0, chroma, secondary] :
    hueSection < 4 ? [0, secondary, chroma] :
    hueSection < 5 ? [secondary, 0, chroma] : [chroma, 0, secondary];
  const match = lightness - chroma / 2;
  return `#${rgb.map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('')}`;
}

function accessibleAccent(seed: string, mode: ThemeMode) {
  const [hue, sourceSaturation, sourceLightness] = rgbToHsl(parseHex(seed));
  const saturation = Math.max(sourceSaturation, 0.42);
  const surface = mode === 'light' ? LIGHT_SURFACE : DARK_SURFACE;
  const step = mode === 'light' ? -0.01 : 0.01;
  let lightness = sourceLightness;
  let accent = hslToHex(hue, saturation, lightness);
  for (let attempt = 0; attempt < 100 && contrastRatio(accent, surface) < 4.8; attempt += 1) {
    lightness = Math.min(0.98, Math.max(0.02, lightness + step));
    accent = hslToHex(hue, saturation, lightness);
  }
  return accent;
}

export function getThemeAccent(preference: ThemePreference) {
  return accessibleAccent(findPalette(preference.palette).colors[1], preference.mode);
}

function rgbChannels(hex: string) {
  return parseHex(hex).join(' ');
}

function contrastingForeground(hex: string) {
  return contrastRatio(hex, PAPER) >= contrastRatio(hex, INK) ? PAPER : INK;
}

export function applyThemePreference(preference: ThemePreference) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const palette = findPalette(preference.palette);
  const accent = getThemeAccent(preference);

  root.dataset.themeMode = preference.mode;
  root.dataset.themePalette = palette.id;
  root.style.setProperty('--palette-start-rgb', rgbChannels(palette.colors[0]));
  root.style.setProperty('--palette-middle-rgb', rgbChannels(palette.colors[1]));
  root.style.setProperty('--palette-end-rgb', rgbChannels(palette.colors[2]));
  root.style.setProperty('--accent-rgb', rgbChannels(accent));
  root.style.setProperty('--accent-foreground', contrastingForeground(accent));

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // The current session still applies if browser storage is unavailable or full.
  }
}
