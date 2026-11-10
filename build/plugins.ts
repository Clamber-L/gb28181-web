import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';

export function getPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [
        react({
            jsxRuntime: 'automatic',
        }),
    ];
    return vitePlugins;
}
