import assert from "node:assert/strict";
import test from "node:test";
import { enter, poseAt, settled } from "../src/mic-orb-engine.js";

test("MicOrb starts at rest and animates its listening and thinking poses", () => {
  const idle = poseAt(settled("idle"), 0, 7, false);
  assert.equal(idle.listen, 0);
  assert.equal(idle.think, 0);

  const listening = poseAt(enter(settled("idle"), "listening", 0), 0.2, 7, false);
  assert.ok(listening.listen > 0.5);
  assert.ok(listening.ay > 0.04);

  const thinking = poseAt(enter(settled("idle"), "thinking", 0), 0.2, 7, false);
  assert.ok(thinking.think > 0.4);
  assert.ok(thinking.ay < 0);
});

test("MicOrb's done state animates completion and records the finish timer", () => {
  const done = enter(settled("idle"), "done", 0);
  const arriving = poseAt(done, 0.35, 7, false);
  assert.ok(arriving.done > 0.5);
  assert.equal(arriving.doneAge, 0.35);

  const finished = { ...done, finishedAt: 0 };
  assert.ok(poseAt(finished, 0.3, 7, false).finishAge > 0);
  assert.equal(poseAt(finished, 2, 7, false).finishAge, 2);
});
