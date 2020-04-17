import YvGridEditor from './YvGridEditor'

const YvGridEditorText = function () {
}

var isInput = false

_.extend(YvGridEditorText.prototype, YvGridEditor, {
    init(params) {
        YvGridEditor.init.apply(this, arguments)

        if (params.node.rowPinned) {
            this.isPinned = true
        }
        this.$el = document.createElement('div')
        this.$el.classList.add('ag-input-wrapper')
        this.$el.setAttribute('role', 'presentation')

        this.$el.innerHTML =
            '<input class="ag-cell-edit-input" type="text" autocomplete="off">'

        this.$input = this.$el.querySelectorAll('input')[0]
        this.$input.value = _.toString(params.value)

        this.$input.addEventListener('keydown', YvGridEditorText.prototype._onKeyDown.bind(this))
        this.$input.addEventListener('input', YvGridEditorText.prototype._onInput.bind(this))
        this.$input.addEventListener('change', YvGridEditorText.prototype._onChange.bind(this))
        this.$input.addEventListener('compositionstart', YvGridEditorText.prototype._onCompositionstart.bind(this))
        this.$input.addEventListener('compositionend', YvGridEditorText.prototype._onCompositionend.bind(this))
    },

    _onCompositionstart(e) {
        isInput = true;
    },

    _onCompositionend(e) {
        isInput = false;
        this._dealWithString(e)
    },

    _onKeyDown: function (e) {
        if (e.code === 'Tab' || e.code === 'Enter') {
            // Tab键/回车键, 完全拦截，跑下一个焦点控件
            e.stopPropagation()
            e.preventDefault()
            this.value = e.target.value

            if (typeof this.editParams.onValidate === 'function') {
                const r = this.editParams.onValidate(value)
                if (r) {
                    //有校验错误，不让跳转
                    return
                }
            }

            //写入离开原因的 code 编码
            this.leaveReason = e.code
            //这里会触发 this.getValue() 方法
            this.vue.gridApi.stopEditing()
        }
    },

    _onInput: function (e) {
        if (isInput) {
            return;
        }
        this._dealWithString(e)
    },

    _dealWithString: function (e) {
        let value = e.target.value
        if (this.type === 'number') {
            if (this.editParams.precision > 0) {
                value = value.replace(/[^\d.-]/g, '') //清除"数字"和"."以外的字符
                if (value.length > 1 && value.indexOf(".") > 1) {
                    var t;
                    while(1){
                        t = value;
                        value = value.replace(/^0/g, '');
                        if(t.length == value.length){
                            break;
                        }
                    }
                    //value = value.replace(/^0/g, '') //验证第一个字符不是0.
                }
                value = value.replace(/^\./g, '') //验证第一个字符是数字而不是.
                value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的.
                value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')//只允许输入一个小数点

                const r = eval('/^(\\-)*(\\d+)\\.(\\d{0,' + this.editParams.precision + '}).*$/')
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
        }

        e.target.value = value
        if (this.value === value) {
            //完全相等，不用通知更改
            return
        }
        this.value = value

        if (e.detail !== 'custom') {
            if (typeof this.editParams.onInput === 'function') {
                const r = this.editParams.onInput(this.value, e)
                if (typeof r !== 'undefined') {
                    this.value = r
                    e.target.value = r
                }

                if (typeof this.editParams.onValidate === 'function') {
                    this.editParams.onValidate(value)
                }
            }
        }
    },

    _onChange: function (e) {
        this.value = e.target.value

        if (typeof this.editParams.onChange === 'function') {
            this.editParams.onChange(this.value, e)
        }
    },

    destroy: function () {
        YvGridEditor.destroy.apply(this, arguments)
        this.$input.removeEventListener('keydown', this._onKeyDown.bind(this))
        this.$input.removeEventListener('input', this._onInput.bind(this))
        this.$input.removeEventListener('change', this._onChange.bind(this))
        this.$input.removeEventListener('compositionstart', YvGridEditorText.prototype._onCompositionstart.bind(this))
        this.$input.removeEventListener('compositionend', YvGridEditorText.prototype._onCompositionend.bind(this))
    },

    getGui: function () {
        return this.$el
    },

    afterGuiAttached: function () {
        YvGridEditor.afterGuiAttached.apply(this, arguments)
        this.$input.dispatchEvent(new CustomEvent('input', { detail: 'custom' }))

        if (this.focusAfterAttached) {
            this.$input.focus()
        }
    },

    getValue: function () {
        if (typeof this.leaveReason === 'undefined') {
            //不是按导航键移动的
            if (typeof this.editParams.onValidate === 'function') {
                const r = this.editParams.onValidate(value)
                if (r) {
                    //有校验错误，还原内容
                    return this.origin
                }
            }
        }

        if (typeof this.editParams.onCommit === 'function') {
            this.editParams.onCommit({
                data: this.data,
                colDef: this.colDef,
                column: this.column,
                newValue: this.value,
                isPinned: this.isPinned,
                vue: this.vue,
                leaveReason: this.leaveReason,
            })
        }
        return this.value
    },

    focusIn: function () {
        YvGridEditor.focusIn.apply(this, arguments)

        this.$input.focus()
        this.$input.select()
    },

    focusOut: function () {
        YvGridEditor.focusOut.apply(this, arguments)
    },
})

export default YvGridEditorText
