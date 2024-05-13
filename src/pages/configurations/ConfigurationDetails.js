import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Input, Skeleton} from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';
import {createConfigurationAsync} from '../../redux/index';
import {BackButton, EditButton, SaveButton, CancelButton} from '../../Components/index'
import {fetchConfigurationById} from '../../api'

const ConfigurationDetails = () => {
  const {id} = useParams();
  const [configuration, setConfiguration] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingPage(true);
    const fetchDatacenter = async () => {
      setTimeout(() => {
        setLoadingPage(false);
      }, 1000); 
      if (id !== 'new') {
        try {
          const data = await fetchConfigurationById(id);
          setConfiguration(data);
          setFormData(data);
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
        history.push('/configurations');
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

  if (id === 'new') {
    return (
      <div>
        <Skeleton active loading={loadingPage} /> 
        {!loadingPage && ( 
          <>
            <div>
              <h2>Создать новую конфигурацию:</h2>
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
                  defaultValue={formData.description} 
                  onChange={(value) => setFormData({...formData, description: value})} 
                />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
            <BackButton onClick={handleGoBack}/>
          </>
        )}
      </div>
    );
  }

  if (!configuration) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <Skeleton active loading={loadingPage} /> 
      {!loadingPage && ( 
        <>
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
                <DescriptionEditor
                  defaultValue={formData.description}
                  onChange={(value) => setFormData({...formData, description: value})}
                />
              </div>
              <SaveButton onClick={handleSave} />
              <CancelButton onClick={handleCancel} />
            </div>
          ) : (
            <div>
              <p>ID: {configuration?.id}</p>
              <p>Название: {configuration?.title}</p>
              <p>Код: {configuration?.code}</p>
              <div>Описание: <div dangerouslySetInnerHTML={{__html: configuration.description}} /></div>
              <EditButton onClick={() => setEditing(true)}/>
              <BackButton onClick={handleGoBack}/>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConfigurationDetails;
