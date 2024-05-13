import React, {useState, useEffect} from 'react';
import {Layout, Menu, Button} from 'antd';
import {Link} from 'react-router-dom';
import {
  FileOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

const {Sider} = Layout;

const MenuComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('preorders'); 

  useEffect(() => {
    const storedMenuItem = localStorage.getItem('selectedMenuItem');
    if (storedMenuItem) setSelectedMenuItem(storedMenuItem);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedMenuItem', selectedMenuItem);
  }, [selectedMenuItem]);


  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key); 
  };

  const items = [
    {key: 'preorders', icon: <FileOutlined />, label: <Link to='/preorders'>Потребности</Link>}, 
    {key: 'environments', icon: <EnvironmentOutlined />, label: <Link to='/environments'>Среды</Link>},
    {
      key: 'configurations',
      icon: <AppstoreOutlined />,
      label: <Link to='/configurations'>Конфигурации</Link>,
    },
    {key: 'datacenters', icon: <ClusterOutlined />, label: <Link to='/datacenters'>Дата-центры</Link>},
  ];

  return (
    <Sider collapsed={collapsed} width={256} style={{background: '#fff'}}>
      <div style={{background: '#1890ff', padding: '10px', textAlign: 'center'}}>
        <img src="/logo.svg" alt="Logo" style={{width: 40, height: 40, marginRight: 8}} />
        <span style={{color: '#fff'}}>Преддипломная практика</span>
      </div>
      <div style={{justifyContent: 'center', marginTop: 16}}>
        <Button type="primary" onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        mode="inline"
        style={{height: '100%', borderRight: 0}}
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuClick}
        items={items}
      />
    </Sider>
  );
};

export default MenuComponent;
