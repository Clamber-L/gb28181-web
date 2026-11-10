import React from 'react';
import { Card, Row, Col, Button, Space, Tag } from 'antd';
import {
    AppstoreOutlined,
    FormOutlined,
    TableOutlined,
    MessageOutlined,
    MenuOutlined,
    LoadingOutlined,
} from '@ant-design/icons';

const ComponentsBasic: React.FC = () => {
    const componentCategories = [
        {
            title: '通用',
            icon: <AppstoreOutlined />,
            color: 'blue',
            components: ['Button', 'Icon', 'Typography'],
        },
        {
            title: '布局',
            icon: <MenuOutlined />,
            color: 'green',
            components: ['Grid', 'Layout', 'Space', 'Divider'],
        },
        {
            title: '导航',
            icon: <FormOutlined />,
            color: 'orange',
            components: ['Menu', 'Breadcrumb', 'Pagination', 'Steps'],
        },
        {
            title: '数据录入',
            icon: <FormOutlined />,
            color: 'purple',
            components: ['Input', 'Select', 'Checkbox', 'Radio', 'Switch'],
        },
        {
            title: '数据展示',
            icon: <TableOutlined />,
            color: 'cyan',
            components: ['Table', 'List', 'Card', 'Avatar', 'Badge'],
        },
        {
            title: '反馈',
            icon: <MessageOutlined />,
            color: 'red',
            components: ['Alert', 'Message', 'Notification', 'Modal'],
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    基础组件
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Ant Design 提供了丰富的基础组件，涵盖了前端开发的各个方面
                </p>
            </div>

            <Row gutter={[16, 16]}>
                {componentCategories.map((category, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={category.title}>
                        <Card
                            hoverable
                            className="h-full border border-gray-200 dark:border-gray-700"
                            cover={
                                <div className="flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-800">
                                    <div className={`text-3xl text-${category.color}-500`}>
                                        {category.icon}
                                    </div>
                                </div>
                            }
                        >
                            <Card.Meta
                                title={category.title}
                                description={
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1">
                                            {category.components.map((comp, idx) => (
                                                <Tag
                                                    key={comp}
                                                    color={category.color}
                                                    className="text-xs"
                                                >
                                                    {comp}
                                                </Tag>
                                            ))}
                                        </div>
                                        <Button type="link" size="small" className="p-0 h-auto">
                                            查看详情 →
                                        </Button>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card title="组件演示" className="border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">按钮组件</h3>
                        <Space wrap>
                            <Button type="primary">Primary Button</Button>
                            <Button>Default Button</Button>
                            <Button type="dashed">Dashed Button</Button>
                            <Button type="text">Text Button</Button>
                            <Button type="link">Link Button</Button>
                            <Button type="primary" danger>
                                Danger Button
                            </Button>
                            <Button type="primary" loading icon={<LoadingOutlined />}>
                                Loading
                            </Button>
                        </Space>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">标签组件</h3>
                        <Space wrap>
                            <Tag>Tag 1</Tag>
                            <Tag color="blue">Blue</Tag>
                            <Tag color="green">Green</Tag>
                            <Tag color="orange">Orange</Tag>
                            <Tag color="red">Red</Tag>
                            <Tag color="purple">Purple</Tag>
                            <Tag color="cyan">Cyan</Tag>
                        </Space>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">图标组件</h3>
                        <Space wrap>
                            <AppstoreOutlined className="text-2xl" />
                            <FormOutlined className="text-2xl" />
                            <TableOutlined className="text-2xl" />
                            <MessageOutlined className="text-2xl" />
                            <MenuOutlined className="text-2xl" />
                            <LoadingOutlined className="text-2xl" />
                        </Space>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ComponentsBasic;
