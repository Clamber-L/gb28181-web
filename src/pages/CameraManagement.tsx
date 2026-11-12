import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, message, Modal, Descriptions, Select, Switch } from 'antd';
import {
    ReloadOutlined,
    SearchOutlined,
    VideoCameraOutlined,
    UnorderedListOutlined,
    InfoCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import api from '@/lib/request';
import { getApiBaseUrl, getSystemConfig } from '@/pages/SystemSettings';

// ============ 常量 ============

const CAMERA_TYPE_OPTIONS = [
    { label: '普通摄像头', value: 'normal' },
    { label: '离岗摄像头', value: 'absence' },
];

// ============ 类型定义 ============

interface DeviceRecord {
    id: string;
    deviceId: string;
    deviceName: string;
    manufacturer: string;
    deviceModel: string;
    firmware: string;
    transport: string;
    streamMode: string;
    ip: string;
    port: number;
    hostAddress: string;
    online: boolean;
    registerTimestamp: number;
    keepaliveTimestamp: number;
    heartBeatInterval: number;
    heartBeatCount: number;
    positionCapability: number;
    channelCount: number;
    expires: number;
    mediaServerId: string;
    charset: string;
    subscribeCycleForAlarm: number;
    geoCoordSys: string;
    password: string;
    sdpIp: string;
    localIp: string;
    asMessageChannel: boolean;
    broadcastPushAfterAck: boolean;
    serverId: string;
    subscribeCycleForCatalog: number;
    subscribeCycleForMobilePosition: number;
    mobilePositionSubmissionInterval: number;
    createTime: string;
    updateTime: string;
}

interface DeviceChannelRecord {
    id: string;
    parentDeviceId: string;
    deviceChannelId: string;
    deviceChannelName: string;
    deviceMode: string;
}

interface TableInfoData<T> {
    data: T[];
    pageNum: number;
    pageSize: number;
    totalSize: number;
    totalPages: number;
}

// ============ API ============

const fetchDeviceList = (page: number, size: number, ip?: string) => {
    const baseUrl = getApiBaseUrl();
    return api.get<TableInfoData<DeviceRecord>>({
        url: `${baseUrl}/api/camera_upload/deviceList`,
        params: { page, size, ...(ip ? { ip } : {}) },
    });
};

const fetchChannelList = (deviceId: string) => {
    const baseUrl = getApiBaseUrl();
    return api.get<DeviceChannelRecord[]>({
        url: `${baseUrl}/api/camera_upload/channelList`,
        params: { deviceId },
    });
};

// ============ 工具函数 ============

const fmtTs = (ts: number): string => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('zh-CN', { hour12: false });
};

const fmtDt = (dt: string): string => {
    if (!dt) return '-';
    return dt.replace('T', ' ');
};

// ============ 组件 ============

