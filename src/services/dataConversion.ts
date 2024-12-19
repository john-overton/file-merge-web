import { DataType } from './dataTypeDetection';

export interface ConversionResult {
  value: any;
  success: boolean;
  error?: string;
}

interface DateFormat {
  pattern: RegExp;
  format: string;
}

const dateFormats: DateFormat[] = [
  { pattern: /^\d{4}-\d{2}-\d{2}$/, format: 'YYYY-MM-DD' },
  { pattern: /^\d{2}[-/]\d{2}[-/]\d{4}$/, format: 'DD/MM/YYYY' },
  { pattern: /^\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}$/i, format: 'D MMM YYYY' }
];

export const convertValue = (
  value: any,
  sourceType: DataType,
  targetType: DataType,
  options: Record<string, any> = {}
): ConversionResult => {
  try {
    // Handle null/undefined values
    if (value === null || value === undefined || value === '') {
      return { value: null, success: true };
    }

    // Convert to string first if source is not already string
    let stringValue = sourceType !== 'string' ? String(value) : value;

    switch (targetType) {
      case 'string':
        return { value: stringValue, success: true };

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          return {
            value: null,
            success: false,
            error: 'Invalid number format'
          };
        }
        return { value: num, success: true };

      case 'integer':
        const int = parseInt(value, 10);
        if (isNaN(int)) {
          return {
            value: null,
            success: false,
            error: 'Invalid integer format'
          };
        }
        return { value: int, success: true };

      case 'boolean':
        return convertToBoolean(stringValue);

      case 'date':
        return convertToDate(stringValue, options.format);

      case 'email':
        return validateAndFormatEmail(stringValue);

      case 'phone':
        return formatPhoneNumber(stringValue, options.countryCode);

      default:
        return {
          value: stringValue,
          success: true
        };
    }
  } catch (error) {
    return {
      value: null,
      success: false,
      error: error instanceof Error ? error.message : 'Conversion error'
    };
  }
};

const convertToBoolean = (value: string): ConversionResult => {
  const trueValues = ['true', '1', 'yes', 'y'];
  const falseValues = ['false', '0', 'no', 'n'];
  
  const normalizedValue = value.toLowerCase().trim();
  
  if (trueValues.includes(normalizedValue)) {
    return { value: true, success: true };
  }
  
  if (falseValues.includes(normalizedValue)) {
    return { value: false, success: true };
  }
  
  return {
    value: null,
    success: false,
    error: 'Invalid boolean value'
  };
};

const convertToDate = (value: string, targetFormat?: string): ConversionResult => {
  // Try parsing the date
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    // Format the date according to the target format if specified
    if (targetFormat) {
      try {
        // Here you would use a date formatting library like date-fns
        // For now, we'll just use ISO string
        return { value: date.toISOString(), success: true };
      } catch (error) {
        return {
          value: null,
          success: false,
          error: 'Invalid date format'
        };
      }
    }
    return { value: date.toISOString(), success: true };
  }

  return {
    value: null,
    success: false,
    error: 'Invalid date value'
  };
};

const validateAndFormatEmail = (value: string): ConversionResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = value.trim().toLowerCase();
  
  if (emailRegex.test(normalizedEmail)) {
    return { value: normalizedEmail, success: true };
  }
  
  return {
    value: null,
    success: false,
    error: 'Invalid email format'
  };
};

const formatPhoneNumber = (value: string, countryCode?: string): ConversionResult => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Basic validation for minimum length
  if (digits.length < 7) {
    return {
      value: null,
      success: false,
      error: 'Phone number too short'
    };
  }
  
  // Format the number (this is a simple example - you might want to use a library like libphonenumber-js)
  let formattedNumber = digits;
  if (countryCode) {
    formattedNumber = `+${countryCode}${digits}`;
  }
  
  return { value: formattedNumber, success: true };
};
