import React from 'react';
import {Select} from 'antd';

const EnvironmentSelector = ({environments, value, onChange}) => (
  <Select
    placeholder="Среда"
    style={{width: 200, marginRight: 10}}
    onChange={onChange}
    value={value}
    allowClear
  >
    {environments.map((env) => (
      <Select.Option key={env.id} value={env.id}>
        {env.title}
      </Select.Option>
    ))}
  </Select>
);

export default EnvironmentSelector;
