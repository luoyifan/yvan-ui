var CtlGridCellCheckbox = /** @class */ (function () {
    function CtlGridCellCheckbox() {
    }
    CtlGridCellCheckbox.prototype.checkedToggle = function (vue, childSpan, id) {
        return function () {
            if (childSpan.classList.contains('checked')) {
                var index = vue.checkedIds.indexOf(id);
                if (index >= 0) {
                    vue.checkedIds.splice(index, 1);
                }
                childSpan.classList.remove('checked');
            }
            else {
                vue.checkedIds.push(id);
                childSpan.classList.add('checked');
            }
            // 观测，是否显示"全选"框的函数
            if (vue.allCheckedBoxStateChanged) {
                vue.allCheckedBoxStateChanged();
            }
        };
    };
    CtlGridCellCheckbox.prototype.innerRefresh = function (gridOptions) {
        var vue = gridOptions.api.vue;
        var data = gridOptions.data;
        var id = vue._getIdByRow(data);
        var childSpan = this.$el.querySelectorAll('.yvan-checkbox-switch')[0];
        if (!childSpan) {
            return;
        }
        if (gridOptions.isCheckedIds) {
            //用来做勾选数据行用 checkedIds
            if (vue.checkedIds.indexOf(id) >= 0) {
                childSpan.classList.add('checked');
            }
            else {
                childSpan.classList.remove('checked');
            }
            // 观测，是否显示"全选"框的函数
            if (vue.allCheckedBoxStateChanged) {
                vue.allCheckedBoxStateChanged();
            }
        }
        else {
            //用来做数据展示用
            childSpan.classList.add('disabled');
            if (typeof gridOptions.on === 'string') {
                //on 是个字符串
                if (gridOptions.on === '' + gridOptions.value) {
                    childSpan.classList.add('checked');
                }
            }
            else if (typeof gridOptions.on === 'function') {
                //on 是个函数
                if (gridOptions.on.call(vue, gridOptions.value, data)) {
                    childSpan.classList.add('checked');
                }
            }
        }
    };
    CtlGridCellCheckbox.prototype.init = function (gridOptions) {
        this.$el = document.createElement('div');
        if (gridOptions.node.rowPinned) {
            //这是在添加行或结尾行的数据，不用任何展示
            return;
        }
        this.$el.classList.add('yvan-checkbox');
        this.$el.innerHTML =
            '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>';
        this.innerRefresh(gridOptions);
        var vue = gridOptions.api.vue;
        var childSpan = this.$el.querySelectorAll('.yvan-checkbox-switch')[0];
        var data = gridOptions.data;
        var id = vue._getIdByRow(data);
        this.$el.addEventListener('click', this.checkedToggle(vue, childSpan, id));
    };
    CtlGridCellCheckbox.prototype.getGui = function () {
        return this.$el;
    };
    CtlGridCellCheckbox.prototype.destroy = function () {
    };
    CtlGridCellCheckbox.prototype.refresh = function (gridOptions) {
        this.innerRefresh(gridOptions);
    };
    return CtlGridCellCheckbox;
}());
export default CtlGridCellCheckbox;
//# sourceMappingURL=CtlGridCellCheckbox.js.map