import { CtlGridPage } from './CtlGridPage';
import { CtlBase } from './CtlBase';
import { GridDataSource } from './YvanDataSourceGrid';
import { YvEvent } from './YvanEvent';
/**
 * 表格中的行按钮被点击后触发的事件参数
 */
export interface CtlGridRowButtonClickArgs {
    /**
     * 行数据
     */
    data: any;
    /**
     * 行序号
     */
    rowIndex: number;
    /**
     * 列名称
     */
    colId: string;
}
export declare class CtlGrid extends CtlBase<CtlGrid> {
    static create(module: any, vjson: any): CtlGrid;
    gridApi: any;
    columnApi: any;
    get webix(): any;
    /**
     * 设置数据源
     */
    set dataSource(nv: GridDataSource);
    /**
     * 获取数据源
     */
    get dataSource(): GridDataSource;
    /**
     * 初始化时的数据
     */
    readonly data?: any[];
    /**
     * 是否允许编辑
     */
    readonly editable: boolean;
    /**
     * 允许勾选
     */
    readonly checkbox: boolean;
    /**
     * 单击后立刻进入编辑
     */
    readonly editSingleClick: boolean;
    /**
     * 允许添加
     */
    readonly allowNewRow: boolean;
    /**
     * 允许过滤
     */
    readonly filterable: boolean;
    /**
     * 显示序号
     */
    readonly showRowNumber: boolean;
    /**
     * 自动调整列宽
     */
    readonly autoSizeColumns: boolean;
    /**
     * 单元格选中模式
     */
    readonly allowCellSelection: boolean;
    /**
     * 行选中模式
     */
    readonly allowRowSelection: boolean;
    /**
     * ID字段
     */
    readonly idField: string;
    /**
     * 值分隔符
     */
    readonly valueSep: string;
    /**
     * 保存时机(换行时/编辑完后)
     */
    readonly saveOn: 'editFinish' | 'rowChanged';
    /**
     * 新添加行时，初始化的数据
     */
    readonly newRowData: any;
    /**
     * 失去焦点后立刻结束编辑
     */
    readonly stopEditingWhenGridLosesFocus: boolean;
    /**
     * 列定义
     */
    readonly columns: any[] | undefined;
    /**
     * 二纬表头
     */
    readonly columnGroup: any[] | undefined;
    /**
     * 是否自动读取数据
     */
    readonly autoLoad: boolean;
    /**
     * 是否分页
     */
    readonly pagination: boolean;
    /**
     * 分页大小
     */
    readonly pageSize: number;
    gridPage: CtlGridPage;
    /**
     * 行被选中后触发
     */
    onRowSelect?: YvEvent<CtlGrid, any>;
    /**
     * 行被双击后触发
     */
    onRowDblClick?: YvEvent<CtlGrid, any>;
    /**
     * 勾选项改变后触发
     */
    onCheckedChange?: YvEvent<CtlGrid, any>;
    /**
     * 数据绑定完毕后触发
     */
    onBindingComplete?: YvEvent<CtlGrid, any>;
    /**
     * 焦点单元格发生变化后触发
     */
    onCellFocused?: YvEvent<CtlGrid, any>;
    /**
     * 单元格被点击后触发
     */
    onCellClicked?: YvEvent<CtlGrid, any>;
    /**
     * 第一行有效数据被渲染后触发
     */
    onFirstDataRendered?: YvEvent<CtlGrid, any>;
    /**
     * 按下键后触发
     */
    onKeyDown?: YvEvent<CtlGrid, any>;
    /**
     * 获取被勾选的行ID集合
     */
    checkedIds: any[];
    /**
     * 选择一个指定行
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    selectRow(condition: GridSelectCondition): boolean;
    /**
     * 闪烁指定行
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    flashRow(condition: any): boolean;
    /**
     * 闪烁指定单元格
     * @param cols 列数组
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    flashCell(cols: any, condition: any): boolean;
    /**
     * 获取全部数据
     */
    getData(): any[] | undefined;
    /**
     * 为表格设置数据
     * 注意，调用此方法，必须在初始化时，给一个空的 data: [] 属性
     * 确保表格 rowModelType:clientSide 模式
     */
    setData(nv: any[] | undefined): void;
    /**
     * 无感刷新
     * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
     *
     * option:
     *   clearFilter=true 是否清空筛选
     */
    reload(option?: any): void;
    /**
     * 获取被选中的行主键
     */
    getSelectedId(): any;
    /**
     * 设置勾选的数据行集合
     */
    setCheckedIds(ids: Array<any>): void;
    /**
     * 获取被勾选的所有行
     */
    getCheckedRows(): any[];
    /**
     * 获取被选中的行数据
     */
    getSelectedRow(): any;
    /**
     * 获取被选中的行数据(多选情况下回返回多行数据)
     */
    getSelectedRows(): any[];
    /**
     * 显示正在读取的状态
     */
    set loading(newValue: boolean);
    paginationSetPageSize(size: number): void;
    /** 设置行号, 兼容分页 **/
    private setRowId;
    private isGridReadReady;
    private dataSourceBind?;
    private _gridOptions;
    private _gridReady;
    private _resetGrid;
    _rowDoubleClicked(e: any): void;
    /**
     * 获取下拉框的数据选项
     */
    _getComboFilterData(easyuiCol: any): any;
    /**
     * 第一次数据被渲染之后
     */
    _firstDataRendered(): void;
    /**
     * 接受更新
     * 状态位显示 OK, 删除 origin 数据, 并闪烁当前行
     */
    _acceptChanges(node: any): void;
    /**
     * 清空所有状态，准备获取新数据
     * 当前编辑都应该清空, 勾选也应该清空
     */
    _clearCache(): void;
    /**
     * 根据行，获取主键 ID, 当主键不存在时 返回 undefined
     */
    _getIdByRow(row: any): any;
    /**
     * 重新绑定数据源
     */
    _rebindDataSource(): void;
    /**
     * 每次 AJAX 请求完毕之后会回调这里
     */
    _bindingComplete(): void;
    /**
     * 找到某行的 node, （一旦匹配到 condition 就停止）
     */
    _findNode(condition: GridSelectCondition): undefined;
    _cellKeyDown(param: any): void;
    _modelUpdated(): void;
    _cellFocused(param: any): void;
    _cellClicked(param: any): void;
    _rowSelected(param: any): void;
    _cellEditingStarted(param: any): void;
    _cellEditingStopped(param: any): void;
    _rowEditingStarted(rowId: any, param: any): void;
    _rowEditingStopped(rowId: any, param: any): void;
    /**
     * Tab键导航
     */
    _tabToNextCell(params: any): any;
    /**
     * 上下左右键导航
     */
    _navigateToNextCell(params: any): any;
    /**
     * 列设置计算
     */
    _gridCols(resultCols: any[]): void;
}
export declare type GridSelectCondition = ((row: any) => boolean) | string;
