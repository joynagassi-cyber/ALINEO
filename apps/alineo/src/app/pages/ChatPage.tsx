import { ArrowUp, ChartNoAxesCombined, PlugZap, Sparkles } from 'lucide-react';
import { lazy, Suspense, type FormEvent } from 'react';
import type { PageId } from '../navigation';
import { agentRuntimeStatusLabel } from '../agent/runtimeStatus';
import type { AgentRuntimeStatus } from '../agent/runtimeStatus';
import type { ThemePaletteId } from '../theme';
import { OpenDuetOrb } from '../components/OpenDuetOrb';

const CopilotChatPanel = lazy(() => import('../components/CopilotChatPanel').then((module) => ({
  default: module.CopilotChatPanel,
})));

interface ChatPageProps {
  onNavigate: (page: PageId) => void;
  paletteId: ThemePaletteId;
  dark: boolean;
  runtimeStatus: AgentRuntimeStatus;
}

const shortcuts: Array<{
  page: PageId;
  title: string;
  description: string;
  icon: typeof PlugZap;
}> = [
  {
    page: 'connectors',
    title: 'Voir les connecteurs',
    description: 'Outils ciblés et permissions à définir.',
    icon: PlugZap,
  },
  {
    page: 'progress',
    title: 'Suivre la progression',
    description: 'Des faits réels, avec leur source et leur période.',
    icon: ChartNoAxesCombined,
  },
  {
    page: 'insights',
    title: 'Explorer les insights',
    description: 'Des tendances seulement si les données les permettent.',
    icon: Sparkles,
  },
];

export function ChatPage({ onNavigate, paletteId, dark, runtimeStatus }: ChatPageProps) {
  function preventUnconfiguredSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (runtimeStatus.canSendMessages) {
    return (
      <Suspense fallback={<div className="live-chat-loading" role="status">Chargement du chat CopilotKit…</div>}>
        <CopilotChatPanel paletteId={paletteId} dark={dark} />
      </Suspense>
    );
  }

  const sendButtonLabel = runtimeStatus.state === 'not-configured'
    ? 'Envoyer un message — agent non configuré'
    : `Envoyer un message — ${agentRuntimeStatusLabel(runtimeStatus.state).toLocaleLowerCase('fr-FR')}`;

  return (
    <div className="chat-home">
      <OpenDuetOrb paletteId={paletteId} dark={dark} />
      <p className="greeting">Bonjour</p>
      <h1>Comment puis-je vous aider&nbsp;?</h1>
      <p className="chat-subtitle">
        Vos outils, vos questions et vos décisions réunis dans un même espace — sans remplacer les services que vous utilisez déjà.
      </p>
      <div className="runtime-notice" role="status">
        <span className="status-dot" aria-hidden="true" />
        <span>{runtimeStatus.state === 'not-configured' ? 'Agent non configuré · aucun message transmis' : runtimeStatus.message}</span>
      </div>

      <form className="composer-shell" onSubmit={preventUnconfiguredSend} aria-describedby="composer-status">
        <label className="visually-hidden" htmlFor="chat-draft">Votre message à ALINEO</label>
        <textarea
          id="chat-draft"
          name="message"
          rows={2}
          maxLength={4000}
          placeholder="Écrivez une demande…"
          autoComplete="off"
        />
        <div className="composer-actions">
          <button className="composer-tool" type="button" onClick={() => onNavigate('connectors')}>
            <PlugZap aria-hidden="true" />
            <span>Connecteurs</span>
          </button>
          <button
            className="send-button"
            type="submit"
            disabled={!runtimeStatus.canSendMessages}
            aria-label={sendButtonLabel}
            title={runtimeStatus.message}
          >
            <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </form>
      <p id="composer-status" className="composer-status">
        {runtimeStatus.message} Votre brouillon reste en mémoire de page et n’est pas enregistré.
      </p>

      <div className="shortcut-grid" aria-label="Accès rapide">
        {shortcuts.map(({ page, title, description, icon: Icon }) => (
          <button className="shortcut-card" type="button" key={page} onClick={() => onNavigate(page)}>
            <span className="shortcut-icon"><Icon aria-hidden="true" /></span>
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
      <p className="chat-footnote">Aucun compte, historique ou donnée personnelle n’est connecté à cet écran.</p>
    </div>
  );
}
