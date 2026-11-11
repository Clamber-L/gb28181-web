import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import CircleLoading from '@/components/loading/CircleLoading';

const { Content } = Layout;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
                <AppHeader collapsed={collapsed} onCollapse={setCollapsed} />
                <Content className="bg-gray-100 dark:bg-gray-900 transition-colors">
                    <div className="p-6">
                        <Suspense fallback={<CircleLoading />}>
                            <Outlet />
                        </Suspense>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
