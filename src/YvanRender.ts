/* eslint-disable */
import Vue from 'vue'
import { BaseModule, BizWatch, VJson } from './YvanUIModule'
import { CtlTree } from './CtlTree'
import { CtlTreeTable } from './CtlTreeTable'
import { CtlTab } from './CtlTab'
import { CtlDataview } from './CtlDataview'
import { CtlDatatable } from './CtlDatatable'
// import { CtlECharts } from './CtlECharts'
import { CtlButton } from './CtlButton'
import { CtlText } from './form/input/CtlText'
import { CtlCheckBox } from './form/other/CtlCheckBox'
import { CtlCombo } from './form/select/CtlCombo'
import { CtlDatePicker } from './form/input/CtlDatePicker'
import { CtlDateRangePicker } from './form/input/CtlDateRangePicker'
import { CtlForm } from './form/CtlForm'
import { CtlMultiCombo } from './form/select/CtlMultiCombo'
import { CtlSearch } from './form/input/CtlSearch'
import { CtlTextarea } from './form/input/CtlTextarea'
import { CtlCarousel } from './CtlCarousel'
import { CtlGrid } from './CtlGrid'
import { CtlSwitch } from './form/other/CtlSwitch'
import { CtlNumber } from './form/input/CtlNumber'
import { CtlRadio } from './form/other/CtlRadio'
import { CtlCodeMirror } from './CtlCodeMirror'
import { CtlSidebar } from './CtlSidebar'
import { CtlXterm } from './CtlXterm'
import { CtlConsoleLog } from './CtlConsoleLog'
import webix from 'webix'

// export const webix = require("../webix/webix");
webix.i18n.setLocale('zh-CN')
_.set(window, 'webix', webix);

/**
 * 深度遍历 vjson
 * @param vjson 视图JSON
 * @param resolver 分析函数
 * @return 记录 resolver 方法返回 true 时，对象的访问路径
 */
export function deepTravVJson(vjson: VJson, resolver: (child: VJson) => any): Array<PathMarker> {
  const markerList: Array<PathMarker> = []
  deepTrav1(vjson, resolver, markerList)
  return markerList
}

/**
 * 深度遍历 vjson 后，所有 mark 对象及访问方法
 */
export interface PathMarker {
  id: number
  keyName: string
  object: any
}

function deepTrav1(obj: VJson, resolver: (child: VJson) => any, marker?: Array<PathMarker>) {
  let isMarker = resolver(obj)
  if (marker && isMarker === true) {
    marker.unshift({ id: 0, keyName: '', object: obj })
  }

  _.forOwn(obj, (value, key) => {
    if (typeof value !== 'object') {
      return
    }
    if (_.has(obj, 'view') && obj.view === 'toolbar') {
      if (key === 'dataSource' || key === 'suggest' || key === 'options') {
        return
      }
    } else {
      // 模型、数据、数据源不扫描
      if (
        key === 'data' ||
        key === 'dataSource' ||
        key === 'suggest' ||
        key === 'options'
      ) {
        return
      }
    }

    //事件不扫描
    if (key === 'on' && _.isObject(value)) {
      return
    }
    if (_.startsWith(key, 'on') && _.size(key) > 2) {
      return
    }
    const isMarkerChild = deepTrav1(value, resolver, marker)
    if (marker && isMarkerChild === true) {
      isMarker = true
      marker.unshift({ id: obj.id, keyName: key, object: value })
    }
  })

  // 删除作废对象
  _.remove(obj, (v: any) => v && v.isFiltered);

  return isMarker
}

/**
 * 根据 vjson 中的 ctlName, 合并属性
 * @param vjson 原始 vjson 视图
 * @param ctlOption 要被扩展的 ctlName 属性对
 */
