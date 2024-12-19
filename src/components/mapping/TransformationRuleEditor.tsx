import React from 'react';
import { DataType } from '../../services/dataTypeDetection';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../layout/Card';

interface TransformationRule {
  sourceType: DataType;
  targetType: DataType;
  options?: Record<string, any>;
}

interface TransformationRuleEditorProps {
  sourceColumn: {
    key: string;
    header: string;
    type?: DataType;
  };
  targetColumn: {
    key: string;
    header: string;
    type?: DataType;
  };
  rule?: TransformationRule;
  onChange: (rule: TransformationRule) => void;
}

const availableTypes: DataType[] = [
  'string',
  'number',
  'integer',
  'boolean',
  'date',
  'email',
  'phone'
];

export const TransformationRuleEditor: React.FC<TransformationRuleEditorProps> = ({
  sourceColumn,
  targetColumn,
  rule,
  onChange
}) => {
  const handleTypeChange = (type: DataType) => {
    onChange({
      sourceType: sourceColumn.type || 'string',
      targetType: type,
      options: getDefaultOptions(type)
    });
  };

  const handleOptionChange = (key: string, value: any) => {
    onChange({
      ...rule!,
      options: {
        ...rule?.options,
        [key]: value
      }
    });
  };

  const getDefaultOptions = (type: DataType): Record<string, any> => {
    switch (type) {
      case 'date':
        return { format: 'YYYY-MM-DD' };
      case 'phone':
        return { countryCode: '1' }; // Default to US
      default:
        return {};
    }
  };

  const renderOptions = () => {
    if (!rule) return null;

    switch (rule.targetType) {
      case 'date':
        return (
          <div className="mt-4">
            <Select
              label="Date Format"
              value={rule.options?.format || 'YYYY-MM-DD'}
              options={[
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'D MMM YYYY', label: 'D MMM YYYY' }
              ]}
              onChange={(e) => handleOptionChange('format', e.target.value)}
            />
          </div>
        );

      case 'phone':
        return (
          <div className="mt-4">
            <Input
              label="Country Code"
              type="text"
              value={rule.options?.countryCode || '1'}
              onChange={(e) => handleOptionChange('countryCode', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text">Transform {sourceColumn.header}</h3>
            <p className="text-sm text-text-secondary">
              Current type: {sourceColumn.type || 'unknown'}
            </p>
          </div>
          <div className="text-text-secondary">→</div>
          <div>
            <h3 className="font-medium text-text">{targetColumn.header}</h3>
            <p className="text-sm text-text-secondary">
              Target type: {targetColumn.type || 'unknown'}
            </p>
          </div>
        </div>

        <div>
          <Select
            label="Convert To"
            value={rule?.targetType || (targetColumn.type || 'string')}
            options={availableTypes.map(type => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1)
            }))}
            onChange={(e) => handleTypeChange(e.target.value as DataType)}
          />
        </div>

        {renderOptions()}
      </div>
    </Card>
  );
};
