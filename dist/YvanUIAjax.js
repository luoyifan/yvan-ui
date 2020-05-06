import { __assign } from "tslib";
import axios from 'axios';
import Qs from 'qs';
export function invokeApi(apiId, args, entity) {
    return new Promise(function (resolve, reject) {
        var ajax = _.get(window, 'YvanUI.ajax');
        var prefix = _.get(window, '_YvanUI_serverJSPrefix');
        var postBodyParamter = [];
        for (var i = 0; i < args.length; i++) {
            postBodyParamter.push(args[i]);
        }
        ajax({
            url: prefix + apiId,
            method: 'POST-JSON',
            data: {
                p: postBodyParamter
            }
        }).then(function (res) {
            _.extend(entity, res.data);
            resolve(entity);
        });
    });
}
/**
 * 创建一个 Ajax 客户端
 */
export function createAjax(createOption) {
    if (createOption.baseUrl) {
        axios.defaults.baseURL = createOption.baseUrl;
    }
    return function (option) {
        var ax = {
            url: option.url
        };
        if (option.method === 'POST-JSON') {
            ax.method = 'POST';
            ax.headers = __assign({ 'Content-Type': 'application/json' }, option.headers);
            ax.data = JSON.stringify(option.data);
        }
        else if (option.method === 'POST-FILE') {
            //TODO 刘壮. 上传文件
            var forms = new FormData();
            ax.headers = __assign({ 'Content-Type': 'multipart/form-data' }, option.headers);
            _.forOwn(option.data, function (value, key) {
                if (key === 'files') {
                    var i_1 = 0;
                    _.each(value, function (f) {
                        forms.append('file' + (++i_1), f);
                    });
                }
                else {
                    forms.append(key, value);
                }
            });
            ax.data = forms;
            ax.method = 'POST';
        }
        else if (option.method === 'POST') {
            ax.method = 'POST';
            ax.headers = __assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, option.headers);
            ax.data = Qs.stringify(option.data);
        }
        else if (option.method === 'GET') {
            ax.method = 'GET';
            ax.params = option.data;
            ax.headers = __assign({}, option.headers);
        }
        else {
            throw new Error('not implements');
        }
        return new Promise(function (resolver, reject) {
            axios(ax).then(function (resolverRaw) {
                resolver(resolverRaw.data);
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };
}
//# sourceMappingURL=YvanUIAjax.js.map