import type { RegressionMetrics } from '../types';

interface MetricsDashboardProps {
  metrics: RegressionMetrics | null;
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
        {/* Metric R2 */}
        <div className="p-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">R-squared (R²)</span>
          <span className="text-xl font-mono font-bold text-slate-950 mt-1 block">
            {metrics ? metrics.r2.toFixed(4) : '—'}
          </span>
        </div>

        {/* Metric MAE */}
        <div className="p-1 pt-3 md:pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MAE</span>
          <span className="text-xl font-mono font-bold text-slate-950 mt-1 block">
            {metrics ? metrics.mae.toFixed(4) : '—'}
          </span>
        </div>

        {/* Metric MSE */}
        <div className="p-1 pt-3 md:pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MSE</span>
          <span className="text-xl font-mono font-bold text-slate-950 mt-1 block">
            {metrics ? metrics.mse.toFixed(4) : '—'}
          </span>
        </div>

        {/* Metric RMSE */}
        <div className="p-1 pt-3 md:pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RMSE</span>
          <span className="text-xl font-mono font-bold text-slate-950 mt-1 block">
            {metrics ? metrics.rmse.toFixed(4) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
export default MetricsDashboard;
