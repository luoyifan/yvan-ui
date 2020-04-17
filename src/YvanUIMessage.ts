// eslint-disable-next-line
const baseKeyboardOption: any = {
  success(layero: any, layerIndex: any) {
    layer.setTop(layero)
    layero
      .find('a.layui-layer-btn0')
      .attr('tabindex', 1)
      .focus()
    layero.on('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === 13 || event.keyCode === 27) {
        layer.close(layerIndex)
        event.stopPropagation()
        event.preventDefault()
      }
    })
  }
}

const escKeyboardOption: any = {
  success(layero: any, layerIndex: any) {
    layer.setTop(layero)
    const $input = layero.find('input.layui-layer-input')

    // 确定按钮获得焦点
    const $btn0 = layero.find('a.layui-layer-btn0').attr('tabindex', 1)
    // 取消按钮能获得焦点
    const $btn1 = layero.find('a.layui-layer-btn1').attr('tabindex', 1)

    if ($input.length <= 0) {
      // 如果没有输入框存在，默认让"确认按钮"获得焦点
      $btn0.focus()
    }

    layero.on('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === 13) {
        layero.find('a.layui-layer-btn0').trigger('click')
        event.stopPropagation()
        event.preventDefault()
      } else if (event.keyCode === 27) {
        // 取消
        layero.find('a.layui-layer-btn1').trigger('click')
        event.stopPropagation()
        event.preventDefault()
      }
    })
  }
}

/**
 * 中间灰底白字提示
 */
export function msg(message: string): void {
  const $body = $('body')

  $body.find('[xtype=msg]').remove()
  const $w = $(
    '<div xtype="msg" class="yvan-msg yvan-anim yvan-anim-00">' +
      '  <div class="yvan-msg-content">' +
      message +
      '</div></div>'
  )
  $body.append($w)

  const iframeWidth = $w.parent().width() as number
  const iframeHeight = $w.parent().height() as number

  const windowWidth = $w.width() as number
  const windowHeight = $w.height() as number

  let setWidth = (iframeWidth - windowWidth) / 2
  let setHeight = (iframeHeight - windowHeight) / 2
  if (iframeHeight < windowHeight || setHeight < 0) {
    setHeight = 0
  }
  if (iframeWidth < windowWidth || setWidth < 0) {
    setWidth = 0
  }
  $w.css({ left: setWidth, top: setHeight })
  setTimeout(() => {
    $w.remove()
  }, 3000)
}

/**
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export function msgError(content: string): void {
  webix.message({
    type: 'error',
    text: content,
    expire: -1
  })
}

export function prompt(
  title: string = '请输入',
  defValue: string = ''
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    ;(layer.prompt as any)(
      {
        formType: 0,
        value: defValue,
        isOutAnim: false,
        title: title,
        zIndex: layer.zIndex,
        ...escKeyboardOption
      },
      (value: any, index: any) => {
        resolve(value)
        layer.close(index)
      }
    )
  })
}

export function alert(content: string): void {
  ;(layer.alert as any)(content, {
    isOutAnim: false,
    zIndex: layer.zIndex,
    ...baseKeyboardOption
  })
}

export function error(content: string): void {
  ;(layer.alert as any)(content, {
    icon: 2,
    isOutAnim: false,
    zIndex: layer.zIndex,
    ...baseKeyboardOption
  })
}

export function confirm(content: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ;(layer.confirm as any)(
      content,
      {
        icon: 3,
        isOutAnim: false,
        zIndex: layer.zIndex,
        ...escKeyboardOption
      },
      (index: any) => {
        layer.close(index)
        resolve()
      }
    )
  })
}

/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export function msgSuccess(content: string): void {
  webix.message({
    type: 'success',
    text: content,
    expire: 2000
  })
}

/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export function msgInfo(content: string): void {
  // https://docs.webix.com/desktop__message_boxes.html
  webix.message({
    type: 'info',
    text: content,
    expire: 2000
  })
}
