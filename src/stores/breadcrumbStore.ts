import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BreadcrumbItem {
    key: string;
    title: string;
    path: string;
    icon?: string;
    closable?: boolean;
}

interface BreadcrumbState {
    // 历史记录面包屑列表
    breadcrumbHistory: BreadcrumbItem[];
    // 当前激活的面包屑
    activeKey: string;

    // Actions
    addBreadcrumb: (item: BreadcrumbItem) => void;
    removeBreadcrumb: (key: string) => void;
    setActiveBreadcrumb: (key: string) => void;
    clearAllBreadcrumbs: () => void;
    removeOtherBreadcrumbs: (key: string) => void;
}

export const breadcrumbStore = create<BreadcrumbState>()(
    persist(
        (set, get) => ({
            breadcrumbHistory: [
                {
                    key: '/dashboard/dashboard-console',
                    title: '工作台',
                    path: '/dashboard/dashboard-console',
                    icon: 'HomeOutlined',
                    closable: false, // 首页不可关闭
                },
            ],
            activeKey: '/dashboard/dashboard-console',

            // 添加面包屑项（保留历史记录）
            addBreadcrumb: (item: BreadcrumbItem) => {
                const { breadcrumbHistory } = get();

                // 检查是否已存在
                const existingIndex = breadcrumbHistory.findIndex(
                    (breadcrumb) => breadcrumb.key === item.key,
                );
                if (existingIndex !== -1) {
                    // 如果已存在，只需要设置为激活状态
                    set({ activeKey: item.key });
                    return;
                }

                // 过滤掉顶级父级页面，只保留二级以下的页面
                const pathSegments = item.path.split('/').filter((segment) => segment.length > 0);
                if (pathSegments.length <= 1) {
                    // 如果是一级页面（顶级父级），不添加到面包屑中
                    return;
                }

                // 添加新的面包屑项
                const newHistory = [...breadcrumbHistory, { ...item, closable: true }];

                set({
                    breadcrumbHistory: newHistory,
                    activeKey: item.key,
                });
            },

            // 移除面包屑（保留历史记录）
            removeBreadcrumb: (key: string) => {
                const { breadcrumbHistory, activeKey } = get();

                // 不允许删除首页
                if (key === '/dashboard/dashboard-console') {
                    return;
                }

                const newHistory = breadcrumbHistory.filter((item) => item.key !== key);

                // 如果删除的是当前激活的，需要跳转到其他页面
                let newActiveKey = activeKey;
                if (activeKey === key) {
                    // 优先跳转到最后一个面包屑，如果没有则跳转到首页
                    newActiveKey =
                        newHistory.length > 1
                            ? newHistory[newHistory.length - 1].key
                            : '/dashboard/dashboard-console';
                }

                set({
                    breadcrumbHistory: newHistory,
                    activeKey: newActiveKey,
                });

                // 如果删除的是当前页面，需要导航到新的激活页面
                if (activeKey === key && typeof window !== 'undefined') {
                    window.dispatchEvent(
                        new CustomEvent('breadcrumb-navigate', {
                            detail: { path: newActiveKey },
                        }),
                    );
                }
            },

            // 设置激活的面包屑
            setActiveBreadcrumb: (key: string) => {
                set({ activeKey: key });
            },

            // 清除所有面包屑（保留首页）
            clearAllBreadcrumbs: () => {
                const homeItem = {
                    key: '/dashboard/dashboard-console',
                    title: '工作台',
                    path: '/dashboard/dashboard-console',
                    icon: 'HomeOutlined',
                    closable: false,
                };

                set({
                    breadcrumbHistory: [homeItem],
                    activeKey: '/dashboard/dashboard-console',
                });

                // 触发导航事件跳转到首页
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                        new CustomEvent('breadcrumb-navigate', {
                            detail: { path: '/dashboard/dashboard-console' },
                        }),
                    );
                }
            },

            // 移除其他面包屑（保留当前和首页）
            removeOtherBreadcrumbs: (key: string) => {
                const { breadcrumbHistory } = get();

                // 不允许删除首页
                if (key === '/dashboard/dashboard-console') {
                    return;
                }

                const currentItem = breadcrumbHistory.find((item) => item.key === key);
                const homeItem = breadcrumbHistory.find(
                    (item) => item.key === '/dashboard/dashboard-console',
                );

                const newHistory = [homeItem, currentItem].filter(Boolean) as BreadcrumbItem[];

                set({
                    breadcrumbHistory: newHistory,
                    activeKey: key,
                });
            },
        }),
        {
            name: 'breadcrumb-history-storage',
            partialize: (state) => ({
                breadcrumbHistory: state.breadcrumbHistory,
                activeKey: state.activeKey,
            }),
        },
    ),
);

// 导出选择器hook
export const useBreadcrumb = () => {
    const store = breadcrumbStore();
    return {
        breadcrumbHistory: store.breadcrumbHistory,
        activeKey: store.activeKey,
        addBreadcrumb: store.addBreadcrumb,
        removeBreadcrumb: store.removeBreadcrumb,
        setActiveBreadcrumb: store.setActiveBreadcrumb,
        clearAllBreadcrumbs: store.clearAllBreadcrumbs,
        removeOtherBreadcrumbs: store.removeOtherBreadcrumbs,
    };
};