const CameraManagement: React.FC = () => {
    const [data, setData] = useState<DeviceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchIp, setSearchIp] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    // 通道弹窗
    const [channelModalOpen, setChannelModalOpen] = useState(false);
    const [channelLoading, setChannelLoading] = useState(false);
    const [channelData, setChannelData] = useState<DeviceChannelRecord[]>([]);
    const [channelDeviceName, setChannelDeviceName] = useState('');

    // 详情弹窗
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState<DeviceRecord | null>(null);

    // 同步弹窗
    const [syncModalOpen, setSyncModalOpen] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncVideoDeviceId, setSyncVideoDeviceId] = useState<string | undefined>(undefined);
    const [syncAudioDeviceId, setSyncAudioDeviceId] = useState<string | undefined>(undefined);
    const [syncAudioDeviceParent, setSyncAudioDeviceParent] = useState<string | undefined>(undefined);
    const [syncAudioChannelList, setSyncAudioChannelList] = useState<DeviceChannelRecord[]>([]);
    const [syncAudioChannelLoading, setSyncAudioChannelLoading] = useState(false);
    const [syncCameraType, setSyncCameraType] = useState('normal');
    const [syncFireRoomCamera, setSyncFireRoomCamera] = useState(false);
    const [syncAudioCamera, setSyncAudioCamera] = useState(false);

    const loadData = useCallback(
        async (page?: number, size?: number) => {
            setLoading(true);
            try {
                const p = page ?? pagination.current;
                const s = size ?? pagination.pageSize;
                const res = await fetchDeviceList(p, s, searchIp || undefined);
                setData(res.data || []);
                setPagination((prev) => ({
                    ...prev,
                    current: res.pageNum,
                    pageSize: res.pageSize,
                    total: res.totalSize,
                }));
            } catch {
                message.error('获取设备列表失败，请检查系统设置中的服务器地址');
            } finally {
                setLoading(false);
            }
        },
        [pagination.current, pagination.pageSize, searchIp],
    );

    useEffect(() => {
        loadData(1);
    }, []);

    const handleTableChange = (pag: any) => {
        loadData(pag.current, pag.pageSize);
    };

    const handleSearch = () => {
        loadData(1);
    };

    const handleShowChannels = async (record: DeviceRecord) => {
        setChannelDeviceName(record.deviceName || record.deviceId);
        setChannelModalOpen(true);
        setChannelLoading(true);
        try {
            const res = await fetchChannelList(record.deviceId);
            setChannelData(res || []);
        } catch {
            message.error('获取通道列表失败');
            setChannelData([]);
        } finally {
            setChannelLoading(false);
        }
    };

    const handleShowDetail = (record: DeviceRecord) => {
        setDetailRecord(record);
        setDetailModalOpen(true);
    };

    const handleOpenSyncModal = () => {
        const config = getSystemConfig();
        if (!config.orgName?.trim()) {
            message.warning('请先在系统设置中填写单位名称');
            return;
        }
        if (!config.upstreamAddr?.trim()) {
            message.warning('请先在系统设置中填写上游服务器地址');
            return;
        }
        setSyncVideoDeviceId(undefined);
        setSyncAudioDeviceId(undefined);
        setSyncAudioDeviceParent(undefined);
        setSyncAudioChannelList([]);
        setSyncCameraType('normal');
        setSyncFireRoomCamera(false);
        setSyncAudioCamera(false);
        setSyncModalOpen(true);
    };

    const handleAudioDeviceChange = async (deviceId: string) => {
        setSyncAudioDeviceParent(deviceId);
        setSyncAudioDeviceId(undefined);
        setSyncAudioChannelLoading(true);
        try {
            const res = await fetchChannelList(deviceId);
            setSyncAudioChannelList(res || []);
        } catch {
            message.error('获取音频设备通道失败');
            setSyncAudioChannelList([]);
        } finally {
            setSyncAudioChannelLoading(false);
        }
    };

    const handleSyncConfirm = async () => {
        if (!syncVideoDeviceId) {
            message.warning('请选择视频通道');
            return;
        }
        if (!syncAudioDeviceId) {
            message.warning('请选择音频通道');
            return;
        }
        const baseUrl = getApiBaseUrl();
        const config = getSystemConfig();
        setSyncLoading(true);
        try {
            await api.post({
                url: `${baseUrl}/api/camera_upload/syncChannel`,
                data: {
                    orgName: config.orgName,
                    videoDeviceId: syncVideoDeviceId,
                    audioDeviceId: syncAudioDeviceId,
                    cameraType: syncCameraType,
                    upstreamAddr: config.upstreamAddr,
                    serverAddr: config.serverAddr,
                    localIp: config.localIp,
                    mediaAddr: config.mediaAddr,
                    mediaSecret: config.mediaSecret,
                    fireRoomCamera: syncFireRoomCamera,
                    audioCamera: syncAudioCamera,
                },
            });
            message.success('同步成功');
            setSyncModalOpen(false);
        } catch {
            message.error('同步失败');
        } finally {
            setSyncLoading(false);
        }
    };

    // ============ 大列表列定义 ============

    const columns: ColumnsType<DeviceRecord> = [
        {
            title: '设备名称',
            dataIndex: 'deviceName',
            key: 'deviceName',
            width: 140,
            ellipsis: true,
            render: (text: string, record) => (
                <span><VideoCameraOutlined className="mr-1" />{text || record.deviceId}</span>
            ),
        },
        {
            title: '设备编号',
            dataIndex: 'deviceId',
            key: 'deviceId',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            width: 120,
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
            width: 60,
        },
        {
            title: '厂商',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            width: 80,
            ellipsis: true,
        },
        {
            title: '型号',
            dataIndex: 'deviceModel',
            key: 'deviceModel',
            width: 80,
            ellipsis: true,
            render: (text: string) => text || '-',
        },
        {
            title: '传输',
            dataIndex: 'transport',
            key: 'transport',
            width: 60,
            render: (text: string) => text || '-',
        },
        {
            title: '流模式',
            dataIndex: 'streamMode',
            key: 'streamMode',
            width: 90,
            render: (text: string) => text || '-',
        },
        {
            title: '通道',
            dataIndex: 'channelCount',
            key: 'channelCount',
            width: 55,
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'online',
            key: 'online',
            width: 65,
            align: 'center',
            render: (online: boolean) => (
                <Tag color={online ? 'green' : 'default'}>{online ? '在线' : '离线'}</Tag>
            ),
        },
        {
            title: '最后心跳',
            dataIndex: 'keepaliveTimestamp',
            key: 'keepaliveTimestamp',
            width: 160,
            render: (ts: number) => fmtTs(ts),
        },
        {
            title: '操作',
            key: 'action',
            width: 140,
            fixed: 'right',
            render: (_: unknown, record: DeviceRecord) => (
                <Space size={0}>
                    <Button type="link" size="small" icon={<InfoCircleOutlined />} onClick={() => handleShowDetail(record)}>
                        详情
                    </Button>
                    <Button type="link" size="small" icon={<UnorderedListOutlined />} onClick={() => handleShowChannels(record)}>
                        通道
                    </Button>
                </Space>
            ),
        },
    ];

    // ============ 通道小列表列定义 ============

    const channelColumns: ColumnsType<DeviceChannelRecord> = [
        {
            title: '通道编号',
            dataIndex: 'deviceChannelId',
            key: 'deviceChannelId',
            width: 220,
        },
        {
            title: '通道名称',
            dataIndex: 'deviceChannelName',
            key: 'deviceChannelName',
            render: (text: string) => text || '-',
        },
        {
            title: '设备型号',
            dataIndex: 'deviceMode',
            key: 'deviceMode',
            render: (text: string) => text || '-',
        },
    ];

    return (
        <div>
            <Card
                title="摄像头管理"
                extra={
                    <Space>
                        <Input
                            placeholder="按 IP 搜索"
                            prefix={<SearchOutlined />}
                            value={searchIp}
                            onChange={(e) => setSearchIp(e.target.value)}
                            onPressEnter={handleSearch}
                            allowClear
                            style={{ width: 200 }}
                        />
                        <Button icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
                        <Button icon={<ReloadOutlined />} onClick={() => loadData()}>刷新</Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    size="small"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 台设备`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1400 }}
                />
            </Card>

            {/* 设备详情弹窗 */}
            <Modal
                title={`设备详情 - ${detailRecord?.deviceName || detailRecord?.deviceId || ''}`}
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {detailRecord && (
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="设备名称">{detailRecord.deviceName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="设备编号">{detailRecord.deviceId}</Descriptions.Item>
                        <Descriptions.Item label="厂商">{detailRecord.manufacturer || '-'}</Descriptions.Item>
                        <Descriptions.Item label="型号">{detailRecord.deviceModel || '-'}</Descriptions.Item>
                        <Descriptions.Item label="固件版本">{detailRecord.firmware || '-'}</Descriptions.Item>
                        <Descriptions.Item label="字符集">{detailRecord.charset || '-'}</Descriptions.Item>
                        <Descriptions.Item label="WAN IP">{detailRecord.ip}</Descriptions.Item>
                        <Descriptions.Item label="WAN 端口">{detailRecord.port}</Descriptions.Item>
                        <Descriptions.Item label="WAN 主机地址">{detailRecord.hostAddress || '-'}</Descriptions.Item>
                        <Descriptions.Item label="SIP交互IP">{detailRecord.localIp || '-'}</Descriptions.Item>
                        <Descriptions.Item label="收流IP">{detailRecord.sdpIp || '-'}</Descriptions.Item>
                        <Descriptions.Item label="传输协议">{detailRecord.transport || '-'}</Descriptions.Item>
                        <Descriptions.Item label="流模式">{detailRecord.streamMode || '-'}</Descriptions.Item>
                        <Descriptions.Item label="通道数">{detailRecord.channelCount}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={detailRecord.online ? 'green' : 'default'}>
                                {detailRecord.online ? '在线' : '离线'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="注册有效期">{detailRecord.expires}s</Descriptions.Item>
                        <Descriptions.Item label="心跳间隔">{detailRecord.heartBeatInterval || 60}s</Descriptions.Item>
                        <Descriptions.Item label="心跳超时次数">{detailRecord.heartBeatCount || 3}</Descriptions.Item>
                        <Descriptions.Item label="注册时间">{fmtTs(detailRecord.registerTimestamp)}</Descriptions.Item>
                        <Descriptions.Item label="最后心跳">{fmtTs(detailRecord.keepaliveTimestamp)}</Descriptions.Item>
                        <Descriptions.Item label="媒体服务ID">{detailRecord.mediaServerId || '-'}</Descriptions.Item>
                        <Descriptions.Item label="所属服务ID">{detailRecord.serverId || '-'}</Descriptions.Item>
                        <Descriptions.Item label="定位能力">{detailRecord.positionCapability === 1 ? 'GPS' : detailRecord.positionCapability === 2 ? '北斗' : '不支持'}</Descriptions.Item>
                        <Descriptions.Item label="坐标系">{detailRecord.geoCoordSys || '-'}</Descriptions.Item>
                        <Descriptions.Item label="消息通道">{detailRecord.asMessageChannel ? '是' : '否'}</Descriptions.Item>
                        <Descriptions.Item label="ACK后推流">{detailRecord.broadcastPushAfterAck ? '是' : '否'}</Descriptions.Item>
                        <Descriptions.Item label="目录订阅周期">{detailRecord.subscribeCycleForCatalog || '不订阅'}</Descriptions.Item>
                        <Descriptions.Item label="报警订阅周期">{detailRecord.subscribeCycleForAlarm || '不订阅'}</Descriptions.Item>
                        <Descriptions.Item label="移动位置订阅">{detailRecord.subscribeCycleForMobilePosition || '不订阅'}</Descriptions.Item>
                        <Descriptions.Item label="位置上报间隔">{detailRecord.mobilePositionSubmissionInterval || 5}s</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{fmtDt(detailRecord.createTime)}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{fmtDt(detailRecord.updateTime)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* 通道列表弹窗 */}
            <Modal
                title={
                    <div className="flex justify-between items-center pr-8">
                        <span>{`通道列表 - ${channelDeviceName}`}</span>
                        <Button
                            type="primary"
                            icon={<SyncOutlined />}
                            onClick={handleOpenSyncModal}
                            disabled={channelData.length === 0}
                        >
                            同步
                        </Button>
                    </div>
                }
                open={channelModalOpen}
                onCancel={() => setChannelModalOpen(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Table
                    columns={channelColumns}
                    dataSource={channelData}
                    rowKey="id"
                    loading={channelLoading}
                    pagination={false}
                    size="small"
                />
            </Modal>

            {/* 同步确认弹窗 */}
            <Modal
                title="同步通道"
                open={syncModalOpen}
                onCancel={() => setSyncModalOpen(false)}
                onOk={handleSyncConfirm}
                confirmLoading={syncLoading}
                okText="确认同步"
                destroyOnClose
            >
                <div className="space-y-4 py-2">
                    <div>
                        <span className="text-gray-500 mr-2">视频通道:</span>
                        <Select
                            value={syncVideoDeviceId}
                            onChange={setSyncVideoDeviceId}
                            placeholder="请选择视频通道"
                            options={channelData.map((ch) => ({
                                label: `${ch.deviceChannelName || ch.deviceChannelId} (${ch.deviceChannelId})`,
                                value: ch.deviceChannelId,
                            }))}
                            style={{ width: 360 }}
                            showSearch
                            optionFilterProp="label"
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">音频设备:</span>
                        <Select
                            value={syncAudioDeviceParent}
                            onChange={handleAudioDeviceChange}
                            placeholder="请选择音频所在设备"
                            options={data.map((d) => ({
                                label: `${d.deviceName || d.deviceId} (${d.deviceId})`,
                                value: d.deviceId,
                            }))}
                            style={{ width: 360 }}
                            showSearch
                            optionFilterProp="label"
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">音频通道:</span>
                        <Select
                            value={syncAudioDeviceId}
                            onChange={setSyncAudioDeviceId}
                            placeholder={syncAudioDeviceParent ? '请选择音频通道' : '请先选择音频设备'}
                            options={syncAudioChannelList.map((ch) => ({
                                label: `${ch.deviceChannelName || ch.deviceChannelId} (${ch.deviceChannelId})`,
                                value: ch.deviceChannelId,
                            }))}
                            style={{ width: 360 }}
                            showSearch
                            optionFilterProp="label"
                            disabled={!syncAudioDeviceParent}
                            loading={syncAudioChannelLoading}
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">摄像头类型:</span>
                        <Select
                            value={syncCameraType}
                            onChange={setSyncCameraType}
                            options={CAMERA_TYPE_OPTIONS}
                            style={{ width: 200 }}
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">消控室摄像头:</span>
                        <Switch checked={syncFireRoomCamera} onChange={setSyncFireRoomCamera} />
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">支持音频喊话:</span>
                        <Switch
                            checked={syncAudioCamera}
                            onChange={setSyncAudioCamera}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CameraManagement;
