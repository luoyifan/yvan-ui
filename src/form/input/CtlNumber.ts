import { CtlInput } from './CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlNumberDefault } from '../../CtlDefaultValue'

export class CtlNumber extends CtlInput<CtlNumber> {
  static create(vjson: any): CtlNumber {
    const that = new CtlNumber(vjson)

    _.defaultsDeep(vjson, CtlNumberDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['precision'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      view: 'text',
      type: 'number'
      // attr: {
      //     min: "0.00",
      //     step: "0.01"
      // }
    })

    return that
  }

  /*============================ 公共属性部分 ============================*/
  public precision?: number

  private _testNumber(value: any) {
    if (this.precision && this.precision > 0) {
      value = value.replace(/[^\d.-]/g, '') //清除"数字"和"."以外的字符
      if (value.length > 1 && value.indexOf('.') > 1) {
        let t
        while (1) {
          t = value
          value = value.replace(/^0/g, '')
          if (t.length === value.length) {
            break
          }
        }
        //value = value.replace(/^0/g, '') //验证第一个字符不是0.
      }
      value = value.replace(/^\./g, '') //验证第一个字符是数字而不是.
      value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的.
      value = value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.') //只允许输入一个小数点

      const r = eval('/^(\\-)*(\\d+)\\.(\\d{0,' + this.precision + '}).*$/')
      value = value.replace(r, '$1$2.$3') //只能输入固定位数的小数
    } else {
      value = value.replace(/[^\d-]/g, '') //清除"数字"和"-"以外的字符
      if (value.length > 1) {
        value = value.replace(/^0/g, '') //验证第一个字符不是0.
      }
      if (value.startsWith('-')) {
        value = '-' + value.substr(1).replace(/[^\d]/g, '')
      } else {
        value = value.replace(/[^\d]/g, '')
      }
    }
    return value
  }

  onInputEvent(e: Event) {
    let value = (e.target as any).value
    ;(e.target as any).value = this._testNumber(value)
    super.onInputEvent(e)
  }

  /**
   * 设置值 (如果不符合数字或小数位数格式，会被清空)
   */
  set value(nv: any) {
    nv = this._testNumber(nv)
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
    }
  }

  /**
   * 获取值(可能取到空值)
   */
  get value(): any {
    if (!this._webix) {
      return this._webixConfig.value
    }
    return this._webix.getValue()
  }
}
