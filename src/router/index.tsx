import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';

const Login = lazy(() => import('@/pages/Login'));
const CameraManagement = lazy(() => import('@/pages/CameraManagement'));
const SystemSettings = lazy(() => import('@/pages/SystemSettings'));

export const HOMEPAGE = '/camera';

const routes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to={HOMEPAGE} replace /> },
            { path: 'camera', element: <CameraManagement /> },
            { path: 'system', element: <SystemSettings /> },
        ],
    },
    {
        path: '*',
        element: <Navigate to={HOMEPAGE} replace />,
    },
];

const router = createHashRouter(routes);

export const Router = () => {
    return <RouterProvider router={router} />;
};
