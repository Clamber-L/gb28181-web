import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ApiStatus } from './status';
import { HttpError, handleAxiosError, showError, createHttpError } from './error';
import { ApiResponse } from './types';

/** 请求配置常量 */
const REQUEST_TIMEOUT = 15000;
const LOGOUT_DELAY = 500;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const UNAUTHORIZED_DEBOUNCE_TIME = 3000;

/** 401防抖状态 */
let isUnauthorizedErrorShown = false;
let unauthorizedTimer: ReturnType<typeof setTimeout> | null = null;

/** 扩展 AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    url?: string;
    method?: string;
    params?: any;
    data?: any;
    headers?: any;
    showErrorMessage?: boolean;
}

/** 认证Token管理 */
class TokenManager {
    private static instance: TokenManager;

    private token: string | null = null;

    private refreshToken: string | null = null;

    private constructor() {
        this.loadTokensFromStorage();
    }

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    private loadTokensFromStorage() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('accessToken');
            this.refreshToken = localStorage.getItem('refreshToken');
        }
    }

    public getToken(): string | null {
        return this.token;
    }

    public setToken(token: string, refreshToken?: string) {
        this.token = token;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            }
        }
    }

    public clearTokens() {
        this.token = null;
        this.refreshToken = null;

        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }

    public getRefreshToken(): string | null {
        return this.refreshToken;
    }
}

/** Token管理器实例 */
const tokenManager = TokenManager.getInstance();

/** 退出登录回调函数 */
let logoutCallback: (() => void) | null = null;

/**
 * 设置退出登录回调函数
 * @param callback 退出登录回调
 */
export function setLogoutCallback(callback: () => void) {
    logoutCallback = callback;
}

/** 环境变量配置 */
const config = {
    VITE_API_URL: import.meta.env.VITE_API_URL || '/api',
    VITE_WITH_CREDENTIALS: import.meta.env.VITE_WITH_CREDENTIALS === 'true',
};

/** Axios实例 */
const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: config.VITE_API_URL,
    withCredentials: config.VITE_WITH_CREDENTIALS,
    validateStatus: (status: number) => status >= 200 && status < 300,
    transformResponse: [
        (data, headers) => {
            const contentType = headers?.['content-type'];
            if (contentType?.includes('application/json')) {
                try {
                    return JSON.parse(data);
                } catch {
                    return data;
                }
            }
            return data;
        },
    ],
});

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
    (req: InternalAxiosRequestConfig) => {
        const accessToken = tokenManager.getToken();
        if (accessToken) {
            req.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        if (req.data && !(req.data instanceof FormData) && !req.headers['Content-Type']) {
            req.headers.set('Content-Type', 'application/json');
            if (typeof req.data === 'object') {
                req.data = JSON.stringify(req.data);
            }
        }

        return req;
    },
    (error) => {
        showError(createHttpError('请求配置错误', ApiStatus.internalServerError));
        return Promise.reject(error);
    },
);

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { code, message } = response.data;

        if (code === ApiStatus.success.valueOf() || code === 0) {
            return response;
        }

        if (code === ApiStatus.unauthorized.valueOf()) {
            handleUnauthorizedError(message);
        }

        throw createHttpError(message || '请求失败', code);
    },
    (error) => {
        if (error.response?.status === ApiStatus.unauthorized) {
            handleUnauthorizedError();
        }
        return Promise.reject(handleAxiosError(error));
    },
);

/** 统一创建HttpError */
function createRequestError(message: string, code: number) {
    return createHttpError(message, code);
}

/** 处理401错误（带防抖） */
function handleUnauthorizedError(message?: string): never {
    const error = createRequestError(message || '用户未登录或登录已过期', ApiStatus.unauthorized);

    if (!isUnauthorizedErrorShown) {
        isUnauthorizedErrorShown = true;
        logOut();

        unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME);

        showError(error, true);
        throw error;
    }

    throw error;
}

/** 重置401防抖状态 */
function resetUnauthorizedError() {
    isUnauthorizedErrorShown = false;
    if (unauthorizedTimer) {
        clearTimeout(unauthorizedTimer);
    }
    unauthorizedTimer = null;
}

/** 退出登录函数 */
function logOut() {
    setTimeout(() => {
        tokenManager.clearTokens();
        if (logoutCallback) {
            logoutCallback();
        }
    }, LOGOUT_DELAY);
}

/** 是否需要重试 */
function shouldRetry(statusCode: number) {
    return [
        ApiStatus.requestTimeout,
        ApiStatus.internalServerError,
        ApiStatus.badGateway,
        ApiStatus.serviceUnavailable,
        ApiStatus.gatewayTimeout,
    ].includes(statusCode);
}

/** 请求重试逻辑 */
async function retryRequest<T>(
    conf: ExtendedAxiosRequestConfig,
    retries: number = MAX_RETRIES,
): Promise<T> {
    try {
        return await request<T>(conf);
    } catch (error) {
        if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
            await delay(RETRY_DELAY);
            return retryRequest<T>(conf, retries - 1);
        }
        throw error;
    }
}

/** 延迟函数 */
function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/** 请求函数 */
async function request<T = any>(conf: ExtendedAxiosRequestConfig): Promise<T> {
    // POST | PUT 参数自动填充
    if (['POST', 'PUT'].includes(conf.method?.toUpperCase() || '') && conf.params && !conf.data) {
        conf.data = conf.params;
        conf.params = undefined;
    }

    try {
        const res = await axiosInstance.request<ApiResponse<T>>(conf);
        return res.data.data as T;
    } catch (error) {
        if (error instanceof HttpError && error.code !== ApiStatus.unauthorized.valueOf()) {
            const showMsg = conf.showErrorMessage !== false;
            showError(error, showMsg);
        }
        return Promise.reject(error);
    }
}

/** API方法集合 */
const api = {
    get<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...conf, method: 'GET' });
    },
    post<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...conf, method: 'POST' });
    },
    put<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...conf, method: 'PUT' });
    },
    delete<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...conf, method: 'DELETE' });
    },
    patch<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...conf, method: 'PATCH' });
    },
    request<T>(conf: ExtendedAxiosRequestConfig) {
        return retryRequest<T>(conf);
    },
};

/** 导出Token管理器和API */
export { tokenManager, api };
export default api;
