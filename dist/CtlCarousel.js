import { __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvEventDispatch } from './YvanEvent';
var CtlCarousel = /** @class */ (function (_super) {
    __extends(CtlCarousel, _super);
    function CtlCarousel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlCarousel.create = function (vjson) {
        var that = new CtlCarousel(vjson);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['onShow']);
        // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited: function () {
                    that.attachHandle(this);
                },
                onDestruct: function () {
                    that.removeHandle();
                },
                onShow: function () {
                    var value = this.getActiveIndex();
                    YvEventDispatch(that.onShow, that, value);
                }
            }
        });
        return that;
    };
    return CtlCarousel;
}(CtlBase));
export { CtlCarousel };
//# sourceMappingURL=CtlCarousel.js.map