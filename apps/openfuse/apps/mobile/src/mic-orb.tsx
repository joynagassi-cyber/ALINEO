import { createElement, useEffect, useId, useRef } from "react";
import { Platform, View } from "react-native";
import { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Stop, Svg } from "react-native-svg";
import type { MicOrbAppearance } from "../../../packages/domain/src/agent";
import {
  drawMicOrb,
  enter,
  MAX_DPR,
  type MicOrbMotion,
  type MicOrbPalette,
  type MicOrbState,
  poseAt,
  SPILL,
  settled,
} from "./mic-orb-engine";

export type { MicOrbAppearance } from "../../../packages/domain/src/agent";
export type { MicOrbPalette, MicOrbState } from "./mic-orb-engine";

export const DEFAULT_MIC_ORB_APPEARANCE = {
  palette: "alineo",
  hue: 0,
  chroma: 1,
  lightness: 0,
  scale: 1,
  dark: false,
} satisfies MicOrbAppearance;

const paletteByAvatar = { sky: "alineo", sand: "ember", lilac: "graphite" } as const;
export function resolveMicOrbAppearance(
  appearance?: Partial<MicOrbAppearance>,
  variant: "sky" | "sand" | "lilac" = "sky",
): MicOrbAppearance {
  return {
    ...DEFAULT_MIC_ORB_APPEARANCE,
    ...appearance,
    palette: appearance?.palette ?? paletteByAvatar[variant],
  };
}

