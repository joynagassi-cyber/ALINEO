import { useState } from 'react';
import '@copilotkit/react-core/v2/styles.css';
import { CopilotChat, CopilotKitProvider } from '@copilotkit/react-core/v2';
import { basicCatalog } from '@copilotkit/a2ui-renderer';
import { OpenDuetOrb } from './OpenDuetOrb';
import type { ThemePaletteId } from '../theme';

interface CopilotChatPanelProps {
  paletteId: ThemePaletteId;
  dark: boolean;
}

const frenchChatLabels = {
  chatInputPlaceholder: 'Écrivez votre message…',
  chatInputToolbarStartTranscribeButtonLabel: 'Dicter un message',
  chatInputToolbarCancelTranscribeButtonLabel: 'Annuler la dictée',
  chatInputToolbarFinishTranscribeButtonLabel: 'Terminer la dictée',
  chatInputToolbarAddButtonLabel: 'Ajouter une pièce jointe',
  chatInputToolbarToolsButtonLabel: 'Outils',
  chatInputToolbarSendButtonLabel: 'Envoyer le message',
  chatInputToolbarStopButtonLabel: 'Arrêter la réponse',
  assistantMessageToolbarCopyCodeLabel: 'Copier le code',
  assistantMessageToolbarCopyCodeCopiedLabel: 'Code copié',
  assistantMessageToolbarCopyMessageLabel: 'Copier la réponse',
  assistantMessageToolbarInspectorLabel: 'Voir dans l’inspecteur',
  assistantMessageToolbarInspectorDescription: 'Ouvrir ce message dans l’inspecteur',
  assistantMessageToolbarInspectorLocalOnlyLabel: 'Local uniquement',
  assistantMessageToolbarInspectorLocalOnlyDescription: 'Visible uniquement en développement local.',
  assistantMessageToolbarInspectorTitle: 'Inspecteur CopilotKit',
  assistantMessageToolbarInspectorHideLabel: 'Masquer cette icône',
  assistantMessageToolbarInspectorHideDescription: 'Jusqu’au prochain rechargement',
  assistantMessageToolbarThumbsUpLabel: 'Bonne réponse',
  assistantMessageToolbarThumbsDownLabel: 'Mauvaise réponse',
  assistantMessageFeedbackCommentPlaceholder: 'Ajouter un commentaire (facultatif)',
  assistantMessageFeedbackCommentSubmitLabel: 'Envoyer le commentaire',
  assistantMessageToolbarReadAloudLabel: 'Lire à voix haute',
  assistantMessageToolbarRegenerateLabel: 'Régénérer la réponse',
  userMessageToolbarCopyMessageLabel: 'Copier le message',
  userMessageToolbarEditMessageLabel: 'Modifier le message',
  userMessageToolbarPreviousBranchLabel: 'Réponse précédente',
  userMessageToolbarNextBranchLabel: 'Réponse suivante',
  chatDisclaimerText: 'L’IA peut se tromper. Vérifiez les informations importantes.',
  chatToggleOpenLabel: 'Ouvrir le chat',
  chatToggleCloseLabel: 'Fermer le chat',
  chatScrollToBottomLabel: 'Aller au dernier message',
  chatConnectingLabel: 'Chargement de la conversation',
  modalHeaderTitle: 'Chat ALINEO',
  welcomeMessageText: 'Comment puis-je vous aider aujourd’hui ?',
  reasoningMessageThinkingLabel: 'Réflexion en cours…',
  chatInputSlashMenuLabel: 'Commandes',
  chatInputSlashMenuEmptyText: 'Aucune commande trouvée',
  attachmentRemoveButtonLabel: 'Supprimer la pièce jointe',
  attachmentPlayVideoButtonLabel: 'Lire la vidéo',
  attachmentPreviewCloseLabel: 'Fermer l’aperçu',
  attachmentPreviewCloseButtonLabel: 'Fermer l’aperçu',
  modalHeaderCloseButtonLabel: 'Fermer',
  modalHeaderThreadsButtonLabel: 'Ouvrir les conversations',
  sidebarLabel: 'Chat ALINEO',
};

export function CopilotChatPanel({ paletteId, dark }: CopilotChatPanelProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`live-chat-home alineo-copilot-scope${dark ? ' dark' : ''}`}>
      <header className="live-chat-heading">
        <OpenDuetOrb paletteId={paletteId} dark={dark} size={68} />
        <div className="live-chat-heading-copy">
          <p className="greeting">Bonjour</p>
          <h1>Comment puis-je vous aider&nbsp;?</h1>
        </div>
        <span className="a2ui-indicator" title="Rendu A2UI activé">A2UI actif</span>
      </header>

      <div className="copilot-chat-stage">
        <CopilotKitProvider
          runtimeUrl="/api/copilotkit"
          a2ui={{ catalog: basicCatalog }}
          enableInspector={false}
        >
          <CopilotChat
            className="alineo-copilot-chat"
            labels={frenchChatLabels}
            onError={() => setError(true)}
          />
        </CopilotKitProvider>
      </div>

      {error && (
        <p className="copilot-chat-error" role="alert">
          La réponse n’a pas abouti. Vérifiez la configuration et les quotas du fournisseur côté serveur.
        </p>
      )}
    </div>
  );
}
