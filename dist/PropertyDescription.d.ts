export declare type GroupType = 'css' | 'data' | 'bind' | 'common';
export interface PropertyValue {
    /**
     * 属性名
     */
    name: string;
    /**
     * 默认值
     */
    default: any;
    /**
     * 隶属分组
     */
    group: GroupType;
    /**
     * 描述
     */
    desc: string;
    /**
     * 取值范围
     */
    type: 'boolean' | 'number' | 'string' | 'object' | 'dataSource' | 'valid' | Array<string>;
}
export interface EventValue {
    /**
     * 属性名
     */
    name: string;
    /**
     * 描述
     */
    desc: string;
}
export interface PropertyDescriptionInterface {
    props: PropertyValue[];
    events?: EventValue[];
}
export declare class PropertyDescription {
    propertyes: PropertyDescriptionInterface;
    constructor(...args: PropertyDescriptionInterface[]);
    merge(pd: PropertyDescriptionInterface): void;
    /**
     * 根据分组名 获取属性定义
     */
    getPropsByGroup(name: GroupType): PropertyValue[];
    /**
     * 获取全部事件
     */
    getEvents(): EventValue[];
}
