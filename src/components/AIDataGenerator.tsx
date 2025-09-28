import React, { useState } from 'react';
import { DataPoint, AIDataGenerationOptions } from '../types/data';
import aiService from '../services/AIService';

interface AIDataGeneratorProps {
  onDataGenerated: (data: DataPoint[]) => void;
}

const AIDataGenerator: React.FC<AIDataGeneratorProps> = ({ onDataGenerated }) => {
  const [options, setOptions] = useState<AIDataGenerationOptions>({
    description: '',
    sampleSize: 100,
    dataType: 'numerical'
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<DataPoint[]>([]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateData = async () => {
    if (!options.description.trim()) {
      setError('请输入数据描述');
      return;
    }

    setGenerating(true);
    setError(null);
    setPreviewData([]);

    try {
      // 检查是否已配置AI服务
      if (aiService.getIsConfigured()) {
        // 使用真实的AI服务生成数据
          const dataPoints = await aiService.generateDataByDescription(
            options.description,
            options.sampleSize,
            options.dataType || 'numerical'
          );
        setPreviewData(dataPoints);
      } else {
        // 如果没有配置AI服务，使用模拟数据
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        const dataPoints = generateMockDataBasedOnDescription(options);
        setPreviewData(dataPoints);
        setError('使用模拟数据，因为AI服务尚未配置。请在设置中配置您的API密钥以使用真实AI。');
      }
    } catch (err) {
      setError('数据生成失败：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGenerating(false);
    }
  };

  // 基于描述生成模拟数据（作为AI服务的备用方案）
  const generateMockDataBasedOnDescription = (options: AIDataGenerationOptions): DataPoint[] => {
    const { description, sampleSize, dataType } = options;
    const dataPoints: DataPoint[] = [];

    // 这里是一个简单的模拟实现，实际应用中应该调用真实的AI API
    // 基于描述中的关键词来生成相应的数据
    const descriptionLower = description.toLowerCase();

    if (dataType === 'numerical') {
      // 生成数值型数据
      if (descriptionLower.includes('normal') || descriptionLower.includes('正态')) {
        // 模拟正态分布数据
        const mean = descriptionLower.includes('平均') || descriptionLower.includes('均值') 
          ? extractNumberFromDescription(description, '平均') || extractNumberFromDescription(description, '均值') || 50 
          : 50;
        const stdDev = descriptionLower.includes('标准差') || descriptionLower.includes('波动') 
          ? extractNumberFromDescription(description, '标准差') || extractNumberFromDescription(description, '波动') || 10 
          : 10;

        for (let i = 0; i < sampleSize; i++) {
          // 使用Box-Muller变换生成正态分布随机数
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          const value = (z * stdDev) + mean;
          dataPoints.push({ x: i + 1, y: value });
        }
      } else if (descriptionLower.includes('增长') || descriptionLower.includes('上升')) {
        // 模拟增长趋势数据
        const startValue = 10;
        const growthRate = 0.1;
        const noise = 2;
        
        for (let i = 0; i < sampleSize; i++) {
          const trend = startValue * Math.exp(growthRate * i / 20);
          const randomNoise = (Math.random() - 0.5) * 2 * noise;
          dataPoints.push({ x: i + 1, y: trend + randomNoise });
        }
      } else if (descriptionLower.includes('周期') || descriptionLower.includes('季节性')) {
        // 模拟周期性数据
        const amplitude = 10;
        const period = sampleSize / 5;
        const offset = 50;
        const noise = 2;
        
        for (let i = 0; i < sampleSize; i++) {
          const periodicValue = offset + amplitude * Math.sin((2 * Math.PI * i) / period);
          const randomNoise = (Math.random() - 0.5) * 2 * noise;
          dataPoints.push({ x: i + 1, y: periodicValue + randomNoise });
        }
      } else {
        // 默认生成均匀分布的数据
        const min = 0;
        const max = 100;
        for (let i = 0; i < sampleSize; i++) {
          const value = min + Math.random() * (max - min);
          dataPoints.push({ x: i + 1, y: value });
        }
      }
    } else if (dataType === 'categorical') {
      // 生成类别型数据（这里简化处理，转换为数值）
      const categories = ['A', 'B', 'C', 'D'];
      const categoryValues = { A: 10, B: 20, C: 30, D: 40 };
      
      for (let i = 0; i < sampleSize; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        dataPoints.push({ x: i + 1, y: categoryValues[category as keyof typeof categoryValues] });
      }
    } else if (dataType === 'timeSeries') {
      // 生成时间序列数据
      const startValue = 50;
      const trend = 0.1;
      const seasonality = 10;
      const noise = 2;
      
      for (let i = 0; i < sampleSize; i++) {
        const value = startValue + (trend * i) + 
          (seasonality * Math.sin((2 * Math.PI * i) / 20)) + 
          ((Math.random() - 0.5) * 2 * noise);
        dataPoints.push({ x: i + 1, y: value });
      }
    }

    return dataPoints;
  };

  // 从描述中提取数字（简单实现）
  const extractNumberFromDescription = (description: string, keyword: string): number | null => {
    const index = description.toLowerCase().indexOf(keyword);
    if (index === -1) return null;
    
    // 从关键词位置开始查找数字
    const substring = description.substring(index + keyword.length);
    const numberMatch = substring.match(/\d+(\.\d+)?/);
    
    return numberMatch ? parseFloat(numberMatch[0]) : null;
  };

  const handleUseData = () => {
    if (previewData.length > 0) {
      onDataGenerated(previewData);
    } else {
      setError('没有可使用的数据');
    }
  };

  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiTestStatus, setApiTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleApiKeySetup = () => {
    setShowApiSetup(true);
  };

  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      aiService.setApiKey(apiKey.trim());
      setShowApiSetup(false);
      setApiKey('');
    }
  };

  const handleApiTest = async () => {
    if (apiKey.trim()) {
      aiService.setApiKey(apiKey.trim());
      const result = await aiService.testConnection();
      setApiTestStatus(result);
    }
  };

  return (
    <div className="ai-data-generator">
      <div className="header-section">
        <h3>AI生成数据</h3>
        {!aiService.getIsConfigured() && (
          <button className="setup-api-btn" onClick={handleApiKeySetup}>
            配置AI API
          </button>
        )}
        {aiService.getIsConfigured() && (
          <span className="api-status-indicator">✅ AI已配置</span>
        )}
      </div>
      
      <div className="ai-options">
        <div className="option-group">
          <label htmlFor="description">数据描述：</label>
          <textarea
            id="description"
            name="description"
            value={options.description}
            onChange={handleOptionChange}
            placeholder="请描述您想要的数据，例如：生成100个均值为50，标准差为10的正态分布数据..."
            rows={4}
          />
          <small className="hint">提示：描述越详细，生成的数据越符合您的需求</small>
        </div>

        <div className="option-group">
          <label htmlFor="data-type">数据类型：</label>
          <select
            id="data-type"
            name="dataType"
            value={options.dataType}
            onChange={handleOptionChange}
          >
            <option value="numerical">数值型</option>
            <option value="categorical">类别型</option>
            <option value="timeSeries">时间序列</option>
          </select>
        </div>

        <div className="option-group">
          <label htmlFor="sample-size">样本大小：</label>
          <input
            id="sample-size"
            name="sampleSize"
            type="number"
            value={options.sampleSize}
            onChange={handleOptionChange}
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
          disabled={generating}
        >
          {generating ? '生成中...' : '生成数据'}
        </button>
        {aiService.getIsConfigured() && (
          <button className="config-api-btn" onClick={handleApiKeySetup}>
            修改AI配置
          </button>
        )}
      </div>

      {previewData.length > 0 && (
        <div className="data-preview">
          <h4>数据预览（前10条）</h4>
          <table>
            <thead>
              <tr>
                <th>索引</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              {previewData.slice(0, 10).map((point, index) => (
                <tr key={index}>
                  <td>{point.x}</td>
                  <td>{point.y?.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="use-data-btn"
            onClick={handleUseData}
          >
            使用这些数据
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="ai-info">
        <h4>使用说明</h4>
        <ul>
          <li>输入您想要的数据描述，包括数据特征、分布类型、范围等</li>
          <li>选择适当的数据类型</li>
          <li>设置样本大小</li>
          <li>点击生成按钮，AI将根据您的描述生成相应的数据</li>
          <li>预览数据后，点击"使用这些数据"将其加载到分析模块</li>
          {!aiService.getIsConfigured() && (
            <li>提示：点击"配置AI API"按钮设置API密钥，可使用真实的AI生成数据</li>
          )}
        </ul>
      </div>
      {/* API密钥配置弹窗 */}
      {showApiSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>配置AI API</h4>
              <button className="modal-close" onClick={() => setShowApiSetup(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="api-key">DashScope API 密钥：</label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="请输入您的DashScope API密钥"
                />
                <small className="form-hint">
                  从 <a href="https://dashscope.aliyun.com" target="_blank" rel="noopener noreferrer">阿里云DashScope</a> 获取API密钥
                  <br/>
                  <a href="DASHSCOPE_API_TROUBLESHOOTING.md" target="_blank" rel="noopener noreferrer">查看API连接故障排除指南</a>
                </small>
              </div>
              
              <div className="modal-actions">
                <button className="test-api-btn" onClick={handleApiTest}>
                  测试连接
                </button>
                <button className="save-api-btn" onClick={handleApiKeySave}>
                  保存配置
                </button>
                <button className="cancel-btn" onClick={() => setShowApiSetup(false)}>
                  取消
                </button>
              </div>
              
              {apiTestStatus && (
                <div className={`api-test-result ${apiTestStatus.success ? 'success' : 'error'}`}>
                  {apiTestStatus.message.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDataGenerator;