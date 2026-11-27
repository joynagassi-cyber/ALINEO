export type AgentRuntimeState =
  | 'checking'
  | 'ready'
  | 'auth-required'
  | 'not-configured'
  | 'missing-credentials'
  | 'invalid-model'
  | 'unavailable';

export interface AgentRuntimeStatus {
  state: AgentRuntimeState;
  canSendMessages: boolean;
  message: string;
}

export const INITIAL_AGENT_RUNTIME_STATUS: AgentRuntimeStatus = {
  state: 'checking',
  canSendMessages: false,
  message: 'Vérification du serveur agent… aucun message n’est transmis pour le moment.',
};

export const AGENT_RUNTIME_STATUS_MESSAGES: Record<Exclude<AgentRuntimeState, 'checking' | 'unavailable'>, string> = {
  ready: 'Le runtime, le modèle et l’identité serveur sont configurés. La disponibilité des réponses dépend du fournisseur et de ses quotas.',
  'auth-required': 'Une identité utilisateur validée côté serveur est nécessaire avant d’activer le chat. Aucun message ne sera transmis.',
  'not-configured': 'Le serveur agent et le fournisseur de modèle ne sont pas configurés. Aucun message ne sera transmis.',
  'missing-credentials': 'Le modèle est indiqué, mais la clé serveur de son fournisseur manque. Aucun message ne sera transmis.',
  'invalid-model': 'COPILOT_MODEL est invalide ou le fournisseur n’est pas pris en charge. Aucun message ne sera transmis.',
};

export const AGENT_RUNTIME_STATUS_ENDPOINT = '/api/copilotkit/status';

const validStates: ReadonlySet<string> = new Set([
  'ready',
  'auth-required',
  'not-configured',
  'missing-credentials',
  'invalid-model',
]);

export function isAgentRuntimeStatus(value: unknown): value is AgentRuntimeStatus {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.state === 'string' &&
    validStates.has(candidate.state) &&
    typeof candidate.canSendMessages === 'boolean' &&
    typeof candidate.message === 'string'
  );
}

export function agentRuntimeStatusLabel(state: AgentRuntimeState) {
  switch (state) {
    case 'checking': return 'Vérification';
    case 'ready': return 'Agent configuré';
    case 'auth-required': return 'Authentification requise';
    case 'not-configured': return 'Non configuré';
    case 'missing-credentials': return 'Clé manquante';
    case 'invalid-model': return 'Modèle invalide';
    case 'unavailable': return 'Serveur hors ligne';
  }
}
