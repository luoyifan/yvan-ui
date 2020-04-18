import * as YvanUI from './YvanUIExtend'
import CtlGridLocale from './CtlGridLocale'
import { CtlGridPage } from './CtlGridPage'
import agGrid from 'ag-grid'
import CtlGridIdRender from './CtlGridIdRender'
import {
  YvGridColumnEditProp,
  YvGridColumnProp,
  YvGridProp
} from './CtlGridDefault'
import CtlGridCellCheckbox from './CtlGridCellCheckbox'
import CtlGridHeadCheckbox from './CtlGridHeadCheckbox'
import { CtlBase } from './CtlBase'
import { parseYvanPropChangeVJson } from './CtlUtils'
import { GridDataSource } from './YvanDataSourceGrid'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import { YvanDataSourceGrid } from './YvanDataSourceGridImp'
import CtlGridCellButton from './CtlGridCellButton'
import CtlGridFilterSet from './CtlGridFilterSet'
import CtlGridEditorText from './CtlGridEditorText'
import CtlGridEditorCombo from './CtlGridEditorCombo'

/**
 * 表格中的行按钮被点击后触发的事件参数
 */
export interface CtlGridRowButtonClickArgs {
  /**
   * 行数据
   */
  data: any

  /**
   * 行序号
   */
  rowIndex: number

  /**
   * 列名称
   */
  colId: string
}

