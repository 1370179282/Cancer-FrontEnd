/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment } from "react";
//import { Provider } from 'react-redux';
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import {
  Avatar,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  Typography,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FolderOpenOutlined,
  ExperimentOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Hittool from "./pages/hittool";
import List from "./pages/list";
import scnuLogo from "./picture/141541642254884_.pic_hd.jpg";
import { createFromIconfontCN } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { userDataTyle } from "../types/type";

const { Text } = Typography;

const IconFont = createFromIconfontCN({
  scriptUrl: [
    "//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js", // icon-javascript, icon-java, icon-shoppingcart (overrided)
    "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js", // icon-shoppingcart, icon-python
  ],
});
const { Header, Sider, Content, Footer } = Layout;

const App: React.FC = (props) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [userData, setData] = useState<any>();
  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    fetch("http://127.0.0.1:3007/my/userinfo", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r, "r");
        if (r.status === 0) {
          setData(r.userdata);
        } else {
          message.error("身份认证失败/过期，请重新登陆");
          navigate("/");
        }
      });
  }, []);
  return (
    <>
      {1 && (
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
                  <Link to={"/app/train"} />
                  图像检测
                </Menu.Item>

                <Menu.Item key="3" icon={<FolderOpenOutlined />}>
                  <Link to={"/app/list"} />
                  更多模型
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
                    style={{ left: 12, position: "absolute", top: 12 }}
                  />
                </a>
                <Dropdown
                  arrow
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.antgroup.com"
                        >
                          个人中心
                        </a>{" "}
                        <UserOutlined />
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.aliyun.com"
                        >
                          个人中心
                        </a>{" "}
                        <UnorderedListOutlined />
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="3">
                        <Text
                          type="danger"
                          onClick={() => {
                            Modal.error({
                              title: "确认退出？",
                              okText: "退出",
                              closable: true,
                              maskClosable: true,
                              okType: "danger",
                              onOk: () => {
                                window.localStorage.setItem("token", "");
                                navigate("/");
                              },
                            });
                          }}
                        >
                          退出登陆
                        </Text>{" "}
                        <LogoutOutlined style={{ color: "red" }} />
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Avatar
                    style={{
                      backgroundColor: "rgba(25,121,254)",
                      position: "absolute",
                      top: 16,
                      right: 20,
                      cursor: "pointer",
                    }}
                  >
                    {userData?.username[0]}
                  </Avatar>
                </Dropdown>
              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: "12px 12px 0px 12px",
                  marginBottom: "0px",
                  padding: 16,
                  minHeight: 280,
                }}
              >
                <Routes>
                  {/* <Route path="/" element={<Login />} /> */}
                  <Route path="/train" element={<Hittool />} />
                  <Route path="/list" element={<List />} />
                </Routes>
              </Content>
              <Footer style={{ textAlign: "center", padding: "0px 50px" }}>
                癌细胞检测网络辅助平台 ©2022 Created by Jiahao Feng
              </Footer>
            </Layout>
          </Layout>
        </>
      )}
    </>
  );
};
export default observer(App);
