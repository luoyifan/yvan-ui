import {CtlGrid} from "./CtlGrid";

export class CtlGridPage {

    public grid: CtlGrid;

    public getPageData!: (currentPage: number, pageSize: number) => {};

    private _currentPage: number = 1;

    private _pageSize: number = 100;

    private _pageCount: number = 0;

    private _itemCount: number = 0;

    get currentPage() {
        return this._currentPage;
    }
    set currentPage(cp: number) {
        this._currentPage = cp;
        if (this._currentPage > this._pageCount) {
            this._currentPage = this._pageCount;
        }
        if (this._currentPage <= 0 && this._pageCount > 0) {
            this._currentPage = 1;
        }
        this.refreshPageViewInfo();
    }

    get pageSize() {
        return this._pageSize;
    }
    set pageSize(ps: number) {
        if (ps <= 0) {
            return;
        }

        this._pageSize = ps;
        this.refreshPageViewInfo();
    }

    get pageCount() {
        return this._pageCount;
    }

    get itemCount() {
        return this._itemCount;
    }

    set itemCount(ic: number) {
        this._itemCount = ic;
        this.refreshPageViewInfo();
    }


    public refreshGrid() {
        this.getPageData(1, this.pageSize);
    }

    private firstButtomDom: any;
    private prevButtomDom: any;
    private nextButtomDom: any;
    private lastButtomDom: any;
    private currenpageDom: any;
    private gridpagerDom: any;
    private itemcountDom: any;
    private pageSizeDom: any;
    private gridpagerLeft: any;
    private gridpagerRight: any;
    private gridpagerCenter: any;

    constructor(grid: CtlGrid) {
        this.grid = grid;
        this._pageSize = this.grid.pageSize;

        /** 找到aggrid 自带的pageview 替换子dom节点 **/

        var dom = this.grid.webix.$view.getElementsByClassName("ag-paging-panel ag-unselectable");
        var su_id = this.grid.webix.config.id;
        if (dom.length <= 0) {
            return;
        }
        /** 显示底部分页栏 **/
        dom[0].className = "ag-paging-panel ag-unselectable";

        dom[0].innerHTML =
            '<div id="wwww" role="group">' +
            '    <table class="ui-pg-table" style="width:100%;table-layout:fixed;height:100%;">' +
            '        <tbody><tr>' +
            '            <td id="gridpager_left_' + su_id + '" style="display: none"></td>' +
            '            <td id="gridpager_center_' + su_id + '">' +
            '                <table style="table-layout:auto;white-space: pre;margin-left:0;margin-right:auto;">' +
            '                    <tbody><tr>' +
            '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="First Page" style="cursor: default;"><span id="first_' + su_id + '" class="ctl-grid-page ui-icon fa fa-angle-double-left"></span></td>' +
            '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Previous Page" style="cursor: default;"><span id="prev_' + su_id + '" class="ctl-grid-page ui-icon fa fa-angle-left"></span></td>' +
            '                        <td><span style="color: #c0c0c0">|</span></td>\n' +
            '                        <td dir="ltr"><input aria-label="Page No." id="currenpage_' + su_id + '" type="text" size="2" maxlength="7" value="0"> 共 <span id="gridpager_' + su_id + '">219</span> 页 </td>' +
            '                        <td><span style="color: #c0c0c0">|</span></td>\n' +
            '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Next Page" style="cursor: default;"><span id="next_' + su_id + '" class="ctl-grid-page ui-icon fa fa-angle-right"></span></td>' +
            '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Last Page" style="cursor: default;"><span id="last_' + su_id + '" class="ctl-grid-page ui-icon fa fa-angle-double-right"></span></td>' +
            '                        <td dir="ltr"><select id="pagesize_' + su_id + '" title="Records per Page"><option value="20" selected="selected">20</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select></td>' +
            '                    </tr></tbody>' +
            '                </table>' +
            '            </td>' +
            '            <td id="gridpager_right_' + su_id + '" style="text-align:right;">' +
            '               <span dir="ltr" style="text-align:right" id="itemcount_' + su_id + '">41 - 60　共 4,367 条</span>' +
            '            </td>' +
            '        </tr></tbody>' +
            '    </table>' +
            '</div>';

        this.firstButtomDom = document.getElementById("first_" + su_id);
        this.prevButtomDom = document.getElementById("prev_" + su_id);
        this.nextButtomDom = document.getElementById("next_" + su_id);
        this.lastButtomDom = document.getElementById("last_" + su_id);
        this.currenpageDom = document.getElementById("currenpage_" + su_id);
        this.gridpagerDom = document.getElementById("gridpager_" + su_id);
        this.itemcountDom = document.getElementById("itemcount_" + su_id);
        this.pageSizeDom = document.getElementById("pagesize_" + su_id);
        this.gridpagerCenter = document.getElementById("gridpager_center_" + su_id);
        this.gridpagerLeft = document.getElementById("gridpager_left_" + su_id);
        this.gridpagerRight = document.getElementById("gridpager_right_" + su_id);

        if (this.grid.pagination) {
            this.gridpagerCenter.style.display = '';
        } else {
            this.gridpagerCenter.style.display = 'none';
        }


        this.refreshPageViewInfo();

        var me = this;

        this.currenpageDom.onkeydown = function (event: any) {
            if (event.keyCode === 13) { // enter键
                me.currentPage = parseInt(event.srcElement.value);
            } else {

                if (event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) {
                    return false;
                }
            }
        };

        this.pageSizeDom.onchange = function (v: any) {
            me.pageSize = v.srcElement.value;
            me.grid.paginationSetPageSize(me.pageSize);
            if (typeof me.getPageData === 'function') {
                me.getPageData(1, me.pageSize);
            }
        };

        var buttons = dom[0].getElementsByClassName("ctl-grid-page ui-icon");
        var buttons1 = dom[0].getElementsByClassName("ctl-grid-page ui-icon-disable");
        buttons = _.union(buttons, buttons1);
        _.each(buttons, (button) => {
            button.onclick = function (q: any) {
                for (let i = 0; i < q.srcElement.classList.length; i++) {
                    if (q.srcElement.classList[i] === 'ui-icon-disable') {
                        return;
                    }
                }
                const pre = _.split(q.srcElement.id, '_' + me.grid.webix.config.id);

                let cp = me.currentPage;
                switch (pre[0]) {
                    case 'first': {
                        cp = 1;
                        break;
                    }
                    case 'prev': {
                        if (cp > 1) {
                            cp -= 1;
                        }
                        break;
                    }
                    case 'next': {
                        if (cp < me.pageCount) {
                            cp += 1;
                        }
                        break;
                    }
                    case 'last': {
                        cp = me.pageCount;
                        me.disableButton(q.srcElement);
                        break;
                    }
                }

                if (typeof me.getPageData === 'function') {
                    me.getPageData(cp, me.pageSize);
                }
            }
        });
    }

