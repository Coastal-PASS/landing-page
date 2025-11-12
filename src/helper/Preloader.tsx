'use client';

import type { ReactElement } from 'react';

const Preloader = (): ReactElement => (
  <div className="preloader">
    <div className="preloader-inner">
      <span className="loader" />
    </div>
  </div>
);

export default Preloader;