export class CtlGrid extends CtlBase<CtlGrid> {
  static create(vjson: any): CtlGrid {
    const that = new CtlGrid(_.cloneDeep(vjson))

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
      view: 'grid',
      template: `<div role="yvGrid" class="ag-theme-blue"></div>`,
      on: {
        onAfterRender: function (this: any) {
          that.attachHandle(this)
          that._resetGrid()
        },
        onDestruct(this: any) {
          if (that.gridApi) {
            that.gridApi.destroy()
            that.gridApi = undefined
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
  gridApi: any
  columnApi: any

  get webix() {
    return this._webix
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: GridDataSource) {
    this.vjson.dataSource = nv
  }

  /**
   * 获取数据源
   */
  get dataSource(): GridDataSource {
    return this.vjson.dataSource
  }

  /**
   * 初始化时的数据
   */
  readonly data?: any[]

  /**
   * 是否允许编辑
   */
  readonly editable!: boolean

  /**
   * 允许勾选
   */
  readonly checkbox!: boolean

  /**
   * 单击后立刻进入编辑
   */
  readonly editSingleClick!: boolean

  /**
   * 允许添加
   */
  readonly allowNewRow!: boolean

  /**
   * 允许过滤
   */
  readonly filterable!: boolean

  /**
   * 显示序号
   */
  readonly showRowNumber!: boolean

  /**
   * 自动调整列宽
   */
  readonly autoSizeColumns!: boolean

  /**
   * 单元格选中模式
   */
  readonly allowCellSelection!: boolean

  /**
   * 行选中模式
   */
  readonly allowRowSelection!: boolean

  /**
   * ID字段
   */
  readonly idField!: string

  /**
   * 值分隔符
   */
  readonly valueSep!: string

  /**
   * 保存时机(换行时/编辑完后)
   */
  readonly saveOn!: 'editFinish' | 'rowChanged'

  /**
   * 新添加行时，初始化的数据
   */
  readonly newRowData!: any

  /**
   * 失去焦点后立刻结束编辑
   */
  readonly stopEditingWhenGridLosesFocus!: boolean

  /**
   * 列定义
   */
  readonly columns!: any[] | undefined

  /**
   * 二纬表头
   */
  readonly columnGroup!: any[] | undefined

  /**
   * 是否自动读取数据
   */
  readonly autoLoad: boolean = true

  /**
   * 是否分页
   */
  readonly pagination: boolean = false

  /**
   * 分页大小
   */
  readonly pageSize: number = 100

  public gridPage!: CtlGridPage

  /**
   * 行被选中后触发
   */
  onRowSelect?: YvEvent<CtlGrid, any>

  /**
   * 行被双击后触发
   */
  onRowDblClick?: YvEvent<CtlGrid, any>

  /**
   * 勾选项改变后触发
   */
  onCheckedChange?: YvEvent<CtlGrid, any>

  /**
   * 数据绑定完毕后触发
   */
  onBindingComplete?: YvEvent<CtlGrid, any>

  /**
   * 焦点单元格发生变化后触发
   */
  onCellFocused?: YvEvent<CtlGrid, any>

  /**
   * 单元格被点击后触发
   */
  onCellClicked?: YvEvent<CtlGrid, any>

  /**
   * 第一行有效数据被渲染后触发
   */
  onFirstDataRendered?: YvEvent<CtlGrid, any>

  /**
   * 按下键后触发
   */
  onKeyDown?: YvEvent<CtlGrid, any>

  /**
   * 获取被勾选的行ID集合
   */
  checkedIds: any[] = []

  /**
   * 选择一个指定行
   * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
   */
  selectRow(condition: GridSelectCondition) {
    const node: any = this._findNode(condition)
    if (node) {
      this.gridApi.setFocusedCell(node.rowIndex, '__ID__')
      node.setSelected(true)
      return true
    }
    return false
  }

  /**
   * 闪烁指定行
   * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
   */
  flashRow(condition: any) {
    const node = this._findNode(condition)
    if (node) {
      this.gridApi.flashCells({ rowNodes: [node] })
      return true
    }
    return false
  }

  /**
   * 闪烁指定单元格
   * @param cols 列数组
   * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
   */
  flashCell(cols: any, condition: any) {
    const node = this._findNode(condition)
    if (node) {
      this.gridApi.flashCells({ columns: cols, rowNodes: [node] })
      return true
    }
    return false
  }

  /**
   * 获取全部数据
   */
  getData(): any[] | undefined {
    const result: any[] = []
    this.gridApi.forEachNode((node: any) => {
      result.push(node.data)
    })
    return result
  }

  /**
   * 为表格设置数据
   * 注意，调用此方法，必须在初始化时，给一个空的 data: [] 属性
   * 确保表格 rowModelType:clientSide 模式
   */
  setData(nv: any[] | undefined) {
    this.gridApi.setRowData(nv)
  }

  /**
   * 无感刷新
   * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
   *
   * option:
   *   clearFilter=true 是否清空筛选
   */
  reload(option?: any) {
    this.loading = true

    //无感刷新之前，清空所有状态
    this._clearCache()

    //需要重新请求 rowCount(总数据行)
    if (this.dataSourceBind) {
      this.dataSourceBind.clearRowCount()
    }

    if (this.entityName) {
      _.set(this.getModule(), this.entityName + '.selectedRow', undefined)
    }

    if (option && option.clearFilter === true) {
      this.gridApi.setFilterModel(null)
    } else {
      if (this.pagination) {
        this.gridPage.refreshGrid()
      } else {
        this.gridApi.refreshInfiniteCache()
      }
    }
  }

  /**
   * 获取被选中的行主键
   */
  getSelectedId() {
    const row = this.getSelectedRow()
    if (row) {
      return this._getIdByRow(row)
    }
  }

  /**
   * 设置勾选的数据行集合
   */
  setCheckedIds(ids: Array<any>) {
    // 清空所有元素
    this.checkedIds = ids;

    // 刷新勾选单元格
    this.gridApi.refreshCells({
      columns: ['__CB__'],
      force: true
    })
  }

  /**
   * 获取被勾选的所有行
   */
  getCheckedRows() {
    const selected: any[] = []
    this._findNode((node: any) => {
      if (_.indexOf(this.checkedIds, this._getIdByRow(node.data)) >= 0) {
        selected.push(node.data)
      }
      return false
    })
    return selected
  }

  /**
   * 获取被选中的行数据
   */
  getSelectedRow() {
    const rows = this.getSelectedRows()
    return rows.length > 0 ? rows[0] : undefined
  }

  /**
   * 获取被选中的行数据(多选情况下回返回多行数据)
   */
  getSelectedRows() {
    // 调用原生 getSelectedRows 方法有 bug
    // return this.gridApi.getSelectedRows();
    const selected: any[] = []
    this._findNode((node: any) => {
      if (node.selected) {
        selected.push(node.data)
      }
      return false
    })
    return selected
  }

  /**
   * 显示正在读取的状态
   */
  set loading(newValue: boolean) {
    if (!this.isGridReadReady) {
      return
    }
    if (newValue) {
      this.gridApi.showLoadingOverlay()
    } else {
      this.gridApi.hideOverlay()
    }
  }

  paginationSetPageSize(size: number) {
    this.gridApi.paginationSetPageSize(size)
  }

  /** 设置行号, 兼容分页 **/
  private setRowId(p: any) {
    return CtlGridIdRender(p, this)
  }

  /*============================ 私有属性部分 ============================*/
  private isGridReadReady: boolean = false
  private dataSourceBind?: YvanDataSourceGrid = undefined

  private _gridOptions(): any {
    _.assign(this, {
      ..._.clone(YvGridProp),
      ...this.vjson
    })
    const resultCols = []

    //显示序号列
    if (this.showRowNumber) {
      resultCols.push({
        field: '__ID__',
        headerName: CtlGridLocale.rownumber,
        width: 52,
        //minWidth: 52,
        maxWidth: 160,
        pinned: 'left',
        resizable: true,
        sortable: false,
        cellRenderer: 'CtlGridIdRender'
      })
    }

    //显示勾选框
    if (this.checkbox) {
      resultCols.push({
        field: '__CB__',
        headerName: '',
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        pinned: 'left',
        resizable: false,
        sortable: false,
        cellRenderer: 'CtlGridCellCheckbox',
        headerComponent: 'CtlGridHeadCheckbox',
        cellRendererParams: {
          isCheckedIds: true
        }
      })
    }

    //添加自定义列
    this._gridCols(resultCols)

    let columnDefs = resultCols
    if (!this.columnGroup || _.size(this.columnGroup) <= 0) {
      //没有多级表头
      columnDefs = resultCols
    } else {
      //二级表头
      columnDefs = []
      let j = 0
      let currentGroup: any
      let currentGroupSpan = -1

      for (let i = 0; i < resultCols.length; i++) {
        const { from, title, span, width } = this.columnGroup[j]
        const f = resultCols[i]
        if (!this.columnGroup[j]) {
          columnDefs.push(f)
        }

        if (currentGroupSpan > 0) {
          currentGroup.children.push(f)
          currentGroupSpan--
          if (currentGroupSpan <= 0) {
            j++
          }
        } else if (f.field === from) {
          currentGroup = {
            width: width,
            headerName: title,
            children: [f]
          }
          currentGroupSpan = span - 1
          columnDefs.push(currentGroup)
        } else {
          columnDefs.push(f)
        }
      }
    }

    const gridOptions = {
      headerHeight: 35,
      rowHeight: 33,
      suppressRowHoverHighlight: true,
      columnDefs,
      animateRows: false,
      suppressCellSelection: !this.allowCellSelection,
      suppressRowClickSelection: !this.allowRowSelection,
      suppressColumnMoveAnimation: true,
      pagination: this.pagination,
      paginationPageSize: this.pageSize,
      localeText: CtlGridLocale,
      rowModelType: 'infinite',
      infiniteInitialRowCount: 200,
      //maxConcurrentDatasourceRequests: 2,
      maxBlocksInCache: 5,
      //cacheOverflowSize
      rowSelection: 'single',
      enableBrowserTooltips: true,
      //enableCellChangeFlash: true,
      singleClickEdit: this.editSingleClick,
      floatingFilter: false,
      stopEditingWhenGridLosesFocus: this.stopEditingWhenGridLosesFocus,

      onFirstDataRendered: this._firstDataRendered.bind(this),

      onGridReady: this._gridReady.bind(this),
      tabToNextCell: this._tabToNextCell.bind(this),
      navigateToNextCell: this._navigateToNextCell.bind(this),
      onCellKeyDown: this._cellKeyDown.bind(this),
      onRowDoubleClicked: this._rowDoubleClicked.bind(this),
      onCellEditingStarted: this._cellEditingStarted.bind(this),
      onCellEditingStopped: this._cellEditingStopped.bind(this),
      onRowSelected: this._rowSelected.bind(this),
      onModelUpdated: this._modelUpdated.bind(this),
      onCellFocused: this._cellFocused.bind(this),
      onCellClicked: this._cellClicked.bind(this),
      enterMovesDown: false,
      enterMovesDownAfterEdit: false,

      components: {
        CtlGridCellButton: CtlGridCellButton,
        CtlGridCellCheckbox: CtlGridCellCheckbox,
        CtlGridHeadCheckbox: CtlGridHeadCheckbox,
        CtlGridEditorText: CtlGridEditorText,
        CtlGridEditorCombo: CtlGridEditorCombo,
        // // YvGridEditorDate: YvGridEditorDate,
        CtlGridFilterSet: CtlGridFilterSet,
        CtlGridIdRender: this.setRowId.bind(this) //CtlGridIdRender.bind(this)
      }
    }

    if (_.isArray(this.dataSource)) {
      //有数据，按 client 模式加载数据
      _.assign(gridOptions, {
        rowModelType: 'clientSide',
        rowData: this.data,
        data: []
      })
    }

    if (this.pagination) {
      _.assign(gridOptions, {
        rowModelType: 'clientSide',
        rowData: [],
        data: []
      })
    }

    return gridOptions
  }

  private _gridReady() {
    this.isGridReadReady = true
    /** 分页视图 **/
    this.gridPage = new CtlGridPage(this)
    this._rebindDataSource()
  }

  private _resetGrid() {
    this.isGridReadReady = false
    const gridOptions = this._gridOptions()
    const $el = $(this._webix._viewobj).find('[role="yvGrid"]')[0]
    const grid: any = new agGrid.Grid($el, gridOptions)
    grid.gridOptions.api.vue = this
    this.gridApi = grid.gridOptions.api
    this.columnApi = grid.gridOptions.columnApi

    //去掉 ag-unselectable 使表格允许被选定
    if ($el) {
      $($el)
        .find('.ag-root.ag-unselectable')
        .removeClass('ag-unselectable')
    }
  }

  _rowDoubleClicked(e: any) {
    YvEventDispatch(this.onRowDblClick, this, e.data)
  }

  /**
   * 获取下拉框的数据选项
   */
  _getComboFilterData(easyuiCol: any) {
    if (easyuiCol.editMode === 'combo') {
      if (typeof easyuiCol.editParams.data === 'string') {
        if (YvanUI.dict.hasOwnProperty(easyuiCol.editParams.data)) {
          return YvanUI.dict[easyuiCol.editParams.data]
        } else if (YvanUI.formatter.hasOwnProperty(easyuiCol.editParams.data)) {
          return YvanUI.formatter[easyuiCol.editParams.data]
        } else {
          console.error(
            '没有发现全局函数 YvanUI.formatter[dict].' +
            easyuiCol.editParams.data
          )
        }
      } else if (easyuiCol.editParams.data.constructor === Array) {
        const editParams = easyuiCol.editParams
        return _.map(editParams.data, item => {
          return {
            id: item[editParams.idField],
            text: item[editParams.textField]
          }
        })
      }
    }

    let formatter = easyuiCol.formatter
    if (typeof easyuiCol.formatter === 'string') {
      // formatter 是字符串，从全局 YvanUI.formatter 找方法
      if (YvanUI.dict.hasOwnProperty(easyuiCol.formatter)) {
        formatter = YvanUI.dict[easyuiCol.formatter]
      } else if (YvanUI.formatter.hasOwnProperty(easyuiCol.formatter)) {
        easyuiCol.formatter = YvanUI.formatter[easyuiCol.formatter]
      } else {
        console.error(
          '没有发现全局函数 YvanUI.formatter[dict].' + easyuiCol.editParams.data
        )
      }
    }

    if (formatter && formatter.constructor === Array) {
      // formatter 是数组，就是下拉数据本身
      return formatter
    }
  }

  /**
   * 第一次数据被渲染之后
   */
  _firstDataRendered() {
    YvEventDispatch(this.onFirstDataRendered, this, undefined)
  }

  /**
   * 接受更新
   * 状态位显示 OK, 删除 origin 数据, 并闪烁当前行
   */
  _acceptChanges(node: any) {
    if (node.origin) {
      node.cstate = 'ok'
      delete node.origin
      this.flashRow(node)
      node.setDataValue('__ID__', _.uniqueId())
    }
  }

  /**
   * 清空所有状态，准备获取新数据
   * 当前编辑都应该清空, 勾选也应该清空
   */
  _clearCache() {
    this.checkedIds = []
    this.gridApi.forEachNode((node: any) => {
      delete node.cstate
      delete node.origin
    })
  }

  /**
   * 根据行，获取主键 ID, 当主键不存在时 返回 undefined
   */
  _getIdByRow(row: any) {
    if (!row) return
    if (this.idField) {
      if (this.idField.constructor === Array) {
        //联合组件，用valueSep分割
        return _.map(this.idField, f => _.toString(row[f])).join(this.valueSep)
      }

      return row[this.idField]
    }
    console.error('表格没有设置主键！！')
    return undefined
  }

  /**
   * 重新绑定数据源
   */
  _rebindDataSource() {
    if (this.dataSourceBind) {
      this.dataSourceBind.destory()
      this.dataSourceBind = undefined
    }
    this.dataSourceBind = new YvanDataSourceGrid(this, this.dataSource)
  }

  /**
   * 每次 AJAX 请求完毕之后会回调这里
   */
  _bindingComplete() {
    YvEventDispatch(this.onBindingComplete, this, undefined)
  }

  /**
   * 找到某行的 node, （一旦匹配到 condition 就停止）
   */
  _findNode(condition: GridSelectCondition) {
    if (!condition) {
      //返回第一条被找到的数据
      condition = () => true
    } else if (typeof condition === 'string') {
      //以主键查找的方式
      const key = condition
      condition = (n: any) => {
        return this._getIdByRow(n.data) === key
      }
    } else if (typeof condition === 'object') {
      //就是 node 对象, 直接返回
      return condition
    }

    const me = this
    let findNode = undefined
    try {
      this.gridApi.forEachNode((node: any) => {
        if ((condition as any).call(me, node)) {
          findNode = node
          throw Error()
        }
      })
    } catch (e) { }
    return findNode
  }

  _cellKeyDown(param: any) {
    //event.stopPropagation();
    //event.preventDefault();

    //通知外部
    const r = YvEventDispatch(this.onKeyDown, this, param)
    if (r === true) {
      //已经被自定义函数处理掉
      return
    }

    if (param.event.keyCode === 13) {
      param.event.stopPropagation()
      param.event.preventDefault()
      return
    }

    if (param.event.keyCode === 27) {
      //按下 ESC 还原数据到 origin 状态, 并删除所有编辑形式
      if (param.node.origin) {
        param.event.stopPropagation()
        param.event.preventDefault()

        const data = {
          ...param.data,
          ...param.node.origin
        }
        delete param.node.cstate
        delete param.node.origin
        param.node.updateData(data)
        param.node.setDataValue('__ID__', _.uniqueId())
      }
    }
    //console.log('cellKeyDown', param);
  }

  _modelUpdated() {
    if (this.autoSizeColumns && this.gridApi) {
      this.gridApi.sizeColumnsToFit()
    }
  }

  _cellFocused(param: any) {
    YvEventDispatch(this.onCellFocused, this, param)
  }

  _cellClicked(param: any) {
    YvEventDispatch(this.onCellClicked, this, param)
  }

  _rowSelected(param: any) {
    const { node } = param
    const { selected, id } = node

    if (!selected) {
      //行离开事件,查看是否有数据正在编辑，提交校验
      this._rowEditingStopped(id, param)
      return
    }

    //触发 entity 改变
    if (_.size(this.entityName) > 0) {
      _.set(this.getModule(), this.entityName + '.selectedRow', param.data)
      //this.vcxt.module.$set(this.vcxt.module[this.entityName], "selectedRow", param.data);
    }

    //触发 onRowSelect 事件
    YvEventDispatch(this.onRowSelect, this, param.data)
  }

  _cellEditingStarted(param: any) {
    let rowId
    if (param.node.rowPinned === 'top') {
      //在添加行上
      rowId = -1
    } else if (!param.node.rowPinned) {
      //在数据行上
      rowId = param.node.id
    }
    this._rowEditingStarted(rowId, param)
  }

  _cellEditingStopped(param: any) {
    //触发单元格校验事件
    if (this.saveOn !== 'editFinish') {
      //保存时机，是不是结束编辑后立刻保存
      return
    }

    const origin = param.node.origin
    if (!origin) {
      // 这一行没有进入过编辑模式
      return
    }

    const data = _.cloneDeep(param.data)
    delete data['__ID__']
    delete data['__CB__']

    _.forOwn(origin, (value, key) => {
      if (typeof value === 'number') {
        origin[key] = _.toString(value)
      }
    })
    _.forOwn(data, (value, key) => {
      if (typeof value === 'number') {
        data[key] = _.toString(value)
      }
    })

    if (_.isEqual(origin, data)) {
      //相同，改变状态位 same
      param.node.cstate = 'same'
    } else {
      //不相同, 提交校验
      param.node.cstate = 'validate'

      if (this.dataSourceBind) {
        if (this.dataSourceBind.updateSupport()) {
          this.dataSourceBind._updateRow(param)
        }
      }
      //console.log(this.dataSource, param.node)
      //setTimeout(() => {
      //    this._acceptChanges(param.node)
      //}, 2000)
    }
    param.node.setDataValue('__ID__', _.uniqueId())
  }

  _rowEditingStarted(rowId: any, param: any) {
    if (!param.node.origin) {
      // 以前从来没有编辑过这一行, 记录 origin
      const data = _.cloneDeep(param.data)
      delete data['__ID__']
      delete data['__CB__']
      param.node.origin = data
    }

    param.node.cstate = 'editing'
    param.node.setDataValue('__ID__', _.uniqueId())
  }

  _rowEditingStopped(rowId: any, param: any) {
    if (this.saveOn !== 'rowChanged') {
      //保存时机，是不是行更改后立刻保存
      return
    }

    const origin = param.node.origin
    if (!origin) {
      // 这一行没有进入过编辑模式
      return
    }

    const data = _.cloneDeep(param.data)
    delete data['__ID__']
    delete data['__CB__']

    _.forOwn(origin, (value, key) => {
      if (typeof value === 'number') {
        origin[key] = _.toString(value)
      }
    })
    _.forOwn(data, (value, key) => {
      if (typeof value === 'number') {
        data[key] = _.toString(value)
      }
    })

    if (_.isEqual(origin, data)) {
      //相同，改变状态位 same
      param.node.cstate = 'same'
    } else {
      //不相同, 提交校验
      param.node.cstate = 'validate'

      if (this.dataSourceBind) {
        this.dataSourceBind._updateRow(param)
      }
      //console.log(this.dataSource, param.node)
      //setTimeout(() => {
      //    this._acceptChanges(param.node)
      //}, 2000)
    }
    param.node.setDataValue('__ID__', _.uniqueId())
  }

  /**
   * Tab键导航
   */
  _tabToNextCell(params: any) {
    const previousCell = params.previousCellPosition
    const nextCellPosition = params.nextCellPosition

    //tab 永不换行
    return {
      ...nextCellPosition,
      rowIndex: previousCell.rowIndex
    }
  }

  /**
   * 上下左右键导航
   */
  _navigateToNextCell(params: any) {
    const KEY_LEFT = 37
    const KEY_UP = 38
    const KEY_RIGHT = 39
    const KEY_DOWN = 40

    const previousCell = params.previousCellPosition
    const suggestedNextCell = params.nextCellPosition
    switch (params.key) {
      case KEY_UP: {
        const nextRowIndex = previousCell.rowIndex - 1
        if (nextRowIndex < 0) {
          // returning null means don't navigate
          return null
        }
        this.selectRow(node => node.rowIndex === nextRowIndex)
        return {
          rowIndex: nextRowIndex,
          column: previousCell.column,
          floating: previousCell.floating
        }
      }

      case KEY_DOWN: {
        // return the cell below
        const rowIndex = previousCell.rowIndex + 1
        const renderedRowCount = this.gridApi.getModel().getRowCount()
        if (rowIndex >= renderedRowCount) {
          // returning null means don't navigate
          return null
        }
        this.selectRow(node => node.rowIndex === rowIndex)
        return {
          rowIndex: rowIndex,
          column: previousCell.column,
          floating: previousCell.floating
        }
      }

      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell
      default:
        throw 'this will never happen, navigation is always one of the 4 keys above'
    }
  }

  /**
   * 列设置计算
   */
  _gridCols(resultCols: any[]): void {
    _.each(this.columns, column => {
      const easyuiCol = _.merge(
        {
          ..._.clone(YvGridColumnProp),
          editParams: {
            ..._.clone(YvGridColumnEditProp)
          }
        },
        column
      )

      //=========================== 设计模式属性 ===========================
      // if (this._isDesignMode) {
      //     resultCols.push({
      //         suppressMovable: true,
      //         field: easyuiCol.field,
      //         headerName: easyuiCol.title,
      //         resizable: true,
      //         filter: false,
      //         editable: false,
      //         sortable: false,
      //         //unSortIcon: true,
      //         hide: false,
      //         width: easyuiCol.width,
      //         minWidth: easyuiCol.minwidth,
      //         maxWidth: easyuiCol.maxwidth
      //     });
      //     return;
      // }

      //=========================== 基本属性 ===========================
      const col: any = {
        suppressMovable: true,
        field: easyuiCol.field,
        headerName: easyuiCol.title,
        resizable: easyuiCol.resizable,
        filter: false,
        editable: false,
        sortable: easyuiCol.sortable,
        //unSortIcon: true,
        hide: easyuiCol.hidden
      }

      if (typeof easyuiCol.width !== 'undefined') col.width = easyuiCol.width
      if (typeof easyuiCol.minwidth !== 'undefined')
        col.minWidth = easyuiCol.minwidth
      if (typeof easyuiCol.maxwidth !== 'undefined')
        col.maxWidth = easyuiCol.maxwidth

      if (typeof easyuiCol.align !== 'undefined') {
        col.cellClass = function (params: any) {
          return ['yv-align-' + easyuiCol.align]
        }
      }

      if (_.size(easyuiCol.field) > 0) {
        col.tooltipField = easyuiCol.field
      }

      //=========================== buttons 属性 ===========================
      if (easyuiCol.buttons) {
        //col.cellRendererFramework = 'yvGridButton'
        col.cellRenderer = 'CtlGridCellButton'
        col.cellRendererParams = {
          buttons: easyuiCol.buttons
        }
      }

      //=========================== 编辑与formatter属性 ===========================
      const { editParams } = easyuiCol
      let formatable = false
      if (easyuiCol.editable) {
        if (easyuiCol.editMode === 'checkbox') {
          //勾选框编辑
          formatable = false
          col.cellRenderer = 'CtlGridCellCheckbox'
          col.cellRendererParams = {
            editParams: easyuiCol.editParams,
            on: editParams.on,
            off: editParams.off,
            onChange: (newValue: any) => {
              YvEventDispatch(editParams.onValidate, this, {
                value: newValue
              })
            },
            onValidate: (value: any) => {
              YvEventDispatch(editParams.onValidate, this, {
                value: value
              })
            }
          }

          if (easyuiCol.editable) {
            //允许编辑
            _.assign(col, {
              editable: true,
              cellEditor: 'CtlGridEditorCombo',
              cellEditorParams: {
                editParams: easyuiCol.editParams,
                options: [
                  { id: editParams.on, text: '勾选' },
                  { id: editParams.off, text: '不勾' }
                ],
                onChange: (newValue: any) => {
                  YvEventDispatch(editParams.onValidate, this, {
                    value: newValue
                  })
                },
                onValidate: (value: any) => {
                  YvEventDispatch(editParams.onValidate, this, {
                    value: value
                  })
                }
              }
            })
          }
        } else if (easyuiCol.editMode === 'combo') {
          //下拉框编辑
          formatable = false
          _.assign(col, {
            editable: true,
            cellEditor: 'CtlGridEditorCombo',
            cellEditorParams: {
              editParams: easyuiCol.editParams,
              options: this._getComboFilterData(easyuiCol),
              onChange: (newValue: any) => {
                YvEventDispatch(editParams.onValidate, this, {
                  value: newValue
                })
              },
              onValidate: (value: any) => {
                YvEventDispatch(editParams.onValidate, this, {
                  value: value
                })
              }
            }
          })
          //下拉框的 formatter 逻辑是固定的
          const data = this._getComboFilterData(easyuiCol)
          if (typeof data === 'function') {
            col.valueFormatter = (params: any) => {
              return data(params.value)
            }
          } else {
            col.valueFormatter = (params: any) => {
              if (_.size(params.data) <= 0) return

              const optionItem = _.find(data, item => {
                const id = _.toString(item['id'])
                return id && id === _.toString(params.value)
              })

              if (optionItem) {
                //找到text属性值
                return optionItem['text']
              }
              return params.value
            }
          }
        } else if (easyuiCol.editMode === 'area') {
          //大型富文本框编辑
          formatable = true
          _.assign(col, {
            editable: true,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorParams: {
              editParams: easyuiCol.editParams,
              maxLength: editParams.maxlength
            }
          })
        } else if (
          easyuiCol.editMode === 'text' ||
          easyuiCol.editMode === 'number'
        ) {
          //普通文本框编辑
          formatable = true
          _.assign(col, {
            editable: true,
            cellEditor: 'CtlGridEditorText',
            cellEditorParams: {
              type: easyuiCol.editMode,
              editParams: easyuiCol.editParams,
              onChange: (newValue: any) => {
                YvEventDispatch(editParams.onValidate, this, {
                  value: newValue
                })
              },
              onValidate: (value: any) => {
                YvEventDispatch(editParams.onValidate, this, {
                  value: value
                })
              },
              onInput: (e: any) => {
                YvEventDispatch(editParams.onInput, this, this, {
                  event: e
                })
              }
            }
          })
        } else if (
          easyuiCol.editMode === 'date' ||
          easyuiCol.editMode === 'datetime'
        ) {
          formatable = true
          // _.assign(col, {
          //     editable: true,
          //     cellEditor: "YvGridEditorDate",
          //     cellEditorParams: {
          //         type: easyuiCol.editMode,
          //         editParams: easyuiCol.editParams,
          //         onChange: newValue => {
          //             this.$yvDispatch(editParams.onValidate, newValue, this.getEditRow());
          //         },
          //         onValidate: value => {
          //             this.$yvDispatch(editParams.onValidate, value, this.getEditRow());
          //         },
          //         onInput: e => {
          //             this.$yvDispatch(editParams.onInput, e, this.getEditRow());
          //         }
          //     }
          // });
          console.error('not support date editor')
        }
      } else {
        //不允许编辑的情况，全都允许格式化
        formatable = true
      }

      //=========================== formatter属性 ===========================
      if (formatable) {
        const data = this._getComboFilterData(easyuiCol)
        if (data) {
          //从下拉框逻辑中找到了固定映射关系
          col.valueFormatter = (params: any) => {
            if (_.size(params.data) <= 0) return undefined
            const optionItem = _.find(data, item => {
              const id = _.toString(item['id'])
              return id && id === _.toString(params.value)
            })

            if (optionItem) {
              //找到text属性值
              return optionItem['text']
            }
            return params.value
          }
        } else {
          //以 function 方式获得显示逻辑
          let formatter = easyuiCol.formatter
          if (typeof easyuiCol.formatter === 'string') {
            // formatter 是字符串，从全局 YvanUI.formatter 找方法
            if (!YvanUI.formatter.hasOwnProperty(easyuiCol.formatter)) {
              console.error(
                '没有发现全局函数 YvanUI.formatter.' + easyuiCol.formatter
              )
            } else {
              formatter = YvanUI.formatter[easyuiCol.formatter]
            }
          }

          if (typeof formatter === 'function') {
            //formatter 是函数，调用函数来显示
            col.valueFormatter = (params: any) => {
              if (_.size(params.data) <= 0) return undefined
              return formatter.call(
                this,
                params.data[easyuiCol.field],
                this,
                params.data
              )
            }
          }
        }
      }

      //=========================== 过滤属性 ===========================
      if (this.filterable && easyuiCol.filterable && !easyuiCol.hidden) {
        const datas = this._getComboFilterData(easyuiCol)
        if (typeof datas === 'object') {
          //下拉框过滤
          _.assign(col, {
            filter: 'CtlGridFilterSet',
            //suppressMenu: true,
            filterParams: {
              data: datas
            }
          })
        } else if (easyuiCol.editMode === 'number') {
          //数字过滤
          _.assign(col, {
            filter: 'agNumberColumnFilter',
            //suppressMenu: true,
            filterParams: {
              applyButton: true,
              clearButton: true,
              suppressAndOrCondition: true
              //filterOptions: [
              //    'equals',
              //    'notEqual',
              //    'lessThan',
              //    'greaterThan',
              //    'lessThanOrEqual',
              //    'greaterThanOrEqual',
              //]
            }
          })
        } else if (
          easyuiCol.editMode === 'date' ||
          easyuiCol.editMode === 'datetime'
        ) {
          //日期筛选
          _.assign(col, {
            filter: 'agDateColumnFilter',
            filterParams: {
              applyButton: true,
              clearButton: true,
              filterOptions: ['inRange'],
              suppressAndOrCondition: true,
              comparator: function (
                filterLocalDateAtMidnight: any,
                cellValue: any
              ) {
                const dateAsString = cellValue
                if (dateAsString == null) return 0

                // In the example application, dates are stored as dd/mm/yyyy
                // We create a Date object for comparison against the filter date
                const dateParts = dateAsString.split('/')
                const day = Number(dateParts[2])
                const month = Number(dateParts[1]) - 1
                const year = Number(dateParts[0])
                const cellDate = new Date(day, month, year)

                // Now that both parameters are Date objects, we can compare
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1
                }
                return 0
              }
            }
          })
        } else {
          //其他情况都是字符串筛选
          _.assign(col, {
            filter: 'agTextColumnFilter',
            filterParams: {
              applyButton: true,
              clearButton: true,
              filterOptions: ['startsWith', 'equals', 'contains'],
              suppressAndOrCondition: true,
              textFormatter: function (r: any) {
                if (r == null) return null
                r = r.replace(new RegExp('[àáâãäå]', 'g'), 'a')
                r = r.replace(new RegExp('æ', 'g'), 'ae')
                r = r.replace(new RegExp('ç', 'g'), 'c')
                r = r.replace(new RegExp('[èéêë]', 'g'), 'e')
                r = r.replace(new RegExp('[ìíîï]', 'g'), 'i')
                r = r.replace(new RegExp('ñ', 'g'), 'n')
                r = r.replace(new RegExp('[òóôõøö]', 'g'), 'o')
                r = r.replace(new RegExp('œ', 'g'), 'oe')
                r = r.replace(new RegExp('[ùúûü]', 'g'), 'u')
                r = r.replace(new RegExp('[ýÿ]', 'g'), 'y')
                return r
              }
            }
          })
        }
      }

      //=========================== 渲染属性 ===========================
      if (typeof easyuiCol.onStyle === 'function') {
        _.assign(col, {
          cellStyle: (param: any) => {
            return easyuiCol.onStyle.call(this, param)
          }
        })
      }

      resultCols.push(col)
    })
  }
}

export type GridSelectCondition = ((row: any) => boolean) | string
