import { __assign } from "tslib";
import axios from 'axios';
import Qs from 'qs';
export function downLoad(downLoadUrl, filename, data, header) {
    var YvanUI = _.get(window, 'YvanUI');
    YvanUI.loading();
    var createObjectURL = function (object) {
        return (window.URL) ? window.URL.createObjectURL(object) : _.get(window, 'webkitURL').createObjectURL(object);
    };
    // const formData = new FormData();
    // _.forOwn(data, (v, k) => {
    //     formData.append(k, v);
    // });
    var formData = data ? Qs.stringify(data) : '';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', downLoadUrl);
    xhr.responseType = 'blob';
    //xhr.setRequestHeader('Authorization', $.cookie('auth'))
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (header) {
        _.forOwn(header, function (v, k) {
            xhr.setRequestHeader(k, v);
        });
    }
    xhr.onload = function (e) {
        if (this.status === 200) {
            var blob = this.response;
            if (_.hasIn(window, 'navigator.msSaveOrOpenBlob')) {
                navigator.msSaveBlob(blob, filename);
                YvanUI.clearLoading();
            }
            else {
                var a = document.createElement('a');
                var url = createObjectURL(blob);
                a.href = url;
                a.download = filename;
                $('body').append(a);
                a.click();
                $(a).remove();
                window.URL.revokeObjectURL(url);
                YvanUI.clearLoading();
            }
        }
    };
    xhr.send(formData);
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
        if (option.method === 'DOWNLOAD') {
            downLoad(createOption.baseUrl + option.url, option.fileName || 'file', option.data, option.headers);
            return new Promise(function (resolver, reject) {
            });
        }
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