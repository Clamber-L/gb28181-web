import api from '@/lib/request';

import { PageParams, PageResponse } from '@/lib/types';

/**
 * 用户相关接口
 */

// 用户信息接口
export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    nickname?: string;
    phone?: string;
    status: number;
    createTime: string;
    updateTime: string;
}

// 登录请求参数
export interface LoginParams {
    username: string;
    password: string;
    captcha?: string;
}

// 登录响应数据
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
    permissions: string[];
}

// 注册请求参数
export interface RegisterParams {
    username: string;
    password: string;
    email: string;
    captcha: string;
}

// 用户查询参数
export interface UserQueryParams extends PageParams {
    username?: string;
    email?: string;
    status?: number;
}

/**
 * 用户API服务
 */
export const userApi = {
    /**
     * 用户登录
     */
    login: (params: LoginParams) => {
        return api.post<LoginResponse>({
            url: '/auth/login',
            data: params,
        });
    },

    /**
     * 用户注册
     */
    register: (params: RegisterParams) => {
        return api.post<User>({
            url: '/auth/register',
            data: params,
        });
    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser: () => {
        return api.get<User>({
            url: '/user/profile',
        });
    },

    /**
     * 更新用户信息
     */
    updateProfile: (data: Partial<User>) => {
        return api.put<User>({
            url: '/user/profile',
            data,
        });
    },

    /**
     * 修改密码
     */
    changePassword: (data: { oldPassword: string; newPassword: string }) => {
        return api.put<void>({
            url: '/user/password',
            data,
        });
    },

    /**
     * 获取用户列表（分页）
     */
    getUserList: (params: UserQueryParams) => {
        return api.get<PageResponse<User>>({
            url: '/users',
            params,
        });
    },

    /**
     * 获取用户详情
     */
    getUserById: (id: number) => {
        return api.get<User>({
            url: `/users/${id}`,
        });
    },

    /**
     * 创建用户
     */
    createUser: (data: Omit<User, 'id' | 'createTime' | 'updateTime'>) => {
        return api.post<User>({
            url: '/users',
            data,
        });
    },

    /**
     * 更新用户
     */
    updateUser: (id: number, data: Partial<User>) => {
        return api.put<User>({
            url: `/users/${id}`,
            data,
        });
    },

    /**
     * 删除用户
     */
    deleteUser: (id: number) => {
        return api.delete<void>({
            url: `/users/${id}`,
        });
    },

    /**
     * 批量删除用户
     */
    batchDeleteUsers: (ids: number[]) => {
        return api.delete<void>({
            url: '/users/batch',
            data: { ids },
        });
    },

    /**
     * 上传头像
     */
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        return api.post<{ url: string }>({
            url: '/user/avatar',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * 用户登出
     */
    logout: () => {
        return api.post<void>({
            url: '/auth/logout',
        });
    },

    /**
     * 刷新Token
     */
    refreshToken: (refreshToken: string) => {
        return api.post<{ token: string; refreshToken: string }>({
            url: '/auth/refresh',
            data: { refreshToken },
        });
    },

    /**
     * 发送验证码
     */
    sendCaptcha: (email: string) => {
        return api.post<void>({
            url: '/auth/captcha',
            data: { email },
        });
    },

    /**
     * 重置密码
     */
    resetPassword: (data: { email: string; captcha: string; newPassword: string }) => {
        return api.post<void>({
            url: '/auth/reset-password',
            data,
        });
    },
};
