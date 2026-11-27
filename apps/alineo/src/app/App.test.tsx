import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('./components/CopilotChatPanel', () => ({
  CopilotChatPanel: () => (
    <div data-testid="alineo-live-chat">
      <div data-testid="copilot-chat">CopilotKit chat avec rendu A2UI</div>
    </div>
  ),
}));

import { App } from './App';
import { connectorCatalog } from './connectorCatalog';
import { pageFromHash } from './navigation';

const notConfiguredStatus = {
  state: 'not-configured',
  canSendMessages: false,
  message: 'Le serveur agent et le fournisseur de modèle ne sont pas configurés. Aucun message ne sera transmis.',
};
const configuredStatus = {
  state: 'ready',
  canSendMessages: true,
  message: 'Le runtime et le modèle sont configurés côté serveur.',
};

function jsonResponse(payload: unknown) {
  return { ok: true, status: 200, json: async () => payload } as Response;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(notConfiguredStatus)));
});

describe('ALINEO app shell', () => {
  it('shows the approved agentic-chat entry without inventing a personal name or response', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Comment puis-je vous aider\s*\?/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Agent non configuré · aucun message transmis')).toBeInTheDocument());
    expect(screen.queryByText(/Bonjour,\s+\w+/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Envoyer un message — agent non configuré' })).toBeDisabled();
  });

  it('navigates to the named connectors and keeps every service disconnected', () => {
    render(<App />);
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Sections principales' })).getByRole('button', { name: 'Connecteurs' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Vos outils restent la source de vérité.' })).toBeInTheDocument();
    expect(screen.getByText('Aucun service n’est connecté à ALINEO.')).toBeInTheDocument();
    for (const connector of connectorCatalog) {
      const card = screen.getByRole('article', { name: new RegExp(connector.name) });
      expect(within(card).getByText('Non connecté')).toBeInTheDocument();
      expect(within(card).getByRole('button', { name: /Connexion non activée/ })).toBeDisabled();
    }
    expect(window.location.hash).toBe('#connectors');
  });

  it('does not render fabricated charts or personal progress values', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Progression' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Aucune donnée à représenter.' })).toBeInTheDocument();
    expect(screen.getByText('Aucune connexion')).toBeInTheDocument();
    expect(screen.getByText('Non définie')).toBeInTheDocument();
    expect(screen.queryByText(/\b\d+\s*%/)).not.toBeInTheDocument();
  });

  it('keeps an unconfigured chat draft local and never sends it to the runtime', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse(notConfiguredStatus));
    vi.stubGlobal('fetch', fetchSpy);
    render(<App />);
    await waitFor(() => expect(screen.getByText('Agent non configuré · aucun message transmis')).toBeInTheDocument());

    const textarea = screen.getByRole('textbox', { name: 'Votre message à ALINEO' });
    fireEvent.change(textarea, { target: { value: 'Texte local de test' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Envoyer un message — agent non configuré' }).closest('form')!);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith('/api/copilotkit/status', expect.objectContaining({ cache: 'no-store' }));
    expect(fetchSpy.mock.calls.every(([url]) => url === '/api/copilotkit/status')).toBe(true);
    expect(textarea).toHaveValue('Texte local de test');
    expect(screen.getByText(/Votre brouillon reste en mémoire de page et n’est pas enregistré/)).toBeInTheDocument();
  });

  it('mounts the CopilotKit A2UI chat only after the runtime confirms configuration', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(configuredStatus)));
    render(<App />);

    await waitFor(() => expect(screen.getByTestId('copilot-chat')).toBeInTheDocument());
    expect(screen.getByTestId('alineo-live-chat')).toBeInTheDocument();
    expect(screen.getByText('Agent configuré')).toBeInTheDocument();
    expect(screen.getByText('CopilotKit chat avec rendu A2UI')).toBeInTheDocument();
  });
});

describe('appearance selector', () => {
  it('exposes all 18 gradient palettes as accessible radio choices', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Choisir l’apparence' }));

    const paletteGroup = screen.getByRole('group', { name: /Palette 18 dégradés/ });
    expect(within(paletteGroup).getAllByRole('radio')).toHaveLength(18);
    expect(within(paletteGroup).getByRole('radio', { name: 'Lagune, palette 1' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Clair' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Sombre' })).toBeChecked();
  });

  it('applies and remembers a selected palette and light/dark mode', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Choisir l’apparence' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Lagon bleu, palette 14' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Clair' }));

    expect(document.documentElement.dataset.themeMode).toBe('light');
    expect(document.documentElement.dataset.themePalette).toBe('blue-lagoon');
    expect(screen.getByTestId('assistant-orb')).toHaveAttribute('data-colour', 'blue-lagoon');
    expect(screen.getByTestId('assistant-orb')).toHaveAttribute('data-state', 'idle');
    expect(JSON.parse(window.localStorage.getItem('alineo.theme.v1')!)).toEqual({ mode: 'light', palette: 'blue-lagoon' });
  });

  it('closes on Escape and returns focus to the appearance button', () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: 'Choisir l’apparence' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('region', { name: 'Personnaliser l’apparence' })).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });
});

it('maps only known hash routes and defaults unknown values to chat', () => {
  expect(pageFromHash('#insights')).toBe('insights');
  expect(pageFromHash('#not-a-page')).toBe('chat');
  expect(pageFromHash('')).toBe('chat');
});
