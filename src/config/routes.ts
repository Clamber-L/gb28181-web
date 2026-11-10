/**
 * 路由常量配置
 * 基于Vue Art Design Pro项目的路由结构
 */

/** 路由路径常量 */
export const ROUTES = {
    // 认证相关
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',

    // 主要布局
    LAYOUT: '/',

    // 仪表板
    DASHBOARD: '/dashboard',
    DASHBOARD_CONSOLE: '/dashboard/console',
    DASHBOARD_ANALYSIS: '/dashboard/analysis',
    DASHBOARD_DEMO: '/dashboard/demo', // 新增动态路由演示页面
    DASHBOARD_ECOMMERCE: '/dashboard/ecommerce',

    // 组件演示
    COMPONENTS: '/components',
    COMPONENTS_BASIC: '/components/basic',
    COMPONENTS_FORM: '/components/form',
    COMPONENTS_DATA: '/components/data',
    COMPONENTS_FEEDBACK: '/components/feedback',
    COMPONENTS_NAVIGATION: '/components/navigation',
    COMPONENTS_LAYOUT: '/components/layout',

    // 页面模板
    TEMPLATES: '/templates',
    TEMPLATES_LIST: '/templates/list',
    TEMPLATES_FORM: '/templates/form',
    TEMPLATES_DETAIL: '/templates/detail',
    TEMPLATES_RESULT: '/templates/result',

    // 图表
    CHARTS: '/charts',
    CHARTS_ECHARTS: '/charts/echarts',
    CHARTS_ANTV: '/charts/antv',

    // 系统管理
    SYSTEM: '/system',
    SYSTEM_USERS: '/system/users',
    SYSTEM_ROLES: '/system/roles',
    SYSTEM_PERMISSIONS: '/system/permissions',
    SYSTEM_SETTINGS: '/system/settings',

    // 异常页面
    EXCEPTION_403: '/exception/403',
    EXCEPTION_404: '/exception/404',
    EXCEPTION_500: '/exception/500',

    // 结果页面
    RESULT_SUCCESS: '/result/success',
    RESULT_ERROR: '/result/error',

    // 个人中心
    PROFILE: '/profile',
    PROFILE_SETTINGS: '/profile/settings',
    PROFILE_SECURITY: '/profile/security',
} as const;

/** 菜单配置类型 */
export interface MenuConfig {
    id: string;
    name: string;
    path: string;
    icon?: string;
    children?: MenuConfig[];
    meta?: {
        title: string;
        icon?: string;
        keepAlive?: boolean;
        roles?: string[];
        hideInMenu?: boolean;
        hideInTab?: boolean;
    };
}

/** 菜单配置数据 */
export const MENU_CONFIG: MenuConfig[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: 'DashboardOutlined',
        meta: {
            title: '仪表板',
            icon: 'DashboardOutlined',
        },
        children: [
            {
                id: 'dashboard-console',
                name: 'Console',
                path: ROUTES.DASHBOARD_CONSOLE,
                meta: {
                    title: '工作台',
                    keepAlive: true,
                },
            },
            {
                id: 'dashboard-demo',
                name: 'Demo',
                path: ROUTES.DASHBOARD_DEMO,
                meta: {
                    title: '动态路由演示',
                    keepAlive: true,
                },
            },
            {
                id: 'dashboard-analysis',
                name: 'Analysis',
                path: ROUTES.DASHBOARD_ANALYSIS,
                meta: {
                    title: '分析页',
                    keepAlive: true,
                },
            },
            {
                id: 'dashboard-ecommerce',
                name: 'Ecommerce',
                path: ROUTES.DASHBOARD_ECOMMERCE,
                meta: {
                    title: '电商数据',
                    keepAlive: true,
                },
            },
        ],
    },
    {
        id: 'components',
        name: 'Components',
        path: ROUTES.COMPONENTS,
        icon: 'AppstoreOutlined',
        meta: {
            title: '组件',
            icon: 'AppstoreOutlined',
        },
        children: [
            {
                id: 'components-basic',
                name: 'Basic',
                path: ROUTES.COMPONENTS_BASIC,
                meta: {
                    title: '基础组件',
                },
            },
            {
                id: 'components-form',
                name: 'Form',
                path: ROUTES.COMPONENTS_FORM,
                meta: {
                    title: '表单组件',
                },
            },
            {
                id: 'components-data',
                name: 'Data',
                path: ROUTES.COMPONENTS_DATA,
                meta: {
                    title: '数据展示',
                },
            },
            {
                id: 'components-feedback',
                name: 'Feedback',
                path: ROUTES.COMPONENTS_FEEDBACK,
                meta: {
                    title: '反馈组件',
                },
            },
        ],
    },
    {
        id: 'templates',
        name: 'Templates',
        path: ROUTES.TEMPLATES,
        icon: 'LayoutOutlined',
        meta: {
            title: '页面模板',
            icon: 'LayoutOutlined',
        },
        children: [
            {
                id: 'templates-list',
                name: 'List',
                path: ROUTES.TEMPLATES_LIST,
                meta: {
                    title: '列表页面',
                },
            },
            {
                id: 'templates-form',
                name: 'Form',
                path: ROUTES.TEMPLATES_FORM,
                meta: {
                    title: '表单页面',
                },
            },
            {
                id: 'templates-detail',
                name: 'Detail',
                path: ROUTES.TEMPLATES_DETAIL,
                meta: {
                    title: '详情页面',
                },
            },
            {
                id: 'templates-result',
                name: 'Result',
                path: ROUTES.TEMPLATES_RESULT,
                meta: {
                    title: '结果页面',
                },
            },
        ],
    },
    {
        id: 'charts',
        name: 'Charts',
        path: ROUTES.CHARTS,
        icon: 'BarChartOutlined',
        meta: {
            title: '图表',
            icon: 'BarChartOutlined',
        },
        children: [
            {
                id: 'charts-echarts',
                name: 'ECharts',
                path: ROUTES.CHARTS_ECHARTS,
                meta: {
                    title: 'ECharts',
                },
            },
            {
                id: 'charts-antv',
                name: 'AntV',
                path: ROUTES.CHARTS_ANTV,
                meta: {
                    title: 'AntV',
                },
            },
        ],
    },
    {
        id: 'system',
        name: 'System',
        path: ROUTES.SYSTEM,
        icon: 'SettingOutlined',
        meta: {
            title: '系统管理',
            icon: 'SettingOutlined',
            roles: ['admin'],
        },
        children: [
            {
                id: 'system-users',
                name: 'Users',
                path: ROUTES.SYSTEM_USERS,
                meta: {
                    title: '用户管理',
                    roles: ['admin'],
                },
            },
            {
                id: 'system-roles',
                name: 'Roles',
                path: ROUTES.SYSTEM_ROLES,
                meta: {
                    title: '角色管理',
                    roles: ['admin'],
                },
            },
            {
                id: 'system-permissions',
                name: 'Permissions',
                path: ROUTES.SYSTEM_PERMISSIONS,
                meta: {
                    title: '权限管理',
                    roles: ['admin'],
                },
            },
        ],
    },
];

/** 路由类型定义 */
export type RouteKey = keyof typeof ROUTES;
