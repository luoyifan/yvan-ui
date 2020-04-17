import { CtlBase } from '../CtlBase'
import { parseYvanPropChangeVJson } from '../CtlUtils'

export class CtlForm extends CtlBase<CtlForm> {
  static create(vjson: any): CtlForm {
    const that = new CtlForm(vjson)

    if (vjson.hasOwnProperty('debugger')) {
      debugger
    }

    const yvanProp = parseYvanPropChangeVJson(vjson, [])

    // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 yvanProxy 版的 _webix 合并至 webixProp, 最终合并至 vjson
    _.merge(vjson, that._webixConfig, {
      on: {
        onInited: function(this: any) {
          that.attachHandle(this)
        },
        onAfterLoad: function(this: any) {
          that.attachHandle(this)
        },
        onBeforeLoad: function(this: any) {
          that.attachHandle(this)
        },
        onChange: function(this: any) {
          that.attachHandle(this)
        },
        onViewShow: function(this: any) {
          that.attachHandle(this)
        },
        onDestruct: function() {
          that.removeHandle()
        }
      }
    })

    return that
  }

  setValues(data: any) {
    this._webix.setValues(data)
  }
}
