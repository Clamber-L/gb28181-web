export const getItem = <T>(key: string): T | null => {
    let value = null;
    try {
        const result = localStorage.getItem(key);
        if (result) {
            value = JSON.parse(result);
        }
    } catch (e) {
        console.error(e);
    }
    return value;
};

export const setItem = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key: string) => {
    localStorage.removeItem(key);
};

// 提取 State 中的纯数据（去掉函数）
type ExtractState<T> = Omit<
    T,
    {
        [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
    }[keyof T]
>;

// 把状态变成可选
export type PartialState<T> = Partial<ExtractState<T>>;
