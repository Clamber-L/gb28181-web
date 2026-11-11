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
}
