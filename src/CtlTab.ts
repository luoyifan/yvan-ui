import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { wrapperWebixConfig } from './YvanRender'
import { createContextMenu } from './CtlContextMenu'

export class CtlTab extends CtlBase<CtlTab> {
  static create(vjson: any): CtlTab {
    const that = new CtlTab(vjson)

    if (vjson.hasOwnProperty('debugger')) {
      debugger
    }

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      'tabbarContextMenu',
      'defaultTabIndex',
      'onTabChanged'
    ])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
    _.assign(that, yvanProp)

    // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
    _.merge(vjson, that._webixConfig, {
      on: {
        onInited(this: any) {
          that.attachHandle(this)
          _.defer(() => {
            if (yvanProp.defaultTabIndex > 0) {
              // 默认打开的 tab 序号
              that._webix.getMultiview()._cells[yvanProp.defaultTabIndex].show()
            }

            if (that._menuConfig) {
              const menuHandler = createContextMenu(
                that._menuConfig,
                that.getModule()
              )
              menuHandler.attachTo(that._webix.getTabbar().$view)
            }
          })
        }
      },
      tabbar: {
        // close: true,
        on: {
          onAfterDelete() {
            that.removeHandle()
          },
          onChange(newBodyId: string) {
            YvEventDispatch(that.onTabChanged, that, newBodyId)
          }
        }
      },
      multiview: {
        keepViews: true // 没有显示的选项卡也要渲染DOM, 否则 aggrid 会出问题
        // fitBiggest: true,    //始终以最大的 tab 页签为大小
      }
    })

    return that
  }

  defaultTabIndex = 0

  /**
   * 当前选项卡发生变化时触发
   */
  onTabChanged?: YvEvent<CtlTab, any>

  /**
   * tabbar 上的快捷菜单
   */
  set tabbarContextMenu(config: any) {
    this._menuConfig = config
  }

  /**
   * 关闭所有允许关闭的标签
   */
  closeAll(butIds: Array<any>) {
    const cellId = new Array<any>()
    _.each(this._webix.getMultiview()._cells, cell => {
      if (!_.includes(butIds, cell.config.id)) {
        cellId.push(cell.config.id)
      }
    })

    _.each(cellId, id => {
      this._webix.removeView(id)
    })
  }

  /**
   * 添加一个模块到标签页执行
   * @param text 标签标题
   * @param id 标签id
   * @param vue 模块(Class)
   */
  addModule(text: string, id: string, vue: any) {
    const that = this
    const cfg = vue.buildView()

    const tabId = this._webix.addView({
      header: text,
      close: true,
      body: _.merge(cfg, {
        id: id,
        on: {
          onDestruct() {
            vue.$destroy()
            delete vue._isLoadInvoked
          },
          onViewShow(this: any) {
            if (!vue._isLoadInvoked) {
              vue._webixId = tabId
              vue._isLoadInvoked = true
              vue.onLoad()
            }

            vue.onShow()
          }
          // onViewShow: _.once(() => {
          //     // 触发 onLoad 方法
          //     // 注意这有个 bug, viewTab 的最后一个标签，千万不能删除
          //     vue._webixId = tabId;
          //     vue.onLoad();
          // })
        }
      })
    })

    this._webix.setValue(tabId)
    if (this.tabCount === 1) {
      // 这里有个 bug
      // 如果是第一个被打开的标签，会不触发 onTabChanged 事件
      YvEventDispatch(that.onTabChanged, that, id)
    }
  }

  /**
   * 添加一个 Vjson 到标签
   * @param text 标签标题
   * @param id 标签id
   * @param vjson 界面描述片段
   */
  addContent(text: string, id: string, vjson: any, opts?: any) {
    const that = this

    if (this.selectTab(id)) {
      // 已经打开了页面
      return
    }

    let close = true
    if (opts && opts.close === false) {
      close = false
    }

    wrapperWebixConfig(this.getModule(), vjson)

    const tabId = this._webix.addView({
      header: text,
      close,
      body: _.merge(vjson, {
        id: id
      })
    })

    this._webix.setValue(tabId)
    if (this.tabCount === 1) {
      // 这里有个 bug
      // 如果是第一个被打开的标签，会不触发 onTabChanged 事件
      YvEventDispatch(that.onTabChanged, that, id)
    }
  }

  /**
   * 获取 tab 标签数量
   */
  get tabCount(): number {
    return this._webix.getMultiview()._cells.length
  }

  /**
   * 选定某个标签
   */
  public selectTab(id: string): boolean {
    if (webix.$$(id)) {
      webix.$$(id).show()
      return true
    }
    return false
  }

  /**
   * 判断标签是否存在
   */
  public tabExsit(id: string): boolean {
    if (webix.$$(id)) {
      return true
    }
    return false
  }

  /**
   * 获取当前选中的 tabId
   */
  public getSelectedTabId(): any {
    return this._webix.getTabbar().getValue()
  }

  /* =============================================== 以下部分为私有函数 =============================================== */

  /**
   * 快捷菜单句柄
   */
  _menuConfig: any = undefined
}
