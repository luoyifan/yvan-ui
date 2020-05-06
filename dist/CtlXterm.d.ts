import { CtlBase } from './CtlBase';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
export declare class CtlXterm extends CtlBase<CtlXterm> {
    static create(module: any, vjson: any): CtlXterm;
    /**
     * 获取终端
     */
    get term(): Terminal;
    /**
     * 获取填充插件
     */
    get fitAddon(): FitAddon;
}
