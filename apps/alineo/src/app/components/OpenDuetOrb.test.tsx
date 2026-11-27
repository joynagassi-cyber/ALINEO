import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OpenDuetOrb } from './OpenDuetOrb';

afterEach(cleanup);

describe('OpenDuetOrb', () => {
  it('renders ALINEO’s animated MicOrb as a decorative idle mark', () => {
    render(<OpenDuetOrb />);
    const orb = screen.getByTestId('assistant-orb');

    expect(orb).toHaveAttribute('data-state', 'idle');
    expect(orb).toHaveAttribute('data-colour', 'lagoon');
    expect(orb).toHaveAttribute('aria-hidden', 'true');
    expect(orb.querySelector('canvas')).toBeInTheDocument();
    expect(screen.queryByText(/thinking|working|listening/i)).not.toBeInTheDocument();
  });
});
