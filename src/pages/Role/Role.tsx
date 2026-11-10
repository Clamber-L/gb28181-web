import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Table, Tag, Modal, Form, Input, Switch, Space, message, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SettingOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { Permission } from '@/types/user';
import { mockRouteTree } from '@/mock/routeData';

// 模拟角色数据类型
interface RoleListItem {
    roleId: number;
    roleName: string;
    roleCode: string;
    description: string;
    createTime: string;
    enabled: boolean;
}

// 模拟API请求
const fetchRoleList = async (params: any): Promise<{ data: RoleListItem[]; total: number }> => {
    // 模拟数据
    const mockData: RoleListItem[] = [
        {
            roleId: 1,
            roleName: '超级管理员',
            roleCode: 'ADMIN',
            description: '拥有系统最高权限',
            createTime: '2023-01-01 12:00:00',
            enabled: true
        },
        {
            roleId: 2,
            roleName: '普通用户',
            roleCode: 'USER',
            description: '系统普通用户',
            createTime: '2023-01-02 12:00:00',
            enabled: true
        },
        {
            roleId: 3,
            roleName: '访客',
            roleCode: 'GUEST',
            description: '访客用户',
            createTime: '2023-01-03 12:00:00',
            enabled: false
        }
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: mockData,
                total: mockData.length
            });
        }, 500);
    });
};

const RolePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RoleListItem[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    });

    // 搜索相关状态
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchForm] = Form.useForm();

    // 弹窗相关状态
    const [dialogVisible, setDialogVisible] = useState(false);
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentRoleData, setCurrentRoleData] = useState<RoleListItem | undefined>(undefined);

    // 表格列配置
    const columns: ColumnsType<RoleListItem> = [
        {
            title: '角色ID',
            dataIndex: 'roleId',
            key: 'roleId',
            width: 100
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            minWidth: 120
        },
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode',
            minWidth: 120
        },
        {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
            minWidth: 150
        },
        {
            title: '角色状态',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 100,
            render: (enabled: boolean) => {
                const statusConfig = enabled
                    ? { color: 'success', text: '启用' }
                    : { color: 'warning', text: '禁用' };
                return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180
        },
        {
            title: '操作',
            key: 'operation',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<SettingOutlined />}
                        onClick={() => showPermissionDialog(record)}
                    >
                        菜单权限
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showDialog('edit', record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteRole(record)}
                    >
                        删除
                    </Button>
                </Space>
            )
        }
    ];

    // 获取表格数据
    const getData = async () => {
        setLoading(true);
        try {
            const params = {
                current: pagination.current,
                size: pagination.pageSize,
                ...searchForm.getFieldsValue()
            };

            const result = await fetchRoleList(params);
            setData(result.data);
            setPagination({
                ...pagination,
                total: result.total
            });
        } catch (error) {
            message.error('获取角色数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 搜索处理
    const handleSearch = () => {
        setPagination({
            ...pagination,
            current: 1
        });
        getData();
    };

    // 重置搜索
    const resetSearchParams = () => {
        searchForm.resetFields();
        setPagination({
            ...pagination,
            current: 1
        });
        getData();
    };

    // 刷新数据
    const refreshData = () => {
        getData();
    };

    // 分页处理
    const handleSizeChange = (pageSize: number) => {
        setPagination({
            ...pagination,
            pageSize,
            current: 1
        });
        getData();
    };

    const handleCurrentChange = (page: number) => {
        setPagination({
            ...pagination,
            current: page
        });
        getData();
    };

    // 弹窗相关函数
    const showDialog = (type: 'add' | 'edit', row?: RoleListItem) => {
        setDialogType(type);
        setCurrentRoleData(row);
        setDialogVisible(true);
    };

    const showPermissionDialog = (row?: RoleListItem) => {
        setCurrentRoleData(row);
        setPermissionDialog(true);
    };

    // 删除角色
    const deleteRole = (row: RoleListItem) => {
        Modal.confirm({
            title: '删除确认',
            content: `确定删除角色"${row.roleName}"吗？此操作不可恢复！`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    // TODO: 调用删除接口
                    message.success('删除成功');
                    refreshData();
                } catch (error) {
                    message.error('删除失败');
                }
            }
        });
    };

    // 组件挂载时获取数据
    useEffect(() => {
        getData();
    }, [pagination.current, pagination.pageSize]);

    return (
        <div className="role-page" style={{ padding: '16px', height: '100%' }}>
            {/* 搜索栏 */}
            {showSearchBar && (
                <Card style={{ marginBottom: 16 }}>
                    <Form form={searchForm} layout="inline">
                        <Form.Item name="roleName" label="角色名称">
                            <Input placeholder="请输入角色名称" />
                        </Form.Item>
                        <Form.Item name="roleCode" label="角色编码">
                            <Input placeholder="请输入角色编码" />
                        </Form.Item>
                        <Form.Item name="description" label="角色描述">
                            <Input placeholder="请输入角色描述" />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                    搜索
                                </Button>
                                <Button onClick={resetSearchParams}>重置</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            )}

            <Card>
                {/* 表格头部 */}
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDialog('add')}>
                            新增角色
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            style={{ marginRight: 8 }}
                        >
                            {showSearchBar ? '隐藏搜索' : '显示搜索'}
                        </Button>
                        <Button onClick={refreshData}>刷新</Button>
                    </div>
                </div>

                {/* 表格 */}
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                        onChange: handleCurrentChange,
                        onShowSizeChange: (_, size) => handleSizeChange(size)
                    }}
                    scroll={{ x: 'max-content' }}
                />

                {/* 角色编辑弹窗 */}
                <RoleEditDialog
                    visible={dialogVisible}
                    onCancel={() => setDialogVisible(false)}
                    onOk={() => {
                        setDialogVisible(false);
                        refreshData();
                    }}
                    dialogType={dialogType}
                    roleData={currentRoleData}
                />

                {/* 菜单权限弹窗 */}
                <RolePermissionDialog
                    visible={permissionDialog}
                    onCancel={() => setPermissionDialog(false)}
                    onOk={() => {
                        setPermissionDialog(false);
                        refreshData();
                    }}
                    roleData={currentRoleData}
                />
            </Card>
        </div>
    );
};