    private disableButton(element: any) {
        if (element.className.includes('ui-icon-disable')) {
            return;
        }
        element.className = _.replace(element.className, 'ui-icon', 'ui-icon-disable');
    }

    private activeButton(element: any) {
        if ((!element.className.includes('ui-icon-disable')) && element.className.includes('ui-icon')) {
            return;
        }
        element.className = _.replace(element.className, 'ui-icon-disable', 'ui-icon');
    }

    private refreshPageViewInfo() {

        if (this.grid.pagination) {
            if (this._itemCount > 0 && this._pageSize > 0) {
                this._pageCount = Math.ceil(this._itemCount / this._pageSize);
            }

            this.pageSizeDom.value = this._pageSize;
            this.currenpageDom.value = this._currentPage;
            this.gridpagerDom.innerText = this._pageCount;

            if (this.currentPage <= 0) {
                this.itemcountDom.innerText = '0 - 0　共 0 条'
            } else {
                let min = ((this.currentPage - 1) * this.pageSize + 1);
                let max = (this.currentPage * this.pageSize);

                if (min > this._itemCount) {
                    min = this._itemCount
                }
                if (max > this._itemCount) {
                    max = this._itemCount;
                }
                this.itemcountDom.innerText = min + ' - ' + max + '  共 ' + this.itemCount + ' 条';
            }

            if (this.currentPage > 1) {
                this.activeButton(this.firstButtomDom);
                this.activeButton(this.prevButtomDom);
            } else {
                this.disableButton(this.firstButtomDom);
                this.disableButton(this.prevButtomDom);
            }

            if (this.currentPage < this.pageCount) {
                this.activeButton(this.nextButtomDom);
                this.activeButton(this.lastButtomDom);
            } else {
                this.disableButton(this.nextButtomDom);
                this.disableButton(this.lastButtomDom);
            }
        } else {
            this.itemcountDom.innerText = '共 ' + this.itemCount + ' 条';
        }
    }
}



