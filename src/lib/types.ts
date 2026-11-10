/**
 * 请求相关类型定义
 */

// 错误消息模式
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

// 请求配置选项
export interface RequestOptions {
    // 是否将参数拼接到URL
    joinParamsToUrl?: boolean;
    // 是否格式化日期
    formatDate?: boolean;
    // 是否转换响应数据
    isTransformResponse?: boolean;
    // 是否返回原生响应
    isReturnNativeResponse?: boolean;
    // 是否添加前缀
    joinPrefix?: boolean;
    // API URL
    apiUrl?: string;
    // 错误消息模式
    errorMessageMode?: ErrorMessageMode;
    // 是否添加时间戳
    joinTime?: boolean;
    // 是否忽略取消令牌
    ignoreCancelToken?: boolean;
    // 是否携带token
    withToken?: boolean;
    // 是否显示错误消息
    showErrorMessage?: boolean;
}

// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求头类型
export interface RequestHeaders {
    [key: string]: string | number | boolean;
}

// 基础请求配置
export interface BaseRequestConfig {
    url: string;
    method?: RequestMethod;
    headers?: RequestHeaders;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
    showErrorMessage?: boolean;
    signal?: AbortSignal;
}

// API 响应基础结构
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
}

// 分页响应结构
export interface PageResponse<T = any> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 分页请求参数
export interface PageParams {
    page?: number;
    pageSize?: number;
    [key: string]: any;
}

// 错误响应接口
export interface ErrorResponse {
    code: number;
    message: string;
    data?: unknown;
}

// 错误日志数据接口
export interface ErrorLogData {
    code: number;
    message: string;
    data?: unknown;
    timestamp: string;
    url?: string;
    method?: string;
    stack?: string;
}