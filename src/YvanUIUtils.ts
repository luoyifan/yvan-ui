/**
 * 获取页面 URL 问号之后的参数
 */
export function getQueryString(): any {
    const url = document.location.search;
    const theRequest: any = {};
    if (url.indexOf("?") >= 0) {
        let str = url.substr(1);
        const strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            const vs = strs[i].split("=");
            theRequest[vs[0]] = unescape(vs[1]);
        }
    }
    return theRequest;
}

/**
 * 统一吧下划线（字符串/对象/数组）变成驼峰命名
 */
export function camelCase(obj: any): any {
    if (typeof obj === 'string') {
        return _.camelCase(obj)
    }
    if (_.isArray(obj)) {
        return _.map(obj, (item) => {
            return camelCase(item)
        })
    }
    if (typeof obj === 'object') {
        const ret: any = {}
        _.forOwn(obj, (value, key) => {
            ret[_.camelCase(key)] = value
        })
        return ret
    }
    console.error('无法转换' + obj)
}

/**
 * 统一吧驼峰（字符串/对象/数组）变成下划线
 */
export function snakeCase(obj: any): any {
    if (typeof obj === 'string') {
        return _.snakeCase(obj)
    }
    if (_.isArray(obj)) {
        return _.map(obj, (item) => {
            return snakeCase(item)
        })
    }
    if (typeof obj === 'object') {
        const ret: any = {}
        _.forOwn(obj, (value, key) => {
            ret[_.snakeCase(key)] = value
        })
        return ret
    }
    console.error('无法转换' + obj)
}


/**
 * 将任意 planObject 对象，转换为 hash 描述
 */
export function param(obj: any): string {
    return $.param(obj)
}

/**
 * 将 hash 描述转换为 planObject 对象
 * @param s
 */
export function unparam(query: string): any {
    const queryString: any = {};
    if (query.slice(0, 1) === "#") {
        query = query.slice(1);
    }
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        pair[0] = decodeURIComponent(pair[0]);
        pair[1] = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = pair[1];
        } else if (typeof queryString[pair[0]] === "string") {
            const arr = [queryString[pair[0]], pair[1]];
            queryString[pair[0]] = arr;
        } else {
            queryString[pair[0]].push(pair[1]);
        }
    }
    return queryString;
}
