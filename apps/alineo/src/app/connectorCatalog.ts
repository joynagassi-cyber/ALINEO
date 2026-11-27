export type ConnectorId = 'gmail' | 'google-calendar' | 'google-workspace' | 'ticktick';

export interface ConnectorCatalogEntry {
  id: ConnectorId;
  name: string;
  shortMark: string;
  description: string;
  decisionNeeded: string;
}

export const connectorCatalog: readonly ConnectorCatalogEntry[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    shortMark: 'G',
    description: 'Courrier et actions assistées, selon les permissions qui seront approuvées.',
    decisionNeeded: 'Opérations, scopes OAuth et règles d’approbation à définir.',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    shortMark: '▦',
    description: 'Événements consultables depuis leur service d’origine.',
    decisionNeeded: 'Lecture ou écriture, scopes et événements privés à préciser.',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    shortMark: 'W',
    description: 'Services à choisir séparément ; aucune autorisation globale implicite.',
    decisionNeeded: 'Drive, Docs, Sheets et Slides restent à sélectionner individuellement.',
  },
  {
    id: 'ticktick',
    name: 'TickTick',
    shortMark: '✓',
    description: 'Connexion conditionnée à la vérification de l’API et du compte visé.',
    decisionNeeded: 'API, permissions, quotas et conditions du plan gratuit à vérifier.',
  },
];
