import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const Home: React.FC = (props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {collapsed ? (
              <>
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed((pre) => !pre)}
                />
              </>
            ) : (
              <MenuFoldOutlined
                className="trigger"
                onClick={() => setCollapsed((pre) => !pre)}
              />
            )}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
      {/* <br />
        <Link to={"/inquiry"}> to inquiry</Link>
        <br />
        <Link to={"/offer"}> to offer</Link> */}
    </>
  );
};

export default Home;
