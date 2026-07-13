import { Sparkles } from 'lucide-react';

interface Preset {
  name: string;
  x: string;
  y: string;
}

interface PresetSelectorProps {
  selectedPreset: string;
  onLoadPreset: (key: string) => void;
  presets: Record<string, Preset>;
}

export function PresetSelector({ selectedPreset, onLoadPreset, presets }: PresetSelectorProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Load Preset Data</h2>
      </div>
      <select
        id="preset-select"
        value={selectedPreset}
        onChange={(e) => onLoadPreset(e.target.value)}
        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-lg py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
      >
        {Object.entries(presets).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PresetSelector;
