import CtlGridEditor from './CtlGridEditor';
export default class CtlGridEditorText extends CtlGridEditor {
    isPinned: any;
    $el: any;
    $input: any;
    value: any;
    editParams: any;
    leaveReason: any;
    type: any;
    init(params: any): void;
    _onCompositionstart(): void;
    _onCompositionend(e: any): void;
    _onKeyDown(e: any): void;
    _onInput(e: any): void;
    _dealWithString(e: any): void;
    _onChange(e: any): void;
    destroy(): void;
    getGui(): any;
    afterGuiAttached(): void;
    getValue(): any;
    focusIn(): void;
    focusOut(): void;
}
