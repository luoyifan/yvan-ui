export default class YvGridFilterSet {

    // The init(params) method is called on the filter once. See below for details on the
    // parameters.
    init(params) {
        this.setupDOM(params)
        const that = this
        const data = params.data

        //======================= 全选按钮 =======================
        const $selectAll = $(this.$el).find('[ref="eSelectAll"]')
        $selectAll.on('click', () => {
            if (this.checkedData.length >= this.data.length) {
                //全选状态，点击后属于全不选
                this.checkedData = []
            } else {
                //其他情况，都是全选
                this.checkedData = _.clone(this.data)
            }
            this.refreshState()
        })
        this.$selectAll = $selectAll

        //======================= 确定/清空 =======================
        const $clear = $(this.$el).find('[ref="eClearButton"]')
        const $apply = $(this.$el).find('[ref="eApplyButton"]')
        $clear.on('click', () => {
            //清空就是全选
            that.checkedData = _.clone(that.data)
            that.refreshState()
            params.filterChangedCallback()
            if (typeof that.hidePopup === 'function') {
                that.hidePopup()
            }
        })
        $apply.on('click', () => {
            //确定
            params.filterChangedCallback()
            if (typeof that.hidePopup === 'function') {
                that.hidePopup()
            }
        })
        this.$clear = $clear
        this.$apply = $apply

        //======================= 构建数据 =======================
        const $container = $(this.$el).find('.ag-virtual-list-container')
        $container.css('height', (data.length * 20 + 2) + 'px')

        let h = 0
        _.each(data, item => {
            $container.append(
                '<div class="ag-virtual-list-item" style="top: ' + h + 'px;" RefDataValue="' + item.id + '">' +
                '  <label class="ag-set-filter-item">\n' +
                '    <div class="ag-filter-checkbox"><span class="ag-icon ag-icon-checkbox-checked" unselectable="on"></span></div>\n' +
                '    <span class="ag-filter-value">' + item.text + '</span>\n' +
                '  </label>' +
                '</div>'
            )
            h += 20
        })

        //ag-icon-checkbox-indeterminate
        $container.on('click', '.ag-virtual-list-item', function () {
            //const $cb = $(this).find('span.ag-icon');
            const cv = $(this).attr('RefDataValue')
            const fi = _.find(that.checkedData, item => _.toString(item.id) === cv)
            if (fi) {
                //已经勾选了，要删掉他
                _.remove(that.checkedData, item => _.toString(item.id) === cv)

            } else {
                //没有勾选，要加上他
                const af = _.find(that.data, item => _.toString(item.id) === cv)
                that.checkedData.push({ ...af })
            }

            //刷新状态
            that.refreshState()
        })

        this.data = data
        this.checkedData = _.clone(this.data)
        this.$container = $container
    }

    refreshState() {
        const $cb = this.$selectAll.find('span.ag-icon')

        if (this.checkedData.length >= this.data.length) {
            //已经全选
            $cb.attr('class', 'ag-icon ag-icon-checkbox-checked')
            this.$container.find('[RefDataValue]').find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-checked')

        } else if (this.checkedData.length === 0) {
            //一个没选
            $cb.attr('class', 'ag-icon ag-icon-checkbox-unchecked')
            this.$container.find('[RefDataValue]').find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-unchecked')

        } else {
            //其他情况
            $cb.attr('class', 'ag-icon ag-icon-checkbox-indeterminate')

            const that = this
            this.$container.find('[RefDataValue]').each(function () {
                const $dom = $(this)
                const v = $dom.attr('RefDataValue')
                const fi = _.find(that.checkedData, item => item.id === v)
                if (fi) {
                    //有属性，加上钩
                    $dom.find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-checked')

                } else {
                    //没属性，不打勾
                    $dom.find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-unchecked')
                }
            })
        }
    }

    // Returns the GUI for this filter. The GUI can be a) a string of html or b) a DOM element or
    // node.
    getGui() {
        return this.$el
    }

    // Return true if the filter is active. If active than 1) the grid will show the filter icon in the column
    // header and 2) the filter will be included in the filtering of the data.
    isFilterActive() {
        //如果不是全选，就是没激活
        return (this.checkedData.length < this.data.length)
    }

    // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
    // filter fails, then the row will be excluded from the final set. A params object is supplied
    // with attributes node (the rowNode the grid creates that wraps the data) and data (the data
    // object that you provided to the grid for that row).
    doesFilterPass(params) {
        console.log('doesFilterPass')
    }

    // Gets the filter state. If filter is not active, then should return null/undefined.
    // The grid calls getModel() on all active filters when gridApi.getFilterModel() is called.
    getModel() {
        if (this.checkedData.length >= this.data.length) {
            //全选，不需要带任何条件
            return
        }
        return {
            filterType: 'set',
            filter: this.checkedData,
        }
    }

    // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
    // The grid will pass undefined/null to clear the filter.
    setModel(model) {
        if (!model) {
            //清空筛选
            this.checkedData = _.clone(this.data)
        } else {
            //设置筛选条件
        }
    }

    // Gets called every time the popup is shown, after the gui returned in
    // getGui is attached to the DOM. If the filter popup is closed and reopened, this method is
    // called each time the filter is shown. This is useful for any logic that requires attachment
    // before executing, such as putting focus on a particular DOM element. The params has one
    // callback method 'hidePopup', which you can call at any later point to hide the popup - good
    // if you have an 'Apply' button and you want to hide the popup after it is pressed.
    afterGuiAttached({ hidePopup }) {
        this.hidePopup = hidePopup
        this.refreshState()
    }

    // Gets called when the Column is destroyed. If your custom filter needs to do
    // any resource cleaning up, do it here. A filter is NOT destroyed when it is
    // made 'not visible', as the gui is kept to be shown again if the user selects
    // that filter again. The filter is destroyed when the column it is associated with is
    // destroyed, either new columns are set into the grid, or the grid itself is destroyed.
    destroy() {
        this.$selectAll.off()
        this.$container.off()
        this.$clear.off()
        this.$apply.off()
    }

    // If floating filters are turned on for the grid, but you have no floating filter
    // configured for this column, then the grid will check for this method. If this
    // method exists, then the grid will provide a read only floating filter for you
    // and display the results of this method. For example, if your filter is a simple
    // filter with one string input value, you could just return the simple string
    // value here.
    getModelAsString(model) {
        console.log('getModelAsString')
    }

    setupDOM(params) {

        this.$el = document.createElement('div')
        const html =
            '<div class="ag-filter-body-wrapper">\n' +
            '  <div>\n' +
            '    <div class="ag-filter-header-container" role="presentation" style="width: 200px;">\n' +
            '      <label ref="eSelectAll" class="ag-set-filter-item">\n' +
            '        <div class="ag-filter-checkbox">\n' +
            '          <span class="ag-icon ag-icon-checkbox-checked" unselectable="on"></span>\n' +
            '        </div>\n' +
            '        <span class="ag-filter-value">全选</span>\n' +
            '      </label>\n' +
            '    </div>\n' +
            '    <div class="ag-set-filter-list" role="presentation">\n' +
            '      <div class="ag-virtual-list-viewport">\n' +
            '\n' +
            '\n' +
            '        <div class="ag-virtual-list-container" style="height: 180px;">' +
            '        </div>\n' +
            '\n' +
            '\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '</div>\n' +
            '<div class="ag-filter-apply-panel" ref="eButtonsPanel">\n' +
            '  <button type="button" ref="eClearButton">清空</button>\n' +
            '  <button type="button" ref="eApplyButton">确定</button>\n' +
            '</div>'
        this.$el.innerHTML = html
    }
}
