export function YvEventDispatch(event, sender, args, scope) {
    if (!event) {
        // 事件没定义
        return;
    }
    var ctl = sender;
    var vue = _.isUndefined(scope) ? ctl._webix.$scope : scope;
    if (typeof event === 'function') {
        // 事件本身就是方法
        return event.call(vue, sender, args);
    }
    if (event.type === 'function') {
        var targetFunc = _.get(vue, event.bind);
        if (typeof targetFunc !== 'function') {
            console.error("\u6A21\u5757\u6CA1\u6709 " + event.bind + " \u51FD\u6570");
            return;
        }
        return targetFunc.apply(vue, [sender, args]);
    }
}
//# sourceMappingURL=YvanEvent.js.map