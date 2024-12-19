import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { SplitPanel } from '../components/layout/SplitPanel';
import { Card } from '../components/layout/Card';

export const DataMapping: React.FC = () => {
  return (
    <MainLayout>
      <SplitPanel
        navigation={
          <div>
            <h2 className="text-lg font-medium text-text mb-4">Navigation</h2>
            {/* Navigation content will be implemented here */}
          </div>
        }
        workspace={
          <div>
            <h2 className="text-lg font-medium text-text mb-4">Mapping Workspace</h2>
            {/* Mapping workspace content will be implemented here */}
          </div>
        }
        properties={
          <div>
            <h2 className="text-lg font-medium text-text mb-4">Properties</h2>
            {/* Properties content will be implemented here */}
          </div>
        }
      />
    </MainLayout>
  );
};
