import React from 'react';

interface DistributionInfoProps {
  distribution: 'normal' | 'binomial' | 'poisson' | 'exponential';
}

const DistributionInfo: React.FC<DistributionInfoProps> = ({ distribution }) => {
  const getDistributionInfo = () => {
    switch (distribution) {
      case 'normal':
        return {
          title: 'Normal Distribution',
          description: 'The normal distribution, also known as the Gaussian distribution, is a continuous probability distribution that is symmetric around its mean. It is characterized by the bell-shaped curve.',
          formula: 'f(x) = (1/(σ√(2π))) * e^(-(x-μ)^2/(2σ^2))',
          parameters: [
            { name: 'μ (mean)', description: 'The central value around which the distribution is symmetric' },
            { name: 'σ (standard deviation)', description: 'Controls the spread of the distribution' }
          ],
          applications: [
            'Natural phenomena like heights, weights, and IQ scores',
            'Statistical inference and hypothesis testing',
            'Error analysis and quality control'
          ],
          properties: [
            'Bell-shaped and symmetric around the mean',
            '68-95-99.7 rule: About 68% of data falls within 1σ of the mean, 95% within 2σ, and 99.7% within 3σ',
            'Mean, median, and mode are all equal'
          ]
        };

      case 'binomial':
        return {
          title: 'Binomial Distribution',
          description: 'The binomial distribution models the number of successes in a fixed number of independent Bernoulli trials, each with the same probability of success.',
          formula: 'P(k) = C(n,k) * p^k * (1-p)^(n-k)',
          parameters: [
            { name: 'n (number of trials)', description: 'The total number of independent trials' },
            { name: 'p (probability of success)', description: 'The probability of success on each trial' }
          ],
          applications: [
            'Quality control and acceptance sampling',
            'Survey sampling and opinion polls',
            'Game theory and decision making'
          ],
          properties: [
            'Discrete distribution with possible values 0, 1, 2, ..., n',
            'Mean = np, Variance = np(1-p)',
            'Approximates to normal distribution for large n when np and n(1-p) are both greater than 5'
          ]
        };

      case 'poisson':
        return {
          title: 'Poisson Distribution',
          description: 'The Poisson distribution models the number of events occurring in a fixed interval of time or space, given that these events occur with a known constant mean rate and independently of the time since the last event.',
          formula: 'P(k) = (λ^k * e^(-λ))/k!',
          parameters: [
            { name: 'λ (lambda)', description: 'The average rate at which events occur' }
          ],
          applications: [
            'Call center traffic modeling',
            'Accident rates and insurance claims',
            'Radioactive decay and particle physics',
            'Website traffic analysis'
          ],
          properties: [
            'Discrete distribution with possible values 0, 1, 2, ...',
            'Mean = λ, Variance = λ',
            'Approximates to binomial distribution when n is large and p is small with λ = np'
          ]
        };

      case 'exponential':
        return {
          title: 'Exponential Distribution',
          description: 'The exponential distribution is a continuous probability distribution that models the time between events in a Poisson process.',
          formula: 'f(x) = λe^(-λx) for x ≥ 0',
          parameters: [
            { name: 'λ (rate parameter)', description: 'The average number of events per unit time' }
          ],
          applications: [
            'Reliability engineering and survival analysis',
            'Queueing theory and service times',
            'Telecommunications and network modeling',
            'Financial risk assessment'
          ],
          properties: [
            'Memoryless property: P(X > s + t | X > s) = P(X > t)',
            'Mean = 1/λ, Variance = 1/λ²',
            'Skewed to the right with a long tail'
          ]
        };

      default:
        return {
          title: 'Unknown Distribution',
          description: 'No information available.',
          formula: '',
          parameters: [],
          applications: [],
          properties: []
        };
    }
  };

  const info = getDistributionInfo();

  return (
    <div className="distribution-info">
      <h3>{info.title}</h3>
      
      <div className="info-section">
        <h4>Description</h4>
        <p>{info.description}</p>
      </div>

      {info.formula && (
        <div className="info-section">
          <h4>Probability Formula</h4>
          <div className="formula">{info.formula}</div>
        </div>
      )}

      {info.parameters.length > 0 && (
        <div className="info-section">
          <h4>Parameters</h4>
          <ul>
            {info.parameters.map((param, index) => (
              <li key={index}>
                <strong>{param.name}:</strong> {param.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {info.properties.length > 0 && (
        <div className="info-section">
          <h4>Key Properties</h4>
          <ul>
            {info.properties.map((property, index) => (
              <li key={index}>{property}</li>
            ))}
          </ul>
        </div>
      )}

      {info.applications.length > 0 && (
        <div className="info-section">
          <h4>Common Applications</h4>
          <ul>
            {info.applications.map((app, index) => (
              <li key={index}>{app}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DistributionInfo;