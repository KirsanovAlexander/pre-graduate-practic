import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Table, Button, Input, Popconfirm, message, Skeleton} from 'antd';
import {DeleteOutlined} from '@ant-design/icons'; 
import {fetchPreordersDataAsync, deletePreorderAsync} from '../../redux/preordersSlice';
import {debounce} from 'lodash';
import PreorderStatus from '../../Components/PreorderStatus';
import PreorderTypeSelector from '../../Components/Selectors/PreorderTypeSelector';
import ConfigurationSelector from '../../Components/Selectors/ConfigurationSelector';
import EnvironmentSelector from '../../Components/Selectors/EnvironmentSelector';
import DatacenterSelector from '../../Components/Selectors/DatacenterSelector';
import ReplicationSelector from '../../Components/Selectors/ReplicationSelector';
import StatusSelector from '../../Components/Selectors/StatusSelector';
import {fetchFilteredEnvironmentsAsync} from '../../redux/environmentsSlice';
import {fetchFilteredDatacentersAsync} from '../../redux/datacentersSlice';
import {fetchFilteredConfigurationsAsync} from '../../redux/configurationsSlice';


const Preorders = ({
  preorders,
  configurations,
  datacenters,
  environments,
  loading,
  error,
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
  const [loadingPage, setLoadingPage] = useState(true); 
  const [loadingFilters, setLoadingFilters] = useState(false); 
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFilteredDatacentersAsync();
    fetchFilteredEnvironmentsAsync();
    fetchFilteredConfigurationsAsync();

    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);
  }, [fetchFilteredDatacentersAsync, fetchFilteredEnvironmentsAsync, fetchFilteredConfigurationsAsync]);

  useEffect(() => {
    setLoadingFilters(true);
    const debouncedSearch = debounce(() => {
      setTimeout(() => {
        setLoadingFilters(false);
      }, 1000); 
      fetchPreorders(filters); 
    }, 1000);

    debouncedSearch();

    return debouncedSearch.cancel;
  }, [filters, fetchPreorders]); 

  useEffect(() => {
    localStorage.setItem('preorderFilters', JSON.stringify(filters));
  }, [filters]);


  const handleChange = (value, key) => {
    setFilters({...filters, [key]: value});
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
      <Skeleton active loading={loadingPage} /> 
      {!loadingPage && (
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
                  configurations={Object.values(configurations)}
                  value={filters.configurationId}
                  onChange={(value) => handleChange(value, 'configurationId')}
                />
              </div>

              <EnvironmentSelector
                environments={Object.values(environments)}
                value={filters.environmentId}
                onChange={(value) => handleChange(value, 'environmentId')}
              />

              <DatacenterSelector
                datacenters={Object.values(datacenters)}
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
              <Button
                type="primary"
                style={{marginBottom: 16}}
                onClick={handleCreateNewPreorder}
              >
                Создать новую потребность
              </Button>
            </div>
          )}
          <Skeleton active loading={loadingFilters} /> 
          {!loadingFilters && (
            <Table
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={preorders}
              pagination={{
                pageSizeOptions: ['5', '10', '15', '20'],
                defaultPageSize: 10,
                showSizeChanger: true,
              }}
            />
          )}
        </>
      )}
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
