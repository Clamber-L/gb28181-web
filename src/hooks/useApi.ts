import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { api, BaseRequestConfig, HttpError, isHttpError, PageParams, PageResponse } from '@/lib';

// API状态接口
interface ApiState<T = any> {
    data: T | null;
    loading: boolean;
    error: string | null;
    lastFetch: number | null;
}

// API Store接口
interface ApiStore {
    apiStates: Record<string, ApiState>;
    setApiState: (key: string, state: Partial<ApiState>) => void;
    getApiState: (key: string) => ApiState;
    clearApiState: (key: string) => void;
    clearAllApiStates: () => void;
}

// 创建API状态管理Store
export const useApiStore = create<ApiStore>()((set, get) => ({
    apiStates: {},

    setApiState: (key: string, state: Partial<ApiState>) => {
        set((store) => ({
            apiStates: {
                ...store.apiStates,
                [key]: {
                    ...store.apiStates[key],
                    ...state,
                },
            },
        }));
    },

    getApiState: (key: string) => {
        const state = get().apiStates[key];
        return state || { data: null, loading: false, error: null, lastFetch: null };
    },

    clearApiState: (key: string) => {
        set((store) => {
            const newStates = { ...store.apiStates };
            delete newStates[key];
            return { apiStates: newStates };
        });
    },

    clearAllApiStates: () => {
        set({ apiStates: {} });
    },
}));

// useApi Hook配置
interface UseApiOptions<T> {
    // 是否立即执行
    immediate?: boolean;
    // 缓存时间（毫秒）
    cacheTime?: number;
    // 是否显示错误消息
    showErrorMessage?: boolean;
    // 成功回调
    onSuccess?: (data: T) => void;
    // 错误回调
    onError?: (error: HttpError) => void;
    // 重试次数
    retryCount?: number;
    // 重试间隔（毫秒）
    retryDelay?: number;
}

/**
 * 通用API请求Hook
 * @param config 请求配置
 * @param options Hook选项
 * @returns API状态和执行函数
 */
