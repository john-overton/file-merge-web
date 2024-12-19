export type DataType = 
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'email'
  | 'phone'
  | 'unknown';

interface TypeValidation {
  type: DataType;
  confidence: number;
  format?: string;
}

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]{7,}$/,
  date: [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}[-/]\d{2}[-/]\d{4}$/, // DD-MM-YYYY or MM/DD/YYYY
    /^\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}$/i, // 1 Jan 2024
  ]
};

const isValidDate = (value: string): boolean => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

const detectType = (value: string): TypeValidation[] => {
  const types: TypeValidation[] = [];

  // Handle empty values
  if (!value || value.trim() === '') {
    return [{ type: 'unknown', confidence: 1 }];
  }

  // Number detection
  const numberValue = Number(value);
  if (!isNaN(numberValue)) {
    if (Number.isInteger(numberValue)) {
      types.push({ type: 'integer', confidence: 0.9 });
    }
    types.push({ type: 'number', confidence: 0.8 });
  }

  // Boolean detection
  if (['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())) {
    types.push({ type: 'boolean', confidence: 0.9 });
  }

  // Date detection
  if (patterns.date.some(pattern => pattern.test(value)) && isValidDate(value)) {
    types.push({ 
      type: 'date',
      confidence: 0.8,
      format: detectDateFormat(value)
    });
  }

  // Email detection
  if (patterns.email.test(value)) {
    types.push({ type: 'email', confidence: 0.95 });
  }

  // Phone detection
  if (patterns.phone.test(value)) {
    types.push({ type: 'phone', confidence: 0.7 });
  }

  // String is always a fallback
  types.push({ type: 'string', confidence: 0.5 });

  return types.sort((a, b) => b.confidence - a.confidence);
};

const detectDateFormat = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'YYYY-MM-DD';
  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(value)) {
    return value.includes('/') ? 'MM/DD/YYYY' : 'DD-MM-YYYY';
  }
  if (/^\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}$/i.test(value)) {
    return 'D MMM YYYY';
  }
  return 'unknown';
};

export const detectColumnType = (values: string[]): TypeValidation => {
  // Skip empty values and get type predictions for each value
  const predictions = values
    .filter(value => value && value.trim() !== '')
    .map(value => detectType(value));

  // Count type occurrences and calculate confidence
  const typeCounts = new Map<DataType, { count: number, confidence: number }>();

  predictions.forEach(prediction => {
    const topType = prediction[0];
    const current = typeCounts.get(topType.type) || { count: 0, confidence: 0 };
    typeCounts.set(topType.type, {
      count: current.count + 1,
      confidence: current.confidence + topType.confidence
    });
  });

  // Find the most common type with highest confidence
  let bestType: DataType = 'unknown';
  let bestScore = 0;

  typeCounts.forEach((value, type) => {
    const score = (value.count / values.length) * (value.confidence / value.count);
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  });

  return {
    type: bestType,
    confidence: bestScore
  };
};
