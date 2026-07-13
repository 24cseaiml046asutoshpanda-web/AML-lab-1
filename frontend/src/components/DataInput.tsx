import {
  Plus,
  Trash2,
  FileText,
  Table,
  Play,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface DataPoint {
  id: string;
  x: string;
  y: string;
}

interface DataInputProps {
  inputMode: 'table' | 'paste';
  onTabChange: (mode: 'table' | 'paste') => void;
  points: DataPoint[];
  onCellChange: (id: string, field: 'x' | 'y', value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onClearData: () => void;
  rawX: string;
  onRawXChange: (val: string) => void;
  rawY: string;
  onRawYChange: (val: string) => void;
  onRun: () => void;
  loading: boolean;
  error: string | null;
}

export function DataInput({
  inputMode,
  onTabChange,
  points,
  onCellChange,
  onAddRow,
  onRemoveRow,
  onClearData,
  rawX,
  onRawXChange,
  rawY,
  onRawYChange,
  onRun,
  loading,
  error
}: DataInputProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-slate-200/80 bg-slate-50/55 p-1.5">
        <button
          type="button"
          id="tab-table"
          onClick={() => onTabChange('table')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            inputMode === 'table'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          Table Editor
        </button>
        <button
          type="button"
          id="tab-paste"
          onClick={() => onTabChange('paste')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            inputMode === 'paste'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Bulk Paste
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {inputMode === 'table' ? (
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto border border-slate-150 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-center w-12">#</th>
                    <th className="py-2.5 px-3">X Value</th>
                    <th className="py-2.5 px-3">Y Value</th>
                    <th className="py-2.5 px-4 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {points.map((point, index) => (
                    <tr key={point.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 text-center text-xs font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          value={point.x}
                          onChange={(e) => onCellChange(point.id, 'x', e.target.value)}
                          placeholder="e.g. 1.0"
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500/30 rounded px-2.5 py-1 text-sm outline-none font-mono"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          value={point.y}
                          onChange={(e) => onCellChange(point.id, 'y', e.target.value)}
                          placeholder="e.g. 2.0"
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500/30 rounded px-2.5 py-1 text-sm outline-none font-mono"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveRow(point.id)}
                          className="p-1 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-md transition-colors cursor-pointer"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onAddRow}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Row
              </button>
              <button
                type="button"
                onClick={onClearData}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              Enter values separated by commas, spaces, or newlines. Make sure the number of items in both lists is equal.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="raw-x-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  X Coordinates
                </label>
                <textarea
                  id="raw-x-input"
                  value={rawX}
                  onChange={(e) => onRawXChange(e.target.value)}
                  rows={8}
                  placeholder="1.0, 2.0, 3.0"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
              <div>
                <label htmlFor="raw-y-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Y Coordinates
                </label>
                <textarea
                  id="raw-y-input"
                  value={rawY}
                  onChange={(e) => onRawYChange(e.target.value)}
                  rows={8}
                  placeholder="2.2, 3.9, 6.1"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearData}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Data Fields
            </button>
          </div>
        )}

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
    </div>
  );
}

export default DataInput;
