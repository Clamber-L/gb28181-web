import React, { useCallback, useEffect } from 'react';

import { useRouter } from '@/hooks/use-router';
import { useAuth } from '@/stores/authStore';

type Props = {
    children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
    const router = useRouter();
    const { accessToken, isLogin } = useAuth();

    const check = useCallback(() => {
        // 检查登录状态和token
        if (!isLogin || !accessToken) {
            console.log('未登录，重定向到登录页');
            router.replace('/login');
        }
    }, [router, accessToken, isLogin]);

    useEffect(() => {
        check();
    }, [check]);

    // 如果未登录，不渲染子组件
    if (!isLogin || !accessToken) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;