function adjustColor(hex: string, hueShift: number, chroma: number, lightness: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => c / 255);
  const max = Math.max(...channels);
  const min = Math.min(...channels);
  let hue = 0;
  let saturation = 0;
  let brightness = (max + min) / 2;
  const delta = max - min;
  if (delta) {
    saturation = delta / (1 - Math.abs(2 * brightness - 1));
    if (max === channels[0]) hue = ((channels[1] - channels[2]) / delta) % 6;
    else if (max === channels[1]) hue = (channels[2] - channels[0]) / delta + 2;
    else hue = (channels[0] - channels[1]) / delta + 4;
    hue *= 60;
  }
  hue = (((hue + hueShift) % 360) + 360) % 360;
  saturation = Math.max(0, Math.min(1, saturation * chroma));
  brightness = Math.max(0.04, Math.min(0.96, brightness + lightness));
  const c = (1 - Math.abs(2 * brightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = brightness - c / 2;
  const rgb =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];
  return `#${rgb
    .map((channel) =>
      Math.round((channel + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

const paletteColors: Record<
  MicOrbPalette,
  {
    blue: string;
    pink: string;
    violet: string;
    glow: string;
    grille: string;
    eye: string;
  }
> = {
  alineo: {
    blue: "#F3AE60",
    pink: "#D98A7C",
    violet: "#6D5075",
    glow: "#FFE1A5",
    grille: "#4D3657",
    eye: "#FFF8EF",
  },
  ocean: {
    blue: "#56B7E7",
    pink: "#E87DAD",
    violet: "#6556BC",
    glow: "#81DDF3",
    grille: "#3C4C7D",
    eye: "#FFFFFF",
  },
  ember: {
    blue: "#E79A53",
    pink: "#E96C57",
    violet: "#A64937",
    glow: "#FFD079",
    grille: "#713F2C",
    eye: "#FFF8E9",
  },
  lime: {
    blue: "#71BB7E",
    pink: "#B6D75E",
    violet: "#498B55",
    glow: "#D7F39B",
    grille: "#355C43",
    eye: "#F8FFEA",
  },
  graphite: {
    blue: "#7598D9",
    pink: "#9A91B8",
    violet: "#555B7A",
    glow: "#B6C9EF",
    grille: "#414862",
    eye: "#FFFFFF",
  },
};

const stateLabels: Record<MicOrbState, string> = {
  idle: "prête",
  listening: "attend vos indications",
  thinking: "travaille",
  done: "prête à être vérifiée",
  finished: "mission terminée",
};

/** The animated OpenDuet MicOrb used as Alineo's assistant mark. */
export function MicOrb({
  size = 42,
  state = "idle",
  palette = "alineo",
  dark = false,
  appearance,
  accessible = true,
}: {
  size?: number;
  state?: MicOrbState;
  palette?: MicOrbPalette;
  dark?: boolean;
  appearance?: Partial<MicOrbAppearance>;
  accessible?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const gradientId = useId().replace(/:/g, "");
  const resolved = {
    ...DEFAULT_MIC_ORB_APPEARANCE,
    ...appearance,
    palette: appearance?.palette ?? palette,
  };
  const scale = Math.max(0.7, Math.min(1.3, resolved.scale));
  const darkMode = appearance?.dark ?? dark;
  const appearanceRef = useRef({
    dark: darkMode,
    colour: resolved.palette,
    hue: resolved.hue,
    chroma: resolved.chroma,
    lightness: resolved.lightness,
  });
  appearanceRef.current = {
    dark: darkMode,
    colour: resolved.palette,
    hue: resolved.hue,
    chroma: resolved.chroma,
    lightness: resolved.lightness,
  };
  const drawSize = (size / 0.9) * scale;
  const box = drawSize * (1 + 2 * SPILL);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    const pixels = Math.round(box * dpr);
    canvas.width = pixels;
    canvas.height = pixels;
    const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference?.matches ?? false;
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };
    motionPreference?.addEventListener?.("change", updateMotionPreference);
    const started = performance.now();
    const seed = Math.floor(Math.random() * 0x7fffffff);
    let activeState = stateRef.current;
    let motion: MicOrbMotion = settled(activeState);
    let frame = 0;

    const draw = (now: number) => {
      const time = (now - started) / 1000;
      const nextState = stateRef.current;
      if (nextState !== activeState) {
        if (nextState === "finished") motion = { ...motion, finishedAt: time };
        else motion = enter(motion, nextState, time);
        activeState = nextState;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box, box);
      context.save();
      context.translate(box / 2, box / 2);
      drawMicOrb(
        context,
        drawSize,
        poseAt(motion, time, seed, reducedMotion),
        appearanceRef.current,
      );
      context.restore();
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      motionPreference?.removeEventListener?.("change", updateMotionPreference);
    };
  }, [box, drawSize]);

  const canvas =
    Platform.OS === "web" ? (
      createElement("canvas", {
        ref: canvasRef,
        width: 1,
        height: 1,
        "aria-hidden": true,
        style: {
          position: "absolute",
          left: (size - box) / 2,
          top: (size - box) / 2,
          width: box,
          height: box,
          display: "block",
          pointerEvents: "none",
        },
      })
    ) : (
      <StaticMicOrb
        size={size * scale}
        state={state}
        palette={resolved.palette}
        hue={resolved.hue}
        chroma={resolved.chroma}
        lightness={resolved.lightness}
        dark={darkMode}
        id={gradientId}
      />
    );

  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessible ? `Assistant Alineo, ${stateLabels[state]}` : undefined}
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      {canvas}
    </View>
  );
}

function StaticMicOrb({
  size,
  state,
  palette,
  hue,
  chroma,
  lightness,
  dark,
  id,
}: {
  size: number;
  state: MicOrbState;
  palette: MicOrbPalette;
  hue: number;
  chroma: number;
  lightness: number;
  dark: boolean;
  id: string;
}) {
  const base = paletteColors[palette];
  const colors = {
    blue: adjustColor(base.blue, hue, chroma, lightness),
    pink: adjustColor(base.pink, hue, chroma, lightness),
    violet: adjustColor(base.violet, hue, chroma, lightness),
    glow: adjustColor(base.glow, hue, chroma, lightness),
    grille: adjustColor(base.grille, hue, chroma, lightness - (dark ? 0.08 : 0)),
    eye: base.eye,
  };
  const eyeY = state === "thinking" ? 43 : state === "listening" ? 53 : 49;
  const eyeHeight = state === "finished" ? 0.9 : 2.3;
  const eyeOpacity = state === "finished" ? 0.35 : 1;
  const grilleYs = [39, 45, 51, 57, 63];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessible={false}>
      <Defs>
        <RadialGradient id={`${id}-sphere`} cx="35%" cy="25%" r="78%">
          <Stop offset="0%" stopColor={colors.glow} stopOpacity="0.98" />
          <Stop offset="35%" stopColor={colors.blue} stopOpacity="0.98" />
          <Stop offset="67%" stopColor={colors.pink} stopOpacity="0.95" />
          <Stop offset="100%" stopColor={colors.violet} stopOpacity="0.98" />
        </RadialGradient>
        <RadialGradient id={`${id}-shade`} cx="38%" cy="25%" r="80%">
          <Stop offset="52%" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="100%" stopColor={colors.grille} stopOpacity={dark ? "0.48" : "0.36"} />
        </RadialGradient>
        <RadialGradient id={`${id}-halo`}>
          <Stop offset="42%" stopColor={colors.glow} stopOpacity={dark ? "0.36" : "0.28"} />
          <Stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="47" fill={`url(#${id}-halo)`} />
      <Circle cx="50" cy="50" r="40" fill={`url(#${id}-sphere)`} />
      <Circle cx="50" cy="50" r="40" fill={`url(#${id}-shade)`} />
      <Circle
        cx="50"
        cy="50"
        r="39.2"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.5"
        strokeWidth="1.3"
      />
      <Ellipse cx="41" cy="31" rx="19" ry="7" fill="#FFFFFF" opacity="0.24" />
      <G stroke={colors.grille} strokeWidth="1.5" strokeLinecap="round" opacity="0.84">
        {grilleYs.map((y) => (
          <Line key={`left-${y}`} x1="13" y1={y} x2="29" y2={y} />
        ))}
        {grilleYs.map((y) => (
          <Line key={`right-${y}`} x1="71" y1={y} x2="87" y2={y} />
        ))}
      </G>
      <G fill={colors.eye} opacity={eyeOpacity}>
        <Ellipse cx="42" cy={eyeY} rx="2.8" ry={eyeHeight} />
        <Ellipse cx="58" cy={eyeY} rx="2.8" ry={eyeHeight} />
      </G>
      {state === "done" && (
        <Path
          d="M43 59 Q50 65 57 59"
          fill="none"
          stroke={colors.eye}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}
