import { CtlInput } from './CtlInput';
export declare class CtlNumber extends CtlInput<CtlNumber> {
    static create(module: any, vjson: any): CtlNumber;
    precision?: number;
    private _testNumber;
    onInputEvent(e: Event): void;
    /**
     * 设置值 (如果不符合数字或小数位数格式，会被清空)
     */
    set value(nv: any);
    /**
     * 获取值(可能取到空值)
     */
    get value(): any;
}
