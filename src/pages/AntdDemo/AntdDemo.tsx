import React, { useState } from 'react';
import {
    Button,
    Card,
    Input,
    Table,
    Form,
    Select,
    DatePicker,
    Space,
    Tag,
    Alert,
    Row,
    Col,
    Divider,
    Typography,
    Switch,
    Radio,
    Checkbox,
    Modal,
    message,
    notification,
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    BulbOutlined,
} from '@ant-design/icons';

import { useTheme } from '@/providers/ThemeProvider';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    status: string;
}

const AntdDemo: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    // 表格数据
    const dataSource: DataType[] = [
        {
            key: '1',
            name: '张三',
            age: 32,
            address: '西湖区湖底公园1号',
            status: 'active',
        },
        {
            key: '2',
            name: '李四',
            age: 42,
            address: '西湖区湖底公园2号',
            status: 'inactive',
        },
        {
            key: '3',
            name: '王五',
            age: 28,
            address: '西湖区湖底公园3号',
            status: 'active',
        },
    ];

    // 表格列配置
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '激活' : '未激活'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: DataType) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} size="small">
                        编辑
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    // 表单提交
    const onFinish = (values: any) => {
        setLoading(true);
        console.log('表单数据:', values);
        setTimeout(() => {
            setLoading(false);
            message.success('操作成功！');
        }, 1000);
    };

    // 显示通知
    const showNotification = () => {
        notification.open({
            message: '通知标题',
            description: '这是一条通知消息，用于显示重要信息。',
            duration: 4.5,
        });
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Title level={1}>Ant Design 组件演示</Title>
                        <Paragraph>
                            这是一个Ant Design组件的演示页面，展示了常用组件的使用方法。
                        </Paragraph>
                    </div>
                    <Space>
                        <Switch
                            checked={isDark}
                            onChange={toggleTheme}
                            checkedChildren={<BulbOutlined />}
                            unCheckedChildren={<BulbOutlined />}
                        />
                        <span>{isDark ? '暗色模式' : '浅色模式'}</span>
                    </Space>
                </div>

                {/* 警告信息 */}
                <Alert
                    message="欢迎使用Ant Design"
                    description="这是一个功能丰富的React UI组件库，提供了丰富的组件和优雅的设计。"
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <Row gutter={[16, 16]}>
                    {/* 表单卡片 */}
                    <Col xs={24} lg={12}>
                        <Card title="用户表单" className="h-full">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="请输入用户名"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="请输入密码"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item label="性别" name="gender">
                                    <Radio.Group>
                                        <Radio value="male">男</Radio>
                                        <Radio value="female">女</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="城市" name="city">
                                    <Select placeholder="请选择城市" size="large">
                                        <Option value="beijing">北京</Option>
                                        <Option value="shanghai">上海</Option>
                                        <Option value="guangzhou">广州</Option>
                                        <Option value="shenzhen">深圳</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="生日" name="birthday">
                                    <DatePicker
                                        placeholder="请选择生日"
                                        size="large"
                                        className="w-full"
                                    />
                                </Form.Item>

                                <Form.Item name="agree" valuePropName="checked">
                                    <Checkbox>我同意服务条款和隐私政策</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<PlusOutlined />}
                                        >
                                            提交
                                        </Button>
                                        <Button onClick={() => form.resetFields()}>重置</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    {/* 操作演示卡片 */}
                    <Col xs={24} lg={12}>
                        <Card title="操作演示" className="h-full">
                            <Space direction="vertical" className="w-full" size="large">
                                <div>
                                    <Title level={4}>按钮组</Title>
                                    <Space wrap>
                                        <Button type="primary">主要按钮</Button>
                                        <Button>默认按钮</Button>
                                        <Button type="dashed">虚线按钮</Button>
                                        <Button type="text">文本按钮</Button>
                                        <Button type="link">链接按钮</Button>
                                        <Button danger>危险按钮</Button>
                                    </Space>
                                </div>

                                <div>
                                    <Title level={4}>开关和状态</Title>
                                    <Space>
                                        <Switch defaultChecked />
                                        <Switch size="small" />
                                        <Tag color="blue">标签</Tag>
                                        <Tag color="green">成功</Tag>
                                        <Tag color="red">错误</Tag>
                                    </Space>
                                </div>

                                <div>
                                    <Title level={4}>操作按钮</Title>
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<SearchOutlined />}
                                            onClick={() => message.info('搜索功能')}
                                        >
                                            搜索
                                        </Button>
                                        <Button
                                            icon={<DownloadOutlined />}
                                            onClick={() => message.success('下载开始')}
                                        >
                                            下载
                                        </Button>
                                        <Button
                                            type="primary"
                                            ghost
                                            onClick={() => setModalVisible(true)}
                                        >
                                            打开模态框
                                        </Button>
                                        <Button type="dashed" onClick={showNotification}>
                                            显示通知
                                        </Button>
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Divider />

                {/* 数据表格 */}
                <Card title="数据表格" className="mt-6">
                    <div className="mb-4">
                        <Space>
                            <Input
                                placeholder="搜索姓名"
                                prefix={<SearchOutlined />}
                                style={{ width: 200 }}
                            />
                            <Select placeholder="选择状态" style={{ width: 120 }} allowClear>
                                <Option value="active">激活</Option>
                                <Option value="inactive">未激活</Option>
                            </Select>
                            <Button type="primary" icon={<PlusOutlined />}>
                                新增用户
                            </Button>
                        </Space>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{
                            total: 50,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total: number, range: [number, number]) =>
                                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                        }}
                    />
                </Card>

                {/* 模态框 */}
                <Modal
                    title="模态框标题"
                    open={modalVisible}
                    onOk={() => {
                        setModalVisible(false);
                        message.success('确认操作成功！');
                    }}
                    onCancel={() => setModalVisible(false)}
                    width={600}
                >
                    <p>这是一个模态框的内容区域。</p>
                    <p>您可以在这里放置任何内容，比如表单、文本、图片等。</p>
                    <Alert
                        message="提示信息"
                        description="这是一个在模态框中的提示信息。"
                        type="warning"
                        showIcon
                        className="mt-4"
                    />
                </Modal>
            </div>
        </div>
    );
};

export default AntdDemo;
