import React, { useState } from 'react';

/**
 * 网站分享按钮组件
 * 提供复制分享链接和显示分享提示功能
 */
const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // 网站分享链接
  const websiteUrl = 'https://fanrui1103.github.io/c/';
  
  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteUrl).then(() => {
      setCopied(true);
      // 3秒后重置复制状态
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error('复制失败:', err);
      // 降级方案：选中文本让用户手动复制
      const tempInput = document.createElement('input');
      tempInput.value = websiteUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };
  
  return (
    <div className="share-button-container" 
         onMouseEnter={() => setShowTooltip(true)}
         onMouseLeave={() => setShowTooltip(false)}>
      
      {/* 分享按钮 */}
      <button 
        className={`share-button ${copied ? 'copied' : ''}`}
        onClick={copyToClipboard}
        title="复制分享链接"
      >
        {copied ? '已复制!' : '分享网站'}
      </button>
      
      {/* 分享提示工具框 */}
      {showTooltip && (
        <div className="share-tooltip">
          <p>网站链接：{websiteUrl}</p>
          <p className="share-tip">点击按钮复制链接，然后分享给朋友！</p>
          <p className="share-note">提示：确保分享完整链接，包括末尾的斜杠(/)。</p>
        </div>
      )}
      
      {/* 内联样式 */}
      <style jsx>{`
        .share-button-container {
          position: relative;
          display: inline-block;
        }
        
        .share-button {
          background-color: #4a6cf7;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .share-button:hover {
          background-color: #3554d1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
        }
        
        .share-button:active {
          transform: translateY(0);
        }
        
        .share-button.copied {
          background-color: #28a745;
        }
        
        .share-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
          background-color: #333;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .share-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #333;
        }
        
        .share-tooltip p {
          margin: 0 0 6px 0;
        }
        
        .share-tooltip p:last-child {
          margin-bottom: 0;
        }
        
        .share-tip {
          font-style: italic;
          opacity: 0.9;
        }
        
        .share-note {
          font-size: 11px;
          opacity: 0.8;
          color: #ccc;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
          .share-button {
            padding: 8px 12px;
            font-size: 12px;
          }
          
          .share-tooltip {
            font-size: 11px;
            padding: 10px 12px;
            white-space: normal;
            width: 240px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ShareButton;