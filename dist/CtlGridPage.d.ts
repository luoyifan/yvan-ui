import { CtlGrid } from './CtlGrid';
export declare class CtlGridPage {
    grid: CtlGrid;
    getPageData: (currentPage: number, pageSize: number) => {};
    private _currentPage;
    private _pageSize;
    private _pageCount;
    private _itemCount;
    get currentPage(): number;
    set currentPage(cp: number);
    get pageSize(): number;
    set pageSize(ps: number);
    get pageCount(): number;
    get itemCount(): number;
    set itemCount(ic: number);
    refreshGrid(): void;
    private firstButtomDom;
    private prevButtomDom;
    private nextButtomDom;
    private lastButtomDom;
    private currenpageDom;
    private gridpagerDom;
    private itemcountDom;
    private pageSizeDom;
    private gridpagerLeft;
    private gridpagerRight;
    private gridpagerCenter;
    constructor(grid: CtlGrid);
    private disableButton;
    private activeButton;
    private refreshPageViewInfo;
}
