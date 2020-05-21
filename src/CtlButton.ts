import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { CtlButtonDefault } from './CtlDefaultValue'
import { isDesignMode } from './DesignHelper'

type CtlButtonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'danger'
  | string
  | undefined

/**
 * 按钮组件
 * @author yvan
 */
export class CtlButton extends CtlBase<CtlButton> {
  static create(module: any, vjson: any): CtlButton {
    const that = new CtlButton(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlButtonDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      'onClick',
      'cssType',
      'icon',
      'width',
      'badge',
      'text'
    ])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      type: 'text',
      on: {
        onInited: function (this: any) {
          that.attachHandle(this, vjson)
        },
        onDestruct() {
          that.removeHandle()
        },
        onItemClick: function (this: any) {
          if (isDesignMode()) {
            return
          }
          YvEventDispatch(that.onClick, that, undefined)
        }
      }
    })

    return that
  }

  /*============================ 公共属性部分 ============================*/

  /**
   * 按下按钮后触发
   */
  onClick?: YvEvent<CtlButton, void>

  /**
   * 设置标记
   */
  set badge(nv: number | string | undefined) {
    if (!this._webix) {
      if (nv) {
        this._webixConfig.badge = nv
      } else {
        delete this._webixConfig.css
      }
      return
    }

    this._webix.define('badge', nv)
    this._webix.render()
  }

  /**
   * 设置宽度
   */
  set width(nv: number | undefined) {
    if (!this._webix) {
      if (nv) {
        this._webixConfig.width = nv
      } else {
        delete this._webixConfig.width
      }
      return
    }

    this._webix.define('width', nv)
    this._webix.resize()
  }

  /**
   * 显示样式
   */
  set cssType(nv: CtlButtonType) {
    let css = nv
    switch (nv) {
      case 'success':
        css = 'yvan_success'
        break

      case 'danger':
        css = 'yvan_danger'
        break

      case 'primary':
        css = 'yvan_primary'
        break

      case 'default':
        css = ''
        break
    }

    if (!this._webix) {
      if (css) {
        this._webixConfig.css = css
      } else {
        delete this._webixConfig.css
      }
      return
    }

    $(this._webix.$view).removeClass('webix_danger webix_primary')
    this._webix.define('css', css)
  }

  /**
   * 设置按钮图标
   */
  set icon(nv: string) {
    this._icon = nv
    this._refreshText()
  }

  /**
   * 获取按钮图标
   */
  get icon(): string {
    return this._icon
  }

  /**
   * 设置按钮文本
   */
  set text(nv: string) {
    this._text = nv
    this._refreshText()
  }

  /**
   * 获取按钮文本
   */
  get text(): string {
    return this._text
  }

  /**
   * 是否允许
   */
  get enable(): boolean {
    return this._webixConfig.disabled
  }

  set enable(nv: boolean) {
    if (!this._webix) {
      this._webixConfig.disabled = !nv
      return
    }
    this._webix.define('disabled', !nv)
  }

  /*============================ 私有属性部分 ============================*/

  private _text: string = ''
  private _icon: string = ''

  private _refreshText(): void {
    const nv = `<i class="${this._icon}"></i><span>${this._text}</span>`
    if (!this._webix) {
      this._webixConfig.value = nv
      return
    }
    this._webix.setValue(nv)
  }
}
