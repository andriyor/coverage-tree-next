'use client';
import React, { useRef } from 'react';
import Graphin, { Behaviors, Utils, Components, GraphinTreeData } from '@antv/graphin';

// import tree from "./tree.json";
// import myTree from "./my-tree.json";
// import myTreeSum from '../tree-data/my-tree-sum.json';

import { NodeMenu } from './NodeMenu';
import { FileTreeNew, Mode } from '../types';

const { DragCanvas, ZoomCanvas, DragNode, TreeCollapse } = Behaviors;
const { ContextMenu } = Components;

// const dataTree = Utils.mock(20).tree().graphinTree();
// console.log(dataTree);

// https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
// main - A400, back - 100
const getColorByCoverage = (percentage: number) => {
  if (percentage >= 70 && percentage <= 100) {
    return {
      main: '#00E676',
      back: '#C8E6C9',
    };
  } else if (percentage >= 50 && percentage <= 70) {
    return {
      main: '#FFEA00',
      back: '#FFF59D',
    };
  } else {
    return {
      main: '#FF3D00',
      back: '#FFAB91',
    };
  }
};

const truncate = (str: string, length: number) => {
  return str.length > length ? str.slice(0, length - 1) + '...' : str;
};

const renderLinesInTree = (cfg: FileTreeNew) => {
  return cfg?.totalMeta
    ? 'Lines in tree: ' +
        cfg.totalMeta.lines.pct +
        ` ${cfg.totalMeta.lines.covered}/${cfg.totalMeta.lines.total}\n`
    : '';
};

const renderUsedExports = (cfg: FileTreeNew) => {
  return cfg.usedExports ? `Used exports:\n${truncate(cfg.usedExports.join(', '), 30)}` : '';
};

const buildNodeText = (cfg: FileTreeNew) => {
  return (
    `${cfg.name} ${cfg.meta.lines.pct}%\n` +
    'Lines in file: ' +
    ` ${cfg.meta.lines.covered}/${cfg.meta.lines.total}\n` +
    renderLinesInTree(cfg) +
    renderUsedExports(cfg)
  );
};

type FileTreeCoverageProps = {
  data: GraphinTreeData;
  mode: Mode;
};

export const FileTreeCoverage = ({ data, mode }: FileTreeCoverageProps) => {
  const graphinRef = useRef();

  React.useEffect(() => {
    // Graph instance of g6
    // API interface provided by Graphin
    // @ts-expect-error
    const { graph, apis } = graphinRef.current;
    graph.render();
  }, [mode]);

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
      draw(cfg: FileTreeNew, group: any) {
        const keyshape = group.addShape('rect', {
          attrs: {
            id: 'circle-floor',
            x: 0,
            y: 0,
            radius: 5,
            width: 200,
            height: 75,
            fill: mode === 'coverageTree' ? getColorByCoverage(cfg.meta.lines.pct).back : 'blue',
          },
          draggable: true,
          name: 'circle-floor',
        });

        if (cfg.meta.lines.pct !== 0) {
          group.addShape('rect', {
            attrs: {
              id: 'circle-floor',
              x: 0,
              y: 0,
              radius: 5,
              width: (200 * cfg.meta.lines.pct) / 100,
              height: 75,
              fill:
                mode === 'coverageTree' ? getColorByCoverage(cfg.meta.lines.pct).main : '#823df4',
            },
            draggable: false,
            name: 'circle-floor',
          });
        }

        group.addShape('text', {
          attrs: {
            fontSize: 14,
            x: 10,
            y: 70,
            text: mode === 'coverageTree' ? buildNodeText(cfg) : cfg.name,
            fill: 'black',
          },
          draggable: true,
          name: 'text',
        });
        return keyshape;
      },
    },
    'single-node',
  );

  return (
    <Graphin
      // @ts-expect-error
      ref={graphinRef}
      data={data}
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
