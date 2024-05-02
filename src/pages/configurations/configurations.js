import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchConfigurationsDataAsync,
  fetchFilteredConfigurationsAsync,
  setPage,
  deleteConfigurationAsync,
} from '../../redux/configurationsSlice';
import {DeleteOutlined} from '@ant-design/icons';
import {message} from 'antd';

const {Column} = Table;

const Configurations = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data, loading, page, pageSize} = useSelector((state) => state.configurations);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 2000); 
    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchConfigurationsDataAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFilteredConfigurationsAsync(debouncedSearchText));
  }, [debouncedSearchText, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchConfigurationsDataAsync());
  };

  const handleCreateNewConfiguration = () => {
    history.push('/configurations/new');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteConfigurationAsync(id));
      message.success('Запись успешно удалена');
    } catch (error) {
      message.error('Ошибка при удалении записи');
    }
  };

  return (
    <>
      <Typography.Title level={5}>Конфигурации</Typography.Title>
      <div>
        <Input.Search
          placeholder="Начните ввод названия или кода"
          onSearch={() => dispatch(fetchConfigurationsDataAsync(searchText))}
          onChange={handleSearchChange}
          value={searchText}
          style={{width: 300, marginBottom: 16}}
        />
        <Button
          type="primary"
          style={{marginBottom: 16, marginLeft: 550}}
          onClick={handleCreateNewConfiguration}>
          Создать новую конфигурацию
        </Button>
      </div>
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
        <Column title="ID" dataIndex="id" key="id" width={70} />
        <Column title="Название" dataIndex="title" key="title" width={300} />
        <Column
          title="Код"
          dataIndex="code"
          key="code"
          width={250}
          render={(text, record) => <Link to={`/configurations/${record.id}`}>{text}</Link>}
        />
        <Column title="Описание" dataIndex="description" key="description" />
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

export default Configurations;
