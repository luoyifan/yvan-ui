export declare namespace Ajax {
    interface CreateAjaxOption {
        baseUrl: string;
    }
    type MethodType = 'POST' | 'GET' | 'POST-JSON' | 'UPLOADEXCEL' | 'DOWNLOAD' | 'POST-FILE';
    /**
     * 请求参数
     */
    interface Option {
        /**
         * url 地址
         */
        url: string;
        /**
         * 下载文件名
         */
        fileName?: string;
        /**
         * 请求方法
         */
        method: MethodType;
        /**
         * 上传文件（如果需要的话）
         */
        file?: any;
        /**
         * 请求参数
         */
        data?: any;
        /**
         * 请求头
         */
        headers?: any;
        /**
         * 是否只传送 responseData
         */
        disableResponseData?: boolean;
    }
    /**
     * 数据响应
     */
    interface Response<T> {
        success: boolean;
        msg: string;
        data: T;
    }
    type Function = (option: Option) => Promise<Ajax.Response<any>>;
}
export declare function downLoad(downLoadUrl: string, filename: string, data: any, header: any): void;
/**
 * 创建一个 Ajax 客户端
 */
export declare function createAjax(createOption: Ajax.CreateAjaxOption): Ajax.Function;
