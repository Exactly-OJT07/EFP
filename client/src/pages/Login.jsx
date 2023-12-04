import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { openNotificationWithIcon } from '../components/notification/notification';
const Login = () => {
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const onFinish = (values) => {
    // Get stored credentials from localStorage
    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || {};
  
    const hardcodedCredentials = {
      username: 'linh@gmail.com',
      password: '123',
    };
  
    if (
      (values.username === hardcodedCredentials.username && values.password === hardcodedCredentials.password) ||
      (values.username === storedCredentials.username && values.password === storedCredentials.password)
    ) {
      setShowAlert(true);
  
      const updatedCredentials = {
        ...storedCredentials,
        ...values,
      };
  
      localStorage.setItem('username', JSON.stringify(updatedCredentials.username));
      
      openNotificationWithIcon('success', 'Login Successfully');
      navigate('/dashboard');
    } else {
      openNotificationWithIcon('error', 'Login Fail');
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className='login__container'>
      <div className="login">
      <div className="image">
        <img
          src="https://cdn.dribbble.com/users/535615/screenshots/17649043/media/e4c03808fa04fa65e0c58d6d61f2fd54.png"
          alt="Login"
        />
      </div>
      <Form name="login-form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          {showAlert && (
            <Alert message="Login Successfully" type="success" showIcon onClose={() => setShowAlert(false)} />
          )}
          {showError && (
            <Alert message="Login Failed" type="error" showIcon onClose={() => setShowError(false)} />
          )}
        <p className="form-title">Log In</p>
        <p>Enter your email and password to login to our dashboard.</p>
        <p className="title">Email</p>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input placeholder="Enter your Email" />
        </Form.Item>
        <p className="title">Password</p>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder="Enter your Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  );
};
export default Login;