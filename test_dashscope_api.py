#!/usr/bin/env python3
# test_dashscope_api.py - 用于测试DashScope API密钥的有效性

import sys
import requests
import json

def test_dashscope_api(api_key):
    """测试DashScope API连接并显示详细结果"""
    print("正在测试DashScope API连接...")
    print(f"使用API密钥: {api_key[:5]}****{api_key[-5:]}")
    
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "qwen-turbo",
        "input": {
            "messages": [
                {"role": "user", "content": "Hello, test connection"}
            ]
        }
    }
    
    try:
        # 设置超时时间为10秒
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        print(f"\nHTTP状态码: {response.status_code}")
        
        # 尝试解析响应内容
        try:
            response_json = response.json()
            print("响应内容 (JSON):")
            print(json.dumps(response_json, ensure_ascii=False, indent=2))
        except json.JSONDecodeError:
            print("响应内容 (文本):")
            print(response.text)
            
        # 分析结果
        if response.status_code == 200:
            print("\n✅ 测试成功！API密钥有效。")
            return True
        elif response.status_code == 401:
            print("\n❌ 测试失败：认证失败")
            print("可能的原因：API密钥无效或已过期。")
            print("请检查您输入的API密钥是否正确，并确认它在阿里云DashScope控制台中是有效的。")
        elif response.status_code == 403:
            print("\n❌ 测试失败：访问被拒绝")
            print("可能的原因：API密钥没有足够的权限或账户余额不足。")
            print("请检查您的阿里云账户状态和API使用配额。")
        elif response.status_code == 429:
            print("\n❌ 测试失败：请求过多")
            print("可能的原因：API调用频率超过了限制。")
            print("请稍后再试，或联系阿里云增加您的配额。")
        elif 500 <= response.status_code < 600:
            print("\n❌ 测试失败：服务器错误")
            print("可能的原因：DashScope服务暂时不可用。")
            print("请稍后再试，或检查阿里云服务状态公告。")
        else:
            print("\n❌ 测试失败：未知错误")
            print(f"状态码: {response.status_code}")
    except requests.exceptions.Timeout:
        print("\n❌ 测试失败：连接超时")
        print("可能的原因：网络连接缓慢或不稳定。")
        print("请检查您的网络连接，或尝试使用其他网络。")
    except requests.exceptions.ConnectionError:
        print("\n❌ 测试失败：连接错误")
        print("可能的原因：无法连接到DashScope API服务器。")
        print("请检查您的网络连接和防火墙设置，确保允许访问 https://dashscope.aliyuncs.com")
    except Exception as e:
        print(f"\n❌ 测试失败：发生未知错误")
        print(f"错误信息: {str(e)}")
    
    print("\n请参考DASHSCOPE_API_TROUBLESHOOTING.md文件了解更多解决方案。")
    return False

def main():
    """主函数"""
    print("=== DashScope API密钥测试工具 ===")
    
    # 检查命令行参数
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        # 交互式输入API密钥
        api_key = input("请输入您的DashScope API密钥: ")
    
    if not api_key:
        print("错误：API密钥不能为空")
        sys.exit(1)
    
    test_dashscope_api(api_key)

if __name__ == "__main__":
    main()