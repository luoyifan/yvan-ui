import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import Qs from 'qs'

export function invokeApi<T>(apiId: string, args: IArguments, entity: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const ajax: Ajax.Function = _.get(window, 'YvanUI.ajax');
        const prefix = _.get(window, '_YvanUI_serverJSPrefix');

        const postBodyParamter = [];
        for (let i = 0; i < args.length; i++) {
            postBodyParamter.push(args[i]);
        }

        ajax({
            url: prefix + apiId,
            method: 'POST-JSON',
            data: {
                p: postBodyParamter
            }

        }).then(res => {
            _.extend(entity, res.data);
            resolve(entity);
        });
    })
}

export namespace Ajax {

    export interface CreateAjaxOption {
        baseUrl: string
    }

    export type MethodType = 'POST' | 'GET' | 'POST-JSON' | 'UPLOADEXCEL' | 'DOWNLOAD' | 'POST-FILE'

    /**
     * 请求参数
     */
    export interface Option {
        /**
         * url 地址
         */
        url: string,

        /**
         * 请求方法
         */
        method: MethodType,

        /**
         * 上传文件（如果需要的话）
         */
        file?: any,

        /**
         * 请求参数
         */
        data?: any,

        /**
         * 请求头
         */
        headers?: any

        /**
         * 是否只传送 responseData
         */
        disableResponseData?: boolean
    }

    /**
     * 数据响应
     */
    export interface Response {
        success: boolean
        msg: string
        data: any
    }

    export type Function = (option: Option) => Promise<Ajax.Response>
}

/**
 * 创建一个 Ajax 客户端
 */
export function createAjax(createOption: Ajax.CreateAjaxOption): Ajax.Function {

    if (createOption.baseUrl) {
        axios.defaults.baseURL = createOption.baseUrl;
    }

    return function (option: Ajax.Option) {

        const ax: AxiosRequestConfig = {
            url: option.url
        };

        if (option.method === 'POST-JSON') {
            ax.method = 'POST';
            ax.headers = {
                'Content-Type': 'application/json',
                ...option.headers
            };
            ax.data = JSON.stringify(option.data)

        } else if (option.method === 'POST-FILE') {
            //TODO 刘壮. 上传文件
            var forms = new FormData();
            ax.headers = {
                'Content-Type': 'multipart/form-data',
                ...option.headers
            };
            _.forOwn(option.data, (value, key) => {
                if (key === 'files') {
                    let i = 0;
                    _.each(value, f => {
                        forms.append('file' + (++i), f)
                    })
                } else {
                    forms.append(key, value)
                }
            });
            ax.data = forms;
            ax.method = 'POST'
        } else if (option.method === 'POST') {
            ax.method = 'POST';
            ax.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...option.headers
            };
            ax.data = Qs.stringify(option.data)

        } else if (option.method === 'GET') {
            ax.method = 'GET';
            ax.params = option.data
            ax.headers = {
                ...option.headers
            }

        } else {
            throw new Error('not implements')
        }

        return new Promise<Ajax.Response>((resolver, reject) => {
            axios(ax).then((resolverRaw: AxiosResponse<any>) => {
                resolver(resolverRaw.data)

            }).catch((reason: any) => {
                reject(reason)
            })
        })
    }
}
