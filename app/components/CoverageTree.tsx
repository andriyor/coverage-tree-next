"use client";
import Graphin, { Behaviors, Utils, Components } from '@antv/graphin';

// import tree from "./tree.json";
// import myTree from "./my-tree.json";
import myTreeSum from '../tree-data/my-tree-sum.json';
import { FileTreeNew } from '../types';
import { NodeMenu } from './NodeMenu';

const { DragCanvas, ZoomCanvas, DragNode, TreeCollapse } = Behaviors;
const { ContextMenu } = Components;

// const dataTree = Utils.mock(20).tree().graphinTree();
// console.log(dataTree);

const getColorByCoverage = (percentage: number) => {
  if (percentage >= 70 && percentage <= 100) {
    return 'green';
  } else if (percentage >= 50 && percentage <= 70) {
    return 'yellow';
  } else {
    return 'red';
  }
};

const buildNodeText = (cfg: FileTreeNew) => {
  return (
    `${cfg.name}\n` +
    'Lines in file: ' +
    cfg.meta.lines.pct +
    ` ${cfg.meta.lines.covered}/${cfg.meta.lines.total}\n` +
    'Lines in tree: ' +
    cfg.totalMeta.lines.pct +
    ` ${cfg.totalMeta.lines.covered}/${cfg.totalMeta.lines.total}`
  );
};

Graphin.registerNode(
  'custom-node',
  {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {},
      },
    },
    // @ts-expect-error
    draw(cfg: FileTreeNew, group) {
      const keyshape = group.addShape('rect', {
        attrs: {
          id: 'circle-floor',
          x: 0,
          y: 0,
          width: 200,
          height: 45,
          fill: getColorByCoverage(cfg.meta.lines.pct),
        },
        draggable: true,
        name: 'circle-floor',
      });
      group.addShape('text', {
        attrs: {
          fontSize: 12,
          x: 0,
          y: 40,
          text: buildNodeText(cfg),
          fill: '#ddd',
        },
        draggable: true,
        name: 'text',
      });
      return keyshape;
    },
  },
  'single-node',
);

export const CoverageTree = () => {
  return (
    <Graphin
      data={myTreeSum}
      defaultNode={{ type: 'custom-node' }}
      layout={{
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d: FileTreeNew) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 20;
        },
        getVGap: function getVGap() {
          return 40;
        },
        getHGap: function getHGap() {
          return 120;
        },
      }}
    >
      <TreeCollapse trigger="click " />
      <ZoomCanvas enableOptimize />
      <DragNode />
      <DragCanvas />
      <ContextMenu style={{ background: '#fff' }} bindType="node">
        {(value) => <NodeMenu {...value} />}
      </ContextMenu>
    </Graphin>
  );
};
