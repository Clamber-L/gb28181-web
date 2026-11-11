import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, App } from 'antd';
import { BulbOutlined, VideoCameraOutlined } from '@ant-design/icons';

import { useAuth } from '@/stores/authStore';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from '@/hooks';
import { HOMEPAGE } from '@/router';

interface LoginFormData {
    username: string;
    password: string;
    rememberPassword: boolean;
}

// 默认账号密码
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = '123456';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { setState } = useAuth();
    const { toggleTheme } = useTheme();
    const router = useRouter();
    const { message } = App.useApp();

    const handleLogin = async (values: LoginFormData) => {
        setLoading(true);

        // 简单校验默认账号密码
        if (values.username === DEFAULT_USERNAME && values.password === DEFAULT_PASSWORD) {
            setState({
                isLogin: true,
                accessToken: 'local-token',
                userInfo: {
                    username: values.username,
                } as any,
                loading: false,
            });

            message.success('登录成功');
            router.push(HOMEPAGE);
        } else {
            message.error('账号或密码错误');
        }

        setLoading(false);
    };

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900">
            {/* 左侧装饰 */}
            <div className="hidden lg:flex w-[55%] h-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-gray-800 dark:to-gray-900 items-center justify-center">
                <div className="text-center text-white">
                    <VideoCameraOutlined className="text-8xl mb-6" />
                    <h1 className="text-3xl font-bold mb-3">GB28181 视频管理平台</h1>
                    <p className="text-lg opacity-80">国标视频监控设备接入与管理</p>
                </div>
            </div>

            {/* 右侧登录表单 */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* 主题切换 */}
                <div
                    className="absolute top-6 right-8 p-2 cursor-pointer rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={toggleTheme}
                >
                    <BulbOutlined className="text-lg" />
                </div>

                <div className="w-96 px-6">
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <VideoCameraOutlined className="text-3xl text-blue-500 mr-2" />
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            GB28181 视频管理平台
                        </span>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        用户登录
                    </h3>
                    <p className="mt-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                        默认账号: admin / 123456
                    </p>

                    <Form
                        onFinish={handleLogin}
                        autoComplete="off"
                        initialValues={{
                            username: DEFAULT_USERNAME,
                            password: DEFAULT_PASSWORD,
                            rememberPassword: true,
                        }}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input placeholder="用户名" className="h-10" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                placeholder="密码"
                                autoComplete="off"
                                className="h-10"
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between mb-6 text-sm text-gray-500 dark:text-gray-400">
                            <Form.Item
                                name="rememberPassword"
                                valuePropName="checked"
                                className="mb-0"
                            >
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-10"
                            loading={loading}
                        >
                            登录
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
