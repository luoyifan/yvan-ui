import { CtlBase } from './CtlBase'
import { CtlXtermDefault } from './CtlDefaultValue'
import { parseYvanPropChangeVJson } from './CtlUtils'
import webix from 'webix'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit';

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
            const term = new Terminal();
            const fitAddon = new FitAddon();

            _.defer(() => {
                term.loadAddon(fitAddon);
                term.open(this.$view.firstChild);
                fitAddon.fit();
                this._term = term;
                this._fitAddon = fitAddon;
            })
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
            }
        },
        $setSize: function (x: any, y: any) {
            if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
                _.defer(() => {
                    this._set_inner_size()
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

        const yvanProp = parseYvanPropChangeVJson(vjson, ['value'])

        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson

        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp)

        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited(this: any) {
                    that.attachHandle(this, vjson)
                },
                onAfterDelete() {
                    that.removeHandle()
                }
            }
        })

        return that
    }

    /**
     * 获取终端
     */
    get term(): Terminal {
        return this._webix._term
    }

    /**
     * 获取填充插件
     */
    get fitAddon(): FitAddon {
        return this._webix._fitAddon
    }

    get xtermWidth(): number {
        return this._webix.$width
    }

    get xtermHeight(): number {
        return this._webix.$height
    }
}
