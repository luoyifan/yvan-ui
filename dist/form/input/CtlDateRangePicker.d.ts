import { CtlInput } from './CtlInput';
export declare class CtlDateRangePicker extends CtlInput<CtlDateRangePicker> {
    static create(module: any, vjson: any): CtlDateRangePicker;
    entityNameStart: string;
    entityNameEnd: string;
    get separator(): string;
    set separator(nv: string);
    /**
     * 设置值 (如果不符合规定的格式 会清空)
     */
    set value(nv: any);
    /**
     * 获取值(可能取到空值)
     */
    get value(): any;
    protected valueValid(value: any): boolean;
    protected valueProcess(value: any): any;
}
