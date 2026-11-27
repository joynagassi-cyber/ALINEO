import { PlugZap, Sparkles } from 'lucide-react';
import type { PageId } from '../navigation';

interface InsightsPageProps {
  onNavigate: (page: PageId) => void;
}

export function InsightsPage({ onNavigate }: InsightsPageProps) {
  return (
    <div className="secondary-page">
      <header className="page-heading">
        <p className="eyebrow">AIDE À LA DÉCISION</p>
        <h1>Des insights seulement quand les données le permettent.</h1>
        <p>Chaque calcul devra expliquer sa source, sa période et ses limites.</p>
      </header>
      <section className="empty-panel" aria-labelledby="insight-empty-title">
        <span className="empty-visual"><Sparkles aria-hidden="true" /></span>
        <p className="eyebrow">AUCUNE TENDANCE CALCULÉE</p>
        <h2 id="insight-empty-title">Il manque des données réelles.</h2>
        <p>Aucun score, objectif ou comparaison personnelle n’est prérempli. Une suggestion ne sera pas présentée comme un fait observé.</p>
        <div className="data-provenance">
          <div><span>Sources</span><strong>Aucune connexion</strong></div>
          <div><span>Définition</span><strong>À confirmer</strong></div>
        </div>
        <button className="text-link" type="button" onClick={() => onNavigate('connectors')}>
          <PlugZap aria-hidden="true" />
          <span>Voir les connecteurs</span>
        </button>
      </section>
    </div>
  );
}
