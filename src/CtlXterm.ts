import { CtlBase } from './CtlBase'
import { CtlXtermDefault } from './CtlDefaultValue'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import webix from 'webix'
import qs from "qs";

webix.protoUI(
    {
        name: 'xterm',
        defaults: {},
        $init: function (config: any) {
            this._domid = webix.uid();
            this.$view.innerHTML = `<div id='${this._domid}' style='width:100%;height:100%;'></div>`
            this.$ready.push(this._ready)
            _.extend(this.config, config)
            if (config.on && typeof config.on.onInited === 'function') {
                config.on.onInited.call(this)
            }
        },
        _ready: function (this: any) {
            this.isXtermLoad = false;
        },
        _set_inner_size: function () {
            if (!this._term || !this.$width) return

            this._updateScrollSize()
            // this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
        },
        destructor: function () {
            if (this.$destructed) {
                return;
            }

            this.$destructed = true;
            if (this.config.on && typeof this.config.on.onDestruct === 'function') {
                this.config.on.onDestruct.call(this)
            }
        },
        _updateScrollSize: function () {
            var box = this._term.element;
            var height = (this.$height || 0) + 'px'

            box.style.height = height
            box.style.width = (this.$width || 0) + 'px'

            if (this._fitAddon) {
                this._fitAddon.fit();
                this._updateXtermInfo()
            }
        },
        _updateXtermInfo: function () {
            const info = {
                "xtermCols": this._term.cols,
                "xtermRows": this._term.rows,
                "xtermWp": this.$width,
                "xtermHp": this.$height
            }
            this.wrapper.xtermInfo = info;
            if (this.wrapper._connection) {
                this.wrapper._resizeClientData(info);
            }
        },
        $setSize: function (x: any, y: any) {
            if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
                _.defer(() => {
                    this._set_inner_size()
                    if (this.isXtermLoad == false) {
                        this.isXtermLoad = true
                        //@ts-ignore
                        require(['xterm', 'xterm-addon-fit'], (xterm: any, addon: any) => {
                            const term = new xterm.Terminal(this.config.termConfig);
                            if (this.wrapper.allowInput) {
                                term.onData((data: any) => {
                                    this.wrapper._sendClientData(data);
                                });
                            }
                            const fitAddon = new addon.FitAddon();
                            term.loadAddon(fitAddon);
                            term.open(this.$view.firstChild);
                            fitAddon.fit();
                            this._term = term;
                            this._fitAddon = fitAddon;
                            this._updateXtermInfo()
                            if (this.wrapper._shouldConnectUrl) {
                                this.wrapper.connectHost(this.wrapper._shouldConnectUrl);
                                delete this.wrapper._shouldConnectUrl
                            }
                        })
                    }
                })
            }
        }
    },
    webix.ui.view
)

export class CtlXterm extends CtlBase<CtlXterm> {
    static create(module: any, vjson: any): CtlXterm {
        const that = new CtlXterm(vjson)
        that._module = module

        _.defaultsDeep(vjson, CtlXtermDefault)

        const yvanProp = parseYvanPropChangeVJson(vjson, [
            'value',
            'allowInput',
            'onOpen',
            'onClose',
        ])

        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson

        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp)

        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited(this: any) {
                    that.attachHandle(this, { ...vjson, ...yvanProp })
                    this.wrapper = that
                },
                onDestruct(this: any) {
                    that.connectionClose()
                    that.removeHandle()
                }
            }
        })

        return that
    }

    /**
     * xterm 信息
     * cols          
     * rows
     * width
     * height
     */
    xtermInfo?: any

    /**
     * 是否允许从 xterm 接收指令，给 websocket
     */
    allowInput?: boolean

    /**
     * socket打开时的事件
     */
    onOpen?: YvEvent<CtlXterm, any>

    /**
     * socket关闭时的事件
     */
    onClose?: YvEvent<CtlXterm, any>

    /**
     * 获取终端
     */
    get term(): any {
        return this._webix._term
    }

    /**
     * 获取填充插件
     */
    get fitAddon(): any {
        return this._webix._fitAddon
    }

    clear() {
        this.term.clear()
    }

    connectHost(host: string) {
        if (!this.term) {
            this._shouldConnectUrl = host
            return;
        }
        if (!this._connection) {
            let hostUrl = host;
            if (hostUrl.indexOf("?") === -1) {
                hostUrl = hostUrl + "?" + qs.stringify(this.xtermInfo);
            }
            else {
                const params = hostUrl.slice(hostUrl.indexOf("?") + 1)
                if (params.length > 0) {
                    hostUrl = hostUrl + "&" + qs.stringify(this.xtermInfo);
                }
                hostUrl += qs.stringify(this.xtermInfo);
            }
            this._connection = new WebSocket(hostUrl)
            this._connection.onopen = this._onSocketOpen.bind(this);
            this._connection.onmessage = this._onSocketMessage.bind(this);
            this._connection.onerror = this._onSocketError.bind(this);
            this._connection.onclose = this._onSocketClose.bind(this);
        }
        else {
            this.term.write('Error: WebSocket Not Supported\r\n');
        }
    }

    sendMessage(msg: any) {
        this._sendClientData(msg)
    }

    connectionClose() {
        if (this._connection) {
            console.log('WebSocket closed', this._connection)
            this._connection.close();
        }
    }

    /*********************** 私有变量 **********************/
    private _connection?: WebSocket
    private _shouldConnectUrl?: string

    private _onSocketOpen() {
        this.term.write('连接已建立，正在等待数据...\r\n');
        if (this.onOpen) {
            YvEventDispatch(this.onOpen, this, undefined);
        }
        this._sendInitData({ operate: 'connect' });
    }

    private _onSocketMessage(msg: any) {
        const data = msg.data.toString();
        this.term.write(data);
    }

    private _onSocketClose() {
        if (this._webix) {
            this.term.write("\r\n连接已关闭\r\n");
            if (this.onClose) {
                YvEventDispatch(this.onClose, this, undefined);
            }
        }
        this._connection = undefined;
    }

    private _onSocketError() {
        this.term.write("\r\n连接发生异常\r\n");
    }

    private _sendInitData(options: any) {
        if (!this._connection) {
            console.error('_connection 没有初始化')
            return;
        }
        //连接参数
        this._connection.send(JSON.stringify(options));
    }

    private _resizeClientData(data: any) {
        if (!this._connection) {
            console.error('_connection 没有初始化')
            return;
        }
        //发送指令
        this._connection.send(JSON.stringify({ "operate": "resize", ...data }))
    }

    private _sendClientData(data: any) {
        if (!this._connection) {
            console.error('_connection 没有初始化')
            return;
        }
        //发送指令
        this._connection.send(JSON.stringify({ "operate": "command", "command": data }))
    }
}
