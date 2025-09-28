import React from 'react';

interface ControlPanelProps {
  distribution: 'normal' | 'binomial' | 'poisson' | 'exponential';
  parameters: {
    mean?: number;
    stdDev?: number;
    trials?: number;
    probability?: number;
    lambda?: number;
    rate?: number;
  };
  onDistributionChange: (distribution: 'normal' | 'binomial' | 'poisson' | 'exponential') => void;
  onParameterChange: (paramName: string, value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  distribution,
  parameters,
  onDistributionChange,
  onParameterChange,
}) => {
  const renderParameterControls = () => {
    switch (distribution) {
      case 'normal':
        return (
          <>
            <div className="parameter-control">
              <label htmlFor="mean">Mean (μ):</label>
              <input
                id="mean"
                type="number"
                value={parameters.mean || 0}
                onChange={(e) => onParameterChange('mean', parseFloat(e.target.value))}
                min="-10"
                max="10"
                step="0.1"
              />
            </div>
            <div className="parameter-control">
              <label htmlFor="stdDev">Standard Deviation (σ):</label>
              <input
                id="stdDev"
                type="number"
                value={parameters.stdDev || 1}
                onChange={(e) => onParameterChange('stdDev', parseFloat(e.target.value))}
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
              <label htmlFor="trials">Number of Trials (n):</label>
              <input
                id="trials"
                type="number"
                value={parameters.trials || 10}
                onChange={(e) => onParameterChange('trials', parseInt(e.target.value))}
                min="1"
                max="100"
                step="1"
              />
            </div>
            <div className="parameter-control">
              <label htmlFor="probability">Success Probability (p):</label>
              <input
                id="probability"
                type="number"
                value={parameters.probability || 0.5}
                onChange={(e) => onParameterChange('probability', parseFloat(e.target.value))}
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
            <label htmlFor="lambda">Rate Parameter (λ):</label>
            <input
              id="lambda"
              type="number"
              value={parameters.lambda || 5}
              onChange={(e) => onParameterChange('lambda', parseFloat(e.target.value))}
              min="0.1"
              max="20"
              step="0.1"
            />
          </div>
        );

      case 'exponential':
        return (
          <div className="parameter-control">
            <label htmlFor="rate">Rate Parameter (λ):</label>
            <input
              id="rate"
              type="number"
              value={parameters.rate || 1}
              onChange={(e) => onParameterChange('rate', parseFloat(e.target.value))}
              min="0.1"
              max="5"
              step="0.1"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="control-panel">
      <h3>Distribution Controls</h3>
      
      <div className="distribution-selector">
        <label htmlFor="distribution">Select Distribution:</label>
        <select
          id="distribution"
          value={distribution}
          onChange={(e) =>
            onDistributionChange(e.target.value as 'normal' | 'binomial' | 'poisson' | 'exponential')
          }
        >
          <option value="normal">Normal</option>
          <option value="binomial">Binomial</option>
          <option value="poisson">Poisson</option>
          <option value="exponential">Exponential</option>
        </select>
      </div>

      <div className="parameters-container">
        {renderParameterControls()}
      </div>
    </div>
  );
};

export default ControlPanel;