export default class CtlGridEditor {
    data: any;
    colDef: any;
    column: any;
    focusAfterAttached: any;
    field: any;
    valid: any;
    origin: any;
    vue: any;
    init(params: any): void;
    getGui(): void;
    afterGuiAttached(): void;
    getValue(): void;
    setValue(newValue: any): void;
    destroy(): void;
    isPopup(): boolean;
    isCancelBeforeStart(): void;
    isCancelAfterEnd(): void;
    focusIn(): void;
    focusOut(): void;
}
