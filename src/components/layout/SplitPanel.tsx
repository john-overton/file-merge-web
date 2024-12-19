import React from 'react';

interface SplitPanelProps {
  navigation: React.ReactNode;
  workspace: React.ReactNode;
  properties: React.ReactNode;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  navigation,
  workspace,
  properties,
}) => (
  <div className="grid grid-cols-12 gap-4">
    {/* Left Sidebar - 2 columns */}
    <div className="col-span-2 bg-white rounded-lg shadow-sm p-4">
      {navigation}
    </div>
    
    {/* Main Content - 7 columns */}
    <div className="col-span-7 bg-white rounded-lg shadow-sm p-4">
      {workspace}
    </div>
    
    {/* Right Panel - 3 columns */}
    <div className="col-span-3 bg-white rounded-lg shadow-sm p-4">
      {properties}
    </div>
  </div>
);
