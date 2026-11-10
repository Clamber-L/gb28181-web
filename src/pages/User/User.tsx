import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Table,
    Tag,
    Modal,
    Form,
    Input,
    Switch,
    Space,
    message,
    Select,
    Upload,
    Avatar,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

// 定义用户类型
interface UserType {
    id: string | number;
    username: string;
    email: string;
    nickname: string;
    phone: string;
    status: number;
    avatar?: string;
    roleIds?: number[];
    createTime: string;
    updateTime?: string;
}

interface UserQueryParams {
    username?: string;
    email?: string;
    status?: number;
    page?: number;
    pageSize?: number;
}

// 模拟角色数据
interface RoleOption {
    value: number;
    label: string;
}

const roleOptions: RoleOption[] = [
    { value: 1, label: '超级管理员' },
    { value: 2, label: '普通用户' },
    { value: 3, label: '访客' },
];

// 模拟API请求
const fetchUserList = async (
    params: UserQueryParams,
): Promise<{ data: UserType[]; total: number }> => {
    // 模拟数据
    const mockData: UserType[] = [
        {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            nickname: '管理员',
            phone: '13800138000',
            status: 1,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            roleIds: [1],
            createTime: '2023-01-01 12:00:00',
            updateTime: '2023-01-01 12:00:00',
        },
        {
            id: '2',
            username: 'user1',
            email: 'user1@example.com',
            nickname: '用户1',
            phone: '13800138001',
            status: 1,
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            roleIds: [2],
            createTime: '2023-01-02 12:00:00',
            updateTime: '2023-01-02 12:00:00',
        },
        {
            id: '3',
            username: 'user2',
            email: 'user2@example.com',
            nickname: '用户2',
            phone: '13800138002',
            status: 0,
            avatar: '',
            roleIds: [3],
            createTime: '2023-01-03 12:00:00',
            updateTime: '2023-01-03 12:00:00',
        },
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: mockData,
                total: mockData.length,
            });
        }, 500);
    });
};

