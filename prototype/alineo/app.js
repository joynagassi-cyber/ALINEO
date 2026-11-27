(() => {
  'use strict';

  const content = document.querySelector('#main');
  const breadcrumb = document.querySelector('#breadcrumb-current');
  const captureDialog = document.querySelector('#capture-dialog');
  const moreDialog = document.querySelector('#more-dialog');
  const captureForm = document.querySelector('#capture-form');
  const captureField = document.querySelector('#capture-text');
  const toast = document.querySelector('#toast');
  let toastTimer;
  let currentView = 'today';
  let settingsView = 'account';
  let calendarView = 'month';
  let calendarDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  let lifeCoreGuide = false;

  const icons = {
    calendar: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M8 2.8v3M16 2.8v3M3.5 9h17M8 13h2m4 0h2m-8 3h2"/></svg>',
    project: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.5 7.5h7l2 2h8v9.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M3.5 7.5V5.3a1.8 1.8 0 0 1 1.8-1.8h4.2l2 2h5"/></svg>',
    focus: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.3 2M9 2.8h6M12 2.8v1"/></svg>',
    activity: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h3l2.1-5 4.2 10 2.1-5H20"/><path d="M3.5 5.5v13h17"/></svg>',
    heart: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20.3s-7.7-4.4-7.7-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.7 2.6c0 5.7-7.7 10.1-7.7 10.1Z"/><path d="M8.5 12h2.2l1.2-2.1 1.5 4.1 1.1-2h1"/></svg>',
    check: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12.3 9.2 16.5 19 6.8"/><path d="M20 12a8 8 0 1 1-4.2-7.1"/></svg>',
    search: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.3 4.3"/></svg>',
    sparkle: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg>',
    arrow: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    checkCircle: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
    hourglass: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 4 5 6 5 9s-5 5-5 9m10-18c0 4-5 6-5 9s5 5 5 9"/></svg>',
    privacy: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>',
    plus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    sun: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  };

  const titles = {
    today: 'Aujourd’hui', projects: 'Projets', calendar: 'Calendrier', focus: 'Focus',
    'life-core': 'Life Core', habits: 'Habitudes', activity: 'Activité de l’agent', settings: 'Paramètres',
  };

  const phaseMessages = {
    projects: ['Évolution prévue par lots', 'Les projets et leur décomposition sont proposés au Lot 2 de la trajectoire PAOS. Les représenter ici comme activables dès le Lot 1 changerait le périmètre.'],
    calendar: ['Évolution prévue aux Lots 2 et 3', 'Le planner déterministe du Lot 1 appartient à Today. La vue calendrier interne est proposée au Lot 2, puis la connexion externe au Lot 3. Cette destination illustre le futur écran ; aucun calendrier n’est connecté.'],
    focus: ['Évolution prévue par lot', 'Focus est documenté comme une évolution de Lot 2. Cette page illustre un état futur ; aucun minuteur ni suivi réel n’est actif.'],
    habits: ['Évolution prévue par lot', 'Les habitudes sont documentées au Lot 2. Aucune habitude, cible, durée, série ou mesure personnelle n’a été préremplie.'],
  };

  function emptyIcon(svg) {
    return `<span class="empty-symbol" aria-hidden="true">${svg}</span>`;
  }

  function pageHeader(eyebrow, title, subtitle, meta = '') {
    return `<header class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${meta ? `<span class="heading-meta"><span class="status-dot" aria-hidden="true"></span>${meta}</span>` : ''}</header>`;
  }

  function phaseBanner(view) {
    const item = phaseMessages[view];
    if (!item) return '';
    return `<div class="phase-banner"><span class="phase-icon" aria-hidden="true">i</span><p><strong>${item[0]}.</strong> ${item[1]}</p></div>`;
  }

  function actionButton(label, opts = {}) {
    const cls = opts.className || 'button button-primary';
    const extra = opts.capture ? 'data-open-capture' : '';
    const iconHtml = opts.icon ? `${opts.icon}<span>${label}</span>` : label;
    return `<button class="${cls}" type="button" ${extra}>${iconHtml}</button>`;
  }

  function renderToday() {
    return `${pageHeader('ESPACE PERSONNEL', 'Aujourd’hui', 'Un point de départ calme. Choisissez ce que vous souhaitez faire, sans objectifs ni habitudes supposés.')}
      <section class="welcome-card" aria-labelledby="welcome-title">
        <div class="welcome-copy">
          <p class="eyebrow">VOTRE ESPACE D’ACTION</p>
          <h2 id="welcome-title">Les prochaines étapes commencent par vous.</h2>
          <p>Capturez une intention avec vos mots. Rien n’est planifié automatiquement et aucun détail manquant n’est deviné dans cet aperçu.</p>
          <div class="welcome-actions">
            ${actionButton('Capturer une intention', { capture: true, icon: icons.plus })}
            <button class="button-quiet" type="button" data-view="life-core">Voir Life Core ${icons.arrow}</button>
          </div>
        </div>
        <div class="welcome-art" aria-hidden="true"><span class="alignment-grid"></span><span class="art-mark">${icons.sparkle}</span></div>
      </section>
      <div class="content-grid">
        <div class="stack">
          <section class="panel" aria-labelledby="today-tasks-title">
            <div class="panel-header"><div><p class="eyebrow">À VOTRE RYTHME</p><h2 id="today-tasks-title">À traiter aujourd’hui</h2></div><span class="status-pill status-neutral">Aucune tâche</span></div>
            <div class="panel-empty">${emptyIcon(icons.checkCircle)}<h3>Votre espace est prêt quand vous l’êtes.</h3><p>Les tâches que vous aurez créées pourront apparaître ici. Aucune date, priorité ou estimation n’est inventée pour remplir l’écran.</p><button class="empty-link" type="button" data-open-capture>Capturer une intention ${icons.arrow}</button></div>
          </section>
          <section class="panel" aria-labelledby="today-next-title">
            <div class="panel-header"><div><p class="eyebrow">ORGANISATION</p><h2 id="today-next-title">Prochaine étape</h2></div><button class="panel-link" type="button" data-view="projects">Explorer les projets ${icons.arrow}</button></div>
            <div class="panel-empty">${emptyIcon(icons.hourglass)}<h3>Rien n’a été planifié.</h3><p>Une planification pourra être proposée à partir des informations disponibles, sans créer de créneau en votre nom sans votre accord.</p><button class="empty-link" type="button" data-view="calendar">Voir l’aperçu Calendrier ${icons.arrow}</button></div>
          </section>
        </div>
        <div class="stack">
          <section class="panel" aria-labelledby="life-core-card-title">
            <div class="panel-header"><div><p class="eyebrow">VOS ENGAGEMENTS</p><h2 id="life-core-card-title">Life Core</h2></div><button class="panel-link" type="button" data-view="life-core">Ouvrir ${icons.arrow}</button></div>
            <div class="life-panel-content"><div class="life-card"><span class="life-symbol" aria-hidden="true">${icons.heart}</span><div class="life-copy"><strong>À définir par vous</strong><span>Aucune pratique ni préférence n’a été préremplie.</span></div></div></div>
          </section>
          <section class="panel" aria-labelledby="activity-card-title">
            <div class="panel-header"><div><p class="eyebrow">TRANSPARENCE</p><h2 id="activity-card-title">Activité de l’agent</h2></div><button class="panel-link" type="button" data-view="activity">Journal ${icons.arrow}</button></div>
            <div class="activity-empty"><span class="activity-line" aria-hidden="true">${icons.activity}</span><p><strong>Aucune action dans cet aperçu.</strong>L’agent n’est relié à aucun outil et ne réalise aucune action en arrière-plan.</p></div>
          </section>
        </div>
      </div>
      <section class="principles-strip" aria-label="Principes de cette proposition">
        <article class="principle-card"><span class="principle-number">01</span><div><strong>Vous gardez la main</strong><p>Pas d’exécution d’action externe sans permission et confirmation explicite.</p></div></article>
        <article class="principle-card"><span class="principle-number">02</span><div><strong>Rien n’est deviné</strong><p>Les préférences personnelles ne sont pas inventées pour compléter la maquette.</p></div></article>
        <article class="principle-card"><span class="principle-number">03</span><div><strong>Pas de données réelles</strong><p>Tout ce que vous voyez est une structure de démonstration locale.</p></div></article>
      </section>`;
  }

  function renderProjects() {
    return `${pageHeader('PLANIFIER SANS PRÉSUPPOSER', 'Projets', 'Un projet peut regrouper un résultat souhaité et les étapes qui vous rapprochent de celui-ci.', 'Lot 2 · aperçu')}
      ${phaseBanner('projects')}
      <div class="view-toolbar"><div class="segmented-control" role="group" aria-label="Affichage des projets"><button type="button" aria-pressed="true" data-project-view="active">En cours</button><button type="button" aria-pressed="false" data-project-view="archived">Archivés</button></div><span class="subtle-count">Données de démonstration : aucune</span></div>
      <section class="panel content-panel" aria-label="Liste des projets">
        <div class="large-empty">${emptyIcon(icons.project)}<h2>Aucun projet dans cet aperçu</h2><p>Il n’y a pas de projets d’exemple préremplis. Dans le produit, votre premier projet commencerait par un résultat que vous formulez, sans priorité ni échéance ajoutée à votre place.</p><button class="button button-primary" type="button" data-demo-action="La création de projets est montrée comme Lot 2 : elle n’est pas activée dans cet aperçu.">${icons.plus}<span>Créer un projet (Lot 2)</span></button></div>
      </section>
      <p class="content-footer-note">Le module est représenté pour valider la navigation future. Sa présence visuelle ne change pas le séquencement produit documenté.</p>`;
  }

  const calendarWeekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  function dateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function calendarDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function dateFromCalendarKey(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function sameCalendarDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function calendarWeekStart(date) {
    const result = dateOnly(date);
    result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
    return result;
  }

  function calendarMonthDates(year, month) {
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
    return Array.from({ length: cellCount }, (_, index) => new Date(year, month, 1 - offset + index));
  }

  function calendarMonthLabel(date) {
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  }

  function calendarLongDate(date) {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  function calendarShortDate(date) {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  function calendarPeriodLabel() {
    if (calendarView === 'year') return String(calendarDate.getFullYear());
    if (calendarView === 'month') return calendarMonthLabel(calendarDate);
    if (calendarView === 'day') return calendarLongDate(calendarDate);
    const start = calendarWeekStart(calendarDate);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    return `${calendarShortDate(start)} – ${calendarShortDate(end)}`;
  }

  function moveCalendarPeriod(direction) {
    if (calendarView === 'year') {
      const targetYear = calendarDate.getFullYear() + direction;
      const day = Math.min(calendarDate.getDate(), new Date(targetYear, calendarDate.getMonth() + 1, 0).getDate());
      calendarDate = new Date(targetYear, calendarDate.getMonth(), day);
    } else if (calendarView === 'month') {
      const targetMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + direction, 1);
      const day = Math.min(calendarDate.getDate(), new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate());
      calendarDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day);
    } else {
      const dayOffset = calendarView === 'week' ? direction * 7 : direction;
      calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() + dayOffset);
    }
  }

  function renderYearCalendar() {
    const year = calendarDate.getFullYear();
    const today = dateOnly(new Date());
    const weekdays = calendarWeekdays.map((day) => `<span>${day}</span>`).join('');
    const months = Array.from({ length: 12 }, (_, month) => {
      const dates = calendarMonthDates(year, month);
      const monthDate = new Date(year, month, 1);
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(monthDate);
      const datesMarkup = dates.map((date) => {
        const outside = date.getMonth() !== month;
        const classes = ['year-calendar-day', outside ? 'is-outside-month' : '', sameCalendarDate(date, today) ? 'is-today' : ''].filter(Boolean).join(' ');
        return `<span class="${classes}" aria-hidden="true">${date.getDate()}</span>`;
      }).join('');
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const current = calendarDate.getMonth() === month ? ' is-current-month' : '';
      return `<button class="year-month-card${current}" type="button" data-calendar-month="${monthKey}" aria-label="Ouvrir la vue mensuelle de ${monthName} ${year}"><span class="year-month-title">${monthName}</span><span class="year-weekday-row" aria-hidden="true">${weekdays}</span><span class="year-date-grid" aria-hidden="true">${datesMarkup}</span></button>`;
    }).join('');
    return `<div class="calendar-scroll-x" role="region" aria-label="Vue annuelle ; défilement horizontal si nécessaire" tabindex="0"><div class="calendar-year-grid">${months}</div></div>`;
  }

  function renderMonthCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthName = calendarMonthLabel(calendarDate);
    const today = dateOnly(new Date());
    const headers = calendarWeekdays.map((day) => `<th scope="col">${day}</th>`).join('');
    const dates = calendarMonthDates(year, month);
    const rows = [];
    for (let index = 0; index < dates.length; index += 7) {
      const cells = dates.slice(index, index + 7).map((date) => {
        const outside = date.getMonth() !== month;
        const isToday = sameCalendarDate(date, today);
        const isSelected = sameCalendarDate(date, calendarDate);
        const classes = ['calendar-date-button', outside ? 'is-outside-month' : '', isToday ? 'is-today' : ''].filter(Boolean).join(' ');
        const todayAttribute = isToday ? ' aria-current="date"' : '';
        const label = `${calendarLongDate(date)} ; aucun événement chargé ; ouvrir la vue jour`;
        return `<td><button class="${classes}" type="button" data-calendar-date="${calendarDateKey(date)}" data-open-day="true" aria-label="${label}" aria-pressed="${isSelected}"${todayAttribute}><span class="calendar-date-number">${date.getDate()}</span></button></td>`;
      }).join('');
      rows.push(`<tr>${cells}</tr>`);
    }
    return `<div class="calendar-scroll-x" role="region" aria-label="Grille mensuelle ; défilement horizontal si nécessaire" tabindex="0"><table class="calendar-month-table"><caption class="visually-hidden">${monthName} ; aucune disponibilité ou aucun événement chargé</caption><thead><tr>${headers}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }

  function renderTimeCalendar(view) {
    const isWeek = view === 'week';
    const firstDate = isWeek ? calendarWeekStart(calendarDate) : dateOnly(calendarDate);
    const count = isWeek ? 7 : 1;
    const days = Array.from({ length: count }, (_, index) => new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + index));
    const headerCells = days.map((date) => {
      const selected = sameCalendarDate(date, calendarDate);
      const classes = ['time-day-button', sameCalendarDate(date, dateOnly(new Date())) ? 'is-today' : ''].filter(Boolean).join(' ');
      const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date).replace('.', '');
      return `<th scope="col"><button class="${classes}" type="button" data-calendar-date="${calendarDateKey(date)}" aria-label="Sélectionner ${calendarLongDate(date)}" aria-pressed="${selected}"><span>${weekday}</span><strong>${date.getDate()}</strong></button></th>`;
    }).join('');
    const rows = Array.from({ length: 24 }, (_, hour) => {
      const label = `${String(hour).padStart(2, '0')}:00`;
      return `<tr><th class="time-hour-label" scope="row">${label}</th>${days.map(() => '<td></td>').join('')}</tr>`;
    }).join('');
    const caption = isWeek ? 'Semaine vide, heures affichées de 00:00 à 23:00' : `Journée vide du ${calendarLongDate(calendarDate)}, heures affichées de 00:00 à 23:00`;
    const viewClass = isWeek ? 'is-week' : 'is-day';
    return `<div class="calendar-scroll-x calendar-time-scroll" role="region" aria-label="Chronologie ; défilement horizontal si nécessaire" tabindex="0"><table class="calendar-time-table ${viewClass}"><caption class="visually-hidden">${caption} ; aucun événement ou créneau disponible n’est renseigné</caption><thead><tr><th class="time-hour-heading" scope="col">Heure</th>${headerCells}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderCalendarInspector() {
    return `<aside class="calendar-inspector" aria-labelledby="calendar-inspector-title">
      <div class="calendar-inspector-heading"><p class="eyebrow">JOUR SÉLECTIONNÉ</p><h2 id="calendar-inspector-title">${calendarLongDate(calendarDate)}</h2></div>
      <div class="calendar-inspector-empty">${emptyIcon(icons.calendar)}<span class="status-pill status-neutral">Aucune donnée chargée</span><h3>Aucun événement à afficher</h3><p>Aucun horaire, participant, lieu ou bloc n’est inventé dans cet aperçu.</p></div>
      <div class="calendar-inspector-details"><div><span>Disponibilités</span><strong>Non renseignées</strong></div><div><span>Source</span><strong>Aucune connexion</strong></div></div>
    </aside>`;
  }

  function renderCalendarSurface() {
    const viewLabels = { year: 'Année', month: 'Mois', week: 'Semaine', day: 'Jour' };
    let calendarMarkup;
    if (calendarView === 'year') calendarMarkup = renderYearCalendar();
    else if (calendarView === 'month') calendarMarkup = renderMonthCalendar();
    else calendarMarkup = renderTimeCalendar(calendarView);
    const currentViewLabel = viewLabels[calendarView];
    return `<div class="calendar-surface">
      <div class="calendar-toolbar">
        <div class="calendar-toolbar-navigation">
          <button class="button button-secondary calendar-today" type="button" data-calendar-today>Aujourd’hui</button>
          <div class="calendar-stepper" role="group" aria-label="Changer de période">
            <button type="button" data-calendar-step="-1" aria-label="Période précédente">‹</button>
            <button type="button" data-calendar-step="1" aria-label="Période suivante">›</button>
          </div>
          <span class="calendar-period" id="calendar-period" aria-live="polite" aria-atomic="true">${calendarPeriodLabel()}</span>
        </div>
        <div class="calendar-view-switch" role="group" aria-label="Vues du calendrier">${Object.entries(viewLabels).map(([key, label]) => `<button type="button" data-calendar-view="${key}" aria-pressed="${calendarView === key}">${label}</button>`).join('')}</div>
      </div>
      <div class="calendar-layout">
        <section class="calendar-primary" aria-label="Vue ${currentViewLabel.toLowerCase()} du calendrier">${calendarMarkup}</section>
        ${renderCalendarInspector()}
      </div>
      <p class="calendar-local-note">Dates calculées depuis le calendrier local de cet appareil ; aucune disponibilité, préférence de fuseau ou donnée d’événement n’est enregistrée.</p>
    </div>`;
  }

  function updateCalendarSurface(focusSelector) {
    const panel = document.querySelector('#calendar-panel');
    if (!panel) return;
    panel.innerHTML = renderCalendarSurface();
    if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true });
  }

  function renderCalendar() {
    return `${pageHeader('ÉVOLUTION · LOTS 2/3', 'Calendrier', 'Aperçu de la future vue calendrier interne. Le planner déterministe du Lot 1 reste dans Today ; les données personnelles et événements ne sont pas chargés.')}
      ${phaseBanner('calendar')}
      <section class="panel content-panel calendar-panel" id="calendar-panel" aria-label="Aperçu du calendrier">${renderCalendarSurface()}</section>
      <p class="content-footer-note">Vue interne prévue au Lot 2, connexion externe au Lot 3 ; le planner du Lot 1 reste distinct dans Today. Toutes les périodes sont vides faute de données.</p>`;
  }

  function renderFocus() {
    return `${pageHeader('PRÉSENCE', 'Focus', 'Choisissez un type de session, si cette organisation vous convient. Rien n’est déduit de vos habitudes.')}
      ${phaseBanner('focus')}
      <section class="panel content-panel"><div class="large-empty">${emptyIcon(icons.focus)}<h2>Un espace calme, à votre rythme</h2><p>Aucune durée ou tâche n’est suggérée par défaut. Lancer une session réelle n’est pas disponible dans cette maquette.</p>
        <div class="mode-grid" role="group" aria-label="Modes de focus, aperçu seulement">
          <button class="mode-card" type="button" aria-pressed="false" data-focus-mode="pomodoro">${icons.hourglass}<strong>Pomodoro</strong><span>Durées à définir par vous</span></button>
          <button class="mode-card" type="button" aria-pressed="false" data-focus-mode="chrono">${icons.focus}<strong>Chronomètre</strong><span>Sans durée cible</span></button>
          <button class="mode-card" type="button" aria-pressed="false" data-focus-mode="free">${icons.sun}<strong>Durée libre</strong><span>Aucune valeur prédéfinie</span></button>
        </div>
        <div class="mode-actions"><button class="button button-secondary" type="button" disabled aria-disabled="true">Démarrer une session · Lot 2</button></div>
      </div></section>
      <p class="content-footer-note">Les modes ci-dessus sont des options de présentation, pas des pratiques personnelles attribuées à l’utilisateur.</p>`;
  }

  function renderLifeCore() {
    if (lifeCoreGuide) {
      return `${pageHeader('VOS REPÈRES', 'Life Core', 'Une proposition de structure pour expliciter vos pratiques avant toute planification.')}
        <section class="panel content-panel"><div class="large-empty">${emptyIcon(icons.heart)}<h2>Une base vide, à remplir avec vos mots</h2><p>Life Core sert à préserver ce que vous choisissez de protéger. Il ne fournit pas de modèle de valeurs ni d’horaires prédéfinis.</p>
          <div class="life-principles" aria-label="Informations que vous pourrez définir vous-même">
            <article class="life-principle"><span class="empty-symbol" aria-hidden="true">${icons.calendar}</span><div><strong>Quand</strong><p>Vos jours et fenêtres, si vous souhaitez les préciser.</p></div></article>
            <article class="life-principle"><span class="empty-symbol" aria-hidden="true">${icons.hourglass}</span><div><strong>Combien de temps</strong><p>Les durées que vous indiquez, ou aucune durée si vous préférez.</p></div></article>
            <article class="life-principle"><span class="empty-symbol" aria-hidden="true">${icons.privacy}</span><div><strong>Vos limites</strong><p>Ce qui ne doit pas être déplacé ou interrompu, selon vos règles.</p></div></article>
            <article class="life-principle"><span class="empty-symbol" aria-hidden="true">${icons.search}</span><div><strong>Ce que vous voulez suivre</strong><p>Aucun score, objectif ou rituel n’est présumé.</p></div></article>
          </div>
          <div class="mode-actions"><button class="button button-secondary" type="button" data-life-guide="close">Retour à l’état vide</button></div>
        </div></section>`;
    }
    return `${pageHeader('VOS ENGAGEMENTS', 'Life Core', 'L’espace où vos pratiques, rythmes et limites pourront être définis par vous — pas complétés par défaut.')}
      <section class="panel content-panel"><div class="large-empty">${emptyIcon(icons.heart)}<h2>Life Core est volontairement vide</h2><p>Aucune valeur, pratique spirituelle, habitude, horaire, durée, cible ou préférence n’est renseignée. Les choix vous appartiennent.</p><button class="button button-secondary" type="button" data-life-guide="open">Voir la structure proposée ${icons.arrow}</button></div></section>
      <p class="content-footer-note">Le jeûne et les autres pratiques personnelles restent vides tant que vous ne les définissez pas.</p>`;
  }

  function renderHabits() {
    return `${pageHeader('VOTRE RYTHME', 'Habitudes', 'Un endroit pour les habitudes que vous choisissez. La maquette n’attribue ni objectif ni suivi par défaut.', 'Lot 2 · aperçu')}
      ${phaseBanner('habits')}
      <div class="view-toolbar"><div class="segmented-control" role="group" aria-label="Période des habitudes"><button type="button" aria-pressed="true" data-habits-view="overview">Vue d’ensemble</button><button type="button" aria-pressed="false" data-habits-view="history">Historique</button></div><span class="subtle-count">Aucune mesure</span></div>
      <section class="panel content-panel" aria-label="Aperçu des habitudes"><div class="large-empty">${emptyIcon(icons.check)}<h2>Aucune habitude renseignée</h2><p>Vous déciderez si vous souhaitez suivre une pratique, et comment. Il n’y a ni série à préserver, ni score, ni rappel ou objectif implicite.</p><button class="button button-secondary" type="button" data-demo-action="Le suivi des habitudes est une évolution du Lot 2, pas une fonctionnalité du Lot 1.">${icons.plus}<span>Ajouter une habitude · Lot 2</span></button></div></section>
      <p class="content-footer-note">Le suivi d’habitudes est distinct des rappels et des limites Life Core. Aucun n’est activé ici.</p>`;
  }

  function renderActivity() {
    return `${pageHeader('AUDITABILITÉ', 'Activité de l’agent', 'Un journal inspectable doit indiquer ce qui s’est réellement passé — y compris quand rien ne s’est passé.')}
      <section class="panel content-panel" aria-label="Journal des actions de l’agent"><div class="large-empty">${emptyIcon(icons.activity)}<h2>Aucun événement enregistré</h2><p>Cet aperçu n’a ni accès à vos outils, ni agent actif, ni stockage. Il ne fabrique pas de traces pour donner l’impression d’une activité réelle.</p><div class="activity-legend" aria-label="États utiles dans le produit"><span>Proposé · à confirmer</span><span>En attente · information manquante</span><span>Terminé · preuve disponible</span><span>Échec · motif affiché</span></div><p class="legend-label">États illustratifs du modèle, non événements du présent aperçu.</p></div></section>
      <p class="content-footer-note">Les notes privées et raisonnements internes ne font pas partie du journal utilisateur ; seules les entrées factuelles nécessaires à la supervision sont à afficher.</p>`;
  }

  function settingsTabs() {
    const tabs = [
      ['account', 'Profil'], ['preferences', 'Préférences'], ['privacy', 'Confidentialité'],
    ];
    return `<div class="view-tabs" role="group" aria-label="Catégories de paramètres">${tabs.map(([id, label]) => `<button type="button" aria-pressed="${settingsView === id}" data-settings-tab="${id}">${label}</button>`).join('')}</div>`;
  }

  function renderSettings() {
    let body;
    if (settingsView === 'preferences') {
      body = `<div class="form-layout"><div class="form-copy"><h2>Fuseau horaire</h2><p>Non défini dans cet aperçu.</p></div><div class="form-controls"><label><span class="field-label">Fuseau, si vous souhaitez l’indiquer</span><select class="select-input" aria-label="Fuseau horaire, aperçu" disabled><option>Aucun fuseau sélectionné</option></select></label></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Disponibilités</h2><p>À définir avant de proposer des horaires.</p></div><div class="form-controls"><label><span class="field-label">Jours et horaires</span><input class="text-input" type="text" placeholder="Non renseignés" disabled /></label></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Préférences personnelles</h2><p>Les propositions restent neutres jusqu’à votre choix.</p></div><div class="form-controls"><div class="preference-row"><div><strong>Aucune préférence sauvegardée</strong><p>Les rappels et durées ne sont pas activés.</p></div><span class="toggle-preview" aria-hidden="true"><span></span></span></div></div></div>`;
    } else if (settingsView === 'privacy') {
      body = `<div class="form-layout"><div class="form-copy"><h2>Stockage</h2><p>Aucune donnée de cet aperçu n’est envoyée ou enregistrée.</p></div><div class="form-controls"><div class="preference-row"><div><strong>Mode démonstration local</strong><p>Le brouillon est uniquement gardé en mémoire pendant la page ouverte.</p></div><span class="status-pill status-good">Local</span></div></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Accès aux outils</h2><p>Les connexions externes sont hors de cet aperçu.</p></div><div class="form-controls"><div class="preference-row"><div><strong>Aucun outil connecté</strong><p>Pas de calendrier, courriel ou action tierce.</p></div><span class="status-pill status-neutral">Inactif</span></div></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Agent et supervision</h2><p>Pas d’action en arrière-plan.</p></div><div class="form-controls"><div class="preference-row"><div><strong>Confirmation explicite à prévoir</strong><p>Une action réelle devrait afficher son aperçu avant exécution.</p></div><span class="status-pill status-neutral">Non actif</span></div></div></div>`;
    } else {
      body = `<div class="form-layout"><div class="form-copy"><h2>Nom affiché</h2><p>Aucune identité n’est enregistrée.</p></div><div class="form-controls"><label><span class="field-label">Nom, optionnel</span><input class="text-input" type="text" placeholder="Non renseigné" disabled /></label></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Langue</h2><p>Choix de l’interface.</p></div><div class="form-controls"><label><span class="field-label">Langue, aperçu</span><select class="select-input" aria-label="Langue de l'interface" disabled><option>Français · à confirmer</option></select></label></div></div>
        <div class="form-layout"><div class="form-copy"><h2>Profil</h2><p>L’identité de produit et le public cible restent à confirmer.</p></div><div class="form-controls"><div class="preference-row"><div><strong>Proposition ALINEO v0.1</strong><p>Interface de démonstration, non liée à un compte.</p></div><span class="status-pill status-neutral">Aperçu</span></div></div></div>`;
    }
    return `${pageHeader('CONTRÔLE ET PERSONNALISATION', 'Paramètres', 'Les réglages personnels ne sont pas préremplis. Dans le produit, vous garderiez le contrôle des informations et connexions.')}
      <section class="panel content-panel" aria-label="Panneau des paramètres">${settingsTabs()}${body}</section>
      <p class="content-footer-note">Ces champs sont volontairement non modifiables dans la démonstration : aucune valeur n’est persistée ni liée à un compte.</p>`;
  }

  const renderers = {
    today: renderToday,
    projects: renderProjects,
    calendar: renderCalendar,
    focus: renderFocus,
    'life-core': renderLifeCore,
    habits: renderHabits,
    activity: renderActivity,
    settings: renderSettings,
  };

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function setNavigation(view) {
    document.querySelectorAll('[data-view]').forEach((item) => {
      const active = item.dataset.view === view;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function navigate(view, options = {}) {
    if (!renderers[view]) return;
    currentView = view;
    if (view === 'settings' && options.resetSettings) settingsView = 'account';
    setNavigation(view);
    content.innerHTML = renderers[view]();
    breadcrumb.textContent = titles[view];
    document.title = `${titles[view]} · ALINEO`;
    captureDialog.close();
    moreDialog.close();
    if (options.focus) {
      content.focus({ preventScroll: true });
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.addEventListener('click', (event) => {
    const viewControl = event.target.closest('[data-view]');
    if (viewControl) {
      event.preventDefault();
      navigate(viewControl.dataset.view, { focus: viewControl.closest('.more-dialog') !== null });
      return;
    }

    if (event.target.closest('[data-open-capture]')) {
      captureForm.reset();
      document.querySelector('#draft-preview').hidden = true;
      document.querySelector('#capture-error').hidden = true;
      captureField.setAttribute('aria-invalid', 'false');
      document.querySelector('#preview-draft').disabled = false;
      if (!captureDialog.open) captureDialog.showModal();
      window.setTimeout(() => captureField.focus(), 50);
      return;
    }
    if (event.target.closest('[data-close-capture]')) {
      captureDialog.close();
      return;
    }
    if (event.target.closest('[data-close-more]')) {
      moreDialog.close();
      document.querySelector('#open-more').focus();
      return;
    }
    if (event.target.closest('#open-more')) {
      moreDialog.showModal();
      return;
    }
    if (event.target.closest('.banner-close')) {
      document.querySelector('#prototype-banner').hidden = true;
      return;
    }

    const settingsTab = event.target.closest('[data-settings-tab]');
    if (settingsTab) {
      settingsView = settingsTab.dataset.settingsTab;
      navigate('settings');
      return;
    }

    const calendarViewControl = event.target.closest('[data-calendar-view]');
    if (calendarViewControl) {
      calendarView = calendarViewControl.dataset.calendarView;
      updateCalendarSurface(`[data-calendar-view="${calendarView}"]`);
      return;
    }
    const calendarStep = event.target.closest('[data-calendar-step]');
    if (calendarStep) {
      const direction = Number(calendarStep.dataset.calendarStep);
      if (direction === -1 || direction === 1) {
        moveCalendarPeriod(direction);
        updateCalendarSurface(`[data-calendar-step="${direction}"]`);
      }
      return;
    }
    const calendarToday = event.target.closest('[data-calendar-today]');
    if (calendarToday) {
      calendarDate = dateOnly(new Date());
      updateCalendarSurface('[data-calendar-today]');
      return;
    }
    const calendarMonth = event.target.closest('[data-calendar-month]');
    if (calendarMonth) {
      const [year, month] = calendarMonth.dataset.calendarMonth.split('-').map(Number);
      calendarDate = new Date(year, month - 1, 1);
      calendarView = 'month';
      updateCalendarSurface('[data-calendar-view="month"]');
      return;
    }
    const calendarDateControl = event.target.closest('[data-calendar-date]');
    if (calendarDateControl) {
      calendarDate = dateFromCalendarKey(calendarDateControl.dataset.calendarDate);
      if (calendarDateControl.hasAttribute('data-open-day')) {
        calendarView = 'day';
        updateCalendarSurface('[data-calendar-view="day"]');
      } else {
        updateCalendarSurface(`[data-calendar-date="${calendarDateKey(calendarDate)}"]`);
      }
      return;
    }
    const projectView = event.target.closest('[data-project-view]');
    if (projectView) {
      document.querySelectorAll('[data-project-view]').forEach((button) => button.setAttribute('aria-pressed', String(button === projectView)));
      showToast(`Vue « ${projectView.textContent.trim().toLowerCase()} » sélectionnée. Aucun projet n’est chargé.`);
      return;
    }
    const habitsView = event.target.closest('[data-habits-view]');
    if (habitsView) {
      document.querySelectorAll('[data-habits-view]').forEach((button) => button.setAttribute('aria-pressed', String(button === habitsView)));
      showToast(`Vue « ${habitsView.textContent.trim().toLowerCase()} » sélectionnée. Aucun suivi n’est chargé.`);
      return;
    }
    const focusMode = event.target.closest('[data-focus-mode]');
    if (focusMode) {
      document.querySelectorAll('[data-focus-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button === focusMode)));
      showToast(`Option « ${focusMode.dataset.focusMode} » sélectionnée pour l’aperçu. Aucune pratique n’est enregistrée.`);
      return;
    }
    const guide = event.target.closest('[data-life-guide]');
    if (guide) {
      lifeCoreGuide = guide.dataset.lifeGuide === 'open';
      navigate('life-core');
      return;
    }
    const demoAction = event.target.closest('[data-demo-action]');
    if (demoAction) showToast(demoAction.dataset.demoAction);
  });

  captureForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = captureField.value.trim();
    const error = document.querySelector('#capture-error');
    const preview = document.querySelector('#draft-preview');
    if (!text) {
      captureField.setAttribute('aria-invalid', 'true');
      error.textContent = 'Saisissez une intention ou fermez la capture pour annuler.';
      error.hidden = false;
      captureField.focus();
      return;
    }
    captureField.setAttribute('aria-invalid', 'false');
    error.hidden = true;
    document.querySelector('#draft-text').textContent = text;
    preview.hidden = false;
    document.querySelector('#preview-draft').disabled = true;
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  captureField.addEventListener('input', () => {
    if (captureField.value.trim()) {
      captureField.setAttribute('aria-invalid', 'false');
      document.querySelector('#capture-error').hidden = true;
    }
  });

  captureDialog.addEventListener('close', () => {
    captureForm.reset();
    document.querySelector('#draft-preview').hidden = true;
    document.querySelector('#capture-error').hidden = true;
    captureField.setAttribute('aria-invalid', 'false');
    document.querySelector('#preview-draft').disabled = false;
  });

  captureDialog.addEventListener('click', (event) => {
    if (event.target === captureDialog) captureDialog.close();
  });
  moreDialog.addEventListener('click', (event) => {
    if (event.target === moreDialog) {
      moreDialog.close();
      document.querySelector('#open-more').focus();
    }
  });
  moreDialog.addEventListener('close', () => {
    if (document.activeElement === document.body) document.querySelector('#open-more').focus();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      showToast('La recherche globale est prévue quand les données seront connectées. Rien n’est recherché dans cet aperçu.');
    }
  });

  navigate('today');
})();
