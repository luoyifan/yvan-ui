import { __spreadArrays } from "tslib";
/**
 * 内部函数
 * 将 vjson 中，属于 yvanui 的属性从 vjson 中删掉。
 * 并返回 yvanProp 属性
 */
export function parseYvanPropChangeVJson(vjson, names) {
    var yvanProp = {};
    _.forEach(__spreadArrays(names, [
        'debugger',
        'ctlName',
        'entityName',
        'onRender'
    ]), function (name) {
        if (_.has(vjson, name)) {
            yvanProp[name] = vjson[name];
            delete vjson[name];
        }
    });
    return yvanProp;
}
//# sourceMappingURL=CtlUtils.js.map