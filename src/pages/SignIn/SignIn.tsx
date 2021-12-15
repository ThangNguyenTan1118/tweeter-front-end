import React, { useContext, useState } from "react";
import { Form, Input, Button } from "antd";
import { useSignInMutation } from "../../generated/graphql";
import { AuthContext } from "../../context/auth";

const SignIn: React.FC = () => {
  const [errors, setErrors] = useState<any>([]);
  const context = useContext(AuthContext);

  const [signin] = useSignInMutation({
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      context.login(data.signin);
    },
  });

  const onFinish = (values: any) => {
    const { email, password } = values;

    setErrors([]);
    signin({
      variables: {
        email,
        password,
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
            help={errors["email"] ? errors["email"] : ""}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
