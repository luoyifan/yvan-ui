import { CtlInput } from '../input/CtlInput';
export declare class CtlRadio extends CtlInput<CtlRadio> {
    static create(module: any, vjson: any): CtlRadio;
    /**
     * 修改下拉选项
     */
    set options(nv: any[]);
}
