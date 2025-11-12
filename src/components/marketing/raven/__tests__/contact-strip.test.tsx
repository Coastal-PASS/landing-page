import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RavenContactStrip } from '../../index';
import { contactStrip } from '@/scripts/ravenBrochure';

describe('RavenContactStrip', () => {
  it('renders CTA links', () => {
    render(<RavenContactStrip contact={contactStrip} />);
    expect(screen.getByText(contactStrip.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: contactStrip.website.label })).toHaveAttribute('href', contactStrip.website.href);
  });

  it('returns null when no data', () => {
    const { container } = render(<RavenContactStrip />);
    expect(container.firstChild).toBeNull();
  });
});
