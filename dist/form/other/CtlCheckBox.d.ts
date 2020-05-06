import { CtlInput } from '../input/CtlInput';
export declare class CtlCheckBox extends CtlInput<CtlCheckBox> {
    static create(module: any, vjson: any): CtlCheckBox;
    private _labelAtRight;
    private _label;
    /**
     * label 是否在右边
     */
    get labelAtRight(): boolean;
    set labelAtRight(nv: boolean);
    /**
     * label 显示内容
     */
    get label(): string;
    set label(nv: string);
    private _refreshLabel;
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
