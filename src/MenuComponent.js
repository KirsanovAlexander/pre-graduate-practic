import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  FileOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  ClusterOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function MenuComponent() {
  return (
    <Sider width={256} style={{ background: '#fff' }}>
      <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="preorders" icon={<FileOutlined />}>
          <Link to="/preorders">Потребности</Link>
        </Menu.Item>
        <Menu.Item key="environments" icon={<EnvironmentOutlined />}>
          <Link to="/environments">Среды</Link>
        </Menu.Item>
        <Menu.Item key="configurations" icon={<AppstoreOutlined />}>
          <Link to="/configurations">Конфигурации</Link>
        </Menu.Item>
        <Menu.Item key="datacenters" icon={<ClusterOutlined />}>
          <Link to="/datacenters">ЦОДы</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
