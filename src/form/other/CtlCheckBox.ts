import { CtlInput } from '../input/CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlCheckboxDefault } from '../../CtlDefaultValue'

export class CtlCheckBox extends CtlInput<CtlCheckBox> {
  static create(module: any, vjson: any): CtlCheckBox {
    const that = new CtlCheckBox(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlCheckboxDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['labelAtRight', 'value'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      view: 'checkbox',
      on: {}
    })

    return that
  }

  private _labelAtRight: boolean = true
  private _label: string = ''

  /**
   * label 是否在右边
   */
  get labelAtRight(): boolean {
    return this._labelAtRight
  }

  set labelAtRight(nv: boolean) {
    this._labelAtRight = nv
    this._refreshLabel()
  }

  /**
   * label 显示内容
   */
  get label(): string {
    return this._label
  }

  set label(nv: string) {
    this._label = nv
    this._refreshLabel()
  }

  private _refreshLabel() {
    const nv = this._label
    if (!this._webix) {
      if (this._labelAtRight) {
        this._webixConfig.label = ''
        this._webixConfig.labelRight = nv
        this._webixConfig.labelWidth = 0
      } else {
        this._webixConfig.label = nv
        this._webixConfig.labelRight = ''
      }
    } else {
      if (this._labelAtRight) {
        this._webix.define({
          label: '',
          labelRight: nv
        })
      } else {
        this._webix.define({
          label: nv,
          labelRight: ''
        })
      }
      this._webix.refresh()
    }
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
