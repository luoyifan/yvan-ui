import { GetParam, WatchParam } from './YvanDataSourceGrid';
import { YvEvent } from './YvanEvent';
export interface DataSourceParam {
    /**
     * 数据异步获取完成之后的回调
     * @param data 数据
     */
    successCallback(data: any[]): void;
    /**
     * 数据异步获取错误后的回调
     */
    failCallback(): void;
}
export declare type DataSourceStaticFunction<T> = (sender: T, option: DataSourceParam) => void;
export declare type DataSourceProcessFunction = (data: any[]) => any;
export declare type DataSource<T> = undefined | any[] | DataSourceDb<T> | DataSourceServer<T> | DataSourceStaticFunction<T> | DataSourceFunctionBind<T>;
export interface DataSourceFunctionBind<T> {
    type: 'function';
    /**
     * 指向方法
     * :DataSourceStaticFunction
     * treeDataSource(sender: YvanUI.CtlTree, params: YvanUI.DataSourceParam)
     */
    bind: string | DataSourceStaticFunction<T>;
    /**
     * 关注实体变化
     */
    watch?: string[];
    /**
     * 执行前, 检查是否需要请求服务器, 如果返回 false 代表取消请求
     */
    onBefore?: YvEvent<T, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter?: YvEvent<T, any>;
    displayField: string;
    valueField: string;
    parentField: string;
    idField: string;
}
export interface DataSourceServer<T> {
    type: 'Server';
    /**
     * 方法名
     */
    method: string;
    /**
     * 自定义参数
     * 参数中允许以下三种形式
     * params:{
     *   f1: 123,
     *   f2: 'abc',
     *   f3: { $get: 'dsMain.f1' },
     *   f4: { $watch: 'dsMain.f2' }
     *
     * 参数也可以写成对象形式
     *   'query.f1': 123,
     *   'query.f2': 'abc',
     *   'query.f3': { $get: 'dsMain.f1' },
     *   'query.f4': { $watch: 'dsMain.f2' }
     * }
     */
    params?: {
        [name: string]: string | number | WatchParam | GetParam;
    };
    watch?: string[];
    displayField: string;
    valueField: string;
    parentField: string;
    idField: string;
    /**
     * 执行前, 检查是否需要请求服务器, 如果返回 false 代表取消请求
     */
    onBefore?: YvEvent<T, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter?: YvEvent<T, any>;
}
export interface DataSourceDb<T> {
    type: 'SQL';
    /**
     * 数据库
     */
    db: string;
    /**
     * SQL 名
     */
    sqlId: string;
    /**
     * 关注实体变化
     */
    watch?: string[];
    /**
     * 自定义参数
     * 参数中允许以下三种形式
     * params:{
     *   f1: 123,
     *   f2: 'abc',
     *   f3: { $get: 'dsMain.f1' },
     *   f4: { $watch: 'dsMain.f2' }
     *
     * 参数也可以写成对象形式
     *   'query.f1': 123,
     *   'query.f2': 'abc',
     *   'query.f3': { $get: 'dsMain.f1' },
     *   'query.f4': { $watch: 'dsMain.f2' }
     * }
     */
    params?: {
        [name: string]: string | number | WatchParam | GetParam;
    };
    displayField: string;
    valueField: string;
    parentField: string;
    idField: string;
    /**
     * 执行前, 检查是否需要请求服务器, 如果返回 false 代表取消请求
     */
    onBefore?: YvEvent<T, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter?: YvEvent<T, any>;
}
