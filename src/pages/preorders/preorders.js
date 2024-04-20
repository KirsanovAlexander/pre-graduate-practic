import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select, Input, Button } from 'antd';

const { Option } = Select;

const Preorders = () => {
  const [preorders, setPreorders] = useState([]);
  const [filteredPreorders, setFilteredPreorders] = useState([]);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('preorderFilters');
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          preorderType: '',
          environmentId: '',
          isReplication: '',
          status: '',
          regNumber: '',
        };
  });

  useEffect(() => {
    async function fetchPreorders() {
      try {
        const response = await fetch('http://localhost:3001/preorders');
        const data = await response.json();
        setPreorders(data);
        setFilteredPreorders(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPreorders();
  }, []);

  const handleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filteredData = [...preorders];

    Object.keys(filters).forEach((key) => {
      if (key === 'datacenterIds') {
        if (filters[key].length > 0) {
          filteredData = filteredData.filter((item) => {
            if (Array.isArray(item[key])) {
              return filters[key].every((val) => item[key].includes(val));
            }
            return false;
          });
        }
      } else if (key === 'isReplication') {
        if (filters[key] !== '') {
          filteredData = filteredData.filter((item) => String(item[key]) === filters[key]);
        }
      } else if (filters[key]) {
        if (key === 'regNumber') {
          filteredData = filteredData.filter((item) =>
            item[key].toLowerCase().includes(filters[key].toLowerCase()),
          );
        } else {
          filteredData = filteredData.filter(
            (item) => String(item[key]).toLowerCase() === filters[key].toLowerCase(),
          );
        }
      }
    });

    setFilteredPreorders(filteredData);
  };

  return (
    <div>
      <h2>Потребности</h2>
      <div>
        <Input
          placeholder="Reg Number"
          value={filters.regNumber}
          onChange={(e) => handleChange(e.target.value, 'regNumber')}
          style={{ marginRight: '8px', marginBottom: '8px', width: '120px' }}
        />
        <Select
          placeholder="Preorder Type"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => handleChange(value, 'preorderType')}>
          <Option value="">All</Option>
          <Option value="SERVER">Server</Option>
          <Option value="SHD">SHD</Option>
          <Option value="VIRTUALIZATION">Virtualization</Option>
        </Select>
        <Select
          placeholder="Environment ID"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => handleChange(value, 'environmentId')}>
          <Option value="">All</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
        </Select>
        <Select
          placeholder="Is Replication"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => handleChange(value, 'isReplication')}>
          <Option value="">All</Option>
          <Option value="true">True</Option>
          <Option value="false">False</Option>
        </Select>
        <Select
          placeholder="Status"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => handleChange(value, 'status')}>
          <Option value="">All</Option>
          <Option value="NEW">New</Option>
          <Option value="APPROVED">Approved</Option>
          <Option value="IN_WORK">In Work</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELED">Canceled</Option>
        </Select>

        <Button
          onClick={() =>
            setFilters({
              preorderType: '',
              environmentId: '',
              isReplication: '',
              status: '',
              regNumber: '',
            })
          }
          type="primary"
          size={50}>
          Сбросить фильтры
        </Button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">ID</th>
              <th className="table-cell">Reg Number</th>
              <th className="table-cell">Preorder Type</th>
              <th className="table-cell">Configuration ID</th>
              <th className="table-cell">Environment ID</th>
              <th className="table-cell">Datacenter IDs</th>
              <th className="table-cell">Is Replication</th>
              <th className="table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPreorders.map((preorder) => (
              <tr key={preorder.id}>
                <td className="table-cell">{preorder.id}</td>
                <td className="table-cell">
                  <Link className="link" to={`/preorders/${preorder.id}`}>
                    {preorder.regNumber}
                  </Link>
                </td>
                <td className="table-cell">{preorder.preorderType}</td>
                <td className="table-cell">{preorder.configurationId}</td>
                <td className="table-cell">{preorder.environmentId}</td>
                <td className="table-cell">{preorder.datacenterIds.join(', ')}</td>
                <td className="table-cell">{preorder.isReplication.toString()}</td>
                <td className="table-cell">{preorder.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Preorders;
