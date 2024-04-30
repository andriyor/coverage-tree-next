'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { decompressFromEncodedURIComponent } from 'lz-string';
import { useDropzone } from 'react-dropzone-esm';

import { FileTreeCoverage } from './FileTreeCoverage';
import tree from '../tree-data/tree.json';
import { FileTree, Mode } from '../types';

export const GraphWrapper = () => {
  const params = useParams();
  const [droppableTree, setDroppableTree] = useState<FileTree>(tree as unknown as FileTree);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    const data = decompressFromEncodedURIComponent(currentHash);
    const parsedData = JSON.parse(data);
    if (parsedData) {
      setDroppableTree(parsedData);
    }
  }, [params]);

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

  const mode: Mode = droppableTree?.meta ? 'coverageTree' : 'tree';

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
