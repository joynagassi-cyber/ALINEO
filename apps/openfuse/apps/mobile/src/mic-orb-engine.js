/*
 * MicOrb drawing and motion engine adapted from CopilotKit/OpenDuet commit
 * 55f1ef113584e748bc2abb7c0d8d97753e9748db (`mic-orb-draw.ts` and `mic-orb.tsx`). The original
 * drawing equations are retained; only its standalone customization UI is omitted. MIT licensed;
 * see `../third-party-licenses/OpenDuet-MIT-LICENSE.txt`.
 */
/**
 * The mic orb, OpenDuet's presence, drawn on a 2D canvas exactly as the launch film draws it: a
 * glass sphere of drifting colour, two eye-lights that look, blink and smile, and a lined grille on
 * each side like a microphone's. Ocean is OpenDuet's original colour family; Alineo adds the
 * named alternatives and bounded appearance adjustments. One thing the film does not have: a
 * finish, the check and the burst of rays the orb plays when something the person allowed is done.
 *
 * Every frame is a pure function of an `OrbPose`, so the component that animates it owns time and
 * this file owns only the picture.
 */
const TAU = Math.PI * 2;
const PI = Math.PI;
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, u) => a + (b - a) * u;
const eio = (u) => {
  const v = clamp(u);
  return v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2;
};
const eout = (u) => 1 - (1 - clamp(u)) ** 3;
const smooth = (u) => {
  const v = clamp(u);
  return v * v * (3 - 2 * v);
};
const bump = (u) => (u <= 0 || u >= 1 ? 0 : Math.sin(PI * u) ** 2);
/** Step response of a damped spring: closed form, so it is a pure function of elapsed time. */
function springStep(tau, w, z) {
  if (tau <= 0) return 0;
  if (z >= 1) return 1 - Math.exp(-w * tau) * (1 + w * tau);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + ((z * w) / wd) * Math.sin(wd * tau));
}
/**
 * The track's value at time t. Each key moves the value from the previous key's value to its own,
 * and the responses are summed, which for springs is exactly a spring chasing a stepped target:
 * anticipation, overshoot and settle all fall out of the same maths.
 */
function track(tr, t) {
  let v = tr.from;
  let prev = tr.from;
  for (const k of tr.keys) {
    if (t < k.at) break;
    const tau = t - k.at;
    const r = "ease" in k ? eio(tau / k.ease) : springStep(tau, k.spring[0], k.spring[1]);
    v += (k.to - prev) * r;
    prev = k.to;
  }
  return v;
}
/** A blink at `tau` seconds after it starts: shut fast, open slower, 0.24 s in all. */
function blinkCurve(tau) {
  if (tau < 0 || tau > 0.24) return 0;
  return tau < 0.07 ? eout(tau / 0.07) : 1 - eio((tau - 0.07) / 0.17);
}
/** A nod that rings down, `tau` seconds after it starts. */
function nodCurve(tau) {
  return tau >= 0 && tau < 2.2 ? Math.exp(-3 * tau) * Math.sin(8 * tau) : 0;
}
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/**
 * Where it looks while nothing needs it: mostly at you, now and then a glance aside and back.
 * Each look snaps over 0.14 s and then holds, so the pauses are part of the motion.
 */
