import { Link2 } from 'lucide-react';
import { connectorCatalog } from '../connectorCatalog';

export function ConnectorsPage() {
  return (
    <div className="secondary-page">
      <header className="page-heading">
        <p className="eyebrow">OUTILS EXTERNES</p>
        <h1>Vos outils restent la source de vérité.</h1>
        <p>Chaque service et chaque permission seront configurés séparément. Aucune connexion n’est active pour le moment.</p>
      </header>

      <div className="connection-notice" role="status">
        <span className="status-dot" aria-hidden="true" />
        <strong>Aucun service n’est connecté à ALINEO.</strong>
      </div>

      <div className="connector-grid">
        {connectorCatalog.map((connector) => (
          <article className="connector-card" key={connector.id} aria-label={connector.name}>
            <div className="connector-card-top">
              <span className={`service-mark service-${connector.id}`} aria-hidden="true">{connector.shortMark}</span>
              <span className="service-state">Non connecté</span>
            </div>
            <h2>{connector.name}</h2>
            <p>{connector.description}</p>
            <div className="decision-needed">
              <strong>À définir</strong>
              <span>{connector.decisionNeeded}</span>
            </div>
            <button className="connector-action" type="button" disabled>
              <Link2 aria-hidden="true" />
              <span>Connexion non activée</span>
            </button>
          </article>
        ))}
      </div>
      <p className="page-footnote">
        Cet état décrit ALINEO uniquement. Il ne lit pas les comptes éventuellement connectés à Arena.
      </p>
    </div>
  );
}
