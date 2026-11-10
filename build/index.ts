import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { getPlugins } from './plugins';

import { Configure } from './types';
import { pathResolve } from './utils';

export * from './types';
export * from './utils';

export const getConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
            plugins: getPlugins(isBuild),
            server: {
                port: 3000, // 开发环境启动的端口
                host: '0.0.0.0',
                open: true, // 项目启动时自动打开浏览器
            },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
