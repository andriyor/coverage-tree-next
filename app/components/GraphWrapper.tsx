'use client';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { useSearchParams } from 'next/navigation';

import { FileTreeCoverage } from './FileTreeCoverage';
import tree from '../tree-data/tree.json';
import { Mode } from '../types';

export const GraphWrapper = () => {
  const searchParams = useSearchParams();
  const json = searchParams.get('json');
  const mode = (searchParams.get('mode') as Mode) || 'tree';

  if (json) {
    const data = decompressFromEncodedURIComponent(json);
    const parsedData = JSON.parse(data);

    return <FileTreeCoverage data={parsedData} mode={mode} />;
  }

  return (
    <>
      <div>Demo tree</div>
      <FileTreeCoverage data={tree} mode={mode} />;
    </>
  );
};
