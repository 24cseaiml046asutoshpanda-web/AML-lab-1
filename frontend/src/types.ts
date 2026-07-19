export type RegressionMode = 'single' | 'multi';

export interface DataPoint {
  id: string;
  x: string[]; // SLR will have length 1, MLR will have length equal to numFeatures
  y: string;
}

export interface RegressionMetrics {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
}

export interface RegressionResponse {
  slope?: number;
  coefficients?: number[];
  intercept: number;
  predictions: number[];
  metrics: RegressionMetrics;
}

