import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Button, Input, Select} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPreordersDataAsync} from '../../redux/preordersSlice';
import {fetchEnvironmentsDataAsync} from '../../redux/environmentsSlice';
import {fetchConfigurationsDataAsync} from '../../redux/configurationsSlice';
import {fetchDatacentersDataAsync} from '../../redux/datacentersSlice';

const {Option} = Select;

const PreorderDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const preorders = useSelector(state => state.preorders.data);
  const environments = useSelector(state => state.environments.data);
  const configurations = useSelector(state => state.configurations.data);
  const datacenters = useSelector(state => state.datacenters.data);

  useEffect(() => {
    dispatch(fetchPreordersDataAsync(id));
    dispatch(fetchEnvironmentsDataAsync());
    dispatch(fetchConfigurationsDataAsync());
    dispatch(fetchDatacentersDataAsync());
  }, [dispatch, id]);

  useEffect(() => {
    const selectedPreorder = preorders.find(order => order.id === id);
    setFormData(selectedPreorder);
  }, [preorders, id]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/preorders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update preorder');
      }
      setFormData(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating preorder:', error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (!formData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Информация о потребности</h2>
      {editing ? (
        <div>
          <p>ID: {formData.id}</p>
          <p>
            Регистрационный номер:
            <Input name="regNumber" value={formData.regNumber} onChange={handleInputChange} style={{width: 200}}/>
          </p>
          <p>
            Тип потребности:
            <Select
              name="preorderType"
              value={formData.preorderType}
              onChange={(value) => setFormData({...formData, preorderType: value})}
              style={{width: 200}}
            >
              <Option value="">Типы потребности</Option>
              <Option value="SERVER">Server</Option>
              <Option value="SHD">SHD</Option>
              <Option value="VIRTUALIZATION">Virtualization</Option>
            </Select>
          </p>
          <p>
             Среда:
            <Select
              name="environmentId"
              value={formData.environmentId}
              onChange={(value) => setFormData({...formData, environmentId: value})}
              style={{width: 200}}
            >
              <Option value="">Среда</Option>
              {environments.map((env) => (
                <Option key={env.id} value={env.id}>
                  {env.title}
                </Option>
              ))}
            </Select>
          </p>
          <p>
            Конфигурация:
            <Select
              name="configurationId"
              value={formData.configurationId}
              onChange={(value) => setFormData({...formData, configurationId: value})}
              style={{width: 200}}
            >
              <Option value="">Конфигурация</Option>
              {configurations.map((config) => (
                <Option key={config.id} value={config.id}>
                  {config.title}
                </Option>
              ))}
            </Select>
          </p>

          <p>
            Дата-центры:
            <Select
              mode="multiple"
              name="datacenterIds"
              value={formData.datacenterIds}
              onChange={(value) => setFormData({...formData, datacenterIds: value})}
              style={{width: 200}}
            >
              <Option value="">Центр данных</Option>
              {datacenters.map((dc) => (
                <Option key={dc.id} value={dc.id}>
                  {dc.title}
                </Option>
              ))}
            </Select>
          </p>
          <p>
            Статус:
            <Select
              name="status"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value})}
              style={{width: 200}}
            >
              <Option value="">Статус</Option>
              <Option value="NEW">Новый</Option>
              <Option value="IN_PROGRESS">В процессе</Option>
              <Option value="COMPLETED">Завершен</Option>
              <Option value="COMPLETED">Отменен</Option>
            </Select>
          </p>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      ) : (
        <div>
          <p>ID: {formData.id}</p>
          <p>Регистрационный номер: {formData.regNumber}</p>
          <p>Тип потребности: {formData.preorderType}</p>
          <p>Конфигурация: {configurations.find((config) => config.id === formData.configurationId)?.title}</p>
          <p>Среда: {environments.find((env) => env.id === formData.environmentId)?.title}</p>
          <div>
            Дата-центр:
            {formData.datacenterIds && formData.datacenterIds.map((id) => {
              const datacenter = datacenters.find((dc) => dc.id === id);
              return datacenter ? datacenter.title : '';
            }).join(', ')}
          </div>
          <div>
            Признак репликации: {formData.isReplication ? formData.isReplication.toString() : 'Unknown'}
          </div>
          <div>
            Статус: {formData.status}
          </div>
          <Button onClick={() => setEditing(true)}>Изменить</Button>
          <Button onClick={handleGoBack}>Назад</Button>
        </div>
      )}
    </div>
  );
};

export default PreorderDetails;