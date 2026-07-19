import { Play, AlertTriangle } from 'lucide-react';
import type { DataPoint, RegressionMode } from '../types';
import TableEditor from './TableEditor';

interface DataInputProps {
  points: DataPoint[];
  regressionMode: RegressionMode;
  setRegressionMode: (mode: RegressionMode) => void;
  numFeatures: number;
  setNumFeatures: (num: number) => void;
  onCellChange: (id: string, field: 'x' | 'y', value: string, featureIndex?: number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onClearData: () => void;
  onRun: () => void;
  loading: boolean;
  error: string | null;
}

export function DataInput({
  points,
  regressionMode,
  setRegressionMode,
  numFeatures,
  setNumFeatures,
  onCellChange,
  onAddRow,
  onRemoveRow,
  onClearData,
  onRun,
  loading,
  error
}: DataInputProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden p-5">
      {/* Mode Settings */}
      <div className="space-y-4 mb-5 pb-5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Regression Model Type
          </span>
          <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRegressionMode('single')}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold text-center transition-all cursor-pointer ${
                regressionMode === 'single'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Linear
            </button>
            <button
              type="button"
              onClick={() => setRegressionMode('multi')}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold text-center transition-all cursor-pointer ${
                regressionMode === 'multi'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Multiple Linear
            </button>
          </div>
        </div>

        {regressionMode === 'multi' && (
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Number of Features (Xᵢ)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Adjust dimensions of input features.</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-md gap-1">
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumFeatures(num)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-all cursor-pointer ${
                    numFeatures === num
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Input Data Points</h2>
      </div>

      <TableEditor
        points={points}
        regressionMode={regressionMode}
        numFeatures={numFeatures}
        onCellChange={onCellChange}
        onAddRow={onAddRow}
        onRemoveRow={onRemoveRow}
        onClearData={onClearData}
      />

      {/* Run Buttons & Status */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold text-white shadow-md transition-all select-none cursor-pointer ${
            loading
              ? 'bg-blue-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Fitting Model...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Run Regression
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold leading-none mb-1">Configuration Error</h4>
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataInput;

