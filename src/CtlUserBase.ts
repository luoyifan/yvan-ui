import * as YvanUI from './index'

// 自定义组件
@YvanUI.UserComponent('my_component')
export abstract class UserComponentBase<T> {
  /**
   * 执行渲染
   */
  abstract render(parentElement: Element): void
}
