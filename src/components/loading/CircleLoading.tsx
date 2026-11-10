import { Spin } from 'antd';

const CircleLoading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spin size="large" spinning>
                <div className="p-8">
                    <div className="text-gray-600 text-center">加载路由配置中...</div>
                </div>
            </Spin>
        </div>
    );
};

export default CircleLoading;
