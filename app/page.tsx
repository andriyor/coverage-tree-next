'use client';
import { Suspense } from 'react';

import { CoverageTree } from './components/CoverageTree';

export default function Home() {
  return (
    <div style={{ height: '98.7vh' }}>
      <Suspense>
        <CoverageTree />
      </Suspense>
    </div>
  );
}
