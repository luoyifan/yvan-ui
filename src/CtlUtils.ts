/**
 * 内部函数
 * 将 vjson 中，属于 yvanui 的属性从 vjson 中删掉。
 * 并返回 yvanProp 属性
 */
export function parseYvanPropChangeVJson(vjson: any, names: string[]): any {

    const yvanProp: any = {};

    _.forEach([
        ...names,
        'debugger',
        'ctlName',
        'entityName',
        'onRender'

    ], name => {
        if (_.has(vjson, name)) {
            yvanProp[name] = vjson[name];
            delete vjson[name]
        }
    });

    return yvanProp
}
