import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface DataGridProps {
  data: any[];
  columns: Array<{
    key: string;
    header: string;
  }>;
  height?: number;
  rowHeight?: number;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  height = 400,
  rowHeight = 35,
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div 
      className={`
        flex divide-x divide-border
        ${index === 0 
          ? 'bg-surface-secondary font-medium' 
          : 'hover:bg-surface-secondary transition-colors'}
      `}
      style={style}
    >
      {columns.map(column => (
        <div 
          key={column.key}
          className="flex-1 px-4 py-2 truncate"
          title={String(data[index]?.[column.key])}
        >
          {String(data[index]?.[column.key])}
        </div>
      ))}
    </div>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex divide-x divide-border bg-surface-secondary border-b border-border">
        {columns.map(column => (
          <div key={column.key} className="flex-1 px-4 py-3 font-medium">
            {column.header}
          </div>
        ))}
      </div>

      {/* Data rows */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};
