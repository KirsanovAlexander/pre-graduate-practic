import React from 'react'
import {Layout} from 'antd'
import MenuComponent from './MenuComponent'

const {Content} = Layout

function AppLayout({children}) {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <MenuComponent />
      <Layout>
        <Content style={{margin: '16px'}}>
          <div style={{padding: 24, background: '#fff', minHeight: 360, width: 1000}}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
