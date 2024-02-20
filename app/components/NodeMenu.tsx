'use client';
import { Menu } from 'antd';
import type { ContextMenuValue } from '@antv/graphin';
import type { MenuProps } from 'antd';

import { FileTreeNew } from '../types';

type ActionType = 'copy' | 'open';

const items: MenuProps['items'] = [
  {
    label: 'copy path',
    key: 'copy',
  },
  {
    label: 'open coverage',
    key: 'open',
  },
];

const handlers: Record<ActionType, (node: FileTreeNew) => void> = {
  copy: (node: FileTreeNew) => {
    navigator.clipboard.writeText(node.path);
  },
  open: (node: FileTreeNew) => {
    const coveragePath = node.path.replace('src/', '');
    window.open(`http://localhost:3000/${coveragePath}`, '_blank');
  },
};

export const NodeMenu = (value: ContextMenuValue) => {
  const node = value.item?._cfg?.model as FileTreeNew;

  const handleClick = (e: { key: string }) => {
    handlers[e.key as ActionType](node);
    value.onClose();
  };

  return <Menu style={{ minWidth: '150px', flex: 'auto' }} onClick={handleClick} items={items} />;
};
