export type GroupType = 'css' | 'data' | 'bind' | 'common'

export interface PropertyValue {
  /**
   * 属性名
   */
  name: string

  /**
   * 默认值
   */
  default: any

  /**
   * 隶属分组
   */
  group: GroupType

  /**
   * 描述
   */
  desc: string

  /**
   * 取值范围
   */
  type:
    | 'boolean'
    | 'number'
    | 'string'
    | 'object'
    | 'dataSource'
    | 'valid'
    | Array<string>
}

export interface EventValue {
  /**
   * 属性名
   */
  name: string

  /**
   * 描述
   */
  desc: string
}

export interface PropertyDescriptionInterface {
  props: PropertyValue[]
  events?: EventValue[]
}

export class PropertyDescription {
  propertyes: PropertyDescriptionInterface = {
    props: [],
    events: []
  }

  constructor(...args: PropertyDescriptionInterface[]) {
    _.each(args, arg => {
      this.merge(arg)
    })
  }

  merge(pd: PropertyDescriptionInterface) {
    this.propertyes.props = <any>(
      _.uniqBy([...this.propertyes.props, ...pd.props], 'name')
    )
    if (pd.events) {
      if (this.propertyes.events) {
        this.propertyes.events = <any>(
          _.uniqBy([...this.propertyes.events, ...pd.events], 'name')
        )
      } else {
        this.propertyes.events = <any>_.uniqBy([...pd.events], 'name')
      }
    }
  }

  /**
   * 根据分组名 获取属性定义
   */
  getPropsByGroup(name: GroupType): PropertyValue[] {
    return _.filter(this.propertyes.props, i => i.group === name)
  }

  /**
   * 获取全部事件
   */
  getEvents(): EventValue[] {
    return this.propertyes.events!
  }
}
