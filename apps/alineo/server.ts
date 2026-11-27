import 'dotenv/config';
import { serve } from '@hono/node-server';
import { BuiltInAgent, CopilotRuntime, InMemoryAgentRunner } from '@copilotkit/runtime/v2';
import { createCopilotHonoHandler } from '@copilotkit/runtime/v2/hono';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AGENT_RUNTIME_STATUS_MESSAGES } from './shared/agentRuntimeStatus.js';
import {
  resolveAllowedOrigins,
  resolveRuntimeConfiguration,
  resolveRuntimeHost,
  resolveRuntimePort,
} from './server/runtime-config.js';
import type { RuntimeEnvironment } from './server/runtime-config.js';

const COPILOTKIT_BASE_PATH = '/api/copilotkit';

export interface AuthenticatedRuntimeUser {
  readonly id: string;
  readonly name: string;
}

/**
 * A server-owned authentication adapter. It must validate a real ALINEO session
 * or token; never derive this identity from a caller-supplied user-id header.
 */
export type AuthenticateRuntimeRequest = (
  request: Request,
) => AuthenticatedRuntimeUser | null | Promise<AuthenticatedRuntimeUser | null>;

export interface RuntimeAppOptions {
  authenticateRequest?: AuthenticateRuntimeRequest;
}

const ALINEO_AGENT_PROMPT = `Tu es l’assistant d’ALINEO. Réponds dans la langue de la personne, avec clarté et sans inventer de faits, de données personnelles, de connexions ou d’actions effectuées. Tu n’as accès à aucun compte ni connecteur tant qu’une intégration n’est pas explicitement activée côté serveur. Signale les limites et demande confirmation avant toute action importante.

Quand une interface interactive aiderait réellement la personne à comprendre ou comparer des informations présentes dans la conversation, utilise l’outil A2UI disponible. N’utilise que les données fournies; pour une demande qui appelle une réponse textuelle simple, réponds en texte.`;

export function createRuntimeApp(
  environment: RuntimeEnvironment & { COPILOT_ALLOWED_ORIGINS?: string },
  options: RuntimeAppOptions = {},
) {
  const configuration = resolveRuntimeConfiguration(environment);
  const authenticateRequest = options.authenticateRequest;
  const hasAuthenticationAdapter = typeof authenticateRequest === 'function';
  const authenticationRequired = configuration.status.canSendMessages && !hasAuthenticationAdapter;
  const authenticationStatus = {
    state: 'auth-required' as const,
    canSendMessages: false,
    message: AGENT_RUNTIME_STATUS_MESSAGES['auth-required'],
  };
  const status = authenticationRequired ? authenticationStatus : configuration.status;
  const app = new Hono();
  const identities = new WeakMap<Request, Promise<AuthenticatedRuntimeUser | null>>();

  async function authenticatedUser(request: Request): Promise<AuthenticatedRuntimeUser | null> {
    if (!authenticateRequest) return null;
    const cached = identities.get(request);
    if (cached) return cached;

    const resolution = (async () => {
      try {
        const identity: unknown = await authenticateRequest(request);
        if (typeof identity !== 'object' || identity === null) return null;
        const candidate = identity as Record<string, unknown>;
        if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') return null;
        const id = candidate.id.trim();
        const name = candidate.name.trim();
        if (!id || id.includes('\0') || !name) return null;
        return { id, name };
      } catch {
        // Authentication failures stay generic and fail closed; do not leak provider details.
        return null;
      }
    })();
    identities.set(request, resolution);
    return resolution;
  }

  app.get(`${COPILOTKIT_BASE_PATH}/status`, async (context) => {
    context.header('Cache-Control', 'no-store');
    if (configuration.status.canSendMessages && hasAuthenticationAdapter) {
      const user = await authenticatedUser(context.req.raw);
      if (!user) return context.json(authenticationStatus);
    }
    return context.json(status);
  });
  app.get('/healthz', (context) => context.json({ status: 'ok' }));

  if (
    configuration.status.canSendMessages &&
    configuration.model &&
    configuration.apiKey &&
    authenticateRequest
  ) {
    // Keep usage telemetry local by default; an explicit environment opt-in is required.
    process.env.COPILOTKIT_TELEMETRY_DISABLED ??= 'true';
    const runtime = new CopilotRuntime({
      agents: {
        default: new BuiltInAgent({
          name: 'ALINEO',
          model: configuration.model,
          apiKey: configuration.apiKey,
          prompt: ALINEO_AGENT_PROMPT,
        }),
      },
      runner: new InMemoryAgentRunner(),
      identifyUser: async (request) => {
        const user = await authenticatedUser(request);
        if (!user) throw new Error('An authenticated ALINEO user is required.');
        return user;
      },
      // The client catalog enables the matching renderer and requests the A2UI tool.
      a2ui: { enabled: true },
    });

    const copilotRoutes = createCopilotHonoHandler({
      runtime,
      basePath: COPILOTKIT_BASE_PATH,
      // The development app uses a same-origin Vite proxy. Cross-origin access is
      // denied by default; deployments may explicitly allow trusted app origins.
      cors: { origin: resolveAllowedOrigins(environment.COPILOT_ALLOWED_ORIGINS) },
    });

    const requireAuthenticatedUser = async (context: Context, next: () => Promise<void>) => {
      if (context.req.method === 'OPTIONS') return next();
      if (context.req.path === `${COPILOTKIT_BASE_PATH}/status`) return next();
      if (await authenticatedUser(context.req.raw)) return next();
      context.header('Cache-Control', 'no-store');
      return context.json({ error: 'authentication_required' }, 401);
    };
    app.use(COPILOTKIT_BASE_PATH, requireAuthenticatedUser);
    app.use(`${COPILOTKIT_BASE_PATH}/*`, requireAuthenticatedUser);
    app.route('/', copilotRoutes);
  } else {
    const error = authenticationRequired
      ? 'runtime_authentication_required'
      : 'agent_not_configured';
    const unavailable = (context: Context) => context.json(
      { error, message: status.message },
      503,
    );
    app.all(COPILOTKIT_BASE_PATH, unavailable);
    app.all(`${COPILOTKIT_BASE_PATH}/*`, unavailable);
  }

  return app;
}

function isDirectExecution() {
  const entryPoint = process.argv[1];
  return Boolean(entryPoint) && import.meta.url === pathToFileURL(resolve(entryPoint!)).href;
}

if (isDirectExecution()) {
  const app = createRuntimeApp(process.env);
  const port = resolveRuntimePort(process.env.COPILOT_RUNTIME_PORT);
  const hostname = resolveRuntimeHost(process.env.COPILOT_RUNTIME_HOST);

  serve({ fetch: app.fetch, port, hostname }, () => {
    const state = resolveRuntimeConfiguration(process.env).status.state;
    console.info(`ALINEO CopilotKit runtime listening on ${hostname}:${port} (${state}).`);
  });
}
