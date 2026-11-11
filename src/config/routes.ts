/**
 * 路由常量配置
 * GB28181 视频管理平台
 */

/** 路由路径常量 */
export const ROUTES = {
    LOGIN: '/login',
    LAYOUT: '/',

    // 摄像头管理
    CAMERA: '/camera',

    // 系统设置
    SYSTEM: '/system',
} as const;

/** 路由类型定义 */
export type RouteKey = keyof typeof ROUTES;
