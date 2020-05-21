import { YvEvent, YvEventDispatch } from './YvanEvent'
import { BaseModule } from './YvanUIModule'
import { isDesignMode } from './DesignHelper'
import webix from 'webix'

export abstract class CtlBase<T> {
  /**
   * 渲染时触发
   */
  public onRender?: YvEvent<CtlBase<T>, void>

  /**
   * 实体类属性
   */
  public entityName?: string

  /**
   * 控件名
   */
  public ctlName?: string

  /**
   * 最初始时候的 json
   */
  public vjson: any

  /**
   * 定焦时间
   */
  public ff: number = 0

  /**
   * webix API
   * webix.ui 渲染完毕之后，webix对象就存放在这里
   */
  protected _webix: any

  /**
   * 控件所在的用户模块
   */
  protected _module!: BaseModule<any, any, any>

  /**
   * 为 entityName 进行 watch 的解绑函数
   */
  private _entityWatch?: Function

  /**
   * 在 webix 还没有初始化 (webix.ui) 的时候
   * 设置的属性就临时存放在这里. 最终会作为 webix 的属性来渲染
   */
  protected _webixConfig: any

  constructor(vjson: any) {
    this.vjson = _.cloneDeep(vjson)

    if (vjson.hasOwnProperty('debugger')) {
      debugger
    }
  }

  /**
   * 强制组件获得焦点
   */
  public focus(): void {
    if (!this._webix) {
      return
    }
    this._webix.focus()
  }

  /**
   * 设置正在读取中的状态
   */
  set loading(nv: boolean) {
    if (nv) {
      webix.extend(this._webix, webix.OverlayBox)
      //this._webix.showOverlay("<div style='...'>There is no data</div>");
      this._webix.showOverlay('Loading...')
    } else {
      this._webix.hideOverlay()
    }
  }

  /**
   * 获取模块
   */
  public getModule() {
    return this._module
  }

  /**
   * 组件被渲染后触发
   */
  protected attachHandle(webixHandler: any, vjson: any) {
    this._webix = webixHandler
    this._module = this._webix.$scope

    YvEventDispatch(this.onRender, this, undefined)
    this.refreshState()

    if (_.has(vjson, 'entityName')) {
      _.set(this._module, '_entityCtlMapping.' + vjson['entityName'], this)
    }
  }

  protected getCtlElements(element: any) {
    let entityArray: any[] = []
    if (_.isArray(element)) {
      element.forEach((item: any) => {
        entityArray = _.union(entityArray, this.getCtlElements(item))
      })
    }
    else if (_.isObject(element)) {
      if (element.hasOwnProperty("view")) {
        let items = _.get(element, "view");
        entityArray = _.union(entityArray, [items]);
      }
      if (element.hasOwnProperty("rows")) {
        let items = _.get(element, "rows");
        items.forEach((item: any) => {
          entityArray = _.union(entityArray, this.getCtlElements(item))
        });
      }
      else if (element.hasOwnProperty("cols")) {
        let items = _.get(element, "cols");
        items.forEach((item: any) => {
          entityArray = _.union(entityArray, this.getCtlElements(item))
        });
      }
      else if (element.hasOwnProperty("elements")) {
        let items = _.get(element, "elements");
        items.forEach((item: any) => {
          entityArray = _.union(entityArray, this.getCtlElements(item))
        });
      }
      else if (element.hasOwnProperty("body")) {
        let item = _.get(element, "body");
        entityArray = _.union(entityArray, this.getCtlElements(item))
      }
    }
    return entityArray;
  }

  /**
   * 组件被移除后触发
   */
  protected removeHandle() {
    const d = this._webix
    if (!d) {
      return
    }

    this._webix = undefined
    if (d) {
      d.destructor()
    }
    this.refreshState()
  }

  /**
   * 控件 value 值发生变化后，设置 entityName 对应的值
   */
  protected changeToEntity(value: any) {
    if (this.entityName) {
      // 带 entityName 实体绑定
      _.set(this._module, this.entityName, value)
    }
  }

  /**
   * vue 或 webix 组件被设置后触发
   */
  protected refreshState() {
    if (isDesignMode()) {
      return
    }
    if (this._webix) {
      /* ================================ 安装 ================================ */
      if (this.ctlName) {
        // 带 ctlName 控件属性
        this._module.refs[this.ctlName] = this
      }

      if (this.entityName) {
        // 带 entityName 实体绑定
        this._entityWatch = this._module.$watch(
          this.entityName,
          (nv: any, ov: any) => {
            _.set(this, 'value', nv)
          },
          { immediate: true }
        )
      }

      return
    }

    /* ================================ 卸载 ================================ */
    if (this.ctlName) {
      // 删除控件
      if (this._module) {
        delete this._module.refs[this.ctlName]
      }
    }

    if (this._entityWatch) {
      // 解除绑定
      this._entityWatch()
      delete this._entityWatch
    }

    delete this._module
  }

  /**
   * 设置隐藏
   */
  set hidden(nv: boolean) {
    this._webixConfig.hidden = nv
    if (!this._webix) {
      return
    }

    if (nv) {
      this._webix.hide()
    } else {
      this._webix.show()
    }
  }

  get hidden(): boolean {
    return this._webixConfig.hidden
  }
}
