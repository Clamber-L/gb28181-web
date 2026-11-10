import React, { useEffect } from 'react';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HomeOutlined,
    CloseOutlined,
    MoreOutlined,
    ClearOutlined,
    ReloadOutlined,
} from '@ant-design/icons';

import { useBreadcrumb } from '@/stores/breadcrumbStore';
import { useBreadcrumbItems } from '@/hooks';
import { HOMEPAGE } from '@/router';

/**
 * 历史记录面包屑组件
 * 保存用户访问历史，支持点击跳转和关闭功能
 */
const Breadcrumb: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const breadcrumbItems = useBreadcrumbItems();

    const {
        breadcrumbHistory,
        activeKey,
        addBreadcrumb,
        removeBreadcrumb,
        setActiveBreadcrumb,
        clearAllBreadcrumbs,
        removeOtherBreadcrumbs,
    } = useBreadcrumb();

    // 监听路由变化，添加到面包屑历史记录
    useEffect(() => {
        // 当路由变化时，生成当前路径对应的面包屑项
        const currentBreadcrumbItems = breadcrumbItems.filter((item: any) => {
            // 只处理当前路径的项
            return item.path === location.pathname;
        });

        // 添加当前页面到面包屑历史记录
        if (currentBreadcrumbItems.length > 0) {
            const currentItem = currentBreadcrumbItems[0];
            addBreadcrumb(currentItem);
        }
    }, [location.pathname, breadcrumbItems, addBreadcrumb]);

    // 监听面包屑导航事件
    useEffect(() => {
        const handleBreadcrumbNavigate = (event: CustomEvent) => {
            const { path } = event.detail;
            navigate(path);
        };

        // 添加事件监听器
        window.addEventListener('breadcrumb-navigate', handleBreadcrumbNavigate as EventListener);

        return () => {
            // 清理事件监听器
            window.removeEventListener(
                'breadcrumb-navigate',
                handleBreadcrumbNavigate as EventListener,
            );
        };
    }, [navigate]);

    // 处理面包屑点击
    const handleBreadcrumbClick = (path: string) => {
        setActiveBreadcrumb(path);
        navigate(path);
    };

    // 处理面包屑关闭
    const handleBreadcrumbClose = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        removeBreadcrumb(key);
    };

    // 右键菜单配置
    const getContextMenu = (itemKey: string): MenuProps => ({
        items: [
            {
                key: 'refresh',
                label: '刷新页面',
                icon: <ReloadOutlined />,
                onClick: () => {
                    window.location.reload();
                },
            },
            {
                key: 'close-others',
                label: '关闭其他',
                icon: <ClearOutlined />,
                onClick: () => removeOtherBreadcrumbs(itemKey),
                disabled: itemKey === HOMEPAGE,
            },
            {
                key: 'close-all',
                label: '关闭所有',
                icon: <ClearOutlined />,
                onClick: () => {
                    clearAllBreadcrumbs();
                },
            },
        ],
    });

    // 渲染面包屑项
    const renderBreadcrumbItem = (item: any) => {
        const isActive = activeKey === item.key;
        const isHome = item.key === HOMEPAGE;

        return (
            <div
                key={item.key}
                className={`
                    inline-flex items-center px-3 py-1.5 mx-1 rounded-md cursor-pointer
                    transition-all duration-200 border
                    ${
                        isActive
                            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                `}
                onClick={() => handleBreadcrumbClick(item.path)}
            >
                {isHome && <HomeOutlined className="mr-1.5 text-sm" />}

                <span className="text-sm font-medium select-none">{item.title}</span>

                {item.closable && (
                    <CloseOutlined
                        className="ml-2 text-xs opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
                        onClick={(e) => handleBreadcrumbClose(e, item.key)}
                    />
                )}
            </div>
        );
    };

    // 如果历史记录太多，显示更多菜单
    const visibleItems = breadcrumbHistory.slice(0, 8);
    const hiddenItems = breadcrumbHistory.slice(8);

    const moreMenuItems: MenuProps['items'] = hiddenItems.map((item) => ({
        key: item.key,
        label: (
            <div className="flex items-center justify-between w-full">
                <span>{item.title}</span>
                {item.closable && (
                    <CloseOutlined
                        className="ml-2 text-xs opacity-60 hover:opacity-100 hover:text-red-500"
                        onClick={(e) => handleBreadcrumbClose(e, item.key)}
                    />
                )}
            </div>
        ),
        onClick: () => handleBreadcrumbClick(item.path),
    }));

    return (
        <div className="bg-white dark:bg-black px-4 py-2 border-b border-gray-300 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="flex items-center space-x-1">
                {/* 显示的面包屑项 */}
                {visibleItems.map((item) => (
                    <Dropdown
                        key={item.key}
                        menu={getContextMenu(item.key)}
                        trigger={['contextMenu']}
                    >
                        {renderBreadcrumbItem(item)}
                    </Dropdown>
                ))}

                {/* 更多菜单 */}
                {hiddenItems.length > 0 && (
                    <Dropdown menu={{ items: moreMenuItems }} placement="bottomLeft">
                        <Button
                            type="text"
                            size="small"
                            icon={<MoreOutlined />}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        />
                    </Dropdown>
                )}

                {/* 清除所有按钮 */}
                {breadcrumbHistory.length > 1 && (
                    <Button
                        type="text"
                        size="small"
                        icon={<ClearOutlined />}
                        className="ml-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        onClick={() => {
                            clearAllBreadcrumbs();
                        }}
                        title="清除所有历史记录"
                    />
                )}
            </div>
        </div>
    );
};

export default Breadcrumb;