function restLook(ta, period, seed) {
  const k = Math.floor(ta / period);
  const f = ta - k * period;
  const at = (n) => {
    const r = mulberry32((seed * 7919 + n * 104729) | 0);
    return r() < 0.55
      ? [0, 0, 0]
      : [(r() * 2 - 1) * 0.7, (r() * 2 - 1) * 0.4, (r() * 2 - 1) * 0.24];
  };
  const a = at(k - 1);
  const b = at(k);
  const u = eout(f / 0.14);
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
}
function ok2rgb(L, C, h) {
  const hr = (h * PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const out = [];
  for (const x of linear) {
    if (x < -0.002 || x > 1.002) return null;
    const c = clamp(x);
    out.push(Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)));
  }
  return out;
}
/** An oklch colour as sRGB, losing chroma until it fits rather than clipping its hue. */
function oklch(L, C, h) {
  let chroma = C;
  for (let i = 0; i < 40; i++) {
    const c = ok2rgb(L, chroma, h);
    if (c) return c;
    chroma *= 0.95;
  }
  return ok2rgb(L, 0, h) ?? [128, 128, 128];
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a <= 0 ? 0 : a >= 1 ? 1 : a.toFixed(3)})`;
const mix = (a, b, u) => [
  Math.round(lerp(a[0], b[0], u)),
  Math.round(lerp(a[1], b[1], u)),
  Math.round(lerp(a[2], b[2], u)),
];
const WHITE = [255, 255, 255];
const INK = [20, 16, 33];
/**
 * The orb's colours, as oklch [L, C, h]: four tones for the sphere's drifting colour and its pale
 * base. `violet` is also the deep tone the grilles are made of, and `mag` the light their slots glow
 * with; `shade` tints the sphere's rim, as an rgb triple.
 *
 * Ocean is OpenDuet's own. The other three are the orb's other colours, the same four the launch
 * film's title draws (launch-film/film/src/duet/micorb.ts), and are what every other Bot wears, so a
 * roster reads as one family of Duets rather than OpenDuet beside unrelated discs.
 */
const PALETTES = {
  alineo: {
    pink: [0.72, 0.13, 22],
    blue: [0.81, 0.14, 76],
    violet: [0.47, 0.13, 304],
    mag: [0.9, 0.11, 78],
    bg: [0.91, 0.025, 44],
    shade: "52,34,58",
  },
  ocean: {
    pink: [0.75, 0.13, 232],
    blue: [0.74, 0.13, 205],
    violet: [0.53, 0.2, 262],
    mag: [0.86, 0.08, 220],
    bg: [0.93, 0.025, 235],
    shade: "14,30,80",
  },
  ember: {
    pink: [0.66, 0.19, 15],
    blue: [0.8, 0.15, 72],
    violet: [0.6, 0.19, 38],
    mag: [0.88, 0.12, 90],
    bg: [0.95, 0.03, 70],
    shade: "92,34,20",
  },
  lime: {
    pink: [0.88, 0.19, 125],
    blue: [0.74, 0.17, 145],
    violet: [0.52, 0.14, 150],
    mag: [0.93, 0.15, 108],
    bg: [0.96, 0.04, 122],
    shade: "22,62,36",
  },
  graphite: {
    pink: [0.84, 0.015, 260],
    blue: [0.64, 0.2, 256],
    violet: [0.4, 0.03, 265],
    mag: [0.82, 0.1, 250],
    bg: [0.86, 0.01, 260],
    shade: "15,18,30",
  },
};
const paletteMemo = new Map();
/** A colour with its saturation and hue nudged, as the orb livens when it listens and cools when it works. */
function palette(sat, hue, colour = "ocean", adjustments = {}) {
  const ks = Math.round(clamp(sat, 0.5, 1.3) * 50) / 50;
  const kh = Math.round(hue * 2) / 2;
  const customHue = Math.round(clamp(adjustments.hue ?? 0, -180, 180) * 2) / 2;
  const customChroma = Math.round(clamp(adjustments.chroma ?? 1, 0, 2) * 100) / 100;
  const customLightness = Math.round(clamp(adjustments.lightness ?? 0, -0.2, 0.2) * 1000) / 1000;
  const key = `${colour}|${ks}|${kh}|${customHue}|${customChroma}|${customLightness}`;
  let p = paletteMemo.get(key);
  if (!p) {
    const set = PALETTES[colour];
    const c = (k, sk = ks, hk = kh) =>
      oklch(
        clamp(set[k][0] + customLightness, 0.02, 0.98),
        set[k][1] * sk * customChroma,
        set[k][2] + hk + customHue,
      );
    p = {
      pink: c("pink"),
      blue: c("blue"),
      violet: c("violet"),
      mag: c("mag"),
      bg: c("bg", 1, kh * 0.5),
      shade: set.shade,
    };
    paletteMemo.set(key, p);
  }
  return p;
}
// ---------- the finish ----------
/** How long a finish plays, in seconds, from the eyes giving way to the check until they are back. */
const FINISH_S = 1.2;
/** A moment in a finish when the check is whole and the rays have gone: the finish as a still. */
const FINISH_HELD = 0.8;
/** The short strokes that burst out round the orb when it finishes. */
const RAYS = 10;
const NO_FINISH = {
  check: 0,
  checkAlpha: 0,
  rays: -1,
  eyes: 1,
  pop: 0,
};
/**
 * A finish `age` seconds in: the eyes fade as the sphere pops and the check strokes on, the rays
 * burst outward and fade, the check holds, then fades as the eyes come back. -1 is no finish.
 */
function finishPhase(age) {
  if (!(age >= 0 && age < FINISH_S)) return NO_FINISH;
  const back = smooth((age - 0.85) / 0.3);
  return {
    check: eout((age - 0.06) / 0.3),
    checkAlpha: 1 - back,
    rays: age >= 0.1 && age < 0.75 ? (age - 0.1) / 0.65 : -1,
    eyes: age < 0.85 ? 1 - smooth(age / 0.12) : back,
    pop: bump(age / 0.5),
  };
}
function blob(ctx, x, y, r, c, a) {
  if (a <= 0.003 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(c, a));
  g.addColorStop(0.42, rgba(c, a * 0.78));
  g.addColorStop(0.76, rgba(c, a * 0.24));
  g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function light(ctx, x, y, r, a) {
  if (a <= 0.003 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,255,255,${clamp(a).toFixed(3)})`);
  g.addColorStop(0.45, `rgba(255,255,255,${clamp(a * 0.42).toFixed(3)})`);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function circle(ctx, r) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
}
// angle, orbit, radius of the mesh's four colour masses
const MESH = [
  [3.95, 0.43, 0.88],
  [5.5, 0.45, 0.74],
  [0.78, 0.45, 0.86],
  [2.36, 0.45, 0.88],
];
function meshPos(ta, fast) {
  const rot = fast ? 1.45 * ta + 1.1 : 0.22 * ta;
  return MESH.map((b, i) => {
    const a =
      b[0] +
      rot +
      (fast ? 0.5 * Math.sin(1.1 * ta + i * 1.93) : 0.42 * Math.sin(0.29 * ta + i * 1.93));
    return [Math.cos(a) * b[1], Math.sin(a) * b[1], b[2]];
  });
}
/** Four soft colour masses drifting round a pale base; a faster swirl joins them while it works. */
function mesh(ctx, R, S, pal, lx, ly) {
  ctx.fillStyle = rgba(pal.bg, 1);
  ctx.fillRect(-R * 1.7, -R * 1.7, R * 3.4, R * 3.4);
  const cols = [pal.blue, pal.mag, pal.pink, pal.violet];
  meshPos(S.ta, false).forEach((p, i) => {
    blob(ctx, p[0] * R + lx * R, p[1] * R + ly * R, p[2] * R, cols[i], 0.94);
  });
  const swirl = S.think * 0.55;
  if (swirl > 0.01) {
    meshPos(S.ta, true).forEach((p, i) => {
      blob(
        ctx,
        p[0] * R + lx * R * 0.6,
        p[1] * R + ly * R * 0.6,
        p[2] * R * 0.92,
        cols[i],
        0.9 * swirl,
      );
    });
  }
}
/** Lit top edge, shaded bottom: what makes the disc read as a sphere. Call inside the clip. */
function rim(ctx, R, dark, shade) {
  const g = ctx.createRadialGradient(0, -R * 0.3, R * 0.55, 0, -R * 0.12, R * 1.16);
  g.addColorStop(0, `rgba(${shade},0)`);
  g.addColorStop(0.72, `rgba(${shade},0)`);
  g.addColorStop(1, `rgba(${shade},${dark ? 0.3 : 0.24})`);
  ctx.fillStyle = g;
  ctx.fillRect(-R * 1.3, -R * 1.3, R * 2.6, R * 2.6);
  const lw = Math.max(1, R * 0.05);
  const lg = ctx.createLinearGradient(0, -R, 0, R * 0.25);
  lg.addColorStop(0, "rgba(255,255,255,.7)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = lw;
  circle(ctx, R - lw * 0.5);
  ctx.stroke();
}
function glow(ctx, R, amt, c, dark) {
  if (amt < 0.005) return;
  const r = R * 1.85;
  const g = ctx.createRadialGradient(0, 0, R * 0.55, 0, 0, r);
  g.addColorStop(0, rgba(c, amt * (dark ? 0.8 : 0.5)));
  g.addColorStop(0.38, rgba(c, amt * (dark ? 0.34 : 0.18)));
  g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-r, -r, 2 * r, 2 * r);
}
/** One ring that leaves the orb and fades: the landing's ping. */
function ping(ctx, r0, age, pal, dark) {
  const dur = 1;
  if (!(age >= 0 && age < dur)) return;
  const u = age / dur;
  const r = r0 * (1.02 + (1.5 - 1.02) * eout(u));
  const a = (1 - u) ** 1.5;
  ctx.strokeStyle = rgba(dark ? mix(pal.blue, WHITE, 0.2) : pal.violet, a * (dark ? 0.75 : 0.62));
  ctx.lineWidth = Math.max(1, r0 * 0.07 * (1 - u * 0.6));
  circle(ctx, r);
  ctx.stroke();
}
/**
 * The finish's burst: a ring of short strokes, one straight up, that fly out past the grilles,
 * shortening and fading as they go. Every other one is longer, so the ring sparkles rather than ticks.
 */
