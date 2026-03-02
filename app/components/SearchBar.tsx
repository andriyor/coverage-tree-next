'use client';
import React from 'react';
import { Input, Button, Space, Checkbox } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  matchCount: number;
  currentMatch: number;
  onNext: () => void;
  onPrev: () => void;
  caseSensitive: boolean;
  onCaseSensitiveChange: (checked: boolean) => void;
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  matchCount,
  currentMatch,
  onNext,
  onPrev,
  caseSensitive,
  onCaseSensitiveChange,
}: SearchBarProps) => {
  const hasMatches = matchCount > 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        minWidth: 380,
      }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Search by node name or path..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPressEnter={onSearch}
            prefix={<SearchOutlined />}
            allowClear
            onClear={onClear}
            style={{ flex: 1 }}
          />
          {value && (
            <Button icon={<CloseOutlined />} onClick={onClear} title="Clear search" />
          )}
        </Space.Compact>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Checkbox checked={caseSensitive} onChange={(e) => onCaseSensitiveChange(e.target.checked)}>
            Case sensitive
          </Checkbox>

          {value && (
            <Space>
              <span style={{ fontSize: 12, color: '#666' }}>
                {hasMatches ? `${currentMatch + 1} of ${matchCount}` : 'No matches'}
              </span>
              <Button
                size="small"
                icon={<LeftOutlined />}
                onClick={onPrev}
                disabled={!hasMatches}
                title="Previous match"
              />
              <Button
                size="small"
                icon={<RightOutlined />}
                onClick={onNext}
                disabled={!hasMatches}
                title="Next match"
              />
            </Space>
          )}
        </Space>
      </Space>
    </div>
  );
};
