import { CtlInput } from './CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlDateDefault, CtlDateTimeDefault } from '../../CtlDefaultValue'

export class CtlDatePicker extends CtlInput<CtlDatePicker> {
  static create(module: any, vjson: any): CtlDatePicker {
    const that = new CtlDatePicker(vjson)
    that._module = module

    const baseConfig: any = {}
    if (vjson.view === 'datetime') {
      // 日期+时间输入
      baseConfig.format = '%Y-%m-%d %H:%i:%s'
      baseConfig.timepicker = true
      _.defaultsDeep(vjson, CtlDateTimeDefault)
    } else {
      // 日期输入
      baseConfig.format = '%Y-%m-%d'
      baseConfig.timepicker = false
      _.defaultsDeep(vjson, CtlDateDefault)
    }

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, [])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig, {
      editable: true,
      stringResult: true,
      view: 'datepicker',
      ...baseConfig,
      on: {}
    })

    return that
  }

  /*============================ 公共属性部分 ============================*/
  /**
   * 设置值 (如果不符合规定的格式 会清空)
   */
  set value(nv: any) {
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
    const value = this._webix ? this._webix.getValue() : this._webixConfig.value
    if (this.vjson.view === 'datetime') {
      // 日期+时间输入
      return _.toString(value).substr(0, 19)
    } else {
      // 日期输入
      return _.toString(value).substr(0, 10)
    }
  }

  /*============================ 私有部分 ============================*/

  //更改 onChange 或实体时的值
  protected valueProcess(value: any): any {
    const moment: any = _.get(window, 'moment')
    if (_.isDate(value)) {
      value = moment(value)

      if (this.vjson.view === 'datetime') {
        // 日期+时间输入
        value = value.isValid() ? value.format('YYYY-MM-DD HH:mm:ss') : ''
      } else {
        // 日期输入
        value = value.isValid() ? value.format('YYYY-MM-DD') : ''
      }

      return value
    }
    return value
  }
}
