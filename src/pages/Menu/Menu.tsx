import React, { useEffect, useState } from 'react';
import { Button, Card, message, Modal, Table, Tag } from 'antd';
import { CompressOutlined, ExpandOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { Permission } from '@/types/user';
import { PermissionType } from '@/types/enum';
import { mockRouteTree } from '@/mock/routeData';

import MenuDialog from '@/pages/Menu/components/MenuDialog';

// 模拟API请求
const fetchMenuList = async (): Promise<Permission[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockRouteTree);
        }, 500);
    });
};

const MenuPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [tableData, setTableData] = useState<Permission[]>([]);
    const [filteredTableData, setFilteredTableData] = useState<Permission[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogType, setDialogType] = useState<'menu' | 'button' | 'catalogue'>('menu');
    const [editData, setEditData] = useState<Permission | null>(null);
    const [lockMenuType, setLockMenuType] = useState(false);
    const [isFromCatalogue, setIsFromCatalogue] = useState(false);
    const [formFilters, setFormFilters] = useState({ name: '', route: '' });
    const [appliedFilters, setAppliedFilters] = useState({ name: '', route: '' });
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    // 表格列配置
    const columns: ColumnsType<Permission> = [
        {
            title: '菜单名称',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: '菜单类型',
            key: 'type',
            render: (_, record) => {
                let color = 'blue';
                let text = '菜单';

                if (record.resourceType === PermissionType.BUTTON) {
                    color = 'red';
                    text = '按钮';
                } else if (record.resourceType === PermissionType.CATALOGUE) {
                    color = 'cyan';
                    text = '目录';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: '路由',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '权限标识',
            key: 'authList',
            render: (_, record) => {
                // 这里可以根据实际需求显示权限标识
                return record.component || '';
            },
        },
        {
            title: '编辑时间',
            key: 'date',
            render: () => '2022-3-12 12:00:00',
        },
        {
            title: '状态',
            key: 'status',
            render: () => <Tag color="success">启用</Tag>,
        },
        {
            title: '操作',
            key: 'operation',
            width: 180,
            render: (_, record) => (
                <div style={{ textAlign: 'right' }}>
                    {record.resourceType === PermissionType.CATALOGUE && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                handleAddMenu(true);
                            }}
                        >
                            新增
                        </Button>
                    )}
                    <Button type="link" size="small" onClick={() => handleEditMenu(record)}>
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => handleDeleteMenu(record)}
                    >
                        删除
                    </Button>
                </div>
            ),
        },
    ];

    // 过滤数据
    useEffect(() => {
        // 简单的过滤逻辑，实际项目中可能需要更复杂的处理
        const filtered = tableData.filter((item) => {
            const nameMatch =
                !appliedFilters.name || (item.label && item.label.includes(appliedFilters.name));
            const routeMatch =
                !appliedFilters.route || (item.path && item.path.includes(appliedFilters.route));
            return nameMatch && routeMatch;
        });
        setFilteredTableData(filtered);

        // 当数据过滤变化时，如果当前是展开状态，则更新展开的行
        if (isExpanded) {
            setExpandedRowKeys(getAllRowKeys(filtered));
        }
    }, [tableData, appliedFilters, isExpanded]);

    // 组件挂载时获取数据
    useEffect(() => {
        getTableData().then();
    }, []);

    // 获取表格数据
    const getTableData = async () => {
        setLoading(true);
        try {
            const data = await fetchMenuList();
            setTableData(data);
        } catch (error) {
            message.error('获取菜单数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 搜索处理
    const handleSearch = () => {
        setAppliedFilters({ ...formFilters });
    };

    // 重置处理
    const handleReset = () => {
        setFormFilters({ name: '', route: '' });
        setAppliedFilters({ name: '', route: '' });
    };

    // 刷新处理
    const handleRefresh = async () => {
        await getTableData();
    };

    // 展开/收起处理
    const toggleExpand = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);

        if (newExpandedState) {
            // 展开所有行
            setExpandedRowKeys(getAllRowKeys(filteredTableData));
        } else {
            // 收起所有行
            setExpandedRowKeys([]);
        }
    };

    // 获取所有行的keys，用于展开/收起功能
    const getAllRowKeys = (data: Permission[]): string[] => {
        const keys: string[] = [];

        const traverse = (items: Permission[]) => {
            items.forEach((item) => {
                // 只有有子节点的项才需要被展开
                if (item.children && item.children.length > 0) {
                    keys.push(item.id);
                    traverse(item.children);
                }
            });
        };

        traverse(data);
        return keys;
    };

    // 添加菜单
    const handleAddMenu = (fromCatalogue = false) => {
        // 添加菜单只可以添加目录类型
        setDialogType('menu');
        setEditData(null);
        setLockMenuType(false);
        setDialogVisible(true);
        // 保存是否从目录添加的状态，用于传递给对话框组件
        setIsFromCatalogue(fromCatalogue);
    };

    // 编辑菜单
    const handleEditMenu = (record: Permission) => {
        // 所有的编辑都不可以修改菜单类型
        setDialogType('menu');
        setEditData(record);
        setLockMenuType(true);
        setDialogVisible(true);
    };

    // 删除菜单
    const handleDeleteMenu = (record: Permission) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除该菜单吗？删除后无法恢复',
            onOk: async () => {
                try {
                    message.success('删除成功');
                    await getTableData();
                } catch (error) {
                    message.error('删除失败');
                }
            },
        });
    };

    // 提交处理
    const handleSubmit = async (formData: any) => {
        console.log('提交数据:', formData);
        // 这里可以调用API保存数据
        await getTableData();
        setDialogVisible(false);
    };

    return (
        <div className="menu-page" style={{ padding: '16px', height: '100%' }}>
            {/* 搜索栏 */}
            <Card className="mb-4">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div>
                        <label htmlFor="menuName" className="mr-2">
                            菜单名称:
                        </label>
                        <input
                            id="menuName"
                            value={formFilters.name}
                            onChange={(e) =>
                                setFormFilters({ ...formFilters, name: e.target.value })
                            }
                            placeholder="请输入菜单名称"
                            style={{
                                width: 180,
                                height: '30px',
                                padding: '4px 11px',
                                border: '1px solid #d9d9d9',
                                borderRadius: 6,
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="menuRoute" className="mr-2">
                            路由地址:
                        </label>
                        <input
                            id="menuRoute"
                            value={formFilters.route}
                            onChange={(e) =>
                                setFormFilters({ ...formFilters, route: e.target.value })
                            }
                            placeholder="请输入路由地址"
                            style={{
                                width: 180,
                                height: '30px',
                                padding: '4px 11px',
                                border: '1px solid #d9d9d9',
                                borderRadius: 6,
                            }}
                        />
                    </div>
                    <Button type="primary" onClick={handleSearch}>
                        搜索
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                </div>
            </Card>

            <Card>
                {/* 表格头部 */}
                <div className="flex mb-4 justify-between">
                    <div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddMenu(false)}
                        >
                            添加目录
                        </Button>
                        <Button
                            icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                            onClick={toggleExpand}
                            style={{ marginLeft: 8 }}
                        >
                            {isExpanded ? '收起' : '展开'}
                        </Button>
                    </div>
                    <Button onClick={handleRefresh}>刷新</Button>
                </div>

                {/* 表格 */}
                <Table
                    columns={columns}
                    dataSource={filteredTableData}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                setExpandedRowKeys((prev) => [...prev, record.id]);
                            } else {
                                setExpandedRowKeys((prev) =>
                                    prev.filter((key) => key !== record.id),
                                );
                            }
                        },
                    }}
                />

                {/* 菜单弹窗 */}
                <MenuDialog
                    visible={dialogVisible}
                    onCancel={() => setDialogVisible(false)}
                    onSubmit={handleSubmit}
                    editData={editData}
                    type={dialogType}
                    lockType={lockMenuType}
                    isFromCatalogue={isFromCatalogue}
                />
            </Card>
        </div>
    );
};

export default MenuPage;
