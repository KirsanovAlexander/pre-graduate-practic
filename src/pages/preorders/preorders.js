import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Table, Button, Input, Popconfirm, message, Skeleton} from 'antd';
import {DeleteOutlined} from '@ant-design/icons'; 
import {debounce} from 'lodash';
import PreorderStatus from '../../Components/PreorderStatus';
import {NewRecordButton} from '../../Components/Button';
import {fetchFilteredDatacentersAsync, fetchFilteredConfigurationsAsync, fetchFilteredEnvironmentsAsync, fetchPreordersDataAsync, deletePreorderAsync} from '../../redux/index';
import {PreorderTypeSelector, ConfigurationSelector, EnvironmentSelector, DatacenterSelector, StatusSelector, ReplicationSelector} from '../../Components/Selectors/index'
import {setPerPage} from '../../redux/preordersSlice'

const Preorders = ({
  preorders,
  configurations,
  datacenters,
  environments,
  fetchPreordersDataAsync: fetchPreorders,
  fetchFilteredConfigurationsAsync,
  fetchFilteredDatacentersAsync,
  fetchFilteredEnvironmentsAsync,
}) => {
  const initialFilters = JSON.parse(localStorage.getItem('preorderFilters')) || {
    regNumber: '',
    preorderType: '',
    environmentId: '',
    isReplication: '',
    status: '',
  };
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false); 
  const {data:response, page, perPage} = useSelector((state) => state.preorders);
  const data = response.data ?? response;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFilteredDatacentersAsync();
    fetchFilteredEnvironmentsAsync();
    fetchFilteredConfigurationsAsync();
  }, [dispatch, fetchFilteredDatacentersAsync, fetchFilteredEnvironmentsAsync, fetchFilteredConfigurationsAsync]);

  useEffect(() => {
    setLoadingFilters(true);
    const debouncedSearch = debounce(() => {
      setTimeout(() => {
        setLoadingFilters(false);
      }, 1000); 
      fetchPreorders({filters, page, perPage}); 
    }, 1000);

    debouncedSearch();

    return debouncedSearch.cancel;
  }, [filters, fetchPreorders, page, perPage]); 

  useEffect(() => {
    localStorage.setItem('preorderFilters', JSON.stringify(filters));
  }, [filters]);


  const handleChange = (value, key) => {
    setFilters({...filters, [key]: value});
  };

  const handlePaginationChange = (page, pageSize) => {
    dispatch(fetchPreordersDataAsync({page, perPage: pageSize}));
  };
  
  const handleSizeChange = (current, size) => {
    dispatch(setPerPage(size));
  };
  
  const handleCreateNewPreorder = () => {
    history.push('/preorders/new');
  };

  const handleClearFilters = () => {
    setFilters({
      regNumber: '',
      preorderType: '',
      environmentId: '',
      isReplication: '',
      status: '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePreorderAsync(id));
      message.success('Запись успешно удалена');
    } catch (error) {
      message.error('Ошибка при удалении записи');
    }
  };

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {
      title: 'Регистрационный номер',
      dataIndex: 'regNumber',
      key: 'regNumber',
      render: (text, record) => <a href={`/preorders/${record.id}`}>{text}</a>,
    },
    {title: 'Тип потребности', dataIndex: 'preorderType', key: 'preorderType'},
    {
      title: 'Конфигурация',
      dataIndex: 'configuration',
      key: 'configurationId',
      render: (configuration) => configuration?.title || '',
    },
    {
      title: 'Среда',
      dataIndex: 'environment',
      key: 'environmentId',
      render: (environment) => environment?.title || '',
    },
    {
      title: 'Центр данных',
      dataIndex: 'datacenters',
      key: 'datacenterIds',
      render: (datacenters) =>
        datacenters
          .map((datacenter) =>
            datacenter?.title || ''
          )
          .join(', '),
    },
    {
      title: 'Репликация',
      dataIndex: 'isReplication',
      key: 'isReplication',
      render: (isReplication) => (isReplication === 'true' ? 'True' : 'False'),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <PreorderStatus status={status} />,
    },
    {
      title: 'Удаление',
      dataIndex: 'id',
      key: 'delete',
      render: (text, record) => (
        <Popconfirm
          title="Вы уверены, что хотите удалить эту потребность?"
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Отмена"
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    }
  ];

  return (
    <div>
      <>
        <h2>Потребности</h2>
        <Button
          type="primary"
          size={50}
          onClick={() => setShowFilters(!showFilters)}
          style={{marginBottom: 20}}
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
        {showFilters && (
          <div>
            <Input
              placeholder="Регистрационный номер"
              value={filters.regNumber}
              onChange={(e) => handleChange(e.target.value, 'regNumber')}
              style={{marginRight: '8px', marginBottom: '8px', width: 250}}
              allowClear
            />
            <div>
                Тип потребности:
              <PreorderTypeSelector
                value={filters.preorderType}
                onChange={(value) => handleChange(value, 'preorderType')}
              />
            </div>
            <div>
                Конфигурация:
              <ConfigurationSelector
                configurations={Object.values(configurations.data ?? configurations)}
                value={filters.configurationId}
                onChange={(value) => handleChange(value, 'configurationId')}
              />
            </div>

            <EnvironmentSelector
              environments={Object.values(environments.data ?? environments)}
              value={filters.environmentId}
              onChange={(value) => handleChange(value, 'environmentId')}
            />

            <DatacenterSelector
              datacenters={Object.values(datacenters.data ?? datacenters)}
              value={filters.datacenterIds}
              onChange={(value) => handleChange(value, 'datacenterIds')}
            />
            <ReplicationSelector
              value={filters.isReplication}
              onChange={(value) => handleChange(value, 'isReplication')}
            />
            <StatusSelector
              value={filters.status}
              onChange={(value) => handleChange(value, 'status')}
            />

            <Button onClick={handleClearFilters} type="primary" size={50}>
                Сбросить фильтры
            </Button>
            <NewRecordButton onClick={handleCreateNewPreorder}></NewRecordButton>
          </div>
        )}
        <Skeleton active loading={loadingFilters} /> 
        {!loadingFilters && (
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={data}
            pagination={{
              pageSizeOptions: ['5', '10', '15', '20'],
              defaultPageSize: perPage,
              showSizeChanger: true, 
              onChange: (page, pageSize) => handlePaginationChange(page, pageSize),
              onShowSizeChange: (current, size) => handleSizeChange(current, size),
              total: response.items,
              pageSize:perPage,
            }}s
          />
        )}
      </>
    </div>
  );
};

const mapStateToProps = (state) => ({
  preorders: state.preorders.data,
  configurations: state.configurations.data,
  datacenters: state.datacenters.data,
  environments: state.environments.data,
  loading: state.preorders.loading,
  error: state.preorders.error,
});

const mapDispatchToProps = {
  fetchPreordersDataAsync,
  fetchFilteredConfigurationsAsync,
  fetchFilteredDatacentersAsync,
  fetchFilteredEnvironmentsAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(Preorders);
