import CtlGridEditor from './CtlGridEditor';
export default class CtlGridEditorCombo extends CtlGridEditor {
    isPinned: any;
    options: any;
    $el: any;
    init(params: any): void;
    getGui(): any;
    afterGuiAttached(): void;
    getValue(): void;
    destroy(): void;
    focusIn(): void;
    focusOut(): void;
}
