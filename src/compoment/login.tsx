import * as React from "react";

import { Form, Input, Button, Checkbox, message } from "antd";
import userStore from "../store/userstore";
import { observer } from "mobx-react";



const Login: React.FC<{
  setLogined: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLogined }) => {
  const [isLogin, setLogin] = React.useState<boolean>(true);
  const onFinish = (values: any) => {
    console.log("Success:", values);
    if (isLogin) {
      fetch("http://127.0.0.1:3007/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${values.username}&password=${values.password}`,
      })
        .then((r) => r.json())
        .then((res) => {
          console.log(res, "res");
          if (res.status === 0) {
            //把token存到storage中;
            const storage = window.localStorage;
            storage.setItem("token", res.token);
            storage.setItem("username", values.username);
            message.success("登陆成功");
            setLogined(true); //进入页面
          } else {
            message.error("登陆失败，用户名或密码错误");
          }
        })
        .catch((e) => message.error("登陆失败:" + e));
    } else {
      fetch("http://127.0.0.1:3007/api/reguser", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${values.username}&password=${values.password}`,
      })
        .then((r) => r.json())
        .then((res) => {
          console.log(res, "res");
          message.success("注册成功");
        });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {isLogin ? (
        <p style={{ fontSize: 40, marginLeft: 100 }}>辅助诊断平台</p>
      ) : (
        <p style={{ fontSize: 40, marginLeft: 100 }}>新用户注册</p>
      )}
      <div>
        <Form
          style={{ width: 400 }}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={isLogin ? "用户名" : "新用户名"}
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input style={{ display: "flex" }} />
          </Form.Item>

          <Form.Item
            label={isLogin ? "密码" : "设置密码"}
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password />
          </Form.Item>
          {!isLogin && (
            <Form.Item
              label="确认密码"
              name="ispassword"
              rules={[
                { required: true, message: "请输入密码！" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次密码需一致"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {isLogin ? (
              <Button type="primary" htmlType="submit">
                登陆
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                注册
              </Button>
            )}
            {isLogin ? (
              <Button
                type="primary"
                ghost
                style={{ marginLeft: 100 }}
                onClick={() => setLogin(false)}
              >
                新用户注册
              </Button>
            ) : (
              <Button
                type="primary"
                ghost
                style={{ marginLeft: 100 }}
                onClick={() => setLogin(true)}
              >
                返回登陆
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default observer(Login);
