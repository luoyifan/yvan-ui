import { CtlBase } from '../../CtlBase';
import { YvEvent } from '../../YvanEvent';
declare type CtlInputWidth = number | undefined | 'auto';
export declare class CtlInput<M> extends CtlBase<M> {
    protected _create<M extends CtlInput<M>>(vjson: any, me: M): void;
    protected valueValid(value: any): boolean;
    protected valueProcess(value: any): any;
    inputCheck: (newValue: any, oldValue: any) => boolean;
    onInputEvent(event: Event): void;
    /**
     * 更改任何内容时触发
     */
    onInput?: YvEvent<M, Event>;
    /**
     * 离开焦点或按下回车键之后触发更改时触发
     */
    onChange?: YvEvent<M, string>;
    /**
     * 鼠标点击后触发
     */
    onClick?: YvEvent<M, void>;
    /**
     * 按下回车键之后触发
     */
    onEnter?: YvEvent<M, void>;
    /**
     * 获取焦点后触发
     */
    onFocus?: YvEvent<M, void>;
    /**
     * 离开焦点后触发
     */
    onBlur?: YvEvent<M, void>;
    /**
     * 按下任何键之后触发事件
     */
    onKeydown?: YvEvent<M, Event>;
    /**
     * 输入内容时是否立刻提交 value
     */
    changeValueImplete: boolean;
    _gravity: string;
    set gravity(nv: any);
    get gravity(): any;
    set id(nv: any);
    get id(): any;
    /**
     * 设置值
     */
    set value(nv: any);
    /**
     * 获取值
     */
    get value(): any;
    /**
     * 定焦时间
     */
    ff: number;
    /**
     * 最大长度
     */
    maxlength?: number;
    /**
     * 文本描述
     */
    set label(nv: string);
    /**
     * 文本对齐方式
     */
    set labelAlign(nv: 'left' | 'right' | 'center');
    /**
     * 必填
     */
    set required(nv: boolean);
    /**
     * 文本宽度
     */
    set labelWidth(nv: number);
    /**
     * 禁用
     */
    set disabled(nv: boolean);
    /**
     * 只读
     */
    set readonly(nv: boolean);
    /**
     * 水印
     */
    set prompt(nv: string);
    /**
     * 宽度
     */
    set width(nv: CtlInputWidth);
    onValueChange(newV: any, oldV: any): void;
    onInputValue(value: any): void;
    /**
     * 验证
     * @param nv  div.webix_inp_static
     */
    set validate(nv: any);
    get validate(): any;
    /**================ 私有属性 ===================**/
    _validateResult: boolean;
    _validate: any;
    _id: any;
    _maxlength: any;
    _showValidate(msg: any, type: 'inputValidate' | 'changedValidate' | 'requiredValidate'): boolean;
}
export {};
