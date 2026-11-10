import { AxiosError } from 'axios';

import { ApiStatus, getStatusText } from './status';
import { ErrorResponse, ErrorLogData } from './types';

/**
 * 自定义 HTTP 错误类
 */
export class HttpError extends Error {
    public readonly code: number;

    public readonly data?: unknown;

    public readonly timestamp: string;

    public readonly url?: string;

    public readonly method?: string;

    constructor(
        message: string,
        code: number,
        options?: {
            data?: unknown;
            url?: string;
            method?: string;
        },
    ) {
        super(message);
        this.name = 'HttpError';
        this.code = code;
        this.data = options?.data;
        this.timestamp = new Date().toISOString();
        this.url = options?.url;
        this.method = options?.method;
    }

    public toLogData(): ErrorLogData {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
            url: this.url,
            method: this.method,
            stack: this.stack,
        };
    }
}

/**
 * 获取错误消息
 * @param status 错误状态码
 * @returns 错误消息
 */
const getErrorMessage = (status: number): string => {
    return getStatusText(status);
};

/**
 * 处理 Axios 错误
 * @param error Axios 错误对象
 * @returns HttpError
 */
export function handleAxiosError(error: AxiosError<ErrorResponse>): never {
    // 处理取消的请求
    if (error.code === 'ERR_CANCELED') {
        console.warn('Request cancelled:', error.message);
        throw new HttpError('请求已取消', ApiStatus.internalServerError);
    }

    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;
    const requestConfig = error.config;

    // 处理网络错误
    if (!error.response) {
        throw new HttpError('网络连接失败，请检查网络设置', ApiStatus.internalServerError, {
            url: requestConfig?.url,
            method: requestConfig?.method?.toUpperCase(),
        });
    }

    // 处理 HTTP 状态码错误
    const message = statusCode ? getErrorMessage(statusCode) : errorMessage || '请求失败';

    throw new HttpError(message, statusCode || ApiStatus.internalServerError, {
        data: error.response.data,
        url: requestConfig?.url,
        method: requestConfig?.method?.toUpperCase(),
    });
}

/**
 * 显示错误消息的函数类型
 */
export type ShowErrorFunction = (message: string, error?: HttpError) => void;

/**
 * 默认错误显示函数（控制台输出）
 */
const defaultShowError: ShowErrorFunction = (message: string, error?: HttpError) => {
    console.error('[HTTP Error]:', message);
    if (error) {
        console.error('[Error Details]:', error.toLogData());
    }
};

/**
 * 全局错误显示函数，可以被外部覆盖
 */
export const showErrorMessage: ShowErrorFunction = defaultShowError;

/**
 * 设置错误显示函数
 * @param fn 错误显示函数
 */
// export function setErrorHandler(fn: ShowErrorFunction) {
//     showErrorMessage = fn;
// }

/**
 * 显示错误消息
 * @param error 错误对象
 * @param showMessage 是否显示错误消息
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
    if (showMessage) {
        showErrorMessage(error.message, error);
    }

    // 记录错误日志
    console.error('[HTTP Error]', error.toLogData());
}

/**
 * 判断是否为 HttpError 类型
 * @param error 错误对象
 * @returns 是否为 HttpError 类型
 */
export const isHttpError = (error: unknown): error is HttpError => {
    return error instanceof HttpError;
};

/**
 * 创建 HttpError 实例
 * @param message 错误消息
 * @param code 错误代码
 * @param options 额外选项
 * @returns HttpError 实例
 */
export const createHttpError = (
    message: string,
    code: number,
    options?: {
        data?: unknown;
        url?: string;
        method?: string;
    },
): HttpError => {
    return new HttpError(message, code, options);
};
