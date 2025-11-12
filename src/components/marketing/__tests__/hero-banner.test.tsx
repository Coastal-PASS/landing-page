import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { HeroBanner } from '../HeroBanner';

describe('HeroBanner', () => {
  it('shows primary CTA copy', () => {
    render(<HeroBanner />);
    expect(screen.getByText(/precision technology/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact');
  });

  it('opens the dialog when the watch video button is clicked', async () => {
    const user = userEvent.setup();
    render(<HeroBanner />);

    await user.click(screen.getByRole('button', { name: /watch video/i }));

    expect(screen.getByTitle(/coastal pass overview/i)).toBeInTheDocument();
  });
});
