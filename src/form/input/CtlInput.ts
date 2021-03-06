import { CtlBase } from '../../CtlBase'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import * as YvanUI from '../../YvanUIExtend'
import * as YvanMessage from '../../YvanUIMessage'
import { YvEvent, YvEventDispatch } from '../../YvanEvent'

type CtlInputWidth = number | undefined | 'auto'

export class CtlInput<M> extends CtlBase<M> {
  protected _create<M extends CtlInput<M>>(vjson: any, me: M) {
    const that: M = me

    // 提取想要的属性
    const yvanProp = parseYvanPropChangeVJson(vjson, [
      'id',
      'gravity',
      'validate',
      'onInput',
      'onKeydown',
      'onClick',
      'onEnter',
      'width',
      'onFocus',
      'onChange',
      'onBlur',
      'maxlength',
      'changeValueImplete',
      'ff',
      'label',
      'labelWidth',
      'labelAlign',
      'readonly',
      'disabled',
      'required',
      'onValidate',
      'value',
      'prompt'
    ])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson
    if (!vjson.id) {
      that.id = _.uniqueId('input_')
    }

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    function onKeydown(event: any) {
      YvEventDispatch(that.onKeydown, that, event)
    }

    // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
    _.merge(vjson, that._webixConfig, {
      on: {
        onInited: function (this: any) {
          that.attachHandle(this, { ...vjson, ...yvanProp })
        },
        onAfterRender: function (this: any) {
          const $input = $(this.$view).find('input')
          $input.on('input', that.onInputEvent.bind(that))
          $input.on('keydown', onKeydown)
          if (that.onValidate || that._required) {
            that._addEnvent($input);
          }
          const result = that._resultToShowOrHide()
          if (result) {
            that._showValidateError()
          } else {
            that._hideValidateError()
          }
          if (that.constructor.name !== 'CtlSelect' && that._webixConfig.required) {
            if (that.constructor.name === 'CtlDateRangePicker') {
              that._showValidate(
                !this.getValue().end || this.getValue().end.length <= 0,
                'requiredValidate'
              )
            } else {
              that._showValidate(
                !this.getValue() || this.getValue().length <= 0,
                'requiredValidate'
              )
            }
          }
          this.callEvent('onCtlRender', [])
          if (that.ff > 0) {
            setTimeout(() => {
              that.focus()
              that.ff = 0
            }, that.ff)
          }
        },
        onDestruct: function (this: any) {
          this.callEvent('onCtlRemove', [])
          const $input = $(this.$view).find('input')
          $input.off('input')
          $input.off('keydown')
          that._removeEnvent($input)
          that.removeHandle()
          that._hideTootip()
        },
        onItemClick(this: any) {
          YvEventDispatch(that.onClick, that, undefined)
        },
        onEnter(this: any) {
          YvEventDispatch(that.onEnter, that, undefined)
        },
        onFocus(this: any) {
          if (that.onValidate || that._required) {
            const result = that._resultToShowOrHide();
            if (result) {
              that._showTootip(result)
              that._showValidateError()
            }
            else {
              that._hideTootip()
              that._hideValidateError()
            }
          }
          YvEventDispatch(that.onFocus, that, undefined)
        },
        onChange(this: any, newValue: any, oldValue: any) {
          if (!that.valueValid(newValue)) {
            // 不允许触发更改
            return
          }
          if (that.onValueChange && typeof that.onValueChange === 'function') {
            that.onValueChange(newValue, oldValue)
          }
          newValue = that.valueProcess(newValue)
          that.changeToEntity(newValue)
          if (that._webixConfig.required) {
            if (that.constructor.name === 'CtlDateRangePicker') {
              that._showValidate(
                !this.getValue().end || this.getValue().end.length <= 0,
                'requiredValidate'
              )
            } else {
              that._showValidate(
                !this.getValue() || this.getValue().length <= 0,
                'requiredValidate'
              )
            }
          }

          YvEventDispatch(that.onChange, that, newValue)
        },
        onBlur(this: any) {
          if (that.onValidate || that._required) {
            const result = that._resultToShowOrHide();
            if (result) {
              that._showValidateError()
            }
            else {
              that._hideValidateError()
            }
          }
          that._hideTootip()
          if (that._webixConfig.required) {
            if (that.constructor.name === 'CtlDateRangePicker') {
              that._showValidate(
                !this.getValue().end || this.getValue().end.length <= 0,
                'requiredValidate'
              )
            } else {
              that._showValidate(
                !this.getValue() || this.getValue().length <= 0,
                'requiredValidate'
              )
            }
          }
          YvEventDispatch(that.onBlur, that, undefined)
        }
      }
    })
  }

  //是否允许触发 onChange
  protected valueValid(value: any): boolean {
    return true
  }

