import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Input} from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';
import {createConfigurationAsync} from '../../redux/configurationsSlice';
import {useDispatch} from 'react-redux';
import {BackButton, EditButton, SaveButton, CancelButton} from '../../Components/Button'

const ConfigurationDetails = () => {
  const {id} = useParams();
  const [configuration, setConfiguration] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [description, setDescription] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDatacenter = async () => {
      if (id !== 'new') {
        try {
          const response = await fetch(`http://localhost:3001/configurations/${id}`);
          if (!response.ok) {
            throw new Error('Ошибка получения данных о конфигурации');
          }
          const data = await response.json();
          setConfiguration(data);
          setFormData(data);
          setDescription(data?.description);
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
    };

    fetchDatacenter();
  }, [id]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = async () => {
    if (id === 'new') {
      dispatch(createConfigurationAsync(formData)).then(() => {
        history.push('/datacenters');
      });
    } else {
      try {
        const response = await fetch(`http://localhost:3001/configurations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            description,
          }),
        });
        if (!response.ok) {
          throw new Error('Ошибка обновления данных о конфигурации');
        }
        setConfiguration(formData);
        setEditing(false);
      } catch (error) {
        console.error('Ошибка обновления данных о конфигурации :', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData(configuration);
    setEditing(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleEditorChange = (newDescription) => {
    setDescription(newDescription);
  };

  if (id === 'new') {
    return (
      <div>
        <h2>Создать новую конфигурацию:</h2>
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
        <p>
          Описание:      
          <DescriptionEditor value={description} onChange={handleEditorChange} />{' '}
        </p>
        <SaveButton onClick={handleSave} />
        <BackButton onClick={handleGoBack}/>
      </div>
    );
  }

  if (!configuration) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Информация о конфигурации</h2>
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
          <div>
            Описание:            
            <DescriptionEditor value={description} onChange={handleEditorChange} />
          </div>
          <SaveButton onClick={handleSave} />
          <CancelButton onClick={handleCancel} />
        </div>
      ) : (
        <div>
          <p>ID: {configuration?.id}</p>
          <p>Название: {configuration?.title}</p>
          <p>Код: {configuration?.code}</p>
          <p>Описание: {configuration?.description}</p>
          <EditButton onClick={() => setEditing(true)}/>
          <BackButton onClick={handleGoBack}/>
        </div>
      )}
    </div>
  );
};

export default ConfigurationDetails;
