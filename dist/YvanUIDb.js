export var Db;
(function (Db) {
    var Client = /** @class */ (function () {
        function Client(createOption) {
            this.baseUrl = createOption.baseUrl;
            this.ajax = createOption.ajax;
            this.defaultDb = createOption.defaultDb;
        }
        Client.prototype.execute = function (option) {
            var _this = this;
            return new Promise((function (resolve, reject) {
                var sqlTimeId = _.uniqueId('SQL');
                console.time(sqlTimeId);
                _this.ajax({
                    url: _this.baseUrl + '/execute',
                    method: 'POST-JSON',
                    data: {
                        db: _this.defaultDb,
                        sqlId: option.sqlId,
                        params: option.params
                    }
                }).then(function (root) {
                    if (root && root.success) {
                        var _a = root.data, sql = _a.sql, resParams = _a.params, data = _a.data;
                        if (sql) {
                            console.log('SQL-execute', { sql: sql, resParams: resParams });
                        }
                        resolve(data);
                        return;
                    }
                    reject(root.msg);
                }).catch(function (err) {
                    reject(err);
                }).finally(function () {
                    console.timeEnd(sqlTimeId);
                });
            }));
        };
        Client.prototype.query = function (option) {
            var _this = this;
            return new Promise((function (resolve, reject) {
                var sqlTimeId = _.uniqueId('SQL');
                console.time(sqlTimeId);
                _this.ajax({
                    url: _this.baseUrl + '/query',
                    method: 'POST-JSON',
                    data: {
                        db: _this.defaultDb,
                        filterModel: option.filterModel,
                        orderByModel: option.orderByModel,
                        limit: option.limit,
                        limitOffset: option.limitOffset,
                        needCount: option.needCount,
                        sqlId: option.sqlId,
                        params: option.params,
                    }
                }).then(function (root) {
                    if (root && root.success) {
                        var _a = root.data, sql = _a.sql, resParams = _a.params, data = _a.data;
                        if (sql) {
                            console.log('SQL-query', { sql: sql, resParams: resParams });
                        }
                        resolve(root.data);
                        return;
                    }
                    reject(root.msg);
                }).catch(function (err) {
                    reject(err);
                }).finally(function () {
                    console.timeEnd(sqlTimeId);
                });
            }));
        };
        return Client;
    }());
    Db.Client = Client;
})(Db || (Db = {}));
/**
 * 创建一个 db 客户端
 */
export function createDb(createOption) {
    return new Db.Client(createOption);
}
//# sourceMappingURL=YvanUIDb.js.map