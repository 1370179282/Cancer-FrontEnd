/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment } from "react";
//import { Provider } from 'react-redux';
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ApartmentOutlined,
  FolderOpenOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import Home from "./pages/train";
import Inquiry from "./pages/hittool";
import Offer from "./pages/list";
import scnuLogo from "./picture/141541642254884_.pic_hd.jpg";
import { createFromIconfontCN } from "@ant-design/icons";
import { observer } from "mobx-react";
import { Login } from "./compoment/login";

const IconFont = createFromIconfontCN({
  scriptUrl: [
    "//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js", // icon-javascript, icon-java, icon-shoppingcart (overrided)
    "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js", // icon-shoppingcart, icon-python
  ],
});
const { Header, Sider, Content, Footer } = Layout;

const App: React.FC = (props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <>
      {!!1 && (
        <>
          <Login isLogin={true} />
        </>
      )}
      {!!0 && (
        <>
          <Layout style={{ height: "100%" }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              theme="light"
            >
              <div className="logo">
                <IconFont
                  type="icon-javascript"
                  className="js-logo"
                  style={{ marginLeft: 10 }}
                />
              </div>
              <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1" icon={<ExperimentOutlined />}>
                  <Link to={"/hittool"} />
                  检测工具
                </Menu.Item>
                <Menu.Item key="2" icon={<ApartmentOutlined />}>
                  <Link to={"/train"} />
                  训练模型
                </Menu.Item>
                <Menu.Item key="3" icon={<FolderOpenOutlined />}>
                  <Link to={"/list"} />
                  模型大全
                </Menu.Item>
              </Menu>
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
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }}>
                {/* <img src="https://statics.scnu.edu.cn/statics/images/ioe/sitename.png" /> */}
                <a
                  href="https://www.scnu.edu.cn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={scnuLogo}
                    height={45}
                    width={168}
                    style={{ right: 12, position: "absolute", top: 12 }}
                  />
                </a>
              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: "24px 24px 0px 24px",
                  marginBottom: "0px",
                  padding: 16,
                  minHeight: 280,
                }}
              >
                <Routes>
                  <Route path="/hittool" element={<Inquiry />} />
                  <Route path="/train" element={<Home />} />
                  <Route path="/list" element={<Offer />} />
                </Routes>
              </Content>
              <Footer style={{ textAlign: "center", padding: "0px 50px" }}>
                早期胃癌筛查网络辅助平台 ©2022 Created by Jiahao Feng
              </Footer>
            </Layout>
          </Layout>
        </>
      )}
    </>
  );
};
export default observer(App);
