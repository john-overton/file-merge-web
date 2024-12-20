import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ExportConfig {
  format: 'csv' | 'xlsx';
  fileName: string;
  includeHeaders: boolean;
  delimiter?: string;
  encoding?: string;
  sheetName?: string;
}

export interface ExportResult {
  success: boolean;
  error?: string;
  blob?: Blob;
  fileName?: string;
}

export const exportData = async (
  data: any[],
  columns: Array<{ key: string; header: string }>,
  config: ExportConfig
): Promise<ExportResult> => {
  try {
    if (!data.length || !columns.length) {
      return {
        success: false,
        error: 'No data to export'
      };
    }

    switch (config.format) {
      case 'csv':
        return exportToCSV(data, columns, config);
      case 'xlsx':
        return exportToExcel(data, columns, config);
      default:
        return {
          success: false,
          error: 'Unsupported export format'
        };
    }
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed'
    };
  }
};

const exportToCSV = (
  data: any[],
  columns: Array<{ key: string; header: string }>,
  config: ExportConfig
): ExportResult => {
  try {
    // Prepare data for CSV
    const csvData = data.map(row =>
      columns.reduce((acc, col) => {
        acc[col.header] = row[col.key];
        return acc;
      }, {} as Record<string, any>)
    );

    // Generate CSV content
    const csvContent = Papa.unparse(csvData, {
      header: config.includeHeaders,
      delimiter: config.delimiter || ','
    });

    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${config.fileName}.csv`;

    return {
      success: true,
      blob,
      fileName
    };
  } catch (error) {
    console.error('CSV export error:', error);
    return {
      success: false,
      error: 'Failed to generate CSV file'
    };
  }
};

const exportToExcel = (
  data: any[],
  columns: Array<{ key: string; header: string }>,
  config: ExportConfig
): ExportResult => {
  try {
    // Prepare data for Excel
    const excelData = data.map(row =>
      columns.reduce((acc, col) => {
        acc[col.header] = row[col.key];
        return acc;
      }, {} as Record<string, any>)
    );

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      excelData,
      { header: config.includeHeaders ? columns.map(col => col.header) : undefined }
    );

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      config.sheetName || 'Sheet1'
    );

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Create blob
    const blob = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
    const fileName = `${config.fileName}.xlsx`;

    return {
      success: true,
      blob,
      fileName
    };
  } catch (error) {
    console.error('Excel export error:', error);
    return {
      success: false,
      error: 'Failed to generate Excel file'
    };
  }
};

export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
