import assert from "node:assert/strict";
import test from "node:test";
import { colors, contrastRatio } from "../src/design-tokens.ts";

test("body text and secondary text meet 4.5:1 on every shared dark surface", () => {
  const surfaces = [
    colors.canvas,
    colors.card,
    colors.raised,
    colors.selected,
    colors.accent,
    colors.sky,
    colors.green,
    colors.lavender,
    colors.orange,
    colors.errorSurface,
    colors.disabled,
  ];
  for (const background of surfaces) {
    assert.ok(contrastRatio(colors.text, background) >= 4.5, `body text fails on ${background}`);
    assert.ok(
      contrastRatio(colors.muted, background) >= 4.5,
      `secondary text fails on ${background}`,
    );
  }
});

test("interactive accent and error text remain readable on their surfaces", () => {
  for (const background of [colors.canvas, colors.card, colors.accent, colors.sky]) {
    assert.ok(contrastRatio(colors.accentDark, background) >= 4.5);
  }
  assert.ok(contrastRatio(colors.danger, colors.errorSurface) >= 4.5);
  assert.ok(contrastRatio(colors.warning, colors.canvas) >= 4.5);
  assert.ok(contrastRatio(colors.focus, colors.card) >= 3);
  assert.ok(contrastRatio(colors.control, colors.card) >= 3);
});
