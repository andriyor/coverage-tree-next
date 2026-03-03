'use client';
import { Suspense } from 'react';
import { GraphWrapper } from './components/GraphWrapper';
import { DemoTree } from '@/app/playground/DemoTree';

export default function Home() {
  return (
    <Suspense>
      <GraphWrapper />
      
      {/*example*/}
      {/*<DemoTree/>*/}
    </Suspense>
  );
}