const User: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<UserType[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    // 搜索相关状态
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchForm] = Form.useForm();

    // 弹窗相关状态
    const [dialogVisible, setDialogVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentUserData, setCurrentUserData] = useState<UserType | undefined>(undefined);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 头像上传配置
    const uploadProps: UploadProps = {
        name: 'avatar',
        listType: 'picture',
        maxCount: 1,
        fileList,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('只能上传图片文件!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不能超过2MB!');
                return false;
            }
            return false; // 阻止自动上传
        },
        onChange: ({ fileList }) => {
            setFileList(fileList);
        },
    };

    // 表格列配置
    const columns: ColumnsType<UserType> = [
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (avatar: string) => (
                <Avatar src={avatar} icon={<UserOutlined />} size="large" />
            ),
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 120,
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            width: 120,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 180,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: '角色',
            dataIndex: 'roleIds',
            key: 'roleIds',
            width: 150,
            render: (roleIds: number[]) => (
                <Space size={0}>
                    {roleIds?.map((roleId) => {
                        const role = roleOptions.find((r) => r.value === roleId);
                        return role ? (
                            <Tag key={roleId} color="blue">
                                {role.label}
                            </Tag>
                        ) : null;
                    })}
                </Space>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: number) => {
                const statusConfig =
                    status === 1
                        ? { color: 'success', text: '启用' }
                        : { color: 'warning', text: '禁用' };
                return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
        },
        {
            title: '操作',
            key: 'operation',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showDialog('edit', record)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    // 获取数据
    const fetchData = async (params: UserQueryParams = {}) => {
        setLoading(true);
        try {
            const { data, total } = await fetchUserList({
                ...params,
                page: pagination.current,
                pageSize: pagination.pageSize,
            });
            setDataSource(data);
            setPagination({
                ...pagination,
                total,
            });
        } catch (error) {
            console.error('获取用户列表失败:', error);
            message.error('获取用户列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 初始化加载数据
    useEffect(() => {
        fetchData();
    }, []);

    // 搜索
    const handleSearch = async () => {
        const values = await searchForm.validateFields();
        setPagination({
            ...pagination,
            current: 1,
        });
        fetchData(values);
    };

    // 重置搜索
    const handleReset = () => {
        searchForm.resetFields();
        setPagination({
            ...pagination,
            current: 1,
        });
        fetchData();
    };

    // 显示弹窗
    const showDialog = (type: 'add' | 'edit', record?: UserType) => {
        setDialogType(type);
        setCurrentUserData(record);
        setDialogVisible(true);

        // 重置文件列表
        setFileList([]);

        if (type === 'edit' && record) {
            form.setFieldsValue({
                ...record,
            });

            // 如果有头像，设置预览
            if (record.avatar) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'avatar.png',
                        status: 'done',
                        url: record.avatar,
                    },
                ]);
            }
        } else {
            form.resetFields();
        }
    };

    // 关闭弹窗
    const closeDialog = () => {
        setDialogVisible(false);
        form.resetFields();
    };

    // 保存用户
    const saveUser = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            // 处理头像数据
            let avatarUrl = '';
            if (fileList.length > 0) {
                // 在实际应用中，这里应该上传文件到服务器并获取URL
                // 这里我们模拟一个URL
                avatarUrl =
                    fileList[0].url ||
                    `https://randomuser.me/api/portraits/men/${Math.floor(
                        Math.random() * 100,
                    )}.jpg`;
            }

            // 模拟API调用
            setTimeout(() => {
                if (dialogType === 'add') {
                    // 添加用户
                    const newUser: UserType = {
                        id: Math.floor(Math.random() * 1000).toString(),
                        ...values,
                        avatar: avatarUrl,
                        createTime: new Date().toISOString(),
                    };
                    setDataSource([...dataSource, newUser]);
                    message.success('添加成功');
                } else {
                    // 编辑用户
                    const newData = dataSource.map((item) => {
                        if (item.id === currentUserData?.id) {
                            return {
                                ...item,
                                ...values,
                                avatar: avatarUrl || item.avatar,
                            };
                        }
                        return item;
                    });
                    setDataSource(newData);
                    message.success('更新成功');
                }

                closeDialog();
                setConfirmLoading(false);
            }, 1000);
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    // 删除用户
    const handleDelete = (record: UserType) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除用户 "${record.username}" 吗？`,
            onOk: () => {
                // 模拟API调用
                setTimeout(() => {
                    const newData = dataSource.filter((item) => item.id !== record.id);
                    setDataSource(newData);
                    message.success('删除成功');
                }, 500);
            },
        });
    };

    return (
        <div className="user-page">
            <Card
                title="用户管理"
                extra={
                    <Space>
                        <Button
                            type={showSearchBar ? 'primary' : 'default'}
                            icon={<SearchOutlined />}
                            onClick={() => setShowSearchBar(!showSearchBar)}
                        >
                            搜索
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showDialog('add')}
                        >
                            新增用户
                        </Button>
                    </Space>
                }
            >
                {/* 搜索栏 */}
                {showSearchBar && (
                    <div className="search-bar mb-6 p-4 bg-gray-50 rounded-lg">
                        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
                            <Form.Item name="username" label="用户名">
                                <Input placeholder="请输入用户名" allowClear />
                            </Form.Item>
                            <Form.Item name="email" label="邮箱">
                                <Input placeholder="请输入邮箱" allowClear />
                            </Form.Item>
                            <Form.Item name="status" label="状态">
                                <Select
                                    placeholder="请选择状态"
                                    allowClear
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 1, label: '启用' },
                                        { value: 0, label: '禁用' },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item className="mb-0">
                                <Space size="middle">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SearchOutlined />}
                                    >
                                        搜索
                                    </Button>
                                    <Button onClick={handleReset}>重置</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                {/* 用户表格 */}
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    onChange={(page) => {
                        setPagination({
                            ...pagination,
                            current: page.current || 1,
                        });
                        fetchData();
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* 用户表单弹窗 */}
            <Modal
                title={dialogType === 'add' ? '新增用户' : '编辑用户'}
                open={dialogVisible}
                onOk={saveUser}
                onCancel={closeDialog}
                confirmLoading={confirmLoading}
                maskClosable={false}
                width={600}
            >
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{ required: true, message: '请输入昵称' }]}
                    >
                        <Input placeholder="请输入昵称" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="手机号"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                        ]}
                    >
                        <Input placeholder="请输入手机号" />
                    </Form.Item>

                    <Form.Item name="avatar" label="头像">
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>上传头像</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="roleIds"
                        label="角色"
                        rules={[{ required: true, message: '请选择至少一个角色' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择角色"
                            options={roleOptions}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item name="status" label="状态" initialValue={1}>
                        <Switch
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            defaultChecked
                            checked={form.getFieldValue('status') === 1}
                            onChange={(checked) => form.setFieldValue('status', checked ? 1 : 0)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default User;
