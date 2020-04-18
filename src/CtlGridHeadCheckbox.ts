export default class CtlGridHeadCheckbox {

    checkedToggle(ctlGrid: any, gridOptions: any) {
        const that: any = this;
        return function () {
            if (ctlGrid.idField) {

                const domSpan = $(that.$el).find('.yvan-checkbox-switch');
                const isChecked = domSpan.is('.checked');
                // 当前表格的 全部行ID
                const dataIds = _.map(ctlGrid.getData(), v => _.get(v, ctlGrid.idField));

                if (isChecked) {
                    // 取消全选
                    for (let i = 0; i < dataIds.length; i++) {
                        const id = dataIds[i];
                        const index = ctlGrid.checkedIds.indexOf(id)
                        if (index >= 0) {
                            ctlGrid.checkedIds.splice(index, 1)
                        }
                    }

                } else {
                    // 全选
                    for (let i = 0; i < dataIds.length; i++) {
                        const id = dataIds[i];
                        if (!_.includes(ctlGrid.checkedIds, id)) {
                            ctlGrid.checkedIds.push(id);
                        }
                    }
                }

                // 刷新
                ctlGrid.gridApi.refreshCells({
                    columns: ['__CB__'],
                    force: true
                })
            }
        }
    }

    innerRefresh(this: any, gridOptions: any) {
        const ctlGrid = gridOptions.api.vue
        const domSpan = $(this.$el).find('.yvan-checkbox-switch');

        if (ctlGrid.idField) {
            ctlGrid.allCheckedBoxStateChanged = () => {
                // 当前表格的 全部行ID
                const dataIds = _.map(ctlGrid.getData(), v => _.get(v, ctlGrid.idField));

                let allIn = true;
                for (let i = 0; i < dataIds.length; i++) {
                    const id = dataIds[i];
                    if (!_.includes(ctlGrid.checkedIds, id)) {
                        // 不是全部都包含
                        allIn = false;
                        break;
                    }
                }

                const isChecked = domSpan.is('.checked');
                if (isChecked) {
                    if (!allIn) {
                        domSpan.removeClass('checked');
                    }
                } else {
                    if (allIn) {
                        domSpan.addClass('checked');
                    }
                }
            }
        }
    }

    init(this: any, gridOptions: any) {
        this.$el = document.createElement('div')

        this.$el.classList.add('yvan-checkbox')
        this.$el.innerHTML =
            '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>'

        _.defer(() => {
            const ctlGrid = gridOptions.api.vue
            this.$el.addEventListener('click', this.checkedToggle(ctlGrid, gridOptions))
            this.innerRefresh(gridOptions)
        });

        // clearInterval(this.intervalHandle)
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