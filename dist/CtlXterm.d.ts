import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
export declare class CtlXterm extends CtlBase<CtlXterm> {
    static create(module: any, vjson: any): CtlXterm;
    /**
     * size 改变时触发
     */
    onSizeChange?: YvEvent<CtlXterm, any>;
    onData?: YvEvent<CtlXterm, any>;
    /**
     * 获取终端
     */
    get term(): any;
    /**
     * 获取填充插件
     */
    get fitAddon(): any;
    get xtermWidth(): number;
    get xtermHeight(): number;
}
