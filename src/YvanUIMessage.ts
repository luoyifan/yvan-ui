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
  $body.append(`<div class="load-view" style="z-index: 19850224;"><div class="load-an-view"><div class="fading-circle">
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

  $body.append($(`<div class="webix_modal load-view-masker" style="z-index: 19850223;"></div>`))
}

/**
 * 清空正在读取
 */
export function clearLoading() {
  const $body = $('body')
  $body.find('.load-view').remove()
  $body.find('.load-view-masker').remove();
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
 * 弹出输入框
 * @param title 输入框标题
 * @param defValue 默认值
 */
export function prompt(title: string = '请输入内容', defValue: string = ''): Promise<string> {
  const tid: any = webix.uid()
  let dialog: any = undefined;
  return new Promise<string>((resolve, reject) => {

    function onConfirm() {
      const value = (<any>webix.$$(tid.toString())).getValue()
      if (value) {
        resolve(value);
        dialog.close();
        return;
      }

      msg('请输入内容');
    }

    function onCancel() {
      reject();
      dialog.close();
    }

    const vjson = {
      view: 'window', close: false, move: true, modal: true, position: 'center', resize: true, fullscreen: false,
      head: title,
      on: {
        onShow() {
          // 进入后立刻获得焦点
          (<any>webix.$$(tid)).focus();
        }
      },
      body: {
        rows: [
          { view: 'text', id: tid, placeholder: '请输入', value: defValue },
          {
            cols: [
              {},
              {
                view: 'button',
                value: '确定',
                width: 100,
                css: 'yvan_primary',
                click: onConfirm,
              },
              {
                view: 'button',
                value: '取消',
                width: 100,
                css: 'default',
                click: () => {
                  onCancel()
                }
              }
            ]
          }
        ]
      }

    };
    dialog = webix.ui(vjson);
    dialog.show();
    $(webix.$$(tid).$view).keydown((e) => {
      // 必须借助 jquery 拦截 keydown 事件
      if (e.keyCode === 27) {
        onCancel();
        e.preventDefault();
        return;
      }
      if (e.keyCode === 13) {
        onConfirm();
        e.preventDefault();
        return;
      }
    })

  });
}

/**
 * 弹出提示框
 * @param content 提示框内容
 */
export function alert(content: string): void {
  webix.alert({ title: "提示", text: content, });
}

/**
 * 弹出错误框
 * @param content 错误的提示内容
 */
export function error(content: string): void {
  webix.modalbox({ title: "错误", text: content, buttons: ["确认"], type: "confirm-error" });
}

/**
 * 弹出确认框
 * @param content 需要确认的文字内容
 */
export function confirm(content: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    webix.confirm({
      title: "提示",
      text: content,
      ok: "确认", cancel: "取消",

    }).then(() => {
      resolve();

    }).catch(() => {
      reject();
    });
  })
}

/**
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export function msgError(content: string): void {
  const toastr = _.get(window, 'toastr')
  if (!toastr) {
    webix.message({ type: 'error', text: content, expire: -1 })
  } else {
    toastr.error(content, '错误')
  }
}

/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export function msgSuccess(content: string): void {
  const toastr = _.get(window, 'toastr')
  if (!toastr) {
    webix.message({ type: 'success', text: content, expire: 2000 })
  } else {
    toastr.success(content, '成功')
  }
}

/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export function msgInfo(content: string): void {
  const toastr = _.get(window, 'toastr')
  if (!toastr) {
    webix.message({ type: 'info', text: content, expire: 2000 })
  } else {
    toastr.info(content)
  }
  // https://docs.webix.com/desktop__message_boxes.html
}
