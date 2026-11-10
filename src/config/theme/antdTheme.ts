import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

// Art Design Pro 颜色配置
export const artColors = {
    primary: '#5d87ff', // --art-primary: 93, 135, 255
    secondary: '#49beff', // --art-secondary: 73, 190, 255
    success: '#13deb9', // --art-success: 19, 222, 185
    warning: '#ffae1f', // --art-warning: 255, 174, 31
    error: '#fa896b', // --art-error: 250, 137, 107
    info: '#6b7d9b', // --art-info: 107, 125, 155
    danger: '#ff4d4f', // --art-danger: 255, 77, 79

    // 灰度颜色
    gray100: '#f9f9f9',
    gray200: '#f1f1f4',
    gray300: '#dbdfe9',
    gray400: '#c4cada',
    gray500: '#99a1b7',
    gray600: '#78829d',
    gray700: '#4b5675',
    gray800: '#252f4a',
    gray900: '#071437',

    // 背景色
    bgColor: '#fafbfc',
    mainBgColor: '#ffffff',
    borderColor: '#eaebf1',
};

// 浅色主题配置
export const lightTheme: ThemeConfig = {
    algorithm: defaultAlgorithm,
    token: {
        // 主色
        colorPrimary: artColors.primary,
        colorSuccess: artColors.success,
        colorWarning: artColors.warning,
        colorError: artColors.error,
        colorInfo: artColors.info,

        // 背景色
        colorBgContainer: artColors.mainBgColor,
        colorBgLayout: artColors.bgColor,
        colorBgElevated: artColors.mainBgColor,

        // 边框
        colorBorder: artColors.borderColor,
        colorBorderSecondary: artColors.gray300,

        // 文字
        colorText: artColors.gray900,
        colorTextSecondary: artColors.gray600,
        colorTextTertiary: artColors.gray500,
        colorTextQuaternary: artColors.gray400,

        // 字体
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontSizeHeading4: 20,
        fontSizeHeading5: 16,

        // 圆角
        borderRadius: 6,
        borderRadiusLG: 8,
        borderRadiusSM: 4,
        borderRadiusXS: 2,

        // 间距
        padding: 16,
        paddingLG: 24,
        paddingSM: 12,
        paddingXS: 8,
        paddingXXS: 4,

        // 阴影
        boxShadow:
            '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        boxShadowSecondary:
            '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

        // 线条高度
        lineHeight: 1.5715,
        lineHeightLG: 1.5,
        lineHeightSM: 1.66,

        // 动画
        motionDurationSlow: '0.3s',
        motionDurationMid: '0.2s',
        motionDurationFast: '0.1s',
    },
    components: {
        Button: {
            colorPrimary: artColors.primary,
            algorithm: true,
            borderRadius: 6,
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
        },
        Input: {
            borderRadius: 6,
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
        },
        Card: {
            borderRadiusLG: 8,
            paddingLG: 24,
            boxShadowTertiary:
                '0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02)',
            // 为浅色模式添加明显边框
            colorBorderSecondary: '#e5e7eb',
        },
        Table: {
            borderRadius: 6,
            headerBg: artColors.gray100,
            headerColor: artColors.gray700,
            rowHoverBg: artColors.gray100,
        },
        Menu: {
            itemBorderRadius: 6,
            subMenuItemBorderRadius: 6,
        },
        Modal: {
            borderRadiusLG: 8,
        },
        Drawer: {
            borderRadiusLG: 8,
        },
        Tabs: {
            borderRadius: 6,
        },
        Select: {
            borderRadius: 6,
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
        },
        DatePicker: {
            borderRadius: 6,
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
        },
        Form: {
            itemMarginBottom: 16,
            verticalLabelPadding: '0 0 8px',
        },
    },
};

// 暗色主题配置
export const darkTheme: ThemeConfig = {
    algorithm: darkAlgorithm,
    token: {
        ...lightTheme.token,
        // 背景色调整为更深的黑色
        colorBgContainer: '#0f0f0f',
        colorBgLayout: '#050505',
        colorBgElevated: '#1a1a1a',

        // 文字颜色调整
        colorText: '#f0f0f0',
        colorTextSecondary: '#9a9ca8',
        colorTextTertiary: '#75777e',
        colorTextQuaternary: '#5a5c63',

        // 边框颜色调整为更深的灰色
        colorBorder: '#2a2a2a',
        colorBorderSecondary: '#333333',
    },
    components: {
        ...lightTheme.components,
        Table: {
            ...lightTheme.components?.Table,
            headerBg: '#1a1a1a',
            headerColor: '#9a9ca8',
            rowHoverBg: '#2a2a2a',
        },
        Card: {
            ...lightTheme.components?.Card,
            // 为暗色模式添加边框
            colorBorderSecondary: '#333333',
        },
    },
};

// 默认导出浅色主题
export default lightTheme;
