import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React, { type ImgHTMLAttributes, type ReactElement } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

const noop = (): void => undefined;

const createMockMatchMedia = (): MediaQueryList => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: noop,
  removeListener: noop,
  addEventListener: noop,
  removeEventListener: noop,
  dispatchEvent: () => false,
});

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (): MediaQueryList => createMockMatchMedia();
}

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }): ReactElement => {
    const { alt = '', fill: _fill, priority: _priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));
