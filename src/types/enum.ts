export enum StorageEnum {
    User = 'user',
    Token = 'token',
    Settings = 'settings',
}

export enum PermissionType {
    CATALOGUE = '10', // 字典值：资源类型-有子级的菜单
    MENU = '20', // 字典值：资源类型-无子级的菜单
    BUTTON = '60', // 字典值：资源类型-按钮（暂时空缺，只作为判断用）
}
