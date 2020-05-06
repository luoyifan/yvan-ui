export declare type VJson = any;
export declare type ViewExtendType<T> = {
    [P in keyof T]?: Partial<T[P]>;
};
