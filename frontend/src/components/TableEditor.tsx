import { Plus, Trash2, RotateCcw } from 'lucide-react';
import type { DataPoint, RegressionMode } from '../types';

interface TableEditorProps {
  points: DataPoint[];
  regressionMode: RegressionMode;
  numFeatures: number;
  onCellChange: (id: string, field: 'x' | 'y', value: string, featureIndex?: number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onClearData: () => void;
}

export function TableEditor({
  points,
  regressionMode,
  numFeatures,
  onCellChange,
  onAddRow,
  onRemoveRow,
  onClearData
}: TableEditorProps) {
  return (
    <div className="space-y-4">
      <div className="max-h-80 overflow-y-auto border border-slate-150 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4 text-center w-12">#</th>
              {regressionMode === 'single' ? (
                <th className="py-2.5 px-3">X Value</th>
              ) : (
                Array.from({ length: numFeatures }).map((_, i) => (
                  <th key={i} className="py-2.5 px-3">X{i + 1} Value</th>
                ))
              )}
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
                {regressionMode === 'single' ? (
                  <td className="py-1.5 px-2">
                    <input
                      type="text"
                      value={point.x[0] || ''}
                      onChange={(e) => onCellChange(point.id, 'x', e.target.value, 0)}
                      placeholder="e.g. 1.0"
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500/30 rounded px-2.5 py-1 text-sm outline-none font-mono"
                    />
                  </td>
                ) : (
                  Array.from({ length: numFeatures }).map((_, i) => (
                    <td key={i} className="py-1.5 px-2">
                      <input
                        type="text"
                        value={point.x[i] || ''}
                        onChange={(e) => onCellChange(point.id, 'x', e.target.value, i)}
                        placeholder="e.g. 1.0"
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500/30 rounded px-2.5 py-1 text-sm outline-none font-mono"
                      />
                    </td>
                  ))
                )}
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
  );
}

export default TableEditor;

