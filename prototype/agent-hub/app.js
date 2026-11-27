(() => {
  'use strict';

  const view = document.querySelector('#page-view');
  const sectionName = document.querySelector('#section-name');
  const pageNames = {
    chat: 'Chat',
    connectors: 'Connecteurs',
    progress: 'Progression',
    insights: 'Insights',
    activity: 'Activité',
  };

  const icons = {
    connector: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 7V4m8 3V4M7 8h10v5a5 5 0 0 1-10 0V8Z"/><path d="M12 18v2m-3 0h6"/></svg>',
    progress: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 19.5h16M6.5 16V11m5 5V5m5 11V8"/><path d="m5 8 5-3 5 2 4-4"/></svg>',
    insight: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>',
    activity: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h4l2.1-5 4 10 2.2-5H21"/><path d="M3 5v14h18"/></svg>',
    arrow: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    lock: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4.5" y="10" width="15" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2"/></svg>',
  };

  const pages = {
    chat: `
      <div class="chat-home">
        <div class="assistant-orb" aria-hidden="true"><span class="orb-glint"></span></div>
        <p class="greeting">Bonjour</p>
        <h1 class="chat-title">Comment puis-je vous aider&nbsp;?</h1>
        <p class="chat-subtitle">Un point de départ pour vos outils, vos questions et vos décisions. Rien n’est envoyé depuis cet aperçu.</p>
        <div class="offline-note"><span aria-hidden="true"></span>Maquette locale · aucun agent ni connecteur actif</div>
        <form class="composer-shell" id="chat-form">
          <label class="visually-hidden" for="message-input">Votre demande à l’assistant</label>
          <textarea id="message-input" name="message" rows="2" maxlength="1200" placeholder="Écrivez une demande…" autocomplete="off"></textarea>
          <div class="composer-actions">
            <button class="composer-tool" type="button" data-page="connectors">${icons.connector}<span>Connecteurs</span></button>
            <button class="send-button" type="submit" aria-label="Prévisualiser l’envoi, sans transmettre le message" title="Aucun message ne sera transmis"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>
          </div>
        </form>
        <p id="message-status" class="message-status" role="status" aria-live="polite">Le texte reste dans cette page : aucun message n’est transmis ni enregistré.</p>
        <div class="suggestion-grid" aria-label="Raccourcis du prototype">
          <button class="suggestion-card" type="button" data-page="connectors">
            <span class="suggestion-icon">${icons.connector}</span>
            <strong>Voir mes connecteurs</strong>
            <span>Outils visés et permissions à confirmer.</span>
          </button>
          <button class="suggestion-card" type="button" data-page="progress">
            <span class="suggestion-icon">${icons.progress}</span>
            <strong>Suivre ma progression</strong>
            <span>Des faits réels, avec leur source et leur période.</span>
          </button>
          <button class="suggestion-card" type="button" data-page="insights">
            <span class="suggestion-icon">${icons.insight}</span>
            <strong>Explorer un insight</strong>
            <span>Aucune tendance n’est inventée pour remplir l’écran.</span>
          </button>
        </div>
        <p class="chat-footnote">Vos comptes et données ne sont pas accessibles dans cette maquette.</p>
      </div>`,

    connectors: `
      <div class="secondary-page">
        <header class="page-heading">
          <p class="eyebrow">OUTILS EXTERNES</p>
          <h1>Vos outils restent la source de vérité.</h1>
          <p>Choisissez les services et les permissions avant toute connexion. Cette maquette n’ouvre aucun compte et ne demande aucun accès.</p>
        </header>
        <div class="connection-notice"><span class="status-indicator" aria-hidden="true"></span><strong>Aucun service n’est connecté à ce prototype.</strong></div>
        <div class="connector-grid">
          <article class="connector-card">
            <div class="connector-card-top"><span class="service-mark service-gmail" aria-hidden="true">G</span><span class="service-state">Non connecté</span></div>
            <h2>Gmail</h2>
            <p>Les opérations utiles, scopes et règles d’approbation restent à définir.</p>
            <button type="button" disabled>Connexion non activée</button>
          </article>
          <article class="connector-card">
            <div class="connector-card-top"><span class="service-mark service-calendar" aria-hidden="true">▦</span><span class="service-state">Non connecté</span></div>
            <h2>Google Calendar</h2>
            <p>Lecture, création éventuelle et permissions sont à confirmer.</p>
            <button type="button" disabled>Connexion non activée</button>
          </article>
          <article class="connector-card">
            <div class="connector-card-top"><span class="service-mark service-workspace" aria-hidden="true">W</span><span class="service-state">Non connecté</span></div>
            <h2>Google Workspace</h2>
            <p>Drive, Docs, Sheets ou Slides : les services et scopes se choisissent séparément.</p>
            <button type="button" disabled>Connexion non activée</button>
          </article>
          <article class="connector-card">
            <div class="connector-card-top"><span class="service-mark service-ticktick" aria-hidden="true">✓</span><span class="service-state">Non connecté</span></div>
            <h2>TickTick</h2>
            <p>API, permissions et compatibilité avec l’offre visée restent à vérifier.</p>
            <button type="button" disabled>Connexion non activée</button>
          </article>
        </div>
        <p class="page-footnote">Les états sont ceux du prototype, pas ceux des comptes Google ou TickTick éventuellement connectés à Arena.</p>
      </div>`,

    progress: `
      <div class="secondary-page">
        <header class="page-heading">
          <p class="eyebrow">FAITS OBSERVABLES</p>
          <h1>Une progression lisible, jamais supposée.</h1>
          <p>Les vues de progression ne s’affichent qu’à partir de données réellement accessibles et d’une période clairement indiquée.</p>
        </header>
        <section class="empty-panel" aria-labelledby="progress-empty-title">
          <span class="empty-visual">${icons.progress}</span>
          <p class="eyebrow">EN ATTENTE DE SOURCES</p>
          <h2 id="progress-empty-title">Aucune donnée à représenter.</h2>
          <p>Il n’y a ni compte relié ni historique disponible dans cette maquette. Aucun chiffre, objectif ou graphique d’exemple n’est ajouté.</p>
          <div class="data-provenance"><div><span>Source</span><strong>Aucune connexion</strong></div><div><span>Période</span><strong>Non définie</strong></div></div>
          <button class="text-link" type="button" data-page="connectors">Voir les connecteurs ${icons.arrow}</button>
        </section>
      </div>`,

    insights: `
      <div class="secondary-page">
        <header class="page-heading">
          <p class="eyebrow">AIDE À LA DÉCISION</p>
          <h1>Des insights seulement quand les données le permettent.</h1>
          <p>Chaque tendance devra exposer sa source, sa période et la manière dont elle est calculée.</p>
        </header>
        <section class="empty-panel" aria-labelledby="insight-empty-title">
          <span class="empty-visual">${icons.insight}</span>
          <p class="eyebrow">AUCUNE TENDANCE CALCULÉE</p>
          <h2 id="insight-empty-title">Il manque des données réelles.</h2>
          <p>Aucun score, objectif ou comparaison n’est présumé. Une suggestion ne sera jamais présentée comme un résultat observé.</p>
          <div class="data-provenance"><div><span>Sources</span><strong>Aucune connexion</strong></div><div><span>Définition</span><strong>À confirmer</strong></div></div>
          <button class="text-link" type="button" data-page="connectors">Voir les connecteurs ${icons.arrow}</button>
        </section>
      </div>`,

    activity: `
      <div class="secondary-page">
        <header class="page-heading">
          <p class="eyebrow">TRANSPARENCE</p>
          <h1>Ce qui s’est réellement passé.</h1>
          <p>Les appels, propositions, validations et erreurs devront être visibles sans exposer de raisonnement privé.</p>
        </header>
        <section class="empty-panel" aria-labelledby="activity-empty-title">
          <span class="empty-visual">${icons.activity}</span>
          <p class="eyebrow">JOURNAL DU PROTOTYPE</p>
          <h2 id="activity-empty-title">Aucune activité observée.</h2>
          <p>Aucun agent ni service externe n’est connecté. Aucun appel, changement ou succès n’est simulé.</p>
          <span class="status-pill">Aucune action enregistrée</span>
        </section>
      </div>`,
  };

  function currentPageFromHash() {
    const page = window.location.hash.replace(/^#/, '');
    return Object.hasOwn(pageNames, page) ? page : 'chat';
  }

  function render(page, updateHistory = false) {
    const selectedPage = Object.hasOwn(pageNames, page) ? page : 'chat';
    view.innerHTML = pages[selectedPage];
    view.classList.toggle('is-secondary', selectedPage !== 'chat');
    sectionName.textContent = pageNames[selectedPage].toLocaleUpperCase('fr-FR');
    document.title = `${pageNames[selectedPage]} — Agent Hub, aperçu`;

    document.querySelectorAll('[data-page]').forEach((button) => {
      const isCurrent = button.dataset.page === selectedPage;
      button.classList.toggle('is-current', isCurrent);
      if (isCurrent) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    if (updateHistory && window.location.hash !== `#${selectedPage}`) {
      window.history.pushState({ page: selectedPage }, '', `#${selectedPage}`);
    }
  }

  document.addEventListener('click', (event) => {
    const pageButton = event.target.closest('[data-page]');
    if (!pageButton) return;
    event.preventDefault();
    render(pageButton.dataset.page, true);
  });

  view.addEventListener('submit', (event) => {
    if (event.target.id !== 'chat-form') return;
    event.preventDefault();
    const input = view.querySelector('#message-input');
    const status = view.querySelector('#message-status');
    if (!input.value.trim()) {
      status.textContent = 'Écrivez une demande pour prévisualiser l’état du chat. Rien ne sera envoyé.';
      input.focus();
      return;
    }
    status.textContent = 'Aucun message transmis : aucun modèle ni connecteur n’est relié. Votre texte n’a pas quitté cette page.';
  });

  view.addEventListener('input', (event) => {
    if (event.target.id === 'message-input') {
      const status = view.querySelector('#message-status');
      status.textContent = 'Le texte reste dans cette page : aucun message n’est transmis ni enregistré.';
    }
  });

  window.addEventListener('popstate', () => render(currentPageFromHash()));
  render(currentPageFromHash());
})();
