import { CtlInput } from '../input/CtlInput';
export declare class CtlSwitch extends CtlInput<CtlSwitch> {
    static create(module: any, vjson: any): CtlSwitch;
    /**
     * 交换状态
     */
    toggle(): void;
    /**
     * 设置值
     */
    set value(nv: any);
    /**
     * 获取值
     */
    get value(): any;
}
