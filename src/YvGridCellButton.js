const YvGridCellButton = function () {
}

function buildHTML(params) {
    const arr = []
    const func = []
    const {buttons, rowIndex, data, api, column} = params

    if (typeof buttons === 'object' && buttons.constructor === Array) {
        _.each(buttons, (btn) => {
            if (typeof btn.render === 'function') {
                const r = btn.render.call(this, rowIndex, data)
                if (r !== true) {
                    return
                }
            } else if (typeof btn.render === 'boolean' && !btn.render) {
                return
            }

            arr.push(
                '<a class="yvan-cell-button">' +
                (typeof btn.iconCls === 'string' ? '<i class="' + btn.iconCls + '"></i>' : '') +
                btn.text +
                '</a>')
            func.push(btn.onClick)
        })
    }

    this.$el.innerHTML =
        '<div class="yvan-cell-buttons">' +
        arr.join('') +
        '</div>'

    const $btns = this.$el.querySelectorAll('.yvan-cell-button')
    for (let i = 0; i < $btns.length; i++) {
        const btn = $btns[i]
        const fun = func[i]
        if (typeof func[i] === 'function') {
            btn.addEventListener('click', function () {
                fun.call(api.vue, data, rowIndex, column.colId)
            })
        } else if (typeof func[i] === 'object') {
            btn.addEventListener('click', function () {
                const module = api.vue.vcxt.model.module
                YvInvoke(api.vue, func[i], module, [data, rowIndex, column.colId])
            })
        }
    }
    this.$btns = $btns
    this.func = func
}

_.extend(YvGridCellButton.prototype, {
    init(params) {
        this.$el = document.createElement('div')
        buildHTML.call(this, params)
    },

    getGui() {
        return this.$el
    },

    destroy() {
        for (let i = 0; i < this.$btns.length; i++) {
            const btn = this.$btns[i]
            btn.removeEventListener('click', this.func[i])
        }
    },

    refresh(params) {
        buildHTML.call(this, params)
    }
})

export default YvGridCellButton