  //更改 onChange 或实体时的值
  protected valueProcess(value: any): any {
    return value
  }

  inputCheck!: (newValue: any, oldValue: any) => boolean

  onInputEvent(event: Event) {
    if (this.onInputValue && typeof this.onInputValue === 'function') {
      this.onInputValue((event.target as any).value)
    }

    if (
      this.constructor.name === 'CtlText' &&
      this.maxlength &&
      _.size((event.target as any).value) > this.maxlength
    ) {
      ; (event.target as any).value = (event.target as any).value.substring(
        0,
        this.maxlength
      )
    }
    if (this.changeValueImplete) {
      // 改变后立刻提交值
      this.value = (event.target as any).value
    }

    // @ts-ignore
    YvEventDispatch(this.onInput, this, event)
  }

  /*============================ 公共属性部分 ============================*/

  /**
   * 更改任何内容时触发
   */
  onInput?: YvEvent<M, Event>

  /**
   * 离开焦点或按下回车键之后触发更改时触发
   */
  onChange?: YvEvent<M, string>

  /**
   * 鼠标点击后触发
   */
  onClick?: YvEvent<M, void>

  /**
   * 按下回车键之后触发
   */
  onEnter?: YvEvent<M, void>

  /**
   * 获取焦点后触发
   */
  onFocus?: YvEvent<M, void>

  /**
   * 离开焦点后触发
   */
  onBlur?: YvEvent<M, void>

  /**
   * 校验事件
   */
  onValidate?: YvEvent<M, string>

  /**
   * 按下任何键之后触发事件
   */
  onKeydown?: YvEvent<M, Event>

  /**
   * 输入内容时是否立刻提交 value
   */
  changeValueImplete: boolean = false

  _gravity: string = ''

  set gravity(nv: any) {
    this._gravity = nv

    let v: any
    if (!nv) {
      v = undefined
    } else {
      v = _.parseInt(nv)
    }

    if (!this._webix) {
      if (v) {
        this._webixConfig.gravity = v
      } else {
        delete this._webixConfig.gravity
      }
    } else {
      this._webix.define('gravity', v)
      this._webix.resize()
    }
  }

  get gravity(): any {
    return this._gravity
  }

  set id(nv: any) {
    this._id = nv
    if (!this._webix) {
      this._webixConfig.id = nv
    } else {
      // 运行后不允许修改 id
      console.error('can\'t set "ID" at runtime!')
    }
  }

  get id(): any {
    return this._id
  }

