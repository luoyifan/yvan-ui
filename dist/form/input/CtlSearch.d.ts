import { YvEvent } from '../../YvanEvent';
import { CtlInput } from './CtlInput';
/**
 * search widget 接口配置
 */
interface WidgetOption {
    /**
     * 要弹出的 widget 窗口实例
     */
    content: any;
    /**
     * 默认要 子对话框带的参数
     */
    params: any;
    /**
     * 写会数据时所带的映射关系
     */
    bind?: {
        /**
         * 本模块的实体对象+属性名 = 弹出框附属的属性名
         */
        [name: string]: string;
    };
    /**
     * 读取数据时的回调
     */
    onLoadData?: YvEvent<CtlSearch, void>;
    /**
     * 回写时的回调
     */
    onConfirm?: YvEvent<CtlSearch, any>;
    /**
     * 清空时的回调
     */
    onClear?: YvEvent<CtlSearch, void>;
}
export declare class CtlSearch extends CtlInput<CtlSearch> {
    static create(module: any, vjson: any): CtlSearch;
    /**
     * 弹框配置
     */
    widget?: WidgetOption;
    /**
     * 清空值
     */
    clear(): void;
    get value(): string | undefined;
    set value(nv: string | undefined);
    _refreshIcon(): void;
    private valueOrigin?;
    private suppressRestore;
    /**
     * 进入查询框
     */
    _searchRequest(queryValue: any, restoreValue: any): void;
}
export {};
