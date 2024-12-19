import fs from 'fs';

const data = [
  ['First Name', 'Last Name', 'Email', 'Age', 'City'],
  ['John', 'Doe', 'john.doe@example.com', '30', 'New York'],
  ['Jane', 'Smith', 'jane.smith@example.com', '28', 'Los Angeles'],
  ['Bob', 'Johnson', 'bob.j@example.com', '35', 'Chicago'],
  ['Alice', 'Williams', 'alice.w@example.com', '25', 'Houston'],
  ['Mike', 'Brown', 'mike.b@example.com', '32', 'Phoenix']
];

const csvContent = data
  .map(row => row.map(cell => `"${cell}"`).join(','))
  .join('\n');

fs.writeFileSync('test-data/sample.csv', csvContent, 'utf8');
