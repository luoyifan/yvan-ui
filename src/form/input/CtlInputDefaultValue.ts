const base: any = {
    labelWidth: 110,
    labelAlign: 'right'
};
const text: any = {
    ...base
};
const datebox: any = {
    ...base
};
const datetimebox: any = {
    ...base
};
const daterange: any = {
    ...base
};
const searchbox: any = {
    ...base
};
const password: any = {
    ...base
};
const area: any = {
    ...base
};
const select: any = {
    ...base
};
const selectMuli: any = {
    ...base
};
const checkbox: any = {
    ...base
};
const radiobox: any = {
    ...base
};

function extendPlus(inputCfg: any, defaultValue: any) {
    _.forOwn(defaultValue, (value, key) => {
        if (inputCfg.hasOwnProperty(key)) {
            // 如果属性有被设置，就忽略默认属性
            return;
        }

        _.set(inputCfg, key, value)
    })
}

/**
 * 根据 input 组件的 view 类型，套用相应的默认值
 * @param inputCfg
 */
export default function (inputCfg: any): void {
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
