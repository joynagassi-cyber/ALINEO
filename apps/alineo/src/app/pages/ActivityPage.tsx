import { Activity } from 'lucide-react';

export function ActivityPage() {
  return (
    <div className="secondary-page">
      <header className="page-heading">
        <p className="eyebrow">TRANSPARENCE</p>
        <h1>Ce qui s’est réellement passé.</h1>
        <p>L’activité ne montrera que des appels, propositions, validations et erreurs observés.</p>
      </header>
      <section className="empty-panel" aria-labelledby="activity-empty-title">
        <span className="empty-visual"><Activity aria-hidden="true" /></span>
        <p className="eyebrow">ACTIVITÉ</p>
        <h2 id="activity-empty-title">Aucune activité observée.</h2>
        <p>Aucun agent ni service externe n’est connecté. Aucun événement ou succès n’est simulé.</p>
      </section>
    </div>
  );
}
