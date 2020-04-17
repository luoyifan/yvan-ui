import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvDataSource } from './YvanDataSourceImp'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { DataSource } from './YvanDataSource'

export class CtlTreeTable extends CtlBase<CtlTreeTable> {
  static create(vjson: any): CtlTreeTable {
    const that = new CtlTreeTable(vjson)

    if (vjson.hasOwnProperty('debugger')) {
      debugger
    }

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      'data',
      'dataSource',
      'onNodeClick',
      'onNodeDblClick',
      'showCheckbox',
      'showLeftIcon',
      'showIcon'
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
        },
        onAfterDelete() {
          that.removeHandle()
        },
        onItemClick(this: any, id: any) {
          const item = this.getItem(id)
          YvEventDispatch(that.onNodeClick, that, item)
        },
        onItemDblClick(this: any, id: any) {
          const item = this.getItem(id)
          YvEventDispatch(that.onNodeDblClick, that, item)
        }
      },
      template: function(obj: any, common: any) {
        let t = ''
        if (that.showCheckbox) {
          t += common.checkbox(obj, common)
        }
        if (that.showIcon) {
          t += common.folder(obj, common)
        }
        if (that.showLeftIcon) {
          t += common.icon(obj, common)
        }
        t += obj.value
        return t
      },
      threeState: that.showCheckbox,
      // 树的左侧图标
      type: {
        folder: function(obj: any) {
          if (obj.icon) {
            return (
              "<span style='padding-left: 5px; padding-right: 5px; color: #063978; font-size: 16px' class='" +
              obj.icon +
              "'></span>"
            )
          }
          return ''
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
  onNodeClick?: YvEvent<CtlTreeTable, any>

  /**
   * 树节点被双击后触发
   */
  onNodeDblClick?: YvEvent<CtlTreeTable, any>

  /**
   * 显示勾选框
   */
  showCheckbox: boolean = false

  /**
   * 显示左侧展开图标
   */
  showLeftIcon: boolean = true

  /**
   * 显示图标
   */
  showIcon: boolean = true

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
    this._webix.clearAll()
    this._webix.parse(nv)
  }

  /**
   * 获取数据源设置
   */
  get dataSource(): DataSource<CtlTreeTable> {
    return this._dataSource
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: DataSource<CtlTreeTable>) {
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

  /**
   * 清空所有数据
   */
  public clear() {
    this._webix.clearAll()
  }

  /**
   * 取消选择所有节点
   */
  public uncheckAll() {
    this._webix.uncheckAll()
  }

  /**
   * 根据id获取一行数据
   */
  public getItem(id: any) {
    return this._webix.getItem(id)
  }

  /**
   * 勾选选中一行
   */
  public checkItem(id: any) {
    this._webix.checkItem(id)
  }

  /**
   * 选中一行
   * @param id
   */
  public select(id: any) {
    this._webix.showItem(id)
    this._webix.select(id)
  }

  /**
   * 选中多行
   */
  public checkItems(ids: any[]) {
    for (let id of ids) {
      this._webix.checkItem(id)
    }
  }

  /**
   * 取消选中一行
   */
  public uncheckItem(id: any) {
    this._webix.uncheckItem(id)
  }

  /**
   * 获取选中的行
   */
  public getChecked() {
    return this._webix.getChecked()
  }

  /**
   * 查看是否被选中
   */
  public isChecked(id: any) {
    return this._webix.isChecked(id)
  }

  /**
   * 展开全部节点
   */
  public expandAll() {
    this._webix.openAll()
  }

  /**
   * 收起所有节点
   */
  public collapseAll() {
    this._webix.closeAll()
  }

  /* =============================================== 以下部分为私有函数 =============================================== */

  //数据源设置
  private _dataSource: DataSource<CtlTreeTable>

  //数据源管理器
  private dataSourceBind?: YvDataSource<CtlTreeTable>

  //重新绑定数据源
  private _rebindDataSource() {
    if (this.dataSourceBind) {
      this.dataSourceBind.destory()
      this.dataSourceBind = undefined
    }

    if (this._webix && this.getModule()) {
      this.dataSourceBind = new YvDataSource(this, this.dataSource)
      this.dataSourceBind.init()
    }
  }

  //刷新状态时，自动重绑数据源
  protected refreshState() {
    super.refreshState()
    this._rebindDataSource()
  }
}
