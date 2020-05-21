import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvEvent, YvEventDispatch } from './YvanEvent'

export class CtlCarousel extends CtlBase<CtlCarousel> {
  onShow?: YvEvent<CtlCarousel, string>

  static create(module: any, vjson: any): CtlCarousel {
    const that = new CtlCarousel(vjson)
    that._module = module

    const yvanProp = parseYvanPropChangeVJson(vjson, ['onShow'])

    // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig, {
      on: {
        onInited() {
          that.attachHandle(this, vjson)
        },
        onDestruct: function () {
          that.removeHandle()
        },
        onShow: function (this: any) {
          const value = this.getActiveIndex()
          YvEventDispatch(that.onShow, that, value)
        }
      }
    })
    return that
  }
}
