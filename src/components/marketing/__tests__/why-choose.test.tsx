import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WhyChoose } from '../WhyChoose';

describe('WhyChoose', () => {
  it('lists the value props', () => {
    render(<WhyChoose />);
    expect(screen.getByText(/High-tech advantage/i)).toBeInTheDocument();
    expect(screen.getByText(/Expertise & Innovation/i)).toBeInTheDocument();
  });
});
