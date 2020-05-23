import 'reflect-metadata';
/**
 * 服务调用
 */
export function brokerInvoke(serverUrl, method, args) {
    return new Promise(function (resolve, reject) {
        var ajax = _.get(window, 'YvanUI.ajax');
        ajax({
            url: serverUrl + '@' + method,
            method: 'POST-JSON',
            data: args
        }).then(function (res) {
            resolve(res);
        }).catch(function (e) {
            reject(e);
        });
    });
}
/**
 * 创建服务代理
 */
export function createBroker(serviceType) {
    var serviceProxy = serviceType;
    var result = {};
    // 具体参见 com.yvan.serverless.ServerLessServlet@doGet
    _.each(serviceProxy.funcs, function (fun) {
        _.set(result, fun, function () {
            return brokerInvoke(serviceProxy.invokeUrl, fun, {
                args: Array.prototype.slice.call(arguments)
            });
        });
    });
    return result;
}
//# sourceMappingURL=Service.js.map