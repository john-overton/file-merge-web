import { TransformationRule } from './dataTransformation';
import { DataType } from './dataTypeDetection';

export interface MappingConfig {
  source: {
    key: string;
    header: string;
    type?: DataType;
  };
  target: {
    key: string;
    header: string;
    type?: DataType;
  };
}

export interface ProjectConfig {
  id: string;
  name: string;
  description?: string;
  created: string;
  modified: string;
  mappings: MappingConfig[];
  transformationRules: Record<string, TransformationRule>;
  exportConfig?: {
    format: 'csv' | 'xlsx';
    includeHeaders: boolean;
    delimiter?: string;
    sheetName?: string;
  };
}

const STORAGE_KEY = 'file-merge-configs';

export const saveConfiguration = async (config: ProjectConfig): Promise<void> => {
  try {
    // Load existing configurations
    const existingConfigs = await loadAllConfigurations();
    
    // Update or add new configuration
    const configIndex = existingConfigs.findIndex(c => c.id === config.id);
    if (configIndex >= 0) {
      existingConfigs[configIndex] = {
        ...config,
        modified: new Date().toISOString()
      };
    } else {
      existingConfigs.push({
        ...config,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      });
    }

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingConfigs));

    // Log the save operation
    console.log(`Configuration saved: ${config.name} (${config.id})`);
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw new Error('Failed to save configuration');
  }
};

export const loadConfiguration = async (id: string): Promise<ProjectConfig | null> => {
  try {
    const configs = await loadAllConfigurations();
    const config = configs.find(c => c.id === id);
    
    if (!config) {
      console.warn(`Configuration not found: ${id}`);
      return null;
    }

    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw new Error('Failed to load configuration');
  }
};

export const loadAllConfigurations = async (): Promise<ProjectConfig[]> => {
  try {
    const configsJson = localStorage.getItem(STORAGE_KEY);
    if (!configsJson) {
      return [];
    }

    return JSON.parse(configsJson);
  } catch (error) {
    console.error('Error loading configurations:', error);
    throw new Error('Failed to load configurations');
  }
};

export const deleteConfiguration = async (id: string): Promise<void> => {
  try {
    const configs = await loadAllConfigurations();
    const updatedConfigs = configs.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
    
    console.log(`Configuration deleted: ${id}`);
  } catch (error) {
    console.error('Error deleting configuration:', error);
    throw new Error('Failed to delete configuration');
  }
};

export const createNewConfiguration = (
  name: string,
  description?: string
): ProjectConfig => {
  return {
    id: generateId(),
    name,
    description,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    mappings: [],
    transformationRules: {}
  };
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
