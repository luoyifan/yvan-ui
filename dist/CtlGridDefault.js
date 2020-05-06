export var YvGridProp = {
    editable: false,
    checkbox: false,
    editSingleClick: true,
    allowNewRow: true,
    filterable: true,
    loading: false,
    showRowNumber: true,
    autoSizeColumns: false,
    allowCellSelection: false,
    allowRowSelection: true,
    idField: undefined,
    valueSep: true,
    saveOn: 'rowChanged',
    newRowData: undefined,
    stopEditingWhenGridLosesFocus: false,
    columns: [],
    columnGroup: [],
    data: undefined
};
export var YvGridColumnProp = {
    hidden: false,
    field: '',
    title: '',
    width: undefined,
    maxwidth: 800,
    minwidth: 0,
    sortable: false,
    resizable: true,
    editable: false,
    filterable: false,
    calcExpr: undefined,
    editMode: 'text'
};
export var YvGridColumnEditProp = {
    widget: undefined,
    bind: [],
    on: true,
    off: false,
    precision: 0,
    idField: 'id',
    textField: 'text',
    maxlength: undefined,
    dateformat: 'yyyy-MM-dd',
    datetimeformat: 'yyyy-MM-dd HH:mm:ss',
    data: []
};
//# sourceMappingURL=CtlGridDefault.js.map