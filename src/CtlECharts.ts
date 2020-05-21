import { CtlBase } from './CtlBase'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { parseYvanPropChangeVJson } from './CtlUtils'
import webix from 'webix'

/**
 * 扩展 echarts 组件
 */
webix.protoUI(
  {
    name: 'echarts'
  },
  webix.ui.template
)

export class CtlECharts extends CtlBase<CtlECharts> {
  static create(module: any, vjson: any): CtlECharts {
    const that = new CtlECharts(_.cloneDeep(vjson))
    that._module = module

    if (vjson.hasOwnProperty('debugger')) {
      debugger
    }

    // 提取基础属性 onRender / ctlName / entityName 等等
    const yvanProp = parseYvanPropChangeVJson(vjson, [])

    // 将 yvanProp 合并至当前 CtlBase 对象
    _.assign(that, yvanProp)

    // 删除 vjson 所有数据, 替换为 template 语法
    _.forOwn(vjson, (value, key) => {
      delete vjson[key]
    })
    _.merge(vjson, {
      view: 'echarts',
      template: `<div role="echarts"></div>`,
      on: {
        onAfterRender: function (this: any) {
          that.attachHandle(this, vjson)
          that._resetECharts()
        },
        onDestruct(this: any) {
          if (that._echartsHandler) {
            that._echartsHandler.dispose()
            delete that._echartsHandler
          }
          that.removeHandle()
        }
      }
    })
    if (that.vjson.id) {
      vjson.id = that.vjson.id
    }
    return that
  }

  /*============================ 公共属性部分 ============================*/
  /**
   * 数据绑定完毕后触发
   */
  onClick?: YvEvent<CtlECharts, any>

  setOption(option: any, opts?: any): void {
    this._echartsHandler.setOption(option, opts)
    _.defer(() => {
      this._echartsHandler.resize()
    })
  }

  public get handle() {
    return <any>this._echartsHandler
  }

  // setOption(option: echarts.EChartOption, opts?: echarts.EChartsOptionConfig): void {
  //     this._echartsHandler.setOption(option, opts);
  //     _.defer(() => {
  //         this._echartsHandler.resize();
  //     });
  // }
  //
  // setOption2(option: echarts.EChartOption | echarts.EChartsResponsiveOption, notMerge?: boolean, lazyUpdate?: boolean): void {
  //     this._echartsHandler.setOption(option, notMerge, lazyUpdate);
  //     _.defer(() => {
  //         this._echartsHandler.resize();
  //     });
  // }

  resize() {
    this._echartsHandler.resize()
  }

  clear() {
    this._echartsHandler.clear()
  }

  /*============================ 私有属性部分 ============================*/
  private _echartsHandler!: echarts.ECharts

  private _resetECharts() {
    const $el = $(this._webix._viewobj).find('[role="echarts"]')[0]
    let el: any = $el
    this._echartsHandler = echarts.init(el)

    this._echartsHandler.on('click', (params: any) => {
      YvEventDispatch(this.onClick, this, params)
    })
  }
}
