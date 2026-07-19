import { useState, useEffect } from 'react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LineChart } from 'lucide-react';

import type { RegressionResponse, RegressionMode } from '../types';

interface ChartItem {
  x: number[];
  y: number;
  pred?: number;
}

interface RegressionPlotProps {
  chartData: ChartItem[];
  regressionResult: RegressionResponse | null;
  regressionMode: RegressionMode;
  numFeatures: number;
}

export function RegressionPlot({ chartData, regressionResult, regressionMode, numFeatures }: RegressionPlotProps) {
  const [plotType, setPlotType] = useState<string>('actual-pred');

  // Reset plot type when regression mode changes
  useEffect(() => {
    setPlotType('actual-pred');
  }, [regressionMode]);

  const getEquationText = () => {
    if (!regressionResult) return '';
    if (regressionMode === 'single') {
      const m = regressionResult.slope?.toFixed(4) ?? '0.0000';
      const b = regressionResult.intercept;
      const sign = b >= 0 ? '+' : '-';
      const absB = Math.abs(b).toFixed(4);
      return `y = ${m}x ${sign} ${absB}`;
    } else {
      const b0 = regressionResult.intercept;
      const coeffs = regressionResult.coefficients ?? [];
      
      let equation = `y = ${b0.toFixed(4)}`;
      coeffs.forEach((coef, idx) => {
        const sign = coef >= 0 ? '+' : '-';
        const absCoef = Math.abs(coef).toFixed(4);
        equation += ` ${sign} ${absCoef}x${idx + 1}`;
      });
      return equation;
    }
  };

  const getXAxisLabel = () => {
    if (regressionMode === 'single') return 'Independent Variable (X)';
    if (plotType === 'actual-pred') return 'Predicted Value (Ŷ)';
    const idx = parseInt(plotType.replace('feature-', ''));
    return `Feature X${idx + 1}`;
  };

  const getYAxisLabel = () => {
    if (regressionMode === 'multi' && plotType === 'actual-pred') return 'Observed Value (Y)';
    return 'Dependent Variable (Y)';
  };

  const getScatterName = () => {
    if (regressionMode === 'single') return 'Actual Data (Observed)';
    if (plotType === 'actual-pred') return 'Observed vs. Predicted';
    return 'Observed Data';
  };

  const getLineName = () => {
    if (regressionMode === 'single') return 'Fitted Regression Line';
    if (plotType === 'actual-pred') return 'Ideal Fit Reference (Y = Ŷ)';
    return 'Fitted Regression Line';
  };

  const getTransformedData = () => {
    if (regressionMode === 'single') {
      return chartData
        .map(item => ({
          x: item.x[0] ?? 0,
          y: item.y,
          pred: item.pred
        }))
        .sort((a, b) => a.x - b.x);
    }

    if (plotType === 'actual-pred') {
      return chartData
        .map(item => ({
          x: item.pred ?? 0, // Predicted value on X-axis
          y: item.y,         // Observed value on Y-axis
          pred: item.pred    // Reference line y = x coordinates
        }))
        .sort((a, b) => a.x - b.x);
    }

    const featureIdx = parseInt(plotType.replace('feature-', ''));
    return chartData
      .map(item => ({
        x: item.x[featureIdx] ?? 0,
        y: item.y,
        pred: item.pred
      }))
      .sort((a, b) => a.x - b.x);
  };

  const transformedData = getTransformedData();

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">Regression Fit Plot</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {regressionMode === 'single'
                ? 'Actual values vs fitted line'
                : plotType === 'actual-pred'
                ? 'Fitted model quality visualization'
                : 'Observed and predicted values plotted per feature'}
            </p>
          </div>
        </div>

        {/* Plot Type Selector for MLR */}
        {regressionMode === 'multi' && (
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plot Type:</label>
            <select
              value={plotType}
              onChange={(e) => setPlotType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-700 select-none cursor-pointer"
            >
              <option value="actual-pred">Observed vs. Predicted Y</option>
              {Array.from({ length: numFeatures }).map((_, i) => (
                <option key={i} value={`feature-${i}`}>
                  Feature X{i + 1} vs. Y
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Equation Display */}
        {regressionResult && (
          <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-lg shrink-0">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block leading-none mb-1">Model Equation</span>
            <span className="text-sm font-mono font-bold text-blue-800">{getEquationText()}</span>
          </div>
        )}
      </div>

      {/* Chart Plot */}
      <div className="h-96 w-full flex items-center justify-center">
        {transformedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={transformedData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="x"
                type="number"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#cbd5e1"
                label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                domain={['auto', 'auto']}
              />
              <YAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#cbd5e1"
                label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isActualPred = regressionMode === 'multi' && plotType === 'actual-pred';
                    const labelX = isActualPred ? 'Predicted Ŷ' : (regressionMode === 'single' ? 'X' : `Feature X${parseInt(plotType.replace('feature-', '')) + 1}`);
                    
                    return (
                      <div className="bg-slate-950/95 text-white border border-slate-800 rounded-lg p-3 shadow-lg font-sans text-xs space-y-1.5">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-1 font-mono">Point Details</p>
                        <p className="flex justify-between gap-6"><span>{labelX}:</span> <span className="font-mono text-slate-300">{Number(data.x).toFixed(4)}</span></p>
                        <p className="flex justify-between gap-6"><span>Observed Y:</span> <span className="font-mono text-slate-300">{Number(data.y).toFixed(4)}</span></p>
                        {data.pred !== undefined && (
                          <>
                            {!isActualPred && (
                              <p className="flex justify-between gap-6 text-emerald-400"><span>Fitted Y:</span> <span className="font-mono">{Number(data.pred).toFixed(4)}</span></p>
                            )}
                            <p className="flex justify-between gap-6 text-rose-400"><span>Residual:</span> <span className="font-mono">{Number(data.y - data.pred).toFixed(4)}</span></p>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 'medium' }} />
              <Scatter
                name={getScatterName()}
                dataKey="y"
                fill="#2563eb"
                shape="circle"
                radius={6}
              />
              {(regressionResult || (regressionMode === 'multi' && plotType === 'actual-pred' && transformedData.some(d => d.pred !== undefined))) && (
                <Line
                  name={getLineName()}
                  dataKey="pred"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl max-w-sm">
            <LineChart className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No Plot Available</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please enter data points and run regression to visualize the scatter plot and fitted regression line.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegressionPlot;
