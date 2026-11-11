import React, { useEffect } from 'react';
import { Card, Form, Input, Button, message, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const STORAGE_KEY = 'system-settings';

export interface SystemConfig {
    // 基本信息
    orgName: string;
    localIp: string;
    // 后端服务器
    serverAddr: string;
    // 流媒体服务器
    mediaAddr: string;
    // 流媒体 secret
    mediaSecret: string;
    // 上游服务器
    upstreamAddr: string;
}

const DEFAULT_CONFIG: SystemConfig = {
    orgName: '',
    localIp: '',
    serverAddr: 'http://127.0.0.1:8011',
    mediaAddr: 'http://127.0.0.1:8080',
    mediaSecret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc',
    upstreamAddr: '',
};

/** 读取配置 */
export const getSystemConfig = (): SystemConfig => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
        }
    } catch {
        // ignore
    }
    return { ...DEFAULT_CONFIG };
};

/** 保存配置 */
const saveSystemConfig = (config: SystemConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/** 获取后端 API baseURL */
export const getApiBaseUrl = (): string => {
    const config = getSystemConfig();
    return config.serverAddr.replace(/\/+$/, '');
};

/** 获取流媒体服务 baseURL */
export const getMediaBaseUrl = (): string => {
    const config = getSystemConfig();
    return config.mediaAddr.replace(/\/+$/, '');
};

/** 获取上游服务器 baseURL */
export const getUpstreamBaseUrl = (): string => {
    const config = getSystemConfig();
    return config.upstreamAddr.replace(/\/+$/, '');
};

const SystemSettings: React.FC = () => {
    const [form] = Form.useForm<SystemConfig>();

    useEffect(() => {
        const config = getSystemConfig();
        form.setFieldsValue(config);
    }, [form]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            saveSystemConfig(values);
            message.success('配置已保存');
        });
    };

    return (
        <div className="space-y-4">
            <Form form={form} layout="vertical" initialValues={DEFAULT_CONFIG}>
                <Card title="基本信息" className="mb-4">
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="orgName"
                                label="单位名称"
                            >
                                <Input placeholder="请输入单位名称" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="localIp"
                                label="本地 IP 地址"
                                tooltip="外网可访问的 IP 地址，用于设备回调和流媒体播放"
                            >
                                <Input placeholder="外网可访问地址，例: 110.12.34.56" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={16}>
                    <Col xs={24} lg={12}>
                        <Card title="后端服务器配置" className="mb-4">
                            <Form.Item
                                name="serverAddr"
                                label="服务器地址"
                                rules={[{ required: true, message: '请输入服务器地址' }]}
                                tooltip="包含协议和端口，例: https://192.168.1.100:8011"
                            >
                                <Input placeholder="例: http://192.168.1.100:8011" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="流媒体服务器配置" className="mb-4">
                            <Form.Item
                                name="mediaAddr"
                                label="流媒体服务器地址"
                                rules={[{ required: true, message: '请输入流媒体服务器地址' }]}
                                tooltip="包含协议和端口，例: https://192.168.1.100:8080"
                            >
                                <Input placeholder="例: http://192.168.1.100:8080" />
                            </Form.Item>
                            <Form.Item
                                name="mediaSecret"
                                label="流媒体 Secret"
                                rules={[{ required: true, message: '请输入流媒体 Secret' }]}
                            >
                                <Input.Password placeholder="ZLMediaKit API 密钥" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <Card title="上游服务器配置" className="mb-4">
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="upstreamAddr"
                                label="上游服务器地址"
                                tooltip="包含协议和端口，例: https://10.0.0.1:8080"
                            >
                                <Input placeholder="例: http://10.0.0.1:8080" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <div>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large">
                        保存配置
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default SystemSettings;
