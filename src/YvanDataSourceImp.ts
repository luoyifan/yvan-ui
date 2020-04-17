import {
  DataSource,
  DataSourceStaticFunction,
  DataSourceDb,
  DataSourceProcessFunction
} from './YvanDataSource'
import { YvEvent, YvEventDispatch } from './YvanEvent'
import * as YvanUI from './YvanUIExtend'
import { isDesignMode } from './DesignHelper'

export class YvDataSource<T> {
  private readonly module: any
  private option: DataSource<T>
  private dataSourceProcess?: DataSourceProcessFunction
  private ctl: any
  private watches: Function[] = []
  public reload: undefined | (() => void)

  /**
   * 自定义函数式取值
   */
  setCustomFunctionMode(option: DataSourceStaticFunction<T>) {
    const that = this
    this.reload = () => {
      that.ctl.loading = true
      option.call(that.module, that.ctl, {
        successCallback(data: any[]) {
          if (that.dataSourceProcess) {
            //自定义的数据处理过程
            that.ctl.dataReal = that.dataSourceProcess(data)
          } else {
            that.ctl.dataReal = data
          }

          that.ctl.loading = false
          YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined)
        },
        failCallback() {
          that.ctl.dataReal = []
          that.ctl.loading = false
          YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined)
        }
      })
    }
    this.reload()
  }

  /**
   * SQL取值
   */
  setSqlMode(option: DataSourceDb) {
    const that = this
    this.reload = () => {
      //异步请求数据内容
      that.ctl.loading = true

      YvanUI.dbs[option.db]
        .query({
          params: option.params,
          needCount: false,
          sqlId: option.sqlId
        })
        .then(res => {
          const { data: resultData, params: resParams } = res

          if (this.dataSourceProcess) {
            //自定义的数据处理过程
            that.ctl.dataReal = this.dataSourceProcess(resultData)
          } else {
            that.ctl.dataReal = resultData
          }
          YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined)
        })
        .catch(r => {
          that.ctl.dataReal = []
        })
        .finally(() => {
          that.ctl.loading = false
        })
    }
    this.reload()
  }

  constructor(
    ctl: any,
    option: DataSource<T>,
    dataSourceProcess?: DataSourceProcessFunction
  ) {
    if (isDesignMode()) {
      return
    }
    this.ctl = ctl
    this.option = option
    this.dataSourceProcess = dataSourceProcess
    this.module = ctl._webix.$scope
  }

  public init() {
    if (!this.option) {
      //没有设值，退出
      this.reload = undefined
      return
    }

    if (typeof this.option === 'function') {
      //以 function 方式运行
      this.setCustomFunctionMode(this.option)
      return
    }

    if (_.isArray(this.option)) {
      //结果就是数组
      this.reload = () => {
        this.ctl.dataReal = this.option
        this.ctl.$yvDispatch(this.ctl.onDataComplete)
      }
      this.reload()
      return
    }

    // 使 watch 生效
    _.each(this.option.watch, watchExp => {
      const unwatch = this.module.$watch(watchExp, () => {
        if (this.reload) {
          this.reload()
        }
      })
      this.watches.push(unwatch)
    })

    if (this.option.type === 'function') {
      // 取 bind 函数
      if (typeof this.option.bind === 'function') {
        this.setCustomFunctionMode(this.option.bind)
      } else {
        const bindFunction: DataSourceStaticFunction<T> = _.get(
          this.module,
          this.option.bind
        ) as DataSourceStaticFunction<T>
        if (!bindFunction) {
          console.error(`没有找到名称为 ${this.option.bind} 的方法`)
          return
        }
        this.setCustomFunctionMode(bindFunction)
      }
    } else if (this.option.type === 'SQL') {
      this.setSqlMode(this.option)
    } else {
      console.error(`其他方式没有实现`)
    }
  }

  destory() {
    // 解除全部 watch
    _.each(this.watches, unwatch => {
      unwatch()
    })
    this.reload = undefined
    this.ctl.dataReal = []
  }
}
