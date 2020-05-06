/**
 * 显示正在读取
 */
export declare function loading(msg?: string): void;
/**
 * 清空正在读取
 */
export declare function clearLoading(): void;
/**
 * 中间灰底白字提示
 */
export declare function msg(message: string): void;
/**
 * 弹出输入框
 * @param title 输入框标题
 * @param defValue 默认值
 */
export declare function prompt(title?: string, defValue?: string): Promise<string>;
/**
 * 弹出提示框
 * @param content 提示框内容
 */
export declare function alert(content: string): void;
/**
 * 弹出错误框
 * @param content 错误的提示内容
 */
export declare function error(content: string): void;
/**
 * 弹出确认框
 * @param content 需要确认的文字内容
 */
export declare function confirm(content: string): Promise<void>;
/**
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export declare function msgError(content: string): void;
/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export declare function msgSuccess(content: string): void;
/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export declare function msgInfo(content: string): void;
