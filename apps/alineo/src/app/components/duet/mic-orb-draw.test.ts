import { describe, expect, it, vi } from 'vitest';
import { blinkCurve, drawMicOrb, restLook, type OrbPose } from './mic-orb-draw';
import { themePalettes } from '../../theme';

const restPose: OrbPose = {
  ta: 0,
  listen: 0,
  think: 0,
  done: 0,
  smile: 0,
  tilt: 0,
  ax: 0,
  ay: 0,
  blink: 0,
  nod: 0,
  key: 0,
  doneAge: -1,
  noticeAge: -1,
  finishAge: -1,
  breath: 0,
};

describe('MicOrb idle eye motion', () => {
  it('shifts its gaze on a deterministic idle glance', () => {
    expect(restLook(0.5, 3.6, 1)).not.toEqual(restLook(4.1, 3.6, 1));
  });

  it('closes and reopens the eyes during a blink', () => {
    expect(blinkCurve(0.03)).toBeGreaterThan(0);
    expect(blinkCurve(0.12)).toBeGreaterThan(0);
    expect(blinkCurve(0.3)).toBe(0);
  });

  it('renders the orb with each of the 18 selectable palettes', () => {
    const gradient = { addColorStop: vi.fn() };
    const noop = () => undefined;
    const context = new Proxy(
      {
        createLinearGradient: () => gradient,
        createRadialGradient: () => gradient,
      },
      {
        get(target, property, receiver) {
          return Reflect.has(target, property)
            ? Reflect.get(target, property, receiver)
            : noop;
        },
        set() {
          return true;
        },
      },
    ) as unknown as CanvasRenderingContext2D;

    for (const palette of themePalettes) {
      expect(() => drawMicOrb(context, 126, restPose, { dark: true, colour: palette.id })).not.toThrow();
    }
  });

  it('draws two eye-light paths on the sphere', () => {
    const bezierCurveTo = vi.fn();
    const gradient = { addColorStop: vi.fn() };
    const noop = () => undefined;
    const context = new Proxy(
      {
        bezierCurveTo,
        createLinearGradient: () => gradient,
        createRadialGradient: () => gradient,
      },
      {
        get(target, property, receiver) {
          return Reflect.has(target, property)
            ? Reflect.get(target, property, receiver)
            : noop;
        },
        set() {
          return true;
        },
      },
    ) as unknown as CanvasRenderingContext2D;

    drawMicOrb(context, 126, restPose, { dark: true, colour: 'alineo' });

    // Each eye is a closed two-curve path in the canvas renderer.
    expect(bezierCurveTo).toHaveBeenCalledTimes(4);
  });
});
