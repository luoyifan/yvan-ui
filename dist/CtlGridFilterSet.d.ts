export default class CtlGridFilterSet {
    $el: any;
    $selectAll: any;
    data: any[];
    checkedData: any[];
    $container: any;
    $clear: any;
    $apply: any;
    hidePopup: any;
    init(params: any): void;
    refreshState(): void;
    getGui(): any;
    isFilterActive(): boolean;
    doesFilterPass(): boolean;
    getModel(): {
        filterType: string;
        filter: any[];
    } | undefined;
    setModel(model: any): void;
    afterGuiAttached(param: any): void;
    destroy(): void;
    getModelAsString(): void;
    setupDOM(params: any): void;
}
