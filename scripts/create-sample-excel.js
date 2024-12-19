import * as XLSX from 'xlsx';

const data = [
  ['First Name', 'Last Name', 'Email', 'Age', 'City'],
  ['John', 'Doe', 'john.doe@example.com', 30, 'New York'],
  ['Jane', 'Smith', 'jane.smith@example.com', 28, 'Los Angeles'],
  ['Bob', 'Johnson', 'bob.j@example.com', 35, 'Chicago'],
  ['Alice', 'Williams', 'alice.w@example.com', 25, 'Houston'],
  ['Mike', 'Brown', 'mike.b@example.com', 32, 'Phoenix']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sample Data');
XLSX.writeFile(wb, 'test-data/sample.xlsx');
