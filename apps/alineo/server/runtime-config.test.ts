import { describe, expect, it } from 'vitest';
import {
  resolveAllowedOrigins,
  resolveRuntimeConfiguration,
  resolveRuntimeHost,
  resolveRuntimePort,
} from './runtime-config.js';

describe('CopilotKit server configuration', () => {
  it('keeps the agent disabled until both a model and its server-side key are present', () => {
    expect(resolveRuntimeConfiguration({}).status).toMatchObject({
      state: 'not-configured',
      canSendMessages: false,
    });
    expect(resolveRuntimeConfiguration({ OPENAI_API_KEY: 'server-secret' }).status.state).toBe('not-configured');
    expect(resolveRuntimeConfiguration({ COPILOT_MODEL: 'openai/gpt-4o-mini' }).status.state).toBe('missing-credentials');
  });

  it('enables only a supported provider with the matching non-empty credential', () => {
    const resolved = resolveRuntimeConfiguration({
      COPILOT_MODEL: '  openai/gpt-4o-mini  ',
      OPENAI_API_KEY: '  server-secret  ',
      GOOGLE_API_KEY: 'unused-secret',
    });

    expect(resolved.status).toMatchObject({ state: 'ready', canSendMessages: true });
    expect(resolved.model).toBe('openai/gpt-4o-mini');
    expect(resolved.apiKey).toBe('server-secret');
    expect(JSON.stringify(resolved.status)).not.toContain('server-secret');
  });

  it('supports Google Gemini aliases and MiniMax with their own environment keys', () => {
    expect(resolveRuntimeConfiguration({
      COPILOT_MODEL: 'google/gemini-2.5-flash',
      GOOGLE_API_KEY: 'google-secret',
    }).status.canSendMessages).toBe(true);
    expect(resolveRuntimeConfiguration({
      COPILOT_MODEL: 'minimax/MiniMax-M2.7',
      MINIMAX_API_KEY: 'minimax-secret',
    }).status.canSendMessages).toBe(true);
  });

  it('rejects malformed model identifiers and unsupported providers', () => {
    for (const model of ['openai', '/gpt-4o-mini', 'openai/', 'unknown/model']) {
      expect(resolveRuntimeConfiguration({
        COPILOT_MODEL: model,
        OPENAI_API_KEY: 'server-secret',
      }).status).toMatchObject({ state: 'invalid-model', canSendMessages: false });
    }
  });

  it('normalizes CORS origins, validates the port, and refuses non-loopback runtime binds', () => {
    expect(resolveAllowedOrigins(' https://alineo.example,https://preview.example, https://alineo.example ')).toEqual([
      'https://alineo.example',
      'https://preview.example',
    ]);
    expect(resolveAllowedOrigins('')).toEqual([]);
    expect(resolveRuntimePort(undefined)).toBe(8200);
    expect(resolveRuntimePort('8201')).toBe(8201);
    expect(() => resolveRuntimePort('not-a-port')).toThrow(/COPILOT_RUNTIME_PORT/);
    expect(resolveRuntimeHost(undefined)).toBe('127.0.0.1');
    expect(resolveRuntimeHost('localhost')).toBe('127.0.0.1');
    expect(() => resolveRuntimeHost('0.0.0.0')).toThrow(/127\.0\.0\.1/);
  });
});
