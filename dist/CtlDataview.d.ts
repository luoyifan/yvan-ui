import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
import { DataSource } from './YvanDataSource';
export declare class CtlDataview extends CtlBase<CtlDataview> {
    static create(module: any, vjson: any): CtlDataview;
    /**
     * 树上的数据
     */
    data?: any[];
    /**
     * 树节点被点击后触发
     */
    onItemSelect?: YvEvent<CtlDataview, any>;
    /**
     * 树节点被点击后触发
     */
    onItemClick?: YvEvent<CtlDataview, any>;
    /**
     * 树节点被双击后触发
     */
    onItemDblClick?: YvEvent<CtlDataview, any>;
    /**
     * 数据绑定完成后触发
     */
    onDataComplete?: YvEvent<CtlDataview, any>;
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
    get dataSource(): DataSource<CtlDataview>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlDataview>);
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
