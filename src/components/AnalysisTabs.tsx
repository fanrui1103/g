import React, { useState, useEffect } from 'react';
import { DataPoint, AnalysisResult } from '../types/data';
import * as math from 'mathjs';

interface AnalysisTabsProps {
  data: DataPoint[];
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ data, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'mle' | 'mom'>('basic');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<'normal' | 'exponential' | 'uniform'>('normal');

  const handleTabChange = (tab: 'basic' | 'mle' | 'mom') => {
    setActiveTab(tab);
    // 当切换到不同的分析标签时，清除之前的分析结果
    setAnalysisResult({});
  };

  const performAnalysis = () => {
    setIsAnalyzing(true);
    
    // 模拟异步分析过程
    setTimeout(() => {
      const result: AnalysisResult = {};
      
      // 提取数值数据
      const values = data
        .filter(point => point.y !== undefined)
        .map(point => point.y!);
      
      if (values.length === 0) {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        if (onAnalysisComplete) {
          onAnalysisComplete(result);
        }
        return;
      }
      
      switch (activeTab) {
        case 'basic':
          result.basicStats = calculateBasicStatistics(values);
          break;
        case 'mle':
          result.mleResults = calculateMLE(values, selectedDistribution);
          break;
        case 'mom':
          result.momResults = calculateMOM(values, selectedDistribution);
          break;
      }
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    }, 300);
  };

  // 计算基本统计量
  const calculateBasicStatistics = (values: number[]): AnalysisResult['basicStats'] => {
    if (values.length === 0) return undefined;
    
    // 计算基本统计量
    const mean = math.mean(values) as number;
    const median = math.median(values) as number;
    
    // 修复mode的类型转换问题
    const modeResult = math.mode(values);
    const mode = Array.isArray(modeResult) ? modeResult[0] : modeResult as number;
    
    const variance = (math.variance(values) as unknown) as number;
    const standardDeviation = (math.std(values) as unknown) as number;
    const min = math.min(...values) as number;
    const max = math.max(...values) as number;
    const range = (max - min) as number;
    const skewness = calculateSkewness(values);
    const kurtosis = calculateKurtosis(values);
    
    return {
      mean,
      median,
      mode,
      variance,
      standardDeviation,
      min,
      max,
      range,
      skewness,
      kurtosis
    };
  };

  // 计算最大似然估计
  const calculateMLE = (values: number[], distribution: string): AnalysisResult['mleResults'] => {
    const results: Record<string, number> = {};
    
    switch (distribution) {
      case 'normal':
        // 正态分布的MLE估计：均值=样本均值，方差=样本方差
        results['均值(μ)'] = math.mean(values) as number;
        results['方差(σ²)'] = (math.variance(values) as unknown) as number;
        results['标准差(σ)'] = (math.std(values) as unknown) as number;
        break;
        
      case 'exponential':
        // 指数分布的MLE估计：λ=1/样本均值
        const mean = math.mean(values) as number;
        results['速率参数(λ)'] = 1 / mean;
        results['均值(1/λ)'] = mean;
        break;
        
      case 'uniform':
        // 均匀分布的MLE估计：a=最小值，b=最大值
        results['最小值(a)'] = math.min(...values) as number;
        results['最大值(b)'] = math.max(...values) as number;
        results['均值((a+b)/2)'] = (results['最小值(a)'] + results['最大值(b)']) / 2;
        break;
        
      default:
        break;
    }
    
    return results;
  };

  // 计算矩估计
  const calculateMOM = (values: number[], distribution: string): AnalysisResult['momResults'] => {
    const results: Record<string, number> = {};
    
    switch (distribution) {
      case 'normal':
        // 正态分布的矩估计与MLE相同
        results['均值(μ)'] = math.mean(values) as number;
        results['方差(σ²)'] = (math.variance(values) as unknown) as number;
        results['标准差(σ)'] = (math.std(values) as unknown) as number;
        break;
        
      case 'exponential':
        // 指数分布的矩估计与MLE相同
        const mean = math.mean(values) as number;
        results['速率参数(λ)'] = 1 / mean;
        results['均值(1/λ)'] = mean;
        break;
        
      case 'uniform':
        // 均匀分布的矩估计
        const sampleMean = math.mean(values) as number;
        const sampleVariance = (math.variance(values) as unknown) as number;
        const range = Math.sqrt(12 * sampleVariance);
        results['最小值(a)'] = sampleMean - range / 2;
        results['最大值(b)'] = sampleMean + range / 2;
        results['均值((a+b)/2)'] = sampleMean;
        break;
        
      default:
        break;
    }
    
    return results;
  };

