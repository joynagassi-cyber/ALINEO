import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApp } from "../apps/server/src/app.ts";
import type { Config } from "../apps/server/src/config.ts";
import { createStore } from "../apps/server/src/db.ts";

test("local sample mode opens without Intelligence credentials or remote rich threads", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "openfuse-local-sample-"));
  const db = await createStore({ dataDir: join(directory, "database") });
  t.after(async () => {
    await db.close();
    await rm(directory, { recursive: true, force: true });
  });

  const config: Config = {
    mode: "sample",
    port: 8787,
    host: "127.0.0.1",
    publicUrl: "http://127.0.0.1:8787",
    dataDir: directory,
    agentBackend: "sample",
    googleRedirectUri: "http://127.0.0.1:8787/api/google/callback",
    allowedOrigins: [],
    computerEnabled: false,
    webSearchEnabled: false,
  };
  const { app } = await createApp(db, config);
  const signIn = await app.request("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert.equal(signIn.status, 200);
  const { token } = await signIn.json();
  const headers = { Authorization: `Bearer ${token}` };

  const workspace = await app.request("/api/workspace", { headers });
  assert.equal(workspace.status, 200);
  const snapshot = await workspace.json();
  assert.equal(snapshot.mode, "sample");
  assert.equal(snapshot.runtime.provider, "sample");
  assert.equal(snapshot.runtime.richThreads, false);

  const mainThread = await app.request("/api/main-thread", { headers });
  assert.equal(mainThread.status, 503);
  assert.match(await mainThread.text(), /Rich Threads are not configured/);
});
