import * as YvanUI from './YvanUIExtend'
import {
  GridDataSource,
  GridDataSourceSql,
  GridDataSourceStaticFunction,
  WatchParam,
  GetParam
} from './YvanDataSourceGrid'
import { isDesignMode } from './DesignHelper'

export class YvanDataSourceGrid {
  private option: GridDataSource
  private ctl: any
  private readonly module: any
  private watches: Function[] = []
  private isFirstAutoLoad: boolean = true //是否为第一次自动读取

  private reload: undefined | (() => void)
  private rowCount: number | undefined
  private lastFilterModel: any

  serverQuery = _.debounce(
    (
      option: GridDataSourceSql,
      paramFunction: undefined | (() => any),
      params: any
    ) => {
      const that = this

      //异步请求数据内容
      that.ctl.loading = true
      let needCount = false
      if (typeof that.rowCount === 'undefined') {
        //从来没有统计过 rowCount(记录数)
        needCount = true
        that.lastFilterModel = _.cloneDeep(params.filterModel)
      } else {
        if (!_.isEqual(that.lastFilterModel, params.filterModel)) {
          //深度对比，如果 filter 模型更改了，需要重新统计 rowCount(记录数)
          needCount = true
          that.lastFilterModel = _.cloneDeep(params.filterModel)
        }
      }
      const queryParams = {
        ...(typeof paramFunction === 'function' ? paramFunction() : undefined)
      }
      YvanUI.dbs[option.db]
        .query({
          params: queryParams,
          limit: params.startRow,
          limitOffset: params.endRow - params.startRow,
          needCount,
          orderByModel: params.sortModel,
          filterModel: params.filterModel,
          sqlId: option.sqlId
        })
        .then(res => {
          const { data: resultData, totalCount, params: resParams } = res
          if (needCount) {
            that.rowCount = totalCount
          }
          params.successCallback(resultData, that.rowCount)
          /** 如果不分页就在这里设置总条目数量，避免多次刷新分页栏 **/
          if (!that.ctl.pagination) {
            that.ctl.gridPage.itemCount = that.rowCount
          }
          that.ctl._bindingComplete()
          if (that.ctl.entityName) {
            _.set(
              that.module,
              that.ctl.entityName + '.selectedRow',
              that.ctl.getSelectedRow()
            )
          }
        })
        .catch(r => {
          params.failCallback()
        })
        .finally(() => {
          this.ctl.loading = false
        })
    }
  )

