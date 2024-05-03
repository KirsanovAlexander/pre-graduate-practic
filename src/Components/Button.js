import React from 'react';
import {Button} from 'antd';
import {PlusOutlined, EditOutlined, LeftOutlined, CloseOutlined, SaveOutlined} from '@ant-design/icons';

const IconButton = ({icon, color, text, onClick}) => (
  <Button type="primary" style={{backgroundColor: color}} onClick={onClick} icon={icon}>
    {text}
  </Button>
);

const NewRecordButton = ({onClick}) => (
  <IconButton icon={<PlusOutlined />} text="Добавить" onClick={onClick} />
);

const EditButton = ({onClick}) => (
  <IconButton icon={<EditOutlined />} text="Изменить" onClick={onClick} />
);

const BackButton = ({onClick}) => (
  <IconButton icon={<LeftOutlined />} text="Назад" onClick={onClick} tyle={{marginLeft: '10px'}}/>
);

const CancelButton = ({onClick}) => (
  <IconButton icon={<CloseOutlined />} color="red" text="Отменить" onClick={onClick} />
);

const SaveButton = ({onClick}) => (
  <IconButton icon={<SaveOutlined />} color="green" text="Сохранить" onClick={onClick} />
);

export {NewRecordButton, EditButton, BackButton, CancelButton, SaveButton};