export function viewExtend(vjson: VJson, ctlOption: any): VJson {
  // 收集所有 ctlName 属性，放到收集器的 collector.ctls
  // 收集所有 entityName 属性，放到收集器的 collector.entity
  const collector = {
    ctls: {}
  }

  deepTravVJson(vjson, obj => {
    if (obj.ctlName) {
      _.set(collector.ctls, obj.ctlName, obj)
    }
  })

  _.forOwn(ctlOption, (extendVJson, ctlName) => {
    if (_.has(collector.ctls, ctlName)) {
      _.merge(_.get(collector.ctls, ctlName), extendVJson)
    }
  })

  return vjson
}

const $internalHooks = ['data', 'destory', 'watches', 'computed']

/**
 * 收集成员变量
 */
function collectDataFromConstructor(vm: Vue, Component: any) {
  // override _init to prevent to init as Vue instance
  const originalInit = Component.prototype._init
  Component.prototype._init = function (this: Vue) {
    // proxy to actual vm
    const keys = Object.getOwnPropertyNames(vm)
    // 2.2.0 compat (props are no longer exposed as self properties)
    if (vm.$options.props) {
      for (const key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key)
        }
      }
    }
    keys.forEach(key => {
      if (key.charAt(0) !== '_') {
        Object.defineProperty(this, key, {
          get: () => _.get(vm, key),
          set: value => {
            _.set(vm, key, value)
          },
          configurable: true
        })
      }
    })
  }

  // should be acquired class property values
  const data = new Component()

  // restore original _init to avoid memory leak (#209)
  Component.prototype._init = originalInit

  // create plain data object
  const plainData = {}
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      _.set(plainData, key, data[key])
    }
  })

  return plainData
}

/**
 * 收集成员方法
 */
function collectMethods(proto: any, options: any) {
  Object.getOwnPropertyNames(proto).forEach(key => {
    // 如果是constructor，则不处理。
    if (key === 'constructor') {
      return
    }

    // 记录下每级的 viewExtend 方法
    if (key === 'viewExtend') {
      // options.viewExtends.push(proto[key]);
      console.error(
        '不支持使用 viewExtend, 请考虑使用 YvanUI.viewExtend(super.viewResolver(),{})'
      )
      return
    }

    // 记录下每级的 viewIntercept 方法
    if (key === 'viewIntercept') {
      // options.viewIntercepts.push(proto[key]);
      console.error('不支持使用 viewIntercept, 请考虑使用 super.viewResolver()')
      return
    }

    // 记录下每级的 onLoad 方法
    if (key === 'onLoad') {
      options.onLoads.push(proto[key])
      return
    }

    // 记录下每级的 onShow 方法
    if (key === 'onShow') {
      options.onShows.push(proto[key])
    }

    // 如果原型属性(方法)名是vue生命周期钩子名，则直接作为钩子函数挂载在options最外层
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key]
      return
    }

    // 先获取到原型属性的descriptor。
    // 在前文已提及，计算属性其实也是挂载在原型上的，所以需要对descriptor进行判断
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)!
    if (descriptor.value !== void 0) {
      // 如果属性值是一个function，则认为这是一个方法，挂载在methods下
      if (typeof descriptor.value === 'function') {
        if (!_.has(options.methods, key)) {
          options.methods[key] = descriptor.value
        }
      } else {
        // 如果不是，则认为是一个普通的data属性。
        // 但是这是原型上，所以更类似mixins，因此挂在mixins下。
        options.mixins.push({
          data(this: Vue) {
            return { [key]: descriptor.value }
          }
        })
      }
    } else if (descriptor.get || descriptor.set) {
      // 如果value是undefined(ps：void 0 === undefined)。
      // 且描述符具有get或者set方法，则认为是计算属性。不理解的参考我上面关于class转换成构造函数的例子
      // 这里可能和普通的计算属性不太一样，因为一般计算属性只是用来获取值的，但这里却有setter。
      // 不过如果不使用setter，与非class方式开发无异，但有这一步处理，在某些场景会有特效。
      ; (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      }
    }
  })
}

