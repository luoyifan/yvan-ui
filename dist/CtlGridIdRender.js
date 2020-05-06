export default function (params, grid) {
    if (params.node.cstate) {
        if (params.node.cstate === 'validate' || params.node.cstate === 'pending') {
            return '<i class="fa fa-spinner fa-spin"></i>';
        }
        if (params.node.cstate === 'editing') {
            return '<i class="fa fa-edit"></i>';
        }
        if (params.node.cstate === 'ok') {
            return '<i class="fa fa-check" style="color: green;"></i>';
        }
        if (params.node.cstate === 'error') {
            return '<i class="fa fa-exclamation-circle" style="color: red;"></i>';
        }
    }
    if (params.node.rowPinned === 'top') {
        return '+';
    }
    if (_.size(params.data) <= 0) {
        //数据还没刷出来
        return '<i class="fa fa-spinner fa-spin"></i>';
    }
    if (grid && grid.pagination && grid.gridPage) {
        return 1 + params.node.rowIndex + grid.gridPage.pageSize * (grid.gridPage.currentPage - 1);
    }
    return 1 + params.node.rowIndex;
}
//# sourceMappingURL=CtlGridIdRender.js.map