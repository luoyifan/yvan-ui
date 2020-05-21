import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { YvDataSource } from './YvanDataSourceImp'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { DataSource } from './YvanDataSource'
import { CtlTreeDefault } from './CtlDefaultValue'
import { getFirstPinyin } from './Utils'

export class CtlTree extends CtlBase<CtlTree> {
  static create(module: any, vjson: any): CtlTree {
    const that = new CtlTree(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlTreeDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, [
      // 'data',
      'dataSource',
      'onNodeClick',
      'onNodeDblClick',
      'onDataComplete',
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
      select: true,
      filterMode: {
        showSubItems: false
      },
      on: {
        onInited(this: any) {
          that.attachHandle(this, vjson)
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
      template: function (obj: any, common: any) {
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
      // 树的左侧图标
      type: {
        folder: function (obj: any) {
          if (obj.icon) {
            return (
              "<span style='padding-left: 5px; padding-right: 5px; color: #5fa2dd; font-size: 16px' class='" +
              obj.icon +
              "'></span>"
            )
          }
          return ''
        }
      }
    })

    if (vjson.threeState !== false && that.showCheckbox) {
      vjson.threeState = true;
    } else {
      vjson.threeState = false;
    }

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
  onNodeClick?: YvEvent<CtlTree, any>

  /**
   * 树节点被双击后触发
   */
  onNodeDblClick?: YvEvent<CtlTree, any>

  /**
   * 数据绑定完成后触发
   */
  onDataComplete?: YvEvent<CtlTree, any>

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
    // dataSource call back
    this._webix.clearAll()
    this._webix.parse(nv)
  }

  /**
   * 获取数据源设置
   */
  get dataSource(): DataSource<CtlTree> {
    return this._dataSource
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: DataSource<CtlTree>) {
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
   * 获取第一个节点
   */
  public getFirstId(): any {
    return this._webix.getFirstId()
  }

  /**
   * 展开某个节点
   */
  public open(id: any) {
    this._webix.open(id)
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
   * 获取某 id 下树节点所有的子节点
   */
  public getChildItems(id: any): any[] {
    const ret = []
    let c = this._webix.getFirstChildId(id)
    while (c) {
      ret.push(this._webix.getItem(c))
      c = this._webix.getNextSiblingId(c)
    }
    return ret
  }

  /**
   * 获取某 id 下树节点所有的子节点的编号
   */
  public getChildIds(id: any): any[] {
    const ret = []
    let c = this._webix.getFirstChildId(id)
    while (c) {
      ret.push(c)
      c = this._webix.getNextSiblingId(c)
    }
    return ret
  }

  /**
   * 获取被选中的一行编号
   */
  public getSelectedId(): any {
    return this._webix.getSelectedId()
  }

  /**
   * 获取被选中的一行
   */
  public getSelectedItem(): any {
    return this._webix.getSelectedItem()
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
    // this._webix.showItem(id);
    let pid = id
    while (pid) {
      this._webix.open(pid)
      pid = this._webix.getParentId(pid)
    }

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
   * 获取选中的ID 数组
   */
  public getCheckedIds() {
    return this._webix.getChecked()
  }

  /**
   * 获取选中的行数组
   */
  public getCheckedItems() {
    return _.map(this._webix.getChecked(), v => this._webix.getItem(v))
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
  private _dataSource: DataSource<CtlTree>

  //数据源管理器
  private dataSourceBind?: YvDataSource<CtlTree>

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
        icon: row['icon'],
        value: row[textField],
        id: row[idField],
        row: row
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
}
