'use client';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { decompressFromEncodedURIComponent } from 'lz-string';
import { useDropzone } from 'react-dropzone-esm';

import { FileTreeCoverage } from './FileTreeCoverage';
import tree from '../tree-data/tree.json';
import { Mode } from '../types';

export const GraphWrapper = () => {
  const searchParams = useSearchParams();
  const json = searchParams.get('json');
  const mode = (searchParams.get('mode') as Mode) || 'tree';

  const [droppableTrue, setDroppableTrue] = useState(tree);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const tree = JSON.parse(reader.result as string);
      setDroppableTrue(tree);
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (json) {
    const data = decompressFromEncodedURIComponent(json);
    const parsedData = JSON.parse(data);

    return <FileTreeCoverage data={parsedData} mode={mode} />;
  }

  return (
    <div style={{ height: '98.7vh' }}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the tree file here ...</p> :
            <p>Drag & drop some files here, or click to select files</p>
        }
      </div>
      <FileTreeCoverage data={droppableTrue} mode={mode} />
    </div>
  );
};
