'use client';
import { Suspense } from 'react';
import { GraphWrapper } from './components/GraphWrapper';

export default function Home() {
  return (
    <Suspense>
      <GraphWrapper />
    </Suspense>
  );
}
