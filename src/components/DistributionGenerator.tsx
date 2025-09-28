import React, { useState } from 'react';
import { DataPoint, DistributionParams } from '../types/data';

interface DistributionGeneratorProps {
  onDataGenerated: (data: DataPoint[]) => void;
}

const DistributionGenerator: React.FC<DistributionGeneratorProps> = ({ onDataGenerated }) => {
  const [distributionParams, setDistributionParams] = useState<DistributionParams>({
    type: 'normal',
    parameters: {
      mean: 0,
      stdDev: 1,
      sampleSize: 1000
    }
  });

  const handleDistributionChange = (type: DistributionParams['type']) => {
    setDistributionParams({
      type,
      parameters: {
        ...getDefaultParamsForDistribution(type),
        sampleSize: distributionParams.parameters.sampleSize
      }
    });
  };

  const getDefaultParamsForDistribution = (type: DistributionParams['type']) => {
    switch (type) {
      case 'normal':
        return { mean: 0, stdDev: 1 };
      case 'binomial':
        return { trials: 10, probability: 0.5 };
      case 'poisson':
        return { lambda: 5 };
      case 'exponential':
        return { rate: 1 };
      case 'uniform':
        return { min: 0, max: 1 };
      default:
        return {};
    }
  };

  const handleParameterChange = (paramName: string, value: number) => {
    setDistributionParams(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }));
  };

  const generateData = () => {
    const { type, parameters } = distributionParams;
    const { sampleSize } = parameters;
    const dataPoints: DataPoint[] = [];

    switch (type) {
      case 'normal':
        // 生成正态分布数据
        for (let i = 0; i < sampleSize; i++) {
          // 使用Box-Muller变换生成正态分布随机数
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          const value = (z * (parameters.stdDev || 1)) + (parameters.mean || 0);
          dataPoints.push({ x: i + 1, y: value });
        }
        break;

      case 'binomial':
        // 生成二项分布数据
        const n = parameters.trials || 10;
        const p = parameters.probability || 0.5;
        for (let i = 0; i < sampleSize; i++) {
          let successes = 0;
          for (let j = 0; j < n; j++) {
            if (Math.random() < p) {
              successes++;
            }
          }
          dataPoints.push({ x: i + 1, y: successes });
        }
        break;

      case 'poisson':
        // 生成泊松分布数据
        const lambda = parameters.lambda || 5;
        for (let i = 0; i < sampleSize; i++) {
          let k = 0;
          let p = 1;
          const L = Math.exp(-lambda);
          do {
            k++;
            p *= Math.random();
          } while (p > L);
          dataPoints.push({ x: i + 1, y: k - 1 });
        }
        break;

      case 'exponential':
        // 生成指数分布数据
        const rate = parameters.rate || 1;
        for (let i = 0; i < sampleSize; i++) {
          const value = -Math.log(1 - Math.random()) / rate;
          dataPoints.push({ x: i + 1, y: value });
        }
        break;

      case 'uniform':
        // 生成均匀分布数据
        const min = parameters.min || 0;
        const max = parameters.max || 1;
        for (let i = 0; i < sampleSize; i++) {
          const value = min + Math.random() * (max - min);
          dataPoints.push({ x: i + 1, y: value });
        }
        break;

      default:
        break;
    }

    onDataGenerated(dataPoints);
  };

  const renderParameterControls = () => {
    const { type, parameters } = distributionParams;

    switch (type) {
      case 'normal':
        return (
          <>
            <div className="parameter-control">
              <label htmlFor="mean">均值 (μ):</label>
              <input
                id="mean"
                type="number"
                value={parameters.mean || 0}
                onChange={(e) => handleParameterChange('mean', parseFloat(e.target.value))}
                min="-10"
                max="10"
                step="0.1"
              />
            </div>
            <div className="parameter-control">
              <label htmlFor="stdDev">标准差 (σ):</label>
              <input
                id="stdDev"
                type="number"
                value={parameters.stdDev || 1}
                onChange={(e) => handleParameterChange('stdDev', parseFloat(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
          </>
        );

      case 'binomial':
        return (
          <>
            <div className="parameter-control">
              <label htmlFor="trials">试验次数 (n):</label>
              <input
                id="trials"
                type="number"
                value={parameters.trials || 10}
                onChange={(e) => handleParameterChange('trials', parseInt(e.target.value))}
                min="1"
                max="100"
                step="1"
              />
            </div>
            <div className="parameter-control">
              <label htmlFor="probability">成功概率 (p):</label>
              <input
                id="probability"
                type="number"
                value={parameters.probability || 0.5}
                onChange={(e) => handleParameterChange('probability', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </>
        );

      case 'poisson':
        return (
          <div className="parameter-control">
            <label htmlFor="lambda">速率参数 (λ):</label>
            <input
              id="lambda"
              type="number"
              value={parameters.lambda || 5}
              onChange={(e) => handleParameterChange('lambda', parseFloat(e.target.value))}
              min="0.1"
              max="20"
              step="0.1"
            />
          </div>
        );

      case 'exponential':
        return (
          <div className="parameter-control">
            <label htmlFor="rate">速率参数 (λ):</label>
            <input
              id="rate"
              type="number"
              value={parameters.rate || 1}
              onChange={(e) => handleParameterChange('rate', parseFloat(e.target.value))}
              min="0.1"
              max="10"
              step="0.1"
            />
          </div>
        );

      case 'uniform':
        return (
          <>
            <div className="parameter-control">
              <label htmlFor="min">最小值:</label>
              <input
                id="min"
                type="number"
                value={parameters.min || 0}
                onChange={(e) => handleParameterChange('min', parseFloat(e.target.value))}
                min="-100"
                max="100"
                step="0.1"
              />
            </div>
            <div className="parameter-control">
              <label htmlFor="max">最大值:</label>
              <input
                id="max"
                type="number"
                value={parameters.max || 1}
                onChange={(e) => handleParameterChange('max', parseFloat(e.target.value))}
                min="-100"
                max="100"
                step="0.1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="distribution-generator">
      <h3>分布生成</h3>
      
      <div className="distribution-selection">
        <label htmlFor="distribution-type">选择分布类型：</label>
        <select
          id="distribution-type"
          value={distributionParams.type}
          onChange={(e) => handleDistributionChange(e.target.value as DistributionParams['type'])}
        >
          <option value="normal">正态分布</option>
          <option value="binomial">二项分布</option>
          <option value="poisson">泊松分布</option>
          <option value="exponential">指数分布</option>
          <option value="uniform">均匀分布</option>
        </select>
      </div>

      <div className="parameter-controls">
        {renderParameterControls()}
        
        <div className="parameter-control">
          <label htmlFor="sample-size">样本大小:</label>
          <input
            id="sample-size"
            type="number"
            value={distributionParams.parameters.sampleSize}
            onChange={(e) => handleParameterChange('sampleSize', parseInt(e.target.value))}
            min="10"
            max="10000"
            step="10"
          />
        </div>
      </div>

      <div className="action-section">
        <button 
          className="generate-btn"
          onClick={generateData}
        >
          生成数据
        </button>
      </div>

      <div className="distribution-info">
        <h4>分布信息</h4>
        <p>{getDistributionDescription(distributionParams.type)}</p>
      </div>
    </div>
  );
};

// 获取分布描述
const getDistributionDescription = (type: string): string => {
  switch (type) {
    case 'normal':
      return '正态分布（高斯分布）是一种连续概率分布，呈钟形曲线，对称于均值。常用于自然现象、测量误差等场景。';
    case 'binomial':
      return '二项分布用于模拟在固定次数的独立试验中成功次数的概率。每次试验只有两种可能结果：成功或失败。';
    case 'poisson':
      return '泊松分布用于模拟在固定时间或空间内发生的事件数量，适用于事件以已知的平均速率随机且独立发生的场景。';
    case 'exponential':
      return '指数分布用于模拟独立事件之间的时间间隔，具有无记忆性，常用于可靠性分析和排队论。';
    case 'uniform':
      return '均匀分布是一种连续概率分布，其中区间内的每个值都有相等的概率被选中。';
    default:
      return '';
  }
};

export default DistributionGenerator;