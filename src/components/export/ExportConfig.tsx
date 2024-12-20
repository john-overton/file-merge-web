import React, { useState } from 'react';
import { Card } from '../layout/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ExportConfig as ExportConfigType } from '../../services/exportService';

interface ExportConfigProps {
  onExport: (config: ExportConfigType) => void;
  isExporting?: boolean;
}

export const ExportConfig: React.FC<ExportConfigProps> = ({
  onExport,
  isExporting = false
}) => {
  const [config, setConfig] = useState<ExportConfigType>({
    format: 'csv',
    fileName: 'exported-data',
    includeHeaders: true,
    delimiter: ',',
    sheetName: 'Sheet1'
  });

  const handleChange = (key: keyof ExportConfigType, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(config);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-text mb-4">Export Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Format"
            value={config.format}
            options={[
              { value: 'csv', label: 'CSV' },
              { value: 'xlsx', label: 'Excel (XLSX)' }
            ]}
            onChange={(e) => handleChange('format', e.target.value)}
          />

          <Input
            label="File Name"
            value={config.fileName}
            onChange={(e) => handleChange('fileName', e.target.value)}
            placeholder="exported-data"
          />
        </div>

        {config.format === 'csv' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Delimiter"
              value={config.delimiter}
              onChange={(e) => handleChange('delimiter', e.target.value)}
              placeholder=","
            />
          </div>
        )}

        {config.format === 'xlsx' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sheet Name"
              value={config.sheetName}
              onChange={(e) => handleChange('sheetName', e.target.value)}
              placeholder="Sheet1"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeHeaders"
            checked={config.includeHeaders}
            onChange={(e) => handleChange('includeHeaders', e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="includeHeaders" className="text-sm font-medium text-text">
            Include Headers
          </label>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
