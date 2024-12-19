import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="h-screen bg-surface-secondary">
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  </div>
);
