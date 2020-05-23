import { CtlGrid } from './CtlGrid';
import { YvEvent } from './YvanEvent';
import { YvanDataSourceGrid } from './YvanDataSourceGridImp';
export interface CtlGridColumn {
    hidden: boolean;
    field: string;
    title: string;
    width: number;
    maxwidth: number;
    minwidth: number;
    align: 'right' | 'left' | 'center';
    sortable: boolean;
    resizable: boolean;
    editable: boolean;
    filterable: boolean;
    calcExpr: string;
    editMode: 'search' | 'checkbox' | 'number' | 'combo' | 'text' | 'area' | 'date' | 'datetime';
}
export declare type GridDataSource = undefined | GridDataSourceServer | GridDataSourceAjax | GridDataSourceStatic | GridDataSourceSql | GridDataSourceStaticFunction | Array<any>;
export declare type GridDataSourceSave = undefined | GridDataSourceSaveStatic | GridDataSourceSaveStaticFunction;
export interface WatchParam {
    $watch: string;
}
export interface GetParam {
    $get: string;
}
export interface GridDataSourceServer {
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
    /**
     * 执行前, 检查是否需要请求服务器
     */
    onBefore: YvEvent<YvanDataSourceGrid, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter: YvEvent<YvanDataSourceGrid, any>;
}
export interface GridDataSourceAjax {
    type: 'Ajax';
    /**
     * 请求地址
     */
    url: string;
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
    /**
     * 执行前, 检查是否需要请求服务器
     */
    onBefore: YvEvent<YvanDataSourceGrid, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter: YvEvent<YvanDataSourceGrid, any>;
}
export interface GridDataSourceSql {
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
    /**
     * 执行前, 检查是否需要请求服务器
     */
    onBefore: YvEvent<YvanDataSourceGrid, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter: YvEvent<YvanDataSourceGrid, any>;
}
export interface GridDataSourceStatic {
    type: 'function';
    /**
     * 自定义参数
     * 参数中允许以下三种形式
     * params:{
     *      f1: 123,
     *      f2: 'abc',
     *      f3: { $get: 'dsMain.f1' },
     *      f4: { $watch: 'dsMain.f2' }
     * }
     */
    params?: {
        [name: string]: string | number | WatchParam | GetParam;
    };
    /**
     * 指向方法
     * :GridDataSourceStaticFunction
     * gridDataSource(sender: YvanUI.CtlGrid, params: YvanUI.GridDataSourceStaticFunctionParam)
     */
    bind: string | GridDataSourceStaticFunction;
    /**
     * 执行前, 检查是否需要请求服务器, 如果返回 false 代表取消请求
     */
    onBefore: YvEvent<YvanDataSourceGrid, any>;
    /**
     * 执行后, 更改服务器返回的数据结构
     */
    onAfter: YvEvent<YvanDataSourceGrid, any>;
    /**
     * 保存方法
     */
    save?: GridDataSourceSave;
}
export interface GridDataSourceSaveStatic {
    type: 'function';
    bind: string;
}
export declare type GridDataSourceSaveStaticFunction = (sender: CtlGrid, params: GridDataSourceSaveStaticFunctionParam) => void;
/**
 * 数据源获取参数
 */
export interface GridDataSourceStaticFunctionParam {
    /**
     * dataSource 中 params 的计算结果
     */
    param: any;
    /**
     * 数据异步获取完成之后的回调
     * @param data 数据
     * @param dataLength 总数据长度
     */
    successCallback(data: any[], dataLength: number | undefined): void;
    /**
     * 数据异步获取错误后的回调
     */
    failCallback(): void;
}
/**
 * 数据源保存参数
 */
export interface GridDataSourceSaveStaticFunctionParam {
    /**
     * 数据异步获取完成之后的回调
     */
    success(): void;
}
export declare type GridDataSourceStaticFunction = (sender: CtlGrid, params: GridDataSourceStaticFunctionParam) => void;
