import { __assign } from "tslib";
var base = {
    labelWidth: 110,
    labelAlign: 'right'
};
var text = __assign({}, base);
var datebox = __assign({}, base);
var datetimebox = __assign({}, base);
var daterange = __assign({}, base);
var searchbox = __assign({}, base);
var password = __assign({}, base);
var area = __assign({}, base);
var select = __assign({}, base);
var selectMuli = __assign({}, base);
var checkbox = __assign({}, base);
var radiobox = __assign({}, base);
function extendPlus(inputCfg, defaultValue) {
    _.forOwn(defaultValue, function (value, key) {
        if (inputCfg.hasOwnProperty(key)) {
            // 如果属性有被设置，就忽略默认属性
            return;
        }
        _.set(inputCfg, key, value);
    });
}
/**
 * 根据 input 组件的 view 类型，套用相应的默认值
 * @param inputCfg
 */
export default function (inputCfg) {
    switch (inputCfg.view) {
        case 'text':
            extendPlus(inputCfg, text);
            break;
        case 'datebox':
            extendPlus(inputCfg, datebox);
            break;
        case 'datetimebox':
        case 'datepicker':
            extendPlus(inputCfg, datetimebox);
            break;
        case 'daterangepicker':
        case 'daterangebox':
        case 'datetimerangebox':
            extendPlus(inputCfg, daterange);
            break;
        case 'search':
        case 'searchbox':
            extendPlus(inputCfg, searchbox);
            break;
        case 'password':
            extendPlus(inputCfg, password);
            break;
        case 'area':
            extendPlus(inputCfg, area);
            break;
        case 'select':
            extendPlus(inputCfg, select);
            break;
        case 'selectMuli':
            extendPlus(inputCfg, selectMuli);
            break;
        case 'checkbox':
            extendPlus(inputCfg, checkbox);
            break;
        case 'radiobox':
            extendPlus(inputCfg, radiobox);
            break;
    }
}
//# sourceMappingURL=CtlInputDefaultValue.js.map