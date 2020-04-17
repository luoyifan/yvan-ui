export type YvEvent<SENDER, T> =
  | EventBindFunction
  | EventBindCommon
  | EventBindSystem
  | EventBindDialog
  | EventFunction<SENDER, T>

export interface EventBindFunction {
  type: 'function'
  bind: string
}

export interface EventBindCommon {
  type: 'common'
  bind: string
}

export interface EventBindSystem {
  type: 'system'
  bind: string
}

export interface EventBindDialog {
  type: 'dialog'
  dialogId: string
}

export type EventFunction<SENDER, ARGS> = (sender: SENDER, args: ARGS) => void

export function YvEventDispatch<T, ARGS>(
  event: YvEvent<T, any> | undefined,
  sender: T,
  args: ARGS,
  scope?: any
) {
  if (!event) {
    // 事件没定义
    return
  }

  const ctl: any = sender
  const vue = _.isUndefined(scope) ? ctl._webix.$scope : scope

  if (typeof event === 'function') {
    // 事件本身就是方法
    return event.call(vue, sender, args)
  }

  if (event.type === 'function') {
    const targetFunc = _.get(vue, event.bind)
    if (typeof targetFunc !== 'function') {
      console.error(`模块没有 ${event.bind} 函数`)
      return
    }

    return targetFunc.apply(vue, [sender, args])
  }
}
