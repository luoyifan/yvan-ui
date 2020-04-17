import { CtlInput } from '../input/CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlRadioDefault } from '../../CtlDefaultValue'

export class CtlRadio extends CtlInput<CtlRadio> {
  static create(vjson: any): CtlRadio {
    const that = new CtlRadio(vjson)

    _.defaultsDeep(vjson, CtlRadioDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['options'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      view: 'radio',
      on: {}
    })

    return that
  }

  /**
   * 修改下拉选项
   */
  set options(nv: any[]) {
    const value = nv.map(item => {
      return { id: item.id, value: item.text }
    })

    if (!this._webix) {
      _.merge(this._webixConfig, {
        options: value
      })
      return
    }
    this._webix.define('options', value)
    this._webix.refresh()
  }
}
