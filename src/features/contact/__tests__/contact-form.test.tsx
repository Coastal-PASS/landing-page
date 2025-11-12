import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ContactForm } from '../components/ContactForm';

describe('ContactForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('submits and shows success copy', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'Taylor Grower');
    await user.type(screen.getByLabelText(/email/i), 'taylor@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Looking for application control.');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/we will be in touch/i)).toBeInTheDocument();
    });
  });
});
