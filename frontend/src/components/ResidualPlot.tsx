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
import { BarChart2 } from 'lucide-react';

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

interface ResidualPlotProps {
  chartData: ChartItem[];
  regressionResult: RegressionResponse | null;
}

export function ResidualPlot({ chartData, regressionResult }: ResidualPlotProps) {
  // Map data to calculate residuals (observed - predicted)
  const residualData = chartData
    .filter((d) => d.pred !== undefined)
    .map((d) => ({
      x: d.x,
      residual: d.y - (d.pred as number),
      zero: 0
    }));

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-5 h-5 text-purple-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-none">Residual Plot</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Visualizing error distribution (Residual vs X)</p>
        </div>
      </div>

      {/* Chart Plot */}
      <div className="h-96 w-full flex items-center justify-center">
        {regressionResult && residualData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={residualData}
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
                label={{ value: 'Residual Error (Y - Fitted Y)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 text-white border border-slate-800 rounded-lg p-3 shadow-lg font-sans text-xs space-y-1.5">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-1 font-mono">Residual Details</p>
                        <p className="flex justify-between gap-6"><span>X:</span> <span className="font-mono text-slate-300">{Number(data.x).toFixed(4)}</span></p>
                        <p className="flex justify-between gap-6 text-purple-400"><span>Residual:</span> <span className="font-mono">{Number(data.residual).toFixed(4)}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 'medium' }} />
              <Scatter
                name="Residual Point (error)"
                dataKey="residual"
                fill="#8b5cf6"
                shape="circle"
                radius={6}
              />
              <Line
                name="Zero Error Baseline (Reference)"
                dataKey="zero"
                stroke="#94a3b8"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl max-w-sm">
            <BarChart2 className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Residual Plot Unavailable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please enter data points and run regression to view the distribution of residual errors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResidualPlot;
