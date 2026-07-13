import { BarChart2, HelpCircle } from 'lucide-react';

interface RegressionMetrics {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
}

interface MetricsDashboardProps {
  metrics: RegressionMetrics | null;
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Evaluation Metrics</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric R2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">R-squared (R²)</span>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-help" />
              <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded shadow-md leading-normal w-48 opacity-0 group-hover:opacity-100 transition-all z-10">
                Proportion of the variance in Y that is predictable from X. Values closer to 1.0 indicate a better fit.
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-950 font-mono">
              {metrics ? metrics.r2.toFixed(4) : '—'}
            </span>
            {metrics && (
              <span className={`text-[10px] font-bold ${
                metrics.r2 > 0.8 ? 'text-emerald-600 bg-emerald-50' : metrics.r2 > 0.4 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
              } px-1.5 py-0.5 rounded`}>
                {metrics.r2 > 0.8 ? 'Strong' : metrics.r2 > 0.4 ? 'Moderate' : 'Weak'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold">Coefficient of determination</span>
        </div>

        {/* Metric MAE */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">MAE</span>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-help" />
              <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded shadow-md leading-normal w-48 opacity-0 group-hover:opacity-100 transition-all z-10">
                Mean Absolute Error: Average magnitude of the absolute residuals (errors).
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-950 font-mono">
              {metrics ? metrics.mae.toFixed(4) : '—'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold">Mean Absolute Error</span>
        </div>

        {/* Metric MSE */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">MSE</span>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-help" />
              <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded shadow-md leading-normal w-48 opacity-0 group-hover:opacity-100 transition-all z-10">
                Mean Squared Error: Average of squared residuals. Heavily penalizes larger outline errors.
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-950 font-mono">
              {metrics ? metrics.mse.toFixed(4) : '—'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold">Mean Squared Error</span>
        </div>

        {/* Metric RMSE */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">RMSE</span>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-help" />
              <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded shadow-md leading-normal w-48 opacity-0 group-hover:opacity-100 transition-all z-10">
                Root Mean Squared Error: The square root of the MSE, representing standard deviation of residuals.
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-950 font-mono">
              {metrics ? metrics.rmse.toFixed(4) : '—'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold">Root Mean Squared Error</span>
        </div>
      </div>
    </div>
  );
}

export default MetricsDashboard;
