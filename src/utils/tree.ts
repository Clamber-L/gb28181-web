// eslint-disable-next-line import/no-extraneous-dependencies
import { ascend, chain } from 'ramda';

import { MenuProps } from 'antd';

import { AppRouteObject } from '@/types/router';
import { getIcon } from '@/components/icon/icon';

export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
    return chain((node) => {
        const children = node.children || [];
        return [node, ...flattenTrees(children)];
    }, trees);
}

/**
 * return menu routes
 */
export const menuFilter = (items: AppRouteObject[]) => {
    return items
        .filter((item) => {
            const show = item.meta?.key;
            if (show && item.children) {
                item.children = menuFilter(item.children);
            }
            return show;
        })
        .sort(ascend((item) => item.sortValue || Infinity));
};

export const buildMenuItems = (menuItems: AppRouteObject[]): MenuProps['items'] => {
    return menuItems
        .filter((menuItem) => !menuItem?.meta?.hideMenu)
        .map((menuItem) => {
            const { meta, children, path } = menuItem;

            // 确保必要的属性存在
            if (!meta) return null;

            if (children && children.length > 0) {
                const childItems = buildMenuItems(children)?.filter(Boolean) || [];
                if (childItems.length === 0) return null;

                return {
                    key: path,
                    icon: meta?.icon ? getIcon(meta.icon as string) : undefined,
                    label: meta?.label,
                    children: childItems,
                };
            }

            // 对于叶子节点，使用 path 作为 key
            return {
                key: path,
                icon: meta?.icon ? getIcon(meta.icon as string) : undefined,
                label: meta?.label,
            };
        })
        .filter(Boolean) as MenuProps['items'];
};
