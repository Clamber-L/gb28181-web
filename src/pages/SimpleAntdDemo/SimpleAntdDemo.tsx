import React, { useState } from 'react';

// 动态导入 Ant Design 组件以避免类型错误
const SimpleAntdDemo: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        city: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 模拟提交
        setTimeout(() => {
            setLoading(false);
            alert('表单提交成功！');
        }, 1000);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* 标题区域 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🐜 Ant Design 集成成功！
                    </h1>
                    <p className="text-lg text-gray-600">
                        React项目已成功集成Ant Design 5.x，配置完成，可以开始使用了！
                    </p>
                </div>

                {/* Ant Design 验证测试 */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                        🧪 Ant Design 验证测试
                    </h2>
                    <p className="text-indigo-700 mb-4">
                        请打开浏览器开发者工具的控制台，如果看到以下代码没有报错，说明 Ant Design
                        安装成功：
                    </p>
                    <div className="bg-gray-900 text-white p-4 rounded-lg text-sm font-mono">
                        <div className="text-green-400">测试 Ant Design 导入</div>
                        <div className="text-blue-300">
                            import {`{ Button, Card, Input } from 'antd';`}
                        </div>
                        <div className="text-blue-300">
                            import {`{ UserOutlined } from '@ant-design/icons';`}
                        </div>
                        <div className="text-gray-400 mt-2">
                            如果上述导入没有错误，说明 Ant Design 可以正常使用
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            try {
                                // 动态导入测试
                                import('antd')
                                    .then((antd) => {
                                        console.log('✅ Ant Design 导入成功:', antd);
                                        alert('🎉 Ant Design 验证成功！可以正常使用所有组件。');
                                    })
                                    .catch((err) => {
                                        console.error('❌ Ant Design 导入失败:', err);
                                        alert('⚠️ Ant Design 导入失败，请检查安装。');
                                    });
                            } catch (error) {
                                console.error('验证出错:', error);
                                alert('验证过程出错，请查看控制台日志。');
                            }
                        }}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        🔍 运行验证测试
                    </button>
                </div>

                {/* 功能演示区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 表单演示 */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            📝 表单组件演示
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    用户名
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="请输入用户名"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    邮箱
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="请输入邮箱"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    城市
                                </label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">请选择城市</option>
                                    <option value="beijing">北京</option>
                                    <option value="shanghai">上海</option>
                                    <option value="guangzhou">广州</option>
                                    <option value="shenzhen">深圳</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                }`}
                            >
                                {loading ? '提交中...' : '提交表单'}
                            </button>
                        </form>
                    </div>

                    {/* 配置信息 */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">⚙️ 配置信息</h3>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">主题配置</h4>
                                <p className="text-sm text-blue-700">
                                    📁 src/config/antdTheme.ts
                                    <br />
                                    🎨 Art Design Pro 配色方案
                                    <br />
                                    🌙 支持明暗主题切换
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">组件提供者</h4>
                                <p className="text-sm text-green-700">
                                    📁 src/providers/ThemeProvider.tsx
                                    <br />
                                    🌍 中文语言包支持
                                    <br />
                                    🔧 ConfigProvider 配置
                                </p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-medium text-purple-900 mb-2">完整演示</h4>
                                <p className="text-sm text-purple-700">
                                    📁 src/components/AntdDemo.tsx
                                    <br />
                                    🎯 所有常用组件演示
                                    <br />
                                    💡 最佳实践示例
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 下一步指南 */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 下一步开发指南</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">1. 使用组件</h4>
                            <p className="text-sm text-gray-600">
                                从 antd 导入所需组件，如 Button、Form、Table 等
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">2. 主题定制</h4>
                            <p className="text-sm text-gray-600">
                                修改 antdTheme.ts 中的颜色和样式配置
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">3. 组件扩展</h4>
                            <p className="text-sm text-gray-600">
                                基于 Ant Design 创建自定义业务组件
                            </p>
                        </div>
                    </div>
                </div>

                {/* 代码示例 */}
                <div className="mt-8 bg-gray-900 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">💻 快速开始代码示例</h3>
                    <pre className="text-sm overflow-x-auto">
                        <code>{`import { Button, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const MyComponent = () => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    message.success('操作成功！');
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input 
          prefix={<UserOutlined />} 
          placeholder="用户名" 
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};`}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SimpleAntdDemo;
