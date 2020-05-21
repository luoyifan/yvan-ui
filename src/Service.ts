import 'reflect-metadata';
import { Ajax } from './YvanUIAjax';

/**
 * 提取返回值类型
 */
export type RType<T> = T extends (...args: any[]) => infer R ? R : any

/**
 * 提取返回值
 */
export type PType<T> = T extends (...args: infer P) => any ? P : never

/**
 * 服务代理包装类型
 */
export type Broker<T> = {
    [KEY in keyof T]: T[KEY] extends Function ? (...args: PType<T[KEY]>) => Promise<RType<T[KEY]>> : never
}

/**
 * 服务调用
 */
export function brokerInvoke(serverUrl: string, method: string, args: any): Promise<any> {
    return new Promise((resolve,reject) => {
        const ajax: Ajax.Function = _.get(window, 'YvanUI.ajax');

        ajax({
            url: serverUrl + '@' + method,
            method: 'POST-JSON',
            data: args

        }).then(res => {
            resolve(res);
            
        }).catch(e=>{
            reject(e);
        });
    })
}

/**
 * 创建服务代理
 */
export function createBroker<T extends new (...args: any) => any>(serviceType: T): Broker<InstanceType<T>> {

    const serviceProxy: any = serviceType;
    const result = {};
    // 具体参见 com.yvan.serverless.ServerLessServlet@doGet
    _.each(serviceProxy.funcs, fun => {
        _.set(result, fun, function () {
            return brokerInvoke(serviceProxy.invokeUrl, fun, {
                args: Array.prototype.slice.call(arguments)
            });
        });
    });

    return <Broker<InstanceType<T>>>result;
}