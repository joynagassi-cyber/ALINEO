import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Palette as PaletteIcon, Sun } from 'lucide-react';
import type { ThemeMode, ThemePaletteId, ThemePreference } from './theme';
import { themePalettes } from './theme';

interface ThemePickerProps {
  theme: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

interface PopoverPosition {
  top: number;
  right: number;
}

export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ top: 64, right: 12 });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panelWidth = Math.min(520, Math.max(0, window.innerWidth - 24));
    const panelHeight = Math.min(620, Math.max(0, window.innerHeight - 24));
    const topBelow = rect.bottom + 8;
    const top = topBelow + panelHeight <= window.innerHeight - 12
      ? topBelow
      : Math.max(12, window.innerHeight - panelHeight - 12);
    const availableRight = window.innerWidth - rect.right;
    const right = Math.max(12, Math.min(availableRight, window.innerWidth - panelWidth - 12));
    setPosition({ top, right });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  function changeMode(mode: ThemeMode) {
    onChange({ ...theme, mode });
  }

  function changePalette(palette: ThemePaletteId) {
    onChange({ ...theme, palette });
  }

  return (
    <div className="theme-picker" ref={rootRef}>
      <button
        className="theme-picker-trigger"
        type="button"
        aria-label="Choisir l’apparence"
        aria-expanded={open}
        aria-controls="appearance-options"
        title="Choisir l’apparence"
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
      >
        <PaletteIcon aria-hidden="true" />
      </button>

      <section
        className="theme-picker-panel"
        id="appearance-options"
        aria-labelledby="appearance-title"
        role="region"
        hidden={!open}
        style={{ top: position.top, right: position.right }}
      >
        <div className="theme-picker-heading">
          <h2 id="appearance-title">Personnaliser l’apparence</h2>
          <p>Choisissez une palette et son mode clair ou sombre.</p>
        </div>

        <fieldset className="theme-mode-options">
          <legend>Mode de couleur</legend>
          <label className="theme-mode-option">
            <input
              className="visually-hidden"
              type="radio"
              name="alineo-theme-mode"
              value="light"
              checked={theme.mode === 'light'}
              onChange={() => changeMode('light')}
            />
            <span><Sun aria-hidden="true" /> Clair</span>
          </label>
          <label className="theme-mode-option">
            <input
              className="visually-hidden"
              type="radio"
              name="alineo-theme-mode"
              value="dark"
              checked={theme.mode === 'dark'}
              onChange={() => changeMode('dark')}
            />
            <span><Moon aria-hidden="true" /> Sombre</span>
          </label>
        </fieldset>

        <fieldset className="theme-palette-options">
          <legend>Palette <span>18 dégradés</span></legend>
          <div className="theme-palette-grid">
            {themePalettes.map((palette, index) => {
              const gradient = `linear-gradient(120deg, ${palette.colors[0]}, ${palette.colors[1]} 52%, ${palette.colors[2]})`;
              return (
                <label className="theme-palette-option" key={palette.id}>
                  <input
                    className="visually-hidden"
                    type="radio"
                    name="alineo-theme-palette"
                    value={palette.id}
                    aria-label={`${palette.name}, palette ${index + 1}`}
                    checked={theme.palette === palette.id}
                    onChange={() => changePalette(palette.id)}
                  />
                  <span className="theme-palette-card">
                    <span className="theme-palette-swatch" style={{ background: gradient }}>
                      <span className="theme-palette-check" aria-hidden="true">✓</span>
                    </span>
                    <span className="theme-palette-name">{palette.name}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <p className="visually-hidden" role="status" aria-live="polite">
          Palette {themePalettes.find((palette) => palette.id === theme.palette)?.name}, mode {theme.mode === 'light' ? 'clair' : 'sombre'} sélectionné.
        </p>
      </section>
    </div>
  );
}
