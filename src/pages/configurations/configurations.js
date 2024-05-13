import React, {useEffect, useState} from 'react';
import {Typography, Input, Table, Button, Popconfirm, Skeleton, message} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {DeleteOutlined} from '@ant-design/icons';
import debounce from 'lodash/debounce'; 
import {NewRecordButton} from '../../Components/index'
import {
  fetchFilteredConfigurationsAsync,
  setPerPage,
  deleteConfigurationAsync,
} from '../../redux/configurationsSlice';

const {Column} = Table;

const Configurations = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {data:response, loading, page, perPage} = useSelector((state) => state.configurations);
  const data = response.data;
  const [loadingFilters, setLoadingFilters] = useState(false); 
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLoadingFilters(true);
    const debouncedSearch = debounce(() => {
      setTimeout(() => {
        setLoadingFilters(false);
      }, 1000); 
      dispatch(fetchFilteredConfigurationsAsync( {code:searchText, page, perPage}));
    }, 1000); 

    debouncedSearch(searchText)

    return () => debouncedSearch.cancel();
  }, [searchText, dispatch, page, perPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handlePaginationChange = (page, pageSize) => {
    dispatch(fetchFilteredConfigurationsAsync({page, perPage: pageSize}));
  };
  
  const handleSizeChange = (current, size) => {
    dispatch(setPerPage(size));
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
    <div>
      <>
        <Typography.Title level={5}>Конфигурации</Typography.Title>
        <div>
          <Input.Search
            placeholder="Начните ввод названия или кода"
            onChange={handleSearchChange}
            value={searchText}
            style={{width: 300, marginBottom: 16}}
            allowClear
          />
          <NewRecordButton onClick={handleCreateNewConfiguration}></NewRecordButton>

        </div>
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
            <Column title="ID" dataIndex="id" key="id" width={70} />
            <Column title="Название" dataIndex="title" key="title" width={300} />
            <Column
              title="Код"
              dataIndex="code"
              key="code"
              width={250}
              render={(text, record) => <Link to={`/configurations/${record.id}`}>{text}</Link>}
            />
            <Column title="Описание" dataIndex="description" key="description" render={(html) => <div dangerouslySetInnerHTML={{__html: html}} />}/>
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
  )
};

export default Configurations;
