import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
import { DataSource } from './YvanDataSource';
export declare class CtlDatatable extends CtlBase<CtlDatatable> {
    static create(module: any, vjson: any): CtlDatatable;
    /**
     * 树上的数据
     */
    data?: any[];
    /**
     * 树节点被点击后触发
     */
    onItemSelect?: YvEvent<CtlDatatable, any>;
    /**
     * 树节点被点击后触发
     */
    onItemClick?: YvEvent<CtlDatatable, any>;
    /**
     * 树节点被双击后触发
     */
    onItemDblClick?: YvEvent<CtlDatatable, any>;
    /**
     * 数据绑定完成后触发
     */
    onDataComplete?: YvEvent<CtlDatatable, any>;
    /**
     * 设置值
     */
    set value(nv: any);
    /**
     * 获取值
     */
    get value(): any;
    /**
     * 设置数据
     */
    set dataReal(nv: any[]);
    /**
     * 获取数据源设置
     */
    get dataSource(): DataSource<CtlDatatable>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlDatatable>);
    /**
     * 重新请求数据
     */
    reload(): void;
    filter(func: Function): void;
    private _dataSource;
    private dataSourceBind?;
    private _rebindDataSource;
    private _dataSourceProcess;
    protected refreshState(): void;
}
