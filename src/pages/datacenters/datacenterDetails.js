import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Input} from 'antd';
import {createDatacenterAsync} from '../../redux/datacentersSlice';
import {useDispatch} from 'react-redux';
import {BackButton, EditButton, SaveButton, CancelButton} from '../../Components/Button'


const DatacenterDetails = () => {
  const {id} = useParams();
  const [datacenter, setDatacenter] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDatacenter = async () => {
      if (id !== 'new') {
        try {
          const response = await fetch(`http://localhost:3001/datacenters/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch datacenter');
          }
          const data = await response.json();
          setDatacenter(data);
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
      dispatch(createDatacenterAsync(formData)).then(() => {
        history.push('/datacenters');
      });
    } else {
      try {
        const response = await fetch(`http://localhost:3001/datacenters/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update datacenter');
        }
        setDatacenter(formData);
        setEditing(false);
      } catch (error) {
        console.error('Error updating datacenter:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData(datacenter);
    setEditing(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (id === 'new') {
    return (
      <div>
        <h2>Создать новый дата центр:</h2>
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
        <SaveButton onClick={handleSave} />
        <BackButton onClick={handleGoBack}/>
      </div>
    );
  }

  if (!datacenter) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Информация о дата центре:</h2>
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
          <SaveButton onClick={handleSave} />
          <CancelButton onClick={handleCancel} />
        </div>
      ) : (
        <div>
          <p>ID: {datacenter.id}</p>
          <p>Название: {datacenter.title}</p>
          <p>Код: {datacenter.code}</p>
          <EditButton onClick={() => setEditing(true)}/>
          <BackButton onClick={handleGoBack}/>
        </div>
      )}
    </div>
  );
};

export default DatacenterDetails;
