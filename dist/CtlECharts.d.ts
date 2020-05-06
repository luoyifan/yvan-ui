import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
export declare class CtlECharts extends CtlBase<CtlECharts> {
    static create(module: any, vjson: any): CtlECharts;
    /**
     * 数据绑定完毕后触发
     */
    onClick?: YvEvent<CtlECharts, any>;
    setOption(option: any, opts?: any): void;
    get handle(): any;
    resize(): void;
    clear(): void;
    private _echartsHandler;
    private _resetECharts;
}
