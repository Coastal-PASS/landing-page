import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RavenClosingSection } from '../../index';
import { closingContent } from '@/scripts/ravenBrochure';

describe('RavenClosingSection', () => {
  it('shows closing paragraph', () => {
    render(<RavenClosingSection closing={closingContent} />);
    expect(screen.getByText(/Coastal Tractor representive/i)).toBeInTheDocument();
  });

  it('returns null when no content', () => {
    const { container } = render(<RavenClosingSection />);
    expect(container.firstChild).toBeNull();
  });
});
