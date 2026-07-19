import { useState, useEffect } from 'react';
import type { DataPoint, RegressionResponse, RegressionMode } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useRegression() {
  const [regressionMode, setRegressionMode] = useState<RegressionMode>('single');
  const [numFeatures, setNumFeatures] = useState<number>(2);

  // Canonical table data points state
  const [points, setPoints] = useState<DataPoint[]>([
    { id: '1', x: ['1.0'], y: '2.1' },
    { id: '2', x: ['2.0'], y: '3.8' },
    { id: '3', x: ['3.0'], y: '6.2' },
    { id: '4', x: ['4.0'], y: '8.1' },
    { id: '5', x: ['5.0'], y: '9.9' }
  ]);

  // API State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [regressionResult, setRegressionResult] = useState<RegressionResponse | null>(null);

  // Resize feature dimensions when mode or feature count changes
  useEffect(() => {
    const targetLength = regressionMode === 'single' ? 1 : numFeatures;
    setPoints(prevPoints =>
      prevPoints.map(p => {
        const newX = [...p.x];
        if (newX.length < targetLength) {
          while (newX.length < targetLength) {
            newX.push('');
          }
        } else if (newX.length > targetLength) {
          newX.splice(targetLength);
        }
        return { ...p, x: newX };
      })
    );
    // Clear previous results to avoid mismatched dimensions in the UI
    setRegressionResult(null);
  }, [regressionMode, numFeatures]);

  // Table Row Modifiers
  const handleAddRow = () => {
    const targetLength = regressionMode === 'single' ? 1 : numFeatures;
    setPoints([...points, { id: String(Date.now()), x: Array(targetLength).fill(''), y: '' }]);
  };

  const handleRemoveRow = (id: string) => {
    const minRequired = regressionMode === 'single' ? 2 : numFeatures + 1;
    if (points.length <= minRequired) {
      setError(`You need at least ${minRequired} rows for ${regressionMode === 'single' ? 'single' : 'multiple'} regression.`);
      return;
    }
    setPoints(points.filter(p => p.id !== id));
  };

  const handleCellChange = (id: string, field: 'x' | 'y', value: string, featureIndex?: number) => {
    setPoints(points.map(p => {
      if (p.id !== id) return p;
      if (field === 'y') return { ...p, y: value };
      
      const newX = [...p.x];
      const index = featureIndex ?? 0;
      newX[index] = value;
      return { ...p, x: newX };
    }));
  };

  // Clear data
  const handleClearData = () => {
    const targetLength = regressionMode === 'single' ? 1 : numFeatures;
    setPoints([
      { id: '1', x: Array(targetLength).fill(''), y: '' },
      { id: '2', x: Array(targetLength).fill(''), y: '' }
    ]);
    setRegressionResult(null);
    setError(null);
  };

  // Run Regression Analysis
  const runRegression = async () => {
    setLoading(true);
    setError(null);

    // Parse and validate table points
    const activePoints = points.filter(p => {
      const isXComplete = p.x.every(val => val.trim() !== '');
      const isYComplete = p.y.trim() !== '';
      return isXComplete && isYComplete;
    });

    const minRequired = regressionMode === 'single' ? 2 : numFeatures + 1;
    if (activePoints.length < minRequired) {
      setError(`You must enter at least ${minRequired} complete data points.`);
      setLoading(false);
      return;
    }

    const yNums: number[] = [];
    for (let i = 0; i < activePoints.length; i++) {
      const py = parseFloat(activePoints[i].y);
      if (isNaN(py)) {
        setError(`Invalid numeric value at row ${i + 1} for Y.`);
        setLoading(false);
        return;
      }
      yNums.push(py);
    }

    let xPayload: any;
    if (regressionMode === 'single') {
      const xNums: number[] = [];
      for (let i = 0; i < activePoints.length; i++) {
        const px = parseFloat(activePoints[i].x[0]);
        if (isNaN(px)) {
          setError(`Invalid numeric value at row ${i + 1} for X.`);
          setLoading(false);
          return;
        }
        xNums.push(px);
      }
      xPayload = xNums;
    } else {
      const xNumsMulti: number[][] = [];
      for (let i = 0; i < activePoints.length; i++) {
        const rowX: number[] = [];
        for (let j = 0; j < numFeatures; j++) {
          const px = parseFloat(activePoints[i].x[j]);
          if (isNaN(px)) {
            setError(`Invalid numeric value at row ${i + 1} for X${j + 1}.`);
            setLoading(false);
            return;
          }
          rowX.push(px);
        }
        xNumsMulti.push(rowX);
      }
      xPayload = xNumsMulti;
    }

    try {
      const endpoint = regressionMode === 'single' ? '/api/linear-regression' : '/api/multi-linear-regression';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x: xPayload, y: yNums }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to calculate regression metrics on the backend.");
      }

      const data: RegressionResponse = await response.json();
      setRegressionResult(data);
    } catch (err: any) {
      setError(err.message || "Could not connect to the backend server. Make sure the backend is running.");
      setRegressionResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Compile data for plotting
  const getChartData = () => {
    const activePoints = points.filter(p => {
      const isXComplete = p.x.every(val => val.trim() !== '');
      const isYComplete = p.y.trim() !== '';
      return isXComplete && isYComplete;
    });

    return activePoints.map((p, idx) => {
      const xList = p.x.map(val => parseFloat(val));
      const yVal = parseFloat(p.y);
      const predVal = regressionResult && regressionResult.predictions
        ? regressionResult.predictions[idx]
        : undefined;

      return {
        x: xList,
        y: yVal,
        pred: predVal
      };
    });
  };

  const chartData = getChartData();

  // Auto-run regression on mount
  useEffect(() => {
    runRegression();
  }, []);

  return {
    points,
    loading,
    error,
    regressionResult,
    regressionMode,
    setRegressionMode,
    numFeatures,
    setNumFeatures,
    handleAddRow,
    handleRemoveRow,
    handleCellChange,
    handleClearData,
    runRegression,
    chartData
  };
}

