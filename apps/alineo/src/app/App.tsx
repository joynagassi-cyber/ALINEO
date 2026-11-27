import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { NavigationItem, PageId } from './navigation';
import { pageFromHash, pageLabels, primaryNavigation, utilityNavigation } from './navigation';
import { ActivityPage } from './pages/ActivityPage';
import { ChatPage } from './pages/ChatPage';
import { ConnectorsPage } from './pages/ConnectorsPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ThemePicker } from './ThemePicker';
import { applyThemePreference, readThemePreference, type ThemePreference } from './theme';
import {
  agentRuntimeStatusLabel,
  fetchAgentRuntimeStatus,
  INITIAL_AGENT_RUNTIME_STATUS,
} from './agent/runtimeStatus';
import type { AgentRuntimeStatus } from './agent/runtimeStatus';

interface NavigationButtonProps {
  item: NavigationItem;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  compact?: boolean;
}

function NavigationButton({ item, activePage, onNavigate, compact = false }: NavigationButtonProps) {
  const Icon = item.icon;
  const isCurrent = item.id === activePage;

  return (
    <button
      className={`navigation-button${isCurrent ? ' is-current' : ''}${compact ? ' is-compact' : ''}`}
      type="button"
      aria-label={item.label}
      aria-current={isCurrent ? 'page' : undefined}
      title={item.label}
      onClick={() => onNavigate(item.id)}
    >
      <Icon aria-hidden="true" />
      <span className="navigation-label">{item.label}</span>
    </button>
  );
}

export function App() {
  const [activePage, setActivePage] = useState<PageId>(() => pageFromHash(window.location.hash));
  const [theme, setTheme] = useState<ThemePreference>(readThemePreference);
  const [runtimeStatus, setRuntimeStatus] = useState<AgentRuntimeStatus>(INITIAL_AGENT_RUNTIME_STATUS);

  useEffect(() => {
    let mounted = true;
    let retryTimer: number | undefined;

    const checkRuntime = async () => {
      const status = await fetchAgentRuntimeStatus();
      if (!mounted) return;
      setRuntimeStatus(status);
      if (status.state === 'unavailable') {
        retryTimer = window.setTimeout(() => void checkRuntime(), 3000);
      }
    };

    void checkRuntime();
    return () => {
      mounted = false;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, []);

  useLayoutEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  const navigate = useCallback((page: PageId) => {
    if (window.location.hash !== `#${page}`) {
      window.history.pushState({ page }, '', `#${page}`);
    }
    setActivePage(page);
  }, []);

  useEffect(() => {
    const syncPageFromLocation = () => setActivePage(pageFromHash(window.location.hash));
    window.addEventListener('popstate', syncPageFromLocation);
    document.title = `${pageLabels[activePage]} — ALINEO`;
    return () => window.removeEventListener('popstate', syncPageFromLocation);
  }, [activePage]);

  function renderPage() {
    switch (activePage) {
      case 'chat':
        return <ChatPage onNavigate={navigate} paletteId={theme.palette} dark={theme.mode === 'dark'} runtimeStatus={runtimeStatus} />;
      case 'connectors':
        return <ConnectorsPage />;
      case 'progress':
        return <ProgressPage onNavigate={navigate} />;
      case 'insights':
        return <InsightsPage onNavigate={navigate} />;
      case 'activity':
        return <ActivityPage />;
    }
  }

  return (
    <>
      <a className="skip-link" href="#content">Aller au contenu principal</a>
      <div className="ambient-shell">
        <div className="app-window">
          <aside className="side-rail" aria-label="Navigation ALINEO">
            <a className="brand-home" href="#chat" aria-label="ALINEO, ouvrir le chat" onClick={(event) => { event.preventDefault(); navigate('chat'); }}>
              <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>
              <span className="brand-name">ALINEO</span>
            </a>
            <nav className="rail-nav" aria-label="Sections principales">
              {primaryNavigation.map((item) => (
                <NavigationButton key={item.id} item={item} activePage={activePage} onNavigate={navigate} compact />
              ))}
              <div className="mobile-activity-slot">
                <NavigationButton item={utilityNavigation} activePage={activePage} onNavigate={navigate} compact />
              </div>
            </nav>
            <div className="rail-footer">
              <span className="rail-divider" aria-hidden="true" />
              <NavigationButton item={utilityNavigation} activePage={activePage} onNavigate={navigate} compact />
              <span className={`runtime-light is-${runtimeStatus.state}`} role="img" aria-label={agentRuntimeStatusLabel(runtimeStatus.state)} />
            </div>
          </aside>

          <main id="content" className="main-panel" tabIndex={-1}>
            <header className="main-topbar">
              <p className="section-marker">ALINEO <span aria-hidden="true">/</span> <span>{pageLabels[activePage].toLocaleUpperCase('fr-FR')}</span></p>
              <div className="topbar-actions">
                <ThemePicker theme={theme} onChange={setTheme} />
                <span className={`runtime-badge is-${runtimeStatus.state}`} role="status"><i aria-hidden="true" />{agentRuntimeStatusLabel(runtimeStatus.state)}</span>
              </div>
            </header>
            <section className={`view-container${activePage === 'chat' ? ' is-chat' : ' is-secondary'}`} key={activePage} aria-label={pageLabels[activePage]}>
              {renderPage()}
            </section>
            <footer className="app-footer">
              <span>ALINEO · Développement actif</span>
              <span>{runtimeStatus.canSendMessages ? 'Chat IA configuré · Connecteurs non activés' : 'Connexions et agent indisponibles'}</span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
