import * as YvanUI from '../../YvanUIExtend'
import { CtlInput } from './CtlInput'
import { parseYvanPropChangeVJson } from '../../CtlUtils'
import { CtlTextDefault } from '../../CtlDefaultValue'

export class CtlTextarea extends CtlInput<CtlTextarea> {
  static create(module: any, vjson: any): CtlTextarea {
    const that = new CtlTextarea(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlTextDefault)

    // 基础属性先执行
    that._create(vjson, that)
    const yvanProp = parseYvanPropChangeVJson(vjson, ['validate'])
    // 将 yvanProp 合并至当前 Ctl 对象
    _.assign(that, yvanProp)

    _.merge(vjson, that._webixConfig)
    return that
  }
}
