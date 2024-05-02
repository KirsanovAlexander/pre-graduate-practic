import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Button, Input} from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';
import {createEnvironmentAsync} from '../../redux/environmentsSlice';
import {useDispatch} from 'react-redux';

const EnvironmentDetails = () => {
  const {id} = useParams();
  const [environment, setEnvironment] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEnvironment = async () => {
      if (id !== 'new') {
        try {
          const response = await fetch(`http://localhost:3001/environments/${id}`);
          if (!response.ok) {
            throw new Error('Ошибка получения данных о среде');
          }
          const data = await response.json();
          setEnvironment(data);
          setFormData(data);
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
    };

    fetchEnvironment();
  }, [id]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = async () => {
    if (id === 'new') {
      dispatch(createEnvironmentAsync(formData)).then(() => {
        history.push('/datacenters');
      });
    } else {
      try {
        const response = await fetch(`http://localhost:3001/environments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении сред');
        }
        setEnvironment(formData);
        setEditing(false);
      } catch (error) {
        console.error('Ощибка обновления сред:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData(environment);
    setEditing(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (id === 'new') {
    return (
      <div>
        <h2>Создать новую среду:</h2>
        <p>
          ID:
          <Input name="id" placeholder="ID" value={formData.id} onChange={handleInputChange} />
        </p>
        <p>
          Название:
          <Input
            name="title"
            placeholder="Название"
            value={formData.title}
            onChange={handleInputChange}
          />
        </p>
        <p>
          Код:
          <Input name="code" placeholder="Код" value={formData.code} onChange={handleInputChange} />
        </p>
        <div>
          Описание:
          <DescriptionEditor
            value={formData.description}
            onChange={(value) => setFormData({...formData, description: value})}
          />
        </div>
        <Button onClick={handleSave}>Сохранить</Button>
        <Button onClick={handleGoBack}>Назад</Button>
      </div>
    );
  }

  if (!environment) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Информация о среде:</h2>
      {editing ? (
        <div>
          <p>ID: {formData.id}</p>
          <p>
            Название:
            <Input name="title" value={formData.title} onChange={handleInputChange} />
          </p>
          <p>
            Код:
            <Input name="code" value={formData.code} onChange={handleInputChange} />
          </p>
          <p>
            Описание:
            <DescriptionEditor
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
            />
          </p>
          <Button onClick={handleSave}>Сохранить</Button>
          <Button onClick={handleCancel}>Отменить</Button>
        </div>
      ) : (
        <div>
          <p>ID: {environment.id}</p>
          <p>Название: {environment.title}</p>
          <p>Код: {environment.code}</p>
          <p>Описание: {environment.description}</p>
          <Button onClick={() => setEditing(true)}>Изменить</Button>
          <Button onClick={handleGoBack}>Назад</Button>
        </div>
      )}
    </div>
  );
};

export default EnvironmentDetails;