function rays(ctx, r0, u, pal, dark) {
  if (!(u >= 0 && u < 1)) return;
  const travel = eout(u);
  const a = (1 - u) ** 1.4;
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = rgba(dark ? mix(pal.blue, WHITE, 0.25) : pal.violet, a * (dark ? 0.9 : 0.8));
  ctx.lineWidth = Math.max(1, r0 * 0.09 * (1 - 0.5 * u));
  for (let i = 0; i < RAYS; i++) {
    const angle = -PI / 2 + (TAU * i) / RAYS;
    const length = r0 * (i % 2 === 0 ? 0.3 : 0.2) * (1 - 0.55 * u);
    const inner = r0 * (1.3 + 0.32 * travel);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(dx * inner, dy * inner);
    ctx.lineTo(dx * (inner + length), dy * (inner + length));
    ctx.stroke();
  }
  ctx.restore();
}
// The check's three points, as shares of the sphere's radius: in at the left, down to the elbow, up
// to the right. Its two legs are about 0.37 and 0.75 of the radius long.
const CHECK = [
  [-0.38, 0.02],
  [-0.12, 0.28],
  [0.42, -0.26],
];
/** The check, stroked on along its length to `drawn` (0 to 1), in the eye-lights' white. */
function check(ctx, R, drawn, alpha, dark) {
  if (drawn <= 0 || alpha <= 0.003) return;
  const [a, b, c] = CHECK.map(([x, y]) => [x * R, y * R]);
  const first = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const second = Math.hypot(c[0] - b[0], c[1] - b[1]);
  const along = drawn * (first + second);
  ctx.save();
  ctx.globalAlpha = clamp(alpha);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.6, R * 0.17);
  ctx.strokeStyle = "rgba(255,255,255,.97)";
  ctx.shadowColor = dark ? "rgba(8,6,20,.4)" : "rgba(20,16,33,.28)";
  ctx.shadowBlur = Math.max(1, R * 0.07);
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  if (along <= first) {
    const u = along / first;
    ctx.lineTo(lerp(a[0], b[0], u), lerp(a[1], b[1], u));
  } else {
    const u = (along - first) / second;
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(lerp(b[0], c[0], u), lerp(b[1], c[1], u));
  }
  ctx.stroke();
  ctx.restore();
}
/** The sphere's scale: it breathes, swells a little to listen and to land, and pops as a check lands. */
function scaleOf(S, finish) {
  const L = clamp(S.listen, 0, 1.25);
  return 1 + 0.015 * S.breath * (1 - S.think) + 0.025 * L + 0.04 * S.done + 0.06 * finish.pop;
}
function eyePath(ctx, w, h, smile) {
  const rx = (w / 2) * (1 + 0.12 * smile);
  const ry = h / 2;
  const e = 0.32 * ry * smile;
  const top = -ry;
  const bot = lerp(ry, -0.36 * ry, smile);
  const ct = (top - 0.25 * e) / 0.75;
  const cb = (bot - 0.25 * e) / 0.75;
  ctx.beginPath();
  ctx.moveTo(-rx, e);
  ctx.bezierCurveTo(-rx, ct, rx, ct, rx, e);
  ctx.bezierCurveTo(rx, cb, -rx, cb, -rx, e);
  ctx.closePath();
}
/** The sphere: the mesh turned toward where it looks, its rim, and two eye-lights that blink and smile. */
function sphere(ctx, R, S, pal, dark, size) {
  const na = S.noticeAge;
  const perk = na >= 0 && na < 1.6 ? Math.exp(-2.6 * na) * smooth(na / 0.1) : 0;
  const finish = finishPhase(S.finishAge);
  const sc = scaleOf(S, finish);
  ctx.save();
  ctx.translate(0, S.nod * R * 0.11);
  ctx.scale(sc, sc);
  circle(ctx, R);
  ctx.clip();
  const yaw = clamp(S.ax, -1.1, 1.1) * 0.62;
  const pitch = -clamp(S.ay, -1.1, 1.1) * 0.5;
  const roll = S.tilt;
  mesh(ctx, R, S, pal, Math.sin(yaw) * 0.2, -Math.sin(pitch) * 0.16);
  light(ctx, -0.42 * R, -0.5 * R, 0.5 * R, 0.26);
  light(ctx, 0, R * 0.05, R * 0.9, 0.28 * S.done);
  rim(ctx, R, dark, pal.shade);
  const small = size < 40;
  const widen = 1 + 0.16 * perk;
  const open = clamp(1 - 0.94 * S.blink) * (1 - 0.3 * S.think) * widen;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const ew = Math.max(small ? 2.4 : 1.8, R * 0.16 * widen);
  const eh = Math.max(small ? 3.4 : 2.4, R * 0.3);
  for (const side of [-1, 1]) {
    if (finish.eyes <= 0.003) break;
    const lon = side * 0.35;
    const lat = 0.05 + 0.04 * S.smile;
    const x = Math.sin(lon) * Math.cos(lat);
    const y = Math.sin(lat);
    const z = Math.cos(lon) * Math.cos(lat);
    const y1 = y * Math.cos(pitch) + z * Math.sin(pitch);
    const z1 = -y * Math.sin(pitch) + z * Math.cos(pitch);
    const x2 = x * Math.cos(yaw) + z1 * Math.sin(yaw);
    const sx = x2 * cr - y1 * sr;
    const sy = x2 * sr + y1 * cr;
    const fx = Math.sqrt(clamp(1 - sx * sx, 0.12, 1));
    const fy = Math.sqrt(clamp(1 - sy * sy, 0.2, 1));
    const h = Math.max(small ? 1.1 : 0.9, eh * open * fy);
    ctx.save();
    ctx.globalAlpha = finish.eyes;
    ctx.translate(sx * R * 0.84, -sy * R * 0.84 + (eh - h) * 0.28);
    ctx.rotate(-roll);
    ctx.shadowColor = dark ? "rgba(8,6,20,.4)" : "rgba(20,16,33,.28)";
    ctx.shadowBlur = Math.max(1, R * 0.07);
    ctx.fillStyle = "rgba(255,255,255,.97)";
    eyePath(ctx, ew * fx, h, clamp(S.smile) * (1 - S.blink));
    ctx.fill();
    ctx.restore();
  }
  check(ctx, R, finish.check, finish.checkAlpha, dark);
  ctx.restore();
}
// ---------- the grilles ----------
const SLOTS = 5;
/**
 * A lined pad on each side, like a microphone's, its inner edge behind the sphere. Tucked at rest,
 * open to listen with the slots lighting from the bottom on each keystroke, a light scanning up and
 * down while it works, a flash and a flare when it notices you and when it lands.
 */
