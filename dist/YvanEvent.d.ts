export declare type YvEvent<SENDER, T> = EventBindFunction | EventBindCommon | EventBindSystem | EventBindDialog | EventFunction<SENDER, T>;
export interface EventBindFunction {
    type: 'function';
    bind: string;
}
export interface EventBindCommon {
    type: 'common';
    bind: string;
}
export interface EventBindSystem {
    type: 'system';
    bind: string;
}
export interface EventBindDialog {
    type: 'dialog';
    dialogId: string;
}
export declare type EventFunction<SENDER, ARGS> = (sender: SENDER, args: ARGS) => void;
export declare function YvEventDispatch<T, ARGS>(event: YvEvent<T, any> | undefined, sender: T, args: ARGS, scope?: any): any;
