import React from 'react';
import {Select} from 'antd';

const DatacenterSelector = ({datacenters, value, onChange}) => (
  <Select
    placeholder="Центр данных"
    mode="multiple"
    style={{width: 200, marginRight: 10}}
    onChange={onChange}
    value={value}
    // allowClear
  >
    {datacenters.map((dc) => (
      <Select.Option key={dc.id} value={dc.id}>
        {dc.title}
      </Select.Option>
    ))}
  </Select>
);

export default DatacenterSelector;
