import React from 'react';
import {Select} from 'antd';

const PreorderTypeSelector = ({value, onChange}) => (
  <Select
    placeholder="Тип потребности"
    style={{width: 200, marginRight: 10}}
    onChange={onChange}
    value={value}
    allowClear
  >
    <Select.Option key="SERVER" value="SERVER">Server</Select.Option>
    <Select.Option key="SHD" value="SHD">SHD</Select.Option>
    <Select.Option key="VIRTUALIZATION" value="VIRTUALIZATION">Virtualization</Select.Option>
  </Select>
);

export default PreorderTypeSelector;
