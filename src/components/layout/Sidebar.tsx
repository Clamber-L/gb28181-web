import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoCameraOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const menuItems: MenuProps['items'] = [
    {
        key: '/camera',
        icon: <VideoCameraOutlined />,
        label: '摄像头管理',
    },
    {
        key: '/system',
        icon: <SettingOutlined />,
        label: '系统设置',
    },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        setSelectedKeys([key]);
        navigate(key);
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={220}
            className="bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 shadow-sm"
            theme="light"
        >
            {/* Logo区域 */}
            <div className="h-16 flex items-center justify-center border-b border-gray-300 dark:border-gray-800">
                {!collapsed && (
                    <div className="flex items-center">
                        <VideoCameraOutlined className="text-xl mr-2 text-blue-500" />
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            视频管理平台
                        </span>
                    </div>
                )}
                {collapsed && <VideoCameraOutlined className="text-xl text-blue-500" />}
            </div>

            {/* 菜单区域 */}
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                onClick={handleMenuClick}
                className="border-none bg-transparent"
                theme="light"
                items={menuItems}
            />
        </Sider>
    );
};

export default Sidebar;