// 角色编辑弹窗组件
interface RoleEditDialogProps {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    dialogType: 'add' | 'edit';
    roleData?: RoleListItem;
}

const RoleEditDialog: React.FC<RoleEditDialogProps> = ({
    visible,
    onCancel,
    onOk,
    dialogType,
    roleData
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (dialogType === 'edit' && roleData) {
                form.setFieldsValue(roleData);
            } else {
                form.resetFields();
            }
        }
    }, [visible, dialogType, roleData, form]);

    const handleOk = () => {
        form.validateFields().then(() => {
            // TODO: 调用新增/编辑接口
            const messageText = dialogType === 'add' ? '新增成功' : '修改成功';
            message.success(messageText);
            onOk();
        });
    };

    return (
        <Modal
            title={dialogType === 'add' ? '新增角色' : '编辑角色'}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            width={500}
        >
            <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Form.Item
                    label="角色名称"
                    name="roleName"
                    rules={[
                        { required: true, message: '请输入角色名称' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="角色编码"
                    name="roleCode"
                    rules={[
                        { required: true, message: '请输入角色编码' },
                        { min: 2, max: 50, message: '长度在 2 到 50 个字符' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                    rules={[{ required: true, message: '请输入角色描述' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="启用" name="enabled" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// 菜单权限弹窗组件
interface RolePermissionDialogProps {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    roleData?: RoleListItem;
}

const RolePermissionDialog: React.FC<RolePermissionDialogProps> = ({
    visible,
    onCancel,
    onOk,
    roleData
}) => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    // 处理菜单数据，将权限标识转换为子节点
    const processedMenuData = useMemo(() => {
        const processNode = (node: Permission): any => {
            const processed: any = {
                ...node,
                key: node.id,
                title: node.label,
            };

            // 如果有子节点，递归处理
            if (node.children && node.children.length > 0) {
                processed.children = node.children.map(processNode);
            }

            return processed;
        };

        return mockRouteTree.map(processNode);
    }, []);

    // 初始化选中的权限（模拟数据）
    useEffect(() => {
        if (visible && roleData) {
            // 模拟一些默认选中的权限
            const defaultCheckedKeys = ['1', '1-1', '1-2', '3', '12'];
            setCheckedKeys(defaultCheckedKeys);
            setExpandedKeys(['1', '3']);
        }
    }, [visible, roleData]);

    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue: any) => {
        // Tree组件的onCheck回调参数可能是Key[]或{checked: Key[], halfChecked: Key[]}
        if (Array.isArray(checkedKeysValue)) {
            setCheckedKeys(checkedKeysValue);
        } else {
            setCheckedKeys(checkedKeysValue.checked);
        }
    };

    const onSelect = (selectedKeysValue: React.Key[]) => {
        setSelectedKeys(selectedKeysValue);
    };

    // 全选/取消全选
    const toggleSelectAll = () => {
        if (checkedKeys.length === 0) {
            // 全选
            const allKeys: React.Key[] = [];
            const collectKeys = (nodes: any[]) => {
                nodes.forEach(node => {
                    allKeys.push(node.key);
                    if (node.children) {
                        collectKeys(node.children);
                    }
                });
            };
            collectKeys(processedMenuData);
            setCheckedKeys(allKeys);
        } else {
            // 取消全选
            setCheckedKeys([]);
        }
    };

    // 展开/收起所有
    const toggleExpandAll = () => {
        if (expandedKeys.length === 0) {
            // 展开所有
            const allKeys: React.Key[] = [];
            const collectKeys = (nodes: any[]) => {
                nodes.forEach(node => {
                    allKeys.push(node.key);
                    if (node.children) {
                        collectKeys(node.children);
                    }
                });
            };
            collectKeys(processedMenuData);
            setExpandedKeys(allKeys);
        } else {
            // 收起所有
            setExpandedKeys([]);
        }
    };

    const handleSave = () => {
        console.log('保存权限:', checkedKeys);
        // TODO: 调用保存权限接口
        message.success('权限保存成功');
        onOk();
    };

    return (
        <Modal
            title={`菜单权限 - ${roleData?.roleName || ''}`}
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
            width={600}
        >
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Space>
                    <Button onClick={toggleExpandAll}>
                        {expandedKeys.length === 0 ? '全部展开' : '全部收起'}
                    </Button>
                    <Button onClick={toggleSelectAll}>
                        {checkedKeys.length === 0 ? '全部选择' : '取消全选'}
                    </Button>
                </Space>
            </div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <Tree
                    checkable
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                    onExpand={onExpand}
                    onCheck={onCheck}
                    onSelect={onSelect}
                    treeData={processedMenuData}
                />
            </div>
        </Modal>
    );
};

export default RolePage;