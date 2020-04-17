export default class CtlGridEditor {
    data: any;
    colDef: any;
    column: any;
    focusAfterAttached: any;
    field: any;
    valid: any;
    origin: any;
    vue: any;

    // gets called once after the editor is created
    init(params: any): void {
        this.data = params.data;
        this.colDef = params.colDef;
        this.column = params.column;
        const {type, data, colDef, column, cellStartedEdit, value, editParams} = params;

        _.assign(this, {
            type, value, data, colDef, column, editParams
        });

        this.focusAfterAttached = cellStartedEdit;

        this.field = colDef.field;
        this.valid = params.valid;
        this.origin = value;
        this.vue = params.api.vue;
    }

    // Return the DOM element of your editor, this is what the grid puts into the DOM
    getGui() {
    }

    // Gets called once after GUI is attached to DOM.
    // Useful if you want to focus or highlight a component
    // (this is not possible when the element is not attached)
    afterGuiAttached() {
    }

    // Should return the final value to the grid, the result of the editing
    getValue() {
    }

    setValue(newValue: any) {
        console.error('不支持 setValue:' + newValue)
    }

    // Gets called once by grid after editing is finished
    // if your editor needs to do any cleanup, do it here
    destroy() {
        if (typeof this.valid === 'undefined') {
            return
        }
        const validMsg = this.valid(this.getValue(), this.vue.getEditRow());
        if (validMsg) {
            this.vue.currentEditValidMsg[this.field] = validMsg

        } else {
            this.vue.currentEditValidMsg[this.field] = undefined
        }
    }

    // Gets called once after initialised.
    // If you return true, the editor will appear in a popup
    isPopup() {
        return false
    }

    // Gets called once before editing starts, to give editor a chance to
    // cancel the editing before it even starts.
    isCancelBeforeStart() {
        //如果这里返回 true, 就会取消编辑
    }

    // Gets called once when editing is finished (eg if enter is pressed).
    // If you return true, then the result of the edit will be ignored.
    isCancelAfterEnd() {
        //这里返回 true, 就会取消该单元格编辑，还原其内容
    }

    // If doing full row edit, then gets called when tabbing into the cell.
    focusIn() {
    }

    // If doing full row edit, then gets called when tabbing out of the cell.
    focusOut() {
    }
}
