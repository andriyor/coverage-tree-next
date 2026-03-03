import React from 'react';
import Graphin, { GraphinData, Utils } from '@antv/graphin';

import tree from '../tree-data/tree.json';

// Mock tree graph data
const treeMock = Utils.mock(10).tree().graphinTree();
const data = Utils.mock(10).circle().graphin();
// data.edges


console.log('treeMock', treeMock);
console.log('data', data);
// console.log('graphinData', graphinData);



export const DemoTree = () => {
  const dataTree = Utils.mock(10).circle().graphin();
  return <Graphin data={dataTree}></Graphin>;
  // <Graphin data={data} layout={{ type: 'dagre', rankdir: 'LR', align: 'UL' }} />;
};
