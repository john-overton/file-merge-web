import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { SplitPanel } from '../components/layout/SplitPanel';
import { Card } from '../components/layout/Card';
import { MappingManager } from '../components/mapping/MappingManager';
import { ProcessedData } from '../services/fileProcessing';
import { useLocation, useNavigate } from 'react-router-dom';

interface Column {
  key: string;
  header: string;
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

  // Get the processed data from location state
  const sourceData = location.state?.processedData as ProcessedData;

  if (!sourceData) {
    // Redirect to import if no data is available
    navigate('/import');
    return null;
  }

  const handleMappingChange = (newMappings: Mapping[]) => {
    setMappings(newMappings);
    // TODO: Handle mapping changes, e.g., preview transformed data
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
            </div>
          </div>
        }
        workspace={
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text">Column Mapping</h2>
            <MappingManager
              sourceColumns={sourceData.columns}
              targetColumns={targetColumns}
              onMappingChange={handleMappingChange}
            />
          </div>
        }
        properties={
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
        }
      />
    </MainLayout>
  );
};
