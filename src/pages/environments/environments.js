import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm, message, Skeleton} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchFilteredEnvironmentsAsync,
  setPage,
  deleteEnvironmentAsync,
} from '../../redux/environmentsSlice';
import {DeleteOutlined} from '@ant-design/icons';
import debounce from 'lodash/debounce'; 

const {Column} = Table;

const Environments = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data, loading} = useSelector((state) => state.environments);
  const [loadingPage, setLoadingPage] = useState(true); 
  const [loadingFilters, setLoadingFilters] = useState(false); 
  const [searchText, setSearchText] = useState('');

  setTimeout(() => {
    setLoadingPage(false);
  }, 1000);

  useEffect(() => {
    setLoadingFilters(true);
    const debouncedSearch = debounce((value) => {
      setTimeout(() => {
        setLoadingFilters(false);
      }, 1000); 
      dispatch(fetchFilteredEnvironmentsAsync(value));
    }, 1000); 

    debouncedSearch(searchText)

    return () => debouncedSearch.cancel();
  }, [searchText, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchFilteredEnvironmentsAsync());
  };

  const handleCreateNewEnvironment = () => {
    history.push('/environments/new');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEnvironmentAsync(id));
      message.success('Запись успешно удалена');
    } catch (error) {
      message.error('Ошибка при удалении записи');
    }
  };

  return (
    <div>
      <Skeleton active loading={loadingPage} /> 
      {!loadingPage && (
        <>
          <Typography.Title level={5}>Среды</Typography.Title>
          <div>
            <Input.Search
              placeholder="Начните ввод названия или кода"
              onSearch={() => dispatch(fetchFilteredEnvironmentsAsync(searchText))}
              onChange={handleSearchChange}
              value={searchText}
              style={{width: 300, marginBottom: 16}}
              allowClear
            />
            <Button
              type="primary"
              style={{marginBottom: 16, marginLeft: 550}}
              onClick={handleCreateNewEnvironment}>
              Создать новую среду
            </Button>
          </div>
          <Skeleton active loading={loadingFilters} /> 
          {!loadingFilters && (
            <Table
              dataSource={data}
              loading={loading}
              pagination={{
                pageSizeOptions: ['5', '10', '15', '20'], 
                defaultPageSize: 10, 
                showSizeChanger: true, 
                onChange: handlePageChange,
                total: data.length,
              }}
              rowKey={(record) => record.id}>
              <Column title="ID" dataIndex="id" key="id" width={100} />
              <Column title="Название" dataIndex="title" key="title" width={200} />
              <Column
                title="Код"
                dataIndex="code"
                key="code"
                width={200}
                render={(text, record) => <Link to={`/environments/${record.id}`}>{text}</Link>}
              />
              <Column title="Описание" dataIndex="description" key="description" width={600} />
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
          )}
        </>
      )}
    </div>
  );
};

export default Environments;
