import React from 'react';
import { Layout, Button, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BulbOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/stores/authStore';
import { useTheme } from '@/providers/ThemeProvider';

const { Header } = Layout;

interface AppHeaderProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const { userInfo, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Header className="flex justify-between items-center px-4 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-800 shadow-sm">
            <div className="flex items-center">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => onCollapse(!collapsed)}
                    className="text-lg"
                />
                <div className="ml-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                    Art Design Pro
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="text"
                    icon={<BulbOutlined />}
                    onClick={toggleTheme}
                    className="flex items-center"
                    title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
                />
                <div className="flex items-center gap-2">
                    <Avatar src={userInfo?.avatar} icon={<UserOutlined />} size="small" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:inline">
                        {userInfo?.username || '用户'}
                    </span>
                </div>
                <Button
                    type="text"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    title="退出登录"
                    size="small"
                />
            </div>
        </Header>
    );
};

export default AppHeader;
