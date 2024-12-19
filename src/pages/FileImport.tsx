import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/layout/Card';
import { DropZone } from '../components/file/DropZone';
import { DataGrid } from '../components/data/DataGrid';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { processFile, ProcessedData, FileProcessingConfig } from '../services/fileProcessing';
import { toast } from 'react-hot-toast';

export const FileImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [config, setConfig] = useState<FileProcessingConfig>({
    delimiter: ',',
    encoding: 'utf-8',
    headers: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    await processSelectedFile(selectedFile);
  };

  const processSelectedFile = async (selectedFile: File) => {
    setIsProcessing(true);
    try {
      const result = await processFile(selectedFile, config);
      if (result.error) {
        toast.error(result.error);
      } else {
        setProcessedData(result);
        toast.success('File processed successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <h1 className="text-2xl font-bold text-text mb-6">Import Files</h1>
          <DropZone onFilesAccepted={handleFilesAccepted} />
        </Card>

        {file && (
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-text">File Configuration</h2>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Delimiter"
                  value={config.delimiter}
                  onChange={(e) => setConfig({ ...config, delimiter: e.target.value })}
                  disabled={isProcessing}
                />
                <Select
                  label="Encoding"
                  value={config.encoding}
                  options={[
                    { value: 'utf-8', label: 'UTF-8' },
                    { value: 'ascii', label: 'ASCII' },
                    { value: 'utf-16', label: 'UTF-16' },
                  ]}
                  onChange={(e) => setConfig({ ...config, encoding: e.target.value })}
                  disabled={isProcessing}
                />
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.headers}
                      onChange={(e) => setConfig({ ...config, headers: e.target.checked })}
                      disabled={isProcessing}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text">Has Headers</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => file && processSelectedFile(file)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Process File'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {processedData && processedData.data.length > 0 && (
          <Card>
            <h2 className="text-lg font-medium text-text mb-4">Preview</h2>
            <DataGrid
              data={processedData.data}
              columns={processedData.columns}
              height={400}
            />
            <p className="text-sm text-text-secondary mt-2">
              Total rows: {processedData.totalRows}
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
