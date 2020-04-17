export default class CtlGridCellCheckbox {

    checkedToggle(vue: any, childSpan: any, id: any) {
        return function () {
            if (childSpan.classList.contains('checked')) {
                const index = vue.checkedIds.indexOf(id)
                if (index >= 0) {
                    vue.checkedIds.splice(index, 1)
                }
                childSpan.classList.remove('checked')

            } else {
                vue.checkedIds.push(id)
                childSpan.classList.add('checked')
            }
        }
    }

    innerRefresh(this: any, gridOptions: any) {
        const vue = gridOptions.api.vue
        const data = gridOptions.data
        const id = vue._getIdByRow(data)
        const childSpan = this.$el.querySelectorAll('.yvan-checkbox-switch')[0]
        if (!childSpan) {
            return
        }

        if (gridOptions.isCheckedIds) {
            //用来做勾选数据行用 checkedIds
            if (vue.checkedIds.indexOf(id) >= 0) {
                childSpan.classList.add('checked')
            } else {
                childSpan.classList.remove('checked')
            }

            this.$el.addEventListener('click', this.checkedToggle(vue, childSpan, id))

        } else {
            //用来做数据展示用
            childSpan.classList.add('disabled')
            if (typeof gridOptions.on === 'string') {
                //on 是个字符串
                if (gridOptions.on === '' + gridOptions.value) {
                    childSpan.classList.add('checked')
                }

            } else if (typeof gridOptions.on === 'function') {
                //on 是个函数
                if (gridOptions.on.call(vue, gridOptions.value, data)) {
                    childSpan.classList.add('checked')
                }
            }
        }
    }

    init(this: any, gridOptions: any) {
        this.$el = document.createElement('div')
        if (gridOptions.node.rowPinned) {
            //这是在添加行或结尾行的数据，不用任何展示
            return
        }

        this.$el.classList.add('yvan-checkbox')
        this.$el.innerHTML =
            '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>'

        this.innerRefresh(gridOptions)
    }

    getGui(this: any) {
        return this.$el
    }

    destroy() {
    }

    refresh(gridOptions: any) {
        this.innerRefresh(gridOptions)
    }
}
