import { CtlBase } from './CtlBase'
import { CtlXtermDefault } from './CtlDefaultValue'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import webix from 'webix'

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
            this.wrapper.xtermInfo = {
                "cols": this._term.cols,
                "rows": this._term.rows,
                "width": this.$width,
                "height": this.$height
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
                            const term = new xterm.Terminal();
                            const fitAddon = new addon.FitAddon();
                            term.loadAddon(fitAddon);
                            term.open(this.$view.firstChild);
                            fitAddon.fit();
                            this._term = term;
                            this._fitAddon = fitAddon;
                            this._updateXtermInfo()
                        })
                    }
                    else {
                        YvEventDispatch(this.wrapper.onSizeChange, this.wrapper, this.wrapper.xtermInfo)
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

        const yvanProp = parseYvanPropChangeVJson(vjson, ['value', 'onSizeChange'])

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
                onAfterDelete() {
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
     * size 改变时触发
     */
    onSizeChange?: YvEvent<CtlXterm, any>

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
}
