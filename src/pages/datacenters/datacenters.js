import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm, message} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchFilteredDatacentersAsync,
  setPage,
  deleteDatacenterAsync,
} from '../../redux/datacentersSlice';
import {DeleteOutlined} from '@ant-design/icons';
import debounce from 'lodash/debounce'; 

const {Column} = Table;

const Datacenters = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data, loading} = useSelector((state) => state.datacenters);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchFilteredDatacentersAsync());

    const debouncedSearch = debounce((value) => {
      dispatch(fetchFilteredDatacentersAsync(value));
    }, 2000);

    debouncedSearch(searchText);

    return () => debouncedSearch.cancel();
  }, [searchText, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchFilteredDatacentersAsync());
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
        onChange={handleSearchChange}
        value={searchText}
        style={{width: 300, marginBottom: 16}}
        allowClear
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
          pageSizeOptions: ['5', '10', '15', '20'],
          defaultPageSize: 10,
          showSizeChanger: true,
          onChange: handlePageChange,
          onShowSizeChange: handlePageChange,
          total: data.length,
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
