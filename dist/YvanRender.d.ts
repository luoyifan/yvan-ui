import { BaseModule, VJson } from './YvanUIModule';
/**
 * 深度遍历 vjson
 * @param vjson 视图JSON
 * @param resolver 分析函数
 * @return 记录 resolver 方法返回 true 时，对象的访问路径
 */
export declare function deepTravVJson(vjson: VJson, resolver: (child: VJson) => any): Array<PathMarker>;
/**
 * 深度遍历 vjson 后，所有 mark 对象及访问方法
 */
export interface PathMarker {
    id: number;
    keyName: string;
    object: any;
}
/**
 * 根据 vjson 中的 ctlName, 合并属性
 * @param vjson 原始 vjson 视图
 * @param ctlOption 要被扩展的 ctlName 属性对
 */
export declare function viewExtend(vjson: VJson, ctlOption: any): VJson;
/**
 * 根据 vjson 格式，嵌入 yvan 组件, 生成能够为 webix 使用的 vjson
 */
export declare function wrapperWebixConfig<M, Refs, INP>(module: BaseModule<M, Refs, INP>, vjson: VJson): void;
/**
 * 将传统 ts Class 转换为 vue 对象.
 * 普通模块对象和 dialog 对象都要经过转换
 */
export declare function componentFactory<M, Refs, INP>(Component: BaseModule<M, Refs, INP> & any, options?: any): any;
/**
 * 在目标 DOM 选择器上渲染模块
 */
export declare function render<M, Refs, INP>(selector: string, baseModule: BaseModule<M, Refs, INP>): any;
/**
 * 在占位空间 spaceId 上渲染 vjson
 * @param module 当前模块
 * @param spaceId 占位空间
 * @param vjson 界面描述
 */
export declare function renderPlace<M, Refs, INP>(module: BaseModule<M, Refs, INP>, spaceId: string, vjson: VJson): void;
