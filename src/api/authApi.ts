import { api } from '@/lib/request';
import type { LoginParams, LoginResponse } from '@/stores/authStore';
import { UserInfo } from '@/types/user';
import { mockRouteTree } from '@/mock/routeData';

/**
 * 认证相关API服务
 */
export class AuthService {
    /**
     * 用户登录
     * @param params 登录参数
     * @returns 登录响应
     */
    static async login(params: LoginParams): Promise<LoginResponse> {
        try {
            return await api.post<LoginResponse>({
                url: '/api/auth/login',
                data: params,
            });
        } catch (error) {
            console.error('[AuthService] Login failed:', error);
            throw error;
        }
    }

    /**
     * 获取用户信息
     * @returns 用户信息
     */
    static async getUserInfo(): Promise<UserInfo> {
        try {
            return await api.get<UserInfo>({
                url: '/api/user/info',
            });
        } catch (error) {
            console.error('[AuthService] Get user info failed:', error);
            throw error;
        }
    }

    /**
     * 刷新Token
     * @param refreshToken 刷新令牌
     * @returns 新的访问令牌
     */
    static async refreshToken(
        refreshToken: string,
    ): Promise<{ token: string; refreshToken?: string }> {
        try {
            return await api.post<{ token: string; refreshToken?: string }>({
                url: '/api/auth/refresh',
                data: { refreshToken },
            });
        } catch (error) {
            console.error('[AuthService] Refresh token failed:', error);
            throw error;
        }
    }

    /**
     * 退出登录
     */
    static async logout(): Promise<void> {
        try {
            await api.post({
                url: '/api/auth/logout',
            });
        } catch (error) {
            console.error('[AuthService] Logout failed:', error);
            // 即使API调用失败，也不阻止本地登出
        }
    }

    /**
     * 修改密码
     * @param params 修改密码参数
     */
    static async changePassword(params: {
        oldPassword: string;
        newPassword: string;
    }): Promise<void> {
        try {
            await api.post({
                url: '/api/user/change-password',
                data: params,
            });
        } catch (error) {
            console.error('[AuthService] Change password failed:', error);
            throw error;
        }
    }
}

/**
 * 模拟API服务 (开发时使用)
 */
export class MockAuthService {
    /**
     * 模拟登录
     */
    static async login(params: LoginParams): Promise<LoginResponse> {
        // 模拟网络延迟
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        const { username, password } = params;

        // 预设的用户数据
        const users = {
            admin: {
                id: '1',
                username: 'admin',
                account: 'admin',
                email: 'admin@example.com',
                avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
                roles: ['admin', 'super'],
                permissions: mockRouteTree,
            },
            user: {
                id: '2',
                username: 'user',
                account: 'user',
                email: 'user@example.com',
                avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
                roles: ['user'],
                permissions: mockRouteTree,
            },
            demo: {
                id: '3',
                username: 'demo',
                account: 'demo',
                email: 'demo@example.com',
                avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
                roles: ['guest'],
                permissions: mockRouteTree,
            },
        };

        // 验证用户名和密码
        if (password === '123456' && username in users) {
            const userInfo = users[username as keyof typeof users];
            return {
                token: `mock-token-${username}-${Date.now()}`,
                refreshToken: `mock-refresh-token-${username}-${Date.now()}`,
                userInfo,
            };
        }

        // 登录失败
        throw new Error('用户名或密码错误');
    }

    /**
     * 模拟获取用户信息
     */
    static async getUserInfo(): Promise<UserInfo> {
        // 模拟网络延迟
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        // 从localStorage获取当前用户信息
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                if (parsed.state?.userInfo) {
                    return parsed.state.userInfo;
                }
            } catch (error) {
                console.error('Failed to parse auth storage:', error);
            }
        }

        throw new Error('用户信息获取失败');
    }

    /**
     * 模拟刷新Token
     */
    static async refreshToken(
        refreshToken: string,
    ): Promise<{ token: string; refreshToken?: string }> {
        // 模拟网络延迟
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        if (refreshToken.startsWith('mock-refresh-token-')) {
            return {
                token: `mock-token-refreshed-${Date.now()}`,
                refreshToken: `mock-refresh-token-refreshed-${Date.now()}`,
            };
        }

        throw new Error('刷新令牌无效');
    }

    /**
     * 模拟退出登录
     */
    static async logout(): Promise<void> {
        // 模拟网络延迟
        await new Promise((resolve) => {
            setTimeout(resolve, 300);
        });
        console.log('[MockAuth] Logout successful');
    }
}

// 根据环境选择使用模拟API或真实API
const isDevelopment = import.meta.env.DEV;

export const authApi = isDevelopment ? MockAuthService : AuthService;
