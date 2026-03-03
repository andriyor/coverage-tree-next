'use client';
import React, { useRef, useState } from 'react';
import Graphin, { Behaviors, Utils, Components, GraphinTreeData } from '@antv/graphin';

// import tree from "./tree.json";
// import myTree from "./my-tree.json";
// import myTreeSum from '../tree-data/my-tree-sum.json';

import { NodeMenu } from './NodeMenu';
import { SearchBar } from './SearchBar';
import { FileTreeNew, Mode } from '../types';

const { DragCanvas, ZoomCanvas, DragNode, TreeCollapse } = Behaviors;
const { ContextMenu } = Components;

// const dataTree = Utils.mock(20).tree().graphinTree();

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

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [matchingNodeIds, setMatchingNodeIds] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Search algorithm - BFS traversal
  const findMatchingNodes = React.useCallback(
    (tree: GraphinTreeData, term: string, caseSensitive: boolean): string[] => {
      if (!term) return [];

      const matches: string[] = [];
      const queue: FileTreeNew[] = [tree as FileTreeNew];
      const searchTerm = caseSensitive ? term : term.toLowerCase();

      while (queue.length > 0) {
        const node = queue.shift()!;
        const nodeName = caseSensitive ? node.name : node.name.toLowerCase();
        const nodePath = caseSensitive ? node.path : node.path.toLowerCase();

        // Search both name and path
        if (nodeName.includes(searchTerm) || nodePath.includes(searchTerm)) {
          matches.push(node.id);
        }

        if (node.children && node.children.length > 0) {
          queue.push(...node.children);
        }
      }

      return matches;
    },
    [],
  );

  // Execute search when searchTerm changes
  React.useEffect(() => {
    const matches = findMatchingNodes(data, searchTerm, caseSensitive);
    setMatchingNodeIds(matches);
    setCurrentMatchIndex(0);
  }, [searchTerm, data, caseSensitive, findMatchingNodes]);

  // Node highlighting effect
  React.useEffect(() => {
    if (!graphinRef.current) return;
    const graphinInstance: any = graphinRef.current;
    const { graph } = graphinInstance;
    if (!graph) return;

    // Get all nodes
    const nodes = graph.getNodes();

    if (!searchTerm || matchingNodeIds.length === 0) {
      // Reset all nodes to default opacity
      nodes.forEach((node: any) => {
        graph.updateItem(node, {
          style: {
            opacity: 1,
            stroke: undefined,
            lineWidth: undefined,
            shadowColor: undefined,
            shadowBlur: undefined,
          },
        });
      });
    } else {
      // Apply highlighting
      nodes.forEach((node: any) => {
        const nodeId = node.getID();
        const isMatch = matchingNodeIds.includes(nodeId);
        const isCurrent = isMatch && matchingNodeIds.indexOf(nodeId) === currentMatchIndex;

        if (!isMatch) {
          // Dim non-matching nodes
          graph.updateItem(node, {
            style: {
              opacity: 0.3,
              stroke: undefined,
              lineWidth: undefined,
              shadowColor: undefined,
              shadowBlur: undefined,
            },
          });
        } else if (isCurrent) {
          // Highlight current match with green border
          graph.updateItem(node, {
            style: {
              opacity: 1,
              stroke: '#00E676',
              lineWidth: 4,
              shadowColor: '#00E676',
              shadowBlur: 10,
            },
          });
        } else {
          // Highlight other matches with yellow (use lighter opacity for subtle effect)
          graph.updateItem(node, {
            style: {
              opacity: 1,
              stroke: '#FFEA00',
              lineWidth: 2,
              shadowColor: undefined,
              shadowBlur: undefined,
            },
          });
        }
      });
    }
  }, [searchTerm, matchingNodeIds, currentMatchIndex]);

  // Focus on current match with zoom
  React.useEffect(() => {
    if (!graphinRef.current) return;
    const graphinInstance: any = graphinRef.current;
    const { graph } = graphinInstance;
    if (!graph || matchingNodeIds.length === 0) return;

    const currentNodeId = matchingNodeIds[currentMatchIndex];
    if (!currentNodeId) return;

    const node = graph.findById(currentNodeId);
    if (node) {
      // Focus on the node with smooth animation
      graph.focusItem(node, true, {
        easing: 'easeCubic',
        duration: 500,
      });
    }
  }, [currentMatchIndex, matchingNodeIds]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchInput('');
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

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
            fill: mode === 'coverageTree' ? getColorByCoverage(cfg.meta.lines.pct).back : 'yellow',
          },
          draggable: true,
          name: 'circle-floor',
        });

        if (cfg?.meta?.lines?.pct && cfg.meta.lines.pct !== 0) {
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
    <div style={{ position: 'relative', height: '95vh' }}>
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => setSearchTerm(searchInput)}
        onClear={() => {
          setSearchInput('');
          setSearchTerm('');
        }}
        matchCount={matchingNodeIds.length}
        currentMatch={currentMatchIndex}
        onNext={() => setCurrentMatchIndex((prev) => (prev + 1) % matchingNodeIds.length)}
        onPrev={() =>
          setCurrentMatchIndex(
            (prev) => (prev - 1 + matchingNodeIds.length) % matchingNodeIds.length,
          )
        }
        caseSensitive={caseSensitive}
        onCaseSensitiveChange={setCaseSensitive}
      />
      <Graphin
        // @ts-expect-error
        ref={graphinRef}
        data={data}
        defaultNode={{ type: 'custom-node' }}
        layout={{
          type: 'dagre',
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
        <TreeCollapse trigger="click" />
        <ZoomCanvas enableOptimize />
        <DragNode />
        <DragCanvas />
        <ContextMenu style={{ background: '#fff' }} bindType="node">
          {(value) => <NodeMenu {...value} />}
        </ContextMenu>
      </Graphin>
    </div>
  );
};
