import React, { useEffect } from 'react';
import { Card, Button, Row, Col, Statistic, Progress, Tag } from 'antd';
import {
    DollarOutlined,
    TrophyOutlined,
    RiseOutlined,
    FallOutlined,
    EyeOutlined,
    ShoppingCartOutlined,
    GiftOutlined,
    LineChartOutlined,
} from '@ant-design/icons';

import { useAuth } from '@/stores/authStore';
import { useContextPageAgent } from '@/providers/ThemeProvider';

// 计数动画组件
const CountTo: React.FC<{
    target: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
}> = ({ target, prefix = '', suffix = '', separator = '' }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [target]);

    const formatNumber = (num: number) => {
        return separator ? num.toLocaleString() : num.toString();
    };

    return (
        <span>
            {prefix}
            {formatNumber(count)}
            {suffix}
        </span>
    );
};

// Banner组件
const Banner: React.FC = () => {
    const { userInfo } = useAuth();

    return (
        <Card
            className="h-52 bg-gradient-to-br from-indigo-500 to-purple-600 border-none"
            style={{ height: '100%', padding: '24px' }}
        >
            <div className="flex justify-between items-center h-full text-white">
                <div className="flex-1">
                    <h2 className="text-2xl font-normal text-white mb-6">
                        欢迎回来 {userInfo?.username || '用户'}
                    </h2>
                    <div className="flex items-center">
                        <div className="mr-8">
                            <p className="text-3xl text-white mb-1 flex items-center">
                                <CountTo target={2340} prefix="¥" separator="," />
                                <RiseOutlined className="text-green-400 ml-2" />
                            </p>
                            <p className="text-sm text-white/80 m-0">今日销售额</p>
                        </div>
                        <div className="w-px h-12 bg-white/30 mr-8" />
                        <div>
                            <p className="text-3xl text-white mb-1 flex items-center">
                                <CountTo target={35} suffix="%" />
                                <RiseOutlined className="text-green-400 ml-2" />
                            </p>
                            <p className="text-sm text-white/80 m-0">较昨日</p>
                        </div>
                    </div>
                </div>
                <div className="relative w-30 h-30">
                    <div className="text-6xl animate-bounce opacity-80">📊</div>
                </div>
            </div>
        </Card>
    );
};

