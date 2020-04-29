export const CtlButtonDefault: any = {
    text: '',
    icon: '',
    // width: 120,
    type: 'text',
    autowidth: true,
    // cssType: 'primary'
};

export const CtlDataviewDefault: any = {};

export const CtlTreeDefault: any = {
    showCheckbox: false,
    showLeftIcon: true,
    showIcon: true,
};

export const CtlSidebarDefault: any = {

}

export const CtlXtermDefault: any = {

}

export const CtlCodeMirrorDefault = {
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

const CtlInputDefault: any = {
    labelWidth: 110,
    labelAlign: 'right',
    // width: 250,
    prompt: '请输入'
};

export const CtlTextDefault: any = {
    ...CtlInputDefault
};

export const CtlNumberDefault: any = {
    ...CtlInputDefault,
    precision: 0,
};

export const CtlDateDefault: any = {
    ...CtlInputDefault,
    prompt: '请选择'
};

export const CtlDateTimeDefault: any = {
    ...CtlInputDefault,
    //width: 300,
    prompt: '请选择'
};

export const CtlDateRangeDefault: any = {
    ...CtlInputDefault,
    //width: 430,
    separator: ' 至 ',
    prompt: '请选择日期范围'
};

export const CtlDateTimeRangeDefault: any = {
    ...CtlInputDefault,
    //width: 430,
    separator: ' 至 ',
    prompt: '请选择时间范围'
};

export const CtlComboDefault: any = {
    ...CtlInputDefault,
    prompt: '请选择'
};

export const CtlMultiComboDefault: any = {
    ...CtlInputDefault,
    separator: ',',
    prompt: '请选择'
};

export const CtlSearchDefault: any = {
    ...CtlInputDefault,
    prompt: '回车键查询'
};


export const CtlCheckboxDefault: any = {
    // labelWidth: 110,
    labelAlign: 'right',
    checkValue: 'T',
    uncheckValue: 'F'
};

export const CtlSwitchDefault: any = {
    // labelWidth: 110,
    labelAlign: 'right',
    checkValue: 'T',
    uncheckValue: 'F'
};

export const CtlRadioDefault: any = {
    labelWidth: 110,
    labelAlign: 'right',
};
