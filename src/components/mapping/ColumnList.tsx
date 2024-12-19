import React from 'react';
import { Card } from '../layout/Card';

import { DataType } from '../../services/dataTypeDetection';

interface Column {
  key: string;
  header: string;
  type?: DataType;
  confidence?: number;
}

interface ColumnListProps {
  title: string;
  columns: Column[];
  onColumnSelect?: (column: Column) => void;
  selectedColumn?: Column;
}

export const ColumnList: React.FC<ColumnListProps> = ({
  title,
  columns,
  onColumnSelect,
  selectedColumn
}) => {
  return (
    <Card>
      <h3 className="text-lg font-medium text-text mb-4">{title}</h3>
      <div className="space-y-2">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`
              p-3 rounded-md cursor-pointer transition-colors
              ${selectedColumn?.key === column.key
                ? 'bg-primary/10 border border-primary'
                : 'hover:bg-surface-secondary border border-border'}
            `}
            onClick={() => onColumnSelect?.(column)}
          >
            <div className="font-medium text-text">{column.header}</div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-text-secondary">Key: {column.key}</div>
              {column.type && (
                <div className="flex items-center space-x-2">
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${column.confidence && column.confidence > 0.8 
                      ? 'bg-success/10 text-success' 
                      : 'bg-primary/10 text-primary'}
                  `}>
                    {column.type}
                  </span>
                  {column.confidence && (
                    <span className="text-xs text-text-secondary">
                      {Math.round(column.confidence * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