function grilles(ctx, r, S, pal) {
  const L = clamp(S.listen);
  const th = S.think;
  const fold = clamp(lerp(lerp(lerp(0.8, 0.18, L), 0.05, th), 0, clamp(S.done)));
  const open = 1 - fold;
  let flare = 0.08 * open + 0.06 * L;
  let flash = 0;
  const na = S.noticeAge;
  const da = S.doneAge;
  if (na >= 0 && na < 1.4) {
    flare += 0.22 * Math.exp(-3.5 * na) * smooth(na / 0.08);
    flash = Math.max(flash, bump(na / 0.5));
  }
  if (da >= 0 && da < 1.4) {
    flare += 0.3 * bump(clamp(da / 0.9));
    flash = Math.max(flash, bump(da / 0.7));
  }
  const out = 0.06 + 0.08 * open;
  const lift = da >= 0 && da < 1 ? 0.04 * bump(da / 0.6) : 0;
  const level = clamp(0.16 * L * (1 - th) + 0.95 * S.key * L);
  const scan = (0.5 + 0.5 * Math.sin(2.4 * S.ta)) * (SLOTS - 1);
  const top = mix(pal.violet, WHITE, 0.08);
  const bot = mix(pal.violet, INK, 0.3);
  const edge = mix(pal.violet, INK, 0.55);
  const slot = mix(pal.violet, INK, 0.72);
  const lit = mix(pal.mag, WHITE, 0.45);
  const w = 0.5 * r;
  const h = r;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * r * (0.98 + out), r * 0.04 - lift * r);
    ctx.rotate(-side * (0.14 - flare));
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, rgba(top, 1));
    g.addColorStop(1, rgba(bot, 1));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 0.22 * r);
    ctx.fill();
    // a soft light down the outer edge, so the pad reads as a rounded capsule
    const hl = ctx.createLinearGradient((side * w) / 2, 0, -side * w * 0.1, 0);
    hl.addColorStop(0, "rgba(255,255,255,.28)");
    hl.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hl;
    ctx.fill();
    ctx.strokeStyle = rgba(edge, 1);
    ctx.lineWidth = Math.max(0.8, 0.04 * r);
    ctx.stroke();
    // The slots sit on the part of the pad that shows beside the sphere, bottom (i = 0) to top.
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(0.8, 0.065 * r);
    const xa = side * w * 0.02;
    const xb = side * w * 0.3;
    for (let i = 0; i < SLOTS; i++) {
      const y = h * 0.32 - (h * 0.64 * i) / (SLOTS - 1);
      ctx.strokeStyle = rgba(slot, 1);
      ctx.beginPath();
      ctx.moveTo(xa, y);
      ctx.lineTo(xb, y);
      ctx.stroke();
      const amt = clamp(
        Math.max(level * SLOTS - i, th * Math.exp(-((i - scan) ** 2) / 0.5), flash),
      );
      if (amt > 0.02) {
        ctx.save();
        ctx.shadowColor = rgba(lit, 0.9 * amt);
        ctx.shadowBlur = 0.12 * r;
        ctx.strokeStyle = rgba(lit, amt);
        ctx.beginPath();
        ctx.moveTo(xa, y);
        ctx.lineTo(xb, y);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}
/**
 * The whole orb, centred on the context's origin, for a footprint of `size` CSS px (R = size / 2).
 * Its glow, the landing's ping and a finish's rays spill past the footprint, so draw it on a canvas
 * twice its size.
 */
function drawMicOrb(ctx, size, S, { dark, colour = "ocean", hue = 0, chroma = 1, lightness = 0 }) {
  const finish = finishPhase(S.finishAge);
  const pal = palette(
    0.9 + 0.14 * clamp(S.listen) + 0.08 * S.think + 0.12 * clamp(S.done),
    -6 * S.think,
    colour,
    { hue, chroma, lightness },
  );
  const r = (size / 2) * 0.72;
  const sc = scaleOf(S, finish);
  const glowAmt = clamp(
    0.18 + 0.42 * clamp(S.listen) + 0.22 * S.think + 0.55 * S.done + 0.45 * finish.pop,
  );
  glow(ctx, r * sc, glowAmt * 0.85, mix(pal.blue, pal.violet, 0.4), dark);
  ping(ctx, r, S.doneAge, pal, dark);
  rays(ctx, r, finish.rays, pal, dark);
  ctx.save();
  ctx.translate(0, S.nod * r * 0.11);
  ctx.rotate(S.tilt * 0.5);
  grilles(ctx, r, S, pal);
  ctx.restore();
  sphere(ctx, r, S, pal, dark, size * 0.72);
}

/* ===== 2. Animation : état -> pose, extrait de mic-orb.tsx (sans React) ===== */
/** How long a finish plays: the check, its rays, and the eyes coming back. */
const LOOK_AT_YOU = [0, 0.04];
/** Up and aside, as if thinking it over. */
const LOOK_UP = [-0.36, -0.5];
/** Down at what you are typing. */
const LOOK_DOWN = [0.1, 0.6];
const LOOKS = {
  idle: LOOK_AT_YOU,
  listening: LOOK_DOWN,
  thinking: LOOK_UP,
  done: LOOK_AT_YOU,
  finished: LOOK_AT_YOU,
};
/** Seconds between blinks, before each one's jitter. */
const BLINK_EVERY = 4.2;
/** Seconds the canvas draws past the footprint on every side, as a share of the size. */
const SPILL = 0.5;
/** Backing pixels per CSS pixel, at most: sharp on a 3× phone without a huge canvas. */
const MAX_DPR = 3;
const still = (v) => ({ from: v, keys: [] });
/** The motion at rest in `state`, as it is on the first frame. */
function settled(state) {
  const look = LOOKS[state];
  return {
    listen: still(state === "listening" ? 1 : 0),
    think: still(state === "thinking" ? 1 : 0),
    done: still(0),
    smile: still(state === "done" ? 1 : 0),
    ax: still(look[0]),
    ay: still(look[1]),
    doneAt: -1,
    noticedAt: -1,
    finishedAt: state === "finished" ? 0 : -1,
    nods: [],
    keys: [],
  };
}
/** The track restarted from its value at `now`, heading for the new key. */
const retarget = (tr, now, key) => ({
  from: track(tr, now),
  keys: [key],
});
/** Moves every track toward `state` from time `now`, with the springs and eases the film uses. */
function enter(m, state, now) {
  const look = LOOKS[state];
  const gaze = state === "thinking" ? [6.5, 0.85] : state === "listening" ? [15, 0.6] : [12, 0.8];
  const next = {
    ...m,
    listen: retarget(
      m.listen,
      now,
      state === "listening"
        ? { at: now, to: 1, spring: [14, 0.5] }
        : { at: now, to: 0, ease: 0.45 },
    ),
    think: retarget(m.think, now, {
      at: now,
      to: state === "thinking" ? 1 : 0,
      ease: state === "thinking" ? 0.4 : 0.45,
    }),
    smile: retarget(m.smile, now, {
      at: now + (state === "done" ? 0.08 : 0),
      to: state === "done" ? 1 : 0,
      ease: state === "done" ? 0.4 : 0.8,
    }),
    ax: retarget(m.ax, now, { at: now, to: look[0], spring: gaze }),
    ay: retarget(m.ay, now, { at: now, to: look[1], spring: gaze }),
    done: retarget(m.done, now, { at: now, to: 0, ease: 0.45 }),
  };
  if (state === "listening") next.noticedAt = now;
  if (state === "done") {
    // It lands: a glow that springs up and settles away, a ping, a flash of the grilles and a nod.
    next.done = {
      from: track(m.done, now),
      keys: [
        { at: now, to: 1, spring: [11, 0.42] },
        { at: now + 1.4, to: 0, ease: 1.2 },
      ],
    };
    next.doneAt = now;
    next.nods = [now + 0.1];
  }
  return next;
}
/** The pose at `t` seconds on the orb's clock. `seed` keeps two orbs from blinking and glancing in step. */
function poseAt(m, t, seed, reduced) {
  const listen = track(m.listen, t);
  const think = clamp(track(m.think, t));
  // Left alone it glances about now and then; while it listens or works it keeps its eyes on that.
  const calm = reduced ? 0 : (1 - clamp(listen)) * (1 - think);
  const glance = restLook(t, 3.6, seed);
  let blink = 0;
  if (!reduced) {
    const k = Math.floor(t / BLINK_EVERY);
    for (const n of [k - 1, k]) {
      const at = n * BLINK_EVERY + 1.3 + mulberry32(seed + n)() * 1.6;
      blink = Math.max(blink, blinkCurve(t - at));
    }
  }
  let key = 0;
  for (const at of m.keys) {
    const tau = t - at;
    if (tau >= 0 && tau < 0.5) key += Math.exp(-tau / 0.075);
  }
  return {
    ta: t,
    listen,
    think,
    done: Math.max(0, track(m.done, t)),
    smile: clamp(track(m.smile, t)),
    tilt: 0.5 * glance[2] * calm,
    ax: track(m.ax, t) + 0.6 * glance[0] * calm,
    ay: track(m.ay, t) + 0.6 * glance[1] * calm,
    blink,
    nod: m.nods.reduce((n, at) => n + nodCurve(t - at), 0),
    key: Math.min(1, key),
    doneAge: m.doneAt < 0 ? -1 : t - m.doneAt,
    noticeAge: m.noticedAt < 0 ? -1 : t - m.noticedAt,
    // Still, a finish is its check without the burst.
    finishAge: m.finishedAt < 0 ? -1 : reduced ? FINISH_HELD : t - m.finishedAt,
    breath: Math.sin((Math.PI * 2 * t) / 5.5),
  };
}

export { drawMicOrb, enter, MAX_DPR, poseAt, SPILL, settled };
