import React from 'react';
import {Select} from 'antd';

const StatusSelector = ({value, onChange}) => (
  <Select
    placeholder="Статус"
    style={{width: 200, marginRight: 10}}
    onChange={onChange}
    value={value}
    allowClear
  >
    <Select.Option value="NEW">New</Select.Option>
    <Select.Option value="APPROVED">Approved</Select.Option>
    <Select.Option value="IN_WORK">In Work</Select.Option>
    <Select.Option value="COMPLETED">Completed</Select.Option>
    <Select.Option value="CANCELED">Canceled</Select.Option>
  </Select>
);

export default StatusSelector;
