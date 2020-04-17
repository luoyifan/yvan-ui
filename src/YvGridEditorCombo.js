import YvGridEditor from './YvGridEditor'
import Vue from 'vue'
import util from './util'

const YvGridEditorCombo = function (params) {
}

_.extend(YvGridEditorCombo.prototype, YvGridEditor, {
    init(params) {
        YvGridEditor.init.apply(this, arguments)
        this.options = params.options
        if (params.node.rowPinned) {
            this.isPinned = true
        }

        const that = this
        this.vv = new Vue({
            data: {
                dataDisplay: params.options,
                data: params.options,
                value: _.toString(params.value),
            },
            methods: {
                focus() {
                    this.$refs.ss.focus()
                },
                _input(value) {
                    if (typeof that.editParams.onInput === 'function') {
                        const r = that.editParams.onInput(value)
                        if (typeof r !== 'undefined') {
                            value = r
                        }
                    }
                    let validPass = true
                    if (typeof that.editParams.onValidate === 'function') {
                        const r = that.editParams.onValidate(value)
                        if (r) {
                            //有校验错误，不让跳转
                            validPass = false
                        }
                    }

                    this.value = that.value = value

                    //只要选定一个值, 并且校验通过，立刻触发下一个焦点
                    if (validPass) {
                        if (typeof that.editParams.onChange === 'function') {
                            that.editParams.onChange(this.value)
                        }

                        //写入离开原因的 code 编码
                        that.leaveReason = 'Enter'
                        //这里会触发 this.getValue() 方法
                        try {
                            that.vue.gridApi.stopEditing()
                        } catch (err) {

                        }
                    }
                },
            },
            render: function (h) {

                const options = _.map(this.dataDisplay, (item) => {
                    return h('el-option', {
                        props: {
                            key: item.id,
                            value: item.id,
                            label: item.text,
                        }
                    })
                })

                return h('div', {
                    class: { 'ag-input-wrapper': true },
                    props: {
                        role: 'presentation'
                    }
                }, [
                    h('el-select', {
                        ref: 'ss',
                        class: { 'ag-cell-edit-input': true },
                        props: {
                            clearable: true,
                            filterable: true,
                            placeholder: '请选择',
                            multiple: false,
                            value: this.value,
                            'filter-method': (input) => {
                                this.dataGroupDisplay = []
                                if (!input) {
                                    this.dataDisplay = this.data
                                } else {
                                    input = input.toLowerCase()
                                    this.dataDisplay = [...this.data].filter(item =>
                                        util.getPyFirstLetter(item.text).toLowerCase().indexOf(input) >= 0 ||
                                        input.indexOf(item.text.toLowerCase()) >= 0
                                    )
                                }
                            },
                        },
                        on: {
                            change: this._input.bind(this),
                            'visible-change': (isDroped) => {
                                if (!isDroped) {
                                    this.dataDisplay = this.data
                                }
                            }
                        },
                        nativeOn: {
                            keydown: function (e) {
                                if (e.keyCode === 13) {
                                    e.stopPropagation()
                                    e.preventDefault()
                                }
                            },
                        }
                    }, options)
                ])
            }
        })
        this.vv.$mount()
    },

    getGui() {
        return this.vv.$el
    },

    afterGuiAttached() {
        YvGridEditor.afterGuiAttached.apply(this, arguments)
        this.vv.focus()

        //setTimeout(() => {
        //    this.vv.open()
        //    this.vv.$nextTick(() => {
        //        debugger
        //    })
        //}, 1000)
    },

    getValue() {
        if (typeof this.leaveReason === 'undefined') {
            //不是按导航键移动的, 需要触发校验
            if (typeof this.editParams.onValidate === 'function') {
                const r = this.editParams.onValidate(value)
                if (r) {
                    //有校验错误，还原内容
                    return this.origin
                }
            }
        }

        //校验通过，调用 commit 并返回选定的新值
        if (typeof this.editParams.onCommit === 'function') {
            this.editParams.onCommit({
                data: this.data,
                colDef: this.colDef,
                column: this.column,
                newValue: this.value,
                leaveReason: this.leaveReason,
            })
        }
        return this.value
    },

    destroy() {
        YvGridEditor.destroy.apply(this, arguments)
        this.vv.$destroy()
    },

    focusIn() {
        YvGridEditor.focusIn.apply(this, arguments)
        this.vv.focus()
    },

    focusOut() {
        YvGridEditor.focusOut.apply(this, arguments)
    },
})

export default YvGridEditorCombo
