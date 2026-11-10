import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const Analysis: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    数据分析
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    这里展示系统的各种数据分析和统计信息
                </p>
            </div>

            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="活跃用户"
                            value={11893}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="人"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总销售额"
                            value={125680}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="订单数量"
                            value={2589}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="转化率"
                            value={68.5}
                            precision={1}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={16}>
                    <Card title="访问趋势" className="h-96">
                        <div className="flex items-center justify-center h-full text-gray-500">
                            这里可以放置图表组件（如 ECharts、AntV 等）
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="销售排行" className="h-96">
                        <div className="space-y-4">
                            {[
                                { name: '产品A', value: 123 },
                                { name: '产品B', value: 98 },
                                { name: '产品C', value: 76 },
                                { name: '产品D', value: 54 },
                                { name: '产品E', value: 32 },
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {item.name}
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analysis;