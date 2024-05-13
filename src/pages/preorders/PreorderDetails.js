import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Input, Skeleton} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFilteredDatacentersAsync, fetchFilteredConfigurationsAsync, fetchFilteredEnvironmentsAsync, fetchPreordersDataAsync, createPreorderAsync} from '../../redux/index';
import {BackButton, EditButton, SaveButton, CancelButton} from '../../Components/index';
import {PreorderTypeSelector, ConfigurationSelector, EnvironmentSelector, DatacenterSelector, StatusSelector} from '../../Components/Selectors/index'

const PreorderDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);
  const preorders = useSelector(state => state.preorders.data);
  const environments = useSelector(state => state.environments.data);
  const configurations = useSelector(state => state.configurations.data);
  const datacenters = useSelector(state => state.datacenters.data);

  useEffect(() => {
    setLoadingPage(true);
    setTimeout(() => {
      setLoadingPage(false);
    }, 1000); 
    if (id !== 'new') {
      dispatch(fetchPreordersDataAsync(id));
    }
    dispatch(fetchFilteredEnvironmentsAsync());
    dispatch(fetchFilteredConfigurationsAsync());
    dispatch(fetchFilteredDatacentersAsync());
  }, [dispatch, id]);

  useEffect(() => {
    if (id === 'new') {
      setFormData({editing: false});
    } else {
      const selectedPreorder = preorders.find(order => order.id === id);
      setFormData({...selectedPreorder, editing: false});
    }
  }, [preorders, id]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = async () => {
    if (id === 'new') {
      dispatch(createPreorderAsync(formData)).then(() => {
        history.push('/preorders');
      });
    } else {
      try {
        const response = await fetch(`http://localhost:3001/preorders/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Ошибка обновления потребности');
        }
        const updatedFormData = await response.json();
        setFormData({...updatedFormData, editing: false});
        setEditing(false);
      } catch (error) {
        console.error('Ошибка обновления потребности:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({...formData, editing: false});
    setEditing(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (id === 'new') {
    return (
      <div>
        <Skeleton active loading={loadingPage} /> 
        {!loadingPage && ( 
          <>
            <h2>Создать новую потреность:</h2>
            <Input
              placeholder="Регистрационный номер"
              name="regNumber"
              value={formData.regNumber || ''}
              onChange={handleInputChange}
            />
            <PreorderTypeSelector
              value={formData.preorderType || ''}
              onChange={(value) => setFormData({...formData, preorderType: value})}
            />
            <EnvironmentSelector
              environments={environments}
              value={formData.environmentId || ''}
              onChange={(value) => setFormData({...formData, environmentId: value})}
            />
            <ConfigurationSelector
              configurations={configurations}
              value={formData.configurationId || ''}
              onChange={(value) => setFormData({...formData, configurationId: value})}
            />
            <DatacenterSelector
              datacenters={Object.values(datacenters.data ?? datacenters)}
              value={formData.datacenterIds}
              onChange={(value) => setFormData({...formData, datacenterIds: value})}
            />
            <StatusSelector
              value={formData.status || ''}
              onChange={(value) => setFormData({...formData, status: value})}
            />
            <SaveButton onClick={handleSave} />
            <CancelButton onClick={handleGoBack} />
          </>
        )}
      </div>
    );
  }


  if (!formData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <Skeleton active loading={loadingPage} /> 
      {!loadingPage && ( 
        <>
          <h2>Информация о потребности</h2>
          {editing ? (
            <div>
              <div>ID: {formData.id}</div>
              <div>
                Регистрационный номер:
                <Input name="regNumber" value={formData.regNumber} onChange={handleInputChange} style={{width: 200}} />
              </div>
              <div>
                Тип потребности:
                <PreorderTypeSelector
                  value={formData.preorderType}
                  onChange={(value) => setFormData({...formData, preorderType: value})}
                />
              </div>
              <div>
                Среда:
                <EnvironmentSelector
                  environments={environments}
                  value={formData.environmentId}
                  onChange={(value) => setFormData({...formData, environmentId: value})}
                />
              </div>
              <div>
                Конфигурация:
                <ConfigurationSelector
                  configurations={configurations}
                  value={formData.configurationId}
                  onChange={(value) => setFormData({...formData, configurationId: value})}
                />
              </div>
              <div>
                Дата-центры:
                <DatacenterSelector
                  datacenters={Object.values(datacenters.data ?? datacenters)}
                  value={formData.datacenterIds}
                  onChange={(value) => setFormData({...formData, datacenterIds: value})}
                />
              </div>
              <div>
                Статус:
                <StatusSelector
                  value={formData.status}
                  onChange={(value) => setFormData({...formData, status: value})}
                />
              </div>
              <SaveButton onClick={handleSave} />
              <CancelButton onClick={handleCancel} />
            </div>
          ) : (
            <div>
              <div>ID: {formData.id}</div>
              <div>Регистрационный номер: {formData.regNumber}</div>
              <div>Тип потребности: {formData.preorderType}</div>
              <div>Конфигурация: {configurations.find((config) => config.id === formData.configurationId)?.title}</div>
              <div>Среда: {environments.find((env) => env.id === formData.environmentId)?.title}</div>
              <div>
                Дата-центр:
                {formData.datacenterIds && formData.datacenterIds.map((id) => {
                  const datacenter = datacenters.find((dc) => dc.id === id);
                  return datacenter ? datacenter.title : '';
                }).join(', ')}
              </div>
              <div>Признак репликации: {formData.isReplication ? formData.isReplication.toString() : 'Unknown'}</div>
              <div>Статус: {formData.status}</div>
              <EditButton onClick={() => setEditing(true)} />
              <BackButton onClick={handleGoBack} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PreorderDetails;


