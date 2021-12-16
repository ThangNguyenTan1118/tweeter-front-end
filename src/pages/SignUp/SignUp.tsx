import React, { useContext, useState } from "react";
import { Form, Input, Button } from "antd";
import { useSignUpMutation } from "../../generated/graphql";
import { AuthContext } from "../../context/auth";

const SignUp: React.FC = () => {
  const [errors, setErrors] = useState<any>([]);
  const context = useContext(AuthContext);

  const [register] = useSignUpMutation({
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      context.login(data.signup);
    },
  });

  const onFinish = (values: any) => {
    setErrors([]);
    register({
      variables: {
        input: values,
      },
    });
  };

  return (
    <div className="auth-page">
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <Form
          name="basic"
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
            validateStatus={errors["username"] ? "error" : ""}
            help={errors["username"]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
            validateStatus={errors["email"] ? "error" : ""}
            help={errors["email"]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            validateStatus={errors["password"] ? "error" : ""}
            help={errors["password"]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
