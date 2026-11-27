import {
  AGENT_RUNTIME_STATUS_MESSAGES,
  type AgentRuntimeState,
  type AgentRuntimeStatus,
} from '../shared/agentRuntimeStatus.js';

export interface RuntimeEnvironment {
  COPILOT_MODEL?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  MINIMAX_API_KEY?: string;
}

export interface ResolvedRuntimeConfiguration {
  status: AgentRuntimeStatus;
  model?: string;
  apiKey?: string;
}

const providerKeys: Record<string, keyof RuntimeEnvironment> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_API_KEY',
  gemini: 'GOOGLE_API_KEY',
  'google-gemini': 'GOOGLE_API_KEY',
  minimax: 'MINIMAX_API_KEY',
};

function statusFor(state: AgentRuntimeState, canSendMessages = false): AgentRuntimeStatus {
  if (state === 'checking' || state === 'unavailable') {
    return {
      state,
      canSendMessages: false,
      message: state === 'checking'
        ? 'Vérification du serveur agent… aucun message n’est transmis pour le moment.'
        : 'Serveur agent inaccessible. Aucun message ne sera transmis.',
    };
  }

  return {
    state,
    canSendMessages: state === 'ready' && canSendMessages,
    message: AGENT_RUNTIME_STATUS_MESSAGES[state],
  };
}

export function resolveRuntimeConfiguration(
  environment: RuntimeEnvironment,
): ResolvedRuntimeConfiguration {
  const model = environment.COPILOT_MODEL?.trim();
  if (!model) {
    return { status: statusFor('not-configured') };
  }

  const separatorIndex = model.search(/[/:]/);
  if (separatorIndex <= 0 || separatorIndex === model.length - 1) {
    return { status: statusFor('invalid-model') };
  }

  const provider = model.slice(0, separatorIndex).trim().toLowerCase();
  const modelId = model.slice(separatorIndex + 1).trim();
  const keyName = providerKeys[provider];
  if (!keyName || !modelId) {
    return { status: statusFor('invalid-model') };
  }

  const apiKey = environment[keyName]?.trim();
  if (!apiKey) {
    return { status: statusFor('missing-credentials') };
  }

  return {
    status: statusFor('ready', true),
    model,
    apiKey,
  };
}

export function resolveAllowedOrigins(environmentValue: string | undefined): string[] {
  if (!environmentValue?.trim()) return [];

  return [...new Set(environmentValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean))];
}

export function resolveRuntimePort(value: string | undefined): number {
  if (!value?.trim()) return 8200;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('COPILOT_RUNTIME_PORT must be an integer between 1 and 65535.');
  }
  return port;
}

/**
 * The runtime has no production authentication provider yet. Refuse network binds
 * until an ALINEO-owned identity and tenant boundary is wired into the server.
 * Return the exact IPv4 address used by Vite's server-side proxy.
 */
export function resolveRuntimeHost(value: string | undefined): '127.0.0.1' {
  const host = value?.trim().toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') return '127.0.0.1';
  throw new Error(
    'COPILOT_RUNTIME_HOST must be 127.0.0.1 until ALINEO server authentication is configured.',
  );
}
