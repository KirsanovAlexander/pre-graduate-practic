import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm, message, Skeleton} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchFilteredDatacentersAsync,
  setPerPage,
  deleteDatacenterAsync,
} from '../../redux/datacentersSlice';
import {DeleteOutlined} from '@ant-design/icons';
import debounce from 'lodash/debounce'; 
import {NewRecordButton} from '../../Components/index'

const {Column} = Table;

const Datacenters = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data:response, loading, perPage} = useSelector((state) => state.datacenters);
  const data = response.data;
  const [loadingFilters, setLoadingFilters] = useState(false); 
  const [searchText, setSearchText] = useState('');
  

  useEffect(() => {
    setLoadingFilters(true);
    const debouncedSearch = debounce(() => {
      setTimeout(() => {
        setLoadingFilters(false);
      }, 1000); 
      dispatch(fetchFilteredDatacentersAsync( {code:searchText, page: 1, perPage}));
    }, 1000);

    debouncedSearch(searchText);

    return () => debouncedSearch.cancel();
  }, [searchText, dispatch, perPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePaginationChange = (page, pageSize) => {
    dispatch(fetchFilteredDatacentersAsync({page, perPage: pageSize}));
  };
  
  const handleSizeChange = (current, size) => {
    dispatch(setPerPage(size));
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
    <div>
      <>
        <Typography.Title level={5}>Дата-центры</Typography.Title>
        <Input.Search
          placeholder="Введите название или код датацентра"
          onChange={handleSearchChange}
          value={searchText}
          style={{width: 300, marginBottom: 16}}
          allowClear
        />

        <NewRecordButton onClick={handleCreateNewDatacenter}></NewRecordButton>
        <Skeleton active loading={loadingFilters} /> 
        {!loadingFilters && (
          <Table
            dataSource={data}
            loading={loading}
            pagination={{
              pageSizeOptions: ['5', '10', '15', '20'],
              defaultPageSize: perPage,
              showSizeChanger: true,
              onChange: (page, pageSize) => handlePaginationChange(page, pageSize),
              onShowSizeChange: (current, size) => handleSizeChange(current, size),
              total: response.items,
              pageSize:perPage,
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
        )}
      </>
    </div>
  );
};

export default Datacenters;
