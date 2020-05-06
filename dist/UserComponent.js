function userComponentFactory(Component, name) {
}
/**
 * 自定义组件
 */
export function UserComponent(name) {
    return function (Component) {
        return userComponentFactory(Component, name);
    };
}
// 自定义组件
var UserComponentBase = /** @class */ (function () {
    function UserComponentBase() {
    }
    return UserComponentBase;
}());
export { UserComponentBase };
//# sourceMappingURL=UserComponent.js.map