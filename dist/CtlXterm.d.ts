import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
export declare class CtlXterm extends CtlBase<CtlXterm> {
    static create(module: any, vjson: any): CtlXterm;
    /**
     * xterm 信息
     * cols
     * rows
     * width
     * height
     */
    xtermInfo?: any;
    /**
     * 是否允许从 xterm 接收指令，给 websocket
     */
    allowInput?: boolean;
    /**
     * socket打开时的事件
     */
    onOpen?: YvEvent<CtlXterm, any>;
    /**
     * socket关闭时的事件
     */
    onClose?: YvEvent<CtlXterm, any>;
    /**
     * 获取终端
     */
    get term(): any;
    /**
     * 获取填充插件
     */
    get fitAddon(): any;
    clear(): void;
    connectHost(host: string): void;
    sendMessage(msg: any): void;
    connectionClose(): void;
    /*********************** 私有变量 **********************/
    private _connection?;
    private _shouldConnectUrl?;
    private _onSocketOpen;
    private _onSocketMessage;
    private _onSocketClose;
    private _onSocketError;
    private _sendInitData;
    private _resizeClientData;
    private _sendClientData;
}
