import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Select } from 'antd';

const { Option } = Select;

const PreorderDetails = () => {
  const { id } = useParams();
  const [preorder, setPreorder] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    regNumber: '',
    preorderType: '',
    configurationId: '',
    environmentId: '',
    datacenterIds: [],
    isReplication: false,
    status: '',
  });

  useEffect(() => {
    const fetchPreorder = async () => {
      try {
        const response = await fetch(`http://localhost:3001/preorders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch preorder');
        }
        const data = await response.json();
        setPreorder(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching preorder:', error);
      }
    };

    fetchPreorder();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      setPreorder(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating preorder:', error);
    }
  };

  const handleCancel = () => {
    setFormData(preorder);
    setEditing(false);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (!preorder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Preorder Details</h2>
      {editing ? (
        <div>
          <p>ID: {formData.id}</p>
          <p>
            Reg Number:
            <Input name="regNumber" value={formData.regNumber} onChange={handleInputChange} />
          </p>
          <p>
            Preorder Type:
            <Input name="preorderType" value={formData.preorderType} onChange={handleInputChange} />
          </p>
          <p>
            Configuration ID:
            <Input
              name="configurationId"
              value={formData.configurationId}
              onChange={handleInputChange}
            />
          </p>
          <p>
            Environment ID:
            <Input
              name="environmentId"
              value={formData.environmentId}
              onChange={handleInputChange}
            />
          </p>
          <p>
            Datacenter IDs:
            <Input
              name="datacenterIds"
              value={formData.datacenterIds.join(',')}
              onChange={handleInputChange}
            />
          </p>
          <p>
            Is Replication:
            <Input
              name="isReplication"
              value={formData.isReplication.toString()}
              onChange={handleInputChange}
            />
          </p>
          <p>
            Status:
            <Select
              name="status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}>
              <Option value="NEW">NEW</Option>
              <Option value="APPROVED">APPROVED</Option>
              <Option value="IN_WORK">IN_WORK</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELED">CANCELED</Option>
            </Select>
          </p>
          <Button onClick={handleSave}>Сохранить</Button>
          <Button onClick={handleCancel}>Отмена</Button>
        </div>
      ) : (
        <div>
          <p>ID: {preorder.id}</p>
          <p>Reg Number: {preorder.regNumber}</p>
          <p>Preorder Type: {preorder.preorderType}</p>
          <p>Configuration ID: {preorder.configurationId}</p>
          <p>Environment ID: {preorder.environmentId}</p>
          <p>Datacenter IDs: {preorder.datacenterIds.join(', ')}</p>
          <p>Is Replication: {preorder.isReplication.toString()}</p>
          <p>Status: {preorder.status}</p>
          <Button onClick={() => setEditing(true)}>Изменить</Button>
          <Button onClick={handleGoBack}>Назад</Button>
        </div>
      )}
    </div>
  );
};

export default PreorderDetails;
