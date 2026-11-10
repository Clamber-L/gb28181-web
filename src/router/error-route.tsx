import { Outlet } from 'react-router-dom';

import { Suspense } from 'react';

import CircleLoading from '@/components/loading/CircleLoading';
import AuthGuard from '@/components/auth/AuthGuard';
import { AppRouteObject } from '@/types/router';
import ErrorPage from '@/pages/ErrorPage';

/**
 * error routes
 * 403, 404, 500
 */
export const ErrorRoutes: AppRouteObject = {
    element: (
        <AuthGuard>
            <Suspense fallback={<CircleLoading />}>
                <Outlet />
            </Suspense>
        </AuthGuard>
    ),
    children: [
        { path: '403', element: <ErrorPage title="没有权限" desc="您不能访问该页面" /> },
        {
            path: '404',
            element: <ErrorPage title="页面不存在" desc="您访问的页面不在系统允许的路由列表中" />,
        },
        { path: '500', element: <ErrorPage title="系统错误" desc="系统发生了错误" /> },
    ],
};
