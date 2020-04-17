import CtlGridEditor from './CtlGridEditor'

export default class CtlGridEditorCombo extends CtlGridEditor {
  isPinned: any
  options: any
  $el: any

  init(params: any) {
    super.init(params)
    this.options = params.options
    if (params.node.rowPinned) {
      this.isPinned = true
    }

    const $dom = $('<input class="tmp-combo" />')

    this.$el = $dom[0]
    const that = this
  }

  getGui() {
    return this.$el
  }

  afterGuiAttached() {
    // YvGridEditor.afterGuiAttached.apply(this, arguments)
    // this.vv.focus()
    //setTimeout(() => {
    //    this.vv.open()
    //    this.vv.$nextTick(() => {
    //        debugger
    //    })
    //}, 1000)
  }

  getValue() {
    // if (typeof this.leaveReason === 'undefined') {
    //     //不是按导航键移动的, 需要触发校验
    //     if (typeof this.editParams.onValidate === 'function') {
    //         const r = this.editParams.onValidate(value)
    //         if (r) {
    //             //有校验错误，还原内容
    //             return this.origin
    //         }
    //     }
    // }
    //
    // //校验通过，调用 commit 并返回选定的新值
    // if (typeof this.editParams.onCommit === 'function') {
    //     this.editParams.onCommit({
    //         data: this.data,
    //         colDef: this.colDef,
    //         column: this.column,
    //         newValue: this.value,
    //         leaveReason: this.leaveReason,
    //     })
    // }
    // return this.value
  }

  destroy() {
    super.destroy()
    // this.vv.$destroy()
  }

  focusIn() {
    super.focusIn()
    // this.vv.focus()
  }

  focusOut() {
    super.focusOut()
  }
}