export function useApi<T = any>(
    config: BaseRequestConfig | (() => BaseRequestConfig),
    options: UseApiOptions<T> = {},
) {
    const {
        immediate = false,
        cacheTime = 5 * 60 * 1000, // 5分钟缓存
        showErrorMessage = true,
        onSuccess,
        onError,
        retryCount = 0,
        retryDelay = 1000,
    } = options;

    // 生成缓存key
    const getCacheKey = useCallback(() => {
        const requestConfig = typeof config === 'function' ? config() : config;
        return `${requestConfig.method || 'GET'}:${requestConfig.url}:${JSON.stringify(requestConfig.params || {})}`;
    }, []);

    const cacheKey = useMemo(() => getCacheKey(), [getCacheKey]);
    const { setApiState, getApiState } = useApiStore();
    const apiState = getApiState(cacheKey);

    const retryCountRef = useRef(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 执行请求
    const execute = useCallback(
        async (overrideConfig?: Partial<BaseRequestConfig>) => {
            const requestConfig = typeof config === 'function' ? config() : config;
            const finalConfig = { ...requestConfig, ...overrideConfig, showErrorMessage };

            // 检查缓存
            const currentState = getApiState(cacheKey);
            if (
                currentState.data &&
                currentState.lastFetch &&
                Date.now() - currentState.lastFetch < cacheTime
            ) {
                return currentState.data;
            }

            // 取消之前的请求
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            finalConfig.signal = abortControllerRef.current.signal;

            setApiState(cacheKey, { loading: true, error: null });

            try {
                const response = await api.request<T>(finalConfig);

                setApiState(cacheKey, {
                    data: response,
                    loading: false,
                    error: null,
                    lastFetch: Date.now(),
                });

                retryCountRef.current = 0;
                onSuccess?.(response);
                return response;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return null;
                }

                const httpError = isHttpError(error) ? error : new HttpError('请求失败', 500);

                // 重试逻辑
                if (retryCountRef.current < retryCount) {
                    retryCountRef.current++;
                    await new Promise((resolve) => {
                        setTimeout(resolve, retryDelay);
                    });
                    return execute(overrideConfig);
                }

                setApiState(cacheKey, {
                    loading: false,
                    error: httpError.message,
                });

                onError?.(httpError);
                throw httpError;
            }
        },
        [cacheKey, cacheTime, showErrorMessage, retryCount, retryDelay, setApiState, getApiState],
    );

    // 使用 ref 来存储最新的回调函数，避免依赖循环
    const callbacksRef = useRef({ onSuccess, onError, config });
    callbacksRef.current = { onSuccess, onError, config };

    // 定义稳定的 execute 函数
    const stableExecute = useCallback(
        async (overrideConfig?: Partial<BaseRequestConfig>) => {
            const {
                config: currentConfig,
                onSuccess: currentOnSuccess,
                onError: currentOnError,
            } = callbacksRef.current;
            const requestConfig =
                typeof currentConfig === 'function' ? currentConfig() : currentConfig;
            const finalConfig = { ...requestConfig, ...overrideConfig, showErrorMessage };

            // 检查缓存
            const currentState = getApiState(cacheKey);
            if (
                currentState.data &&
                currentState.lastFetch &&
                Date.now() - currentState.lastFetch < cacheTime
            ) {
                return currentState.data;
            }

            // 取消之前的请求
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            finalConfig.signal = abortControllerRef.current.signal;

            setApiState(cacheKey, { loading: true, error: null });

            try {
                const response = await api.request<T>(finalConfig);

                setApiState(cacheKey, {
                    data: response,
                    loading: false,
                    error: null,
                    lastFetch: Date.now(),
                });

                retryCountRef.current = 0;
                currentOnSuccess?.(response);
                return response;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return null;
                }

                const httpError = isHttpError(error) ? error : new HttpError('请求失败', 500);

                // 重试逻辑
                if (retryCountRef.current < retryCount) {
                    retryCountRef.current++;
                    await new Promise((resolve) => {
                        setTimeout(resolve, retryDelay);
                    });
                    return stableExecute(overrideConfig);
                }

                setApiState(cacheKey, {
                    loading: false,
                    error: httpError.message,
                });

                currentOnError?.(httpError);
                throw httpError;
            }
        },
        [cacheKey, cacheTime, showErrorMessage, retryCount, retryDelay, setApiState, getApiState],
    );

    // 清除缓存
    const clearCache = useCallback(() => {
        useApiStore.getState().clearApiState(cacheKey);
    }, [cacheKey]);

    // 刷新数据
    const refresh = useCallback(
        (overrideConfig?: Partial<BaseRequestConfig>) => {
            clearCache();
            return stableExecute(overrideConfig);
        },
        [stableExecute, clearCache],
    );

    // 立即执行
    const immediateRef = useRef(immediate);
    immediateRef.current = immediate;

    useEffect(() => {
        if (immediateRef.current) {
            stableExecute();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []); // 空依赖数组，只在组件挂载时执行

    return {
        data: apiState.data,
        loading: apiState.loading,
        error: apiState.error,
        execute: stableExecute,
        refresh,
        clearCache,
    };
}

/**
 * 分页数据Hook
 * @param config 请求配置
 * @param options Hook选项
 * @returns 分页状态和操作函数
 */
export function usePagination<T = any>(
    config: BaseRequestConfig | ((params: PageParams) => BaseRequestConfig),
    options: UseApiOptions<PageResponse<T>> & {
        defaultPageSize?: number;
        defaultPage?: number;
    } = {},
) {
    const { defaultPageSize = 10, defaultPage = 1, ...apiOptions } = options;

    const [pagination, setPagination] = useState({
        page: defaultPage,
        pageSize: defaultPageSize,
    });

    // 使用 ref 来存储 config，避免无限循环
    const configRef = useRef(config);
    configRef.current = config;

    const getRequestConfig = useMemo(() => {
        const currentConfig = configRef.current;
        if (typeof currentConfig === 'function') {
            return currentConfig(pagination);
        }
        return {
            ...currentConfig,
            params: {
                ...currentConfig.params,
                ...pagination,
            },
        };
    }, [pagination]); // 只依赖 pagination

    const { data, loading, error, execute, refresh, clearCache } = useApi<PageResponse<T>>(
        getRequestConfig,
        {
            ...apiOptions,
            immediate: apiOptions.immediate ?? true,
        },
    );

    // 改变页码
    const changePage = useCallback((page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    }, []);

    // 改变页大小
    const changePageSize = useCallback((pageSize: number) => {
        setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
    }, []);

    // 重置分页
    const resetPagination = useCallback(() => {
        setPagination({ page: defaultPage, pageSize: defaultPageSize });
    }, [defaultPage, defaultPageSize]);

    return {
        data: data?.list || [],
        total: data?.total || 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: data?.totalPages || 0,
        loading,
        error,
        execute,
        refresh,
        clearCache,
        changePage,
        changePageSize,
        resetPagination,
    };
}

/**
 * 表单提交Hook
 * @param config 请求配置
 * @param options Hook选项
 * @returns 提交状态和函数
 */
export function useSubmit<T = any, P = any>(
    config: BaseRequestConfig | ((data: P) => BaseRequestConfig),
    options: UseApiOptions<T> = {},
) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(
        async (data: P) => {
            const requestConfig = typeof config === 'function' ? config(data) : { ...config, data };

            setSubmitting(true);
            setError(null);

            try {
                const response = await api.request<T>({
                    ...requestConfig,
                    showErrorMessage: options.showErrorMessage ?? true,
                });

                options.onSuccess?.(response);
                return response;
            } catch (err) {
                const httpError = isHttpError(err) ? err : new HttpError('提交失败', 500);
                setError(httpError.message);
                options.onError?.(httpError);
                throw httpError;
            } finally {
                setSubmitting(false);
            }
        },
        [config, options],
    );

    return {
        submit,
        submitting,
        error,
    };
}
