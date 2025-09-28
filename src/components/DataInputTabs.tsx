import React, { useState } from 'react';
import FileUploader from './FileUploader';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import { DataInputMethod, DataPoint } from '../types/data';

interface DataInputTabsProps {
  onDataGenerated: (data: DataPoint[]) => void;
}

const DataInputTabs: React.FC<DataInputTabsProps> = ({ onDataGenerated }) => {
  const [activeTab, setActiveTab] = useState<DataInputMethod>('file');

  const handleTabChange = (tab: DataInputMethod) => {
    setActiveTab(tab);
  };

  return (
    <div className="data-input-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => handleTabChange('file')}
        >
          文件上传
        </button>
        <button
          className={`tab-button ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => handleTabChange('distribution')}
        >
          分布生成
        </button>
        <button
          className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => handleTabChange('ai')}
        >
          AI生成数据
        </button>
      </div>
      
      <div className="tabs-content">
        {activeTab === 'file' && (
          <FileUploader onDataLoaded={onDataGenerated} />
        )}
        {activeTab === 'distribution' && (
          <DistributionGenerator onDataGenerated={onDataGenerated} />
        )}
        {activeTab === 'ai' && (
          <AIDataGenerator onDataGenerated={onDataGenerated} />
        )}
      </div>
    </div>
  );
};

export default DataInputTabs;