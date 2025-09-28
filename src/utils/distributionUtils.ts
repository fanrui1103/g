import * as math from 'mathjs';

/**
 * Calculates the probability density function (PDF) for the normal distribution
 * @param x The value at which to evaluate the PDF
 * @param mean The mean (μ) of the distribution
 * @param stdDev The standard deviation (σ) of the distribution
 * @returns The probability density at x
 */
export const normalPDF = (x: number, mean: number = 0, stdDev: number = 1): number => {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return coefficient * Math.exp(exponent);
};

/**
 * Calculates the cumulative distribution function (CDF) for the normal distribution
 * @param x The value at which to evaluate the CDF
 * @param mean The mean (μ) of the distribution
 * @param stdDev The standard deviation (σ) of the distribution
 * @returns The cumulative probability up to x
 */
export const normalCDF = (x: number, mean: number = 0, stdDev: number = 1): number => {
  // Using the error function to calculate the normal CDF
  return 0.5 * (1 + math.erf((x - mean) / (stdDev * Math.sqrt(2))));
};

/**
 * Calculates the probability mass function (PMF) for the binomial distribution
 * @param k The number of successes
 * @param n The number of trials
 * @param p The probability of success on a single trial
 * @returns The probability of getting exactly k successes in n trials
 */
export const binomialPMF = (k: number, n: number, p: number): number => {
  if (k < 0 || k > n || p < 0 || p > 1) {
    return 0;
  }
  return math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

/**
 * Calculates the cumulative distribution function (CDF) for the binomial distribution
 * @param k The number of successes
 * @param n The number of trials
 * @param p The probability of success on a single trial
 * @returns The probability of getting at most k successes in n trials
 */
export const binomialCDF = (k: number, n: number, p: number): number => {
  if (k < 0) return 0;
  if (k >= n) return 1;
  
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += binomialPMF(i, n, p);
  }
  return sum;
};

/**
 * Calculates the probability mass function (PMF) for the Poisson distribution
 * @param k The number of events
 * @param lambda The average rate of occurrence
 * @returns The probability of observing exactly k events
 */
export const poissonPMF = (k: number, lambda: number): number => {
  if (k < 0 || lambda <= 0) {
    return 0;
  }
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k);
};

/**
 * Calculates the cumulative distribution function (CDF) for the Poisson distribution
 * @param k The number of events
 * @param lambda The average rate of occurrence
 * @returns The probability of observing at most k events
 */
export const poissonCDF = (k: number, lambda: number): number => {
  if (k < 0) return 0;
  
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += poissonPMF(i, lambda);
  }
  return sum;
};

/**
 * Calculates the probability density function (PDF) for the exponential distribution
 * @param x The value at which to evaluate the PDF
 * @param rate The rate parameter (λ)
 * @returns The probability density at x
 */
export const exponentialPDF = (x: number, rate: number = 1): number => {
  if (x < 0 || rate <= 0) {
    return 0;
  }
  return rate * Math.exp(-rate * x);
};

/**
 * Calculates the cumulative distribution function (CDF) for the exponential distribution
 * @param x The value at which to evaluate the CDF
 * @param rate The rate parameter (λ)
 * @returns The cumulative probability up to x
 */
export const exponentialCDF = (x: number, rate: number = 1): number => {
  if (x < 0 || rate <= 0) {
    return 0;
  }
  return 1 - Math.exp(-rate * x);
};

/**
 * Generates random samples from the normal distribution
 * @param n The number of samples to generate
 * @param mean The mean (μ) of the distribution
 * @param stdDev The standard deviation (σ) of the distribution
 * @returns An array of random samples
 */
export const generateNormalSamples = (n: number, mean: number = 0, stdDev: number = 1): number[] => {
  const samples: number[] = [];
  // Using the Box-Muller transform to generate normally distributed random numbers
  for (let i = 0; i < n; i += 2) {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    
    samples.push(z1 * stdDev + mean);
    if (i + 1 < n) {
      samples.push(z2 * stdDev + mean);
    }
  }
  return samples;
};

/**
 * Generates random samples from the binomial distribution
 * @param n The number of samples to generate
 * @param trials The number of trials per sample
 * @param p The probability of success on a single trial
 * @returns An array of random samples
 */
export const generateBinomialSamples = (n: number, trials: number, p: number): number[] => {
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    let successes = 0;
    for (let j = 0; j < trials; j++) {
      if (Math.random() < p) {
        successes++;
      }
    }
    samples.push(successes);
  }
  return samples;
};

/**
 * Generates random samples from the Poisson distribution
 * @param n The number of samples to generate
 * @param lambda The average rate of occurrence
 * @returns An array of random samples
 */
export const generatePoissonSamples = (n: number, lambda: number): number[] => {
  const samples: number[] = [];
  // Using the Knuth's algorithm for generating Poisson random numbers
  for (let i = 0; i < n; i++) {
    let k = 0;
    let p = 1;
    const L = Math.exp(-lambda);
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    samples.push(k - 1);
  }
  return samples;
};

/**
 * Generates random samples from the exponential distribution
 * @param n The number of samples to generate
 * @param rate The rate parameter (λ)
 * @returns An array of random samples
 */
export const generateExponentialSamples = (n: number, rate: number = 1): number[] => {
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    // Using the inverse transform method
    samples.push(-Math.log(1 - Math.random()) / rate);
  }
  return samples;
};