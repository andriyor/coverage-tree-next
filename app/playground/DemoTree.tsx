import React from 'react';
import Graphin, { GraphinData, Utils } from '@antv/graphin';

import tree from '../tree-data/tree.json';

// Mock tree graph data
const data = Utils.mock(10).tree().graphinTree();
const graphinData: GraphinData = Utils.mock(5).tree().graphin();
// data.edges


console.log('data', data);
console.log('graphinData', graphinData);



export const DemoTree = () => {
  return <Graphin data={tree} layout={{ type: 'compactBox' }}></Graphin>;
  // <Graphin data={data} layout={{ type: 'dagre', rankdir: 'LR', align: 'UL' }} />;
};
