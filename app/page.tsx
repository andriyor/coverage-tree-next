'use client';
import { Suspense } from 'react';
import { GraphWrapper } from './components/GraphWrapper';


export default function Home() {
  return (
    <div style={{ height: '98.7vh' }}>
      <Suspense>
        <GraphWrapper />
      </Suspense>
    </div>
  );
}
