import { __assign } from "tslib";
export var CtlButtonDefault = {
    text: '',
    icon: '',
    // width: 120,
    type: 'text',
    autowidth: true,
};
export var CtlDataviewDefault = {};
export var CtlTreeDefault = {
    showCheckbox: false,
    showLeftIcon: true,
    showIcon: true,
};
export var CtlSidebarDefault = {};
export var CtlXtermDefault = {};
export var CtlConsoleLogDefault = {};
export var CtlCodeMirrorDefault = {
    mode: 'sql',
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    hintOptions: {
        tables: {
            users: ["name", "score", "birthDate"],
            countries: ["name", "population", "size"]
        }
    }
};
var CtlInputDefault = {
    labelWidth: 110,
    labelAlign: 'right',
    // width: 250,
    prompt: '请输入'
};
export var CtlTextDefault = __assign({}, CtlInputDefault);
export var CtlNumberDefault = __assign(__assign({}, CtlInputDefault), { precision: 0 });
export var CtlDateDefault = __assign(__assign({}, CtlInputDefault), { prompt: '请选择' });
export var CtlDateTimeDefault = __assign(__assign({}, CtlInputDefault), { 
    //width: 300,
    prompt: '请选择' });
export var CtlDateRangeDefault = __assign(__assign({}, CtlInputDefault), { 
    //width: 430,
    separator: ' 至 ', prompt: '请选择日期范围' });
export var CtlDateTimeRangeDefault = __assign(__assign({}, CtlInputDefault), { 
    //width: 430,
    separator: ' 至 ', prompt: '请选择时间范围' });
export var CtlComboDefault = __assign(__assign({}, CtlInputDefault), { prompt: '请选择' });
export var CtlMultiComboDefault = __assign(__assign({}, CtlInputDefault), { separator: ',', prompt: '请选择' });
export var CtlSearchDefault = __assign(__assign({}, CtlInputDefault), { prompt: '回车键查询' });
export var CtlCheckboxDefault = {
    // labelWidth: 110,
    labelAlign: 'right',
    checkValue: 'T',
    uncheckValue: 'F'
};
export var CtlSwitchDefault = {
    // labelWidth: 110,
    labelAlign: 'right',
    checkValue: 'T',
    uncheckValue: 'F'
};
export var CtlRadioDefault = {
    labelWidth: 110,
    labelAlign: 'right',
};
//# sourceMappingURL=CtlDefaultValue.js.map