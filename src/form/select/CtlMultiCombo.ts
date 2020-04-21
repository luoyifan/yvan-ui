import { CtlInput } from '../input/CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlMultiComboDefault } from '../../CtlDefaultValue'
import { getFirstPinyin } from '../../Utils'

export class CtlMultiCombo extends CtlInput<CtlMultiCombo> {
  static create(module: any, vjson: any): CtlMultiCombo {
    const that = new CtlMultiCombo(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlMultiComboDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['options'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig)

    return that
  }

  /**
   * 修改下拉选项
   */
  set options(nv: any[]) {
    const options: any = {
      filter(item: any, filterWord: string) {
        if (_.size(filterWord) <= 0) {
          return true
        }
        const nodePy = getFirstPinyin(item.text).toLowerCase()
        return (
          nodePy.indexOf(filterWord.toLowerCase()) >= 0 ||
          item.text.indexOf(filterWord) >= 0
        )
      },
      body: {
        template: '#text#',
        type: {
          height: 36
        },
        data: nv
      }
    }

    if (!this._webix) {
      _.merge(this._webixConfig, {
        view: 'multicombo',
        options
      })
      return
    }
    this._webix.define('options', options)
    this._webix.refresh()
  }

  /**
   * 修改下拉选项
   */
  set dataReal(nv: any[]) {
    this.options = nv
  }

  /**
   * 值分隔符
   */
  get separator(): string {
    if (!this._webix) {
      return this._webixConfig.separator
    }
    return this._webix.config['separator']
  }

  /**
   * 值分隔符
   */
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
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
    }
  }

  /**
   * 获取值(可能取到空值)
   */
  get value(): any {
    return this._webix.getValue()
  }
}
