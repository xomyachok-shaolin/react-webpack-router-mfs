import React, { FC } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
// import { loginAsync } from '@/stores/user.store';
// import { useAppDispatch } from '@/stores';
import { Location } from "history";
import { useLogin } from "@/api";
// @ts-ignore
import styles from "./index.module.less";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"
//import { EditControl } from "react-leaflet-draw";
// @ts-ignore
window.type = ''

import drawLocales from 'leaflet-draw-locales'
drawLocales('ru')

const initialValues: LoginParams = {
  username: "guest",
  password: "guest",
  // remember: true
};

const LoginForm: FC = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();// @ts-ignore
  const location = useLocation() as Location<{ from: string }>;

  // const dispatch = useAppDispatch();

  const onFinished = async (form: LoginParams) => {
    const result = await loginMutation.mutateAsync(form);
    console.log("result: ", result);

    if (result) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);

      const from = location.state?.from || { pathname: "/dashboard" };
      navigate(from);
    }
  };

  return (
    <>
      <div className={styles.top}>
        <div className={styles.header}>
          <Link to="/">
            {/* <LogoSvg className={styles.logo} /> */}
            <span className={styles.title}>Lorem</span>
          </Link>
        </div>
        <div className={styles.desc}>Inventore veniam minima est saepe distinctio perferendis officiis nesciunt natus. 
        Corporis repudiandae repellat facilis ullam necessitatibus quaerat 
        odit enim accusamus deserunt voluptate?</div>
      </div>
      <div className={styles.main}>
        <Form<LoginParams> onFinish={onFinished} initialValues={initialValues}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input size="large" placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input type="password" size="large" placeholder="密码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              className={styles.mainLoginBtn}
              htmlType="submit"
              type="primary"
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
