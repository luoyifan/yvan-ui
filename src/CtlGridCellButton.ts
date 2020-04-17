import { YvEventDispatch } from './YvanEvent'

export default class CtlGridCellButton {
  $el: any
  $btns!: any[]
  func!: any[]

  init(params: any) {
    this.$el = document.createElement('div')
    this._buildHTML.call(this, params)
  }

  getGui() {
    return this.$el
  }

  destroy() {
    for (let i = 0; i < this.$btns.length; i++) {
      const btn = this.$btns[i]
      btn.removeEventListener('click', this.func[i])
    }
  }

  refresh(params: any) {
    this._buildHTML.call(this, params)
  }

  private _buildHTML(this: any, params: any) {
    const arr: Array<any> = []
    const func: Array<any> = []

    const { buttons, rowIndex, data, api, column } = params

    if (typeof buttons === 'object' && buttons.constructor === Array) {
      _.each(buttons, btn => {
        if (typeof btn.render === 'function') {
          const r = btn.render.call(this, rowIndex, data)
          if (r !== true) {
            return
          }
        } else if (typeof btn.render === 'boolean' && !btn.render) {
          return
        }

        arr.push(
          `<a class="yv-grid-button ${btn.cssType}">` +
            (typeof btn.iconCls === 'string'
              ? '<i class="' + btn.iconCls + '"></i>'
              : '') +
            btn.text +
            '</a>'
        )
        func.push(btn.onClick)
      })
    }

    this.$el.innerHTML =
      '<div class="yv-grid-buttons">' + arr.join('') + '</div>'

    const $btns = this.$el.querySelectorAll('.yv-grid-button')
    for (let i = 0; i < $btns.length; i++) {
      const btn = $btns[i]
      const fun = func[i]
      btn.addEventListener('click', () => {
        const ctl = api.vue
        const module = api.vue._webix.$scope
        YvEventDispatch(
          fun,
          ctl,
          { data, rowIndex, colId: column.colId },
          module
        )
      })
    }
    this.$btns = $btns
    this.func = func
  }
}
