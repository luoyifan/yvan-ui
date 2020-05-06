import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
export declare class CtlTab extends CtlBase<CtlTab> {
    static create(module: any, vjson: any): CtlTab;
    defaultTabIndex: number;
    /**
     * 当前选项卡发生变化时触发
     */
    onTabChanged?: YvEvent<CtlTab, any>;
    /**
     * 当前选项卡关闭时触发
     */
    onTabClosed?: YvEvent<CtlTab, any>;
    /**
     * tabbar 上的快捷菜单
     */
    set tabbarContextMenu(config: any);
    /**
     * 关闭所有允许关闭的标签
     */
    closeAll(butIds: Array<any>): void;
    /**
     * 添加一个模块到标签页执行
     * @param text 标签标题
     * @param id 标签id
     * @param vue 模块(Class)
     */
    addModule(text: string, id: string, vue: any): void;
    /**
     * 添加一个 Vjson 到标签
     * @param text 标签标题
     * @param id 标签id
     * @param vjson 界面描述片段
     */
    addContent(text: string, id: string, vjson: any, opts?: any): void;
    /**
     * 获取 tab 标签数量
     */
    get tabCount(): number;
    /**
     * 选定某个标签
     */
    selectTab(id: string): boolean;
    /**
     * 判断标签是否存在
     */
    tabExsit(id: string): boolean;
    /**
     * 获取当前选中的 tabId
     */
    getSelectedTabId(): any;
    /**
     * 快捷菜单句柄
     */
    _menuConfig: any;
}
