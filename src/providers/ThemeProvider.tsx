import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { PageAgent } from 'page-agent';

import { lightTheme, darkTheme } from '@/config';
import { usePageAgent } from '@/hooks/usePageAgent';

// 主题上下文
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    pageAgent: PageAgent | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const useContextPageAgent = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useContextPageAgent must be used within a ThemeProvider');
    }
    return context.pageAgent;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    // 初始化主题
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        // 同时切换 html 和 body 的 dark 类
        document.documentElement.classList.toggle('dark', shouldBeDark);
        document.body.classList.toggle('dark', shouldBeDark);
    }, []);

    const pageAgent = usePageAgent();

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        // 同时切换 html 和 body 的 dark 类
        document.documentElement.classList.toggle('dark', newIsDark);
        document.body.classList.toggle('dark', newIsDark);
    };

    const contextValue = useMemo(() => ({ isDark, toggleTheme, pageAgent }), [isDark, toggleTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <ConfigProvider
                theme={isDark ? darkTheme : lightTheme}
                locale={zhCN}
                componentSize="middle"
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
