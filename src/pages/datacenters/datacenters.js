import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm, message} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchFilteredDatacentersAsync,
  fetchDatacentersDataAsync,
  setPage,
  deleteDatacenterAsync,
} from '../../redux/datacentersSlice';
import {DeleteOutlined} from '@ant-design/icons';

const {Column} = Table;

const Datacenters = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data, loading, page, pageSize} = useSelector((state) => state.datacenters);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 2000); 

    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchDatacentersDataAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFilteredDatacentersAsync(debouncedSearchText));
  }, [debouncedSearchText, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchDatacentersDataAsync());
  };

  const handleCreateNewDatacenter = () => {
    history.push('/datacenters/new');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDatacenterAsync(id));
      message.success('Запись успешно удалена');
    } catch (error) {
      message.error('Ошибка при удалении записи');
    }
  };

  return (
    <>
      <Typography.Title level={5}>Дата-центры</Typography.Title>
      <Input.Search
        placeholder="Введите название или код датацентра"
        onSearch={() => dispatch(fetchFilteredDatacentersAsync(searchText))}
        onChange={handleSearchChange}
        value={searchText}
        style={{width: 300, marginBottom: 16}}
      />
      <Button
        type="primary"
        style={{marginBottom: 16, marginLeft: 550}}
        onClick={handleCreateNewDatacenter}>
        Создать новый дата-центр
      </Button>
      <Table
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize,
          current: page,
          total: data.length,
          onChange: handlePageChange,
        }}
        rowKey={(record) => record.id}>
        <Column title="ID" dataIndex="id" key="id" width={100} />
        <Column title="Название" dataIndex="title" key="title" width={300} />
        <Column
          title="Код"
          dataIndex="code"
          key="code"
          width={600}
          render={(text, record) => <Link to={`/datacenters/${record.id}`}>{text}</Link>}
        />
        <Column
          title="Удаление"
          key="action"
          width={100}
          render={(text, record) => (
            <Popconfirm
              title="Вы уверены, что хотите удалить эту запись?"
              onConfirm={() => handleDelete(record.id)}
              okText="Да"
              cancelText="Отмена">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        />
      </Table>
    </>
  );
};

export default Datacenters;
