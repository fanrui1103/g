import React, { useState } from 'react';
import { DataPoint, FileUploadOptions } from '../types/data';

interface FileUploaderProps {
  onDataLoaded: (data: DataPoint[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<FileUploadOptions>({
    delimiter: ',',
    hasHeaders: true,
  });
  const [columns, setColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<DataPoint[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setColumns([]);
      setPreviewData([]);
      
      // 检查文件类型
      const validTypes = ['text/csv', '.csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(file.type) && (!fileExtension || !['csv', 'xlsx', 'xls'].includes(fileExtension))) {
        setError('请上传CSV或Excel文件');
        setSelectedFile(null);
        return;
      }
      
      // 读取CSV文件（简化版，实际应用中可能需要更复杂的解析逻辑或库）
      if (file.type === 'text/csv' || fileExtension === 'csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          parseCSV(content);
        };
        reader.readAsText(file);
      } else {
        // 对于Excel文件，这里简化处理，实际应用中可能需要使用如SheetJS等库
        setError('Excel文件解析功能正在开发中，请使用CSV文件');
      }
    }
  };

  const parseCSV = (content: string) => {
    try {
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) {
        setError('文件内容为空');
        return;
      }

      // 解析表头
      const headerLine = lines[0];
      const headers = headerLine.split(options.delimiter || ',').map(header => header.trim());
      setColumns(headers);
      
      // 设置默认列（如果有表头）
      if (options.hasHeaders && headers.length > 0) {
        setOptions(prev => ({ ...prev, column: headers[0] }));
      }

      // 解析数据行
      const dataPoints: DataPoint[] = [];
      const startLine = options.hasHeaders ? 1 : 0;
      
      for (let i = startLine; i < lines.length; i++) {
        const values = lines[i].split(options.delimiter || ',');
        if (options.column && options.hasHeaders) {
          const columnIndex = headers.indexOf(options.column);
          if (columnIndex >= 0 && values[columnIndex]) {
            const value = parseFloat(values[columnIndex]);
            if (!isNaN(value)) {
              dataPoints.push({ x: dataPoints.length + 1, y: value });
            }
          }
        } else if (values[0]) {
          // 没有表头或没有选择列时，使用第一列
          const value = parseFloat(values[0]);
          if (!isNaN(value)) {
            dataPoints.push({ x: dataPoints.length + 1, y: value });
          }
        }
      }

      setPreviewData(dataPoints.slice(0, 10)); // 只显示前10条数据作为预览
    } catch (err) {
      setError('文件解析错误：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setOptions(prev => ({
      ...prev,
      [name]: target.type === 'checkbox' ? target.checked : value
    }));
    
    // 如果改变了列或分隔符，重新解析文件
    if (selectedFile && ['column', 'delimiter', 'hasHeaders'].includes(name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseCSV(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleLoadData = () => {
    if (previewData.length > 0) {
      onDataLoaded(previewData);
    } else {
      setError('没有可加载的数据');
    }
  };

  return (
    <div className="file-uploader">
      <h3>文件上传</h3>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="file-input"
        />
        
        {selectedFile && (
          <div className="file-info">
            <span>已选择文件：{selectedFile.name}</span>
          </div>
        )}
      </div>

      {selectedFile && columns.length > 0 && (
        <div className="file-options">
          <div className="option-group">
            <label>
              <input
                type="checkbox"
                name="hasHeaders"
                checked={options.hasHeaders}
                onChange={handleOptionChange}
              />
              文件包含表头
            </label>
          </div>
          
          <div className="option-group">
            <label htmlFor="delimiter">分隔符：</label>
            <select
              id="delimiter"
              name="delimiter"
              value={options.delimiter}
              onChange={handleOptionChange}
            >
              <option value=",">逗号 (,)</option>
              <option value=";">分号 (;)</option>
              <option value="\t">制表符 (Tab)</option>
            </select>
          </div>

          {options.hasHeaders && (
            <div className="option-group">
              <label htmlFor="column">选择数据列：</label>
              <select
                id="column"
                name="column"
                value={options.column || ''}
                onChange={handleOptionChange}
              >
                {columns.map((column, index) => (
                  <option key={index} value={column}>{column}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

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
              {previewData.map((point, index) => (
                <tr key={index}>
                  <td>{point.x}</td>
                  <td>{point.y?.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="load-data-btn"
            onClick={handleLoadData}
          >
            加载数据
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default FileUploader;