  /**
   * SQL取值
   */
  setSqlMode(
    option: GridDataSourceSql,
    paramFunction: undefined | (() => any)
  ) {
    const that = this
    this.reload = () => {
      this.ctl.loading = true
      that.clearRowCount()
      if (that.ctl.entityName) {
        _.set(that.module, that.ctl.entityName + '.selectedRow', undefined)
      }
      that.ctl.gridApi.hasDataSource = true

      if (that.ctl.pagination) {
        /** 分页模式 **/
        that.ctl.gridPage.getPageData = (
          currentPage: number,
          pageSize: number
        ) => {
          let params: any = {}
          params.successCallback = (data: [], rowCount: number) => {
            if (data.length > 0) {
              that.ctl.setData(data)
              that.ctl.gridPage.itemCount = rowCount
              that.ctl.gridPage.currentPage = currentPage
            }
          }
          params.failCallback = () => {
            console.error('error')
          }
          params.startRow = (currentPage - 1) * pageSize
          params.endRow = currentPage * pageSize
          that.serverQuery(option, paramFunction, params)
        }
        that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize)
      } else {
        /** 无限滚动模式 **/

        that.ctl.gridApi.setDatasource({
          getRows: (params: any) => {
            if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
              that.rowCount = 0
              params.successCallback([], that.rowCount)
              that.ctl.loading = false
              that.isFirstAutoLoad = false
              return
            }

            that.serverQuery(option, paramFunction, params)
          }
        })
      }
    }

    this.reload()
  }

  /**
   * 自定义函数式取值
   */
  setCustomFunctionMode(
    option: GridDataSourceStaticFunction,
    paramFunction: undefined | (() => any)
  ) {
    const that = this
    this.reload = () => {
      that.clearRowCount()
      if (that.ctl.entityName) {
        _.set(that.module, that.ctl.entityName + '.selectedRow', undefined)
      }
      that.ctl.loading = true

      // rowModelType = infinite
      that.ctl.gridApi.setDatasource({
        getRows: (params: any) => {
          that.ctl.loading = true

          if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
            that.rowCount = 0
            params.successCallback([], that.rowCount)
            that.ctl.loading = false
            that.isFirstAutoLoad = false
            return
          }

          option.call(that.module, that.ctl, {
            param:
              typeof paramFunction === 'function' ? paramFunction() : undefined,

            failCallback: () => {
              params.failCallback()
            },

            successCallback: (data: any[], dataLength: number | undefined) => {
              params.successCallback(data, dataLength)

              that.ctl.loading = false
              that.ctl._bindingComplete()
              if (that.ctl.entityName) {
                _.set(
                  that.module,
                  that.ctl.entityName + '.selectedRow',
                  that.ctl.getSelectedRow()
                )
              }
            }
          })
        }
      })
    }

    this.reload()
  }

  setCodeArrayMode(option: Array<any>) {
    const that = this
    const rowCount = option.length
    this.reload = () => {
      this.ctl.loading = true
      that.clearRowCount()
      if (that.ctl.entityName) {
        _.set(that.module, that.ctl.entityName + '.selectedRow', undefined)
      }
      that.ctl.gridApi.hasDataSource = true

      if (that.ctl.pagination) {
        /** 分页模式 **/

        that.ctl.gridPage.getPageData = (
          currentPage: number,
          pageSize: number
        ) => {
          let d = []
          const startRow = (currentPage - 1) * pageSize
          let endRow = currentPage * pageSize
          endRow = endRow > rowCount ? rowCount : endRow

          for (let i = startRow; i < endRow; i++) {
            d.push(option[i])
          }
          that.ctl.setData(d)
          that.ctl.gridPage.itemCount = rowCount
          that.ctl.gridPage.currentPage = currentPage
        }

        that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize)
      } else {
        /** 不分页模式 **/
        that.ctl.setData(option)
        that.ctl.gridPage.itemCount = rowCount
      }
    }

    this.reload()
  }

  constructor(ctl: any, option: GridDataSource) {
    if (isDesignMode()) {
      return
    }
    this.ctl = ctl
    this.option = option
    this.module = ctl._webix.$scope

    if (!option) {
      //没有设值，退出
      this.reload = undefined
      return
    }

    if (_.isArray(option)) {
      this.setCodeArrayMode(option)
      return
    }

    if (typeof option === 'function') {
      //以 function 方式运行
      this.setCustomFunctionMode(option, undefined)
      return
    }

    // 使 watch 生效
    _.forOwn(option.params, value => {
      if (!_.has(value, '$watch')) {
        return
      }
      const watchOption: WatchParam = value
      this.module.$watch(watchOption.$watch, () => {
        if (this.reload) {
          this.reload()
        }
      })
    })

    // params 函数
    let paramFunction = () => {
      const result: any = {}
      _.forOwn(option.params, (value, key) => {
        if (_.has(value, '$get')) {
          const getOption: GetParam = value
          result[key] = _.get(this.module, getOption.$get)
        } else if (_.has(value, '$watch')) {
          const watchOption: WatchParam = value
          result[key] = _.get(this.module, watchOption.$watch)
        } else {
          result[key] = value
        }
      })
      return result
    }

    if (option.type === 'function') {
      if (typeof option.bind === 'function') {
        this.setCustomFunctionMode(option.bind, paramFunction)
      } else {
        // 取 bind 函数
        const bindFunction: GridDataSourceStaticFunction = _.get(
          this.module,
          option.bind
        ) as GridDataSourceStaticFunction
        if (!bindFunction) {
          console.error(`没有找到名称为 ${option.bind} 的方法`)
          return
        }
        this.setCustomFunctionMode(bindFunction, paramFunction)
      }
      return
    }

    if (option.type === 'SQL') {
      this.setSqlMode(option, paramFunction)
      return
    }

    console.error(`其他方式没有实现`)
  }

  /**
   * 释放与 YvGrid 的绑定
   */
  destory() {
    // 解除全部 watch
    _.each(this.watches, unwatch => {
      unwatch()
    })
    this.reload = undefined
  }

  /**
   * 清空 rowCount, 下次重新统计总行数
   */
  clearRowCount() {
    delete this.rowCount
  }

  updateSupport(): boolean {
    return false
  }

  _updateRow(param: any) {
    throw new Error('not implements')
  }
}
