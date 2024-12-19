import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  allowedTypes?: string[];
  maxFileSize?: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesAccepted,
  allowedTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => file.errors[0].message);
      setError(errors[0]);
      return;
    }

    setError(null);
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: maxFileSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        transition-colors cursor-pointer
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary'}
      `}
    >
      <input {...getInputProps()} />
      <p className="text-text-secondary">
        {isDragActive
          ? 'Drop the files here...'
          : 'Drop files here or click to upload'}
      </p>
      <p className="text-sm text-text-secondary mt-2">
        Supported formats: CSV, XLSX, XLS (max {Math.round(maxFileSize / 1024 / 1024)}MB)
      </p>
      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}
    </div>
  );
};
