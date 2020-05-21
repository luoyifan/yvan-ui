import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvDataSource } from './YvanDataSourceImp'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { DataSource } from './YvanDataSource'
import { CtlSidebarDefault } from './CtlDefaultValue'
import { getFirstPinyin } from './Utils'

export class CtlSidebar extends CtlBase<CtlSidebar> {
  static create(module: any, vjson: any): CtlSidebar {
    const that = new CtlSidebar(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlSidebarDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      // 'data',
      'dataSource',
      'onNodeClick',
      'onDataComplete'
    ])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
    _.assign(that, yvanProp)

    // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
    _.merge(vjson, that._webixConfig, {
      select: true,
      filterMode: {
        showSubItems: false
      },
      on: {
        onInited(this: any) {
          that.attachHandle(this, { ...vjson, ...yvanProp })
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
      }
    })

    return that
  }

  /**
   * 拼音方式过滤查找树
   */
  filter(nv: string) {
    if (!nv) {
      this._webix.filter('')
      return
    }

    this._webix.filter((node: any) => {
      const value = node.value
      const nodePy = getFirstPinyin(value).toLowerCase()
      return nodePy.indexOf(nv.toLowerCase()) >= 0 || value.toLowerCase().indexOf(nv) >= 0
    })
  }

  /**
   * 树上的数据
   */
  data?: any[]

  /**
   * 树节点被点击后触发
   */
  onNodeClick?: YvEvent<CtlSidebar, any>

  /**
   * 树节点被双击后触发
   */
  onNodeDblClick?: YvEvent<CtlSidebar, any>

  /**
   * 数据绑定完成后触发
   */
  onDataComplete?: YvEvent<CtlSidebar, any>

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
  get dataSource(): DataSource<CtlSidebar> {
    return this._dataSource
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: DataSource<CtlSidebar>) {
    this._dataSource = nv
    if (this._module.loadFinished) {
      // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
      // onLoad 之前都不需要主动触发 _rebindDataSource
      this._rebindDataSource()
    }
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
   * 展开或收起状态互换
   */
  public toggle(): void {
    return this._webix.toggle();
  }

  /**
   * 是否折叠状态
   */
  public isCollapsed(): boolean {
    return this._webix.config.collapsed;
  }

  /* =============================================== 以下部分为私有函数 =============================================== */

  //数据源设置
  private _dataSource: DataSource<CtlSidebar>

  //数据源管理器
  private dataSourceBind?: YvDataSource<CtlSidebar>

  //重新绑定数据源
  private _rebindDataSource() {
    const innerMethod = () => {
      if (this.dataSourceBind) {
        this.dataSourceBind.destory()
        this.dataSourceBind = undefined
      }

      if (this._webix && this._module) {
        this.dataSourceBind = new YvDataSource(this, this.dataSource, this._dataSourceProcess.bind(this))
        this.dataSourceBind.init()
      }
    }

    if (!this._module.loadFinished) {
      // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
      _.defer(innerMethod)

    } else {
      // 否则实时调用 rebind
      innerMethod()
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

    if (
      !this.dataSource.parentField ||
      !this.dataSource.displayField ||
      !this.dataSource.valueField
    ) {
      return data
    }

    const idField = this.dataSource.valueField
    const textField = this.dataSource.displayField
    const parentField = this.dataSource.parentField

    data = _.cloneDeep(data)

    // 第一遍扫描, 建立映射关系
    const nodeMap: any = {}
    const rootNode = []
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      nodeMap[row[idField]] = {
        value: row[textField],
        id: row[idField],
        row: row
      }
      if (row.icon) {
        nodeMap[row[idField]].icon = row.icon
      }
    }

    // 第二遍扫描，建立父子关系
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const parent = row[parentField]
      const id = row[idField]

      if (!parent || parent === '0') {
        // 没有父亲，作为根节点
        rootNode.push(nodeMap[id])
      } else if (nodeMap.hasOwnProperty(parent)) {
        //找到父亲
        const parentNode = nodeMap[parent]
        if (parentNode.hasOwnProperty('data')) {
          parentNode.data.push(nodeMap[id])
        } else {
          parentNode.data = [nodeMap[id]]
        }
      } else {
        // 没有找到父亲，作为根节点
        rootNode.push(nodeMap[id])
      }
    }

    return rootNode
  }

  //刷新状态时，自动重绑数据源
  protected refreshState() {
    super.refreshState()
    this._rebindDataSource()
  }

  /**
   * 根据id获取一行数据
   */
  public getItem(id: any) {
    return this._webix.getItem(id)
  }

  /**
   * 选中一行
   * @param id
   */
  public select(id: any) {
    // this._webix.showItem(id);
    let pid = id
    while (pid) {
      this._webix.open(pid)
      pid = this._webix.getParentId(pid)
    }

    this._webix.select(id)
  }
}
