import 'reflect-metadata';
/**
 * 提取返回值类型
 */
export declare type RType<T> = T extends (...args: any[]) => infer R ? R : any;
/**
 * 提取返回值
 */
export declare type PType<T> = T extends (...args: infer P) => any ? P : never;
/**
 * 服务代理包装类型
 */
export declare type Broker<T> = {
    [KEY in keyof T]: T[KEY] extends Function ? (...args: PType<T[KEY]>) => Promise<RType<T[KEY]>> : never;
};
/**
 * 服务调用
 */
export declare function brokerInvoke(serverUrl: string, method: string, args: any): Promise<any>;
/**
 * 创建服务代理
 */
export declare function createBroker<T extends new (...args: any) => any>(serviceType: T): Broker<InstanceType<T>>;
