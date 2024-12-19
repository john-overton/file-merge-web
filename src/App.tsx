import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FileImport } from './pages/FileImport';
import { DataMapping } from './pages/DataMapping';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/import" element={<FileImport />} />
        <Route path="/mapping" element={<DataMapping />} />
        <Route path="/" element={<Navigate to="/import" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
};

export default App;
