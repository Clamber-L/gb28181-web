/**
 * HTTP 状态码常量
 */
export enum ApiStatus {
    success = 200, // 成功
    created = 201, // 创建成功
    accepted = 202, // 已接受
    noContent = 204, // 无内容
    badRequest = 400, // 请求错误
    unauthorized = 401, // 未授权
    forbidden = 403, // 禁止访问
    notFound = 404, // 未找到
    methodNotAllowed = 405, // 方法不允许
    requestTimeout = 408, // 请求超时
    conflict = 409, // 冲突
    unprocessableEntity = 422, // 无法处理的实体
    tooManyRequests = 429, // 请求过多
    internalServerError = 500, // 服务器错误
    notImplemented = 501, // 未实现
    badGateway = 502, // 网关错误
    serviceUnavailable = 503, // 服务不可用
    gatewayTimeout = 504, // 网关超时
    httpVersionNotSupported = 505, // HTTP版本不支持
}

/**
 * 业务状态码
 */
export enum BusinessStatus {
    SUCCESS = 0, // 业务成功
    FAILED = 1, // 业务失败
    UNAUTHORIZED = 401, // 未授权
    FORBIDDEN = 403, // 禁止访问
    NOT_FOUND = 404, // 资源不存在
    VALIDATION_ERROR = 422, // 验证错误
    SERVER_ERROR = 500, // 服务器错误
}

/**
 * 获取状态码描述
 */
export const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
        [ApiStatus.success]: '请求成功',
        [ApiStatus.created]: '创建成功',
        [ApiStatus.accepted]: '请求已接受',
        [ApiStatus.noContent]: '无内容',
        [ApiStatus.badRequest]: '请求参数错误',
        [ApiStatus.unauthorized]: '用户未登录或登录已过期',
        [ApiStatus.forbidden]: '没有权限访问该资源',
        [ApiStatus.notFound]: '请求的资源不存在',
        [ApiStatus.methodNotAllowed]: '请求方法不被允许',
        [ApiStatus.requestTimeout]: '请求超时',
        [ApiStatus.conflict]: '请求冲突',
        [ApiStatus.unprocessableEntity]: '请求参数验证失败',
        [ApiStatus.tooManyRequests]: '请求过于频繁，请稍后再试',
        [ApiStatus.internalServerError]: '服务器内部错误',
        [ApiStatus.notImplemented]: '功能未实现',
        [ApiStatus.badGateway]: '网关错误',
        [ApiStatus.serviceUnavailable]: '服务暂时不可用',
        [ApiStatus.gatewayTimeout]: '网关超时',
        [ApiStatus.httpVersionNotSupported]: 'HTTP版本不支持',
    };

    return statusMap[status] || '未知错误';
};
