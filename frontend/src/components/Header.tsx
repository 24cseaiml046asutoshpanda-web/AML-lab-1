import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold tracking-tight text-slate-900">RegressLab</h1>
        </div>
      </div>
    </header>
  );
}
export default Header;