  /**
   * 设置值
   */
  set value(nv: any) {
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
    }
  }

  /**
   * 获取值
   */
  get value(): any {
    if (!this._validateResult) {
      throw new Error('invalidate!')
    }

    if (!this._webix) {
      return this._webixConfig.value
    }

    return this._webix.getValue()
  }

  /**
   * 定焦时间
   */
  ff: number = 0

  /**
   * 最大长度
   */
  maxlength?: number = undefined

  // private _maxlength!:number;

  /**
   * 文本描述
   */
  set label(nv: string) {
    if (!this._webix) {
      this._webixConfig.label = nv
      return
    }

    this._webix.define('label', nv)
    this._webix.refresh()
  }

  /**
   * 文本对齐方式
   */
  set labelAlign(nv: 'left' | 'right' | 'center') {
    if (!this._webix) {
      this._webixConfig.labelAlign = nv
      return
    }

    this._webix.define('labelAlign', nv)
    this._webix.refresh()
  }

  /**
   * 必填
   */
  set required(nv: boolean) {
    this._required = nv
    if (!this._webix) {
      this._webixConfig.required = nv
      return
    }
    this._webixConfig.required = nv
    this._webix.define('required', nv)
    this._webix.refresh()
  }

  /**
   * 文本宽度
   */
  set labelWidth(nv: number) {
    if (!this._webix) {
      this._webixConfig.labelWidth = nv
      return
    }

    this._webix.define('labelWidth', nv)
    this._webix.refresh()
  }

  /**
   * 禁用
   */
  set disabled(nv: boolean) {
    if (!this._webix) {
      this._webixConfig.disabled = nv
      return
    }

    if (nv) {
      this._webix.disable()
    } else {
      this._webix.enable()
    }
  }

  /**
   * 只读
   */
  set readonly(nv: boolean) {
    if (!this._webix) {
      this._webixConfig.readonly = nv
      return
    }

    this._webix.define('readonly', nv)
    this._webix.refresh()
  }

  /**
   * 水印
   */
  set prompt(nv: string) {
    if (!this._webix) {
      this._webixConfig.placeholder = nv
      return
    }

    this._webix.define('placeholder', nv)
    this._webix.refresh()
  }

  /**
   * 宽度
   */
  set width(nv: CtlInputWidth) {
    if (nv === 'auto' || typeof nv === 'undefined') {
      nv = undefined
    }

    if (!this._webix) {
      this._webixConfig.width = nv
      return
    }

    this._webix.define('width', nv)
    this._webix.refresh()
  }

  onValueChange(newV: any, oldV: any) {
    //validType[this.validType](newV);
  }

  onInputValue(value: any) {
    if (this.onValidate && typeof this.onValidate === 'function') {
      this._validateResult = YvEventDispatch(this.onValidate, <any>this, value);
    }
  }

  /**================ 私有属性 ===================**/
  _validateResult: boolean = true

  _required: boolean | undefined

  _id: any

  _maxlength: any

  anonymous_showTootip: any = () => {
    const result = this._resultToShowOrHide();
    if (result) {
      this._showTootip(result)
      this._showValidateError()
    } else {
      this._hideTootip()
      this._hideValidateError()
    }
  }

  anonymous_hideTootip: any = () => {
    const $input = $(this._webix.$view).find('input')
    if (document.activeElement !== $input[0]) {
      this._hideTootip()
    }
  }

  _addEnvent(input: any) {
    input.context.addEventListener('mouseenter', this.anonymous_showTootip);
    input.context.addEventListener('mouseleave', this.anonymous_hideTootip);
  }

  _removeEnvent(input: any) {
    input.context.removeEventListener('mouseenter', this.anonymous_showTootip);
    input.context.removeEventListener('mouseleave', this.anonymous_hideTootip);
  }

  _showValidateError() {
    $(this._webix.$view).addClass('yvan-validate-error');
  }

  _hideValidateError() {
    $(this._webix.$view).removeClass('yvan-validate-error');
  }

  _showTootip(msg: string) {
    YvanMessage.showTooltip(this, msg);
  }

  _hideTootip() {
    YvanMessage.hideTooltip(this);
  }

  _resultToShowOrHide(): any {
    if (!this.value) {
      if (this._required) {
        return "该项为必填项";
      }
    }
    else {
      // 只有校验值
      const that: M = <any>this;
      const result = YvEventDispatch(this.onValidate, that, this.value);
      if (result) {
        return result
      }
    }
    return null
  }

  _showValidate(
    msg: any,
    type: 'inputValidate' | 'changedValidate' | 'requiredValidate'
  ): boolean {
    let $input!: any
    if (
      this.constructor.name === 'CtlText' ||
      this.constructor.name === 'CtlSearch' ||
      this.constructor.name === 'CtlCombo'
    ) {
      $input = $(this._webix.$view).find('input')
    } else if (
      this.constructor.name === 'CtlDatePicker' ||
      this.constructor.name === 'CtlDateRangePicker' ||
      this.constructor.name === 'CtlMultiCombo' ||
      this.constructor.name === 'CtlMultiSelect'
    ) {
      $input = $(this._webix.$view).find('div.webix_inp_static')
    } else if (this.constructor.name === 'CtlSelect') {
      $input = $(this._webix.$view).find('select')
    } else {
      return true
    }

    switch (type) {
      case 'inputValidate': {
        if (msg) {
          $input.each((index: any, item: any) => {
            $(item).css({
              'background-color': '#ffdedb',
              'border-color': '#ff8d82'
            })
          })
          $(`#${this.id}_validate`).remove()
          $(this._webix.$view).append(
            `<div id="${this.id}_validate" style="position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;">${msg}</div>`
          )
          return false
        } else {
          $input.each((index: any, item: any) => {
            $(item).css({
              'background-color': '',
              'border-color': ''
            })
          })
          $(`#${this.id}_validate`).remove()
          return true
        }
      }
      case 'changedValidate': {
        if (msg) {
          $input.each((index: any, item: any) => {
            $(item).css({
              'background-color': '#ffdedb',
              'border-color': '#ff8d82'
            })
          })
          $(`#${this.id}_validate`).remove()
          $(this._webix.$view).append(
            `<div id="${this.id}_validate" style="position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;">${msg}</div>`
          )
          return false
        } else {
          $input.each((index: any, item: any) => {
            $(item).css({
              'background-color': '',
              'border-color': ''
            })
          })
          $(`#${this.id}_validate`).remove()
          return true
        }
      }
      case 'requiredValidate': {
        if (msg) {
          $input.each((index: any, item: any) => {
            $(item).css({
              'border-color': '#ff8d82'
            })
          })
          // $(`#${this.id}_validate`).remove();
          // $(this._webix.$view).append(`<div id="${this.id}_validate" style="position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;">必填项</div>`);
          return false
        } else {
          $input.each((index: any, item: any) => {
            $(item).css({
              'border-color': ''
            })
          })
          // $(`#${this.id}_validate`).remove();
          return true
        }
      }
    }
  }
}
