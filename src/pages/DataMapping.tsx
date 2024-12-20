import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { SplitPanel } from '../components/layout/SplitPanel';
import { Card } from '../components/layout/Card';
import { MappingManager } from '../components/mapping/MappingManager';
import { ProcessedData } from '../services/fileProcessing';
import { useLocation, useNavigate } from 'react-router-dom';
import { transformData, TransformedData, TransformationRule } from '../services/dataTransformation';
import { TransformationRuleEditor } from '../components/mapping/TransformationRuleEditor';
import { DataGrid } from '../components/data/DataGrid';
import { toast } from 'react-hot-toast';
import { ExportConfig } from '../components/export/ExportConfig';
import { exportData, downloadFile, ExportConfig as ExportConfigType } from '../services/exportService';
import { ConfigurationManager } from '../components/project/ConfigurationManager';
import { ProjectConfig, saveConfiguration } from '../services/configurationService';

import { DataType } from '../services/dataTypeDetection';

interface Column {
  key: string;
  header: string;
  type?: DataType;
}

interface Mapping {
  source: Column;
  target: Column;
}

// Sample target schema
const targetColumns: Column[] = [
  { key: 'firstName', header: 'First Name' },
  { key: 'lastName', header: 'Last Name' },
  { key: 'emailAddress', header: 'Email Address' },
  { key: 'age', header: 'Age' },
  { key: 'location', header: 'Location' },
];

export const DataMapping: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [transformationRules, setTransformationRules] = useState<Record<string, TransformationRule>>({});
  const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(null);
  const [transformedData, setTransformedData] = useState<TransformedData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ProjectConfig>();

  // Get the processed data from location state
  const sourceData = location.state?.processedData as ProcessedData;

  if (!sourceData) {
    // Redirect to import if no data is available
    navigate('/import');
    return null;
  }

  useEffect(() => {
    if (mappings.length > 0 && sourceData) {
      const result = transformData(sourceData.data, mappings, transformationRules);
      if (result.error) {
        toast.error(result.error);
      } else {
        setTransformedData(result);
      }
    } else {
      setTransformedData(null);
    }
  }, [mappings, transformationRules, sourceData]);

  const handleMappingChange = (newMappings: Mapping[]) => {
    setMappings(newMappings);
    // Clear selected mapping when mappings change
    setSelectedMapping(null);
  };

  const handleTransformationChange = (rule: TransformationRule) => {
    if (selectedMapping) {
      setTransformationRules(prev => ({
        ...prev,
        [selectedMapping.target.key]: rule
      }));
    }
  };

  const handleMappingSelect = (mapping: Mapping) => {
    setSelectedMapping(mapping);
  };

  const handleExport = async (config: ExportConfigType) => {
    if (!transformedData) return;

    setIsExporting(true);
    try {
      const result = await exportData(
        transformedData.data,
        transformedData.columns,
        config
      );

      if (!result.success || !result.blob || !result.fileName) {
        throw new Error(result.error || 'Export failed');
      }

      downloadFile(result.blob, result.fileName);
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfigSave = async (config: ProjectConfig) => {
    const configToSave = {
      ...config,
      mappings: mappings.map(mapping => ({
        source: {
          key: mapping.source.key,
          header: mapping.source.header,
          type: mapping.source.type
        },
        target: {
          key: mapping.target.key,
          header: mapping.target.header,
          type: mapping.target.type
        }
      })),
      transformationRules
    };

    try {
      await saveConfiguration(configToSave);
      setCurrentConfig(configToSave);
    } catch (error) {
      throw error;
    }
  };

  const handleConfigLoad = (config: ProjectConfig) => {
    try {
      // Convert saved mappings back to the correct format
      const loadedMappings = config.mappings.map(mapping => ({
        source: {
          key: mapping.source.key,
          header: mapping.source.header,
          type: mapping.source.type
        },
        target: {
          key: mapping.target.key,
          header: mapping.target.header,
          type: mapping.target.type
        }
      }));

      setMappings(loadedMappings);
      setTransformationRules(config.transformationRules);
      setCurrentConfig(config);
      toast.success('Configuration loaded successfully');
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration');
    }
  };

  return (
    <MainLayout>
      <SplitPanel
        navigation={
          <div>
            <h2 className="text-lg font-medium text-text mb-4">File Details</h2>
            <div className="text-sm text-text-secondary">
              <p>Total Rows: {sourceData.totalRows}</p>
              <p>Columns: {sourceData.columns.length}</p>
              <div className="mt-6 space-y-6">
                {transformedData && transformedData.data.length > 0 && (
                  <ExportConfig
                    onExport={handleExport}
                    isExporting={isExporting}
                  />
                )}
                <ConfigurationManager
                  currentConfig={currentConfig}
                  onConfigLoad={handleConfigLoad}
                  onConfigSave={handleConfigSave}
                />
              </div>
            </div>
          </div>
        }
        workspace={
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text">Column Mapping</h2>
            <MappingManager
              sourceColumns={sourceData.columns}
              targetColumns={targetColumns}
              mappings={mappings}
              onMappingChange={handleMappingChange}
              onMappingSelect={handleMappingSelect}
              selectedMapping={selectedMapping}
            />
            {transformedData && transformedData.data.length > 0 && (
              <Card>
                <h3 className="text-lg font-medium text-text mb-4">Preview</h3>
                <DataGrid
                  data={transformedData.data.slice(0, 5)} // Show first 5 rows
                  columns={transformedData.columns}
                  height={300}
                />
                <p className="text-sm text-text-secondary mt-2">
                  Showing preview of first 5 rows
                </p>
              </Card>
            )}
          </div>
        }
        properties={
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-text mb-4">Mapping Summary</h2>
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">
                  Mapped: {mappings.length} of {Math.min(sourceData.columns.length, targetColumns.length)}
                </p>
                <p className="text-sm text-text-secondary">
                  Unmapped Source: {sourceData.columns.length - mappings.length}
                </p>
                <p className="text-sm text-text-secondary">
                  Unmapped Target: {targetColumns.length - mappings.length}
                </p>
              </div>
            </div>

            {selectedMapping && (
              <TransformationRuleEditor
                sourceColumn={selectedMapping.source}
                targetColumn={selectedMapping.target}
                rule={transformationRules[selectedMapping.target.key]}
                onChange={handleTransformationChange}
              />
            )}
          </div>
        }
      />
    </MainLayout>
  );
};
