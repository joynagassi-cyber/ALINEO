import assert from "node:assert/strict";
import test from "node:test";
import { resolveApiBase } from "../src/api-url.ts";

test("web uses the same origin and rejects loopback API overrides", () => {
  assert.equal(resolveApiBase("web"), "");
  for (const value of [
    "http://localhost:8787",
    "http://preview.localhost:8787",
    "http://127.0.0.1:8787",
    "http://0.0.0.0:8787",
    "http://[::1]:8787",
  ])
    assert.equal(resolveApiBase("web", value), "", value);
  assert.equal(
    resolveApiBase("web", "https://api.alineo.example/v1/"),
    "https://api.alineo.example/v1/",
  );
  assert.equal(resolveApiBase("web", "not a URL"), "");
});

test("native simulator defaults and explicit API overrides are preserved", () => {
  assert.equal(resolveApiBase("android"), "http://10.0.2.2:8787");
  assert.equal(resolveApiBase("ios"), "http://localhost:8787");
  assert.equal(
    resolveApiBase("android", "https://api.alineo.example"),
    "https://api.alineo.example",
  );
});
