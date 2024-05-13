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
    <Select.Option key="NEW" value="NEW">New</Select.Option>
    <Select.Option key="APPROVED" value="APPROVED">Approved</Select.Option>
    <Select.Option key="IN_WORK" value="IN_WORK">In Work</Select.Option>
    <Select.Option key="COMPLETED" value="COMPLETED">Completed</Select.Option>
    <Select.Option key="CANCELED" value="CANCELED">Canceled</Select.Option>
  </Select>
);

export default StatusSelector;
