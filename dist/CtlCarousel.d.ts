import { CtlBase } from './CtlBase';
import { YvEvent } from './YvanEvent';
export declare class CtlCarousel extends CtlBase<CtlCarousel> {
    onShow?: YvEvent<CtlCarousel, string>;
    static create(module: any, vjson: any): CtlCarousel;
}
