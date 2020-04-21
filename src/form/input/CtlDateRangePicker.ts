import { CtlInput } from './CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import {
  CtlDateRangeDefault,
  CtlDateTimeRangeDefault
} from '../../CtlDefaultValue'

export class CtlDateRangePicker extends CtlInput<CtlDateRangePicker> {
  static create(module: any, vjson: any): CtlDateRangePicker {
    const that = new CtlDateRangePicker(vjson)
    that._module = module

    const baseConfig: any = {}
    if (vjson.view === 'datetimerange') {
      // 日期+时间输入
      baseConfig.format = '%Y-%m-%d %H:%i:%s'
      baseConfig.timepicker = true
      _.defaultsDeep(vjson, CtlDateTimeRangeDefault)
    } else {
      // 日期输入
      baseConfig.format = '%Y-%m-%d'
      baseConfig.timepicker = false
      _.defaultsDeep(vjson, CtlDateRangeDefault)
    }

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      'value',
      'separator',
      'entityNameStart',
      'entityNameEnd'
    ])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig, {
      editable: true,
      stringResult: true,
      view: 'daterangepicker',
      ...baseConfig,
      on: {}
    })

    return that
  }

  /*============================ 公共部分 ============================*/
  entityNameStart: string = ''
  entityNameEnd: string = ''

  get separator(): string {
    if (!this._webix) {
      return this._webixConfig.separator
    }
    return this._webix.config['separator']
  }

  set separator(nv: string) {
    if (!this._webix) {
      this._webixConfig.separator = nv
    } else {
      this._webix.define('separator', nv)
    }
  }

  /**
   * 设置值 (如果不符合规定的格式 会清空)
   */
  set value(nv: any) {
    if (!this._webix) {
      if (typeof nv === 'string') {
        const [start, end] = nv.split(this.separator)
        this._webixConfig.value = { start, end }
      } else {
        this._webixConfig.value = nv
      }
    } else {
      let value: any = nv
      if (typeof nv === 'string') {
        const [start, end] = nv.split(this.separator)
        value = { start, end }
      }
      this._webix.setValue(value)
    }
  }

  /**
   * 获取值(可能取到空值)
   */
  get value(): any {
    const value = this._webix ? this._webix.getValue() : this._webixConfig.value
    if (!value) {
      return ''
    }
    const { start, end } = value
    return start + this.separator + end
  }

  /*============================ 私有部分 ============================*/

  //是否允许触发 onChange
  protected valueValid(value: any): boolean {
    const moment: any = _.get(window, 'moment')

    if (_.isPlainObject(value)) {
      let { start, end } = value
      if (!moment(start).isValid() || !moment(end).isValid()) {
        return false
      }
    }
    return true
  }

  //更改 onChange 或实体时的值
  protected valueProcess(value: any): any {
    const moment: any = _.get(window, 'moment')
    if (_.isPlainObject(value)) {
      let { start, end } = value
      start = moment(start)
      end = moment(end)

      if (this.vjson.view === 'datetimerange') {
        // 日期+时间输入
        start = start.isValid() ? start.format('YYYY-MM-DD HH:mm:ss') : ''
        end = end.isValid() ? end.format('YYYY-MM-DD HH:mm:ss') : ''
      } else {
        // 日期输入
        start = start.isValid() ? start.format('YYYY-MM-DD') : ''
        end = end.isValid() ? end.format('YYYY-MM-DD') : ''
      }

      if (this.entityNameStart) {
        // 带 entityNameStart 实体绑定
        _.set(this._module, this.entityNameStart, start)
      }

      if (this.entityNameEnd) {
        // 带 entityNameEnd 实体绑定
        _.set(this._module, this.entityNameEnd, end)
      }

      return start + this.separator + end
    }
    return value
  }
}
