import { CtlInput } from '../input/CtlInput';
import { DataSource } from '../../YvanDataSource';
import { YvEvent } from '../../YvanEvent';
/**
 * 下拉框组件
 */
export declare class CtlCombo extends CtlInput<CtlCombo> {
    static create(module: any, vjson: any): CtlCombo;
    /**
     * 数据绑定完成后触发
     */
    onDataComplete?: YvEvent<CtlCombo, any>;
    /**
     * 修改下拉选项
     */
    set options(nv: any[]);
    /**
     * 获取显示的值
     */
    getText(): string;
    /**
     * 下拉选项
     */
    set dataReal(nv: any[]);
    /**
     * 获取数据源设置
     */
    get dataSource(): DataSource<CtlCombo>;
    /**
     * 设置数据源
     */
    set dataSource(nv: DataSource<CtlCombo>);
    /**
     * 重新请求数据
     */
    reload(): void;
    private _dataSource;
    private dataSourceBind?;
    private _rebindDataSource;
    private _dataSourceProcess;
    protected refreshState(): void;
}
