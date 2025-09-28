// 数据点类型
export interface DataPoint {
  x: number;
  y?: number;
}

// 文件上传选项
export interface FileUploadOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  column?: string;
}

// 分布参数
export interface DistributionParams {
  type: 'normal' | 'binomial' | 'poisson' | 'exponential' | 'uniform';
  parameters: {
    mean?: number;
    stdDev?: number;
    trials?: number;
    probability?: number;
    lambda?: number;
    rate?: number;
    min?: number;
    max?: number;
    sampleSize: number;
  };
}

// AI生成数据选项
export interface AIDataGenerationOptions {
  description: string;
  sampleSize: number;
  dataType?: 'numerical' | 'categorical' | 'timeSeries';
}

// 数据分析结果
export interface AnalysisResult {
  basicStats?: {
    mean: number;
    median: number;
    mode: number;
    variance: number;
    standardDeviation: number;
    min: number;
    max: number;
    range: number;
    skewness: number;
    kurtosis: number;
  };
  mleResults?: Record<string, number>;
  momResults?: Record<string, number>;
}

// 数据输入方法类型
export type DataInputMethod = 'file' | 'distribution' | 'ai';