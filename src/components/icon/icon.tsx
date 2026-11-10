// 图标映射
import {
    AppstoreOutlined,
    BarChartOutlined,
    BuildOutlined,
    DashboardOutlined,
    EditOutlined,
    FileTextOutlined,
    FormOutlined,
    HomeOutlined,
    LayoutOutlined,
    SettingOutlined,
    TableOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons';

const ICON_MAP = {
    DashboardOutlined,
    AppstoreOutlined,
    LayoutOutlined,
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    HomeOutlined,
    BuildOutlined,
    FormOutlined,
    TableOutlined,
    UnorderedListOutlined,
    EditOutlined,
    FileTextOutlined,
} as const;

// 获取图标组件
export const getIcon = (iconName?: string) => {
    if (!iconName || !(iconName in ICON_MAP)) return null;
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
    return <IconComponent />;
};
