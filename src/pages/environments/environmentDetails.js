import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'antd';
import DescriptionEditor from '../editor/DescriptionEditor';

const EnvironmentDetails = () => {
  const { id } = useParams();
  const [environment, setEnvironment] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const response = await fetch(`http://localhost:3001/environments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch environment');
        }
        const data = await response.json();
        setEnvironment(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching environment:', error);
      }
    };

    fetchEnvironment();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/environments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update environment');
      }
      setEnvironment(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating environment:', error);
    }
  };

  const handleCancel = () => {
    setFormData(environment);
    setEditing(false);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (!environment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Environment Details</h2>
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
            <DescriptionEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </p>
          <Button onClick={handleSave}>Сохранить</Button>
          <Button onClick={handleCancel}>Отменить</Button>
        </div>
      ) : (
        <div>
          <p>ID: {environment.id}</p>
          <p>Title: {environment.title}</p>
          <p>Code: {environment.code}</p>
          <p>Description: {environment.description}</p>
          <Button onClick={() => setEditing(true)}>Изменить</Button>
          <Button onClick={handleGoBack}>Назад</Button>
        </div>
      )}
    </div>
  );
};

export default EnvironmentDetails;
