export type MicOrbState = "idle" | "listening" | "thinking" | "done" | "finished";
export type MicOrbPalette = "alineo" | "ocean" | "ember" | "lime" | "graphite";

type MotionKey = {
  at: number;
  to: number;
  ease?: number;
  spring?: [number, number];
};
type MotionTrack = { from: number; keys: MotionKey[] };

export type MicOrbMotion = {
  listen: MotionTrack;
  think: MotionTrack;
  done: MotionTrack;
  smile: MotionTrack;
  ax: MotionTrack;
  ay: MotionTrack;
  doneAt: number;
  noticedAt: number;
  finishedAt: number;
  nods: number[];
  keys: number[];
};

export type MicOrbPose = {
  ta: number;
  listen: number;
  think: number;
  done: number;
  smile: number;
  tilt: number;
  ax: number;
  ay: number;
  blink: number;
  nod: number;
  key: number;
  doneAge: number;
  noticeAge: number;
  finishAge: number;
  breath: number;
};

export function drawMicOrb(
  context: CanvasRenderingContext2D,
  size: number,
  pose: MicOrbPose,
  options: {
    dark: boolean;
    colour?: MicOrbPalette;
    hue?: number;
    chroma?: number;
    lightness?: number;
  },
): void;
export function settled(state: MicOrbState): MicOrbMotion;
export function enter(motion: MicOrbMotion, state: MicOrbState, now: number): MicOrbMotion;
export function poseAt(
  motion: MicOrbMotion,
  time: number,
  seed: number,
  reducedMotion: boolean,
): MicOrbPose;
export const SPILL: number;
export const MAX_DPR: number;
