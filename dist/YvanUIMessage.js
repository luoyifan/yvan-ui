import webix from 'webix';
// eslint-disable-next-line
var baseKeyboardOption = {
    success: function (layero, layerIndex) {
        layer.setTop(layero);
        layero
            .find('a.layui-layer-btn0')
            .attr('tabindex', 1)
            .focus();
        layero.on('keydown', function (event) {
            if (event.keyCode === 13 || event.keyCode === 27) {
                layer.close(layerIndex);
                event.stopPropagation();
                event.preventDefault();
            }
        });
    }
};
var escKeyboardOption = {
    success: function (layero, layerIndex) {
        layer.setTop(layero);
        var $input = layero.find('input.layui-layer-input');
        // 确定按钮获得焦点
        var $btn0 = layero.find('a.layui-layer-btn0').attr('tabindex', 1);
        // 取消按钮能获得焦点
        var $btn1 = layero.find('a.layui-layer-btn1').attr('tabindex', 1);
        if ($input.length <= 0) {
            // 如果没有输入框存在，默认让"确认按钮"获得焦点
            $btn0.focus();
        }
        layero.on('keydown', function (event) {
            if (event.keyCode === 13) {
                layero.find('a.layui-layer-btn0').trigger('click');
                event.stopPropagation();
                event.preventDefault();
            }
            else if (event.keyCode === 27) {
                // 取消
                layero.find('a.layui-layer-btn1').trigger('click');
                event.stopPropagation();
                event.preventDefault();
            }
        });
    }
};
/**
 * 显示正在读取
 */
export function loading(msg) {
    clearLoading();
    if (!msg) {
        msg = '请稍后';
    }
    var $body = $('body');
    $body.append("<div class=\"load-view\" style=\"z-index: 119850224;\"><div class=\"load-an-view\"><div class=\"fading-circle\">\n  <div class=\"sk-circle1 sk-circle\"></div>\n  <div class=\"sk-circle2 sk-circle\"></div>\n  <div class=\"sk-circle3 sk-circle\"></div>\n  <div class=\"sk-circle4 sk-circle\"></div>\n  <div class=\"sk-circle5 sk-circle\"></div>\n  <div class=\"sk-circle6 sk-circle\"></div>\n  <div class=\"sk-circle7 sk-circle\"></div> \n  <div class=\"sk-circle8 sk-circle\"></div>\n  <div class=\"sk-circle9 sk-circle\"></div>\n  <div class=\"sk-circle10 sk-circle\"></div>\n  <div class=\"sk-circle11 sk-circle\"></div>\n  <div class=\"sk-circle12 sk-circle\"></div>\n</div></div><div class=\"load-tip\">" + msg + "</div></div>");
    $body.append($("<div class=\"webix_modal load-view-masker\" style=\"z-index: 19850223;\"></div>"));
}
/**
 * 清空正在读取
 */
export function clearLoading() {
    var $body = $('body');
    $body.find('.load-view').remove();
    $body.find('.load-view-masker').remove();
}
/**
 * 中间灰底白字提示
 */
export function msg(message) {
    var $body = $('body');
    $body.find('[xtype=msg]').remove();
    var $w = $('<div xtype="tooltip" class="yvan-msg yvan-anim yvan-anim-00">' +
        '  <div class="yvan-msg-content">' +
        message +
        '</div></div>');
    $body.append($w);
    var iframeWidth = $w.parent().width();
    var iframeHeight = $w.parent().height();
    var windowWidth = $w.width();
    var windowHeight = $w.height();
    var setWidth = (iframeWidth - windowWidth) / 2;
    var setHeight = (iframeHeight - windowHeight) / 2;
    if (iframeHeight < windowHeight || setHeight < 0) {
        setHeight = 0;
    }
    if (iframeWidth < windowWidth || setWidth < 0) {
        setWidth = 0;
    }
    $w.css({ left: setWidth, top: setHeight });
    setTimeout(function () {
        $w.remove();
    }, 3000);
}
/**
 * 显示tooltip
 */
export function showTooltip(obj, message) {
    var _a;
    var $body = $('body');
    var tooptipId = obj.id + '_tooltip';
    if ($body.find("#" + tooptipId).length > 0) {
        var ddiv = $body.find("#" + tooptipId)[0].children[1];
        _.set(ddiv, 'innerText', message);
        return;
    }
    var $w = $('<div xtype="tooltip" class="yvan-tooltip">' +
        '<em></em><div class="yvan-tooltip-msg">' +
        message +
        '</div></div>');
    $w[0].id = tooptipId;
    $body.append($w);
    var xxoffset = $(obj._webix.$view).offset();
    var xxLeft = $(obj._webix.$view).width() + xxoffset.left + 10;
    $w.css({ left: xxLeft, top: (_a = xxoffset) === null || _a === void 0 ? void 0 : _a.top });
}
export function hideTooltip(obj) {
    var $body = $('body');
    var tooptipId = obj.id + '_tooltip';
    $body.find("#" + tooptipId).remove();
}
/**
 * 弹出输入框
 * @param title 输入框标题
 * @param defValue 默认值
 */
export function prompt(title, defValue) {
    if (title === void 0) { title = '请输入内容'; }
    if (defValue === void 0) { defValue = ''; }
    var tid = webix.uid();
    var dialog = undefined;
    return new Promise(function (resolve, reject) {
        function onConfirm() {
            var value = webix.$$(tid.toString()).getValue();
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
        var vjson = {
            view: 'window', close: false, move: true, modal: true, position: 'center', resize: true, fullscreen: false,
            head: title,
            on: {
                onShow: function () {
                    // 进入后立刻获得焦点
                    webix.$$(tid).focus();
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
                                click: function () {
                                    onCancel();
                                }
                            }
                        ]
                    }
                ]
            }
        };
        dialog = webix.ui(vjson);
        dialog.show();
        $(webix.$$(tid).$view).keydown(function (e) {
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
        });
    });
}
/**
 * 弹出提示框
 * @param content 提示框内容
 */
export function alert(content) {
    webix.alert({ title: "提示", text: content, });
}
/**
 * 弹出错误框
 * @param content 错误的提示内容
 */
export function error(content) {
    webix.modalbox({ title: "错误", text: content, buttons: ["确认"], type: "confirm-error" });
}
/**
 * 弹出确认框
 * @param content 需要确认的文字内容
 */
export function confirm(content) {
    return new Promise(function (resolve, reject) {
        webix.confirm({
            title: "提示",
            text: content,
            ok: "确认", cancel: "取消",
        }).then(function () {
            resolve();
        }).catch(function () {
            reject();
        });
    });
}
/**
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export function msgError(content) {
    var toastr = _.get(window, 'toastr');
    if (!toastr) {
        webix.message({ type: 'error', text: content, expire: -1 });
    }
    else {
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-left",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.error(content, '错误');
    }
}
/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export function msgSuccess(content) {
    var toastr = _.get(window, 'toastr');
    if (!toastr) {
        webix.message({ type: 'success', text: content, expire: 2000 });
    }
    else {
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-left",
            "hideDuration": "3000",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.success(content, '成功');
    }
}
/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export function msgInfo(content) {
    var toastr = _.get(window, 'toastr');
    if (!toastr) {
        webix.message({ type: 'info', text: content, expire: 2000 });
    }
    else {
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-left",
            "hideDuration": "3000",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.info(content);
    }
    // https://docs.webix.com/desktop__message_boxes.html
}
//# sourceMappingURL=YvanUIMessage.js.map