'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { decompressFromEncodedURIComponent } from 'lz-string';
import { useDropzone } from 'react-dropzone-esm';

import { FileTreeCoverage } from './FileTreeCoverage';
import tree from '../tree-data/tree.json';
import { FileTree, Mode } from '../types';

export const GraphWrapper = () => {
  const searchParams = useSearchParams();
  const json = searchParams.get('json');

  const [droppableTree, setDroppableTree] = useState<FileTree>(tree as unknown as FileTree);

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
      const tree = JSON.parse(reader.result as string);
      setDroppableTree(tree);
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const mode: Mode = droppableTree.meta ? 'coverageTree' : 'tree';

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
      <FileTreeCoverage data={droppableTree} mode={mode} />
    </div>
  );
};
