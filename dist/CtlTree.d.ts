import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
import { DataSource } from './YvanDataSource';
export declare class CtlTree extends CtlBase<CtlTree> {
    static create(module: any, vjson: any): CtlTree;
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
    onNodeClick?: YvEvent<CtlTree, any>;
    /**
     * 树节点被双击后触发
     */
    onNodeDblClick?: YvEvent<CtlTree, any>;
    /**
     * 数据绑定完成后触发
     */
    onDataComplete?: YvEvent<CtlTree, any>;
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
    get dataSource(): DataSource<CtlTree>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlTree>);
    /**
     * 重新请求数据
     */
    reload(): void;
    /**
     * 获取第一个节点
     */
    getFirstId(): any;
    /**
     * 展开某个节点
     */
    open(id: any): void;
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
     * 获取被选中的一行编号
     */
    getSelectedId(): any;
    /**
     * 获取被选中的一行
     */
    getSelectedItem(): any;
    /**
     * 勾选选中一行
     */
    checkItem(id: any): void;
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
     * 获取选中的ID 数组
     */
    getCheckedIds(): any;
    /**
     * 获取选中的行数组
     */
    getCheckedItems(): any[];
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
    private _dataSource;
    private dataSourceBind?;
    private _rebindDataSource;
    private _dataSourceProcess;
    protected refreshState(): void;
}
