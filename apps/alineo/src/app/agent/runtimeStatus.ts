import {
  AGENT_RUNTIME_STATUS_ENDPOINT,
  isAgentRuntimeStatus,
} from '../../../shared/agentRuntimeStatus';
import type { AgentRuntimeStatus } from '../../../shared/agentRuntimeStatus';

export {
  AGENT_RUNTIME_STATUS_ENDPOINT,
  INITIAL_AGENT_RUNTIME_STATUS,
  agentRuntimeStatusLabel,
} from '../../../shared/agentRuntimeStatus';
export type { AgentRuntimeState, AgentRuntimeStatus } from '../../../shared/agentRuntimeStatus';

export async function fetchAgentRuntimeStatus(): Promise<AgentRuntimeStatus> {
  try {
    const response = await fetch(AGENT_RUNTIME_STATUS_ENDPOINT, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Runtime status returned HTTP ${response.status}.`);

    const payload: unknown = await response.json();
    if (!isAgentRuntimeStatus(payload)) throw new Error('Runtime status response is invalid.');
    return payload;
  } catch {
    return {
      state: 'unavailable',
      canSendMessages: false,
      message: 'Serveur agent inaccessible. Aucun message ne sera transmis.',
    };
  }
}
