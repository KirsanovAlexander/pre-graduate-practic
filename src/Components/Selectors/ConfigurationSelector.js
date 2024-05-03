import React from 'react';
import {Select} from 'antd';

const ConfigurationSelector = ({configurations, value, onChange}) => (
  <Select
    placeholder="Конфигурация"
    style={{width: 200, marginRight: 10}}
    onChange={onChange}
    value={value}
    allowClear
  >
    {configurations.map((config) => (
      <Select.Option key={config.id} value={config.id}>
        {config.title}
      </Select.Option>
    ))}
  </Select>
);

export default ConfigurationSelector;
