import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ClientProviders } from '../ClientProviders';

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

describe('ClientProviders', () => {
  it('renders children within providers', () => {
    render(
      <ClientProviders>
        <p>provider child</p>
      </ClientProviders>,
    );

    expect(screen.getByText('provider child')).toBeInTheDocument();
    expect(screen.getByTestId('devtools')).toBeInTheDocument();
  });

  it('omits devtools in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ClientProviders>
        <p>child</p>
      </ClientProviders>,
    );

    expect(screen.queryByTestId('devtools')).toBeNull();
    process.env.NODE_ENV = originalEnv;
  });
});
