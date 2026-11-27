export const colors = {
  canvas: "#0B0C0D",
  card: "#17191B",
  raised: "#1D2022",
  text: "#F2F4F5",
  muted: "#B6BBBF",
  line: "#2B2E30",
  control: "#70777B",
  focus: "#83E2CC",
  accent: "#20332F",
  accentDark: "#83E2CC",
  selected: "#25292B",
  sky: "#1C272B",
  green: "#1B2A22",
  lavender: "#27232F",
  orange: "#35281C",
  danger: "#FF9C9C",
  warning: "#F0C275",
  errorSurface: "#351F22",
  disabled: "#202326",
} as const;

function relativeLuminance(hex: string): number {
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error(`Expected a six-digit hexadecimal color, received: ${hex}`);
  }
  const channels = [0, 2, 4].map(
    (offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}
