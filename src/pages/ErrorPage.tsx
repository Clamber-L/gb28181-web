import { Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { HOMEPAGE } from '@/router';

const ErrorPage = ({ title, desc }: { title: string; desc: string }) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{desc}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                    当前路径:{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
                </p>
                <div className="space-y-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate(HOMEPAGE, { replace: true });
                        }}
                    >
                        返回首页
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
