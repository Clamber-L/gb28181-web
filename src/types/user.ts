import { PermissionType } from '@/types/enum';

export interface UserToken {
    accessToken?: string;
    refreshToken?: string;
}

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    account: string;
    avatar: string;
    roles: string[];
    permissions: Permission[] | [];
}

export interface Permission {
    id: string;
    parentId: string;
    name: string;
    label: string;
    path: string;
    sortValue: number;
    resourceType: PermissionType;
    frameSrc: string;
    icon?: string;
    component?: string;
    hide?: boolean;
    disabled: boolean;
    children?: Permission[];
}
