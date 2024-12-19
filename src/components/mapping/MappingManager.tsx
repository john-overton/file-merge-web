import React, { useState } from 'react';
import { ColumnList } from './ColumnList';
import { Button } from '../ui/Button';
import { Card } from '../layout/Card';

interface Column {
  key: string;
  header: string;
}

interface Mapping {
  source: Column;
  target: Column;
}

interface MappingManagerProps {
  sourceColumns: Column[];
  targetColumns: Column[];
  onMappingChange: (mappings: Mapping[]) => void;
  onMappingSelect?: (mapping: Mapping) => void;
  selectedMapping?: Mapping | null;
}

export const MappingManager: React.FC<MappingManagerProps> = ({
  sourceColumns,
  targetColumns,
  onMappingChange,
  onMappingSelect,
  selectedMapping,
}) => {
  const [selectedSource, setSelectedSource] = useState<Column | undefined>(undefined);
  const [selectedTarget, setSelectedTarget] = useState<Column | undefined>(undefined);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const handleAddMapping = () => {
    if (selectedSource && selectedTarget) {
      const newMapping = { source: selectedSource, target: selectedTarget };
      const updatedMappings = [...mappings, newMapping];
      setMappings(updatedMappings);
      onMappingChange(updatedMappings);
      setSelectedSource(undefined);
      setSelectedTarget(undefined);
    }
  };

  const handleRemoveMapping = (index: number) => {
    const updatedMappings = mappings.filter((_, i) => i !== index);
    setMappings(updatedMappings);
    onMappingChange(updatedMappings);
  };

  const isColumnMapped = (column: Column, type: 'source' | 'target') => {
    return mappings.some(mapping => 
      type === 'source' 
        ? mapping.source.key === column.key 
        : mapping.target.key === column.key
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <ColumnList
          title="Source Columns"
          columns={sourceColumns}
          onColumnSelect={setSelectedSource}
          selectedColumn={selectedSource}
        />
        <ColumnList
          title="Target Columns"
          columns={targetColumns}
          onColumnSelect={setSelectedTarget}
          selectedColumn={selectedTarget}
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleAddMapping}
          disabled={!selectedSource || !selectedTarget}
        >
          Map Selected Columns
        </Button>
      </div>

      {mappings.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-text mb-4">Current Mappings</h3>
          <div className="space-y-2">
            {mappings.map((mapping, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-3 border rounded-md cursor-pointer
                  ${selectedMapping?.source.key === mapping.source.key && selectedMapping?.target.key === mapping.target.key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'}
                `}
                onClick={() => onMappingSelect?.(mapping)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{mapping.source.header}</div>
                    <div className="text-sm text-text-secondary">Source</div>
                  </div>
                  <div className="text-text-secondary">→</div>
                  <div>
                    <div className="font-medium">{mapping.target.header}</div>
                    <div className="text-sm text-text-secondary">Target</div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveMapping(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
