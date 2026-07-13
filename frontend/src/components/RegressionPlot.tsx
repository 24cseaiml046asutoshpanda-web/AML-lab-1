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

interface RegressionMetrics {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
}

interface RegressionResponse {
  slope: number;
  intercept: number;
  predictions: number[];
  metrics: RegressionMetrics;
}

interface ChartItem {
  x: number;
  y: number;
  pred?: number;
}

interface RegressionPlotProps {
  chartData: ChartItem[];
  regressionResult: RegressionResponse | null;
}

export function RegressionPlot({ chartData, regressionResult }: RegressionPlotProps) {
  const getEquationText = () => {
    if (!regressionResult) return '';
    const m = regressionResult.slope.toFixed(4);
    const b = regressionResult.intercept;
    const sign = b >= 0 ? '+' : '-';
    const absB = Math.abs(b).toFixed(4);
    return `y = ${m}x ${sign} ${absB}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">Regression Fit Plot</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Actual values vs fitted line</p>
          </div>
        </div>
        
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
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="x"
                type="number"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#cbd5e1"
                label={{ value: 'Independent Variable (X)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
              />
              <YAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#cbd5e1"
                label={{ value: 'Dependent Variable (Y)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 text-white border border-slate-800 rounded-lg p-3 shadow-lg font-sans text-xs space-y-1.5">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-1 font-mono">Point Details</p>
                        <p className="flex justify-between gap-6"><span>X:</span> <span className="font-mono text-slate-300">{Number(data.x).toFixed(4)}</span></p>
                        <p className="flex justify-between gap-6"><span>Observed Y:</span> <span className="font-mono text-slate-300">{Number(data.y).toFixed(4)}</span></p>
                        {data.pred !== undefined && (
                          <>
                            <p className="flex justify-between gap-6 text-emerald-400"><span>Fitted Y:</span> <span className="font-mono">{Number(data.pred).toFixed(4)}</span></p>
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
                name="Actual Data (Observed)"
                dataKey="y"
                fill="#2563eb"
                shape="circle"
                radius={6}
              />
              {regressionResult && (
                <Line
                  name="Fitted Regression Line"
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
