import { CtlInput } from './CtlInput';
export declare class CtlDatePicker extends CtlInput<CtlDatePicker> {
    static create(module: any, vjson: any): CtlDatePicker;
    /**
     * 设置值 (如果不符合规定的格式 会清空)
     */
    set value(nv: any);
    /**
     * 获取值(可能取到空值)
     */
    get value(): any;
    protected valueProcess(value: any): any;
}
