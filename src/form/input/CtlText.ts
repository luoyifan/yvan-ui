import * as YvanUI from '../../YvanUIExtend'
import { CtlInput } from './CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlTextDefault } from '../../CtlDefaultValue'

export class CtlText extends CtlInput<CtlText> {
  static create(module: any, vjson: any): CtlText {
    const that = new CtlText(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlTextDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['validate'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig)

    return that
  }

  /*============================ 公共属性部分 ============================*/

  set validate(nv: any) {
    const that = this
    if (typeof nv === 'function') {
      this._validate = nv
    } else if (typeof nv === 'string') {
      const vl = function (value: any, data: any) {
        let msg = YvanUI.complexValid['fun'](nv, value)
        const $input = $(that._webix.$view).find('input')
        if (msg) {
          $input.each((index, item) => {
            $(item).css({
              'background-color': '#ffdedb',
              'border-color': '#ff8d82'
            })
          })
          $(`#${that.id}_validate`).remove()
          $(that._webix.$view).append(
            `<div id="${that.id}_validate" style="position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;">${msg}</div>`
          )
          return false
        } else {
          $input.each((index, item) => {
            $(item).css({
              'background-color': '',
              'border-color': ''
            })
          })
          $(`#${that.id}_validate`).remove()
          return true
        }
      }
      this._validate = vl
    }
  }
}
