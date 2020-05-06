import { __extends } from "tslib";
import CtlGridEditor from './CtlGridEditor';
var CtlGridEditorCombo = /** @class */ (function (_super) {
    __extends(CtlGridEditorCombo, _super);
    function CtlGridEditorCombo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlGridEditorCombo.prototype.init = function (params) {
        _super.prototype.init.call(this, params);
        this.options = params.options;
        if (params.node.rowPinned) {
            this.isPinned = true;
        }
        var $dom = $('<input class="tmp-combo" />');
        this.$el = $dom[0];
        var that = this;
    };
    CtlGridEditorCombo.prototype.getGui = function () {
        return this.$el;
    };
    CtlGridEditorCombo.prototype.afterGuiAttached = function () {
        // YvGridEditor.afterGuiAttached.apply(this, arguments)
        // this.vv.focus()
        //setTimeout(() => {
        //    this.vv.open()
        //    this.vv.$nextTick(() => {
        //        debugger
        //    })
        //}, 1000)
    };
    CtlGridEditorCombo.prototype.getValue = function () {
        // if (typeof this.leaveReason === 'undefined') {
        //     //不是按导航键移动的, 需要触发校验
        //     if (typeof this.editParams.onValidate === 'function') {
        //         const r = this.editParams.onValidate(value)
        //         if (r) {
        //             //有校验错误，还原内容
        //             return this.origin
        //         }
        //     }
        // }
        //
        // //校验通过，调用 commit 并返回选定的新值
        // if (typeof this.editParams.onCommit === 'function') {
        //     this.editParams.onCommit({
        //         data: this.data,
        //         colDef: this.colDef,
        //         column: this.column,
        //         newValue: this.value,
        //         leaveReason: this.leaveReason,
        //     })
        // }
        // return this.value
    };
    CtlGridEditorCombo.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        // this.vv.$destroy()
    };
    CtlGridEditorCombo.prototype.focusIn = function () {
        _super.prototype.focusIn.call(this);
        // this.vv.focus()
    };
    CtlGridEditorCombo.prototype.focusOut = function () {
        _super.prototype.focusOut.call(this);
    };
    return CtlGridEditorCombo;
}(CtlGridEditor));
export default CtlGridEditorCombo;
//# sourceMappingURL=CtlGridEditorCombo.js.map