import React, { useState } from 'react';
import DataInputTabs from './components/DataInputTabs';
import AnalysisTabs from './components/AnalysisTabs';
import DataVisualization from './components/DataVisualization';
import { DataPoint } from './types/data';
import './App.css';

function App() {
  // State for the loaded/generated data
  const [data, setData] = useState<DataPoint[]>([]);
  const [hasData, setHasData] = useState(false);

  // Handle data generated from any input method
  const handleDataGenerated = (generatedData: DataPoint[]) => {
    setData(generatedData);
    setHasData(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>综合数据分析工具</h1>
        <p>支持文件上传、分布生成和AI生成数据的数据分析平台</p>
      </header>
      
      <main className="app-main">
        <div className="input-section">
          <h2>数据输入</h2>
          <DataInputTabs onDataGenerated={handleDataGenerated} />
        </div>
        
        {hasData && (
          <>
            <div className="analysis-section">
              <h2>数据分析</h2>
              <AnalysisTabs data={data} />
            </div>
            
            <div className="visualization-section">
              <h2>数据可视化</h2>
              <DataVisualization data={data} />
            </div>
          </>
        )}
        
        {!hasData && (
          <div className="placeholder-section">
            <p>请通过上方的数据输入选项生成或上传数据，然后开始分析</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>综合数据分析工具 - 强大的数据探索与分析平台</p>
      </footer>
    </div>
  );
}

export default App;