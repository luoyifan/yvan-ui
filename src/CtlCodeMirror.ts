import { CtlBase } from './CtlBase'
import { CtlCodeMirrorDefault } from './CtlDefaultValue'
import { parseYvanPropChangeVJson } from './CtlUtils'
import webix from 'webix'

webix.protoUI(
  {
    name: 'codemirror-editor',
    defaults: {},
    $init: function (config: any) {
      this.$view.innerHTML =
        "<textarea style='width:100%;height:100%;'></textarea>"
      this._waitEditor = webix.promise.defer()
      this.$ready.push(this._render_cm_editor)
      _.extend(this.config, config)
      if (config.on && typeof config.on.onInited === 'function') {
        config.on.onInited.call(this)
      }
    },
    _render_cm_editor: function () {
      this._render_when_ready()
      // if (this.config.cdn === false) {
      //     this._render_when_ready;
      //     return;
      // }
      //
      // var cdn = this.config.cdn || "//cdn.bootcss.com/codemirror/5.38.0/";
      // // basic
      // var sources = [
      //     cdn + "/codemirror.css",
      //     cdn + "/codemirror.js"
      // ];
      //
      // // mode
      // if (this.config.mode === "htmlmixed") {
      //     sources.push(cdn + "/mode/xml/xml.js");
      //     sources.push(cdn + "/mode/css/css.js");
      //     sources.push(cdn + "/mode/javascript/javascript.js");
      //
      // } else {
      //     var mode = this.config.mode ? this.config.mode : "javascript";
      //     sources.push(cdn + "/mode/" + mode + "/" + mode + ".js");
      // }
      //
      // // theme
      // if (this.config.theme && this.config.theme !== "default") {
      //     sources.push(cdn + "/theme/" + this.config.theme + ".css")
      // }
      //
      // // matchbrackets add-on
      // if (this.config.matchBrackets) {
      //     sources.push(cdn + "/addon/edit/matchbrackets.js")
      // }
      //
      // webix.require(sources)
      //     .then(webix.bind(this._render_when_ready, this))
      //     .catch((e: any) => {
      //         console.log(e);
      //     });
    },
    _render_when_ready: function (this: any) {
      const CodeMirror: any = _.get(window, 'CodeMirror')
      this._editor = CodeMirror.fromTextArea(this.$view.firstChild, {
        // mode: this.config.mode,
        // lineNumbers: this.config.lineNumbers,
        // matchBrackets: this.config.matchBrackets,
        // theme: this.config.theme
        ...this.config
      })

      this._waitEditor.resolve(this._editor)

      this.setValue(this.config.value)
      if (this._focus_await) {
        this.focus()
      }
    },
    _set_inner_size: function () {
      if (!this._editor || !this.$width) return

      this._updateScrollSize()
      this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
    },
    _updateScrollSize: function () {
      var box = this._editor.getWrapperElement()
      var height = (this.$height || 0) + 'px'

      box.style.height = height
      box.style.width = (this.$width || 0) + 'px'

      var scroll = this._editor.getScrollerElement()
      if (scroll.style.height !== height) {
        scroll.style.height = height
        this._editor.refresh()
      }
    },
    $setSize: function (x: any, y: any) {
      if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
        this._set_inner_size()
      }
    },
    setValue: function (value: any) {
      if (!value && value !== 0) {
        value = ''
      }

      this.config.value = value
      if (this._editor) {
        this._editor.setValue(value)
        //by default - clear editor's undo history when setting new value
        if (!this.config.preserveUndoHistory) {
          this._editor.clearHistory()
        }
        this._updateScrollSize()
      }
    },
    getValue: function () {
      return this._editor ? this._editor.getValue() : this.config.value
    },
    focus: function () {
      this._focus_await = true
      if (this._editor) {
        this._editor.focus()
      }
    },
    getEditor: function (waitEditor: any) {
      return waitEditor ? this._waitEditor : this._editor
    },
    // //undo, redo, etc
    // undo: function () {
    //     this._editor.undo();
    // },
    // redo: function () {
    //     this._editor.redo();
    // },
    undoLength: function () {
      return this._editor.historySize().undo
    }
  },
  webix.ui.view
)

export class CtlCodeMirror extends CtlBase<CtlCodeMirror> {
  static create(module: any, vjson: any): CtlCodeMirror {
    const that = new CtlCodeMirror(vjson)
    that._module = module

    _.defaultsDeep(vjson, CtlCodeMirrorDefault)

    const yvanProp = parseYvanPropChangeVJson(vjson, ['value'])

    // 将 vjson 存至 _webixConfig
    that._webixConfig = vjson

    // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
    _.assign(that, yvanProp)

    // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
    _.merge(vjson, that._webixConfig, {
      on: {
        onInited(this: any) {
          that.attachHandle(this)
        },
        onAfterDelete() {
          that.removeHandle()
        }
      }
    })

    return that
  }

  /**
   * 撤销
   */
  undo() {
    this._webix.getEditor().undo()
  }

  /**
   * 重做
   */
  redo() {
    this._webix.getEditor().redo()
  }

  /**
   * 设置值
   */
  set value(nv: any) {
    if (!this._webix) {
      this._webixConfig.value = nv
    } else {
      this._webix.setValue(nv)
    }
  }

  /**
   * 获取值
   */
  get value(): any {
    if (!this._webix) {
      return this._webixConfig.value
    }

    return this._webix.getValue()
  }
}
