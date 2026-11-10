import { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Radio, Row, Col } from 'antd';

import type { Permission } from '@/types/user';
import { PermissionType } from '@/types/enum';

interface MenuFormData {
    id: string;
    name: string;
    path: string;
    label: string;
    component: string;
    icon: string;
    sortValue: number;
    resourceType: PermissionType;
    frameSrc: string;
    hide: boolean;
    disabled: boolean;
}

interface MenuDialogProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: MenuFormData) => void;
    editData?: Permission | null;
    type?: 'menu' | 'button' | 'catalogue';
    lockType?: boolean;
    // 新增属性：是否是从目录添加的
    isFromCatalogue?: boolean;
}

const MenuDialog: FC<MenuDialogProps> = ({
    visible,
    onCancel,
    onSubmit,
    editData,
    type = 'menu',
    lockType = false,
    isFromCatalogue = false,
}) => {
    const [form] = Form.useForm();
    const [menuType, setMenuType] = useState<'menu' | 'button' | 'catalogue'>(type || 'menu');
    const isEdit = !!editData;

    // 重置表单
    const resetForm = () => {
        form.resetFields();
    };

    // 加载表单数据
    const loadFormData = () => {
        if (editData) {
            form.setFieldsValue({
                id: editData.id,
                name: editData.name,
                path: editData.path,
                label: editData.label,
                component: editData.component,
                icon: editData.icon,
                sortValue: editData.sortValue,
                resourceType: editData.resourceType,
                frameSrc: editData.frameSrc,
                hide: editData.hide,
                disabled: editData.disabled,
            });

            // 设置菜单类型
            if (editData.resourceType === PermissionType.MENU) {
                setMenuType('menu');
            } else if (editData.resourceType === PermissionType.CATALOGUE) {
                setMenuType('catalogue'); // 'catalogue' 对应目录
            }
        }
    };

    // 处理提交
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit({
                ...values,
                id: editData?.id || Date.now().toString(),
                resourceType: menuType === 'menu' ? PermissionType.MENU : PermissionType.CATALOGUE,
            });
            resetForm();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    // 监听弹窗状态变化
    useEffect(() => {
        if (visible) {
            // 如果不是从目录添加且不是编辑，则默认设置为目录类型
            if (!isFromCatalogue && !isEdit) {
                setMenuType('catalogue'); // 'catalogue' 对应目录
            } else {
                setMenuType(type || 'menu');
            }
            loadFormData();
        } else {
            resetForm();
        }
    }, [visible, editData, type, isFromCatalogue]);

    // 根据不同情况设置对话框标题
    const getDialogTitle = () => {
        if (isEdit) {
            return `编辑${menuType === 'menu' ? '菜单' : '目录'}`;
        }
        if (!isFromCatalogue) {
            return '新建目录'; // 顶级添加只能添加目录
        }
        return `新建${menuType === 'menu' ? '菜单' : '目录'}`;
    };

    const dialogTitle = getDialogTitle();

    return (
        <Modal
            title={dialogTitle}
            open={visible}
            onCancel={() => {
                onCancel();
                resetForm();
            }}
            onOk={handleSubmit}
            width={800}
            afterClose={resetForm}
            className="px-6 py-8"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    sortValue: 1,
                    resourceType: PermissionType.MENU, // 默认为菜单类型
                    hide: false,
                    disabled: false,
                }}
                style={{ maxWidth: '100%' }}
            >
                {/* 只有从目录添加时才显示类型选择，且编辑时不允许修改类型 */}
                {isFromCatalogue && !isEdit && (
                    <Form.Item label="类型" name="resourceType">
                        <Radio.Group
                            value={menuType}
                            onChange={(e) => setMenuType(e.target.value)}
                            style={{ marginBottom: '16px' }}
                        >
                            <Radio.Button
                                value="menu"
                                style={{ height: '36px', lineHeight: '36px', padding: '0 16px' }}
                            >
                                菜单
                            </Radio.Button>
                            <Radio.Button
                                value="catalogue"
                                style={{ height: '36px', lineHeight: '36px', padding: '0 16px' }}
                            >
                                目录
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                )}

                {/* 编辑时显示类型但不允许修改 */}
                {isEdit && (
                    <Form.Item label="类型" name="resourceType">
                        <Radio.Group value={menuType} disabled style={{ marginBottom: '16px' }}>
                            <Radio.Button
                                value="menu"
                                style={{ height: '36px', lineHeight: '36px', padding: '0 16px' }}
                            >
                                菜单
                            </Radio.Button>
                            <Radio.Button
                                value="catalogue"
                                style={{ height: '36px', lineHeight: '36px', padding: '0 16px' }}
                            >
                                目录
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                )}

                {/* 表单内容 - 对所有类型都显示完整表单 */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={menuType === 'menu' ? '菜单名称' : '目录名称'}
                            name="label"
                            rules={[
                                {
                                    required: true,
                                    message: `请输入${menuType === 'menu' ? '菜单' : '目录'}名称`,
                                },
                            ]}
                        >
                            <Input
                                placeholder={`请输入${menuType === 'menu' ? '菜单' : '目录'}名称`}
                                style={{ height: '40px', borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="路由地址"
                            name="path"
                            rules={[{ required: true, message: '请输入路由地址' }]}
                        >
                            <Input
                                placeholder="请输入路由地址"
                                style={{ height: '40px', borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="权限标识"
                            name="name"
                            rules={[{ required: true, message: '请输入权限标识' }]}
                        >
                            <Input
                                placeholder="请输入权限标识"
                                style={{ height: '40px', borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="组件路径" name="component">
                            <Input
                                placeholder="请输入组件路径"
                                style={{ height: '40px', borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item label="图标" name="icon">
                            <Input placeholder="图标" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="排序" name="sortValue">
                            <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item label="外部链接" name="frameSrc">
                            <Input placeholder="外部链接/内嵌地址(https://www.baidu.com)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={6}>
                        <Form.Item label="是否隐藏" name="hide" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="是否禁用" name="disabled" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default MenuDialog;
