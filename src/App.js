import React from 'react';
import { Layout , Space } from 'antd';
import {VideoInput} from './components/VideoInput';
import './App.css';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <div>
      <Layout>
        <Space direction="vertical">
        <Header>Header</Header>
        <Content style={{
          height: '550px'
        }}>
          <VideoInput />
        </Content>
        <Footer>
          Copyright CvC
        </Footer>
        </Space>
      </Layout>
    </div>
  );
}

export default App;
