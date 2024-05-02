import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Table, Button, Select, Input, Tag} from 'antd';
import {fetchPreordersDataAsync} from '../../redux/preordersSlice';
import {useState} from 'react';
import {ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'; 


const Preorders = ({
  preorders,
  configurations,
  datacenters,
  environments,
  loading,
  error,
  fetchPreordersDataAsync,
}) => {
  const [filters, setFilters] = useState({
    regNumber: '',
    preorderType: '',
    environmentId: '',
    isReplication: '',
    status: '',
  });

  useEffect(() => {
    fetchPreordersDataAsync(filters);
  }, [fetchPreordersDataAsync, filters]);

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (value, key) => {
    setFilters({...filters, [key]: value});
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
      render: (configuration) => (configuration ? configuration.title : ''),
    },
    {
      title: 'Среда',
      dataIndex: 'environment',
      key: 'environmentId',
      render: (environment) => (environment ? environment.title : ''),
    },
    {
      title: 'Центр данных',
      dataIndex: 'datacenters',
      key: 'datacenterIds',
      render: (datacenters) =>
        datacenters
          .map((datacenter) => {
            console.log(datacenter);
            return datacenter ? datacenter.title : '';
          })
          .join(', '),
    },
    {
      title: 'Репликация',
      dataIndex: 'isReplication',
      key: 'isReplication',
      render: (isReplication) => (isReplication === 'true' ? 'True' : 'False')
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let statusText = '';
        let icon = null;

        switch (status) {
          case 'NEW':
            color = 'blue';
            statusText = 'Новый';
            icon = <ClockCircleOutlined />;
            break;
          case 'APPROVED':
            color = 'green';
            statusText = 'Утвержден';
            icon = <CheckCircleOutlined />;
            break;
          case 'IN_WORK':
            color = 'orange';
            statusText = 'В работе';
            icon = <ExclamationCircleOutlined />;
            break;
          case 'COMPLETED':
            color = 'cyan';
            statusText = 'Завершен';
            icon = <CheckCircleOutlined />;
            break;
          case 'СANCELED':
            color = 'red';
            statusText = 'Отменен';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = '';
            statusText = status;
            break;
        }

        return (
          <Tag color={color}>
            {statusText}
            {icon && <span style={{marginLeft: '5px'}}>{icon}</span>}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <h2>Потребности</h2>
      <Button
        type="primary"
        size={50}
        onClick={() => setShowFilters(!showFilters)}
        style={{marginBottom: 20}}>
        {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
      </Button>
      {showFilters && (
        <div>
          <Input
            placeholder="Регистрационный номер"
            value={filters.regNumber}
            onChange={(e) => handleChange(e.target.value, 'regNumber')}
            style={{marginRight: '8px', marginBottom: '8px', width: '200px'}}
          />
          <Select
            placeholder="Тип потребности"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'preorderType')}
            value={filters.preorderType}>
            <Select.Option value="">Типы потребности</Select.Option>
            <Select.Option value="SERVER">Server</Select.Option>
            <Select.Option value="SHD">SHD</Select.Option>
            <Select.Option value="VIRTUALIZATION">Virtualization</Select.Option>
          </Select>
          <Select
            placeholder="Конфигурация"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'configurationId')}
            value={filters.configurationId}>
            <Select.Option value="">Конфигурация</Select.Option>
            {Object.values(configurations).map((config) => (
              <Select.Option key={config.id} value={config.id}>
                {config.title}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Среда"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'environmentId')}
            value={filters.environmentId}>
            <Select.Option value="">Среда</Select.Option>
            {Object.values(environments).map((env) => (
              <Select.Option key={env.id} value={env.id}>
                {env.title}
              </Select.Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            placeholder="Центр данных"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'datacenterIds')}
            value={filters.datacenterIds}>
            <Select.Option value="">Центр данных</Select.Option>
            {Object.values(datacenters).map((dc) => (
              <Select.Option key={dc.id} value={dc.id}>
                {dc.title}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Признак репликации"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'isReplication')}
            value={filters.isReplication}>
            <Select.Option value="">Признак репликации</Select.Option>
            <Select.Option value="true">True</Select.Option>
            <Select.Option value="false">False</Select.Option>
          </Select>
          <Select
            placeholder="Статус"
            style={{width: 200, marginRight: 10}}
            onChange={(value) => handleChange(value, 'status')}
            value={filters.status}>
            <Select.Option value="">Статус</Select.Option>
            <Select.Option value="NEW">New</Select.Option>
            <Select.Option value="APPROVED">Approved</Select.Option>
            <Select.Option value="IN_WORK">In Work</Select.Option>
            <Select.Option value="COMPLETED">Completed</Select.Option>
            <Select.Option value="CANCELED">Canceled</Select.Option>
          </Select>

          <Button onClick={handleClearFilters} type="primary" size={50}>
            Сбросить фильтры
          </Button>
        </div>
        
      )}
      <Table rowKey={(record) => record.id} columns={columns} dataSource={preorders} />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Preorders);
