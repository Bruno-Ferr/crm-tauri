import { LockOutlined, UserOutlined } from "@ant-design/icons";
//import { AuthContext } from "@renderer/contexts/AuthContext";
import { Button, Flex, Form, Input } from "antd";
import { useContext } from "react";
//import { Navigate, redirect } from "react-router-dom";

export default function Login(): JSX.Element {
  //const {signIn} = useContext(AuthContext)

  const onFinish = async (values: any) => {
    //await signIn(values)
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Flex vertical={false} align="center" justify="center" style={{height: '100vh'}}>
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
       <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}
