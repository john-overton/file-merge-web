# File Merge Web

A powerful web application for data transformation and file merging built with React, TypeScript, and Node.js. This tool allows users to import, transform, and export data with an intuitive interface and powerful mapping capabilities.

## Features

### File Import
- Support for CSV and Excel (XLSX) files
- Drag-and-drop file upload
- Automatic data type detection
- File preview with data grid
- Configurable import settings (delimiters, encoding)

### Data Mapping
- Visual column mapping interface
- Source and target column preview
- Automatic data type inference
- Real-time mapping preview
- Save and load mapping configurations

### Data Transformations
- Built-in data type conversions:
  - String operations
  - Number formatting
  - Date parsing and formatting
  - Boolean conversions
  - Email validation
  - Phone number formatting
- Custom transformation rules
- Validation with error handling
- Live preview of transformed data

### Export System
- Export to CSV or Excel (XLSX)
- Configurable export settings
- Preview before export
- Custom file naming
- Error handling and validation

### Project Management
- Save/load mapping configurations
- Project settings management
- Error logging and monitoring
- Configuration persistence

## Demo Data

The project includes sample data files in the `test-data` directory:
- `sample.csv`: A CSV file with common data types
- `sample.xlsx`: An Excel file with similar data

These files can be used to test the application's features:
1. Import functionality
2. Data type detection
3. Column mapping
4. Transformations
5. Export capabilities

## System Requirements

### Development Environment
- Node.js 16.x or higher
- npm 7.x or higher
- Git for version control
- Modern code editor (VS Code recommended)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Hardware Requirements
- Minimum 4GB RAM
- 1GB free disk space
- Modern CPU (2 cores recommended)

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/file-merge-web.git
cd file-merge-web
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Usage Guide

### Importing Files
1. Navigate to the File Import page
2. Drag and drop your CSV or Excel file
3. Configure import settings if needed
4. Preview the data and confirm import

### Mapping Columns
1. Select source and target columns
2. Click "Map Selected Columns" to create mapping
3. Configure any necessary transformations
4. Preview the transformed data

### Applying Transformations
1. Select a mapped column pair
2. Choose the desired transformation type
3. Configure transformation settings
4. Preview the results in real-time

### Exporting Data
1. Configure export settings
2. Choose the output format (CSV/XLSX)
3. Set file name and other options
4. Generate and download the export

### Managing Configurations
1. Save current mapping configuration
2. Load existing configurations
3. Modify and update configurations
4. Delete unused configurations

## Development

### Project Structure
\`\`\`
src/
  ├── components/        # React components
  │   ├── data/         # Data display components
  │   ├── export/       # Export related components
  │   ├── file/         # File handling components
  │   ├── layout/       # Layout components
  │   ├── mapping/      # Mapping interface components
  │   ├── project/      # Project management components
  │   └── ui/           # Common UI components
  ├── pages/            # Page components
  ├── services/         # Business logic and services
  └── assets/           # Static assets
\`\`\`

### Key Technologies
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Node.js
- XLSX.js for Excel handling
- Papa Parse for CSV processing

### Scripts
- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm run preview\`: Preview production build
- \`npm run lint\`: Run ESLint
- \`npm run type-check\`: Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Performance Considerations

### Large File Handling
- Streaming processing for large files
- Chunked data loading
- Memory-efficient transformations
- Background processing for heavy operations

### Optimization Features
- Lazy loading of components
- Virtual scrolling for large datasets
- Caching of transformation results
- Debounced preview updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Feature Details

### File Import Interface
- Modern drag-and-drop interface for file uploads
- Support for both CSV and Excel files
- File preview with pagination and sorting
- Configurable import settings:
  - CSV delimiter options
  - Character encoding selection
  - Header row detection
  - Sheet selection for Excel files

### Data Mapping Interface
- Side-by-side source and target column display
- Visual mapping creation with click-to-map
- Intelligent data type detection and suggestions
- Real-time preview of mapped data
- Support for complex transformations:
  - Data type conversions
  - Format standardization
  - Value mappings
  - Custom transformations

### Export Configuration
- Multiple export format options:
  - CSV with custom delimiters
  - Excel with sheet customization
- Configurable file naming with templates
- Header row customization
- Batch export capabilities
- Error handling and validation

### Project Management Features
- Save and load mapping configurations
- Project templates for common use cases
- Detailed error logging and reporting
- Configuration version control
- Import/export of project settings
