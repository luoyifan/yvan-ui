import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
import { DataSource } from './YvanDataSource';
export declare class CtlSidebar extends CtlBase<CtlSidebar> {
    static create(module: any, vjson: any): CtlSidebar;
    /**
     * 拼音方式过滤查找树
     */
    filter(nv: string): void;
    /**
     * 树上的数据
     */
    data?: any[];
    /**
     * 树节点被点击后触发
     */
    onNodeClick?: YvEvent<CtlSidebar, any>;
    /**
     * 树节点被双击后触发
     */
    onNodeDblClick?: YvEvent<CtlSidebar, any>;
    /**
     * 数据绑定完成后触发
     */
    onDataComplete?: YvEvent<CtlSidebar, any>;
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
    get dataSource(): DataSource<CtlSidebar>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlSidebar>);
    /**
     * 重新请求数据
     */
    reload(): void;
    /**
     * 展开或收起状态互换
     */
    toggle(): void;
    /**
     * 是否折叠状态
     */
    isCollapsed(): boolean;
    private _dataSource;
    private dataSourceBind?;
    private _rebindDataSource;
    private _dataSourceProcess;
    protected refreshState(): void;
}
