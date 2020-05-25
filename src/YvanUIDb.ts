import { Ajax } from './YvanUIAjax';

export namespace Db {

    export interface CreateDbOption {
        baseUrl: string,
        defaultDb: string,
        ajax: Ajax.Function
    }

    export interface CompileOption {
        sqlId: string
    }

    export interface ExecuteOption extends CompileOption {
        params?: any
    }

    export interface QueryOption extends ExecuteOption {
        limit?: number
        limitOffset?: number
        needCount?: boolean
        filterModel?: any
        sortModel?: any
    }

    export interface Response extends Ajax.Response<any> {

        /**
         * 输出后台运行的实际 SQL (DEBUG 模式才会存在)
         */
        sql: string

        /**
         * 输出后台运行的实际 SQL参数 (DEBUG 模式才会存在)
         */
        params: any[]

        pagination: {
            /**
             * 总行数
             */
            total?: number

            /**
             * 页大小
             */
            size?: number

            /**
             * 当前页
             */
            current?: number
        }
    }

    export class Client {
        private baseUrl: string;
        private ajax: Ajax.Function;
        private defaultDb: string;

        constructor(createOption: Db.CreateDbOption) {
            this.baseUrl = createOption.baseUrl
            this.ajax = createOption.ajax
            this.defaultDb = createOption.defaultDb
        }

        execute(option: Db.ExecuteOption): Promise<Db.Response> {
            return new Promise(((resolve, reject) => {
                const sqlTimeId = _.uniqueId('SQL')
                console.time(sqlTimeId)

                this.ajax({
                    url: this.baseUrl + '/execute',
                    method: 'POST-JSON',
                    data: {
                        db: this.defaultDb,
                        sqlId: option.sqlId,
                        params: option.params
                    }

                }).then((root) => {
                    if (root && root.success) {
                        const { sql, params: resParams, data } = root.data
                        if (sql) {
                            console.log('SQL-execute', { sql, resParams })
                        }
                        resolve(data)
                        return
                    }
                    reject(root.msg)

                }).catch((err) => {
                    reject(err)

                }).finally(() => {
                    console.timeEnd(sqlTimeId)
                })

            }))
        }

        query(option: Db.QueryOption): Promise<Db.Response> {
            return new Promise(((resolve, reject) => {
                const sqlTimeId = _.uniqueId('SQL')
                console.time(sqlTimeId)

                this.ajax({
                    url: this.baseUrl + '/query',
                    method: 'POST-JSON',
                    data: {
                        db: this.defaultDb,
                        filterModel: option.filterModel,
                        sortModel: option.sortModel,
                        limit: option.limit,
                        limitOffset: option.limitOffset,
                        needCount: option.needCount,
                        sqlId: option.sqlId,
                        params: option.params,
                    }

                }).then((root) => {
                    if (root && root.success) {
                        const { sql, params: resParams, data } = root.data
                        if (sql) {
                            console.log('SQL-query', { sql, resParams })
                        }
                        resolve(root.data)
                        return
                    }
                    reject(root.msg)

                }).catch((err) => {
                    reject(err)

                }).finally(() => {
                    console.timeEnd(sqlTimeId)
                })
            }))
        }
    }
}

/**
 * 创建一个 db 客户端
 */
export function createDb(createOption: Db.CreateDbOption): Db.Client {
    return new Db.Client(createOption)
}
