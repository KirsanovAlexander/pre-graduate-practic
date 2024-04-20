import React, { useEffect, useState } from 'react';
import { Typography, Input, Table, Modal, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Column } = Table;

const Datacenters = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedDatacenter, setSelectedDatacenter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/datacenters');
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
    const formattedValue = value.toLocaleLowerCase();
    setSearchValue(value);
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/datacenters`);
      const jsonData = await response.json();
      const filteredData = jsonData.filter(
        (item) =>
          item.title.toLocaleLowerCase().includes(formattedValue) ||
          item.code.toLocaleLowerCase().includes(formattedValue),
      );
      setData(filteredData);
      setCount(filteredData.length);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCodeClick = (record) => {
    setSelectedDatacenter(record);
    setFormData({
      id: record.id,
      title: record.title,
      code: record.code,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateDatacenter = async () => {
    try {
      const response = await fetch(`http://localhost:3001/datacenters/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedData = data.map((item) => {
          if (item.id === formData.id) {
            return formData;
          }
          return item;
        });
        setData(updatedData);
        setModalVisible(false);
      } else {
        console.error('Ошибка обновления данных на сервере');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleSave = () => {
    updateDatacenter();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Typography.Title level={5}>Дата-центры</Typography.Title>
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
        <Column title="Title" dataIndex="title" key="title" width={300} />
        <Column
          title="Code"
          dataIndex="code"
          key="code"
          width={600}
          render={(text, record) => (
            <Link to="#" onClick={() => handleCodeClick(record)}>
              {text}
            </Link>
          )}
        />
      </Table>
      {modalVisible && selectedDatacenter && (
        <Modal
          title="Изменить данные дата-центра"
          visible={modalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Отменить
            </Button>,
            <Button key="save" type="primary" onClick={handleSave}>
              Сохранить
            </Button>,
          ]}>
          <div>
            <p>
              ID:
              <Input name="id" value={formData.id} disabled />
            </p>
            <p>
              Title:
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </p>
            <p>
              Code:
              <Input name="code" value={formData.code} onChange={handleInputChange} />
            </p>
            <p>
              Description:
              <Input name="description" value={formData.description} onChange={handleInputChange} />
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Datacenters;
