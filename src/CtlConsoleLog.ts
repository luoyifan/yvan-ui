import { CtlBase } from './CtlBase'
import { CtlConsoleLogDefault } from './CtlDefaultValue'
import { parseYvanPropChangeVJson } from './CtlUtils'
import webix from 'webix'

webix.protoUI(
  {
    name: 'xconsolelog',
    defaults: {},
    $init: function (config: any) {
      this._domid = webix.uid();
      this.$view.innerHTML = `<div id='${this._domid}' class="vc-log"></div>`
      this.$ready.push(this._ready)
      _.extend(this.config, config)
      if (config.on && typeof config.on.onInited === 'function') {
        config.on.onInited.call(this)
      }
    },
    _ready: function (this: any) {

    },
    _set_inner_size: function () {
      if (!this._term || !this.$width) return

      this._updateScrollSize()
      // this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
    },
    _updateScrollSize: function () {
      var box = this._term.element;
      var height = (this.$height || 0) + 'px'

      box.style.height = height
      box.style.width = (this.$width || 0) + 'px'
    },
    $setSize: function (x: any, y: any) {
      if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
        this._set_inner_size()
      }
    }
  },
  webix.ui.view
)

export class CtlConsoleLog extends CtlBase<CtlConsoleLog> {
  static create(module: any, vjson: any): CtlConsoleLog {
    const that = new CtlConsoleLog(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlConsoleLogDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['value'])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
    _.assign(that, yvanProp)

    // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
    _.merge(vjson, that._webixConfig, {
      on: {
        onInited(this: any) {
          that.attachHandle(this, { ...vjson, ...yvanProp })
          _.defer(() => {
            $(this.$view).on('click', '.vc-fold', function (e) {
              that.vcfoldclick(this)
            })
          })
        },
        onAfterDelete() {
          that.removeHandle()
        }
      }
    })
    return that
  }
  /**
   * @param logs 需要打印的json
   */
  public printLog(logs: any): void {
    var logHtml = '<div class="vc-item">';
    if (!logs) {
      logHtml += '<div><i class="vc-code-string">undefined</i></div>';
    } else {
      logHtml += this.log2html(logs)
    }
    logHtml += "</div>"
    this.renderDom(logHtml);
  }

  public renderDom(domHtml: string) {
    // console.log(domHtml)
    // var originDom;
    // for (let index = 0; index < this._webix.$view.children.length; index++) {
    //   const element = this._webix.$view.children[index];
    //   if (element.classList.contains("vc-log")) {
    //     originDom = element;
    //   }
    // }
    // var originHtml = originDom.innerHTML;
    // var newHtml = originHtml + domHtml;
    // originDom.innerHTML = newHtml;
    // const that = this;
    this._realHtml.push(domHtml);
    this.realRender();
  }

  _realHtml = new Array<string>();

  public realRender = _.debounce(() => {
    $(this._webix.$view).find('.vc-log').append(this._realHtml.join(''));
    this._realHtml = []
  })

  /**
    * 递归生成html
    */
  public log2html(params: any): String {
    if (this.isArray(params) || this.isObject(params)) {
      return this.obj2html(params);
    } else if (this.isNumber(params) || this.isBoolean(params)) {
      return '<div><i class="vc-code-number">' + params + '</i></div>'
    } else {
      return '<div><i class="vc-code-string">"' + params.toString() + '"</i></div>'
    }
  }

  public obj2html(params: any, title?: any): String {
    var outer = '';
    var json = this.JSONStringify(params);
    var preview = json.substr(0, 36);
    outer = this.getObjName(params);
    if (json.length > 36) {
      preview += '...';
    }
    outer += ' ' + preview;
    var obj2htmlContent;
    if (title) {
      obj2htmlContent = '<div class="vc-fold">\
      <div><i class="vc-code-key">' +
        title + '</i>:' +
        '<i class="vc-fold-outer">' +
        outer +
        '</i></div>\
      </div> \
      <div class="vc-fold-content vc-hidden">';
    } else {
      obj2htmlContent = '<div class="vc-fold">\
      <i class="vc-fold-outer">' +
        outer +
        '</i> \
      </div> \
      <div class="vc-fold-content vc-hidden">';
    }
    if (this.isObject(params)) {
      var objKeys = this.getObjAllKeys(params);
      for (var i = 0; i < objKeys.length; i++) {
        var val = params[objKeys[i]];
        if (this.isObject(val) || this.isArray(val)) {
          obj2htmlContent += '<div>' + this.obj2html(val, objKeys[i]) + '</div>';
        } else if (this.isNumber(val) || this.isBoolean(val)) {
          obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-number">' + val + '</i></div>';
        } else {
          obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-string">"' + val + '"</i></div>';
        }
      }
    } else if (this.isArray(params)) {
      for (var i = 0; i < params.length; i++) {
        obj2htmlContent += '<div>' + this.obj2html(params[i]) + '</div>';
      }
    }
    obj2htmlContent += '</div>'
    return obj2htmlContent;
  }

  /**
   * div打开关闭
   */
  public vcfoldclick(params: any) {
    var vcFoldElements = params.parentElement.children;
    var vcFoldContent = vcFoldElements[vcFoldElements.length - 1];
    if (vcFoldContent.classList.contains("vc-hidden")) {
      vcFoldContent.classList.remove("vc-hidden");
    } else {
      vcFoldContent.classList.add("vc-hidden");
    }
  }

