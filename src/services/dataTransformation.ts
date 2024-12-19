import { DataType } from './dataTypeDetection';
import { convertValue, ConversionResult } from './dataConversion';

interface Column {
  key: string;
  header: string;
  type?: DataType;
  confidence?: number;
}

interface Mapping {
  source: Column;
  target: Column;
}

export interface TransformedData {
  data: any[];
  columns: Column[];
  error?: string;
}

export interface TransformationRule {
  sourceType: DataType;
  targetType: DataType;
  options?: Record<string, any>;
}

export const transformData = (
  sourceData: any[],
  mappings: Mapping[],
  transformationRules: Record<string, TransformationRule> = {}
): TransformedData => {
  try {
    // Create transformed data structure
    const transformedData = sourceData.map(row => {
      const newRow: Record<string, any> = {};
      mappings.forEach(mapping => {
        const sourceValue = row[mapping.source.key];
        const rule = transformationRules[mapping.target.key];
        
        if (rule) {
          // Apply transformation rule
          const result = convertValue(
            sourceValue,
            rule.sourceType,
            rule.targetType,
            rule.options
          );
          
          if (result.success) {
            newRow[mapping.target.key] = result.value;
          } else {
            console.warn(`Transformation failed for ${mapping.target.key}:`, result.error);
            newRow[mapping.target.key] = null;
          }
        } else {
          // No transformation rule, use direct mapping
          newRow[mapping.target.key] = sourceValue;
        }
      });
      return newRow;
    });

    // Create columns for the transformed data
    const columns = mappings.map(mapping => ({
      key: mapping.target.key,
      header: mapping.target.header,
      type: mapping.source.type,
      confidence: mapping.source.confidence
    }));

    return {
      data: transformedData,
      columns
    };
  } catch (error) {
    console.error('Error transforming data:', error);
    return {
      data: [],
      columns: [],
      error: error instanceof Error ? error.message : 'Error transforming data'
    };
  }
};

export const validateMapping = (
  mapping: Mapping,
  sourceData: any[]
): { isValid: boolean; error?: string } => {
  try {
    // Check if source column exists in data
    const sampleRow = sourceData[0];
    if (!sampleRow.hasOwnProperty(mapping.source.key)) {
      return {
        isValid: false,
        error: `Source column "${mapping.source.key}" not found in data`
      };
    }

    // Check if source and target types are compatible
    if (mapping.source.type && mapping.target.type && 
        !areTypesCompatible(mapping.source.type, mapping.target.type)) {
      return {
        isValid: false,
        error: `Incompatible types: ${mapping.source.type} cannot be mapped to ${mapping.target.type}`
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Error validating mapping'
    };
  }
};

const areTypesCompatible = (sourceType: DataType, targetType: DataType): boolean => {
  // Define type compatibility rules
  const compatibilityMap: Record<DataType, DataType[]> = {
    'string': ['string', 'email', 'phone'],
    'number': ['number', 'integer', 'string'],
    'integer': ['integer', 'number', 'string'],
    'boolean': ['boolean', 'string'],
    'date': ['date', 'string'],
    'email': ['email', 'string'],
    'phone': ['phone', 'string'],
    'unknown': ['string', 'number', 'integer', 'boolean', 'date', 'email', 'phone', 'unknown']
  };

  return compatibilityMap[sourceType]?.includes(targetType) || false;
};
