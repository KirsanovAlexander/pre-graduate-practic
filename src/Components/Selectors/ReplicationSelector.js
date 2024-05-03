import React from 'react';
import {Select} from 'antd';

const ReplicationSelector = ({value, onChange}) => (
  <Select
    placeholder="Признак репликации"
    style={{width: 250, marginRight: 10}}
    onChange={onChange}
    value={value}
    allowClear
  >
    <Select.Option value="true">True</Select.Option>
    <Select.Option value="false">False</Select.Option>
  </Select>
);

export default ReplicationSelector;
