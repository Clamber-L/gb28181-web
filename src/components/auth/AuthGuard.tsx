import React, { useCallback, useEffect } from 'react';

import { useRouter } from '@/hooks/use-router';
import { useAuth } from '@/stores/authStore';

type Props = {
    children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
    const router = useRouter();
    const { isLogin } = useAuth();

    const check = useCallback(() => {
        if (!isLogin) {
            router.replace('/login');
        }
    }, [router, isLogin]);

    useEffect(() => {
        check();
    }, [check]);

    if (!isLogin) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;
