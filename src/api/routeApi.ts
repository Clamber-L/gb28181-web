import api from '@/lib/request';
import { DynamicRoute, RouteQueryParams, RouteConfigResponse } from '@/types/route';

/**
 * 路由配置API服务
 */
export const routeApi = {
    /**
     * 获取路由配置
     */
    getRoutes: (params?: RouteQueryParams) => {
        return api.get<RouteConfigResponse>({
            url: '/system/routes',
            params,
        });
    },

    /**
     * 根据用户角色获取可访问的路由
     */
    getUserRoutes: (roles: string[]) => {
        return api.get<RouteConfigResponse>({
            url: '/system/routes/user',
            params: { roles: roles.join(',') },
        });
    },

    /**
     * 获取路由详情
     */
    getRouteById: (id: string) => {
        return api.get<DynamicRoute>({
            url: `/system/routes/${id}`,
        });
    },

    /**
     * 创建路由
     */
    createRoute: (data: Omit<DynamicRoute, 'id' | 'createTime' | 'updateTime'>) => {
        return api.post<DynamicRoute>({
            url: '/system/routes',
            data,
        });
    },

    /**
     * 更新路由
     */
    updateRoute: (id: string, data: Partial<DynamicRoute>) => {
        return api.put<DynamicRoute>({
            url: `/system/routes/${id}`,
            data,
        });
    },

    /**
     * 删除路由
     */
    deleteRoute: (id: string) => {
        return api.delete<void>({
            url: `/system/routes/${id}`,
        });
    },

    /**
     * 批量删除路由
     */
    batchDeleteRoutes: (ids: string[]) => {
        return api.delete<void>({
            url: '/system/routes/batch',
            data: { ids },
        });
    },

    /**
     * 刷新路由缓存
     */
    refreshRouteCache: () => {
        return api.post<void>({
            url: '/system/routes/refresh-cache',
        });
    },
};
