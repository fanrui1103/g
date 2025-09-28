import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ProbabilityDistributionProps {
  distribution: 'normal' | 'binomial' | 'poisson' | 'exponential';
  parameters: {
    mean?: number;
    stdDev?: number;
    trials?: number;
    probability?: number;
    lambda?: number;
    rate?: number;
  };
}

const ProbabilityDistribution: React.FC<ProbabilityDistributionProps> = ({ distribution, parameters }) => {
  const [data, setData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  }>({
    labels: [],
    datasets: [],
  });

  const generateData = () => {
    let xValues: number[] = [];
    let yValues: number[] = [];
    let label = '';
    let borderColor = '#3b82f6';
    let backgroundColor = 'rgba(59, 130, 246, 0.1)';

    switch (distribution) {
      case 'normal':
        label = `Normal Distribution (μ=${parameters.mean || 0}, σ=${parameters.stdDev || 1})`;
        const mean = parameters.mean || 0;
        const stdDev = parameters.stdDev || 1;
        xValues = Array.from({ length: 100 }, (_, i) => mean - 4 * stdDev + (i * 8 * stdDev) / 99);
        yValues = xValues.map(x => (
          (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
        ));
        borderColor = '#3b82f6';
        break;

      case 'binomial':
        label = `Binomial Distribution (n=${parameters.trials || 10}, p=${parameters.probability || 0.5})`;
        const n = parameters.trials || 10;
        const p = parameters.probability || 0.5;
        xValues = Array.from({ length: n + 1 }, (_, i) => i);
        yValues = xValues.map(k => (
          math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
        ));
        borderColor = '#10b981';
        break;

      case 'poisson':
        label = `Poisson Distribution (λ=${parameters.lambda || 5})`;
        const lambda = parameters.lambda || 5;
        // Generate values up to lambda + 3*sqrt(lambda) for reasonable display
        const maxK = Math.ceil(lambda + 3 * Math.sqrt(lambda));
        xValues = Array.from({ length: maxK + 1 }, (_, i) => i);
        yValues = xValues.map(k => (
          (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k)
        ));
        borderColor = '#f59e0b';
        break;

      case 'exponential':
        label = `Exponential Distribution (λ=${parameters.rate || 1})`;
        const rate = parameters.rate || 1;
        xValues = Array.from({ length: 100 }, (_, i) => i * 0.1);
        yValues = xValues.map(x => rate * Math.exp(-rate * x));
        borderColor = '#ef4444';
        break;

      default:
        break;
    }

    setData({
      labels: xValues.map(x => x.toFixed(2)),
      datasets: [
        {
          label,
          data: yValues,
          borderColor,
          backgroundColor,
          tension: 0.3,
        },
      ],
    });
  };

  useEffect(() => {
    generateData();
  }, [distribution, parameters]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Probability Distribution Visualization',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Probability',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="probability-distribution">
      <div className="chart-container" style={{ height: '400px', width: '100%' }}>
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProbabilityDistribution;