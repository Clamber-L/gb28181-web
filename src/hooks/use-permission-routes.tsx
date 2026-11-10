import React, { lazy, Suspense, useMemo } from 'react';

import { Navigate, Outlet, useMatches } from 'react-router-dom';

import { flattenTrees } from '@/utils/tree';
import { Permission } from '@/types/user';
import { AppRouteObject } from '@/types/router';
import { PermissionType } from '@/types/enum';
import CircleLoading from '@/components/loading/CircleLoading';
import { mockRouteTree } from '@/mock/routeData';
import { useAuth } from '@/stores/authStore';

const pages = import.meta.glob('/src/pages/**/*.tsx');

// 构建绝对路径的函数
function resolveComponent(path: string) {
    // 根据实际的文件结构构造正确的路径
    const fullPath = `/src/pages/${path}/${path}.tsx`;
    return pages[fullPath];
}

export const usePermissionRoutes = () => {
    let {
        userInfo: { permissions },
    } = useAuth();

    // 测试数据
    permissions = mockRouteTree;

    return useMemo(() => {
        const flattenedPermissions = flattenTrees(permissions);
        const permissionRoutes = transformPermissionToMenuRoutes(
            permissions || [],
            flattenedPermissions,
        );
        return [...permissionRoutes];
    }, [permissions]);
};

// 根据当前路径获取面包屑信息
export const useBreadcrumbItems = () => {
    const matches = useMatches();
    const permissionRoutes = usePermissionRoutes();

    return useMemo(() => {
        // 根据匹配的路由生成面包屑

        return matches
            .filter((match) => match.pathname !== '/') // 过滤掉根路径
            .map((match) => {
                // 在权限路由中查找匹配的路由项
                const findRoute = (routes: AppRouteObject[]): AppRouteObject | undefined => {
                    for (const route of routes) {
                        // 精确匹配路径
                        if (route.path === match.pathname && route.meta?.label) {
                            return route;
                        }

                        // 如果有子路由，递归查找
                        if (route.children) {
                            const found = findRoute(route.children);
                            if (found) return found;
                        }
                    }
                    return undefined;
                };

                const route = findRoute(permissionRoutes);
                if (route && route.meta && route.meta.label) {
                    // 只有二级以下的页面才添加到面包屑中（排除顶级父级页面）
                    const pathSegments = (route.path || match.pathname)
                        .split('/')
                        .filter((segment) => segment.length > 0);
                    if (pathSegments.length > 1) {
                        return {
                            key: route.path || match.pathname,
                            title: route.meta.label || '',
                            path: route.path || match.pathname,
                            icon: route.meta.icon as string,
                        };
                    }
                }

                return null;
            })
            .filter(Boolean) as { key: string; title: string; path: string; icon?: string }[];
    }, [matches, permissionRoutes]);
};

const transformPermissionToMenuRoutes = (
    permissions: Permission[],
    flattenedPermissions: Permission[],
) => {
    return permissions.map((permission) => {
        const fullPath = getCompleteRoute(permission, flattenedPermissions); // 拼好完整路径

        const {
            resourceType,
            label,
            icon,
            sortValue,
            hide,
            frameSrc,
            component,
            parentId,
            disabled,
            children = [],
        } = permission;

        const appRoute: AppRouteObject = {
            path: fullPath, // 用完整路径注册！
            meta: {
                label,
                key: fullPath, // 保持一致
                hideMenu: !!hide,
                disabled,
            },
        };

        if (sortValue) appRoute.sortValue = sortValue;
        if (icon) appRoute.meta!.icon = icon;
        if (frameSrc) appRoute.meta!.frameSrc = frameSrc;

        if (resourceType === PermissionType.CATALOGUE) {
            appRoute.meta!.hideTab = true;
            if (!parentId) {
                appRoute.element = (
                    <Suspense fallback={<CircleLoading />}>
                        <Outlet />
                    </Suspense>
                );
            }

            appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions);

            if (children && children.length > 0 && children[0].path) {
                // 用完整路径重定向，否则 Navigate 会拼错
                appRoute.children.unshift({
                    index: true,
                    element: (
                        <Navigate
                            to={getCompleteRoute(children[0], flattenedPermissions)}
                            replace
                        />
                    ),
                });
            }
        } else if (resourceType === PermissionType.MENU) {
            if (component) {
                const componentResolver = resolveComponent(component);
                if (componentResolver && typeof componentResolver === 'function') {
                    const Element = lazy(
                        componentResolver as () => Promise<{ default: React.ComponentType<any> }>,
                    );
                    appRoute.element = frameSrc ? <Element src={frameSrc} /> : <Element />;
                } else {
                    appRoute.element = (
                        <div>Error: Component not found or invalid - {component}</div>
                    );
                }
            } else {
                appRoute.element = <div>Error: No component specified</div>;
            }
        }

        return appRoute;
    });
};

const getCompleteRoute = (permission: Permission, flattenedPermissions: Permission[]): string => {
    if (permission.parentId) {
        const parentPermission = flattenedPermissions.find((p) => p.id === permission.parentId);
        if (parentPermission) {
            const parentPath = getCompleteRoute(parentPermission, flattenedPermissions);
            return `${parentPath.replace(/\/$/, '')}/${permission.path.replace(/^\//, '')}`;
        }
    }
    return permission.path.startsWith('/') ? permission.path : `/${permission.path}`;
};
