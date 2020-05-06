/**
 * 获取页面 URL 问号之后的参数
 */
export function getQueryString() {
    var url = document.location.search;
    var theRequest = {};
    if (url.indexOf("?") >= 0) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var vs = strs[i].split("=");
            theRequest[vs[0]] = unescape(vs[1]);
        }
    }
    return theRequest;
}
/**
 * 统一吧下划线（字符串/对象/数组）变成驼峰命名
 */
export function camelCase(obj) {
    if (typeof obj === 'string') {
        return _.camelCase(obj);
    }
    if (_.isArray(obj)) {
        return _.map(obj, function (item) {
            return camelCase(item);
        });
    }
    if (typeof obj === 'object') {
        var ret_1 = {};
        _.forOwn(obj, function (value, key) {
            ret_1[_.camelCase(key)] = value;
        });
        return ret_1;
    }
    console.error('无法转换' + obj);
}
/**
 * 统一吧驼峰（字符串/对象/数组）变成下划线
 */
export function snakeCase(obj) {
    if (typeof obj === 'string') {
        return _.snakeCase(obj);
    }
    if (_.isArray(obj)) {
        return _.map(obj, function (item) {
            return snakeCase(item);
        });
    }
    if (typeof obj === 'object') {
        var ret_2 = {};
        _.forOwn(obj, function (value, key) {
            ret_2[_.snakeCase(key)] = value;
        });
        return ret_2;
    }
    console.error('无法转换' + obj);
}
/**
 * 将任意 planObject 对象，转换为 hash 描述
 */
export function param(obj) {
    return $.param(obj);
}
/**
 * 将 hash 描述转换为 planObject 对象
 * @param s
 */
export function unparam(query) {
    var queryString = {};
    if (query.slice(0, 1) === "#") {
        query = query.slice(1);
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        pair[0] = decodeURIComponent(pair[0]);
        pair[1] = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = pair[1];
        }
        else if (typeof queryString[pair[0]] === "string") {
            var arr = [queryString[pair[0]], pair[1]];
            queryString[pair[0]] = arr;
        }
        else {
            queryString[pair[0]].push(pair[1]);
        }
    }
    return queryString;
}
//# sourceMappingURL=YvanUIUtils.js.map