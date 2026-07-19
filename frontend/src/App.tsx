import Header from './components/Header';
import DataInput from './components/DataInput';
import RegressionPlot from './components/RegressionPlot';
import MetricsDashboard from './components/MetricsDashboard';
import { useRegression } from './hooks/useRegression';

export function App() {
  const {
    points,
    loading,
    error,
    regressionResult,
    regressionMode,
    setRegressionMode,
    numFeatures,
    setNumFeatures,
    handleAddRow,
    handleRemoveRow,
    handleCellChange,
    handleClearData,
    runRegression,
    chartData
  } = useRegression();

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Data Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <DataInput
              points={points}
              regressionMode={regressionMode}
              setRegressionMode={setRegressionMode}
              numFeatures={numFeatures}
              setNumFeatures={setNumFeatures}
              onCellChange={handleCellChange}
              onAddRow={handleAddRow}
              onRemoveRow={handleRemoveRow}
              onClearData={handleClearData}
              onRun={runRegression}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column: Visualizations & Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <RegressionPlot
              chartData={chartData}
              regressionResult={regressionResult}
              regressionMode={regressionMode}
              numFeatures={numFeatures}
            />

            <MetricsDashboard
              metrics={regressionResult ? regressionResult.metrics : null}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

