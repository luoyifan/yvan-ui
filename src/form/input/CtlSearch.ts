import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { YvEventDispatch, YvEvent } from '../../YvanEvent'
import { BaseDialog } from '../../YvanUIModule'
import { CtlSearchDefault } from '../../CtlDefaultValue'
import { CtlInput } from './CtlInput'

/**
 * search widget 接口配置
 */
interface WidgetOption {
  /**
   * 要弹出的 widget 窗口实例
   */
  content: any

  /**
   * 默认要 子对话框带的参数
   */
  params: any

  /**
   * 写会数据时所带的映射关系
   */
  bind?: {
    /**
     * 本模块的实体对象+属性名 = 弹出框附属的属性名
     */
    [name: string]: string
  }

  /**
   * 读取数据时的回调
   */
  onLoadData?: YvEvent<CtlSearch, void>
  /**
   * 回写时的回调
   */
  onConfirm?: YvEvent<CtlSearch, any>
  /**
   * 清空时的回调
   */
  onClear?: YvEvent<CtlSearch, void>
}

export class CtlSearch extends CtlInput<CtlSearch> {
  static create(module: any, vjson: any): CtlSearch {
    const that = new CtlSearch(vjson)
    that._module = module

    const vvjson = _.cloneDeep(vjson);

    _.defaultsDeep(vjson, CtlSearchDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['widget', 'value'])

    // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
    that._webixConfig = vjson

    if (!vjson.id) {
      that.id = _.uniqueId('input_')
    }

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig, {
      on: {
        onInited(this: any) {
          that.attachHandle(this, vvjson)
          that._refreshIcon()
        },
        // onAfterRender(this: any) {
        //     const $dom: any = $(this.$view);
        //     $dom.on('keydown', (event: KeyboardEvent) => {
        //         if (event.keyCode === 13) {
        //             // 从键盘响应查询
        //             event.stopPropagation();
        //             event.preventDefault();
        //
        //             that.suppressRestore = true;
        //             that._searchRequest(that._webix.getValue(), that.valueOrigin);
        //             return;
        //         }
        //
        //         YvEventDispatch(this.onKeydown, this, event);
        //     });
        // },
        onEnter() {
          // 从键盘响应查询
          that.suppressRestore = true
          that._searchRequest(that._webix.getValue(), that.valueOrigin)
        },
        onFocus(this: any) {
          //进入焦点时，用户输入的值既为有效值
          that.valueOrigin = that._webix.getValue()
          YvEventDispatch(that.onFocus, that, undefined)
        },
        onBlur(this: any) {
          if (that._validate) {
            const result = that._validate(that.value);
            if (result) {
              that._showValidateError()
            }
            else {
              that._hideValidateError()
            }
          }
          that._hideTootip()
          //离开焦点时，用户输入的置为无效
          if (!that.suppressRestore) {
            that._webix.setValue(that.valueOrigin)
          }
          YvEventDispatch(that.onBlur, that, undefined)
        },
        // onDestruct(this: any) {
        //     const $dom: any = $(this.$view);
        //     $dom.off('keydown');
        // },
        onSearchIconClick(e: Event) {
          // 从鼠标响应查询
          e.stopPropagation()
          e.preventDefault()

          const $span = $(e.target as any)
          if ($span.hasClass('wxi-close')) {
            // 清空
            that.clear()
          } else {
            // 查询
            that.suppressRestore = true
            that._searchRequest(that._webix.getValue(), that.valueOrigin)
          }
        }
      }
    })

    return that
  }

  /*============================ 公共属性部分 ============================*/

  /**
   * 弹框配置
   */
  widget?: WidgetOption

  /**
   * 清空值
   */
  clear() {
    if (!this.widget) {
      return
    }

    YvEventDispatch(this.widget.onClear, this, undefined)

    //清空
    _.forOwn(this.widget.bind, (value, key) => {
      _.set(this._module, key, '')
    })
  }

  get value(): string | undefined {
    if (!this._webix) {
      return this._webixConfig.value
    }
    return this.valueOrigin
  }

  set value(nv: string | undefined) {
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
      this.valueOrigin = nv
    }

    YvEventDispatch(this.onChange, this, nv)
    this._refreshIcon()
  }

  _refreshIcon() {
    const value = this._webix ? this._webix.getValue() : this._webixConfig.value
    const icon = value ? 'wxi-close' : 'wxi-search'
    let $span: any = this._webix ? $(this._webix.$view).find('span') : undefined

    if (!$span || $span.length <= 0) {
      if (this._webix) {
        this._webix.define('icon', icon)
      } else {
        this._webixConfig.icon = icon
      }
    } else {
      $span
        .removeClass('wxi-close')
        .removeClass('wxi-search')
        .addClass(icon)
    }
  }

  /*============================ 私有部分 ============================*/
  // 原始值
  private valueOrigin?: string = undefined
  //抑制还原动作
  private suppressRestore: boolean = false

  /**
   * 进入查询框
   */
  _searchRequest(queryValue: any, restoreValue: any) {
    queryValue = _.toString(queryValue)
    const searchCtl = this

    if (!searchCtl.widget) {
      console.error('没有设置 widget 属性')
      return
    }

    const widgetParamter: any = {
      query: queryValue,
      params: searchCtl.widget.params
    }

    //构造查询的对象
    //从 bind 获取
    const queryObj = {}
    _.forOwn(searchCtl.widget.bind, (value, key) => {
      _.set(queryObj, value, _.get(this._module, key))
    })

    widgetParamter.existObject = queryObj

    widgetParamter.onWidgetConfirm = function (data: any) {
      if (!searchCtl.widget) {
        console.error('没有设置 widget 属性')
        return
      }

      YvEventDispatch(searchCtl.widget.onConfirm, searchCtl, undefined)

      //写回
      _.forOwn(searchCtl.widget.bind, (value, key) => {
        _.set(searchCtl._module, key, _.get(data, value))
      })

      this.closeDialog()
      searchCtl.focus()
    }
    widgetParamter.onClose = function () {
      //弹窗关闭后恢复原值，并开启还原
      searchCtl.value = restoreValue
      searchCtl.suppressRestore = false
      searchCtl.focus()
    }
    const dlg: BaseDialog<any, any, any> = new searchCtl.widget.content()
    dlg.showDialog(widgetParamter, searchCtl._module, true)
    // YvanUI.showDialogWidget(this, new searchCtl.widget.content(), widgetParamter);
  }
}
