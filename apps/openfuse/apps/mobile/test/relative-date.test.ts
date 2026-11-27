import assert from "node:assert/strict";
import test from "node:test";
import { relativeDate } from "../src/relative-date.ts";

const now = Date.parse("2026-09-30T12:00:00Z");

test("recent past timestamps keep their buckets", () => {
  assert.equal(relativeDate("2026-09-30T11:59:30Z", now), "À l’instant");
  assert.equal(relativeDate("2026-09-30T11:30:00Z", now), "il y a 30 min");
  assert.equal(relativeDate("2026-09-30T09:00:00Z", now), "il y a 3 h");
});

test("future timestamps beyond clock skew show a date instead of just now", () => {
  assert.equal(relativeDate("2026-09-30T12:00:10Z", now), "À l’instant");
  const expected = new Date(Date.parse("2026-10-05T12:00:00Z")).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  assert.equal(relativeDate("2026-10-05T12:00:00Z", now), expected);
});

test("an unparseable timestamp is returned unchanged", () => {
  assert.equal(relativeDate("not-a-date", now), "not-a-date");
});