// 总订单量组件
const TotalOrderVolume: React.FC = () => {
    return (
        <Card
            className="h-52 border border-gray-200 dark:border-gray-700"
            style={{ height: '100%', padding: '20px' }}
        >
            <div className="text-center mb-5">
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 m-0">
                    205,216
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 m-0">总订单量</p>
            </div>
            <div className="flex justify-center items-center h-32">
                <div className="space-y-2">
                    <div className="flex items-center mb-2">
                        <span className="w-3 h-3 bg-gray-500 rounded-sm mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            已完成 (30%)
                        </span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="w-3 h-3 bg-green-400 rounded-sm mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            处理中 (25%)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-sky-300 rounded-sm mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            待发货 (45%)
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// 商品总数组件
const TotalProducts: React.FC = () => {
    return (
        <Card
            className="h-52 border border-gray-200 dark:border-gray-700"
            style={{ height: '100%', padding: '20px' }}
        >
            <div className="text-center mb-5">
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 m-0">
                    55,231
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 m-0">商品总数</p>
            </div>
            <div className="flex justify-around items-end h-32 px-5">
                {[50, 80, 40, 90, 60, 70].map((height) => (
                    <div
                        key={`bar-${height}-${Math.random()}`}
                        className="w-4 bg-gradient-to-t from-gray-500 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-t hover:from-gray-600 hover:to-gray-500 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-colors"
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        </Card>
    );
};

// 销售趋势组件
const SalesTrend: React.FC = () => {
    return (
        <Card
            title="销售趋势"
            extra={<LineChartOutlined />}
            className="border border-gray-200 dark:border-gray-700"
        >
            <Statistic
                title="本月销售额"
                value={112893}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="元"
            />
            <Progress percent={75} strokeColor="#52c41a" className="mt-4" />
        </Card>
    );
};

// 销售分类组件
const SalesClassification: React.FC = () => {
    return (
        <Card title="销售分类" className="border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
                <div>
                    <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        电子产品
                    </span>
                    <Progress percent={60} size="small" />
                </div>
                <div>
                    <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        服装配饰
                    </span>
                    <Progress percent={45} size="small" strokeColor="#fa8c16" />
                </div>
                <div>
                    <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        家居用品
                    </span>
                    <Progress percent={30} size="small" strokeColor="#722ed1" />
                </div>
            </div>
        </Card>
    );
};

// 热门商品组件
const HotCommodity: React.FC = () => {
    const products = [
        { name: 'iPhone 15 Pro', sales: 1289, trend: 'up' },
        { name: 'MacBook Air M2', sales: 856, trend: 'up' },
        { name: 'AirPods Pro', sales: 742, trend: 'down' },
        { name: 'iPad Air', sales: 623, trend: 'up' },
    ];

    return (
        <Card
            title="热门商品"
            extra={<TrophyOutlined />}
            className="border border-gray-200 dark:border-gray-700"
        >
            <div className="space-y-3">
                {products.map((product, productIndex) => (
                    <div
                        key={product.name}
                        className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3 ${
                                productIndex === 0
                                    ? 'bg-yellow-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {productIndex + 1}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                                {product.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                销量: {product.sales}
                                {product.trend === 'up' ? (
                                    <RiseOutlined className="text-green-500 ml-1" />
                                ) : (
                                    <FallOutlined className="text-red-500 ml-1" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// 近期交易组件
const RecentTransaction: React.FC = () => {
    const transactions = [
        { id: '#12345', amount: 1289, status: '已完成', time: '5分钟前' },
        { id: '#12346', amount: 856, status: '处理中', time: '15分钟前' },
        { id: '#12347', amount: 742, status: '已取消', time: '1小时前' },
        { id: '#12348', amount: 623, status: '已完成', time: '2小时前' },
    ];

    // 获取状态颜色
    const getStatusColor = (status: string) => {
        if (status === '已完成') return 'green';
        if (status === '处理中') return 'blue';
        return 'red';
    };

    return (
        <Card title="近期交易" className="border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                        <div>
                            <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                                {transaction.id}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.time}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                ¥{transaction.amount}
                            </div>
                            <Tag color={getStatusColor(transaction.status)}>
                                {transaction.status}
                            </Tag>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const Dashboard: React.FC = () => {
    const { userInfo } = useAuth();

    const agent = useContextPageAgent();

    useEffect(() => {
        agent?.panel.show();
    }, []);

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 m-0">
                        电商仪表板
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        欢迎回来，{userInfo?.username || '用户'}！
                    </p>
                </div>
            </div>

            {/* 第一行：Banner + 总订单量 + 商品总数 */}
            <Row gutter={20} className="mb-5">
                <Col sm={24} md={24} lg={16}>
                    <Banner />
                </Col>
                <Col sm={12} md={12} lg={4}>
                    <TotalOrderVolume />
                </Col>
                <Col sm={12} md={12} lg={4}>
                    <TotalProducts />
                </Col>
            </Row>

            {/* 第二行：销售趋势 + 销售分类 + 其他统计 */}
            <Row gutter={20} className="mb-5">
                <Col sm={12} md={12} lg={8}>
                    <SalesTrend />
                </Col>
                <Col sm={12} md={12} lg={8}>
                    <SalesClassification />
                </Col>
                <Col sm={24} md={24} lg={8}>
                    <Row gutter={20}>
                        <Col sm={24} md={12} lg={12}>
                            <Card>
                                <Statistic
                                    title="商品销量"
                                    value={8923}
                                    prefix={<ShoppingCartOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col sm={24} md={12} lg={12}>
                            <Card>
                                <Statistic
                                    title="销售增长"
                                    value={32.5}
                                    precision={1}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<RiseOutlined />}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                        <Col span={24} className="mt-5">
                            <Card>
                                <Statistic
                                    title="购物车转化率"
                                    value={68.5}
                                    precision={1}
                                    valueStyle={{ color: '#fa8c16' }}
                                    prefix={<ShoppingCartOutlined />}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* 第三行：热门商品 + 年度销售 + 交易列表 */}
            <Row gutter={20} className="mb-5">
                <Col sm={24} md={12} lg={8}>
                    <HotCommodity />
                </Col>
                <Col sm={24} md={12} lg={8}>
                    <Card title="年度销售" extra={<GiftOutlined />}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    2024年销售额
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    ¥1,234,567
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    年度增长率
                                </span>
                                <span className="font-semibold text-green-500">+15.3%</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    预计年底
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    ¥1,500,000
                                </span>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col sm={24} md={24} lg={8}>
                    <RecentTransaction />
                </Col>
            </Row>

            {/* 第四行：近期交易详情 + 热门产品列表 */}
            <Row gutter={20} className="mb-5">
                <Col md={24} lg={8}>
                    <Card title="系统监控" extra={<EyeOutlined />}>
                        <div className="space-y-4">
                            <div>
                                <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    CPU使用率
                                </span>
                                <Progress percent={45} size="small" />
                            </div>
                            <div>
                                <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    内存使用率
                                </span>
                                <Progress percent={67} size="small" strokeColor="#fa8c16" />
                            </div>
                            <div>
                                <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    磁盘使用率
                                </span>
                                <Progress percent={23} size="small" strokeColor="#52c41a" />
                            </div>
                            <div>
                                <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    网络流量
                                </span>
                                <Progress percent={89} size="small" strokeColor="#722ed1" />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={16}>
                    <Card title="最新动态" extra={<Button type="link">查看全部</Button>}>
                        <div className="space-y-3">
                            <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div className="text-base mr-3 mt-0.5">🎉</div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
                                        新用户注册达到1000+
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        2分钟前
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div className="text-base mr-3 mt-0.5">📦</div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
                                        订单 #12345 已发货
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        10分钟前
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div className="text-base mr-3 mt-0.5">💰</div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
                                        今日销售额突破10万
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        1小时前
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start py-3">
                                <div className="text-base mr-3 mt-0.5">⚠️</div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
                                        库存预警：iPhone 15 Pro库存不足
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        2小时前
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
