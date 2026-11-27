import { ChartNoAxesCombined, PlugZap } from 'lucide-react';
import type { PageId } from '../navigation';

interface ProgressPageProps {
  onNavigate: (page: PageId) => void;
}

export function ProgressPage({ onNavigate }: ProgressPageProps) {
  return (
    <div className="secondary-page">
      <header className="page-heading">
        <p className="eyebrow">FAITS OBSERVABLES</p>
        <h1>Une progression lisible, jamais supposée.</h1>
        <p>Les tendances ne s’afficheront qu’à partir de données réelles, avec leur source et leur période.</p>
      </header>
      <section className="empty-panel" aria-labelledby="progress-empty-title">
        <span className="empty-visual"><ChartNoAxesCombined aria-hidden="true" /></span>
        <p className="eyebrow">EN ATTENTE DE SOURCES</p>
        <h2 id="progress-empty-title">Aucune donnée à représenter.</h2>
        <p>Aucun service n’est connecté. Aucun chiffre, objectif ou graphique d’exemple ne remplit cet espace.</p>
        <div className="data-provenance">
          <div><span>Source</span><strong>Aucune connexion</strong></div>
          <div><span>Période</span><strong>Non définie</strong></div>
        </div>
        <button className="text-link" type="button" onClick={() => onNavigate('connectors')}>
          <PlugZap aria-hidden="true" />
          <span>Voir les connecteurs</span>
        </button>
      </section>
    </div>
  );
}
