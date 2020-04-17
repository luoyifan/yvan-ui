import { CtlInput } from '../input/CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlComboDefault } from '../../CtlDefaultValue'
import pinyin from '../../pinyin/pinyin'
import { DataSource } from '../../YvanDataSource'
import { YvEvent } from '../../YvanEvent'
import { YvDataSource } from '../../YvanDataSourceImp'

/**
 * 下拉框组件
 */
export class CtlCombo extends CtlInput<CtlCombo> {
  static create(vjson: any): CtlCombo {
    const that = new CtlCombo(vjson)

    _.defaultsDeep(vjson, CtlComboDefault)

    // 基础属性先执行
    that._create(vjson, that)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['options', 'dataSource'])

    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig)

    return that
  }

  /**
   * 数据绑定完成后触发
   */
  onDataComplete?: YvEvent<CtlCombo, any>

  /**
   * 修改下拉选项
   */
  set options(nv: any[]) {
    const options: any = {
      filter(item: any, filterWord: string) {
        if (_.size(filterWord) <= 0) {
          return true
        }
        const nodePy = pinyin.getCamelChars(item.text).toLowerCase()
        return (
          nodePy.indexOf(filterWord.toLowerCase()) >= 0 ||
          item.text.indexOf(filterWord) >= 0
        )
      },
      body: {
        template: '#text#',
        type: {
          height: 36
        },
        data: nv
      }
    }

    if (!this._webix) {
      _.merge(this._webixConfig, {
        view: 'combo',
        options
      })
      return
    }
    this._webix.define('options', options)
    this._webix.refresh()
  }

  /**
   * 获取显示的值
   */
  getText(): string {
    return this._webix.getText()
  }

  /**
   * 下拉选项
   */
  set dataReal(nv: any[]) {
    this.options = nv
  }

  /**
   * 获取数据源设置
   */
  get dataSource(): DataSource<CtlCombo> {
    return this._dataSource
  }

  /**
   * 设置数据源
   */
  set dataSource(nv: DataSource<CtlCombo>) {
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
  private _dataSource: DataSource<CtlCombo>

  //数据源管理器
  private dataSourceBind?: YvDataSource<CtlCombo>

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

    if (this.dataSource.type !== 'SQL') {
      return data
    }

    const displayField = this.dataSource.displayField || 'text'
    const valueField = this.dataSource.valueField || 'id'
    return _.map(data, item => {
      return {
        id: item[valueField],
        text: item[displayField]
      }
    })
  }

  //刷新状态时，自动重绑数据源
  protected refreshState() {
    super.refreshState()
    this._rebindDataSource()
  }
}
