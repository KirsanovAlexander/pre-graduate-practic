import React, { useEffect, useState } from 'react';
import { Typography, Input, Table } from 'antd';
import { Link } from 'react-router-dom';

const { Column } = Table;

const Environments = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/environments');
      const jsonData = await response.json();
      setData(jsonData);
      setCount(jsonData.length);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
    const formattedValue = value.trim().toLowerCase();
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/environments`);
      const jsonData = await response.json();
      const filteredData = jsonData.filter(
        (item) =>
          item.title.toLowerCase().includes(formattedValue) ||
          item.code.toLowerCase().includes(formattedValue),
      );
      setData(filteredData);
      setCount(filteredData.length);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Typography.Title level={5}>Среды</Typography.Title>
      <Input.Search
        placeholder="Начните ввод названия или кода"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchValue}
        style={{ width: 300, marginBottom: 16 }}
      />
      <div className="countData">Найдено: {count}</div>
      <Table
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.id}>
        <Column title="ID" dataIndex="id" key="id" width={100} />
        <Column title="Title" dataIndex="title" key="title" width={200} />
        <Column
          title="Code"
          dataIndex="code"
          key="code"
          width={200}
          render={(text, record) => <Link to={`/environments/${record.id}`}>{text}</Link>}
        />
        <Column title="Description" dataIndex="description" key="description" width={600} />
      </Table>
    </>
  );
};

export default Environments;
