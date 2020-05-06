import Vue from 'vue';
export declare type VJson = any;
export declare type ViewExtendType<T> = {
    [P in keyof T]?: Partial<T[P]>;
};
/**
 * 业务模块接口
 */
export interface Module<M, Refs, INP> {
    viewResolver(): VJson;
    viewIntercept?(vjson: VJson, inParamter?: INP): void;
    viewExtend?(inParamter?: INP): ViewExtendType<Refs>;
    onLoad?(): void;
}
export declare abstract class BaseModule<M, Refs, INP> extends Vue implements Module<M, Refs, INP> {
    /**
     * 组件对象引用
     */
    refs: Refs;
    /**
     * showDialog 带来的参数
     */
    inParamter: INP;
    _webixId: any;
    /**
     * 模块实例 ID (运行时自动创建)
     */
    instanceId: string;
    /**
   * 模块是否加载完毕
   */
    loadFinished: boolean;
    /**
     * 模块被渲染完成之后调用
     */
    onLoad(): void;
    /**
     * 每次从隐藏状态换显出来后调用
     */
    onShow(): void;
    abstract viewResolver(): VJson;
    /**
     * 根据名称，获取空白区域操作句柄
     */
    getPlace(placeId: string): any;
}
export declare abstract class BaseDialog<M, Refs, INP> extends BaseModule<M, Refs, INP> {
    /**
     * 对话框 DOM 对象
     */
    layero: any;
    /**
     * 组件对象引用
     */
    refs: Refs;
    /**
     * 显示对话框
     * @param inParamter 输入参数
     * @param container 父容器
     */
    showDialog: (inParamter: INP, container: any, isFromSearchBox?: boolean) => void;
    /**
     * 关闭对话框
     */
    closeDialog: () => void;
    /**
     * 按下 ESC 键
     */
    onEsc(): void;
    /**
     * 按下 Enter 键
     */
    onEnter(): void;
    /**
     * 关闭后触发
     */
    onClose(): void;
    /**
     * 对话框的父亲（打开者）
     */
    dialogParent: any;
    /**
     * 对话框标题
     */
    get title(): string;
    /**
     * 设置对话框标题
     */
    set title(nv: string);
    /**
     * 显示进行中的状态
     */
    showLoading(): void;
    /**
     * 关闭进行中的状态
     */
    closeLoading(): void;
}
export declare type BaseModuleType<M, Refs, INP> = typeof BaseModule;
/**
 * 装饰业务模块
 * @param options
 */
export declare function BizModule<M, Refs, INP>(option?: any): Function;
export interface BizWatch {
    /**
     * 监听的表达式
     */
    expr: string;
    /**
     * 深度监听
     */
    deep: boolean;
    /**
     * 是否立刻执行
     */
    immediate: boolean;
    /**
     * 执行的方法
     */
    handler: any;
}
/**
 * 装饰字段（监听某个属性值变化）
 */
export declare function Watch(propName: string, deep?: boolean, immediate?: boolean): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
