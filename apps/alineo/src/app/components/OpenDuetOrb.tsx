import { useEffect, useState } from 'react';
import type { ThemePaletteId } from '../theme';
import { MicOrb } from './duet/mic-orb';

function responsiveOrbSize() {
  if (typeof window === 'undefined') return 126;
  if (window.innerWidth <= 680) return 91;
  if (window.innerWidth <= 900) return 108;
  return 126;
}

function useResponsiveOrbSize() {
  const [size, setSize] = useState(responsiveOrbSize);

  useEffect(() => {
    const updateSize = () => setSize(responsiveOrbSize());
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

interface OpenDuetOrbProps {
  paletteId?: ThemePaletteId;
  dark?: boolean;
  size?: number;
}

/** ALINEO's idle assistant mark, adapted from OpenDuet's canvas-based MicOrb. */
export function OpenDuetOrb({ paletteId = 'lagoon', dark = true, size: preferredSize }: OpenDuetOrbProps) {
  const responsiveSize = useResponsiveOrbSize();

  return (
    <MicOrb
      className="assistant-orb"
      colour={paletteId}
      dark={dark}
      size={preferredSize ?? responsiveSize}
      state="idle"
    />
  );
}
