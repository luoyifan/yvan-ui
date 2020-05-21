import { YvEvent } from './YvanEvent';
import { BaseModule } from './YvanUIModule';
export declare abstract class CtlBase<T> {
    /**
     * 渲染时触发
     */
    onRender?: YvEvent<CtlBase<T>, void>;
    /**
     * 实体类属性
     */
    entityName?: string;
    /**
     * 控件名
     */
    ctlName?: string;
    /**
     * 最初始时候的 json
     */
    vjson: any;
    /**
     * 定焦时间
     */
    ff: number;
    /**
     * webix API
     * webix.ui 渲染完毕之后，webix对象就存放在这里
     */
    protected _webix: any;
    /**
     * 控件所在的用户模块
     */
    protected _module: BaseModule<any, any, any>;
    /**
     * 为 entityName 进行 watch 的解绑函数
     */
    private _entityWatch?;
    /**
     * 在 webix 还没有初始化 (webix.ui) 的时候
     * 设置的属性就临时存放在这里. 最终会作为 webix 的属性来渲染
     */
    protected _webixConfig: any;
    constructor(vjson: any);
    /**
     * 强制组件获得焦点
     */
    focus(): void;
    /**
     * 设置正在读取中的状态
     */
    set loading(nv: boolean);
    /**
     * 获取模块
     */
    getModule(): BaseModule<any, any, any>;
    /**
     * 组件被渲染后触发
     */
    protected attachHandle(webixHandler: any, vjson: any): void;
    protected getCtlElements(element: any): any[];
    /**
     * 组件被移除后触发
     */
    protected removeHandle(): void;
    /**
     * 控件 value 值发生变化后，设置 entityName 对应的值
     */
    protected changeToEntity(value: any): void;
    /**
     * vue 或 webix 组件被设置后触发
     */
    protected refreshState(): void;
    /**
     * 设置隐藏
     */
    set hidden(nv: boolean);
    get hidden(): boolean;
}