  /**
 * 搜索并打开div
 */
  public searchText(inputValue: string) {
    var items;
    for (let index = 0; index < this._webix.$view.children.length; index++) {
      const element = this._webix.$view.children[index];
      if (element.classList.contains("vc-log")) {
        items = element;
      }
    }
    this.removeSelected(items);
    if (!inputValue) {
      return;
    }
    this.itemContainsText(items, inputValue);
  }

  public itemContainsText(params: any, inputValue: any) {
    for (var i = 0; i < params.children.length; i++) {
      var item = params.children[i];
      if (item.innerHTML.indexOf(inputValue) !== -1) {
        if (item.classList.contains("vc-fold-content")) {
          item.classList.remove("vc-hidden");
        }
        if (item.classList.contains("vc-code-key") ||
          item.classList.contains("vc-code-string") ||
          item.classList.contains("vc-code-number") ||
          item.classList.contains("vc-code-boolean")) {
          item.classList.add("vc-code-string-selected");
        }
        this.itemContainsText(item, inputValue)
      }
    }
  }

  public removeSelected(params: any) {
    for (var i = 0; i < params.children.length; i++) {
      var item = params.children[i];
      item.classList.remove("vc-code-string-selected");
      this.removeSelected(item)
    }
  }

  /**
 * 全部清空
 */
  public vcClearAll() {
    var vcLog = $('#' + this._webix._domid)[0];
    vcLog.innerHTML = '';
  }

  /**
 * 全部收起
 */
  public vcCloseAll() {
    var vcLog = $('#' + this._webix._domid)[0];
    this.closeOrOpen(vcLog, false)
  }

  /**
   * 全部展开
   */
  public vcOpenAll() {
    var vcLog = $('#' + this._webix._domid)[0];
    this.closeOrOpen(vcLog, true)

    // var vvv = _.cloneDeepWith(vcLog, function customizer(value) {
    //   if (_.isElement(value)) {
    //     return value.cloneNode(true);
    //   }
    // });
    // this.closeOrOpen(vvv, true);

    // vcLog.innerHTML = vvv.innerHTML;
  }

  public closeOrOpen(items: any, isOpen: boolean) {
    for (var i = 0; i < items.children.length; i++) {
      var item = items.children[i];
      if (item.classList.contains("vc-fold-content")) {
        if (isOpen) {
          item.classList.remove("vc-hidden");
        } else {
          item.classList.add("vc-hidden");
        }
      }
      this.closeOrOpen(item, isOpen)
    }
  }

  /**
   * tools
   */
  public isNumber(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object Number]';
  }

  public isString(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object String]';
  }

  public isArray(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object Array]';
  }

  public isBoolean(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object Boolean]';
  }


  public isUndefined(value: any): boolean {
    return value === undefined;
  }

  public isNull(value: any): boolean {
    return value === null;
  }

  public isSymbol(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object Symbol]';
  }

  public isFunction(value: any): boolean {
    return Object.prototype.toString.call(value) == '[object Function]';
  }

  public isObject(value: any): boolean {
    return (
      Object.prototype.toString.call(value) == '[object Object]' ||
      // if it isn't a primitive value, then it is a common object
      (
        !this.isNumber(value) &&
        !this.isString(value) &&
        !this.isBoolean(value) &&
        !this.isArray(value) &&
        !this.isNull(value) &&
        !this.isFunction(value) &&
        !this.isUndefined(value) &&
        !this.isSymbol(value)
      )
    );
  }

  /**
 * Simple JSON stringify, stringify top level key-value
 */
  public JSONStringify(stringObject: any): any {
    if (!this.isObject(stringObject) && !this.isArray(stringObject)) {
      return JSON.stringify(stringObject);
    }

    let prefix = '{',
      suffix = '}';
    if (this.isArray(stringObject)) {
      prefix = '[';
      suffix = ']'
    }
    let str = prefix;
    const keys = this.getObjAllKeys(stringObject);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = stringObject[key];
      try {
        // key
        if (!this.isArray(stringObject)) {
          if (this.isObject(key) || this.isArray(key) || this.isSymbol(key)) {
            str += Object.prototype.toString.call(key);
          } else {
            str += key;
          }
          str += ': ';
        }

        // value
        if (this.isArray(value)) {
          str += 'Array[' + value.length + ']';
        } else if (this.isObject(value) || this.isSymbol(value) || this.isFunction(value)) {
          str += Object.prototype.toString.call(value);
        } else {
          str += JSON.stringify(value);
        }
        if (i < keys.length - 1) {
          str += ', ';
        }
      } catch (e) {
        continue;
      }
    }
    str += suffix;
    return str;
  }

  /**
 * get an object's all keys ignore whether they are not enumerable
 */
  public getObjAllKeys(obj: any): any {
    if (!this.isObject(obj) && !this.isArray(obj)) {
      return [];
    }
    if (this.isArray(obj)) {
      const m: any[] = [];
      obj.forEach((_: any, index: any) => {
        m.push(index)
      });
      return m;
    }
    return Object.getOwnPropertyNames(obj).sort();
  }

  /**
   * get an object's prototype name
   */
  public getObjName(obj: any): any {
    return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '');
  }
}
