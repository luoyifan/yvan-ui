function userComponentFactory(Component: any, name: string) {

}

/**
 * 自定义组件
 */
export function UserComponent(name: string): Function {
    return function (Component: any) {
        return userComponentFactory(Component, name);
    };
}

// 自定义组件
export abstract class UserComponentBase<T> {

    /**
     * 执行渲染
     */
    abstract render(parentElement: Element): void;

}
