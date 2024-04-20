import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';

const ConfigurationDetails = () => {
  const { id } = useParams();
  const [configuration, setConfiguration] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await fetch(`http://localhost:3001/configurations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch configuration');
        }
        const data = await response.json();
        setConfiguration(data);
        setFormData(data);
        setDescription(data?.description);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfiguration();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/configurations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: description,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }
      setConfiguration(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  const handleCancel = () => {
    setFormData(configuration);
    setEditing(false);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleEditorChange = (newDescription) => {
    setDescription(newDescription);
  };

  if (!configuration) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Configuration Details</h2>
      {editing ? (
        <div>
          <p>ID: {formData.id}</p>
          <p>
            Title:
            <Input name="title" value={formData.title} onChange={handleInputChange} />
          </p>
          <p>
            Code:
            <Input name="code" value={formData.code} onChange={handleInputChange} />
          </p>
          <p>
            Description:
            <DescriptionEditor value={description} onChange={handleEditorChange} />{' '}
          </p>
          <Button onClick={handleSave}>Сохранить</Button>
          <Button onClick={handleCancel}>Отменить</Button>
        </div>
      ) : (
        <div>
          <p>ID: {configuration?.id}</p>
          <p>Title: {configuration?.title}</p>
          <p>Code: {configuration?.code}</p>
          <p>Description: {configuration?.description}</p>
          <Button onClick={() => setEditing(true)}>Изменить</Button>
          <Button onClick={handleGoBack}>Назад</Button>
        </div>
      )}
    </div>
  );
};

export default ConfigurationDetails;
