import { __assign } from "tslib";
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
    var $w = $("<div class=\"load-view\"><div class=\"load-an-view\"><div class=\"fading-circle\">\n  <div class=\"sk-circle1 sk-circle\"></div>\n  <div class=\"sk-circle2 sk-circle\"></div>\n  <div class=\"sk-circle3 sk-circle\"></div>\n  <div class=\"sk-circle4 sk-circle\"></div>\n  <div class=\"sk-circle5 sk-circle\"></div>\n  <div class=\"sk-circle6 sk-circle\"></div>\n  <div class=\"sk-circle7 sk-circle\"></div> \n  <div class=\"sk-circle8 sk-circle\"></div>\n  <div class=\"sk-circle9 sk-circle\"></div>\n  <div class=\"sk-circle10 sk-circle\"></div>\n  <div class=\"sk-circle11 sk-circle\"></div>\n  <div class=\"sk-circle12 sk-circle\"></div>\n</div></div><div class=\"load-tip\">" + msg + "</div></div>");
    $body.append($w);
}
/**
 * 清空正在读取
 */
export function clearLoading() {
    var $body = $('body');
    $body.find('.load-view').remove();
}
/**
 * 中间灰底白字提示
 */
export function msg(message) {
    var $body = $('body');
    $body.find('[xtype=msg]').remove();
    var $w = $('<div xtype="msg" class="yvan-msg yvan-anim yvan-anim-00">' +
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
 * 右上角弹出错误消息
 * @param content 消息内容
 */
export function msgError(content) {
    webix.message({
        type: 'error',
        text: content,
        expire: -1
    });
}
export function prompt(title, defValue) {
    if (title === void 0) { title = '请输入'; }
    if (defValue === void 0) { defValue = ''; }
    return new Promise(function (resolve, reject) {
        ;
        layer.prompt(__assign({ formType: 0, value: defValue, isOutAnim: false, title: title, zIndex: layer.zIndex }, escKeyboardOption), function (value, index) {
            resolve(value);
            layer.close(index);
        });
    });
}
export function alert(content) {
    ;
    layer.alert(content, __assign({ isOutAnim: false, zIndex: layer.zIndex }, baseKeyboardOption));
}
export function error(content) {
    ;
    layer.alert(content, __assign({ icon: 2, isOutAnim: false, zIndex: layer.zIndex }, baseKeyboardOption));
}
export function confirm(content) {
    return new Promise(function (resolve, reject) {
        ;
        layer.confirm(content, __assign({ icon: 3, isOutAnim: false, zIndex: layer.zIndex }, escKeyboardOption), function (index) {
            layer.close(index);
            resolve();
        });
    });
}
/**
 * 右上角弹出成功消息
 * @param content 消息内容
 */
export function msgSuccess(content) {
    webix.message({
        type: 'success',
        text: content,
        expire: 2000
    });
}
/**
 * 右上角弹出通知消息
 * @param content 消息内容
 */
export function msgInfo(content) {
    // https://docs.webix.com/desktop__message_boxes.html
    webix.message({
        type: 'info',
        text: content,
        expire: 2000
    });
}
//# sourceMappingURL=YvanUIMessage.js.map