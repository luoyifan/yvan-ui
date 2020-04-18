import webix, { $$ } from 'webix'
import { wrapperWebixConfig } from './YvanRender'
import { idText } from 'typescript'

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
 * 显示正在读取
 */
export function loading(msg?: string) {
  clearLoading()
  if (!msg) {
    msg = '请稍后'
  }
  const $body = $('body')
  const $w = $(`<div class="load-view"><div class="load-an-view"><div class="fading-circle">
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div> 
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
</div></div><div class="load-tip">${msg}</div></div>`)
  $body.append($w)
}

/**
 * 清空正在读取
 */
export function clearLoading() {
  const $body = $('body')
  $body.find('.load-view').remove()
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

export function prompt(
  title: string = '请输入',
  defValue: string = ''
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const tid = webix.uid()
    let dialog: any
    let vj = {
      view: 'window',
      head: title,
      close: true,
      move: true,
      modal: true,
      position: 'center',
      resize: true,
      body: {
        rows: [
          { view: 'text', id: tid },
          {
            cols: [
              {},
              {},
              {
                view: 'button',
                value: '确定',
                width: 100,
                css: 'yvan_primary',
                click: () => {
                  const value = (<webix.ui.text>$$(tid.toString())).getValue()
                  if (value && value.length > 0) {
                    resolve(value)
                    dialog.close()
                  }
                }
              },
              {
                view: 'button',
                value: '取消',
                width: 100,
                css: 'default',
                click: () => {
                  dialog.close()
                }
              }
            ]
          }
        ]
      }
    }
    dialog = webix.ui(vj)
    dialog.show()
  })
}

export function alert(content: string): void {
  let dialog: any
  let vj = {
    view: 'window',
    head: '信息',
    close: true,
    move: true,
    modal: true,
    position: 'center',
    resize: true,
    body: {
      rows: [
        { view: 'template', template: content },
        {
          cols: [
            {},
            {
              view: 'button',
              value: '确定',
              width: 100,
              css: 'yvan_primary',
              click: () => {
                dialog.close()
              }
            }
          ]
        }
      ]
    }
  }
  dialog = webix.ui(vj)
  dialog.show()
}

export function error(content: string): void {
  const c = `<div id="" class="layui-layer-content layui-layer-padding"><i class="layui-layer-ico layui-layer-ico2"></i>${content}</div>`
  let dialog: any
  let vj = {
    view: 'window',
    head: '信息',
    close: true,
    move: true,
    modal: true,
    position: 'center',
    resize: true,
    body: {
      rows: [
        { view: 'template', template: c },
        {
          cols: [
            {},
            {
              view: 'button',
              value: '确定',
              width: 100,
              css: 'yvan_primary',
              click: () => {
                dialog.close()
              }
            }
          ]
        }
      ]
    }
  }
  dialog = webix.ui(vj)
  dialog.show()
}

export function confirm(content: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const c = `<div id="" class="layui-layer-content layui-layer-padding"><i class="layui-layer-ico layui-layer-ico3"></i>${content}</div>`
    let dialog: any
    let vj = {
      view: 'window',
      head: '信息',
      close: true,
      move: true,
      modal: true,
      position: 'center',
      resize: true,
      body: {
        rows: [
          { view: 'template', template: c },
          {
            cols: [
              {},
              {
                view: 'button',
                value: '确定',
                width: 100,
                css: 'yvan_primary',
                click: () => {
                  resolve()
                  dialog.close()
                }
              },
              {
                view: 'button',
                value: '取消',
                width: 100,
                css: 'default',
                click: () => {
                  reject()
                  dialog.close()
                }
              }
            ]
          }
        ]
      }
    }
    dialog = webix.ui(vj)
    dialog.show()
  })
}

/**
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export function msgError(content: string): void {
  const toastr = _.get(window, 'toastr')
  toastr.error(content, '错误')
  // webix.message({
  //   type: 'error',
  //   text: content,
  //   expire: -1
  // })
}

/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export function msgSuccess(content: string): void {
  const toastr = _.get(window, 'toastr')
  toastr.success(content, '成功')
  // webix.message({
  //   type: 'success',
  //   text: content,
  //   expire: 2000
  // })
}

/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export function msgInfo(content: string): void {
  const toastr = _.get(window, 'toastr')
  toastr.info(content)
  // https://docs.webix.com/desktop__message_boxes.html
  // webix.message({
  //   type: 'info',
  //   text: content,
  //   expire: 2000
  // })
}
