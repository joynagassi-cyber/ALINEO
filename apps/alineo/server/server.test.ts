import { describe, expect, it } from 'vitest';
import { createRuntimeApp } from '../server.js';

describe('CopilotKit runtime HTTP surface', () => {
  it('reports the real unconfigured state without returning a false-positive ready flag', async () => {
    const app = createRuntimeApp({});
    const response = await app.request('/api/copilotkit/status');

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(await response.json()).toMatchObject({ state: 'not-configured', canSendMessages: false });
  });

  it('does not accept CopilotKit runs until the backend model is configured', async () => {
    const app = createRuntimeApp({});
    const response = await app.request('/api/copilotkit/agent/default/run', { method: 'POST' });

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: 'agent_not_configured' });
  });

  it('keeps the runtime disabled when model credentials exist but no server identity adapter is installed', async () => {
    const app = createRuntimeApp({
      COPILOT_MODEL: 'openai/gpt-4o-mini',
      OPENAI_API_KEY: 'test-placeholder-not-a-real-key',
    });

    const status = await app.request('/api/copilotkit/status');
    const info = await app.request('/api/copilotkit/info');
    const run = await app.request('/api/copilotkit/agent/default/run', { method: 'POST' });

    expect(await status.json()).toMatchObject({ state: 'auth-required', canSendMessages: false });
    expect(info.status).toBe(503);
    expect(await info.json()).toMatchObject({ error: 'runtime_authentication_required' });
    expect(run.status).toBe(503);
    expect(await run.json()).toMatchObject({ error: 'runtime_authentication_required' });
  });

  it('protects every CopilotKit route with a server-validated identity and passes it to thread ownership', async () => {
    const app = createRuntimeApp({
      COPILOT_MODEL: 'openai/gpt-4o-mini',
      OPENAI_API_KEY: 'test-placeholder-not-a-real-key',
    }, {
      authenticateRequest: (request) => request.headers.get('authorization') === 'Bearer test-session'
        ? { id: 'verified-test-user', name: 'Test User' }
        : null,
    });

    const anonymousStatus = await app.request('/api/copilotkit/status');
    const anonymousInfo = await app.request('/api/copilotkit/info', {
      headers: { 'x-user-id': 'attacker-chosen-id' },
    });
    const authenticatedStatus = await app.request('/api/copilotkit/status', {
      headers: { authorization: 'Bearer test-session' },
    });
    const authenticatedInfo = await app.request('/api/copilotkit/info', {
      headers: { authorization: 'Bearer test-session' },
    });
    const authenticatedThreads = await app.request('/api/copilotkit/threads', {
      headers: { authorization: 'Bearer test-session' },
    });

    expect(await anonymousStatus.json()).toMatchObject({ state: 'auth-required', canSendMessages: false });
    expect(anonymousInfo.status).toBe(401);
    expect(await anonymousInfo.json()).toMatchObject({ error: 'authentication_required' });
    expect(await authenticatedStatus.json()).toMatchObject({ state: 'ready', canSendMessages: true });
    expect(authenticatedInfo.status).toBe(200);
    expect(await authenticatedInfo.json()).toMatchObject({ a2uiEnabled: true });
    expect(authenticatedThreads.status).toBe(200);
  });
});
