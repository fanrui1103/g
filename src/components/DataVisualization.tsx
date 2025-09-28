import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { DataPoint } from '../types/data';

// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface DataVisualizationProps {
  data: DataPoint[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter'>('line');
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<any>({});

  // 当数据或图表类型改变时，更新图表数据
  useEffect(() => {
    if (data.length > 0) {
      updateChartData();
    }
  }, [data, chartType]);

  const updateChartData = () => {
    // 提取数值数据
    const values = data.map(point => point.y).filter((value): value is number => value !== undefined);
    const labels = data.map(point => point.x.toString());
    
    // 处理散点图特殊情况
    if (chartType === 'scatter') {
      const scatterData = data
        .filter(point => point.y !== undefined)
        .map(point => ({ x: point.x, y: point.y! }));
      
      setChartData({
        datasets: [{
          label: 'Data Points',
          data: scatterData,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      });
      
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: getChartTitle(chartType)
          },
          legend: {
            position: 'top' as const,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const point = context.raw;
                return `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '索引'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: '值'
            }
          }
        }
      });
      return;
    }
    
    // 创建数据集
    const dataset = {
      label: '数据',
      data: values,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.2,
      fill: false
    };
    
    // 根据图表类型调整数据集
    let adjustedDataset = { ...dataset };
    if (chartType === 'bar') {
      adjustedDataset = {
        ...dataset,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        tension: 0
      };
    }
    
    // 设置图表数据
    setChartData({
      labels: labels,
      datasets: [adjustedDataset]
    });
    
    // 设置图表选项
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: getChartTitle(chartType)
        },
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '索引'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: '值'
          }
        }
      }
    });
  };

  const getChartTitle = (type: string): string => {
    switch (type) {
      case 'line':
        return '数据折线图';
      case 'bar':
        return '数据柱状图';
      case 'scatter':
        return '数据散点图';
      default:
        return '数据可视化';
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  const getChartDescription = (type: string): string => {
    switch (type) {
      case 'line':
        return '折线图适合展示数据随时间或序列的变化趋势。';
      case 'bar':
        return '柱状图适合比较不同类别或时间点的数据值。';
      case 'scatter':
        return '散点图适合展示两个变量之间的关系和分布情况。';
      default:
        return '';
    }
  };

  if (data.length === 0) {
    return (
      <div className="data-visualization">
        <p>没有数据可供可视化</p>
      </div>
    );
  }

  return (
    <div className="data-visualization">
      <div className="chart-controls">
        <label htmlFor="chart-type">选择图表类型：</label>
        <select
          id="chart-type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'scatter')}
        >
          <option value="line">折线图</option>
          <option value="bar">柱状图</option>
          <option value="scatter">散点图</option>
        </select>
        
        <div className="chart-description">
          {getChartDescription(chartType)}
        </div>
      </div>
      
      <div className="chart-container">
        {renderChart()}
      </div>
      
      <div className="data-summary">
        <h4>数据摘要</h4>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">数据点数量：</span>
            <span className="summary-value">{data.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">数据范围：</span>
            <span className="summary-value">
              {Math.min(...data.filter(p => p.y !== undefined).map(p => p.y!)).toFixed(2)} - 
              {Math.max(...data.filter(p => p.y !== undefined).map(p => p.y!)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;