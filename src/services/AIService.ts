// AIService.ts - 实现真实的AI数据生成服务

class AIService {
  private apiKey: string | null = null;
  private baseUrl = '/api/dashscope/api/v1'; // 使用代理地址避免CORS问题
  private model = 'qwen-turbo';
  private isConfigured = false;

  constructor() {
    this.loadApiKey();
  }

  // 设置API密钥
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.isConfigured = true;
    localStorage.setItem('dashscope_api_key', apiKey);
  }

  // 从localStorage加载API密钥
  loadApiKey(): boolean {
    const savedKey = localStorage.getItem('dashscope_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      this.isConfigured = true;
    }
    return this.isConfigured;
  }

  // 测试API连接
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured || !this.apiKey) {
      return { success: false, message: '未配置API密钥，请从阿里云DashScope控制台获取有效的API密钥' };
    }

    try {
      // 添加重试机制，最多尝试2次
      let lastError = '';
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(`${this.baseUrl}/services/aigc/text-generation/generation`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: this.model,
              input: {
                messages: [
                  { role: 'user', content: 'Hello, test connection' }
                ]
              }
            })
          });

          if (response.ok) {
            return { success: true, message: '连接成功！您可以开始使用AI生成数据了' };
          } else {
            const error = await response.text();
            const errorMessage = this.parseApiError(response.status, error);
            lastError = errorMessage;
            
            // 如果是429（请求过多）或5xx（服务器错误），可以尝试重试
            if ([429, 500, 502, 503, 504].includes(response.status) && attempt < 2) {
              // 等待1秒后重试
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            
            return { success: false, message: errorMessage };
          }
        } catch (error) {
          const networkError = error instanceof Error ? error.message : String(error);
          lastError = `网络连接问题: ${networkError}。请检查您的网络连接和防火墙设置。`;
          
          // 网络错误也可以重试一次
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
      }
      
      return { success: false, message: lastError };
    } catch (error) {
      return { success: false, message: `连接测试时发生错误: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  // 解析API错误信息，提供更友好的错误提示
  private parseApiError(statusCode: number, errorText: string): string {
    // 尝试解析JSON错误信息
    let errorMessage = errorText;
    try {
      const errorObj = JSON.parse(errorText);
      if (errorObj.error && errorObj.error.message) {
        errorMessage = errorObj.error.message;
      } else if (errorObj.message) {
        errorMessage = errorObj.message;
      }
    } catch (e) {
      // 如果不是JSON格式，就使用原始错误文本
    }

    switch (statusCode) {
      case 401:
        return `认证失败 (401): API密钥无效或已过期。请确认您输入了正确的API密钥，并检查密钥是否在阿里云控制台有效。\n错误详情: ${errorMessage}`;
      case 403:
        return `访问被拒绝 (403): 您的API密钥没有足够的权限或账户余额不足。请检查您的阿里云账户状态和API使用配额。\n错误详情: ${errorMessage}`;
      case 429:
        return `请求过多 (429): 您的API调用频率超过了限制。请稍后再试，或联系阿里云增加您的配额。\n错误详情: ${errorMessage}`;
      case 500:
      case 502:
      case 503:
      case 504:
        return `服务器错误 (${statusCode}): DashScope服务暂时不可用。请稍后再试，或检查阿里云服务状态公告。\n错误详情: ${errorMessage}`;
      default:
        return `API错误 (${statusCode}): \n错误详情: ${errorMessage}\n请参考DASHSCOPE_API_TROUBLESHOOTING.md文件了解更多解决方案。`;
    }
  }

  // 根据描述生成数据
  async generateDataByDescription(
    description: string,
    sampleSize: number,
    dataType: string
  ): Promise<Array<{ x: number; y: number }>> {
    if (!this.isConfigured || !this.apiKey) {
      throw new Error('未配置API密钥，请先设置API密钥');
    }

    const prompt = this.generatePrompt(description, sampleSize, dataType);

    try {
      const response = await fetch(`${this.baseUrl}/services/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          input: {
            messages: [
              { role: 'user', content: prompt }
            ]
          },
          parameters: {
            result_format: 'text'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const aiText = result.output.text;
        return this.parseAITextToData(aiText, sampleSize);
      } else {
        const error = await response.text();
        throw new Error(`AI生成失败: ${response.status} - ${error}`);
      }
    } catch (error) {
      throw new Error(`生成数据时发生错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 生成AI提示词
  private generatePrompt(description: string, sampleSize: number, dataType: string): string {
    let dataTypeDescription = '';
    let formatInstructions = '';
    
    switch (dataType) {
      case 'numerical':
        dataTypeDescription = '数值型数据';
        formatInstructions = '只返回纯数字列表，每个数字占一行，不需要表头或说明文字';
        break;
      case 'categorical':
        dataTypeDescription = '类别型数据';
        formatInstructions = '请将类别映射为数字值，只返回纯数字列表，每个数字占一行，不需要表头或说明文字';
        break;
      case 'timeSeries':
        dataTypeDescription = '时间序列数据';
        formatInstructions = '只返回纯数字列表，每个数字占一行，不需要表头或说明文字';
        break;
      default:
        dataTypeDescription = '数据';
        formatInstructions = '只返回纯数字列表，每个数字占一行，不需要表头或说明文字';
    }

    return `根据以下描述生成${dataTypeDescription}：
"${description}"

要求：
- 生成${sampleSize}个数据点
- ${formatInstructions}
- 数据要符合描述中的特征
- 不要包含任何其他解释性文本`;
  }

  // 解析AI生成的文本为数据格式
  private parseAITextToData(aiText: string, expectedSize: number): Array<{ x: number; y: number }> {
    const lines = aiText.split('\n')
      .map(line => line.trim())
      .filter(line => line && !isNaN(parseFloat(line)));

    const data: Array<{ x: number; y: number }> = [];
    
    lines.forEach((line, index) => {
      const value = parseFloat(line);
      if (!isNaN(value)) {
        data.push({ x: index + 1, y: value });
      }
    });

    // 如果AI返回的数据点不足，用模拟数据填充
    if (data.length < expectedSize) {
      const remaining = expectedSize - data.length;
      const lastValue = data.length > 0 ? data[data.length - 1].y : 50;
      
      for (let i = 0; i < remaining; i++) {
        // 添加一些随机波动，保持数据的连贯性
        const variation = (Math.random() - 0.5) * 10;
        data.push({ x: data.length + 1, y: lastValue + variation });
      }
    }

    return data.slice(0, expectedSize);
  }

  // 获取是否已配置
  getIsConfigured(): boolean {
    return this.isConfigured;
  }

  // 清除API密钥
  clearApiKey(): void {
    this.apiKey = null;
    this.isConfigured = false;
    localStorage.removeItem('dashscope_api_key');
  }
}

// 导出单例实例
const aiService = new AIService();
export default aiService;