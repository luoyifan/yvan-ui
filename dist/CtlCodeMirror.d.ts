import { CtlBase } from './CtlBase';
export declare class CtlCodeMirror extends CtlBase<CtlCodeMirror> {
    static create(module: any, vjson: any): CtlCodeMirror;
    /**
     * 撤销
     */
    undo(): void;
    /**
     * 重做
     */
    redo(): void;
    /**
     * 添加内容
     */
    append(msg: string): void;
    /**
     * 移动光标到文档开始处
     */
    goDocStart(): void;
    /**
     * 移动光标到文档结束处
     */
    goDocEnd(): void;
    /**
     * 移动光标到行开始处
     */
    goLineStart(): void;
    /**
     * 移动光标到行结束处
     */
    goLineEnd(): void;
    /**
     * 移动光标到上一行
     */
    goLineUp(): void;
    /**
     * 移动光标到下一行
     */
    goLineDown(): void;
    /**
     * 获取对应行的内容
     */
    getLine(n: number): string;
    /**
     * 设置scroll到position位置
     */
    scrollTo(x: any, y: any): void;
    clear(): void;
    /**
     * 执行命令
     */
    execCommand(cmd: any): any;
    /**
     * 刷新编辑器
     */
    refresh(): void;
    /**
     * 设置值
     */
    set value(nv: any);
    /**
     * 获取值
     */
    get value(): any;
}
