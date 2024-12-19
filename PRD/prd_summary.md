# Node.js Data Transformation Tool Specification

## Technical Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Backend: Node.js with TypeScript
- File Processing: Node.js streams
- Database: SQLite (or optional PostgreSQL)

## UI Design System using Tailwind

### Color System
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
          light: '#B6D9FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F7FA',
        },
        text: {
          DEFAULT: '#4A4A4A',
          secondary: '#718096',
        },
        border: '#E5E9F2',
        success: '#4CAF50',
        error: '#FF6B6B',
      }
    }
  }
}
```

### Common Component Classes

#### Layout Components
```tsx
// Main Container
const MainLayout = () => (
  <div className="h-screen bg-surface-secondary">
    <div className="container mx-auto px-4 py-6">
      {/* Content */}
    </div>
  </div>
);

// Card Container
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-border p-6">
    {children}
  </div>
);

// Split Panel Layout
const SplitPanel = () => (
  <div className="grid grid-cols-12 gap-4">
    {/* Left Sidebar - 2 columns */}
    <div className="col-span-2 bg-white rounded-lg shadow-sm p-4">
      {/* Navigation */}
    </div>
    
    {/* Main Content - 7 columns */}
    <div className="col-span-7 bg-white rounded-lg shadow-sm p-4">
      {/* Workspace */}
    </div>
    
    {/* Right Panel - 3 columns */}
    <div className="col-span-3 bg-white rounded-lg shadow-sm p-4">
      {/* Properties */}
    </div>
  </div>
);
```

#### Interactive Elements
```tsx
// Primary Button
const Button = ({ children, disabled }) => (
  <button 
    className={`
      px-4 py-2 rounded-md font-medium
      ${disabled 
        ? 'bg-primary/50 cursor-not-allowed' 
        : 'bg-primary hover:bg-primary-hover text-white transition-colors'}
    `}
  >
    {children}
  </button>
);

// Input Field
const Input = ({ error }) => (
  <input 
    className={`
      w-full px-3 py-2 rounded-md border
      focus:ring-2 focus:ring-primary/20 focus:border-primary
      ${error ? 'border-error' : 'border-border'}
    `}
  />
);

// Dropdown
const Select = () => (
  <select className="
    w-full px-3 py-2 rounded-md border border-border
    focus:ring-2 focus:ring-primary/20 focus:border-primary
    bg-white
  ">
    {/* Options */}
  </select>
);
```

#### Data Display
```tsx
// Data Grid
const DataGrid = () => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-surface-secondary border-b border-border">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
            Header
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        <tr className="hover:bg-surface-secondary transition-colors">
          <td className="px-4 py-3 text-sm">
            Cell Content
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// File Drop Zone
const DropZone = () => (
  <div className="
    border-2 border-dashed border-border rounded-lg
    p-8 text-center hover:border-primary
    transition-colors cursor-pointer
  ">
    <p className="text-text-secondary">
      Drop files here or click to upload
    </p>
  </div>
);
```

### Feature Components

#### File Import Manager
```tsx
interface FileImportConfig {
  allowedTypes: ['csv', 'xlsx'];
  maxFileSize: number;
  parseOptions: {
    delimiter: string;
    encoding: string;
    headers: boolean;
  };
}

const FileImporter = ({ config }: { config: FileImportConfig }) => (
  <Card>
    <div className="space-y-4">
      <DropZone />
      <div className="bg-surface-secondary rounded-md p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text">example.csv</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-success">Ready</span>
            <Button>Import</Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);
```

#### Data Mapping Interface
```tsx
const DataMapper = () => (
  <div className="grid grid-cols-2 gap-6">
    <Card>
      <h3 className="text-lg font-medium mb-4">Source Fields</h3>
      {/* Source fields list */}
    </Card>
    <Card>
      <h3 className="text-lg font-medium mb-4">Target Fields</h3>
      {/* Target fields list */}
    </Card>
  </div>
);
```

#### Export Configuration
```tsx
const ExportConfig = () => (
  <Card>
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Export Settings</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Output Format</label>
        <Select />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-text">File Name Template</label>
        <Input />
      </div>
      <Button>Generate Export</Button>
    </div>
  </Card>
);
```

## Implementation Notes

### Performance Optimizations
- Use `react-window` or `react-virtualized` for large data sets
- Implement chunked file processing using Node.js streams
- Use Web Workers for heavy computations
- Implement request debouncing and throttling

### Error Handling
- Toast notifications using `react-hot-toast`
- Inline form validation
- Error boundaries for component isolation
- Detailed error logging

### Testing Strategy
- Unit tests with Jest and React Testing Library
- E2E tests with Cypress
- Visual regression testing with Storybook

### Build & Deployment
- Vite for development and building
- Electron for desktop packaging
- Auto-update mechanism using electron-updater
- Error tracking integration