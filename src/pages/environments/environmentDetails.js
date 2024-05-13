import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Input, Skeleton} from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';
import {createEnvironmentAsync} from '../../redux/';
import {useDispatch} from 'react-redux';
import {BackButton, EditButton, SaveButton, CancelButton} from '../../Components/index'
import {fetchEnvironmentById} from '../../api'

const EnvironmentDetails = () => {
  const {id} = useParams();
  const [environment, setEnvironment] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingPage(true);
    const fetchEnvironment = async () => {
      setTimeout(() => {
        setLoadingPage(false);
      }, 1000); 
      if (id !== 'new') {
        try {
          const data = await fetchEnvironmentById(id);
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
        history.push('/environments');
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
        <Skeleton active loading={loadingPage} /> 
        {!loadingPage && ( 
          <>
            <h2>Создать новую среду:</h2>
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
            <SaveButton onClick={handleSave} />
            <BackButton onClick={handleGoBack}/>
          </>
        )}
      </div>
    );
  }

  if (!environment) {
    return <div>Загрузка...</div>;
  }
  return (
    <div>
      <Skeleton active loading={loadingPage} /> 
      {!loadingPage && ( 
        <>
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
              <p>ID: {environment.id}</p>
              <p>Название: {environment.title}</p>
              <p>Код: {environment.code}</p>
              <div>Описание: <div dangerouslySetInnerHTML={{__html: environment.description}} /></div>
              <EditButton onClick={() => setEditing(true)}/>
              <BackButton onClick={handleGoBack}/>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnvironmentDetails;

