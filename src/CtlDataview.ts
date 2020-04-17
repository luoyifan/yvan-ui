import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvDataSource } from './YvanDataSourceImp'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { DataSource } from './YvanDataSource'
import { CtlDataviewDefault } from './CtlDefaultValue'

export class CtlDataview extends CtlBase<CtlDataview> {
  static create(vjson: any): CtlDataview {
    const that = new CtlDataview(vjson)

    _.defaultsDeep(vjson, CtlDataviewDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      // 'data',
      'dataSource',
      'onItemSelect',
      'onItemClick',
      'onItemDblClick',
      'onDataComplete'
    ])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
    _.assign(that, yvanProp)

    // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
    _.merge(vjson, that._webixConfig, {
      select: true,
      on: {
        onInited(this: any) {
          that.attachHandle(this)
        },
        onAfterDelete() {
          that.removeHandle()
        },
        onItemClick(this: any, id: any) {
          const item = this.getItem(id)
          YvEventDispatch(that.onItemClick, that, item)
        },
        onItemDblClick(this: any, id: any) {
          const item = this.getItem(id)
          YvEventDispatch(that.onItemDblClick, that, item)
        },
        onAfterSelect(this: any, id: any) {
          const item = this.getItem(id)
          YvEventDispatch(that.onItemSelect, that, item)
        }
      }
    })

    return that
  }

  /**
   * 树上的数据
   */
  data?: any[]

  /**
   * 树节点被点击后触发
   */
  onItemSelect?: YvEvent<CtlDataview, any>

  /**
   * 树节点被点击后触发
   */
  onItemClick?: YvEvent<CtlDataview, any>

  /**
   * 树节点被双击后触发
   */
  onItemDblClick?: YvEvent<CtlDataview, any>

  /**
   * 数据绑定完成后触发
   */
  onDataComplete?: YvEvent<CtlDataview, any>

  /**
   * 设置值
   */
  set value(nv: any) {
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
    }
  }

  /**
   * 获取值
   */
  get value(): any {
    if (!this._webix) {
      return this._webixConfig.value
    }
    return this._webix.getValue()
  }

  /**
   * 设置数据
   */
  set dataReal(nv: any[]) {
    // dataSource call back
    this._webix.clearAll()
    this._webix.parse(nv)
  }

  /**
   * 获取数据源设置
   */
  get dataSource(): DataSource<CtlDataview> {
    return this._dataSource
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: DataSource<CtlDataview>) {
    this._dataSource = nv
    this._rebindDataSource()
  }

  /**
   * 重新请求数据
   */
  public reload(): void {
    if (this.dataSourceBind && this.dataSourceBind.reload) {
      this.dataSourceBind.reload()
    }
  }

  /* =============================================== 以下部分为私有函数 =============================================== */

  //数据源设置
  private _dataSource: DataSource<CtlDataview>

  //数据源管理器
  private dataSourceBind?: YvDataSource<CtlDataview>

  //重新绑定数据源
  private _rebindDataSource() {
    if (this.dataSourceBind) {
      this.dataSourceBind.destory()
      this.dataSourceBind = undefined
    }

    if (this._webix && this.getModule()) {
      this.dataSourceBind = new YvDataSource(
        this,
        this.dataSource,
        this._dataSourceProcess.bind(this)
      )
      this.dataSourceBind.init()
    }
  }

  private _dataSourceProcess(data: any[]) {
    if (
      !this.dataSource ||
      _.isArray(this.dataSource) ||
      _.isFunction(this.dataSource)
    ) {
      return data
    }

    if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
      return data
    }

    if (!this.dataSource.idField) {
      return data
    }

    const idField = this.dataSource.idField

    data = _.cloneDeep(data)

    // 第一遍扫描, 建立映射关系
    _.each(data, item => {
      item.id = item[idField]
    })

    return data
  }

  //刷新状态时，自动重绑数据源
  protected refreshState() {
    super.refreshState()
    this._rebindDataSource()
  }
}
