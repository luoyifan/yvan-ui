/**
 * 自定义组件
 */
export declare function UserComponent(name: string): Function;
export declare abstract class UserComponentBase<T> {
    /**
     * 执行渲染
     */
    abstract render(parentElement: Element): void;
}
