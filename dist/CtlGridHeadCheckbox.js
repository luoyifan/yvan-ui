var CtlGridHeadCheckbox = /** @class */ (function () {
    function CtlGridHeadCheckbox() {
    }
    CtlGridHeadCheckbox.prototype.checkedToggle = function (ctlGrid, gridOptions) {
        var that = this;
        return function () {
            if (ctlGrid.idField) {
                var domSpan = $(that.$el).find('.yvan-checkbox-switch');
                var isChecked = domSpan.is('.checked');
                // 当前表格的 全部行ID
                var dataIds = _.map(ctlGrid.getData(), function (v) { return _.get(v, ctlGrid.idField); });
                if (isChecked) {
                    // 取消全选
                    for (var i = 0; i < dataIds.length; i++) {
                        var id = dataIds[i];
                        var index = ctlGrid.checkedIds.indexOf(id);
                        if (index >= 0) {
                            ctlGrid.checkedIds.splice(index, 1);
                        }
                    }
                }
                else {
                    // 全选
                    for (var i = 0; i < dataIds.length; i++) {
                        var id = dataIds[i];
                        if (!_.includes(ctlGrid.checkedIds, id)) {
                            ctlGrid.checkedIds.push(id);
                        }
                    }
                }
                // 刷新
                ctlGrid.gridApi.refreshCells({
                    columns: ['__CB__'],
                    force: true
                });
            }
        };
    };
    CtlGridHeadCheckbox.prototype.innerRefresh = function (gridOptions) {
        var ctlGrid = gridOptions.api.vue;
        var domSpan = $(this.$el).find('.yvan-checkbox-switch');
        if (ctlGrid.idField) {
            ctlGrid.allCheckedBoxStateChanged = function () {
                // 当前表格的 全部行ID
                var dataIds = _.map(ctlGrid.getData(), function (v) { return _.get(v, ctlGrid.idField); });
                var allIn = true;
                for (var i = 0; i < dataIds.length; i++) {
                    var id = dataIds[i];
                    if (!_.includes(ctlGrid.checkedIds, id)) {
                        // 不是全部都包含
                        allIn = false;
                        break;
                    }
                }
                var isChecked = domSpan.is('.checked');
                if (isChecked) {
                    if (!allIn) {
                        domSpan.removeClass('checked');
                    }
                }
                else {
                    if (allIn) {
                        domSpan.addClass('checked');
                    }
                }
            };
        }
    };
    CtlGridHeadCheckbox.prototype.init = function (gridOptions) {
        var _this = this;
        this.$el = document.createElement('div');
        this.$el.classList.add('yvan-checkbox');
        this.$el.innerHTML =
            '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>';
        _.defer(function () {
            var ctlGrid = gridOptions.api.vue;
            _this.$el.addEventListener('click', _this.checkedToggle(ctlGrid, gridOptions));
            _this.innerRefresh(gridOptions);
        });
        // clearInterval(this.intervalHandle)
    };
    CtlGridHeadCheckbox.prototype.getGui = function () {
        return this.$el;
    };
    CtlGridHeadCheckbox.prototype.destroy = function () {
    };
    CtlGridHeadCheckbox.prototype.refresh = function (gridOptions) {
        this.innerRefresh(gridOptions);
    };
    return CtlGridHeadCheckbox;
}());
export default CtlGridHeadCheckbox;
//# sourceMappingURL=CtlGridHeadCheckbox.js.map