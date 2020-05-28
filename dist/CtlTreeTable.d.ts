import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
import { DataSource } from './YvanDataSource';
export declare class CtlTreeTable extends CtlBase<CtlTreeTable> {
    static create(module: any, vjson: any): CtlTreeTable;
    /**
     * 树上的数据
     */
    data?: any[];
    /**
     * 树节点被点击后触发
     */
    onNodeClick?: YvEvent<CtlTreeTable, any>;
    /**
     * 树节点被双击后触发
     */
    onNodeDblClick?: YvEvent<CtlTreeTable, any>;
    /**
     * 显示勾选框
     */
    showCheckbox: boolean;
    /**
     * 显示左侧展开图标
     */
    showLeftIcon: boolean;
    /**
     * 显示图标
     */
    showIcon: boolean;
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
    get dataSource(): DataSource<CtlTreeTable>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlTreeTable>);
    /**
     * 重新请求数据
     */
    reload(): void;
    /**
     * 清空所有数据
     */
    clear(): void;
    /**
     * 取消选择所有节点
     */
    uncheckAll(): void;
    /**
     * 根据id获取一行数据
     */
    getItem(id: any): any;
    /**
     * 获取某 id 下树节点所有的子节点
     */
    getChildItems(id: any): any[];
    /**
     * 获取某 id 下树节点所有的子节点的编号
     */
    getChildIds(id: any): any[];
    /**
     * 勾选选中一行
     */
    checkItem(id: any): void;
    /**
     * 获取被选中的一行编号
     */
    getSelectedId(): any;
    /**
     * 获取被选中的一行
     */
    getSelectedItem(): any;
    /**
     * 选中一行
     * @param id
     */
    select(id: any): void;
    /**
     * 选中多行
     */
    checkItems(ids: any[]): void;
    /**
     * 取消选中一行
     */
    uncheckItem(id: any): void;
    /**
     * 获取选中的行
     */
    getChecked(): any;
    /**
     * 查看是否被选中
     */
    isChecked(id: any): any;
    /**
     * 展开全部节点
     */
    expandAll(): void;
    /**
     * 收起所有节点
     */
    collapseAll(): void;
    /**
     * 过滤, 如果不设置 condition 代表不过滤，否则带入过滤函数
     */
    filter(condition?: (v: any) => boolean): void;
    private _dataSource;
    private dataSourceBind?;
    private _rebindDataSource;
    private _dataSourceProcess;
    protected refreshState(): void;
}
