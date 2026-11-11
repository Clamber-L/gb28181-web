import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { lightTheme, darkTheme } from '@/config';

// 主题上下文
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
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
        document.documentElement.classList.toggle('dark', shouldBeDark);
        document.body.classList.toggle('dark', shouldBeDark);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newIsDark);
        document.body.classList.toggle('dark', newIsDark);
    };

    const contextValue = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

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
