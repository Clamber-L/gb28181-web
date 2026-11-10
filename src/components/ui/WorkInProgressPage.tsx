import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/config';

const { Title, Paragraph } = Typography;

const WorkInProgressPage: React.FC<{ title?: string; description?: string }> = ({
    title = '功能开发中',
    description = '此功能正在开发中，敬请期待...',
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-96">
            <Card className="text-center max-w-md">
                <div className="text-6xl mb-4">🚧</div>
                <Title level={3}>{title}</Title>
                <Paragraph className="text-gray-600 dark:text-gray-400">{description}</Paragraph>
                <Space>
                    <Button onClick={() => navigate(-1)}>返回上页</Button>
                    <Button type="primary" onClick={() => navigate(ROUTES.DASHBOARD_CONSOLE)}>
                        回到首页
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default WorkInProgressPage;
