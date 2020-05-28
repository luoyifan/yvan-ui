import { Ajax } from './YvanUIAjax';
export declare namespace Db {
    interface CreateDbOption {
        baseUrl: string;
        defaultDb: string;
        ajax: Ajax.Function;
    }
    interface CompileOption {
        sqlId: string;
    }
    interface ExecuteOption extends CompileOption {
        params?: any;
    }
    interface QueryOption extends ExecuteOption {
        limit?: number;
        limitOffset?: number;
        needCount?: boolean;
        filterModel?: any;
        sortModel?: any;
    }
    interface Response extends Ajax.Response<any> {
        /**
         * 输出后台运行的实际 SQL (DEBUG 模式才会存在)
         */
        sql: string;
        /**
         * 输出后台运行的实际 SQL参数 (DEBUG 模式才会存在)
         */
        params: any[];
        pagination: {
            /**
             * 总行数
             */
            total?: number;
            /**
             * 页大小
             */
            size?: number;
            /**
             * 当前页
             */
            current?: number;
        };
    }
    class Client {
        private baseUrl;
        private ajax;
        private defaultDb;
        constructor(createOption: Db.CreateDbOption);
        execute(option: Db.ExecuteOption): Promise<Db.Response>;
        query(option: Db.QueryOption): Promise<Db.Response>;
    }
}
/**
 * 创建一个 db 客户端
 */
export declare function createDb(createOption: Db.CreateDbOption): Db.Client;
