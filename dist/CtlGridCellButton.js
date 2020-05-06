import { YvEventDispatch } from './YvanEvent';
var CtlGridCellButton = /** @class */ (function () {
    function CtlGridCellButton() {
    }
    CtlGridCellButton.prototype.init = function (params) {
        this.$el = document.createElement('div');
        this._buildHTML.call(this, params);
    };
    CtlGridCellButton.prototype.getGui = function () {
        return this.$el;
    };
    CtlGridCellButton.prototype.destroy = function () {
        for (var i = 0; i < this.$btns.length; i++) {
            var btn = this.$btns[i];
            btn.removeEventListener('click', this.func[i]);
        }
    };
    CtlGridCellButton.prototype.refresh = function (params) {
        this._buildHTML.call(this, params);
    };
    CtlGridCellButton.prototype._buildHTML = function (params) {
        var _this = this;
        var arr = [];
        var func = [];
        var buttons = params.buttons, rowIndex = params.rowIndex, data = params.data, api = params.api, column = params.column;
        if (typeof buttons === 'object' && buttons.constructor === Array) {
            _.each(buttons, function (btn) {
                if (typeof btn.render === 'function') {
                    var r = btn.render.call(_this, rowIndex, data);
                    if (r !== true) {
                        return;
                    }
                }
                else if (typeof btn.render === 'boolean' && !btn.render) {
                    return;
                }
                arr.push("<a class=\"yv-grid-button " + btn.cssType + "\">" +
                    (typeof btn.iconCls === 'string'
                        ? '<i class="' + btn.iconCls + '"></i>'
                        : '') +
                    btn.text +
                    '</a>');
                func.push(btn.onClick);
            });
        }
        this.$el.innerHTML =
            '<div class="yv-grid-buttons">' + arr.join('') + '</div>';
        var $btns = this.$el.querySelectorAll('.yv-grid-button');
        var _loop_1 = function (i) {
            var btn = $btns[i];
            var fun = func[i];
            btn.addEventListener('click', function () {
                var ctl = api.vue;
                var module = api.vue._webix.$scope;
                YvEventDispatch(fun, ctl, { data: data, rowIndex: rowIndex, colId: column.colId }, module);
            });
        };
        for (var i = 0; i < $btns.length; i++) {
            _loop_1(i);
        }
        this.$btns = $btns;
        this.func = func;
    };
    return CtlGridCellButton;
}());
export default CtlGridCellButton;
//# sourceMappingURL=CtlGridCellButton.js.map