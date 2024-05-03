import React from 'react';
import {Tag} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const PreorderStatus = ({status}) => {
  let color = '';
  let statusText = '';
  let icon = null;

  switch (status) {
    case 'NEW':
      color = 'blue';
      statusText = 'Новый';
      icon = <ClockCircleOutlined />;
      break;
    case 'IN_PROGRESS':
      color = 'purple';
      statusText = 'В процессе';
      icon = <LoadingOutlined />;
      break;
    case 'APPROVED':
      color = 'green';
      statusText = 'Утвержден';
      icon = <CheckCircleOutlined />;
      break;
    case 'IN_WORK':
      color = 'orange';
      statusText = 'В работе';
      icon = <ExclamationCircleOutlined />;
      break;
    case 'COMPLETED':
      color = 'cyan';
      statusText = 'Завершен';
      icon = <CheckCircleOutlined />;
      break;
    case 'СANCELED':
      color = 'red';
      statusText = 'Отменен';
      icon = <CloseCircleOutlined />;
      break;
    default:
      color = '';
      statusText = status;
      break;
  }

  return (
    <Tag color={color}>
      {statusText}
      {icon && <span style={{marginLeft: '5px'}}>{icon}</span>}
    </Tag>
  );
};

export default PreorderStatus;
