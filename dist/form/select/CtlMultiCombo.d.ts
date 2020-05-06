import { CtlInput } from '../input/CtlInput';
export declare class CtlMultiCombo extends CtlInput<CtlMultiCombo> {
    static create(module: any, vjson: any): CtlMultiCombo;
    /**
     * 修改下拉选项
     */
    set options(nv: any[]);
    /**
     * 修改下拉选项
     */
    set dataReal(nv: any[]);
    /**
     * 值分隔符
     */
    get separator(): string;
    /**
     * 值分隔符
     */
    set separator(nv: string);
    /**
     * 设置值 (如果不符合规定的格式 会清空)
     */
    set value(nv: any);
    /**
     * 获取值(可能取到空值)
     */
    get value(): any;
}
