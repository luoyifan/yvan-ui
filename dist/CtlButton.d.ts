import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
declare type CtlButtonType = 'default' | 'primary' | 'success' | 'danger' | string | undefined;
/**
 * 按钮组件
 * @author yvan
 */
export declare class CtlButton extends CtlBase<CtlButton> {
    static create(module: any, vjson: any): CtlButton;
    /**
     * 按下按钮后触发
     */
    onClick?: YvEvent<CtlButton, void>;
    /**
     * 设置标记
     */
    set badge(nv: number | string | undefined);
    /**
     * 设置宽度
     */
    set width(nv: number | undefined);
    /**
     * 显示样式
     */
    set cssType(nv: CtlButtonType);
    /**
     * 设置按钮图标
     */
    set icon(nv: string);
    /**
     * 获取按钮图标
     */
    get icon(): string;
    /**
     * 设置按钮文本
     */
    set text(nv: string);
    /**
     * 获取按钮文本
     */
    get text(): string;
    /**
     * 是否允许
     */
    get enable(): boolean;
    set enable(nv: boolean);
    private _text;
    private _icon;
    private _refreshText;
}
export {};