/**
 * 基础混入器
 */
function createCommonMix<M, Refs, INP>() {
  return {}
}

/**
 * 判断组件是否被删除后，是否需要预占宽度
 */
function cmpNeedOccupied(code: any) {
  switch (code.view) {
    case 'text':
    case 'combo':
    case 'date':
    case 'datetime':
    case 'datepicker':
    // case 'button': // button 按钮直接删除即可，不需要预占宽度
    case 'checkbox':
    case 'label':
      return true;
  }

  // 高度和宽度可变的组件，不需要预占任何宽度
  return false;
}

/**
 * 根据 vjson 格式，嵌入 yvan 组件, 生成能够为 webix 使用的 vjson
 */
export function wrapperWebixConfig<M, Refs, INP>(module: BaseModule<M, Refs, INP>, vjson: VJson) {
  // 形成最终的 viewResolver 方法
  deepTravVJson(vjson, obj => {

    // 检查组件是否被过滤(不渲染)
    let isFiltered = false;
    const componentRenderFilter: Function = _.get(window, 'YvanUI.componentRenderFilter');
    if (componentRenderFilter && componentRenderFilter(obj) === false) {
      isFiltered = true;
    }

    if (isFiltered) {
      // 组件不需要渲染
      if (_.has(obj, 'hiddenPlaceholder')) {
        // 如果有 hiddenPlaceholder 属性，最优先使用 hiddenPlaceholder, 替换现有的 vjson
        const ph = obj.hiddenPlaceholder;
        _.forOwn(obj, (v, k) => delete obj[k]);
        _.assign(obj, ph);

      } else if (cmpNeedOccupied(obj)) {
        // 需要预占宽度的组件，变成 template
        _.forOwn(obj, (v, k) => {
          if (k !== 'height' && k !== 'width') {
            delete obj[k]
          }
        });
        obj.view = "template";
        obj.borderless = true;
        obj.template = "";

      } else {
        // 其他情况，直接告知外循环，删除本对象
        obj.isFiltered = true;
      }
      return;
    }

    if (obj.view === 'iframe') {
      return
    }

    // if (module && _.has(obj, 'id')) {
    //   if (obj.id !== 'MainWindowFirstPage') {
    //     console.error('禁用 ID 属性', obj)
    //   }
    // }

    if (typeof obj.placeId === 'string') {
      obj.id = module.instanceId + '$' + obj.placeId
    }

    if (typeof obj.view === 'string') {
      switch (obj.view) {
        case 'button':
          CtlButton.create(module, obj);
          break

        case 'text':
          CtlText.create(module, obj);
          break

        case 'number':
        case 'counter':
          CtlNumber.create(module, obj);
          break

        case 'datepicker':
        case 'date':
        case 'datetime':
          CtlDatePicker.create(module, obj);
          break

        case 'codemirror-editor':
          CtlCodeMirror.create(module, obj);
          break

        case 'dataview':
          CtlDataview.create(module, obj);
          break

        case 'datatable':
          CtlDatatable.create(module, obj);
          break

        case 'xterm':
          CtlXterm.create(module, obj);
          break

        case 'xconsolelog':
          CtlConsoleLog.create(module, obj);
          break

        // case 'echarts':
        //   CtlECharts.create(module, obj);
        //   break

        case 'sidebar':
          CtlSidebar.create(module, obj);
          break

        case 'daterangepicker':
        case 'daterange':
        case 'datetimerange':
          CtlDateRangePicker.create(module, obj);
          break

        case 'combo':
        case 'combobox':
          CtlCombo.create(module, obj);
          break

        case 'multicombo':
          CtlMultiCombo.create(module, obj);
          break

        case 'search':
        case 'searchbox':
          CtlSearch.create(module, obj);
          break

        case 'textarea':
          CtlTextarea.create(module, obj);
          break
          
        case 'check':
        case 'checkbox':
          CtlCheckBox.create(module, obj);
          break

        case 'switch':
        case 'switchbox':
          CtlSwitch.create(module, obj);
          break

        case 'radio':
        case 'radiobox':
          CtlRadio.create(module, obj);
          break

        case 'tree':
          CtlTree.create(module, obj);
          break

        case 'treetable':
          CtlTreeTable.create(module, obj);
          break

        case 'tabview':
          CtlTab.create(module, obj);
          break

        case 'grid':
          CtlGrid.create(module, obj);
          break

        case 'form':
          CtlForm.create(module, obj);
          break

        case 'carousel':
          CtlCarousel.create(module, obj);
          break
      }
    }
  })

  if (module) {
    vjson.$scope = module
  }
}