  // 辅助函数：计算偏度
  const calculateSkewness = (values: number[]): number => {
    const n = values.length;
    const mean = math.mean(values) as number;
    const std = (math.std(values) as unknown) as number;
    
    if (std === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / std, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sum;
  };

  // 辅助函数：计算峰度
  const calculateKurtosis = (values: number[]): number => {
    const n = values.length;
    const mean = math.mean(values) as number;
    const std = (math.std(values) as unknown) as number;
    
    if (std === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / std, 4), 0);
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  };

  // 渲染基本统计结果
  const renderBasicStats = () => {
    const { basicStats } = analysisResult;
    
    if (!basicStats) {
      return <p>请点击下方按钮开始分析...</p>;
    }
    
    return (
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">均值:</span>
          <span className="stat-value">{basicStats.mean.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">中位数:</span>
          <span className="stat-value">{basicStats.median.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">众数:</span>
          <span className="stat-value">{basicStats.mode.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">方差:</span>
          <span className="stat-value">{basicStats.variance.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">标准差:</span>
          <span className="stat-value">{basicStats.standardDeviation.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最小值:</span>
          <span className="stat-value">{basicStats.min.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最大值:</span>
          <span className="stat-value">{basicStats.max.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">范围:</span>
          <span className="stat-value">{basicStats.range.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">偏度:</span>
          <span className="stat-value">{basicStats.skewness.toFixed(4)}</span>
          <span className="stat-description">
            {basicStats.skewness > 0 ? '右偏' : basicStats.skewness < 0 ? '左偏' : '对称'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">峰度:</span>
          <span className="stat-value">{basicStats.kurtosis.toFixed(4)}</span>
          <span className="stat-description">
            {basicStats.kurtosis > 0 ? '尖峰' : basicStats.kurtosis < 0 ? '平峰' : '正态峰'}
          </span>
        </div>
      </div>
    );
  };

  // 渲染参数估计结果
  const renderParameterEstimates = (estimates?: Record<string, number>) => {
    if (!estimates) {
      return <p>请点击下方按钮开始分析...</p>;
    }
    
    return (
      <div className="estimates-grid">
        {Object.entries(estimates).map(([param, value]) => (
          <div key={param} className="estimate-item">
            <span className="estimate-label">{param}:</span>
            <span className="estimate-value">{value.toFixed(4)}</span>
          </div>
        ))}
      </div>
    );
  };

  // 监听数据变化，数据更新时自动触发分析
  useEffect(() => {
    if (data.length > 0) {
      // 延迟触发分析，避免频繁调用
      const timer = setTimeout(() => {
        performAnalysis();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    <div className="analysis-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => handleTabChange('basic')}
        >
          基本统计
        </button>
        <button
          className={`tab-button ${activeTab === 'mle' ? 'active' : ''}`}
          onClick={() => handleTabChange('mle')}
        >
          最大似然估计 (MLE)
        </button>
        <button
          className={`tab-button ${activeTab === 'mom' ? 'active' : ''}`}
          onClick={() => handleTabChange('mom')}
        >
          矩估计 (MoM)
        </button>
      </div>
      
      <div className="tabs-content">
        {activeTab === 'basic' && (
          <div className="basic-stats-content">
            <h4>基本统计分析结果</h4>
            {isAnalyzing ? (
              <div className="loading">分析中...</div>
            ) : (
              renderBasicStats()
            )}
          </div>
        )}
        
        {(activeTab === 'mle' || activeTab === 'mom') && (
          <div className="estimation-content">
            <div className="distribution-selection">
              <label htmlFor="distribution-select">选择分布类型：</label>
              <select
                id="distribution-select"
                value={selectedDistribution}
                onChange={(e) => {
                  setSelectedDistribution(e.target.value as 'normal' | 'exponential' | 'uniform');
                }}
              >
                <option value="normal">正态分布</option>
                <option value="exponential">指数分布</option>
                <option value="uniform">均匀分布</option>
              </select>
            </div>
            
            <h4>{activeTab === 'mle' ? '最大似然估计' : '矩估计'}结果</h4>
            {isAnalyzing ? (
              <div className="loading">分析中...</div>
            ) : (
              renderParameterEstimates(activeTab === 'mle' ? analysisResult.mleResults : analysisResult.momResults)
            )}
          </div>
        )}
        
        {/* 添加手动触发分析的按钮 */}
        <div className="analysis-action">
          <button 
            className="analyze-btn"
            onClick={performAnalysis}
            disabled={isAnalyzing || data.length === 0}
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTabs;