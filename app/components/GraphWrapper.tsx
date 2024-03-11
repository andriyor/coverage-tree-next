'use client';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { decompressFromEncodedURIComponent } from 'lz-string';
import { useDropzone } from 'react-dropzone-esm';

import { FileTreeCoverage } from './FileTreeCoverage';
import tree from '../tree-data/tree.json';
import { Mode } from '../types';

export const GraphWrapper = () => {
  const searchParams = useSearchParams();
  const json = searchParams.get('json');
  const modeQuery = (searchParams.get('mode') as Mode) || 'tree';

  const [mode, setMode] = useState<Mode>(modeQuery);
  const [droppableTree, setDroppableTree] = useState(tree);

  useEffect(() => {
    if (json) {
      const data = decompressFromEncodedURIComponent(json);
      const parsedData = JSON.parse(data);
      setDroppableTree(parsedData);
    }
  }, [json]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      setMode('tree');
      const tree = JSON.parse(reader.result as string);
      setDroppableTree(tree);
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setMode('coverageTree');
    } else {
      setMode('tree');
    }
  }

  return (
    <div style={{ height: '95.0vh' }}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the tree file here ...</p>
        ) : (
          <p>Drag & drop some files here, or click to select files</p>
        )}
      </div>
      <div>
        <input type="checkbox" id="scales" name="scales" onChange={handleModeChange} />
        <label htmlFor="scales">Is coverage mode</label>
      </div>
      <FileTreeCoverage data={droppableTree} mode={mode} />
    </div>
  );
};