/**
 * 将传统 ts Class 转换为 vue 对象.
 * 普通模块对象和 dialog 对象都要经过转换
 */
export function componentFactory<M, Refs, INP>(Component: BaseModule<M, Refs, INP> & any, options: any = {}): any {
  //return VueComponent<BaseModule<M, Refs, INP>>(options)
  if (!options.mixins) {
    options.mixins = []
  }

  if (!options.methods) {
    options.methods = {}
  }

  if (!options.viewExtends) {
    options.viewExtends = []
  }

  if (!options.viewIntercepts) {
    options.viewIntercepts = []
  }

  if (!options.onLoads) {
    options.onLoads = []
  }

  if (!options.onShows) {
    options.onShows = []
  }

  // 获取构造函数原型，这个原型上挂在了该类的method
  for (
    let proto = Component.prototype;
    proto.constructor !== Vue;
    proto = Object.getPrototypeOf(proto)
  ) {
    // 一直向上收集, 直到 Object 级
    collectMethods(proto, options)
  }

  // 添加公共基础 MIX
  options.mixins.push(createCommonMix<M, Refs, INP>())

  // 解析 @Watch 装饰器方法，执行 watch
  const watches = Component.prototype.watches
  delete Component.prototype.watches

  // 实例化Component构造函数，并收集其自身的(非原型上的)属性导出
  options.mixins.push({
    data(this: Vue) {
      const data: any = {
        refs: {},
        dialog: undefined,
        inParamter: undefined,
        dialogParent: undefined,
        instanceId: _.uniqueId('_mins_id_'),
        loadFinished: false,
        ...collectDataFromConstructor(this, Component)
      }
      return data
    },
    created(this: Vue & any) {
      if (_.isArray(watches)) {
        _.each(watches, (item: BizWatch) => {
          this.$watch(item.expr, item.handler, {
            deep: item.deep,
            immediate: item.immediate
          })
          //console.log('$watch', item.expr, item.handler, { deep: item.deep, immediate: item.immediate })
        })
      }
    },
    destroyed() { },
    methods: {
      onLoad(this: Vue) {
        _.each(options.onLoads, load => {
          load.call(this)
        })
      },
      onShow(this: Vue) {
        _.each(options.onShows, load => {
          load.call(this)
        })
      },
      buildView<M, Refs, INP>(this: Vue & BaseModule<M, Refs, INP>) {
        // 获取到 viewResolver 方法，拿到最原始的 vjson
        const vjson: VJson = this.viewResolver()

        // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
        wrapperWebixConfig(this, vjson)
        return vjson
      },
      closeDialog(this: Vue & any) {
        this.dialog.close()
      },
      setInParamter(this: Vue & BaseModule<M, Refs, INP> & any, inParamter: INP) {
        this.inParamter = inParamter
      },
      showDialog(this: Vue & BaseModule<M, Refs, INP> & any, inParamter: INP, container: any, isFromSearchBox: boolean = false): void {
        // 显示对话框
        const module: any = this
        module.inParamter = inParamter
        module.dialogParent = container

        // 获取到 viewResolver 方法，拿到最原始的 vjson
        const vjson: any = module.viewResolver()
        if (!_.has(vjson, 'body')) {
          vjson.body = {
            template: 'dialog 没有 body'
          }
        } else {
          if (!_.has(vjson.body, 'padding')) {
            vjson.body.padding = 10
          }
        }
        // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
        wrapperWebixConfig(module, vjson.body)
        // 构建 window
        _.merge(vjson, {
          view: 'window',
          close: vjson.close === undefined ? true : vjson.close,
          move: vjson.move === undefined ? true : vjson.move,
          modal: vjson.modal === undefined ? true : vjson.modal,
          left: vjson.left,
          top: vjson.top,
          position: vjson.position ? vjson.position : 'center',
          resize: vjson.resize === undefined ? true : vjson.resize,
          head: {
            view: "toolbar", margin: -4, cols: [
              {
                view: "label", label: vjson.title, css: 'webix_header webix_win_title',
                on: {
                  onAfterRender() {
                    module._titleLabel = this;
                  }
                }
              },
              {
                view: "icon", icon: "fa fa-window-maximize", click: function (this: any) {
                  dialog.config.fullscreen = !dialog.config.fullscreen;
                  if (dialog.config.fullscreen) {
                    dialog.config.oldtop = dialog.config.top;
                    dialog.config.oldleft = dialog.config.left;
                    dialog.config.left = 0;
                    dialog.config.top = 0;
                    this.define({ icon: 'fa fa-window-restore' });
                  } else {
                    dialog.config.top = dialog.config.oldtop;
                    dialog.config.left = dialog.config.oldleft;
                    this.define({ icon: 'fa fa-window-maximize' });
                  }
                  dialog.resize();
                  this.refresh();
                }
              },
              {
                view: "icon", icon: "fa fa-times", title: '关闭', tooltip: '关闭', click: function () {
                  dialog.close();
                }
              }
            ]
          },
          on: {
            onShow() {
              module.onLoad()
              module.loadFinished = true
            },
            onDestruct() {
              module.onClose()
            }
          },
        })
        const dialog: any = webix.ui(vjson)
        module._webixId = this.dialog = dialog
        this.dialog.show();

        $(this.dialog.$view).keypress((event) => {
          if (event.keyCode === 27) {
            module.onEsc()
            event.stopPropagation()
            event.preventDefault()
            return;
          }
          if (event.keyCode === 13) {
            module.onEnter()
            if (isFromSearchBox) {
              event.stopPropagation()
            }
            event.preventDefault()
            return;
          }
        })
      }
    }
  })

  // 通过 vue.extend 生成一个 vue 类型的功能模块对象
  const VueModule: any = Vue.extend(options)
  return VueModule
}

/**
 * 在目标 DOM 选择器上渲染模块
 */
export function render<M, Refs, INP>(selector: string, baseModule: BaseModule<M, Refs, INP>) {
  const lastHandle = _.get(window, 'LastRenderHandler')
  if (lastHandle) {
    lastHandle.destructor()
    _.set(window, 'LastRenderHandler', null)
  }

  const cfg = (baseModule as any).buildView()
  cfg.container = selector
  baseModule._webixId = webix.ui(cfg)
  baseModule.onLoad()

  webix.event(<any>window, 'resize', () => {
    // $$(baseModule._webixId).resize();
    baseModule._webixId.resize()
  })

  _.set(window, 'LastRenderHandler', baseModule._webixId)
  return baseModule._webixId
}

/**
 * 在占位空间 spaceId 上渲染 vjson
 * @param module 当前模块
 * @param spaceId 占位空间
 * @param vjson 界面描述
 */
export function renderPlace<M, Refs, INP>(
  module: BaseModule<M, Refs, INP>,
  spaceId: string,
  vjson: VJson
) {
  wrapperWebixConfig(module, vjson)
  webix.ui(vjson, webix.$$(module.instanceId + '$' + spaceId))
}
