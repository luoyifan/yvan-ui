import { __spreadArrays } from "tslib";
var PropertyDescription = /** @class */ (function () {
    function PropertyDescription() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.propertyes = {
            props: [],
            events: []
        };
        _.each(args, function (arg) {
            _this.merge(arg);
        });
    }
    PropertyDescription.prototype.merge = function (pd) {
        this.propertyes.props = (_.uniqBy(__spreadArrays(this.propertyes.props, pd.props), 'name'));
        if (pd.events) {
            if (this.propertyes.events) {
                this.propertyes.events = (_.uniqBy(__spreadArrays(this.propertyes.events, pd.events), 'name'));
            }
            else {
                this.propertyes.events = _.uniqBy(__spreadArrays(pd.events), 'name');
            }
        }
    };
    /**
     * 根据分组名 获取属性定义
     */
    PropertyDescription.prototype.getPropsByGroup = function (name) {
        return _.filter(this.propertyes.props, function (i) { return i.group === name; });
    };
    /**
     * 获取全部事件
     */
    PropertyDescription.prototype.getEvents = function () {
        return this.propertyes.events;
    };
    return PropertyDescription;
}());
export { PropertyDescription };
//# sourceMappingURL=PropertyDescription.js.map