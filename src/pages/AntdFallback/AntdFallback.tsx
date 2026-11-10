import React from 'react';

const AntdFallback: React.FC = () => {
    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🚀 Ant Design 准备就绪
                    </h1>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800">✅ Ant Design 已添加到项目依赖中</p>
                        <p className="text-blue-600 mt-2">
                            请运行{' '}
                            <code className="bg-blue-100 px-2 py-1 rounded">npm install</code>{' '}
                            安装依赖包
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                📦 已配置的功能
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Ant Design 5.x 最新版本</li>
                                <li>• 图标库 @ant-design/icons</li>
                                <li>• 主题配置 (浅色/暗色)</li>
                                <li>• 中文语言包</li>
                                <li>• Art Design Pro 配色方案</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                🎨 主题特性
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• 与Vue项目配色一致</li>
                                <li>• 支持明暗主题切换</li>
                                <li>• 自定义组件样式</li>
                                <li>• 响应式设计</li>
                                <li>• TypeScript 完整支持</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                            📋 接下来的步骤
                        </h3>
                        <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                            <li>
                                {' '}
                                运行{' '}
                                <code className="bg-yellow-100 px-2 py-1 rounded">
                                    npm install
                                </code>{' '}
                                安装依赖
                            </li>
                            <li> 重启开发服务器</li>
                            <li>查看完整的 Ant Design 组件演示</li>
                        </ol>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <p className="text-indigo-800 font-medium">
                            💡 提示：所有配置文件已就绪，包括主题配置、多语言支持和响应式布局。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AntdFallback;
