import { CtlInput } from '../input/CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlSwitchDefault } from '../../CtlDefaultValue'

export class CtlSwitch extends CtlInput<CtlSwitch> {
  static create(vjson: any): CtlSwitch {
    const that = new CtlSwitch(vjson)

    _.defaultsDeep(vjson, CtlSwitchDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['value'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      view: 'switch',
      on: {}
    })

    return that
  }

  /**
   * 交换状态
   */
  toggle() {
    this._webix.toggle()
  }

  /**
   * 设置值
   */
  set value(nv: any) {
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValueHere(nv)
    }
  }

  /**
   * 获取值
   */
  get value(): any {
    if (!this._webix) {
      return this._webixConfig.value
    }
    return this._webix.getValue()
  }
}
