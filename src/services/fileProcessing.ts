import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface FileProcessingConfig {
  delimiter?: string;
  encoding?: string;
  headers?: boolean;
}

export interface ProcessedData {
  data: any[];
  columns: Array<{
    key: string;
    header: string;
  }>;
  totalRows: number;
  error?: string;
}

export const processFile = async (
  file: File,
  config: FileProcessingConfig = {}
): Promise<ProcessedData> => {
  const { delimiter = ',', encoding = 'utf-8', headers = true } = config;

  try {
    if (file.name.endsWith('.csv')) {
      return await processCSV(file, { delimiter, encoding, headers });
    } else if (file.name.match(/\.xlsx?$/)) {
      return await processExcel(file, { headers });
    }
    throw new Error('Unsupported file format');
  } catch (error) {
    console.error('File processing error:', error);
    return {
      data: [],
      columns: [],
      totalRows: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const processCSV = (
  file: File,
  config: FileProcessingConfig
): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    console.log('Processing CSV file with config:', config);

    Papa.parse(file, {
      delimiter: config.delimiter,
      encoding: config.encoding,
      header: config.headers,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Papa Parse results:', {
          data: results.data.slice(0, 2), // Log first two rows
          errors: results.errors,
          meta: results.meta
        });

        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          reject(new Error(results.errors[0].message));
          return;
        }

        if (!results.data.length) {
          reject(new Error('No data found in CSV file'));
          return;
        }

        try {
          const firstRow = results.data[0] as Record<string, unknown>;
          console.log('First row data:', firstRow);

          const columns = config.headers
            ? Object.keys(firstRow).map(key => ({
                key,
                header: key
              }))
            : Object.keys(firstRow).map((_, index) => ({
                key: `col${index}`,
                header: `Column ${index + 1}`
              }));

          console.log('Generated columns:', columns);

          resolve({
            data: results.data,
            columns,
            totalRows: results.data.length
          });
        } catch (error) {
          console.error('Error processing CSV data:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error);
        reject(error);
      }
    });
  });
};

const processExcel = async (
  file: File,
  config: FileProcessingConfig
): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log('Processing Excel file with config:', config);

        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        console.log('Available sheets:', workbook.SheetNames);

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: config.headers ? undefined : 1,
          raw: false,
          defval: ''
        });

        console.log('First two rows of Excel data:', jsonData.slice(0, 2));

        if (!jsonData.length) {
          throw new Error('No data found in Excel file');
        }

        const firstRow = jsonData[0] as Record<string, unknown>;
        const columns = config.headers
          ? Object.keys(firstRow).map(key => ({
              key,
              header: key
            }))
          : Object.keys(firstRow).map((_, index) => ({
              key: `${index}`,
              header: `Column ${index + 1}`
            }));

        console.log('Generated columns:', columns);

        resolve({
          data: jsonData,
          columns,
          totalRows: jsonData.length
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      console.error('FileReader error:', reader.error);
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};
