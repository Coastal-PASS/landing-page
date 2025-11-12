import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders primary navigation links', () => {
    render(<Navbar />);
    const primaryNav = screen.getByRole('navigation', { name: /primary navigation/i });
    const scoped = within(primaryNav);
    expect(scoped.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(scoped.getByRole('link', { name: /raven/i })).toHaveAttribute('href', '/raven-air-blast');
  });

  it('opens the mobile sheet when the menu button is pressed', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByLabelText(/open navigation menu/i));

    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /contact us/i })[0]).toBeInTheDocument();
  });
});
