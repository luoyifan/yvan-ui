var CtlGridEditor = /** @class */ (function () {
    function CtlGridEditor() {
    }
    // gets called once after the editor is created
    CtlGridEditor.prototype.init = function (params) {
        this.data = params.data;
        this.colDef = params.colDef;
        this.column = params.column;
        var type = params.type, data = params.data, colDef = params.colDef, column = params.column, cellStartedEdit = params.cellStartedEdit, value = params.value, editParams = params.editParams;
        _.assign(this, {
            type: type, value: value, data: data, colDef: colDef, column: column, editParams: editParams
        });
        this.focusAfterAttached = cellStartedEdit;
        this.field = colDef.field;
        this.valid = params.valid;
        this.origin = value;
        this.vue = params.api.vue;
    };
    // Return the DOM element of your editor, this is what the grid puts into the DOM
    CtlGridEditor.prototype.getGui = function () {
    };
    // Gets called once after GUI is attached to DOM.
    // Useful if you want to focus or highlight a component
    // (this is not possible when the element is not attached)
    CtlGridEditor.prototype.afterGuiAttached = function () {
    };
    // Should return the final value to the grid, the result of the editing
    CtlGridEditor.prototype.getValue = function () {
    };
    CtlGridEditor.prototype.setValue = function (newValue) {
        console.error('不支持 setValue:' + newValue);
    };
    // Gets called once by grid after editing is finished
    // if your editor needs to do any cleanup, do it here
    CtlGridEditor.prototype.destroy = function () {
        if (typeof this.valid === 'undefined') {
            return;
        }
        var validMsg = this.valid(this.getValue(), this.vue.getEditRow());
        if (validMsg) {
            this.vue.currentEditValidMsg[this.field] = validMsg;
        }
        else {
            this.vue.currentEditValidMsg[this.field] = undefined;
        }
    };
    // Gets called once after initialised.
    // If you return true, the editor will appear in a popup
    CtlGridEditor.prototype.isPopup = function () {
        return false;
    };
    // Gets called once before editing starts, to give editor a chance to
    // cancel the editing before it even starts.
    CtlGridEditor.prototype.isCancelBeforeStart = function () {
        //如果这里返回 true, 就会取消编辑
    };
    // Gets called once when editing is finished (eg if enter is pressed).
    // If you return true, then the result of the edit will be ignored.
    CtlGridEditor.prototype.isCancelAfterEnd = function () {
        //这里返回 true, 就会取消该单元格编辑，还原其内容
    };
    // If doing full row edit, then gets called when tabbing into the cell.
    CtlGridEditor.prototype.focusIn = function () {
    };
    // If doing full row edit, then gets called when tabbing out of the cell.
    CtlGridEditor.prototype.focusOut = function () {
    };
    return CtlGridEditor;
}());
export default CtlGridEditor;
//# sourceMappingURL=CtlGridEditor.js.map