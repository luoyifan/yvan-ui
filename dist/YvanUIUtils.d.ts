/**
 * 获取页面 URL 问号之后的参数
 */
export declare function getQueryString(): any;
/**
 * 统一吧下划线（字符串/对象/数组）变成驼峰命名
 */
export declare function camelCase(obj: any): any;
/**
 * 统一吧驼峰（字符串/对象/数组）变成下划线
 */
export declare function snakeCase(obj: any): any;
/**
 * 将任意 planObject 对象，转换为 hash 描述
 */
export declare function param(obj: any): string;
/**
 * 将 hash 描述转换为 planObject 对象
 * @param s
 */
export declare function unparam(query: string): any;
