import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';

import { useNavigate, useLocation, useMatches } from 'react-router-dom';

import { ItemType } from 'antd/lib/menu/interface';

import { usePermissionRoutes } from '@/hooks/use-permission-routes';
import { buildMenuItems, menuFilter } from '@/utils/tree';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const matches = useMatches();
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['']);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const permissionRoutes = usePermissionRoutes();
    const [menuList, setMenuList] = useState<ItemType[] | undefined>([]);

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        navigate(key);
    };

    //
    // const menuItems = buildMenuItems(routes);
    // console.log('Menu items:', menuItems);
    //
    // // 获取默认展开的菜单项
    // const getDefaultOpenKeys = () => {
    //     const { pathname } = location;
    //     const openKeysArray: string[] = [];
    //
    //     // 递归查找当前路径匹配的所有父级菜单
    //     const findParentKeys = (items: AppRouteObject[]) => {
    //         for (const item of items) {
    //             // 如果当前项有子菜单
    //             if (item.children && item.children.length > 0 && item.id) {
    //                 // 检查当前项的任何子项是否应该被选中
    //                 const isChildActive = item.children.some(child => {
    //                     if (child.path) {
    //                         // 精确匹配
    //                         if (child.path === pathname) {
    //                             return true;
    //                         }
    //                         // 前缀匹配（确保是完整路径段）
    //                         if (pathname.startsWith(child.path)) {
    //                             const nextChar = pathname.charAt(child.path.length);
    //                             return nextChar === '' || nextChar === '/';
    //                         }
    //                     }
    //                     return false;
    //                 });
    //
    //                 // 如果子项是激活的，则展开当前项
    //                 if (isChildActive) {
    //                     openKeysArray.push(item.id);
    //                 }
    //
    //                 // 递归检查子项
    //                 findParentKeys(item.children);
    //             }
    //         }
    //     };
    //
    //     findParentKeys(routes);
    //     return openKeysArray;
    // };

    // 初始化展开的菜单项
    useEffect(() => {
        const openKey = matches
            .filter((match) => match.pathname !== '/')
            .map((match) => match.pathname);
        setOpenKeys(openKey);
        setSelectedKeys([location.pathname]);
    }, [location.pathname, collapsed, matches]);

    useEffect(() => {
        const menuRoutes = menuFilter(permissionRoutes);
        const menus = buildMenuItems(menuRoutes);
        setMenuList(menus);
    }, [permissionRoutes]);

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={256}
            className="bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 shadow-sm"
            theme="light"
        >
            {/* Logo区域 */}
            <div className="h-16 flex items-center justify-center border-b border-gray-300 dark:border-gray-800">
                {!collapsed && (
                    <div className="flex items-center">
                        <div className="text-2xl mr-2">🎨</div>
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Art Design
                        </span>
                    </div>
                )}
                {collapsed && <div className="text-2xl">🎨</div>}
            </div>

            {/* 菜单区域 */}
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                defaultSelectedKeys={['/dashboard/dashboard-console']}
                onClick={handleMenuClick}
                className="border-none bg-transparent"
                theme="light"
                items={menuList}
            />
        </Sider>
    );
};

export default Sidebar;
