(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('webix'), require('reflect-metadata'), require('lodash'), require('ag-grid'), require('qs'), require('axios'), require('typescript')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'webix', 'reflect-metadata', 'lodash', 'ag-grid', 'qs', 'axios', 'typescript'], factory) :
  (global = global || self, factory(global['yvan-ui'] = {}, global.Vue, global.webix, null, global._$1, global.agGrid, global.qs, global.axios, global.ts));
}(this, (function (exports, Vue, webix, reflectMetadata, _$1, agGrid, qs, axios, ts) { 'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  webix = webix && Object.prototype.hasOwnProperty.call(webix, 'default') ? webix['default'] : webix;
  agGrid = agGrid && Object.prototype.hasOwnProperty.call(agGrid, 'default') ? agGrid['default'] : agGrid;
  qs = qs && Object.prototype.hasOwnProperty.call(qs, 'default') ? qs['default'] : qs;
  axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;
  ts = ts && Object.prototype.hasOwnProperty.call(ts, 'default') ? ts['default'] : ts;

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  function YvEventDispatch(event, sender, args, scope) {
      if (!event) {
          // 事件没定义
          return;
      }
      var ctl = sender;
      var vue = _.isUndefined(scope) ? ctl._webix.$scope : scope;
      if (typeof event === 'function') {
          // 事件本身就是方法
          return event.call(vue, sender, args);
      }
      if (event.type === 'function') {
          var targetFunc = _.get(vue, event.bind);
          if (typeof targetFunc !== 'function') {
              console.error("\u6A21\u5757\u6CA1\u6709 " + event.bind + " \u51FD\u6570");
              return;
          }
          return targetFunc.apply(vue, [sender, args]);
      }
  }
  //# sourceMappingURL=YvanEvent.js.map

  var designMode = false;
  function initDesign() {
      designMode = true;
  }
  function isDesignMode() {
      return designMode;
  }
  //# sourceMappingURL=DesignHelper.js.map

  var CtlBase = /** @class */ (function () {
      function CtlBase(vjson) {
          /**
           * 定焦时间
           */
          this.ff = 0;
          this.vjson = _.cloneDeep(vjson);
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
      }
      /**
       * 强制组件获得焦点
       */
      CtlBase.prototype.focus = function () {
          if (!this._webix) {
              return;
          }
          this._webix.focus();
      };
      Object.defineProperty(CtlBase.prototype, "loading", {
          /**
           * 设置正在读取中的状态
           */
          set: function (nv) {
              if (nv) {
                  webix.extend(this._webix, webix.OverlayBox);
                  //this._webix.showOverlay("<div style='...'>There is no data</div>");
                  this._webix.showOverlay('Loading...');
              }
              else {
                  this._webix.hideOverlay();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取模块
       */
      CtlBase.prototype.getModule = function () {
          return this._module;
      };
      /**
       * 组件被渲染后触发
       */
      CtlBase.prototype.attachHandle = function (webixHandler, vjson) {
          this._webix = webixHandler;
          this._module = this._webix.$scope;
          YvEventDispatch(this.onRender, this, undefined);
          this.refreshState();
          if (_.has(vjson, 'entityName')) {
              _.set(this._module, '_entityCtlMapping.' + vjson['entityName'], this);
          }
      };
      CtlBase.prototype.getCtlElements = function (element) {
          var _this = this;
          var entityArray = [];
          if (_.isArray(element)) {
              element.forEach(function (item) {
                  entityArray = _.union(entityArray, _this.getCtlElements(item));
              });
          }
          else if (_.isObject(element)) {
              if (element.hasOwnProperty("view")) {
                  var items = _.get(element, "view");
                  entityArray = _.union(entityArray, [items]);
              }
              if (element.hasOwnProperty("rows")) {
                  var items = _.get(element, "rows");
                  items.forEach(function (item) {
                      entityArray = _.union(entityArray, _this.getCtlElements(item));
                  });
              }
              else if (element.hasOwnProperty("cols")) {
                  var items = _.get(element, "cols");
                  items.forEach(function (item) {
                      entityArray = _.union(entityArray, _this.getCtlElements(item));
                  });
              }
              else if (element.hasOwnProperty("elements")) {
                  var items = _.get(element, "elements");
                  items.forEach(function (item) {
                      entityArray = _.union(entityArray, _this.getCtlElements(item));
                  });
              }
              else if (element.hasOwnProperty("body")) {
                  var item = _.get(element, "body");
                  entityArray = _.union(entityArray, this.getCtlElements(item));
              }
          }
          return entityArray;
      };
      /**
       * 组件被移除后触发
       */
      CtlBase.prototype.removeHandle = function () {
          var d = this._webix;
          if (!d) {
              return;
          }
          this._webix = undefined;
          if (d) {
              d.destructor();
          }
          this.refreshState();
      };
      /**
       * 控件 value 值发生变化后，设置 entityName 对应的值
       */
      CtlBase.prototype.changeToEntity = function (value) {
          if (this.entityName) {
              // 带 entityName 实体绑定
              _.set(this._module, this.entityName, value);
          }
      };
      /**
       * vue 或 webix 组件被设置后触发
       */
      CtlBase.prototype.refreshState = function () {
          var _this = this;
          if (isDesignMode()) {
              return;
          }
          if (this._webix) {
              /* ================================ 安装 ================================ */
              if (this.ctlName) {
                  // 带 ctlName 控件属性
                  this._module.refs[this.ctlName] = this;
              }
              if (this.entityName) {
                  // 带 entityName 实体绑定
                  this._entityWatch = this._module.$watch(this.entityName, function (nv, ov) {
                      _.set(_this, 'value', nv);
                  }, { immediate: true });
              }
              return;
          }
          /* ================================ 卸载 ================================ */
          if (this.ctlName) {
              // 删除控件
              if (this._module) {
                  delete this._module.refs[this.ctlName];
              }
          }
          if (this._entityWatch) {
              // 解除绑定
              this._entityWatch();
              delete this._entityWatch;
          }
          delete this._module;
      };
      Object.defineProperty(CtlBase.prototype, "hidden", {
          get: function () {
              return this._webixConfig.hidden;
          },
          /**
           * 设置隐藏
           */
          set: function (nv) {
              this._webixConfig.hidden = nv;
              if (!this._webix) {
                  return;
              }
              if (nv) {
                  this._webix.hide();
              }
              else {
                  this._webix.show();
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlBase;
  }());
  //# sourceMappingURL=CtlBase.js.map

  /**
   * 内部函数
   * 将 vjson 中，属于 yvanui 的属性从 vjson 中删掉。
   * 并返回 yvanProp 属性
   */
  function parseYvanPropChangeVJson(vjson, names) {
      var yvanProp = {};
      _.forEach(__spreadArrays(names, [
          'debugger',
          'ctlName',
          'entityName',
          'onRender'
      ]), function (name) {
          if (_.has(vjson, name)) {
              yvanProp[name] = vjson[name];
              delete vjson[name];
          }
      });
      return yvanProp;
  }
  //# sourceMappingURL=CtlUtils.js.map

  var version = "3.0.2";
  /**
   * 全局 数据库连接
   */
  var dbs = {};
  /**
   * 全局 formatter 函数
   */
  var formatter = {};
  /**
   * 全局 dict 字典
   */
  var dict = {};
  /**
   * 全局 校验方法
   */
  var validType = {};
  /**
   * 复杂校验通用方法
   */
  var complexValid = {};
  /**
   * 组件渲染过滤器, 如果方法返回 false 代表该组件不需要被渲染.
   * 可以修改 vjson 的内容，但不能删除他
   */
  exports.componentRenderFilter = undefined;
  function getServerPrefix(url) {
      return _.get(window, '_YvanUI_serverJSPrefix') + url;
  }
  /**
   * YvanUI 全局扩展配置
   * @param option 配置信息
   */
  function extend(option) {
      if (option.ajax) {
          exports.ajax = option.ajax;
      }
      if (option.serverJsPrefix) {
          _.extend(window, { _YvanUI_serverJSPrefix: option.serverJsPrefix });
      }
      if (option.dbs) {
          _.extend(dbs, option.dbs);
      }
      if (option.dict) {
          _.extend(dict, option.dict);
      }
      if (option.validType) {
          _.extend(validType, option.validType);
      }
      if (option.formatter) {
          _.extend(formatter, option.formatter);
      }
      if (option.complexValid) {
          _.extend(complexValid, option.complexValid);
      }
      if (option.componentRenderFilter) {
          exports.componentRenderFilter = option.componentRenderFilter;
      }
  }
  //# sourceMappingURL=YvanUIExtend.js.map

  /**
   * 服务调用
   */
  function brokerInvoke(serverUrl, method, args) {
      return new Promise(function (resolve, reject) {
          var ajax = _.get(window, 'YvanUI.ajax');
          ajax({
              url: serverUrl + '@' + method,
              method: 'POST-JSON',
              data: args
          }).then(function (res) {
              resolve(res);
          }).catch(function (e) {
              reject(e);
          });
      });
  }
  /**
   * 创建服务代理
   */
  function createBroker(serviceType) {
      var serviceProxy = serviceType;
      var result = {};
      // 具体参见 com.yvan.serverless.ServerLessServlet@doGet
      _.each(serviceProxy.funcs, function (fun) {
          _.set(result, fun, function () {
              return brokerInvoke(serviceProxy.invokeUrl, fun, {
                  args: Array.prototype.slice.call(arguments)
              });
          });
      });
      return result;
  }
  //# sourceMappingURL=Service.js.map

  var YvDataSource = /** @class */ (function () {
      function YvDataSource(ctl, option, dataSourceProcess) {
          var _this = this;
          this.watches = [];
          this.customFunctionModeDebounce = _$1.debounce(function (option) {
              var that = _this;
              that.ctl.loading = true;
              option.call(that.module, that.ctl, {
                  successCallback: function (data) {
                      if (that.dataSourceProcess) {
                          //自定义的数据处理过程
                          that.ctl.dataReal = that.dataSourceProcess(data);
                      }
                      else {
                          that.ctl.dataReal = data;
                      }
                      that.ctl.loading = false;
                      YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
                  },
                  failCallback: function () {
                      that.ctl.dataReal = [];
                      that.ctl.loading = false;
                      YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
                  }
              });
          });
          this.sqlModeDebounce = _$1.debounce(function (option) {
              var that = _this;
              var ajaxPromise;
              if (option.type === 'SQL') {
                  var ajaxParam = {
                      params: option.params,
                      needCount: false,
                      sqlId: option.sqlId
                  };
                  var allow = YvEventDispatch(option.onBefore, that.ctl, ajaxParam);
                  if (allow === false) {
                      // 不允许请求
                      return;
                  }
                  ajaxPromise = dbs[option.db].query(ajaxParam);
              }
              else if (option.type === 'Server') {
                  var _a = _$1.split(option.method, '@'), serverUrl = _a[0], method = _a[1];
                  var ajaxParam = {
                      params: option.params,
                      needCount: false,
                  };
                  var allow = YvEventDispatch(option.onBefore, that.ctl, ajaxParam);
                  if (allow === false) {
                      // 不允许请求
                      return;
                  }
                  ajaxPromise = brokerInvoke(getServerPrefix(serverUrl), method, ajaxParam);
              }
              else {
                  console.error('unSupport dataSource mode:', option);
                  that.ctl.dataReal = [];
                  that.ctl.loading = false;
                  return;
              }
              //异步请求数据内容
              that.ctl.loading = true;
              ajaxPromise.then(function (res) {
                  YvEventDispatch(option.onAfter, that.ctl, res);
                  var resultData = res.data, resParams = res.params;
                  if (_this.dataSourceProcess) {
                      //自定义的数据处理过程
                      that.ctl.dataReal = _this.dataSourceProcess(resultData);
                  }
                  else {
                      that.ctl.dataReal = resultData;
                  }
                  YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
              }).catch(function (r) {
                  that.ctl.dataReal = [];
              }).finally(function () {
                  that.ctl.loading = false;
              });
          });
          if (isDesignMode()) {
              return;
          }
          this.ctl = ctl;
          this.option = option;
          this.dataSourceProcess = dataSourceProcess;
          this.module = ctl._webix.$scope;
      }
      /**
       * 自定义函数式取值
       */
      YvDataSource.prototype.setCustomFunctionMode = function (option) {
          var that = this;
          this.reload = function () {
              that.customFunctionModeDebounce(option);
          };
          this.reload();
      };
      /**
       * SQL取值
       */
      YvDataSource.prototype.setSqlMode = function (option) {
          var that = this;
          this.reload = function () {
              that.sqlModeDebounce(option);
          };
          this.reload();
      };
      YvDataSource.prototype.init = function () {
          var _this = this;
          if (!this.option) {
              //没有设值，退出
              this.reload = undefined;
              return;
          }
          if (typeof this.option === 'function') {
              //以 function 方式运行
              this.setCustomFunctionMode(this.option);
              return;
          }
          if (_$1.isArray(this.option)) {
              //结果就是数组
              this.reload = function () {
                  _this.ctl.dataReal = _this.option;
                  _this.ctl.$yvDispatch(_this.ctl.onDataComplete);
              };
              this.reload();
              return;
          }
          // 使 watch 生效
          _$1.each(this.option.watch, function (watchExp) {
              var unwatch = _this.module.$watch(watchExp, function () {
                  if (_this.reload) {
                      _this.reload();
                  }
              });
              _this.watches.push(unwatch);
          });
          if (this.option.type === 'function') {
              // 取 bind 函数
              if (typeof this.option.bind === 'function') {
                  this.setCustomFunctionMode(this.option.bind);
              }
              else {
                  var bindFunction = _$1.get(this.module, this.option.bind);
                  if (!bindFunction) {
                      console.error("\u6CA1\u6709\u627E\u5230\u540D\u79F0\u4E3A " + this.option.bind + " \u7684\u65B9\u6CD5");
                      return;
                  }
                  this.setCustomFunctionMode(bindFunction);
              }
          }
          else if (this.option.type === 'SQL' || this.option.type === 'Server') {
              this.setSqlMode(this.option);
          }
          else {
              console.error("\u5176\u4ED6\u65B9\u5F0F\u6CA1\u6709\u5B9E\u73B0");
          }
      };
      YvDataSource.prototype.destory = function () {
          // 解除全部 watch
          _$1.each(this.watches, function (unwatch) {
              unwatch();
          });
          this.reload = undefined;
          this.ctl.dataReal = [];
      };
      return YvDataSource;
  }());
  //# sourceMappingURL=YvanDataSourceImp.js.map

  var CtlButtonDefault = {
      text: '',
      icon: '',
      // width: 120,
      type: 'text',
      autowidth: true,
  };
  var CtlDataviewDefault = {};
  var CtlDatatableDefault = {};
  var CtlTreeDefault = {
      showCheckbox: false,
      showLeftIcon: true,
      showIcon: true,
  };
  var CtlSidebarDefault = {};
  var CtlXtermDefault = {};
  var CtlConsoleLogDefault = {};
  var CtlCodeMirrorDefault = {
      mode: 'sql',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      autofocus: true,
      extraKeys: { "Ctrl-Space": "autocomplete" },
      hintOptions: {
          tables: {
              users: ["name", "score", "birthDate"],
              countries: ["name", "population", "size"]
          }
      }
  };
  var CtlInputDefault = {
      labelWidth: 110,
      labelAlign: 'right',
      // width: 250,
      prompt: '请输入'
  };
  var CtlTextDefault = __assign({}, CtlInputDefault);
  var CtlNumberDefault = __assign(__assign({}, CtlInputDefault), { precision: 0 });
  var CtlDateDefault = __assign(__assign({}, CtlInputDefault), { prompt: '请选择' });
  var CtlDateTimeDefault = __assign(__assign({}, CtlInputDefault), { 
      //width: 300,
      prompt: '请选择' });
  var CtlDateRangeDefault = __assign(__assign({}, CtlInputDefault), { 
      //width: 430,
      separator: ' 至 ', prompt: '请选择日期范围' });
  var CtlDateTimeRangeDefault = __assign(__assign({}, CtlInputDefault), { 
      //width: 430,
      separator: ' 至 ', prompt: '请选择时间范围' });
  var CtlComboDefault = __assign(__assign({}, CtlInputDefault), { prompt: '请选择' });
  var CtlMultiComboDefault = __assign(__assign({}, CtlInputDefault), { separator: ',', prompt: '请选择' });
  var CtlSearchDefault = __assign(__assign({}, CtlInputDefault), { prompt: '回车键查询' });
  var CtlCheckboxDefault = {
      // labelWidth: 110,
      labelAlign: 'right',
      checkValue: 'T',
      uncheckValue: 'F'
  };
  var CtlSwitchDefault = {
      // labelWidth: 110,
      labelAlign: 'right',
      checkValue: 'T',
      uncheckValue: 'F'
  };
  var CtlRadioDefault = {
      labelWidth: 110,
      labelAlign: 'right',
  };
  //# sourceMappingURL=CtlDefaultValue.js.map

  function getFirstPinyin(msg) {
      return _.get(window, 'getFirstPinyin')(msg);
  }
  //# sourceMappingURL=Utils.js.map

  var CtlTree = /** @class */ (function (_super) {
      __extends(CtlTree, _super);
      function CtlTree() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /**
           * 显示勾选框
           */
          _this.showCheckbox = false;
          /**
           * 显示左侧展开图标
           */
          _this.showLeftIcon = true;
          /**
           * 显示图标
           */
          _this.showIcon = true;
          return _this;
      }
      CtlTree.create = function (module, vjson) {
          var that = new CtlTree(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlTreeDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              // 'data',
              'dataSource',
              'onNodeClick',
              'onNodeDblClick',
              'onDataComplete',
              'showCheckbox',
              'showLeftIcon',
              'showIcon'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              select: true,
              filterMode: {
                  showSubItems: false
              },
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  },
                  onItemClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeClick, that, item);
                  },
                  onItemDblClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeDblClick, that, item);
                  }
              },
              template: function (obj, common) {
                  var t = '';
                  if (that.showCheckbox) {
                      t += common.checkbox(obj, common);
                  }
                  if (that.showIcon) {
                      t += common.folder(obj, common);
                  }
                  if (that.showLeftIcon) {
                      t += common.icon(obj, common);
                  }
                  t += obj.value;
                  return t;
              },
              // 树的左侧图标
              type: {
                  folder: function (obj) {
                      if (obj.icon) {
                          return ("<span style='padding-left: 5px; padding-right: 5px; color: #5fa2dd; font-size: 16px' class='" +
                              obj.icon +
                              "'></span>");
                      }
                      return '';
                  }
              }
          });
          if (vjson.threeState !== false && that.showCheckbox) {
              vjson.threeState = true;
          }
          else {
              vjson.threeState = false;
          }
          return that;
      };
      /**
       * 拼音方式过滤查找树
       */
      CtlTree.prototype.filter = function (nv) {
          if (!nv) {
              this._webix.filter('');
              return;
          }
          this._webix.filter(function (node) {
              var value = node.value;
              var nodePy = getFirstPinyin(value).toLowerCase();
              return nodePy.indexOf(nv.toLowerCase()) >= 0 || value.toLowerCase().indexOf(nv) >= 0;
          });
      };
      Object.defineProperty(CtlTree.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlTree.prototype, "dataReal", {
          /**
           * 设置数据
           */
          set: function (nv) {
              // dataSource call back
              this._webix.clearAll();
              this._webix.parse(nv);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlTree.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlTree.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      /**
       * 获取第一个节点
       */
      CtlTree.prototype.getFirstId = function () {
          return this._webix.getFirstId();
      };
      /**
       * 展开某个节点
       */
      CtlTree.prototype.open = function (id) {
          this._webix.open(id);
      };
      /**
       * 清空所有数据
       */
      CtlTree.prototype.clear = function () {
          this._webix.clearAll();
      };
      /**
       * 选择所有节点
       */
      CtlTree.prototype.checkAll = function () {
          this._webix.checkAll();
      };
      /**
       * 取消选择所有节点
       */
      CtlTree.prototype.uncheckAll = function () {
          this._webix.uncheckAll();
      };
      /**
       * 根据id获取一行数据
       */
      CtlTree.prototype.getItem = function (id) {
          return this._webix.getItem(id);
      };
      /**
       * 获取某 id 下树节点所有的子节点
       */
      CtlTree.prototype.getChildItems = function (id) {
          var ret = [];
          var c = this._webix.getFirstChildId(id);
          while (c) {
              ret.push(this._webix.getItem(c));
              c = this._webix.getNextSiblingId(c);
          }
          return ret;
      };
      /**
       * 获取某 id 下树节点所有的子节点的编号
       */
      CtlTree.prototype.getChildIds = function (id) {
          var ret = [];
          var c = this._webix.getFirstChildId(id);
          while (c) {
              ret.push(c);
              c = this._webix.getNextSiblingId(c);
          }
          return ret;
      };
      /**
       * 获取被选中的一行编号
       */
      CtlTree.prototype.getSelectedId = function () {
          return this._webix.getSelectedId();
      };
      /**
       * 获取被选中的一行
       */
      CtlTree.prototype.getSelectedItem = function () {
          return this._webix.getSelectedItem();
      };
      /**
       * 勾选选中一行
       */
      CtlTree.prototype.checkItem = function (id) {
          this._webix.checkItem(id);
      };
      /**
       * 选中一行
       * @param id
       */
      CtlTree.prototype.select = function (id) {
          // this._webix.showItem(id);
          var pid = id;
          while (pid) {
              this._webix.open(pid);
              pid = this._webix.getParentId(pid);
          }
          this._webix.select(id);
      };
      /**
       * 选中多行
       */
      CtlTree.prototype.checkItems = function (ids) {
          for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
              var id = ids_1[_i];
              this._webix.checkItem(id);
          }
      };
      /**
       * 取消选中一行
       */
      CtlTree.prototype.uncheckItem = function (id) {
          this._webix.uncheckItem(id);
      };
      /**
       * 获取选中的ID 数组
       */
      CtlTree.prototype.getCheckedIds = function () {
          return this._webix.getChecked();
      };
      /**
       * 获取选中的行数组
       */
      CtlTree.prototype.getCheckedItems = function () {
          var _this = this;
          return _.map(this._webix.getChecked(), function (v) { return _this._webix.getItem(v); });
      };
      /**
       * 查看是否被选中
       */
      CtlTree.prototype.isChecked = function (id) {
          return this._webix.isChecked(id);
      };
      /**
       * 展开全部节点
       */
      CtlTree.prototype.expandAll = function () {
          this._webix.openAll();
      };
      /**
       * 收起所有节点
       */
      CtlTree.prototype.collapseAll = function () {
          this._webix.closeAll();
      };
      /**
       * 递归查找每个节点, 直到寻找到想要的节点
       */
      CtlTree.prototype.find = function (condition) {
          return this._webix.find(condition);
      };
      //重新绑定数据源
      CtlTree.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlTree.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource ||
              _.isArray(this.dataSource) ||
              _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
              return data;
          }
          if (!this.dataSource.parentField ||
              !this.dataSource.displayField ||
              !this.dataSource.valueField) {
              return data;
          }
          var idField = this.dataSource.valueField;
          var textField = this.dataSource.displayField;
          var parentField = this.dataSource.parentField;
          data = _.cloneDeep(data);
          // 第一遍扫描, 建立映射关系
          var nodeMap = {};
          var rootNode = [];
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              nodeMap[row[idField]] = {
                  icon: row['icon'],
                  value: row[textField],
                  id: row[idField],
                  disabled: _.get(row, 'disabled'),
                  row: row
              };
          }
          // 第二遍扫描，建立父子关系
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              var parent_1 = row[parentField];
              var id = row[idField];
              if (!parent_1 || parent_1 === '0') {
                  // 没有父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
              else if (nodeMap.hasOwnProperty(parent_1)) {
                  //找到父亲
                  var parentNode = nodeMap[parent_1];
                  if (parentNode.hasOwnProperty('data')) {
                      parentNode.data.push(nodeMap[id]);
                  }
                  else {
                      parentNode.data = [nodeMap[id]];
                  }
              }
              else {
                  // 没有找到父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
          }
          return rootNode;
      };
      //刷新状态时，自动重绑数据源
      CtlTree.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      return CtlTree;
  }(CtlBase));
  //# sourceMappingURL=CtlTree.js.map

  var CtlTreeTable = /** @class */ (function (_super) {
      __extends(CtlTreeTable, _super);
      function CtlTreeTable() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /**
           * 显示勾选框
           */
          _this.showCheckbox = false;
          /**
           * 显示左侧展开图标
           */
          _this.showLeftIcon = true;
          /**
           * 显示图标
           */
          _this.showIcon = true;
          return _this;
      }
      CtlTreeTable.create = function (module, vjson) {
          var that = new CtlTreeTable(vjson);
          that._module = module;
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'data',
              'dataSource',
              'onNodeClick',
              'onNodeDblClick',
              'showCheckbox',
              'showLeftIcon',
              'showIcon'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  },
                  onItemClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeClick, that, item);
                  },
                  onItemDblClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeDblClick, that, item);
                  }
              },
              template: function (obj, common) {
                  var t = '';
                  if (that.showCheckbox) {
                      t += common.checkbox(obj, common);
                  }
                  if (that.showIcon) {
                      t += common.folder(obj, common);
                  }
                  if (that.showLeftIcon) {
                      t += common.icon(obj, common);
                  }
                  t += obj.value;
                  return t;
              },
              threeState: that.showCheckbox,
              // 树的左侧图标
              type: {
                  folder: function (obj) {
                      if (obj.icon) {
                          return ("<span style='padding-left: 5px; padding-right: 5px; color: #063978; font-size: 16px' class='" +
                              obj.icon +
                              "'></span>");
                      }
                      return '';
                  }
              }
          });
          return that;
      };
      Object.defineProperty(CtlTreeTable.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlTreeTable.prototype, "dataReal", {
          /**
           * 设置数据
           */
          set: function (nv) {
              this._webix.clearAll();
              this._webix.parse(nv);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlTreeTable.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlTreeTable.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      /**
       * 清空所有数据
       */
      CtlTreeTable.prototype.clear = function () {
          this._webix.clearAll();
      };
      /**
       * 取消选择所有节点
       */
      CtlTreeTable.prototype.uncheckAll = function () {
          this._webix.uncheckAll();
      };
      /**
       * 根据id获取一行数据
       */
      CtlTreeTable.prototype.getItem = function (id) {
          return this._webix.getItem(id);
      };
      /**
       * 获取某 id 下树节点所有的子节点
       */
      CtlTreeTable.prototype.getChildItems = function (id) {
          var ret = [];
          var c = this._webix.getFirstChildId(id);
          while (c) {
              ret.push(this._webix.getItem(c));
              c = this._webix.getNextSiblingId(c);
          }
          return ret;
      };
      /**
       * 获取某 id 下树节点所有的子节点的编号
       */
      CtlTreeTable.prototype.getChildIds = function (id) {
          var ret = [];
          var c = this._webix.getFirstChildId(id);
          while (c) {
              ret.push(c);
              c = this._webix.getNextSiblingId(c);
          }
          return ret;
      };
      /**
       * 勾选选中一行
       */
      CtlTreeTable.prototype.checkItem = function (id) {
          this._webix.checkItem(id);
      };
      /**
       * 获取被选中的一行编号
       */
      CtlTreeTable.prototype.getSelectedId = function () {
          return this._webix.getSelectedId();
      };
      /**
       * 获取被选中的一行
       */
      CtlTreeTable.prototype.getSelectedItem = function () {
          return this._webix.getSelectedItem();
      };
      /**
       * 选中一行
       * @param id
       */
      CtlTreeTable.prototype.select = function (id) {
          this._webix.showItem(id);
          this._webix.select(id);
      };
      /**
       * 选中多行
       */
      CtlTreeTable.prototype.checkItems = function (ids) {
          for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
              var id = ids_1[_i];
              this._webix.checkItem(id);
          }
      };
      /**
       * 取消选中一行
       */
      CtlTreeTable.prototype.uncheckItem = function (id) {
          this._webix.uncheckItem(id);
      };
      /**
       * 获取选中的行
       */
      CtlTreeTable.prototype.getChecked = function () {
          return this._webix.getChecked();
      };
      /**
       * 查看是否被选中
       */
      CtlTreeTable.prototype.isChecked = function (id) {
          return this._webix.isChecked(id);
      };
      /**
       * 展开全部节点
       */
      CtlTreeTable.prototype.expandAll = function () {
          this._webix.openAll();
      };
      /**
       * 收起所有节点
       */
      CtlTreeTable.prototype.collapseAll = function () {
          this._webix.closeAll();
      };
      /**
       * 过滤, 如果不设置 condition 代表不过滤，否则带入过滤函数
       */
      CtlTreeTable.prototype.filter = function (condition) {
          this._webix.filter(condition);
      };
      //重新绑定数据源
      CtlTreeTable.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlTreeTable.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource || _.isArray(this.dataSource) || _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
              return data;
          }
          if (!this.dataSource.parentField || !this.dataSource.valueField) {
              return data;
          }
          var idField = this.dataSource.valueField;
          var parentField = this.dataSource.parentField;
          data = _.cloneDeep(data);
          // 第一遍扫描, 建立映射关系
          var nodeMap = {};
          var rootNode = [];
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              nodeMap[row[idField]] = row;
          }
          // 第二遍扫描，建立父子关系
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              var parent_1 = row[parentField];
              var id = row[idField];
              if (!parent_1 || parent_1 === '0') {
                  // 没有父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
              else if (nodeMap.hasOwnProperty(parent_1)) {
                  //找到父亲
                  var parentNode = nodeMap[parent_1];
                  if (parentNode.hasOwnProperty('data')) {
                      parentNode.data.push(nodeMap[id]);
                  }
                  else {
                      parentNode.data = [nodeMap[id]];
                  }
              }
              else {
                  // 没有找到父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
          }
          return rootNode;
      };
      //刷新状态时，自动重绑数据源
      CtlTreeTable.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      return CtlTreeTable;
  }(CtlBase));
  //# sourceMappingURL=CtlTreeTable.js.map

  /**
   * 创建快捷菜单
   * <pre>
   *     {
              text: '菜单1',
              onClick: {
                  type: 'function',
                  bind: 'tabBar1'
              }
          },
   {
              text: '菜单2',
              children: [
                  {
                      text: '菜单2.1',
                      onClick: {
                          type: 'function',
                          bind: 'tabBar21'
                      }
                  },
                  {
                      text: '菜单2.2',
                      onClick: {
                          type: 'function',
                          bind: 'tabBar22'
                      }
                  }
              ]
          },
   {
              text: '菜单3',
              onClick: {
                  type: 'function',
                  bind: 'tabBar3'
              }
          }
   * </pre>
   */
  function createContextMenu(config, scope) {
      var methodMap = new Map();
      function buildMenu(configArray) {
          var ret = new Array();
          _.each(configArray, function (menu) {
              if (!menu)
                  return;
              if (menu === '-' || menu.text === '-') {
                  ret.push({ $template: 'Separator' });
              }
              if (menu.text) {
                  var id = _.uniqueId('_cxm_');
                  methodMap.set(id, menu.onClick);
                  if (_.isArray(menu.children)) {
                      ret.push({ value: menu.text, submenu: buildMenu(menu.children) });
                  }
                  else {
                      ret.push({ value: menu.text, id: id });
                  }
              }
          });
          return ret;
      }
      var handler = webix.ui({
          view: 'contextmenu',
          data: buildMenu(config),
          on: {
              onMenuItemClick: function (id) {
                  if (methodMap.has(id)) {
                      YvEventDispatch(methodMap.get(id), this, this.getContext(), this.$scope);
                  }
              }
          },
          $scope: scope
      });
      return handler;
      // return webix.ui({
      //     view: "contextmenu",
      //     data: [
      //         {value: "a", id: 'UU_A'},
      //         {value: "b", id: 'UU_B'},
      //         // {$template: "Spacer"},
      //         {$template: "Separator"},
      //         {
      //             value: "Translate...",
      //             submenu: [
      //                 {
      //                     value: "罗", id: 'AAA', on: {
      //                         onClick: function (id: any) {
      //                             debugger
      //                         }
      //                     }
      //                 },
      //                 {value: "三", id: 'BBB'},
      //             ]
      //         }
      //     ],
      //     on: {
      //         onMenuItemClick: function (id: any) {
      //             debugger
      //         }
      //     }
      // });
  }
  //# sourceMappingURL=CtlContextMenu.js.map

  var CtlTab = /** @class */ (function (_super) {
      __extends(CtlTab, _super);
      function CtlTab() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.defaultTabIndex = 0;
          /* =============================================== 以下部分为私有函数 =============================================== */
          /**
           * 快捷菜单句柄
           */
          _this._menuConfig = undefined;
          return _this;
      }
      CtlTab.create = function (module, vjson) {
          var that = new CtlTab(vjson);
          that._module = module;
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'tabbarContextMenu',
              'defaultTabIndex',
              'onTabChanged',
              'onTabClosed'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                      _.defer(function () {
                          if (yvanProp.defaultTabIndex > 0) {
                              // 默认打开的 tab 序号
                              that._webix.getMultiview()._cells[yvanProp.defaultTabIndex].show();
                          }
                          if (that._menuConfig) {
                              var menuHandler = createContextMenu(that._menuConfig, that.getModule());
                              menuHandler.attachTo(that._webix.getTabbar().$view);
                          }
                      });
                  }
              },
              tabbar: {
                  // close: true,
                  on: {
                      onAfterDelete: function () {
                          that.removeHandle();
                      },
                      onChange: function (newBodyId) {
                          YvEventDispatch(that.onTabChanged, that, newBodyId);
                      },
                      onOptionRemove: function (newBodyId) {
                          YvEventDispatch(that.onTabClosed, that, newBodyId);
                      }
                  }
              },
              multiview: {
                  keepViews: true // 没有显示的选项卡也要渲染DOM, 否则 aggrid 会出问题
                  // fitBiggest: true,    //始终以最大的 tab 页签为大小
              }
          });
          return that;
      };
      Object.defineProperty(CtlTab.prototype, "tabbarContextMenu", {
          /**
           * tabbar 上的快捷菜单
           */
          set: function (config) {
              this._menuConfig = config;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 关闭所有允许关闭的标签
       */
      CtlTab.prototype.closeAll = function (butIds) {
          var _this = this;
          var cellId = new Array();
          _.each(this._webix.getMultiview()._cells, function (cell) {
              if (!_.includes(butIds, cell.config.id)) {
                  cellId.push(cell.config.id);
              }
          });
          _.each(cellId, function (id) {
              _this._webix.removeView(id);
          });
      };
      /**
       * 添加一个模块到标签页执行
       * @param text 标签标题
       * @param id 标签id
       * @param vue 模块(Class)
       */
      CtlTab.prototype.addModule = function (text, id, vue) {
          var that = this;
          var cfg = vue.buildView();
          var tabId = this._webix.addView({
              header: text,
              close: true,
              body: _.merge(cfg, {
                  id: id,
                  on: {
                      onDestruct: function () {
                          if (vue.onClose) {
                              vue.onClose();
                          }
                          vue.$destroy();
                          delete vue._isLoadInvoked;
                      },
                      onViewShow: function () {
                          if (!vue._isLoadInvoked) {
                              vue._webixId = tabId;
                              vue._isLoadInvoked = true;
                              // 标题栏不允许被选中
                              $(this.$view).parent().prev().addClass('ag-unselectable');
                              vue.onLoad();
                          }
                          vue.onShow();
                      }
                      // onViewShow: _.once(() => {
                      //     // 触发 onLoad 方法
                      //     // 注意这有个 bug, viewTab 的最后一个标签，千万不能删除
                      //     vue._webixId = tabId;
                      //     vue.onLoad();
                      // })
                  }
              })
          });
          this._webix.setValue(tabId);
          if (this.tabCount === 1) {
              // 这里有个 bug
              // 如果是第一个被打开的标签，会不触发 onTabChanged 事件
              YvEventDispatch(that.onTabChanged, that, id);
          }
      };
      /**
       * 添加一个 Vjson 到标签
       * @param text 标签标题
       * @param id 标签id
       * @param vjson 界面描述片段
       */
      CtlTab.prototype.addContent = function (text, id, vjson, opts) {
          var that = this;
          if (this.selectTab(id)) {
              // 已经打开了页面
              return;
          }
          var close = true;
          if (opts && opts.close === false) {
              close = false;
          }
          wrapperWebixConfig(this.getModule(), vjson);
          var tabId = this._webix.addView({
              header: text,
              close: close,
              body: _.merge(vjson, {
                  id: id
              })
          });
          this._webix.setValue(tabId);
          if (this.tabCount === 1) {
              // 这里有个 bug
              // 如果是第一个被打开的标签，会不触发 onTabChanged 事件
              YvEventDispatch(that.onTabChanged, that, id);
          }
      };
      Object.defineProperty(CtlTab.prototype, "tabCount", {
          /**
           * 获取 tab 标签数量
           */
          get: function () {
              return this._webix.getMultiview()._cells.length;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 选定某个标签
       */
      CtlTab.prototype.selectTab = function (id) {
          if (webix.$$(id)) {
              webix.$$(id).show();
              return true;
          }
          return false;
      };
      /**
       * 判断标签是否存在
       */
      CtlTab.prototype.tabExsit = function (id) {
          if (webix.$$(id)) {
              return true;
          }
          return false;
      };
      /**
       * 获取当前选中的 tabId
       */
      CtlTab.prototype.getSelectedTabId = function () {
          return this._webix.getTabbar().getValue();
      };
      return CtlTab;
  }(CtlBase));
  //# sourceMappingURL=CtlTab.js.map

  var CtlDataview = /** @class */ (function (_super) {
      __extends(CtlDataview, _super);
      function CtlDataview() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlDataview.create = function (module, vjson) {
          var that = new CtlDataview(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlDataviewDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              // 'data',
              'dataSource',
              'onItemSelect',
              'onItemClick',
              'onItemDblClick',
              'onDataComplete'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              select: true,
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  },
                  onItemClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemClick, that, item);
                  },
                  onItemDblClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemDblClick, that, item);
                  },
                  onAfterSelect: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemSelect, that, item);
                  }
              }
          });
          return that;
      };
      Object.defineProperty(CtlDataview.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlDataview.prototype, "dataReal", {
          /**
           * 设置数据
           */
          set: function (nv) {
              // dataSource call back
              this._webix.clearAll();
              this._webix.parse(nv);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlDataview.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlDataview.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      CtlDataview.prototype.filter = function (func) {
          this._webix.filter(func);
      };
      //重新绑定数据源
      CtlDataview.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlDataview.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource ||
              _.isArray(this.dataSource) ||
              _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
              return data;
          }
          if (!this.dataSource.idField) {
              return data;
          }
          var idField = this.dataSource.idField;
          data = _.cloneDeep(data);
          // 第一遍扫描, 建立映射关系
          _.each(data, function (item) {
              item.id = item[idField];
          });
          return data;
      };
      //刷新状态时，自动重绑数据源
      CtlDataview.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      return CtlDataview;
  }(CtlBase));
  //# sourceMappingURL=CtlDataview.js.map

  var CtlDatatable = /** @class */ (function (_super) {
      __extends(CtlDatatable, _super);
      function CtlDatatable() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlDatatable.create = function (module, vjson) {
          var that = new CtlDatatable(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlDatatableDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              // 'data',
              'dataSource',
              'onItemSelect',
              'onItemClick',
              'onItemDblClick',
              'onDataComplete'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              select: true,
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  },
                  onItemClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemClick, that, item);
                  },
                  onItemDblClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemDblClick, that, item);
                  },
                  onAfterSelect: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onItemSelect, that, item);
                  }
              }
          });
          return that;
      };
      Object.defineProperty(CtlDatatable.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlDatatable.prototype, "dataReal", {
          /**
           * 设置数据
           */
          set: function (nv) {
              // dataSource call back
              this._webix.clearAll();
              this._webix.parse(nv);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlDatatable.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlDatatable.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      CtlDatatable.prototype.filter = function (func) {
          this._webix.filter(func);
      };
      //重新绑定数据源
      CtlDatatable.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlDatatable.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource ||
              _.isArray(this.dataSource) ||
              _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
              return data;
          }
          if (!this.dataSource.idField) {
              return data;
          }
          var idField = this.dataSource.idField;
          data = _.cloneDeep(data);
          // 第一遍扫描, 建立映射关系
          _.each(data, function (item) {
              item.id = item[idField];
          });
          return data;
      };
      //刷新状态时，自动重绑数据源
      CtlDatatable.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      return CtlDatatable;
  }(CtlBase));
  //# sourceMappingURL=CtlDatatable.js.map

  /**
   * 按钮组件
   * @author yvan
   */
  var CtlButton = /** @class */ (function (_super) {
      __extends(CtlButton, _super);
      function CtlButton() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /*============================ 私有属性部分 ============================*/
          _this._text = '';
          _this._icon = '';
          return _this;
      }
      CtlButton.create = function (module, vjson) {
          var that = new CtlButton(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlButtonDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'onClick',
              'cssType',
              'icon',
              'width',
              'badge',
              'text'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              type: 'text',
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onDestruct: function () {
                      that.removeHandle();
                  },
                  onItemClick: function () {
                      if (isDesignMode()) {
                          return;
                      }
                      YvEventDispatch(that.onClick, that, undefined);
                  }
              }
          });
          return that;
      };
      Object.defineProperty(CtlButton.prototype, "badge", {
          /**
           * 设置标记
           */
          set: function (nv) {
              if (!this._webix) {
                  if (nv) {
                      this._webixConfig.badge = nv;
                  }
                  else {
                      delete this._webixConfig.css;
                  }
                  return;
              }
              this._webix.define('badge', nv);
              this._webix.render();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlButton.prototype, "width", {
          /**
           * 设置宽度
           */
          set: function (nv) {
              if (!this._webix) {
                  if (nv) {
                      this._webixConfig.width = nv;
                  }
                  else {
                      delete this._webixConfig.width;
                  }
                  return;
              }
              this._webix.define('width', nv);
              this._webix.resize();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlButton.prototype, "cssType", {
          /**
           * 显示样式
           */
          set: function (nv) {
              var css = nv;
              switch (nv) {
                  case 'success':
                      css = 'yvan_success';
                      break;
                  case 'danger':
                      css = 'yvan_danger';
                      break;
                  case 'primary':
                      css = 'yvan_primary';
                      break;
                  case 'default':
                      css = '';
                      break;
              }
              if (!this._webix) {
                  if (css) {
                      this._webixConfig.css = css;
                  }
                  else {
                      delete this._webixConfig.css;
                  }
                  return;
              }
              $(this._webix.$view).removeClass('webix_danger webix_primary');
              this._webix.define('css', css);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlButton.prototype, "icon", {
          /**
           * 获取按钮图标
           */
          get: function () {
              return this._icon;
          },
          /**
           * 设置按钮图标
           */
          set: function (nv) {
              this._icon = nv;
              this._refreshText();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlButton.prototype, "text", {
          /**
           * 获取按钮文本
           */
          get: function () {
              return this._text;
          },
          /**
           * 设置按钮文本
           */
          set: function (nv) {
              this._text = nv;
              this._refreshText();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlButton.prototype, "enable", {
          /**
           * 是否允许
           */
          get: function () {
              return this._webixConfig.disabled;
          },
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.disabled = !nv;
                  return;
              }
              this._webix.define('disabled', !nv);
          },
          enumerable: true,
          configurable: true
      });
      CtlButton.prototype._refreshText = function () {
          var nv = "<i class=\"" + this._icon + "\"></i><span>" + this._text + "</span>";
          if (!this._webix) {
              this._webixConfig.value = nv;
              return;
          }
          this._webix.setValue(nv);
      };
      return CtlButton;
  }(CtlBase));
  //# sourceMappingURL=CtlButton.js.map

  /**
   * 显示正在读取
   */
  function loading(msg) {
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
  function clearLoading() {
      var $body = $('body');
      $body.find('.load-view').remove();
      $body.find('.load-view-masker').remove();
  }
  /**
   * 中间灰底白字提示
   */
  function msg(message) {
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
  function showTooltip(obj, message) {
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
      $w.css({ left: xxLeft, top: xxoffset === null || xxoffset === void 0 ? void 0 : xxoffset.top });
  }
  function hideTooltip(obj) {
      var $body = $('body');
      var tooptipId = obj.id + '_tooltip';
      $body.find("#" + tooptipId).remove();
  }
  /**
   * 弹出输入框
   * @param title 输入框标题
   * @param defValue 默认值
   */
  function prompt(title, defValue) {
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
  function alert(content) {
      webix.alert({ title: "提示", text: content, });
  }
  /**
   * 弹出错误框
   * @param content 错误的提示内容
   */
  function error(content) {
      webix.modalbox({ title: "错误", text: content, buttons: ["确认"], type: "confirm-error" });
  }
  /**
   * 弹出确认框
   * @param content 需要确认的文字内容
   */
  function confirm(content) {
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
  function msgError(content) {
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
  function msgSuccess(content) {
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
  function msgInfo(content) {
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

  var CtlInput = /** @class */ (function (_super) {
      __extends(CtlInput, _super);
      function CtlInput() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /**
           * 输入内容时是否立刻提交 value
           */
          _this.changeValueImplete = false;
          _this._gravity = '';
          /**
           * 定焦时间
           */
          _this.ff = 0;
          /**
           * 最大长度
           */
          _this.maxlength = undefined;
          /**================ 私有属性 ===================**/
          _this._validateResult = true;
          _this.anonymous_showTootip = function () {
              var result = _this._resultToShowOrHide();
              if (result) {
                  _this._showTootip(result);
                  _this._showValidateError();
              }
              else {
                  _this._hideTootip();
                  _this._hideValidateError();
              }
          };
          _this.anonymous_hideTootip = function () {
              var $input = $(_this._webix.$view).find('input');
              if (document.activeElement !== $input[0]) {
                  _this._hideTootip();
              }
          };
          return _this;
      }
      CtlInput.prototype._create = function (vjson, me) {
          var that = me;
          // 提取想要的属性
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'id',
              'gravity',
              'validate',
              'onInput',
              'onKeydown',
              'onClick',
              'onEnter',
              'width',
              'onFocus',
              'onChange',
              'onBlur',
              'maxlength',
              'changeValueImplete',
              'ff',
              'label',
              'labelWidth',
              'labelAlign',
              'readonly',
              'disabled',
              'required',
              'onValidate',
              'value',
              'prompt'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          if (!vjson.id) {
              that.id = _.uniqueId('input_');
          }
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          function onKeydown(event) {
              YvEventDispatch(that.onKeydown, that, event);
          }
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterRender: function () {
                      var $input = $(this.$view).find('input');
                      $input.on('input', that.onInputEvent.bind(that));
                      $input.on('keydown', onKeydown);
                      if (that.onValidate || that._required) {
                          that._addEnvent($input);
                      }
                      var result = that._resultToShowOrHide();
                      if (result) {
                          that._showValidateError();
                      }
                      else {
                          that._hideValidateError();
                      }
                      if (that.constructor.name !== 'CtlSelect' && that._webixConfig.required) {
                          if (that.constructor.name === 'CtlDateRangePicker') {
                              that._showValidate(!this.getValue().end || this.getValue().end.length <= 0, 'requiredValidate');
                          }
                          else {
                              that._showValidate(!this.getValue() || this.getValue().length <= 0, 'requiredValidate');
                          }
                      }
                      this.callEvent('onCtlRender', []);
                      if (that.ff > 0) {
                          setTimeout(function () {
                              that.focus();
                              that.ff = 0;
                          }, that.ff);
                      }
                  },
                  onDestruct: function () {
                      this.callEvent('onCtlRemove', []);
                      var $input = $(this.$view).find('input');
                      $input.off('input');
                      $input.off('keydown');
                      that._removeEnvent($input);
                      that.removeHandle();
                      that._hideTootip();
                  },
                  onItemClick: function () {
                      YvEventDispatch(that.onClick, that, undefined);
                  },
                  onEnter: function () {
                      YvEventDispatch(that.onEnter, that, undefined);
                  },
                  onFocus: function () {
                      if (that.onValidate || that._required) {
                          var result = that._resultToShowOrHide();
                          if (result) {
                              that._showTootip(result);
                              that._showValidateError();
                          }
                          else {
                              that._hideTootip();
                              that._hideValidateError();
                          }
                      }
                      YvEventDispatch(that.onFocus, that, undefined);
                  },
                  onChange: function (newValue, oldValue) {
                      if (!that.valueValid(newValue)) {
                          // 不允许触发更改
                          return;
                      }
                      if (that.onValueChange && typeof that.onValueChange === 'function') {
                          that.onValueChange(newValue, oldValue);
                      }
                      newValue = that.valueProcess(newValue);
                      that.changeToEntity(newValue);
                      if (that._webixConfig.required) {
                          if (that.constructor.name === 'CtlDateRangePicker') {
                              that._showValidate(!this.getValue().end || this.getValue().end.length <= 0, 'requiredValidate');
                          }
                          else {
                              that._showValidate(!this.getValue() || this.getValue().length <= 0, 'requiredValidate');
                          }
                      }
                      YvEventDispatch(that.onChange, that, newValue);
                  },
                  onBlur: function () {
                      if (that.onValidate || that._required) {
                          var result = that._resultToShowOrHide();
                          if (result) {
                              that._showValidateError();
                          }
                          else {
                              that._hideValidateError();
                          }
                      }
                      that._hideTootip();
                      if (that._webixConfig.required) {
                          if (that.constructor.name === 'CtlDateRangePicker') {
                              that._showValidate(!this.getValue().end || this.getValue().end.length <= 0, 'requiredValidate');
                          }
                          else {
                              that._showValidate(!this.getValue() || this.getValue().length <= 0, 'requiredValidate');
                          }
                      }
                      YvEventDispatch(that.onBlur, that, undefined);
                  }
              }
          });
      };
      //是否允许触发 onChange
      CtlInput.prototype.valueValid = function (value) {
          return true;
      };
      //更改 onChange 或实体时的值
      CtlInput.prototype.valueProcess = function (value) {
          return value;
      };
      CtlInput.prototype.onInputEvent = function (event) {
          if (this.onInputValue && typeof this.onInputValue === 'function') {
              this.onInputValue(event.target.value);
          }
          if (this.constructor.name === 'CtlText' &&
              this.maxlength &&
              _.size(event.target.value) > this.maxlength) {
              event.target.value = event.target.value.substring(0, this.maxlength);
          }
          if (this.changeValueImplete) {
              // 改变后立刻提交值
              this.value = event.target.value;
          }
          // @ts-ignore
          YvEventDispatch(this.onInput, this, event);
      };
      Object.defineProperty(CtlInput.prototype, "gravity", {
          get: function () {
              return this._gravity;
          },
          set: function (nv) {
              this._gravity = nv;
              var v;
              if (!nv) {
                  v = undefined;
              }
              else {
                  v = _.parseInt(nv);
              }
              if (!this._webix) {
                  if (v) {
                      this._webixConfig.gravity = v;
                  }
                  else {
                      delete this._webixConfig.gravity;
                  }
              }
              else {
                  this._webix.define('gravity', v);
                  this._webix.resize();
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "id", {
          get: function () {
              return this._id;
          },
          set: function (nv) {
              this._id = nv;
              if (!this._webix) {
                  this._webixConfig.id = nv;
              }
              else {
                  // 运行后不允许修改 id
                  console.error('can\'t set "ID" at runtime!');
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._validateResult) {
                  throw new Error('invalidate!');
              }
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "label", {
          // private _maxlength!:number;
          /**
           * 文本描述
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.label = nv;
                  return;
              }
              this._webix.define('label', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "labelAlign", {
          /**
           * 文本对齐方式
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.labelAlign = nv;
                  return;
              }
              this._webix.define('labelAlign', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "required", {
          /**
           * 必填
           */
          set: function (nv) {
              this._required = nv;
              if (!this._webix) {
                  this._webixConfig.required = nv;
                  return;
              }
              this._webixConfig.required = nv;
              this._webix.define('required', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "labelWidth", {
          /**
           * 文本宽度
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.labelWidth = nv;
                  return;
              }
              this._webix.define('labelWidth', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "disabled", {
          /**
           * 禁用
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.disabled = nv;
                  return;
              }
              if (nv) {
                  this._webix.disable();
              }
              else {
                  this._webix.enable();
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "readonly", {
          /**
           * 只读
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.readonly = nv;
                  return;
              }
              this._webix.define('readonly', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "prompt", {
          /**
           * 水印
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.placeholder = nv;
                  return;
              }
              this._webix.define('placeholder', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlInput.prototype, "width", {
          /**
           * 宽度
           */
          set: function (nv) {
              if (nv === 'auto' || typeof nv === 'undefined') {
                  nv = undefined;
              }
              if (!this._webix) {
                  this._webixConfig.width = nv;
                  return;
              }
              this._webix.define('width', nv);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      CtlInput.prototype.onValueChange = function (newV, oldV) {
          //validType[this.validType](newV);
      };
      CtlInput.prototype.onInputValue = function (value) {
          if (this.onValidate && typeof this.onValidate === 'function') {
              this._validateResult = YvEventDispatch(this.onValidate, this, value);
          }
      };
      CtlInput.prototype._addEnvent = function (input) {
          input.context.addEventListener('mouseenter', this.anonymous_showTootip);
          input.context.addEventListener('mouseleave', this.anonymous_hideTootip);
      };
      CtlInput.prototype._removeEnvent = function (input) {
          input.context.removeEventListener('mouseenter', this.anonymous_showTootip);
          input.context.removeEventListener('mouseleave', this.anonymous_hideTootip);
      };
      CtlInput.prototype._showValidateError = function () {
          $(this._webix.$view).addClass('yvan-validate-error');
      };
      CtlInput.prototype._hideValidateError = function () {
          $(this._webix.$view).removeClass('yvan-validate-error');
      };
      CtlInput.prototype._showTootip = function (msg) {
          showTooltip(this, msg);
      };
      CtlInput.prototype._hideTootip = function () {
          hideTooltip(this);
      };
      CtlInput.prototype._resultToShowOrHide = function () {
          if (!this.value) {
              if (this._required) {
                  return "该项为必填项";
              }
          }
          else {
              // 只有校验值
              var that = this;
              var result = YvEventDispatch(this.onValidate, that, this.value);
              if (result) {
                  return result;
              }
          }
          return null;
      };
      CtlInput.prototype._showValidate = function (msg, type) {
          var $input;
          if (this.constructor.name === 'CtlText' ||
              this.constructor.name === 'CtlSearch' ||
              this.constructor.name === 'CtlCombo') {
              $input = $(this._webix.$view).find('input');
          }
          else if (this.constructor.name === 'CtlDatePicker' ||
              this.constructor.name === 'CtlDateRangePicker' ||
              this.constructor.name === 'CtlMultiCombo' ||
              this.constructor.name === 'CtlMultiSelect') {
              $input = $(this._webix.$view).find('div.webix_inp_static');
          }
          else if (this.constructor.name === 'CtlSelect') {
              $input = $(this._webix.$view).find('select');
          }
          else {
              return true;
          }
          switch (type) {
              case 'inputValidate': {
                  if (msg) {
                      $input.each(function (index, item) {
                          $(item).css({
                              'background-color': '#ffdedb',
                              'border-color': '#ff8d82'
                          });
                      });
                      $("#" + this.id + "_validate").remove();
                      $(this._webix.$view).append("<div id=\"" + this.id + "_validate\" style=\"position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;\">" + msg + "</div>");
                      return false;
                  }
                  else {
                      $input.each(function (index, item) {
                          $(item).css({
                              'background-color': '',
                              'border-color': ''
                          });
                      });
                      $("#" + this.id + "_validate").remove();
                      return true;
                  }
              }
              case 'changedValidate': {
                  if (msg) {
                      $input.each(function (index, item) {
                          $(item).css({
                              'background-color': '#ffdedb',
                              'border-color': '#ff8d82'
                          });
                      });
                      $("#" + this.id + "_validate").remove();
                      $(this._webix.$view).append("<div id=\"" + this.id + "_validate\" style=\"position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;\">" + msg + "</div>");
                      return false;
                  }
                  else {
                      $input.each(function (index, item) {
                          $(item).css({
                              'background-color': '',
                              'border-color': ''
                          });
                      });
                      $("#" + this.id + "_validate").remove();
                      return true;
                  }
              }
              case 'requiredValidate': {
                  if (msg) {
                      $input.each(function (index, item) {
                          $(item).css({
                              'border-color': '#ff8d82'
                          });
                      });
                      // $(`#${this.id}_validate`).remove();
                      // $(this._webix.$view).append(`<div id="${this.id}_validate" style="position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;">必填项</div>`);
                      return false;
                  }
                  else {
                      $input.each(function (index, item) {
                          $(item).css({
                              'border-color': ''
                          });
                      });
                      // $(`#${this.id}_validate`).remove();
                      return true;
                  }
              }
          }
      };
      return CtlInput;
  }(CtlBase));
  //# sourceMappingURL=CtlInput.js.map

  var CtlText = /** @class */ (function (_super) {
      __extends(CtlText, _super);
      function CtlText() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlText.create = function (module, vjson) {
          var that = new CtlText(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlTextDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['validate']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig);
          return that;
      };
      return CtlText;
  }(CtlInput));
  //# sourceMappingURL=CtlText.js.map

  var CtlCheckBox = /** @class */ (function (_super) {
      __extends(CtlCheckBox, _super);
      function CtlCheckBox() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._labelAtRight = true;
          _this._label = '';
          return _this;
      }
      CtlCheckBox.create = function (module, vjson) {
          var that = new CtlCheckBox(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlCheckboxDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['labelAtRight', 'value']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              view: 'checkbox',
              on: {}
          });
          return that;
      };
      Object.defineProperty(CtlCheckBox.prototype, "labelAtRight", {
          /**
           * label 是否在右边
           */
          get: function () {
              return this._labelAtRight;
          },
          set: function (nv) {
              this._labelAtRight = nv;
              this._refreshLabel();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlCheckBox.prototype, "label", {
          /**
           * label 显示内容
           */
          get: function () {
              return this._label;
          },
          set: function (nv) {
              this._label = nv;
              this._refreshLabel();
          },
          enumerable: true,
          configurable: true
      });
      CtlCheckBox.prototype._refreshLabel = function () {
          var nv = this._label;
          if (!this._webix) {
              if (this._labelAtRight) {
                  this._webixConfig.label = '';
                  this._webixConfig.labelRight = nv;
                  this._webixConfig.labelWidth = 0;
              }
              else {
                  this._webixConfig.label = nv;
                  this._webixConfig.labelRight = '';
              }
          }
          else {
              if (this._labelAtRight) {
                  this._webix.define({
                      label: '',
                      labelRight: nv
                  });
              }
              else {
                  this._webix.define({
                      label: nv,
                      labelRight: ''
                  });
              }
              this._webix.refresh();
          }
      };
      /**
       * 交换状态
       */
      CtlCheckBox.prototype.toggle = function () {
          this._webix.toggle();
      };
      Object.defineProperty(CtlCheckBox.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValueHere(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlCheckBox;
  }(CtlInput));
  //# sourceMappingURL=CtlCheckBox.js.map

  /**
   * 下拉框组件
   */
  var CtlCombo = /** @class */ (function (_super) {
      __extends(CtlCombo, _super);
      function CtlCombo() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlCombo.create = function (module, vjson) {
          var that = new CtlCombo(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlComboDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['options', 'dataSource']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig);
          return that;
      };
      Object.defineProperty(CtlCombo.prototype, "options", {
          /**
           * 修改下拉选项
           */
          set: function (nv) {
              var options = {
                  filter: function (item, filterWord) {
                      if (_.size(filterWord) <= 0) {
                          return true;
                      }
                      var nodePy = getFirstPinyin(item.text).toLowerCase();
                      return (nodePy.indexOf(filterWord.toLowerCase()) >= 0 ||
                          item.text.indexOf(filterWord) >= 0);
                  },
                  body: {
                      template: '#text#',
                      type: {
                          height: 36
                      },
                      data: nv
                  }
              };
              if (!this._webix) {
                  _.merge(this._webixConfig, {
                      view: 'combo',
                      options: options
                  });
                  return;
              }
              this._webix.define('options', options);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取显示的值
       */
      CtlCombo.prototype.getText = function () {
          return this._webix.getText();
      };
      Object.defineProperty(CtlCombo.prototype, "dataReal", {
          /**
           * 下拉选项
           */
          set: function (nv) {
              this.options = nv;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlCombo.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlCombo.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      //重新绑定数据源
      CtlCombo.prototype._rebindDataSource = function () {
          var _this = this;
          if (!this._module) {
              return;
          }
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlCombo.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource ||
              _.isArray(this.dataSource) ||
              _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL') {
              return data;
          }
          var displayField = this.dataSource.displayField || 'text';
          var valueField = this.dataSource.valueField || 'id';
          return _.map(data, function (item) {
              return {
                  id: item[valueField],
                  text: item[displayField]
              };
          });
      };
      //刷新状态时，自动重绑数据源
      CtlCombo.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      return CtlCombo;
  }(CtlInput));
  //# sourceMappingURL=CtlCombo.js.map

  var CtlDatePicker = /** @class */ (function (_super) {
      __extends(CtlDatePicker, _super);
      function CtlDatePicker() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlDatePicker.create = function (module, vjson) {
          var that = new CtlDatePicker(vjson);
          that._module = module;
          var baseConfig = {};
          if (vjson.view === 'datetime') {
              // 日期+时间输入
              baseConfig.format = '%Y-%m-%d %H:%i:%s';
              baseConfig.timepicker = true;
              _.defaultsDeep(vjson, CtlDateTimeDefault);
          }
          else {
              // 日期输入
              baseConfig.format = '%Y-%m-%d';
              baseConfig.timepicker = false;
              _.defaultsDeep(vjson, CtlDateDefault);
          }
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, []);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig, __assign(__assign({ editable: true, stringResult: true, view: 'datepicker' }, baseConfig), { on: {} }));
          return that;
      };
      Object.defineProperty(CtlDatePicker.prototype, "value", {
          /**
           * 获取值(可能取到空值)
           */
          get: function () {
              var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
              if (this.vjson.view === 'datetime') {
                  // 日期+时间输入
                  return _.toString(value).substr(0, 19);
              }
              else {
                  // 日期输入
                  return _.toString(value).substr(0, 10);
              }
          },
          /*============================ 公共属性部分 ============================*/
          /**
           * 设置值 (如果不符合规定的格式 会清空)
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      /*============================ 私有部分 ============================*/
      //更改 onChange 或实体时的值
      CtlDatePicker.prototype.valueProcess = function (value) {
          var moment = _.get(window, 'moment');
          if (_.isDate(value)) {
              value = moment(value);
              if (this.vjson.view === 'datetime') {
                  // 日期+时间输入
                  value = value.isValid() ? value.format('YYYY-MM-DD HH:mm:ss') : '';
              }
              else {
                  // 日期输入
                  value = value.isValid() ? value.format('YYYY-MM-DD') : '';
              }
              return value;
          }
          return value;
      };
      return CtlDatePicker;
  }(CtlInput));
  //# sourceMappingURL=CtlDatePicker.js.map

  var CtlDateRangePicker = /** @class */ (function (_super) {
      __extends(CtlDateRangePicker, _super);
      function CtlDateRangePicker() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /*============================ 公共部分 ============================*/
          _this.entityNameStart = '';
          _this.entityNameEnd = '';
          return _this;
      }
      CtlDateRangePicker.create = function (module, vjson) {
          var that = new CtlDateRangePicker(vjson);
          that._module = module;
          var baseConfig = {};
          if (vjson.view === 'datetimerange') {
              // 日期+时间输入
              baseConfig.format = '%Y-%m-%d %H:%i:%s';
              baseConfig.timepicker = true;
              _.defaultsDeep(vjson, CtlDateTimeRangeDefault);
          }
          else {
              // 日期输入
              baseConfig.format = '%Y-%m-%d';
              baseConfig.timepicker = false;
              _.defaultsDeep(vjson, CtlDateRangeDefault);
          }
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'value',
              'separator',
              'entityNameStart',
              'entityNameEnd'
          ]);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig, __assign(__assign({ editable: true, stringResult: true, view: 'daterangepicker' }, baseConfig), { on: {} }));
          return that;
      };
      Object.defineProperty(CtlDateRangePicker.prototype, "separator", {
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.separator;
              }
              return this._webix.config['separator'];
          },
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.separator = nv;
              }
              else {
                  this._webix.define('separator', nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlDateRangePicker.prototype, "value", {
          /**
           * 获取值(可能取到空值)
           */
          get: function () {
              var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
              if (!value) {
                  return '';
              }
              var start = value.start, end = value.end;
              return start + this.separator + end;
          },
          /**
           * 设置值 (如果不符合规定的格式 会清空)
           */
          set: function (nv) {
              if (!this._webix) {
                  if (typeof nv === 'string') {
                      var _a = nv.split(this.separator), start = _a[0], end = _a[1];
                      this._webixConfig.value = { start: start, end: end };
                  }
                  else {
                      this._webixConfig.value = nv;
                  }
              }
              else {
                  var value = nv;
                  if (typeof nv === 'string') {
                      var _b = nv.split(this.separator), start = _b[0], end = _b[1];
                      value = { start: start, end: end };
                  }
                  this._webix.setValue(value);
              }
          },
          enumerable: true,
          configurable: true
      });
      /*============================ 私有部分 ============================*/
      //是否允许触发 onChange
      CtlDateRangePicker.prototype.valueValid = function (value) {
          var moment = _.get(window, 'moment');
          if (_.isPlainObject(value)) {
              var start = value.start, end = value.end;
              if (!moment(start).isValid() || !moment(end).isValid()) {
                  return true;
              }
          }
          return true;
      };
      //更改 onChange 或实体时的值
      CtlDateRangePicker.prototype.valueProcess = function (value) {
          var moment = _.get(window, 'moment');
          if (_.isPlainObject(value)) {
              var start = value.start, end = value.end;
              start = moment(start);
              end = moment(end);
              if (this.vjson.view === 'datetimerange') {
                  // 日期+时间输入
                  start = start.isValid() ? start.format('YYYY-MM-DD HH:mm:ss') : '';
                  end = end.isValid() ? end.format('YYYY-MM-DD HH:mm:ss') : '';
              }
              else {
                  // 日期输入
                  start = start.isValid() ? start.format('YYYY-MM-DD') : '';
                  end = end.isValid() ? end.format('YYYY-MM-DD') : '';
              }
              if (this.entityNameStart) {
                  // 带 entityNameStart 实体绑定
                  _.set(this._module, this.entityNameStart, start);
              }
              if (this.entityNameEnd) {
                  // 带 entityNameEnd 实体绑定
                  _.set(this._module, this.entityNameEnd, end);
              }
              return start + this.separator + end;
          }
          return value;
      };
      return CtlDateRangePicker;
  }(CtlInput));
  //# sourceMappingURL=CtlDateRangePicker.js.map

  var CtlForm = /** @class */ (function (_super) {
      __extends(CtlForm, _super);
      function CtlForm() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlForm.create = function (module, vjson) {
          var that = new CtlForm(vjson);
          that._module = module;
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
          var yvanProp = parseYvanPropChangeVJson(vjson, []);
          // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 yvanProxy 版的 _webix 合并至 webixProp, 最终合并至 vjson
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  // onAfterLoad: function (this: any) {
                  //   that.attachHandle(this)
                  // },
                  // onBeforeLoad: function (this: any) {
                  //   that.attachHandle(this)
                  // },
                  // onChange: function (this: any) {
                  //   that.attachHandle(this)
                  // },
                  // onViewShow: function (this: any) {
                  //   that.attachHandle(this)
                  // },
                  onDestruct: function () {
                      that.removeHandle();
                  }
              }
          });
          return that;
      };
      CtlForm.prototype.setValues = function (data) {
          this._webix.setValues(data);
      };
      return CtlForm;
  }(CtlBase));
  //# sourceMappingURL=CtlForm.js.map

  var CtlMultiCombo = /** @class */ (function (_super) {
      __extends(CtlMultiCombo, _super);
      function CtlMultiCombo() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlMultiCombo.create = function (module, vjson) {
          var that = new CtlMultiCombo(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlMultiComboDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['options']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig);
          return that;
      };
      Object.defineProperty(CtlMultiCombo.prototype, "options", {
          /**
           * 修改下拉选项
           */
          set: function (nv) {
              var options = {
                  filter: function (item, filterWord) {
                      if (_.size(filterWord) <= 0) {
                          return true;
                      }
                      var nodePy = getFirstPinyin(item.text).toLowerCase();
                      return (nodePy.indexOf(filterWord.toLowerCase()) >= 0 ||
                          item.text.indexOf(filterWord) >= 0);
                  },
                  body: {
                      template: '#text#',
                      type: {
                          height: 36
                      },
                      data: nv
                  }
              };
              if (!this._webix) {
                  _.merge(this._webixConfig, {
                      view: 'multicombo',
                      options: options
                  });
                  return;
              }
              this._webix.define('options', options);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlMultiCombo.prototype, "dataReal", {
          /**
           * 修改下拉选项
           */
          set: function (nv) {
              this.options = nv;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlMultiCombo.prototype, "separator", {
          /**
           * 值分隔符
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.separator;
              }
              return this._webix.config['separator'];
          },
          /**
           * 值分隔符
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.separator = nv;
              }
              else {
                  this._webix.define('separator', nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlMultiCombo.prototype, "value", {
          /**
           * 获取值(可能取到空值)
           */
          get: function () {
              return this._webix.getValue();
          },
          /**
           * 设置值 (如果不符合规定的格式 会清空)
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlMultiCombo;
  }(CtlInput));
  //# sourceMappingURL=CtlMultiCombo.js.map

  var CtlSearch = /** @class */ (function (_super) {
      __extends(CtlSearch, _super);
      function CtlSearch() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /*============================ 私有部分 ============================*/
          // 编辑值
          _this.valueEdit = undefined;
          // 是否设置真实值
          _this.supportChangeValue = false;
          // 真实值
          _this.valueReal = undefined;
          return _this;
      }
      CtlSearch.create = function (module, vjson) {
          var that = new CtlSearch(vjson);
          that._module = module;
          var vvjson = _.cloneDeep(vjson);
          _.defaultsDeep(vjson, CtlSearchDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['widget', 'value']);
          // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
          that._webixConfig = vjson;
          if (!vjson.id) {
              that.id = _.uniqueId('input_');
          }
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, vvjson);
                      that._refreshIcon();
                  },
                  // onAfterRender(this: any) {
                  //     const $dom: any = $(this.$view);
                  //     $dom.on('keydown', (event: KeyboardEvent) => {
                  //         if (event.keyCode === 13) {
                  //             // 从键盘响应查询
                  //             event.stopPropagation();
                  //             event.preventDefault();
                  //
                  //             that.suppressRestore = true;
                  //             that._searchRequest(that._webix.getValue(), that.valueOrigin);
                  //             return;
                  //         }
                  //
                  //         YvEventDispatch(this.onKeydown, this, event);
                  //     });
                  // },
                  onEnter: function () {
                      // 从键盘响应查询
                      that._searchRequest(that._webix.getValue(), that.valueEdit);
                  },
                  onFocus: function () {
                      //进入焦点时，用户输入的值既为有效值
                      that.valueReal = that._webix.getValue();
                      YvEventDispatch(that.onFocus, that, undefined);
                  },
                  onBlur: function () {
                      if (that.onValidate || that._required) {
                          var result = that._resultToShowOrHide();
                          if (result) {
                              that._showValidateError();
                          }
                          else {
                              that._hideValidateError();
                          }
                      }
                      that._hideTootip();
                      //离开焦点时，用户输入的置为无效
                      that._webix.setValue(that.valueReal);
                      YvEventDispatch(that.onBlur, that, undefined);
                  },
                  // onDestruct(this: any) {
                  //     const $dom: any = $(this.$view);
                  //     $dom.off('keydown');
                  // },
                  onSearchIconClick: function (e) {
                      // 从鼠标响应查询
                      e.stopPropagation();
                      e.preventDefault();
                      var $span = $(e.target);
                      if ($span.hasClass('wxi-close')) {
                          // 清空
                          that.clear();
                      }
                      else {
                          // 查询
                          that._searchRequest(that._webix.getValue(), that.valueEdit);
                      }
                  }
              }
          });
          return that;
      };
      /**
       * 清空值
       */
      CtlSearch.prototype.clear = function () {
          var _this = this;
          if (!this.widget) {
              return;
          }
          this.supportChangeValue = true;
          // 发出 onClear 事件，如果事件返回 true，代表不用再清空
          var hasHandle = YvEventDispatch(this.widget.onClear, this, undefined);
          if (!hasHandle) {
              //清空
              _.forOwn(this.widget.bind, function (value, key) {
                  _.set(_this._module, key, '');
              });
          }
      };
      Object.defineProperty(CtlSearch.prototype, "value", {
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this.valueReal;
          },
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
                  this.valueEdit = nv;
              }
              if (this.supportChangeValue) {
                  this.valueReal = nv;
                  this.supportChangeValue = false;
              }
              YvEventDispatch(this.onChange, this, nv);
              this._refreshIcon();
          },
          enumerable: true,
          configurable: true
      });
      CtlSearch.prototype._refreshIcon = function () {
          var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
          var icon = value ? 'wxi-close' : 'wxi-search';
          var $span = this._webix ? $(this._webix.$view).find('span') : undefined;
          if (!$span || $span.length <= 0) {
              if (this._webix) {
                  this._webix.define('icon', icon);
              }
              else {
                  this._webixConfig.icon = icon;
              }
          }
          else {
              $span
                  .removeClass('wxi-close')
                  .removeClass('wxi-search')
                  .addClass(icon);
          }
      };
      /**
       * 进入查询框
       */
      CtlSearch.prototype._searchRequest = function (queryValue, restoreValue) {
          var _this = this;
          queryValue = _.toString(queryValue);
          var searchCtl = this;
          if (!searchCtl.widget) {
              console.error('没有设置 widget 属性');
              return;
          }
          var widgetParamter = {
              query: queryValue,
              params: searchCtl.widget.params
          };
          //构造查询的对象
          //从 bind 获取
          var queryObj = {};
          _.forOwn(searchCtl.widget.bind, function (value, key) {
              _.set(queryObj, value, _.get(_this._module, key));
          });
          widgetParamter.existObject = queryObj;
          widgetParamter.onWidgetConfirm = function (data) {
              if (!searchCtl.widget) {
                  console.error('没有设置 widget 属性');
                  return;
              }
              searchCtl.supportChangeValue = true;
              YvEventDispatch(searchCtl.widget.onConfirm, searchCtl, undefined);
              //写回
              _.forOwn(searchCtl.widget.bind, function (value, key) {
                  if (_.has(data, value)) {
                      _.set(searchCtl._module, key, _.get(data, value));
                  }
              });
              this.closeDialog();
              searchCtl.focus();
          };
          widgetParamter.onClose = function () {
              //弹窗关闭后恢复原值，并开启还原
              searchCtl.value = restoreValue;
              searchCtl.supportChangeValue = false;
              searchCtl.focus();
          };
          var dlg = new searchCtl.widget.content();
          dlg.showDialog(widgetParamter, searchCtl._module, true);
          // YvanUI.showDialogWidget(this, new searchCtl.widget.content(), widgetParamter);
      };
      return CtlSearch;
  }(CtlInput));
  //# sourceMappingURL=CtlSearch.js.map

  var CtlCarousel = /** @class */ (function (_super) {
      __extends(CtlCarousel, _super);
      function CtlCarousel() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlCarousel.create = function (module, vjson) {
          var that = new CtlCarousel(vjson);
          that._module = module;
          var yvanProp = parseYvanPropChangeVJson(vjson, ['onShow']);
          // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onDestruct: function () {
                      that.removeHandle();
                  },
                  onShow: function () {
                      var value = this.getActiveIndex();
                      YvEventDispatch(that.onShow, that, value);
                  }
              }
          });
          return that;
      };
      return CtlCarousel;
  }(CtlBase));
  //# sourceMappingURL=CtlCarousel.js.map

  var CtlGridLocale = {
      rownumber: " ",
      page: "页",
      more: "更多",
      to: "到",
      of: "of",
      next: "下一页",
      last: "上一页",
      first: "首页",
      previous: "上一页",
      loadingOoo: "<i class=\"fa fa-spinner fa-pulse\"></i>",
      selectAll: "查询全部",
      searchOoo: "查询...",
      blanks: "空白",
      filterOoo: "过滤...",
      applyFilter: "确定",
      clearFilter: "清空",
      equals: "相等",
      notEqual: "不相等",
      lessThan: "小于",
      greaterThan: "大于",
      lessThanOrEqual: "小于等于",
      greaterThanOrEqual: "大于等于",
      inRange: "范围查询",
      contains: "包含",
      notContains: "不包含",
      startsWith: "开始于",
      endsWith: "结束于",
      group: "组",
      columns: "列",
      filters: "筛选",
      rowGroupColumns: "laPivot Cols",
      rowGroupColumnsEmptyMessage: "la drag cols to group",
      valueColumns: "laValue Cols",
      pivotMode: "laPivot-Mode",
      groups: "laGroups",
      values: "值",
      pivots: "laPivots",
      valueColumnsEmptyMessage: "la drag cols to aggregate",
      pivotColumnsEmptyMessage: "la drag here to pivot",
      toolPanelButton: "la tool panel",
      noRowsToShow: "数据为空",
      pinColumn: "laPin Column",
      valueAggregation: "laValue Agg",
      autosizeThiscolumn: "laAutosize Diz",
      autosizeAllColumns: "laAutsoie em All",
      groupBy: "排序",
      ungroupBy: "不排序",
      resetColumns: "重置列",
      expandAll: "展开全部",
      collapseAll: "关闭",
      toolPanel: "工具面板",
      export: "导出",
      csvExport: "导出为CSV格式文件",
      excelExport: "导出到Excel",
      pinLeft: "laPin &lt;&lt;",
      pinRight: "laPin &gt;&gt;",
      noPin: "laDontPin &lt;&gt;",
      sum: "总数",
      min: "最小值",
      max: "最大值",
      none: "无",
      count: "总",
      average: "平均值",
      copy: "复制",
      copyWithHeaders: "携带表头复制",
      ctrlC: "ctrl + C",
      paste: "粘贴",
      ctrlV: "ctrl + V"
  };
  //# sourceMappingURL=CtlGridLocale.js.map

  var CtlGridPage = /** @class */ (function () {
      function CtlGridPage(grid) {
          this._currentPage = 1;
          this._pageSize = 100;
          this._pageCount = 0;
          this._itemCount = 0;
          this.grid = grid;
          this._pageSize = this.grid.pageSize;
          /** 找到aggrid 自带的pageview 替换子dom节点 **/
          var dom = this.grid.webix.$view.getElementsByClassName('ag-paging-panel ag-unselectable');
          var su_id = this.grid.webix.config.id;
          if (dom.length <= 0) {
              return;
          }
          /** 显示底部分页栏 **/
          dom[0].className = 'ag-paging-panel ag-unselectable';
          dom[0].innerHTML =
              '<div id="wwww" role="group">' +
                  '    <table class="ui-pg-table" style="width:100%;table-layout:fixed;height:100%;">' +
                  '        <tbody><tr>' +
                  '            <td id="gridpager_left_' +
                  su_id +
                  '" style="display: none"></td>' +
                  '            <td id="gridpager_center_' +
                  su_id +
                  '">' +
                  '                <table style="table-layout:auto;white-space: pre;margin-left:0;margin-right:auto;">' +
                  '                    <tbody><tr>' +
                  '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="First Page" style="cursor: default;"><span id="first_' +
                  su_id +
                  '" class="ctl-grid-page ui-icon fa fa-angle-double-left"></span></td>' +
                  '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Previous Page" style="cursor: default;"><span id="prev_' +
                  su_id +
                  '" class="ctl-grid-page ui-icon fa fa-angle-left"></span></td>' +
                  '                        <td><span style="color: #c0c0c0">|</span></td>\n' +
                  '                        <td dir="ltr"><input aria-label="Page No." id="currenpage_' +
                  su_id +
                  '" type="text" size="2" maxlength="7" value="0"> 共 <span id="gridpager_' +
                  su_id +
                  '">219</span> 页 </td>' +
                  '                        <td><span style="color: #c0c0c0">|</span></td>\n' +
                  '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Next Page" style="cursor: default;"><span id="next_' +
                  su_id +
                  '" class="ctl-grid-page ui-icon fa fa-angle-right"></span></td>' +
                  '                        <td role="button" tabindex="0" class="ctl-grid-page ui-pg-button" title="Last Page" style="cursor: default;"><span id="last_' +
                  su_id +
                  '" class="ctl-grid-page ui-icon fa fa-angle-double-right"></span></td>' +
                  '                        <td dir="ltr"><select id="pagesize_' +
                  su_id +
                  '" title="Records per Page"><option value="20" selected="selected">20</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select></td>' +
                  '                    </tr></tbody>' +
                  '                </table>' +
                  '            </td>' +
                  '            <td id="gridpager_right_' +
                  su_id +
                  '" style="text-align:right;">' +
                  '               <span dir="ltr" style="text-align:right" id="itemcount_' +
                  su_id +
                  '">41 - 60　共 4,367 条</span>' +
                  '            </td>' +
                  '        </tr></tbody>' +
                  '    </table>' +
                  '</div>';
          this.firstButtomDom = document.getElementById('first_' + su_id);
          this.prevButtomDom = document.getElementById('prev_' + su_id);
          this.nextButtomDom = document.getElementById('next_' + su_id);
          this.lastButtomDom = document.getElementById('last_' + su_id);
          this.currenpageDom = document.getElementById('currenpage_' + su_id);
          this.gridpagerDom = document.getElementById('gridpager_' + su_id);
          this.itemcountDom = document.getElementById('itemcount_' + su_id);
          this.pageSizeDom = document.getElementById('pagesize_' + su_id);
          this.gridpagerCenter = document.getElementById('gridpager_center_' + su_id);
          this.gridpagerLeft = document.getElementById('gridpager_left_' + su_id);
          this.gridpagerRight = document.getElementById('gridpager_right_' + su_id);
          if (this.grid.pagination) {
              this.gridpagerCenter.style.display = '';
          }
          else {
              this.gridpagerCenter.style.display = 'none';
          }
          this.refreshPageViewInfo();
          var me = this;
          this.currenpageDom.onkeydown = function (event) {
              if (event.keyCode === 13) {
                  // enter键
                  var cp = parseInt(event.srcElement.value);
                  if (cp > me.pageCount) {
                      cp = me.pageCount;
                  }
                  if (cp <= 0) {
                      cp = 1;
                  }
                  me.grid.refreshMode = exports.GridRefreshMode.refreshWithFilter;
                  me.getPageData(cp, me.pageSize);
              }
              else {
                  if (event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) {
                      return false;
                  }
              }
          };
          this.pageSizeDom.onchange = function (v) {
              me.pageSize = v.srcElement.value;
              me.grid.paginationSetPageSize(me.pageSize);
              if (typeof me.getPageData === 'function') {
                  me.grid.refreshMode = exports.GridRefreshMode.refreshWithFilter;
                  me.getPageData(1, me.pageSize);
              }
          };
          var buttons = dom[0].getElementsByClassName('ctl-grid-page ui-icon');
          var buttons1 = dom[0].getElementsByClassName('ctl-grid-page ui-icon-disable');
          buttons = _.union(buttons, buttons1);
          _.each(buttons, function (button) {
              button.onclick = function (q) {
                  for (var i = 0; i < q.srcElement.classList.length; i++) {
                      if (q.srcElement.classList[i] === 'ui-icon-disable') {
                          return;
                      }
                  }
                  var pre = _.split(q.srcElement.id, '_' + me.grid.webix.config.id);
                  var cp = me.currentPage;
                  switch (pre[0]) {
                      case 'first': {
                          cp = 1;
                          break;
                      }
                      case 'prev': {
                          if (cp > 1) {
                              cp -= 1;
                          }
                          break;
                      }
                      case 'next': {
                          if (cp < me.pageCount) {
                              cp += 1;
                          }
                          break;
                      }
                      case 'last': {
                          cp = me.pageCount;
                          me.disableButton(q.srcElement);
                          break;
                      }
                  }
                  if (typeof me.getPageData === 'function') {
                      me.grid.refreshMode = exports.GridRefreshMode.refreshWithFilter;
                      me.getPageData(cp, me.pageSize);
                  }
              };
          });
      }
      Object.defineProperty(CtlGridPage.prototype, "currentPage", {
          get: function () {
              return this._currentPage;
          },
          set: function (cp) {
              this._currentPage = cp;
              if (this._currentPage > this._pageCount) {
                  this._currentPage = this._pageCount;
              }
              if (this._currentPage <= 0 && this._pageCount > 0) {
                  this._currentPage = 1;
              }
              this.refreshPageViewInfo();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlGridPage.prototype, "pageSize", {
          get: function () {
              return this._pageSize;
          },
          set: function (ps) {
              if (ps <= 0) {
                  return;
              }
              this._pageSize = ps;
              this.refreshPageViewInfo();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlGridPage.prototype, "pageCount", {
          get: function () {
              return this._pageCount;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlGridPage.prototype, "itemCount", {
          get: function () {
              return this._itemCount;
          },
          set: function (ic) {
              this._itemCount = ic;
              this.refreshPageViewInfo();
          },
          enumerable: true,
          configurable: true
      });
      CtlGridPage.prototype.refreshGrid = function () {
          this.getPageData(1, this.pageSize);
      };
      CtlGridPage.prototype.disableButton = function (element) {
          if (element.className.includes('ui-icon-disable')) {
              return;
          }
          element.className = _.replace(element.className, 'ui-icon', 'ui-icon-disable');
      };
      CtlGridPage.prototype.activeButton = function (element) {
          if (!element.className.includes('ui-icon-disable') &&
              element.className.includes('ui-icon')) {
              return;
          }
          element.className = _.replace(element.className, 'ui-icon-disable', 'ui-icon');
      };
      CtlGridPage.prototype.refreshPageViewInfo = function () {
          if (this.grid.pagination) {
              if (this._itemCount > 0 && this._pageSize > 0) {
                  this._pageCount = Math.ceil(this._itemCount / this._pageSize);
              }
              this.pageSizeDom.value = this._pageSize;
              this.currenpageDom.value = this._currentPage;
              this.gridpagerDom.innerText = this._pageCount;
              if (this.currentPage <= 0) {
                  this.itemcountDom.innerText = '0 - 0　共 0 条';
              }
              else {
                  var min = (this.currentPage - 1) * this.pageSize + 1;
                  var max = this.currentPage * this.pageSize;
                  if (min > this._itemCount) {
                      min = this._itemCount;
                  }
                  if (max > this._itemCount) {
                      max = this._itemCount;
                  }
                  this.itemcountDom.innerText =
                      min + ' - ' + max + '  共 ' + this.itemCount + ' 条';
              }
              if (this.currentPage > 1) {
                  this.activeButton(this.firstButtomDom);
                  this.activeButton(this.prevButtomDom);
              }
              else {
                  this.disableButton(this.firstButtomDom);
                  this.disableButton(this.prevButtomDom);
              }
              if (this.currentPage < this.pageCount) {
                  this.activeButton(this.nextButtomDom);
                  this.activeButton(this.lastButtomDom);
              }
              else {
                  this.disableButton(this.nextButtomDom);
                  this.disableButton(this.lastButtomDom);
              }
          }
          else {
              this.itemcountDom.innerText = '共 ' + this.itemCount + ' 条';
          }
      };
      return CtlGridPage;
  }());
  //# sourceMappingURL=CtlGridPage.js.map

  function CtlGridIdRender (params, grid) {
      if (params.node.cstate) {
          if (params.node.cstate === 'validate' || params.node.cstate === 'pending') {
              return '<i class="fa fa-spinner fa-spin"></i>';
          }
          if (params.node.cstate === 'editing') {
              return '<i class="fa fa-edit"></i>';
          }
          if (params.node.cstate === 'ok') {
              return '<i class="fa fa-check" style="color: green;"></i>';
          }
          if (params.node.cstate === 'error') {
              return '<i class="fa fa-exclamation-circle" style="color: red;"></i>';
          }
      }
      if (params.node.rowPinned === 'top') {
          return '+';
      }
      if (_.size(params.data) <= 0) {
          //数据还没刷出来
          return '<i class="fa fa-spinner fa-spin"></i>';
      }
      if (grid && grid.pagination && grid.gridPage) {
          return 1 + params.node.rowIndex + grid.gridPage.pageSize * (grid.gridPage.currentPage - 1);
      }
      return 1 + params.node.rowIndex;
  }
  //# sourceMappingURL=CtlGridIdRender.js.map

  var YvGridProp = {
      editable: false,
      checkbox: false,
      editSingleClick: true,
      allowNewRow: true,
      filterable: true,
      loading: false,
      showRowNumber: true,
      autoSizeColumns: false,
      allowCellSelection: false,
      allowRowSelection: true,
      idField: undefined,
      valueSep: true,
      saveOn: 'rowChanged',
      newRowData: undefined,
      stopEditingWhenGridLosesFocus: false,
      columns: [],
      columnGroup: [],
      data: undefined
  };
  var YvGridColumnProp = {
      hidden: false,
      field: '',
      title: '',
      width: undefined,
      maxwidth: 800,
      minwidth: 0,
      sortable: false,
      resizable: true,
      editable: false,
      filterable: false,
      calcExpr: undefined,
      editMode: 'text'
  };
  var YvGridColumnEditProp = {
      widget: undefined,
      bind: [],
      on: true,
      off: false,
      precision: 0,
      idField: 'id',
      textField: 'text',
      maxlength: undefined,
      dateformat: 'yyyy-MM-dd',
      datetimeformat: 'yyyy-MM-dd HH:mm:ss',
      data: []
  };
  //# sourceMappingURL=CtlGridDefault.js.map

  var CtlGridCellCheckbox = /** @class */ (function () {
      function CtlGridCellCheckbox() {
      }
      CtlGridCellCheckbox.prototype.checkedToggle = function (vue, childSpan, id) {
          return function () {
              if (childSpan.classList.contains('checked')) {
                  var index = vue.checkedIds.indexOf(id);
                  if (index >= 0) {
                      vue.checkedIds.splice(index, 1);
                  }
                  childSpan.classList.remove('checked');
              }
              else {
                  vue.checkedIds.push(id);
                  childSpan.classList.add('checked');
              }
              // 观测，是否显示"全选"框的函数
              if (vue.allCheckedBoxStateChanged) {
                  vue.allCheckedBoxStateChanged();
              }
          };
      };
      CtlGridCellCheckbox.prototype.innerRefresh = function (gridOptions) {
          var vue = gridOptions.api.vue;
          var data = gridOptions.data;
          var id = vue._getIdByRow(data);
          var childSpan = this.$el.querySelectorAll('.yvan-checkbox-switch')[0];
          if (!childSpan) {
              return;
          }
          if (gridOptions.isCheckedIds) {
              //用来做勾选数据行用 checkedIds
              if (vue.checkedIds.indexOf(id) >= 0) {
                  childSpan.classList.add('checked');
              }
              else {
                  childSpan.classList.remove('checked');
              }
              // 观测，是否显示"全选"框的函数
              if (vue.allCheckedBoxStateChanged) {
                  vue.allCheckedBoxStateChanged();
              }
          }
          else {
              //用来做数据展示用
              childSpan.classList.add('disabled');
              if (typeof gridOptions.on === 'string') {
                  //on 是个字符串
                  if (gridOptions.on === '' + gridOptions.value) {
                      childSpan.classList.add('checked');
                  }
              }
              else if (typeof gridOptions.on === 'function') {
                  //on 是个函数
                  if (gridOptions.on.call(vue, gridOptions.value, data)) {
                      childSpan.classList.add('checked');
                  }
              }
          }
      };
      CtlGridCellCheckbox.prototype.init = function (gridOptions) {
          this.$el = document.createElement('div');
          if (gridOptions.node.rowPinned) {
              //这是在添加行或结尾行的数据，不用任何展示
              return;
          }
          this.$el.classList.add('yvan-checkbox');
          this.$el.innerHTML =
              '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>';
          this.innerRefresh(gridOptions);
          var vue = gridOptions.api.vue;
          var childSpan = this.$el.querySelectorAll('.yvan-checkbox-switch')[0];
          var data = gridOptions.data;
          var id = vue._getIdByRow(data);
          this.$el.addEventListener('click', this.checkedToggle(vue, childSpan, id));
      };
      CtlGridCellCheckbox.prototype.getGui = function () {
          return this.$el;
      };
      CtlGridCellCheckbox.prototype.destroy = function () {
      };
      CtlGridCellCheckbox.prototype.refresh = function (gridOptions) {
          this.innerRefresh(gridOptions);
      };
      return CtlGridCellCheckbox;
  }());
  //# sourceMappingURL=CtlGridCellCheckbox.js.map

  var CtlGridHeadCheckbox = /** @class */ (function () {
      function CtlGridHeadCheckbox() {
      }
      CtlGridHeadCheckbox.prototype.checkedToggle = function (ctlGrid, gridOptions) {
          var that = this;
          return function () {
              if (ctlGrid.idField) {
                  var domSpan = $(that.$el).find('.yvan-checkbox-switch');
                  var isChecked = domSpan.is('.checked');
                  // 当前表格的 全部行ID
                  var dataIds = _.map(ctlGrid.getData(), function (v) { return _.get(v, ctlGrid.idField); });
                  if (isChecked) {
                      // 取消全选
                      for (var i = 0; i < dataIds.length; i++) {
                          var id = dataIds[i];
                          var index = ctlGrid.checkedIds.indexOf(id);
                          if (index >= 0) {
                              ctlGrid.checkedIds.splice(index, 1);
                          }
                      }
                  }
                  else {
                      // 全选
                      for (var i = 0; i < dataIds.length; i++) {
                          var id = dataIds[i];
                          if (!_.includes(ctlGrid.checkedIds, id)) {
                              ctlGrid.checkedIds.push(id);
                          }
                      }
                  }
                  // 刷新
                  ctlGrid.gridApi.refreshCells({
                      columns: ['__CB__'],
                      force: true
                  });
              }
          };
      };
      CtlGridHeadCheckbox.prototype.innerRefresh = function (gridOptions) {
          var ctlGrid = gridOptions.api.vue;
          var domSpan = $(this.$el).find('.yvan-checkbox-switch');
          if (ctlGrid.idField) {
              ctlGrid.allCheckedBoxStateChanged = function () {
                  // 当前表格的 全部行ID
                  var dataIds = _.map(ctlGrid.getData(), function (v) { return _.get(v, ctlGrid.idField); });
                  var allIn = true;
                  for (var i = 0; i < dataIds.length; i++) {
                      var id = dataIds[i];
                      if (!_.includes(ctlGrid.checkedIds, id)) {
                          // 不是全部都包含
                          allIn = false;
                          break;
                      }
                  }
                  var isChecked = domSpan.is('.checked');
                  if (isChecked) {
                      if (!allIn) {
                          domSpan.removeClass('checked');
                      }
                  }
                  else {
                      if (allIn) {
                          domSpan.addClass('checked');
                      }
                  }
              };
          }
      };
      CtlGridHeadCheckbox.prototype.init = function (gridOptions) {
          var _this = this;
          this.$el = document.createElement('div');
          this.$el.classList.add('yvan-checkbox');
          this.$el.innerHTML =
              '<span class="yvan-checkbox-switch"><span class="yvan-checkbox-status"></span></span>';
          _.defer(function () {
              var ctlGrid = gridOptions.api.vue;
              _this.$el.addEventListener('click', _this.checkedToggle(ctlGrid, gridOptions));
              _this.innerRefresh(gridOptions);
          });
          // clearInterval(this.intervalHandle)
      };
      CtlGridHeadCheckbox.prototype.getGui = function () {
          return this.$el;
      };
      CtlGridHeadCheckbox.prototype.destroy = function () {
      };
      CtlGridHeadCheckbox.prototype.refresh = function (gridOptions) {
          this.innerRefresh(gridOptions);
      };
      return CtlGridHeadCheckbox;
  }());
  //# sourceMappingURL=CtlGridHeadCheckbox.js.map

  var YvanDataSourceGrid = /** @class */ (function () {
      function YvanDataSourceGrid(ctl, option) {
          var _this = this;
          this.watches = [];
          this.isFirstAutoLoad = true; //是否为第一次自动读取
          this.serverQuery = _$1.debounce(function (option, paramFunction, params) {
              var that = _this;
              var needCount = false;
              if (typeof that.rowCount === 'undefined') {
                  //从来没有统计过 rowCount(记录数)
                  needCount = true;
                  that.lastFilterModel = _$1.cloneDeep(params.filterModel);
                  that.lastSortModel = _$1.cloneDeep(params.sortModel);
              }
              else {
                  if (!_$1.isEqual(that.lastFilterModel, params.filterModel)) {
                      //深度对比，如果 filter 模型更改了，需要重新统计 rowCount(记录数)
                      needCount = true;
                      that.lastFilterModel = _$1.cloneDeep(params.filterModel);
                      that.lastSortModel = _$1.cloneDeep(params.sortModel);
                  }
              }
              // 获取所有参数
              var queryParams = __assign({}, (typeof paramFunction === 'function' ? paramFunction() : undefined));
              var ajaxPromise;
              if (option.type === 'SQL') {
                  var ajaxParam = {
                      params: queryParams,
                      limit: params.endRow - params.startRow,
                      limitOffset: params.startRow,
                      needCount: needCount,
                      sortModel: params.sortModel,
                      filterModel: params.filterModel,
                      sqlId: option.sqlId
                  };
                  var allow = YvEventDispatch(option.onBefore, that.ctl, ajaxParam);
                  if (allow === false) {
                      // 不允许请求
                      return;
                  }
                  ajaxPromise = dbs[option.db].query(ajaxParam);
              }
              else if (option.type === 'Server') {
                  var _a = _$1.split(option.method, '@'), serverUrl = _a[0], method = _a[1];
                  var ajaxParam = {
                      params: queryParams,
                      limit: params.endRow - params.startRow,
                      limitOffset: params.startRow,
                      needCount: needCount,
                      sortModel: params.sortModel,
                      filterModel: params.filterModel,
                  };
                  var allow = YvEventDispatch(option.onBefore, that.ctl, ajaxParam);
                  if (allow === false) {
                      // 不允许请求
                      return;
                  }
                  ajaxPromise = brokerInvoke(getServerPrefix(serverUrl), method, ajaxParam);
              }
              else if (option.type === 'Ajax') {
                  var ajax = _$1.get(window, 'YvanUI.ajax');
                  var ajaxParam = {
                      url: option.url,
                      method: 'POST-JSON',
                      data: {
                          params: queryParams,
                          limit: params.endRow - params.startRow,
                          limitOffset: params.startRow,
                          needCount: needCount,
                          sortModel: params.sortModel,
                          filterModel: params.filterModel,
                      }
                  };
                  var allow = YvEventDispatch(option.onBefore, that.ctl, ajaxParam);
                  if (allow === false) {
                      // 不允许请求
                      return;
                  }
                  ajaxPromise = ajax(ajaxParam);
              }
              else {
                  console.error('unSupport dataSource mode:', option);
                  params.failCallback();
                  return;
              }
              //异步请求数据内容
              that.ctl.loading = true;
              ajaxPromise.then(function (res) {
                  YvEventDispatch(option.onAfter, that.ctl, res);
                  var resultData = res.data, pagination = res.pagination, resParams = res.params;
                  if (needCount) {
                      if (_$1.has(res, 'totalCount')) {
                          // 兼容老模式
                          that.rowCount = _$1.get(res, 'totalCount');
                      }
                      else {
                          that.rowCount = pagination.total;
                      }
                  }
                  params.successCallback(resultData, that.rowCount);
                  /** 如果不分页就在这里设置总条目数量，避免多次刷新分页栏 **/
                  if (!that.ctl.pagination) {
                      that.ctl.gridPage.itemCount = that.rowCount;
                  }
                  that.ctl._bindingComplete();
                  if (that.ctl.entityName) {
                      _$1.set(that.module, that.ctl.entityName + '.selectedRow', that.ctl.getSelectedRow());
                  }
              }).catch(function (r) {
                  params.failCallback();
              }).finally(function () {
                  _this.ctl.loading = false;
              });
          });
          if (isDesignMode()) {
              return;
          }
          this.ctl = ctl;
          this.option = option;
          this.module = ctl._webix.$scope;
          if (!option) {
              //没有设值，退出
              this.reload = undefined;
              return;
          }
          if (_$1.isArray(option)) {
              this.setCodeArrayMode(option);
              return;
          }
          if (typeof option === 'function') {
              //以 function 方式运行
              this.setCustomFunctionMode(option, undefined);
              return;
          }
          // 使 watch 生效
          _$1.forOwn(option.params, function (value) {
              if (!_$1.has(value, '$watch')) {
                  return;
              }
              var watchOption = value;
              _this.module.$watch(watchOption.$watch, function () {
                  if (_this.reload) {
                      _this.reload();
                  }
              });
          });
          // params 函数
          var paramFunction = function () {
              var result = {};
              _$1.forOwn(option.params, function (value, key) {
                  if (_$1.has(value, '$get')) {
                      var getOption = value;
                      result[key] = _$1.get(_this.module, getOption.$get);
                  }
                  else if (_$1.has(value, '$watch')) {
                      var watchOption = value;
                      result[key] = _$1.get(_this.module, watchOption.$watch);
                  }
                  else {
                      result[key] = value;
                  }
              });
              return result;
          };
          if (option.type === 'function') {
              if (typeof option.bind === 'function') {
                  this.setCustomFunctionMode(option.bind, paramFunction);
              }
              else {
                  // 取 bind 函数
                  var bindFunction = _$1.get(this.module, option.bind);
                  if (!bindFunction) {
                      console.error("\u6CA1\u6709\u627E\u5230\u540D\u79F0\u4E3A " + option.bind + " \u7684\u65B9\u6CD5");
                      return;
                  }
                  this.setCustomFunctionMode(bindFunction, paramFunction);
              }
              return;
          }
          if (option.type === 'SQL' || option.type === 'Server' || option.type === 'Ajax') {
              this.setSqlMode(option, paramFunction);
              return;
          }
          console.error("\u5176\u4ED6\u65B9\u5F0F\u6CA1\u6709\u5B9E\u73B0");
      }
      /**
       * SQL取值
       */
      YvanDataSourceGrid.prototype.setSqlMode = function (option, paramFunction) {
          var _this = this;
          var that = this;
          this.reload = function () {
              _this.ctl.loading = true;
              that.clearRowCount();
              if (that.ctl.entityName) {
                  _$1.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
              }
              that.ctl.gridApi.hasDataSource = true;
              if (that.ctl.pagination) {
                  /** 分页模式 **/
                  that.ctl.gridPage.getPageData = function (currentPage, pageSize) {
                      var params = {};
                      params.successCallback = function (data, rowCount) {
                          // if (needClearRefresh) {
                          //   that.ctl.setData(data)
                          // } else {
                          // 不能直接用 setData, 会造成 filter 被置空
                          // 使用 _transactionUpdate 也有 bug ，如果查询条件被改变，也不会分页回顶端
                          that.ctl._transactionUpdate(data);
                          // }
                          // that.ctl.setData(data)
                          that.ctl.gridPage.itemCount = rowCount;
                          that.ctl.gridPage.currentPage = currentPage;
                      };
                      params.failCallback = function () {
                          console.error('error');
                      };
                      params.startRow = (currentPage - 1) * pageSize;
                      params.endRow = currentPage * pageSize;
                      params.filterModel = that.ctl.gridApi.getFilterModel();
                      params.sortModel = that.ctl.gridApi.getSortModel();
                      if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
                          that.rowCount = 0;
                          params.successCallback([], that.rowCount);
                          that.ctl.loading = false;
                          that.isFirstAutoLoad = false;
                      }
                      else {
                          that.serverQuery(option, paramFunction, params);
                      }
                  };
                  that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize);
              }
              else {
                  /** 无限滚动模式 **/
                  that.ctl.gridApi.setDatasource({
                      getRows: function (params) {
                          if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
                              that.rowCount = 0;
                              params.successCallback([], that.rowCount);
                              that.ctl.loading = false;
                              that.isFirstAutoLoad = false;
                              return;
                          }
                          that.serverQuery(option, paramFunction, params);
                      }
                  });
              }
          };
          this.reload();
      };
      /**
       * 自定义函数式取值
       */
      YvanDataSourceGrid.prototype.setCustomFunctionMode = function (option, paramFunction) {
          var that = this;
          this.reload = function () {
              that.clearRowCount();
              if (that.ctl.entityName) {
                  _$1.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
              }
              that.ctl.loading = true;
              // rowModelType = infinite
              that.ctl.gridApi.setDatasource({
                  getRows: function (params) {
                      that.ctl.loading = true;
                      if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
                          that.rowCount = 0;
                          params.successCallback([], that.rowCount);
                          that.ctl.loading = false;
                          that.isFirstAutoLoad = false;
                          return;
                      }
                      option.call(that.module, that.ctl, {
                          param: typeof paramFunction === 'function' ? paramFunction() : undefined,
                          failCallback: function () {
                              params.failCallback();
                          },
                          successCallback: function (data, dataLength) {
                              params.successCallback(data, dataLength);
                              that.ctl.loading = false;
                              that.ctl.gridPage.itemCount = dataLength;
                              that.ctl._bindingComplete();
                              if (that.ctl.entityName) {
                                  _$1.set(that.module, that.ctl.entityName + '.selectedRow', that.ctl.getSelectedRow());
                              }
                          }
                      });
                  }
              });
          };
          this.reload();
      };
      YvanDataSourceGrid.prototype.setCodeArrayMode = function (option) {
          var _this = this;
          var that = this;
          var rowCount = option.length;
          this.reload = function () {
              _this.ctl.loading = true;
              that.clearRowCount();
              if (that.ctl.entityName) {
                  _$1.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
              }
              that.ctl.gridApi.hasDataSource = true;
              if (that.ctl.pagination) {
                  /** 分页模式 **/
                  that.ctl.gridPage.getPageData = function (currentPage, pageSize) {
                      var d = [];
                      var startRow = (currentPage - 1) * pageSize;
                      var endRow = currentPage * pageSize;
                      endRow = endRow > rowCount ? rowCount : endRow;
                      for (var i = startRow; i < endRow; i++) {
                          d.push(option[i]);
                      }
                      that.ctl.setData(d);
                      that.ctl.gridPage.itemCount = rowCount;
                      that.ctl.gridPage.currentPage = currentPage;
                  };
                  that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize);
              }
              else {
                  /** 不分页模式 **/
                  that.ctl.setData(option);
                  that.ctl.gridPage.itemCount = rowCount;
              }
          };
          this.reload();
      };
      /**
       * 释放与 YvGrid 的绑定
       */
      YvanDataSourceGrid.prototype.destory = function () {
          // 解除全部 watch
          _$1.each(this.watches, function (unwatch) {
              unwatch();
          });
          this.reload = undefined;
      };
      /**
       * 清空 rowCount, 下次重新统计总行数
       */
      YvanDataSourceGrid.prototype.clearRowCount = function () {
          delete this.rowCount;
      };
      YvanDataSourceGrid.prototype.updateSupport = function () {
          return false;
      };
      YvanDataSourceGrid.prototype._updateRow = function (param) {
          throw new Error('not implements');
      };
      return YvanDataSourceGrid;
  }());
  //# sourceMappingURL=YvanDataSourceGridImp.js.map

  var CtlGridCellButton = /** @class */ (function () {
      function CtlGridCellButton() {
      }
      CtlGridCellButton.prototype.init = function (params) {
          this.$el = document.createElement('div');
          this._buildHTML.call(this, params);
      };
      CtlGridCellButton.prototype.getGui = function () {
          return this.$el;
      };
      CtlGridCellButton.prototype.destroy = function () {
          for (var i = 0; i < this.$btns.length; i++) {
              var btn = this.$btns[i];
              btn.removeEventListener('click', this.func[i]);
          }
      };
      CtlGridCellButton.prototype.refresh = function (params) {
          this._buildHTML.call(this, params);
      };
      CtlGridCellButton.prototype._buildHTML = function (params) {
          var _this = this;
          var arr = [];
          var func = [];
          var buttons = params.buttons, rowIndex = params.rowIndex, data = params.data, api = params.api, column = params.column;
          if (typeof buttons === 'object' && buttons.constructor === Array) {
              _.each(buttons, function (btn) {
                  if (typeof btn.render === 'function') {
                      var r = btn.render.call(_this, rowIndex, data);
                      if (r !== true) {
                          return;
                      }
                  }
                  else if (typeof btn.render === 'boolean' && !btn.render) {
                      return;
                  }
                  arr.push("<a class=\"yv-grid-button " + btn.cssType + "\">" +
                      (typeof btn.iconCls === 'string'
                          ? '<i class="' + btn.iconCls + '"></i>'
                          : '') +
                      btn.text +
                      '</a>');
                  func.push(btn.onClick);
              });
          }
          this.$el.innerHTML =
              '<div class="yv-grid-buttons">' + arr.join('') + '</div>';
          var $btns = this.$el.querySelectorAll('.yv-grid-button');
          var _loop_1 = function (i) {
              var btn = $btns[i];
              var fun = func[i];
              btn.addEventListener('click', function () {
                  var ctl = api.vue;
                  var module = api.vue._webix.$scope;
                  YvEventDispatch(fun, ctl, { data: data, rowIndex: rowIndex, colId: column.colId }, module);
              });
          };
          for (var i = 0; i < $btns.length; i++) {
              _loop_1(i);
          }
          this.$btns = $btns;
          this.func = func;
      };
      return CtlGridCellButton;
  }());
  //# sourceMappingURL=CtlGridCellButton.js.map

  var CtlGridFilterSet = /** @class */ (function () {
      function CtlGridFilterSet() {
      }
      // The init(params) method is called on the filter once. See below for details on the
      // parameters.
      CtlGridFilterSet.prototype.init = function (params) {
          var _this = this;
          this.setupDOM(params);
          var that = this;
          var data = params.data;
          //======================= 全选按钮 =======================
          var $selectAll = $(this.$el).find('[ref="eSelectAll"]');
          $selectAll.on('click', function () {
              if (_this.checkedData.length >= _this.data.length) {
                  //全选状态，点击后属于全不选
                  _this.checkedData = [];
              }
              else {
                  //其他情况，都是全选
                  _this.checkedData = _.clone(_this.data);
              }
              _this.refreshState();
          });
          this.$selectAll = $selectAll;
          //======================= 确定/清空 =======================
          var $clear = $(this.$el).find('[ref="eClearButton"]');
          var $apply = $(this.$el).find('[ref="eApplyButton"]');
          $clear.on('click', function () {
              //清空就是全选
              that.checkedData = _.clone(that.data);
              that.refreshState();
              params.filterChangedCallback();
              if (typeof that.hidePopup === 'function') {
                  that.hidePopup();
              }
          });
          $apply.on('click', function () {
              //确定
              params.filterChangedCallback();
              if (typeof that.hidePopup === 'function') {
                  that.hidePopup();
              }
          });
          this.$clear = $clear;
          this.$apply = $apply;
          //======================= 构建数据 =======================
          var $container = $(this.$el).find('.ag-virtual-list-container');
          $container.css('height', (data.length * 20 + 2) + 'px');
          var h = 0;
          _.each(data, function (item) {
              $container.append('<div class="ag-virtual-list-item" style="top: ' + h + 'px;" RefDataValue="' + item.id + '">' +
                  '  <label class="ag-set-filter-item">\n' +
                  '    <div class="ag-filter-checkbox"><span class="ag-icon ag-icon-checkbox-checked" unselectable="on"></span></div>\n' +
                  '    <span class="ag-filter-value">' + item.text + '</span>\n' +
                  '  </label>' +
                  '</div>');
              h += 20;
          });
          //ag-icon-checkbox-indeterminate
          $container.on('click', '.ag-virtual-list-item', function () {
              //const $cb = $(this).find('span.ag-icon');
              var cv = $(this).attr('RefDataValue');
              var fi = _.find(that.checkedData, function (item) { return _.toString(item.id) === cv; });
              if (fi) {
                  //已经勾选了，要删掉他
                  _.remove(that.checkedData, function (item) { return _.toString(item.id) === cv; });
              }
              else {
                  //没有勾选，要加上他
                  var af = _.find(that.data, function (item) { return _.toString(item.id) === cv; });
                  that.checkedData.push(__assign({}, af));
              }
              //刷新状态
              that.refreshState();
          });
          this.data = data;
          this.checkedData = _.clone(this.data);
          this.$container = $container;
      };
      CtlGridFilterSet.prototype.refreshState = function () {
          var $cb = this.$selectAll.find('span.ag-icon');
          if (this.checkedData.length >= this.data.length) {
              //已经全选
              $cb.attr('class', 'ag-icon ag-icon-checkbox-checked');
              this.$container.find('[RefDataValue]').find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-checked');
          }
          else if (this.checkedData.length === 0) {
              //一个没选
              $cb.attr('class', 'ag-icon ag-icon-checkbox-unchecked');
              this.$container.find('[RefDataValue]').find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-unchecked');
          }
          else {
              //其他情况
              $cb.attr('class', 'ag-icon ag-icon-checkbox-indeterminate');
              var that_1 = this;
              this.$container.find('[RefDataValue]').each(function () {
                  var $dom = $(this);
                  var v = $dom.attr('RefDataValue');
                  var fi = _.find(that_1.checkedData, function (item) { return item.id === v; });
                  if (fi) {
                      //有属性，加上钩
                      $dom.find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-checked');
                  }
                  else {
                      //没属性，不打勾
                      $dom.find('span.ag-icon').attr('class', 'ag-icon ag-icon-checkbox-unchecked');
                  }
              });
          }
      };
      // Returns the GUI for this filter. The GUI can be a) a string of html or b) a DOM element or
      // node.
      CtlGridFilterSet.prototype.getGui = function () {
          return this.$el;
      };
      // Return true if the filter is active. If active than 1) the grid will show the filter icon in the column
      // header and 2) the filter will be included in the filtering of the data.
      CtlGridFilterSet.prototype.isFilterActive = function () {
          //如果不是全选，就是没激活
          return (this.checkedData.length < this.data.length);
      };
      // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
      // filter fails, then the row will be excluded from the final set. A params object is supplied
      // with attributes node (the rowNode the grid creates that wraps the data) and data (the data
      // object that you provided to the grid for that row).
      CtlGridFilterSet.prototype.doesFilterPass = function () {
          // 服务器已经设置条件，浏览器不进行实际比对
          return true;
      };
      // Gets the filter state. If filter is not active, then should return null/undefined.
      // The grid calls getModel() on all active filters when gridApi.getFilterModel() is called.
      CtlGridFilterSet.prototype.getModel = function () {
          if (this.checkedData.length >= this.data.length) {
              //全选，不需要带任何条件
              return;
          }
          return {
              filterType: 'set',
              filter: this.checkedData,
          };
      };
      // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
      // The grid will pass undefined/null to clear the filter.
      CtlGridFilterSet.prototype.setModel = function (model) {
          if (!model) {
              //清空筛选
              this.checkedData = _.clone(this.data);
          }
      };
      // Gets called every time the popup is shown, after the gui returned in
      // getGui is attached to the DOM. If the filter popup is closed and reopened, this method is
      // called each time the filter is shown. This is useful for any logic that requires attachment
      // before executing, such as putting focus on a particular DOM element. The params has one
      // callback method 'hidePopup', which you can call at any later point to hide the popup - good
      // if you have an 'Apply' button and you want to hide the popup after it is pressed.
      CtlGridFilterSet.prototype.afterGuiAttached = function (param) {
          this.hidePopup = param.hidePopup;
          this.refreshState();
      };
      // Gets called when the Column is destroyed. If your custom filter needs to do
      // any resource cleaning up, do it here. A filter is NOT destroyed when it is
      // made 'not visible', as the gui is kept to be shown again if the user selects
      // that filter again. The filter is destroyed when the column it is associated with is
      // destroyed, either new columns are set into the grid, or the grid itself is destroyed.
      CtlGridFilterSet.prototype.destroy = function () {
          this.$selectAll.off();
          this.$container.off();
          this.$clear.off();
          this.$apply.off();
      };
      // If floating filters are turned on for the grid, but you have no floating filter
      // configured for this column, then the grid will check for this method. If this
      // method exists, then the grid will provide a read only floating filter for you
      // and display the results of this method. For example, if your filter is a simple
      // filter with one string input value, you could just return the simple string
      // value here.
      CtlGridFilterSet.prototype.getModelAsString = function () {
          console.log('getModelAsString');
      };
      CtlGridFilterSet.prototype.setupDOM = function (params) {
          this.$el = document.createElement('div');
          var html = '<div class="ag-filter-body-wrapper">\n' +
              '  <div>\n' +
              '    <div class="ag-filter-header-container" role="presentation" style="width: 200px;">\n' +
              '      <label ref="eSelectAll" class="ag-set-filter-item">\n' +
              '        <div class="ag-filter-checkbox">\n' +
              '          <span class="ag-icon ag-icon-checkbox-checked" unselectable="on"></span>\n' +
              '        </div>\n' +
              '        <span class="ag-filter-value">全选</span>\n' +
              '      </label>\n' +
              '    </div>\n' +
              '    <div class="ag-set-filter-list" role="presentation">\n' +
              '      <div class="ag-virtual-list-viewport">\n' +
              '\n' +
              '\n' +
              '        <div class="ag-virtual-list-container" style="height: 180px;">' +
              '        </div>\n' +
              '\n' +
              '\n' +
              '      </div>\n' +
              '    </div>\n' +
              '  </div>\n' +
              '</div>\n' +
              '<div class="ag-filter-apply-panel" ref="eButtonsPanel">\n' +
              '  <button type="button" ref="eClearButton">清空</button>\n' +
              '  <button type="button" ref="eApplyButton">确定</button>\n' +
              '</div>';
          this.$el.innerHTML = html;
      };
      return CtlGridFilterSet;
  }());
  //# sourceMappingURL=CtlGridFilterSet.js.map

  var CtlGridEditor = /** @class */ (function () {
      function CtlGridEditor() {
      }
      // gets called once after the editor is created
      CtlGridEditor.prototype.init = function (params) {
          this.data = params.data;
          this.colDef = params.colDef;
          this.column = params.column;
          var type = params.type, data = params.data, colDef = params.colDef, column = params.column, cellStartedEdit = params.cellStartedEdit, value = params.value, editParams = params.editParams;
          _.assign(this, {
              type: type, value: value, data: data, colDef: colDef, column: column, editParams: editParams
          });
          this.focusAfterAttached = cellStartedEdit;
          this.field = colDef.field;
          this.valid = params.valid;
          this.origin = value;
          this.vue = params.api.vue;
      };
      // Return the DOM element of your editor, this is what the grid puts into the DOM
      CtlGridEditor.prototype.getGui = function () {
      };
      // Gets called once after GUI is attached to DOM.
      // Useful if you want to focus or highlight a component
      // (this is not possible when the element is not attached)
      CtlGridEditor.prototype.afterGuiAttached = function () {
      };
      // Should return the final value to the grid, the result of the editing
      CtlGridEditor.prototype.getValue = function () {
      };
      CtlGridEditor.prototype.setValue = function (newValue) {
          console.error('不支持 setValue:' + newValue);
      };
      // Gets called once by grid after editing is finished
      // if your editor needs to do any cleanup, do it here
      CtlGridEditor.prototype.destroy = function () {
          if (typeof this.valid === 'undefined') {
              return;
          }
          var validMsg = this.valid(this.getValue(), this.vue.getEditRow());
          if (validMsg) {
              this.vue.currentEditValidMsg[this.field] = validMsg;
          }
          else {
              this.vue.currentEditValidMsg[this.field] = undefined;
          }
      };
      // Gets called once after initialised.
      // If you return true, the editor will appear in a popup
      CtlGridEditor.prototype.isPopup = function () {
          return false;
      };
      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      CtlGridEditor.prototype.isCancelBeforeStart = function () {
          //如果这里返回 true, 就会取消编辑
      };
      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      CtlGridEditor.prototype.isCancelAfterEnd = function () {
          //这里返回 true, 就会取消该单元格编辑，还原其内容
      };
      // If doing full row edit, then gets called when tabbing into the cell.
      CtlGridEditor.prototype.focusIn = function () {
      };
      // If doing full row edit, then gets called when tabbing out of the cell.
      CtlGridEditor.prototype.focusOut = function () {
      };
      return CtlGridEditor;
  }());
  //# sourceMappingURL=CtlGridEditor.js.map

  var isInput = false;
  var CtlGridEditorText = /** @class */ (function (_super) {
      __extends(CtlGridEditorText, _super);
      function CtlGridEditorText() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlGridEditorText.prototype.init = function (params) {
          _super.prototype.init.call(this, params);
          if (params.node.rowPinned) {
              this.isPinned = true;
          }
          this.$el = document.createElement('div');
          this.$el.classList.add('ag-input-wrapper');
          this.$el.setAttribute('role', 'presentation');
          this.$el.innerHTML =
              '<input class="ag-cell-edit-input" type="text" autocomplete="off">';
          this.$input = this.$el.querySelectorAll('input')[0];
          this.$input.value = _.toString(params.value);
          this.$input.addEventListener('keydown', this._onKeyDown.bind(this));
          this.$input.addEventListener('input', this._onInput.bind(this));
          this.$input.addEventListener('change', this._onChange.bind(this));
          this.$input.addEventListener('compositionstart', this._onCompositionstart.bind(this));
          this.$input.addEventListener('compositionend', this._onCompositionend.bind(this));
      };
      CtlGridEditorText.prototype._onCompositionstart = function () {
          isInput = true;
      };
      CtlGridEditorText.prototype._onCompositionend = function (e) {
          isInput = false;
          this._dealWithString(e);
      };
      CtlGridEditorText.prototype._onKeyDown = function (e) {
          if (e.code === 'Tab' || e.code === 'Enter') {
              // Tab键/回车键, 完全拦截，跑下一个焦点控件
              e.stopPropagation();
              e.preventDefault();
              this.value = e.target.value;
              if (typeof this.editParams.onValidate === 'function') {
                  var r = this.editParams.onValidate(this.value);
                  if (r) {
                      //有校验错误，不让跳转
                      return;
                  }
              }
              //写入离开原因的 code 编码
              this.leaveReason = e.code;
              //这里会触发 this.getValue() 方法
              this.vue.gridApi.stopEditing();
          }
      };
      CtlGridEditorText.prototype._onInput = function (e) {
          if (isInput) {
              return;
          }
          this._dealWithString(e);
      };
      CtlGridEditorText.prototype._dealWithString = function (e) {
          var value = e.target.value;
          if (this.type === 'number') {
              if (this.editParams.precision > 0) {
                  value = value.replace(/[^\d.-]/g, ''); //清除"数字"和"."以外的字符
                  if (value.length > 1 && value.indexOf('.') > 1) {
                      var t = void 0;
                      while (1) {
                          t = value;
                          value = value.replace(/^0/g, '');
                          if (t.length === value.length) {
                              break;
                          }
                      }
                      //value = value.replace(/^0/g, '') //验证第一个字符不是0.
                  }
                  value = value.replace(/^\./g, ''); //验证第一个字符是数字而不是.
                  value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的.
                  value = value
                      .replace('.', '$#$')
                      .replace(/\./g, '')
                      .replace('$#$', '.'); //只允许输入一个小数点
                  var r = eval('/^(\\-)*(\\d+)\\.(\\d{0,' + this.editParams.precision + '}).*$/');
                  value = value.replace(r, '$1$2.$3'); //只能输入固定位数的小数
              }
              else {
                  value = value.replace(/[^\d-]/g, ''); //清除"数字"和"-"以外的字符
                  if (value.length > 1) {
                      value = value.replace(/^0/g, ''); //验证第一个字符不是0.
                  }
                  if (value.startsWith('-')) {
                      value = '-' + value.substr(1).replace(/[^\d]/g, '');
                  }
                  else {
                      value = value.replace(/[^\d]/g, '');
                  }
              }
          }
          e.target.value = value;
          if (this.value === value) {
              //完全相等，不用通知更改
              return;
          }
          this.value = value;
          if (e.detail !== 'custom') {
              if (typeof this.editParams.onInput === 'function') {
                  var r = this.editParams.onInput(this.value, e);
                  if (typeof r !== 'undefined') {
                      this.value = r;
                      e.target.value = r;
                  }
                  if (typeof this.editParams.onValidate === 'function') {
                      this.editParams.onValidate(value);
                  }
              }
          }
      };
      CtlGridEditorText.prototype._onChange = function (e) {
          this.value = e.target.value;
          if (typeof this.editParams.onChange === 'function') {
              this.editParams.onChange(this.value, e);
          }
      };
      CtlGridEditorText.prototype.destroy = function () {
          _super.prototype.destroy.call(this);
          this.$input.removeEventListener('keydown', this._onKeyDown.bind(this));
          this.$input.removeEventListener('input', this._onInput.bind(this));
          this.$input.removeEventListener('change', this._onChange.bind(this));
          this.$input.removeEventListener('compositionstart', this._onCompositionstart.bind(this));
          this.$input.removeEventListener('compositionend', this._onCompositionend.bind(this));
      };
      CtlGridEditorText.prototype.getGui = function () {
          return this.$el;
      };
      CtlGridEditorText.prototype.afterGuiAttached = function () {
          _super.prototype.afterGuiAttached.call(this);
          this.$input.dispatchEvent(new CustomEvent('input', { detail: 'custom' }));
          if (this.focusAfterAttached) {
              this.$input.focus();
          }
      };
      CtlGridEditorText.prototype.getValue = function () {
          if (typeof this.leaveReason === 'undefined') {
              //不是按导航键移动的
              if (typeof this.editParams.onValidate === 'function') {
                  var r = this.editParams.onValidate(this.value);
                  if (r) {
                      //有校验错误，还原内容
                      return this.origin;
                  }
              }
          }
          if (typeof this.editParams.onCommit === 'function') {
              this.editParams.onCommit({
                  data: this.data,
                  colDef: this.colDef,
                  column: this.column,
                  newValue: this.value,
                  isPinned: this.isPinned,
                  vue: this.vue,
                  leaveReason: this.leaveReason
              });
          }
          return this.value;
      };
      CtlGridEditorText.prototype.focusIn = function () {
          _super.prototype.focusIn.call(this);
          this.$input.focus();
          this.$input.select();
      };
      CtlGridEditorText.prototype.focusOut = function () {
          _super.prototype.focusOut.call(this);
      };
      return CtlGridEditorText;
  }(CtlGridEditor));
  //# sourceMappingURL=CtlGridEditorText.js.map

  var CtlGridEditorCombo = /** @class */ (function (_super) {
      __extends(CtlGridEditorCombo, _super);
      function CtlGridEditorCombo() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlGridEditorCombo.prototype.init = function (params) {
          _super.prototype.init.call(this, params);
          this.options = params.options;
          if (params.node.rowPinned) {
              this.isPinned = true;
          }
          var $dom = $('<input class="tmp-combo" />');
          this.$el = $dom[0];
      };
      CtlGridEditorCombo.prototype.getGui = function () {
          return this.$el;
      };
      CtlGridEditorCombo.prototype.afterGuiAttached = function () {
          // YvGridEditor.afterGuiAttached.apply(this, arguments)
          // this.vv.focus()
          //setTimeout(() => {
          //    this.vv.open()
          //    this.vv.$nextTick(() => {
          //        debugger
          //    })
          //}, 1000)
      };
      CtlGridEditorCombo.prototype.getValue = function () {
          // if (typeof this.leaveReason === 'undefined') {
          //     //不是按导航键移动的, 需要触发校验
          //     if (typeof this.editParams.onValidate === 'function') {
          //         const r = this.editParams.onValidate(value)
          //         if (r) {
          //             //有校验错误，还原内容
          //             return this.origin
          //         }
          //     }
          // }
          //
          // //校验通过，调用 commit 并返回选定的新值
          // if (typeof this.editParams.onCommit === 'function') {
          //     this.editParams.onCommit({
          //         data: this.data,
          //         colDef: this.colDef,
          //         column: this.column,
          //         newValue: this.value,
          //         leaveReason: this.leaveReason,
          //     })
          // }
          // return this.value
      };
      CtlGridEditorCombo.prototype.destroy = function () {
          _super.prototype.destroy.call(this);
          // this.vv.$destroy()
      };
      CtlGridEditorCombo.prototype.focusIn = function () {
          _super.prototype.focusIn.call(this);
          // this.vv.focus()
      };
      CtlGridEditorCombo.prototype.focusOut = function () {
          _super.prototype.focusOut.call(this);
      };
      return CtlGridEditorCombo;
  }(CtlGridEditor));
  //# sourceMappingURL=CtlGridEditorCombo.js.map

  (function (GridRefreshMode) {
      GridRefreshMode[GridRefreshMode["refreshRows"] = 0] = "refreshRows";
      GridRefreshMode[GridRefreshMode["refreshWithFilter"] = 1] = "refreshWithFilter";
      GridRefreshMode[GridRefreshMode["refreshAndClearFilter"] = 2] = "refreshAndClearFilter";
  })(exports.GridRefreshMode || (exports.GridRefreshMode = {}));
  /**
   * 扩展 grid 组件
   */
  webix.protoUI({
      name: 'grid',
      $init: function (config) {
          this._domid = webix.uid();
          this.$view.innerHTML = "<div id='" + this._domid + "' role=\"yvGrid\" class=\"ag-theme-blue\"></div>";
          _.extend(this.config, config);
          if (config.on && typeof config.on.onMyRender === 'function') {
              config.on.onMyRender.call(this);
          }
      }
  }, webix.ui.view);
  var CtlGrid = /** @class */ (function (_super) {
      __extends(CtlGrid, _super);
      function CtlGrid() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.refreshMode = exports.GridRefreshMode.refreshRows;
          /**
           * 是否自动读取数据
           */
          _this.autoLoad = true;
          /**
           * 是否分页
           */
          _this.pagination = false;
          /**
           * 分页大小
           */
          _this.pageSize = 100;
          /**
           * 获取被勾选的行ID集合
           */
          _this.checkedIds = [];
          /*============================ 私有属性部分 ============================*/
          _this.isGridReadReady = false;
          _this.dataSourceBind = undefined;
          return _this;
      }
      CtlGrid.create = function (module, vjson) {
          var that = new CtlGrid(_.cloneDeep(vjson));
          that._module = module;
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
          // 提取基础属性 onRender / ctlName / entityName 等等
          var yvanProp = parseYvanPropChangeVJson(vjson, []);
          // 将 yvanProp 合并至当前 CtlBase 对象
          _.assign(that, yvanProp);
          // 删除 vjson 所有数据, 替换为 template 语法
          _.forOwn(vjson, function (value, key) {
              delete vjson[key];
          });
          _.merge(vjson, {
              view: 'grid',
              // template: `<div role="yvGrid" class="ag-theme-blue"></div>`,
              on: {
                  onMyRender: function () {
                      var _this = this;
                      _.defer(function () {
                          that.attachHandle(_this, __assign(__assign({}, vjson), yvanProp));
                          that._resetGrid();
                      });
                  },
                  onDestruct: function () {
                      if (that.gridApi) {
                          that.gridApi.destroy();
                          that.gridApi = undefined;
                      }
                      that.removeHandle();
                  }
              }
          });
          if (that.vjson.id) {
              vjson.id = that.vjson.id;
          }
          return that;
      };
      Object.defineProperty(CtlGrid.prototype, "webix", {
          get: function () {
              return this._webix;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlGrid.prototype, "dataSource", {
          /**
           * 获取数据源
           */
          get: function () {
              return this.vjson.dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this.vjson.dataSource = nv;
              // if (this._module.loadFinished) {
              //   throw new Error('Grid 不允许动态设置数据源')
              // }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 选择一个指定行
       * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
       */
      CtlGrid.prototype.selectRow = function (condition) {
          var node = this._findNode(condition);
          if (node) {
              this.gridApi.setFocusedCell(node.rowIndex, '__ID__');
              node.setSelected(true);
              return true;
          }
          return false;
      };
      /**
       * 闪烁指定行
       * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
       */
      CtlGrid.prototype.flashRow = function (condition) {
          var node = this._findNode(condition);
          if (node) {
              this.gridApi.flashCells({ rowNodes: [node] });
              return true;
          }
          return false;
      };
      /**
       * 闪烁指定单元格
       * @param cols 列数组
       * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
       */
      CtlGrid.prototype.flashCell = function (cols, condition) {
          var node = this._findNode(condition);
          if (node) {
              this.gridApi.flashCells({ columns: cols, rowNodes: [node] });
              return true;
          }
          return false;
      };
      /**
       * 无感知刷新
       */
      CtlGrid.prototype._transactionUpdate = function (targetDataList) {
          var _this = this;
          if (this.refreshMode === exports.GridRefreshMode.refreshWithFilter || this.refreshMode === exports.GridRefreshMode.refreshAndClearFilter) {
              /** 更改当前的刷新模式， 避免重复刷新 **/
              this.refreshMode = exports.GridRefreshMode.refreshRows;
              this.setData(targetDataList);
              if (this.dataSourceBind) {
                  this.gridApi.setFilterModel(this.dataSourceBind.lastFilterModel);
              }
          }
          else {
              /** 更改当前的刷新模式， 避免重复刷新 **/
              this.refreshMode = exports.GridRefreshMode.refreshRows;
              var transaction_1 = {
                  add: [],
                  remove: [],
                  update: []
              };
              var i_1 = 0;
              this.gridApi.forEachNode(function (node) {
                  if (i_1 === targetDataList.length) {
                      //已经越位
                      transaction_1.remove.push(node.data);
                  }
                  else {
                      var newData = targetDataList[i_1++];
                      node.setData(newData);
                      transaction_1.update.push(node.data);
                  }
              });
              for (; i_1 < targetDataList.length; i_1++) {
                  transaction_1.add.push(targetDataList[i_1]);
              }
              this.gridApi.updateRowData(transaction_1);
          }
          if (this.paginationDefaultSelectRow != undefined && targetDataList && targetDataList.length > 0) {
              if (this.paginationDefaultSelectRow >= 0) {
                  if (targetDataList.length <= this.paginationDefaultSelectRow) {
                      this.selectRow(function (node) { return node.rowIndex === targetDataList.length - 1; });
                  }
                  else {
                      this.selectRow(function (node) { return node.rowIndex === _this.paginationDefaultSelectRow; });
                  }
              }
          }
      };
      /**
       * 获取全部数据
       */
      CtlGrid.prototype.getData = function () {
          var result = [];
          this.gridApi.forEachNode(function (node) {
              result.push(node.data);
          });
          return result;
      };
      /**
       * 为表格设置数据
       * 注意，调用此方法，必须在初始化时，给一个空的 data: [] 属性
       * 确保表格 rowModelType:clientSide 模式
       */
      CtlGrid.prototype.setData = function (nv) {
          this.gridApi.setRowData(nv);
      };
      /**
       * 无感刷新
       * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
       *
       * option:
       *   clearFilter=true 是否清空筛选
       */
      // reload(option?: any) {
      //   this.loading = true
      //
      //   //无感刷新之前，清空所有状态
      //   this._clearCache()
      //
      //   //需要重新请求 rowCount(总数据行)
      //   if (this.dataSourceBind) {
      //     this.dataSourceBind.clearRowCount()
      //   }
      //
      //   if (this.entityName) {
      //     _.set(this.getModule(), this.entityName + '.selectedRow', undefined)
      //   }
      //
      //   /** 有clearFilter 参数的时候 一定刷新数据 **/
      //   if (option && option.clearFilter === true) {
      //     this.pageAbleDataRefreshMode = "refreshAndReset"
      //     this.gridApi.setFilterModel(null)
      //     if (this.dataSourceBind) {
      //       /** 表头筛选数据没有变化也要重新加载数据 **/
      //       if (_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) {
      //         this._filterChanged();
      //       }
      //     }
      //   } else {
      //     if (this.pagination) {
      //       this.pageAbleDataRefreshMode = "refreshWithFilter"
      //       this.gridPage.refreshGrid()
      //     } else {
      //       this.pageAbleDataRefreshMode = "refreshRows"
      //       this.gridApi.refreshInfiniteCache()
      //     }
      //   }
      // }
      /**
       * 无感刷新
       * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
       *
       * option:
       *   clearFilter=true 是否清空筛选
       */
      CtlGrid.prototype.reload = function (refreshMode) {
          if (refreshMode === void 0) { refreshMode = exports.GridRefreshMode.refreshRows; }
          this.loading = true;
          this.refreshMode = refreshMode;
          //无感刷新之前，清空所有状态
          this._clearCache();
          //需要重新请求 rowCount(总数据行)
          if (this.dataSourceBind) {
              this.dataSourceBind.clearRowCount();
          }
          if (this.entityName) {
              _.set(this.getModule(), this.entityName + '.selectedRow', undefined);
          }
          /** 有clearFilter 参数的时候 一定刷新数据 **/
          if (refreshMode === exports.GridRefreshMode.refreshAndClearFilter) {
              this.gridApi.setFilterModel(null);
              if (this.dataSourceBind) {
                  /** 表头筛选数据没有变化也要重新加载数据 **/
                  if (_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) {
                      this._filterChanged();
                  }
              }
          }
          else {
              if (this.pagination) {
                  this.gridPage.refreshGrid();
              }
              else {
                  this.gridApi.refreshInfiniteCache();
              }
          }
      };
      /**
       * 获取被选中的行主键
       */
      CtlGrid.prototype.getSelectedId = function () {
          var row = this.getSelectedRow();
          if (row) {
              return this._getIdByRow(row);
          }
      };
      /**
       * 设置勾选的数据行集合
       */
      CtlGrid.prototype.setCheckedIds = function (ids) {
          // 清空所有元素
          this.checkedIds = ids;
          // 刷新勾选单元格
          this.gridApi.refreshCells({
              columns: ['__CB__'],
              force: true
          });
      };
      /**
       * 获取被勾选的所有行
       */
      CtlGrid.prototype.getCheckedRows = function () {
          var _this = this;
          var selected = [];
          this._findNode(function (node) {
              if (_.indexOf(_this.checkedIds, _this._getIdByRow(node.data)) >= 0) {
                  selected.push(node.data);
              }
              return false;
          });
          return selected;
      };
      /**
       * 获取被选中的行数据
       */
      CtlGrid.prototype.getSelectedRow = function () {
          var rows = this.getSelectedRows();
          return rows.length > 0 ? rows[0] : undefined;
      };
      /**
       * 获取被选中的行数据(多选情况下回返回多行数据)
       */
      CtlGrid.prototype.getSelectedRows = function () {
          // 调用原生 getSelectedRows 方法有 bug
          // return this.gridApi.getSelectedRows();
          var selected = [];
          this._findNode(function (node) {
              if (node.selected) {
                  selected.push(node.data);
              }
              return false;
          });
          return selected;
      };
      Object.defineProperty(CtlGrid.prototype, "loading", {
          /**
           * 显示正在读取的状态
           */
          set: function (newValue) {
              if (!this.isGridReadReady) {
                  return;
              }
              if (newValue) {
                  // 盖着
                  this.gridApi.showLoadingOverlay();
                  $($(this._webix.$view).find('.ag-paging-panel')[0]).append("<div class=\"maskBox\"></div>");
              }
              else {
                  // 放开
                  $(this._webix.$view).find('.maskBox').remove();
                  this.gridApi.hideOverlay();
              }
          },
          enumerable: true,
          configurable: true
      });
      CtlGrid.prototype.paginationSetPageSize = function (size) {
          this.gridApi.paginationSetPageSize(size);
      };
      /** 设置行号, 兼容分页 **/
      CtlGrid.prototype.setRowId = function (p) {
          return CtlGridIdRender(p, this);
      };
      CtlGrid.prototype._gridOptions = function () {
          _.assign(this, __assign(__assign({}, _.clone(YvGridProp)), this.vjson));
          var resultCols = [];
          //显示序号列
          if (this.showRowNumber) {
              resultCols.push({
                  field: '__ID__',
                  headerName: CtlGridLocale.rownumber,
                  width: 52,
                  //minWidth: 52,
                  maxWidth: 160,
                  pinned: 'left',
                  resizable: true,
                  sortable: false,
                  cellRenderer: 'CtlGridIdRender'
              });
          }
          //显示勾选框
          if (this.checkbox) {
              resultCols.push({
                  field: '__CB__',
                  headerName: '',
                  width: 40,
                  minWidth: 40,
                  maxWidth: 40,
                  pinned: 'left',
                  resizable: false,
                  sortable: false,
                  cellRenderer: 'CtlGridCellCheckbox',
                  headerComponent: 'CtlGridHeadCheckbox',
                  cellRendererParams: {
                      isCheckedIds: true
                  }
              });
          }
          //添加自定义列
          this._gridCols(resultCols);
          var columnDefs = resultCols;
          if (!this.columnGroup || _.size(this.columnGroup) <= 0) {
              //没有多级表头
              columnDefs = resultCols;
          }
          else {
              //二级表头
              columnDefs = [];
              var j = 0;
              var currentGroup = void 0;
              var currentGroupSpan = -1;
              for (var i = 0; i < resultCols.length; i++) {
                  var _a = this.columnGroup[j], from = _a.from, title = _a.title, span = _a.span, width = _a.width;
                  var f = resultCols[i];
                  if (!this.columnGroup[j]) {
                      columnDefs.push(f);
                  }
                  if (currentGroupSpan > 0) {
                      currentGroup.children.push(f);
                      currentGroupSpan--;
                      if (currentGroupSpan <= 0) {
                          j++;
                      }
                  }
                  else if (f.field === from) {
                      currentGroup = {
                          width: width,
                          headerName: title,
                          children: [f]
                      };
                      currentGroupSpan = span - 1;
                      columnDefs.push(currentGroup);
                  }
                  else {
                      columnDefs.push(f);
                  }
              }
          }
          var gridOptions = {
              headerHeight: 35,
              rowHeight: 33,
              suppressRowHoverHighlight: true,
              columnDefs: columnDefs,
              animateRows: false,
              suppressCellSelection: !this.allowCellSelection,
              suppressRowClickSelection: !this.allowRowSelection,
              suppressColumnMoveAnimation: true,
              pagination: this.pagination,
              paginationPageSize: this.pageSize,
              localeText: CtlGridLocale,
              rowModelType: 'infinite',
              infiniteInitialRowCount: 200,
              //maxConcurrentDatasourceRequests: 2,
              maxBlocksInCache: 5,
              //cacheOverflowSize
              rowSelection: 'single',
              enableBrowserTooltips: true,
              //enableCellChangeFlash: true,
              singleClickEdit: this.editSingleClick,
              floatingFilter: false,
              stopEditingWhenGridLosesFocus: this.stopEditingWhenGridLosesFocus,
              onFirstDataRendered: this._firstDataRendered.bind(this),
              onGridReady: this._gridReady.bind(this),
              tabToNextCell: this._tabToNextCell.bind(this),
              navigateToNextCell: this._navigateToNextCell.bind(this),
              onCellKeyDown: this._cellKeyDown.bind(this),
              onRowDoubleClicked: this._rowDoubleClicked.bind(this),
              onCellEditingStarted: this._cellEditingStarted.bind(this),
              onCellEditingStopped: this._cellEditingStopped.bind(this),
              onRowSelected: this._rowSelected.bind(this),
              onModelUpdated: this._modelUpdated.bind(this),
              onCellFocused: this._cellFocused.bind(this),
              onCellClicked: this._cellClicked.bind(this),
              onFilterChanged: this._filterChanged.bind(this),
              onSortChanged: this._sortChanged.bind(this),
              enterMovesDown: false,
              enterMovesDownAfterEdit: false,
              accentedSort: true,
              components: {
                  CtlGridCellButton: CtlGridCellButton,
                  CtlGridCellCheckbox: CtlGridCellCheckbox,
                  CtlGridHeadCheckbox: CtlGridHeadCheckbox,
                  CtlGridEditorText: CtlGridEditorText,
                  CtlGridEditorCombo: CtlGridEditorCombo,
                  // // YvGridEditorDate: YvGridEditorDate,
                  CtlGridFilterSet: CtlGridFilterSet,
                  CtlGridIdRender: this.setRowId.bind(this) //CtlGridIdRender.bind(this)
              }
          };
          if (_.isArray(this.dataSource)) {
              //有数据，按 client 模式加载数据
              _.assign(gridOptions, {
                  rowModelType: 'clientSide',
                  rowData: this.data,
                  data: []
              });
          }
          if (this.pagination) {
              _.assign(gridOptions, {
                  rowModelType: 'clientSide',
                  rowData: [],
                  data: []
              });
          }
          return gridOptions;
      };
      CtlGrid.prototype._filterChanged = function () {
          if (this.dataSourceBind) {
              if ((!_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) || this.refreshMode == exports.GridRefreshMode.refreshAndClearFilter) {
                  var reload = _.get(this.dataSourceBind, 'reload');
                  if (typeof reload === 'function') {
                      reload.call(this.dataSourceBind);
                  }
              }
              // console.log('_filterChanged', this.gridApi.getFilterModel());
          }
      };
      CtlGrid.prototype._sortChanged = function () {
          if (this.dataSourceBind) {
              if ((!_.isEqual(this.gridApi.getSortModel(), this.dataSourceBind.lastSortModel)) || this.refreshMode == exports.GridRefreshMode.refreshAndClearFilter) {
                  var reload = _.get(this.dataSourceBind, 'reload');
                  if (typeof reload === 'function') {
                      reload.call(this.dataSourceBind);
                  }
              }
              // console.log('_sortChanged', this.gridApi.getSortModel());
          }
      };
      CtlGrid.prototype._gridReady = function () {
          this.isGridReadReady = true;
          /** 分页视图 **/
          this.gridPage = new CtlGridPage(this);
          this._rebindDataSource();
      };
      CtlGrid.prototype._resetGrid = function () {
          this.isGridReadReady = false;
          var gridOptions = this._gridOptions();
          var $el = $(this._webix._viewobj).find('[role="yvGrid"]')[0];
          var grid = new agGrid.Grid($el, gridOptions);
          grid.gridOptions.api.vue = this;
          this.gridApi = grid.gridOptions.api;
          this.columnApi = grid.gridOptions.columnApi;
          //去掉 ag-unselectable 使表格允许被选定
          if ($el) {
              $($el)
                  .find('.ag-root.ag-unselectable')
                  .removeClass('ag-unselectable');
          }
      };
      CtlGrid.prototype._rowDoubleClicked = function (e) {
          YvEventDispatch(this.onRowDblClick, this, e.data);
      };
      /**
       * 获取下拉框的数据选项
       */
      CtlGrid.prototype._getComboFilterData = function (easyuiCol) {
          if (easyuiCol.editMode === 'combo') {
              if (typeof easyuiCol.editParams.data === 'string') {
                  if (dict.hasOwnProperty(easyuiCol.editParams.data)) {
                      return dict[easyuiCol.editParams.data];
                  }
                  else if (formatter.hasOwnProperty(easyuiCol.editParams.data)) {
                      return formatter[easyuiCol.editParams.data];
                  }
                  else {
                      console.error('没有发现全局函数 YvanUI.formatter[dict].' +
                          easyuiCol.editParams.data);
                  }
              }
              else if (easyuiCol.editParams.data.constructor === Array) {
                  var editParams_1 = easyuiCol.editParams;
                  return _.map(editParams_1.data, function (item) {
                      return {
                          id: item[editParams_1.idField],
                          text: item[editParams_1.textField]
                      };
                  });
              }
          }
          var formatter$1 = easyuiCol.formatter;
          if (typeof easyuiCol.formatter === 'string') {
              // formatter 是字符串，从全局 YvanUI.formatter 找方法
              if (dict.hasOwnProperty(easyuiCol.formatter)) {
                  formatter$1 = dict[easyuiCol.formatter];
              }
              else if (formatter.hasOwnProperty(easyuiCol.formatter)) {
                  easyuiCol.formatter = formatter[easyuiCol.formatter];
              }
              else {
                  console.error('没有发现全局函数 YvanUI.formatter[dict].' + easyuiCol.editParams.data);
              }
          }
          if (formatter$1 && formatter$1.constructor === Array) {
              // formatter 是数组，就是下拉数据本身
              return formatter$1;
          }
      };
      /**
       * 第一次数据被渲染之后
       */
      CtlGrid.prototype._firstDataRendered = function () {
          YvEventDispatch(this.onFirstDataRendered, this, undefined);
      };
      /**
       * 接受更新
       * 状态位显示 OK, 删除 origin 数据, 并闪烁当前行
       */
      CtlGrid.prototype._acceptChanges = function (node) {
          if (node.origin) {
              node.cstate = 'ok';
              delete node.origin;
              this.flashRow(node);
              node.setDataValue('__ID__', _.uniqueId());
          }
      };
      /**
       * 清空所有状态，准备获取新数据
       * 当前编辑都应该清空, 勾选也应该清空
       */
      CtlGrid.prototype._clearCache = function () {
          this.checkedIds = [];
          this.gridApi.forEachNode(function (node) {
              delete node.cstate;
              delete node.origin;
          });
      };
      /**
       * 根据行，获取主键 ID, 当主键不存在时 返回 undefined
       */
      CtlGrid.prototype._getIdByRow = function (row) {
          if (!row)
              return;
          if (this.idField) {
              if (this.idField.constructor === Array) {
                  //联合组件，用valueSep分割
                  return _.map(this.idField, function (f) { return _.toString(row[f]); }).join(this.valueSep);
              }
              return row[this.idField];
          }
          console.error('表格没有设置主键！！');
          return undefined;
      };
      /**
       * 重新绑定数据源
       */
      CtlGrid.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvanDataSourceGrid(_this, _this.dataSource);
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      /**
       * 每次 AJAX 请求完毕之后会回调这里
       */
      CtlGrid.prototype._bindingComplete = function () {
          YvEventDispatch(this.onBindingComplete, this, undefined);
      };
      /**
       * 找到某行的 node, （一旦匹配到 condition 就停止）
       */
      CtlGrid.prototype._findNode = function (condition) {
          var _this = this;
          if (!condition) {
              //返回第一条被找到的数据
              condition = function () { return true; };
          }
          else if (typeof condition === 'string') {
              //以主键查找的方式
              var key_1 = condition;
              condition = function (n) {
                  return _this._getIdByRow(n.data) === key_1;
              };
          }
          else if (typeof condition === 'object') {
              //就是 node 对象, 直接返回
              return condition;
          }
          var me = this;
          var findNode = undefined;
          try {
              this.gridApi.forEachNode(function (node) {
                  if (condition.call(me, node)) {
                      findNode = node;
                      throw Error();
                  }
              });
          }
          catch (e) { }
          return findNode;
      };
      CtlGrid.prototype._cellKeyDown = function (param) {
          //event.stopPropagation();
          //event.preventDefault();
          //通知外部
          var r = YvEventDispatch(this.onKeyDown, this, param);
          if (r === true) {
              //已经被自定义函数处理掉
              return;
          }
          if (param.event.keyCode === 13) {
              param.event.stopPropagation();
              param.event.preventDefault();
              return;
          }
          if (param.event.keyCode === 27) {
              //按下 ESC 还原数据到 origin 状态, 并删除所有编辑形式
              if (param.node.origin) {
                  param.event.stopPropagation();
                  param.event.preventDefault();
                  var data = __assign(__assign({}, param.data), param.node.origin);
                  delete param.node.cstate;
                  delete param.node.origin;
                  param.node.updateData(data);
                  param.node.setDataValue('__ID__', _.uniqueId());
              }
          }
          //console.log('cellKeyDown', param);
      };
      CtlGrid.prototype._modelUpdated = function () {
          if (this.autoSizeColumns && this.gridApi) {
              this.gridApi.sizeColumnsToFit();
          }
      };
      CtlGrid.prototype._cellFocused = function (param) {
          YvEventDispatch(this.onCellFocused, this, param);
      };
      CtlGrid.prototype._cellClicked = function (param) {
          YvEventDispatch(this.onCellClicked, this, param);
      };
      CtlGrid.prototype._rowSelected = function (param) {
          var node = param.node;
          var selected = node.selected, id = node.id;
          if (!selected) {
              //行离开事件,查看是否有数据正在编辑，提交校验
              this._rowEditingStopped(id, param);
              return;
          }
          //触发 entity 改变
          if (_.size(this.entityName) > 0) {
              _.set(this.getModule(), this.entityName + '.selectedRow', param.data);
              //this.vcxt.module.$set(this.vcxt.module[this.entityName], "selectedRow", param.data);
          }
          //触发 onRowSelect 事件
          YvEventDispatch(this.onRowSelect, this, param.data);
      };
      CtlGrid.prototype._cellEditingStarted = function (param) {
          var rowId;
          if (param.node.rowPinned === 'top') {
              //在添加行上
              rowId = -1;
          }
          else if (!param.node.rowPinned) {
              //在数据行上
              rowId = param.node.id;
          }
          this._rowEditingStarted(rowId, param);
      };
      CtlGrid.prototype._cellEditingStopped = function (param) {
          //触发单元格校验事件
          if (this.saveOn !== 'editFinish') {
              //保存时机，是不是结束编辑后立刻保存
              return;
          }
          var origin = param.node.origin;
          if (!origin) {
              // 这一行没有进入过编辑模式
              return;
          }
          var data = _.cloneDeep(param.data);
          delete data['__ID__'];
          delete data['__CB__'];
          _.forOwn(origin, function (value, key) {
              if (typeof value === 'number') {
                  origin[key] = _.toString(value);
              }
          });
          _.forOwn(data, function (value, key) {
              if (typeof value === 'number') {
                  data[key] = _.toString(value);
              }
          });
          if (_.isEqual(origin, data)) {
              //相同，改变状态位 same
              param.node.cstate = 'same';
          }
          else {
              //不相同, 提交校验
              param.node.cstate = 'validate';
              if (this.dataSourceBind) {
                  if (this.dataSourceBind.updateSupport()) {
                      this.dataSourceBind._updateRow(param);
                  }
              }
              //console.log(this.dataSource, param.node)
              //setTimeout(() => {
              //    this._acceptChanges(param.node)
              //}, 2000)
          }
          param.node.setDataValue('__ID__', _.uniqueId());
      };
      CtlGrid.prototype._rowEditingStarted = function (rowId, param) {
          if (!param.node.origin) {
              // 以前从来没有编辑过这一行, 记录 origin
              var data = _.cloneDeep(param.data);
              delete data['__ID__'];
              delete data['__CB__'];
              param.node.origin = data;
          }
          param.node.cstate = 'editing';
          param.node.setDataValue('__ID__', _.uniqueId());
      };
      CtlGrid.prototype._rowEditingStopped = function (rowId, param) {
          if (this.saveOn !== 'rowChanged') {
              //保存时机，是不是行更改后立刻保存
              return;
          }
          var origin = param.node.origin;
          if (!origin) {
              // 这一行没有进入过编辑模式
              return;
          }
          var data = _.cloneDeep(param.data);
          delete data['__ID__'];
          delete data['__CB__'];
          _.forOwn(origin, function (value, key) {
              if (typeof value === 'number') {
                  origin[key] = _.toString(value);
              }
          });
          _.forOwn(data, function (value, key) {
              if (typeof value === 'number') {
                  data[key] = _.toString(value);
              }
          });
          if (_.isEqual(origin, data)) {
              //相同，改变状态位 same
              param.node.cstate = 'same';
          }
          else {
              //不相同, 提交校验
              param.node.cstate = 'validate';
              if (this.dataSourceBind) {
                  this.dataSourceBind._updateRow(param);
              }
              //console.log(this.dataSource, param.node)
              //setTimeout(() => {
              //    this._acceptChanges(param.node)
              //}, 2000)
          }
          param.node.setDataValue('__ID__', _.uniqueId());
      };
      /**
       * Tab键导航
       */
      CtlGrid.prototype._tabToNextCell = function (params) {
          var previousCell = params.previousCellPosition;
          var nextCellPosition = params.nextCellPosition;
          //tab 永不换行
          return __assign(__assign({}, nextCellPosition), { rowIndex: previousCell.rowIndex });
      };
      /**
       * 上下左右键导航
       */
      CtlGrid.prototype._navigateToNextCell = function (params) {
          var KEY_LEFT = 37;
          var KEY_UP = 38;
          var KEY_RIGHT = 39;
          var KEY_DOWN = 40;
          var previousCell = params.previousCellPosition;
          var suggestedNextCell = params.nextCellPosition;
          switch (params.key) {
              case KEY_UP: {
                  var nextRowIndex_1 = previousCell.rowIndex - 1;
                  if (nextRowIndex_1 < 0) {
                      // returning null means don't navigate
                      return null;
                  }
                  this.selectRow(function (node) { return node.rowIndex === nextRowIndex_1; });
                  return {
                      rowIndex: nextRowIndex_1,
                      column: previousCell.column,
                      floating: previousCell.floating
                  };
              }
              case KEY_DOWN: {
                  // return the cell below
                  var rowIndex_1 = previousCell.rowIndex + 1;
                  var renderedRowCount = this.gridApi.getModel().getRowCount();
                  if (rowIndex_1 >= renderedRowCount) {
                      // returning null means don't navigate
                      return null;
                  }
                  this.selectRow(function (node) { return node.rowIndex === rowIndex_1; });
                  return {
                      rowIndex: rowIndex_1,
                      column: previousCell.column,
                      floating: previousCell.floating
                  };
              }
              case KEY_LEFT:
              case KEY_RIGHT:
                  return suggestedNextCell;
              default:
                  throw 'this will never happen, navigation is always one of the 4 keys above';
          }
      };
      /**
       * 列设置计算
       */
      CtlGrid.prototype._gridCols = function (resultCols) {
          var _this = this;
          _.each(this.columns, function (column) {
              var easyuiCol = _.merge(__assign(__assign({}, _.clone(YvGridColumnProp)), { editParams: __assign({}, _.clone(YvGridColumnEditProp)) }), column);
              //=========================== 设计模式属性 ===========================
              // if (this._isDesignMode) {
              //     resultCols.push({
              //         suppressMovable: true,
              //         field: easyuiCol.field,
              //         headerName: easyuiCol.title,
              //         resizable: true,
              //         filter: false,
              //         editable: false,
              //         sortable: false,
              //         //unSortIcon: true,
              //         hide: false,
              //         width: easyuiCol.width,
              //         minWidth: easyuiCol.minwidth,
              //         maxWidth: easyuiCol.maxwidth
              //     });
              //     return;
              // }
              //=========================== 基本属性 ===========================
              var col = {
                  suppressMovable: true,
                  field: easyuiCol.field,
                  headerName: easyuiCol.title,
                  resizable: easyuiCol.resizable,
                  filter: false,
                  editable: false,
                  sortable: easyuiCol.sortable,
                  //unSortIcon: true,
                  hide: easyuiCol.hidden
              };
              if (easyuiCol.sortable) {
                  // 走服务端排序，客户端排序可以让其无效
                  col.comparator = function () {
                      return 0;
                  };
              }
              if (typeof easyuiCol.width !== 'undefined')
                  col.width = easyuiCol.width;
              if (typeof easyuiCol.minwidth !== 'undefined')
                  col.minWidth = easyuiCol.minwidth;
              if (typeof easyuiCol.maxwidth !== 'undefined')
                  col.maxWidth = easyuiCol.maxwidth;
              if (typeof easyuiCol.align !== 'undefined') {
                  col.cellClass = function (params) {
                      return ['yv-align-' + easyuiCol.align];
                  };
              }
              if (_.size(easyuiCol.field) > 0) {
                  col.tooltipField = easyuiCol.field;
              }
              //=========================== buttons 属性 ===========================
              if (easyuiCol.buttons) {
                  //col.cellRendererFramework = 'yvGridButton'
                  col.cellRenderer = 'CtlGridCellButton';
                  col.cellRendererParams = {
                      buttons: easyuiCol.buttons
                  };
              }
              //=========================== 编辑与formatter属性 ===========================
              var editParams = easyuiCol.editParams;
              var formatable = false;
              if (easyuiCol.editable) {
                  if (easyuiCol.editMode === 'checkbox') {
                      //勾选框编辑
                      formatable = false;
                      col.cellRenderer = 'CtlGridCellCheckbox';
                      col.cellRendererParams = {
                          editParams: easyuiCol.editParams,
                          on: editParams.on,
                          off: editParams.off,
                          onChange: function (newValue) {
                              YvEventDispatch(editParams.onValidate, _this, {
                                  value: newValue
                              });
                          },
                          onValidate: function (value) {
                              YvEventDispatch(editParams.onValidate, _this, {
                                  value: value
                              });
                          }
                      };
                      if (easyuiCol.editable) {
                          //允许编辑
                          _.assign(col, {
                              editable: true,
                              cellEditor: 'CtlGridEditorCombo',
                              cellEditorParams: {
                                  editParams: easyuiCol.editParams,
                                  options: [
                                      { id: editParams.on, text: '勾选' },
                                      { id: editParams.off, text: '不勾' }
                                  ],
                                  onChange: function (newValue) {
                                      YvEventDispatch(editParams.onValidate, _this, {
                                          value: newValue
                                      });
                                  },
                                  onValidate: function (value) {
                                      YvEventDispatch(editParams.onValidate, _this, {
                                          value: value
                                      });
                                  }
                              }
                          });
                      }
                  }
                  else if (easyuiCol.editMode === 'combo') {
                      //下拉框编辑
                      formatable = false;
                      _.assign(col, {
                          editable: true,
                          cellEditor: 'CtlGridEditorCombo',
                          cellEditorParams: {
                              editParams: easyuiCol.editParams,
                              options: _this._getComboFilterData(easyuiCol),
                              onChange: function (newValue) {
                                  YvEventDispatch(editParams.onValidate, _this, {
                                      value: newValue
                                  });
                              },
                              onValidate: function (value) {
                                  YvEventDispatch(editParams.onValidate, _this, {
                                      value: value
                                  });
                              }
                          }
                      });
                      //下拉框的 formatter 逻辑是固定的
                      var data_1 = _this._getComboFilterData(easyuiCol);
                      if (typeof data_1 === 'function') {
                          col.valueFormatter = function (params) {
                              return data_1(params.value);
                          };
                      }
                      else {
                          col.valueFormatter = function (params) {
                              if (_.size(params.data) <= 0)
                                  return;
                              var optionItem = _.find(data_1, function (item) {
                                  var id = _.toString(item['id']);
                                  return id && id === _.toString(params.value);
                              });
                              if (optionItem) {
                                  //找到text属性值
                                  return optionItem['text'];
                              }
                              return params.value;
                          };
                      }
                  }
                  else if (easyuiCol.editMode === 'area') {
                      //大型富文本框编辑
                      formatable = true;
                      _.assign(col, {
                          editable: true,
                          cellEditor: 'agLargeTextCellEditor',
                          cellEditorParams: {
                              editParams: easyuiCol.editParams,
                              maxLength: editParams.maxlength
                          }
                      });
                  }
                  else if (easyuiCol.editMode === 'text' || easyuiCol.editMode === 'number') {
                      //普通文本框编辑
                      formatable = true;
                      _.assign(col, {
                          editable: true,
                          cellEditor: 'CtlGridEditorText',
                          cellEditorParams: {
                              type: easyuiCol.editMode,
                              editParams: easyuiCol.editParams,
                              onChange: function (newValue) {
                                  YvEventDispatch(editParams.onValidate, _this, {
                                      value: newValue
                                  });
                              },
                              onValidate: function (value) {
                                  YvEventDispatch(editParams.onValidate, _this, {
                                      value: value
                                  });
                              },
                              onInput: function (e) {
                                  YvEventDispatch(editParams.onInput, _this, _this, {
                                      event: e
                                  });
                              }
                          }
                      });
                  }
                  else if (easyuiCol.editMode === 'date' || easyuiCol.editMode === 'datetime') {
                      formatable = true;
                      // _.assign(col, {
                      //     editable: true,
                      //     cellEditor: "YvGridEditorDate",
                      //     cellEditorParams: {
                      //         type: easyuiCol.editMode,
                      //         editParams: easyuiCol.editParams,
                      //         onChange: newValue => {
                      //             this.$yvDispatch(editParams.onValidate, newValue, this.getEditRow());
                      //         },
                      //         onValidate: value => {
                      //             this.$yvDispatch(editParams.onValidate, value, this.getEditRow());
                      //         },
                      //         onInput: e => {
                      //             this.$yvDispatch(editParams.onInput, e, this.getEditRow());
                      //         }
                      //     }
                      // });
                      console.error('not support date editor');
                  }
              }
              else {
                  //不允许编辑的情况，全都允许格式化
                  formatable = true;
              }
              //=========================== formatter属性 ===========================
              if (formatable) {
                  var data_2 = _this._getComboFilterData(easyuiCol);
                  if (data_2) {
                      //从下拉框逻辑中找到了固定映射关系
                      col.valueFormatter = function (params) {
                          if (_.size(params.data) <= 0)
                              return undefined;
                          var optionItem = _.find(data_2, function (item) {
                              var id = _.toString(item['id']);
                              return id && id === _.toString(params.value);
                          });
                          if (optionItem) {
                              //找到text属性值
                              return optionItem['text'];
                          }
                          return params.value;
                      };
                  }
                  else {
                      //以 function 方式获得显示逻辑
                      var formatter_1 = easyuiCol.formatter;
                      if (typeof easyuiCol.formatter === 'string') {
                          // formatter 是字符串，从全局 YvanUI.formatter 找方法
                          if (!formatter.hasOwnProperty(easyuiCol.formatter)) {
                              console.error('没有发现全局函数 YvanUI.formatter.' + easyuiCol.formatter);
                          }
                          else {
                              formatter_1 = formatter[easyuiCol.formatter];
                          }
                      }
                      if (typeof formatter_1 === 'function') {
                          //formatter 是函数，调用函数来显示
                          col.valueFormatter = function (params) {
                              if (_.size(params.data) <= 0)
                                  return undefined;
                              return formatter_1.call(_this, params.data[easyuiCol.field], _this, params.data);
                          };
                      }
                  }
              }
              //=========================== 过滤属性 ===========================
              if (_this.filterable && easyuiCol.filterable && !easyuiCol.hidden) {
                  var datas = _this._getComboFilterData(easyuiCol);
                  if (typeof datas === 'object') {
                      //下拉框过滤
                      _.assign(col, {
                          filter: 'CtlGridFilterSet',
                          //suppressMenu: true,
                          filterParams: {
                              data: datas,
                          },
                      });
                  }
                  else if (easyuiCol.editMode === 'number') {
                      //数字过滤
                      _.assign(col, {
                          filter: 'agNumberColumnFilter',
                          //suppressMenu: true,
                          filterParams: {
                              applyButton: true,
                              clearButton: true,
                              suppressAndOrCondition: true,
                              filterOptions: [
                                  // 服务器已经设置条件，浏览器不进行实际比对
                                  { displayKey: 'equals', displayName: '等于', test: function () { return true; } },
                                  { displayKey: 'notEqual', displayName: '不等于', test: function () { return true; } },
                                  { displayKey: 'lessThan', displayName: '小于', test: function () { return true; } },
                                  { displayKey: 'greaterThan', displayName: '大于', test: function () { return true; } },
                                  { displayKey: 'lessThanOrEqual', displayName: '小于等于', test: function () { return true; } },
                                  { displayKey: 'greaterThanOrEqual', displayName: '大于等于', test: function () { return true; } },
                                  { displayKey: 'inRange', displayName: '范围', test: function () { return true; } },
                              ]
                          }
                      });
                  }
                  else if (easyuiCol.editMode === 'date' || easyuiCol.editMode === 'datetime') {
                      //日期筛选
                      _.assign(col, {
                          filter: 'agDateColumnFilter',
                          filterParams: {
                              applyButton: true,
                              clearButton: true,
                              filterOptions: ['inRange'],
                              suppressAndOrCondition: true,
                              inRangeInclusive: true,
                              comparator: function (v1, v2) {
                                  // 服务器已经设置条件，浏览器不进行实际比对
                                  // 0 的情况，一定要包含 inRangeInclusive 条件
                                  return 0;
                              }
                          }
                      });
                  }
                  else {
                      //其他情况都是字符串筛选
                      _.assign(col, {
                          filter: 'agTextColumnFilter',
                          filterParams: {
                              applyButton: true,
                              clearButton: true,
                              filterOptions: ['startsWith', 'equals', 'contains'],
                              suppressAndOrCondition: true,
                              textCustomComparator: function () {
                                  // 服务器已经设置条件，浏览器不进行实际比对
                                  return true;
                              }
                          }
                      });
                  }
              }
              //=========================== 渲染属性 ===========================
              if (typeof easyuiCol.onStyle === 'function') {
                  _.assign(col, {
                      cellStyle: function (param) {
                          return easyuiCol.onStyle.call(_this, param);
                      }
                  });
              }
              resultCols.push(col);
          });
      };
      return CtlGrid;
  }(CtlBase));
  //# sourceMappingURL=CtlGrid.js.map

  var CtlSwitch = /** @class */ (function (_super) {
      __extends(CtlSwitch, _super);
      function CtlSwitch() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlSwitch.create = function (module, vjson) {
          var that = new CtlSwitch(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlSwitchDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              view: 'switch',
              on: {}
          });
          return that;
      };
      /**
       * 交换状态
       */
      CtlSwitch.prototype.toggle = function () {
          this._webix.toggle();
      };
      Object.defineProperty(CtlSwitch.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValueHere(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlSwitch;
  }(CtlInput));
  //# sourceMappingURL=CtlSwitch.js.map

  var CtlNumber = /** @class */ (function (_super) {
      __extends(CtlNumber, _super);
      function CtlNumber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlNumber.create = function (module, vjson) {
          var that = new CtlNumber(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlNumberDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['precision']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              view: 'text',
              type: 'number'
              // attr: {
              //     min: "0.00",
              //     step: "0.01"
              // }
          });
          return that;
      };
      CtlNumber.prototype._testNumber = function (value) {
          if (this.precision && this.precision > 0) {
              value = value.replace(/[^\d.-]/g, ''); //清除"数字"和"."以外的字符
              if (value.length > 1 && value.indexOf('.') > 1) {
                  var t = void 0;
                  while (1) {
                      t = value;
                      value = value.replace(/^0/g, '');
                      if (t.length === value.length) {
                          break;
                      }
                  }
                  //value = value.replace(/^0/g, '') //验证第一个字符不是0.
              }
              value = value.replace(/^\./g, ''); //验证第一个字符是数字而不是.
              value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的.
              value = value
                  .replace('.', '$#$')
                  .replace(/\./g, '')
                  .replace('$#$', '.'); //只允许输入一个小数点
              var r = eval('/^(\\-)*(\\d+)\\.(\\d{0,' + this.precision + '}).*$/');
              value = value.replace(r, '$1$2.$3'); //只能输入固定位数的小数
          }
          else {
              value = value.replace(/[^\d-]/g, ''); //清除"数字"和"-"以外的字符
              if (value.length > 1) {
                  value = value.replace(/^0/g, ''); //验证第一个字符不是0.
              }
              if (value.startsWith('-')) {
                  value = '-' + value.substr(1).replace(/[^\d]/g, '');
              }
              else {
                  value = value.replace(/[^\d]/g, '');
              }
          }
          return value;
      };
      CtlNumber.prototype.onInputEvent = function (e) {
          var value = e.target.value;
          e.target.value = this._testNumber(value);
          _super.prototype.onInputEvent.call(this, e);
      };
      Object.defineProperty(CtlNumber.prototype, "value", {
          /**
           * 获取值(可能取到空值)
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值 (如果不符合数字或小数位数格式，会被清空)
           */
          set: function (nv) {
              nv = this._testNumber(nv);
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlNumber;
  }(CtlInput));
  //# sourceMappingURL=CtlNumber.js.map

  var CtlRadio = /** @class */ (function (_super) {
      __extends(CtlRadio, _super);
      function CtlRadio() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlRadio.create = function (module, vjson) {
          var that = new CtlRadio(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlRadioDefault);
          // 基础属性先执行
          that._create(vjson, that);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['options']);
          // 将 yvanProp 合并至当前 Ctl 对象
          _.assign(that, yvanProp);
          // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
          _.merge(vjson, that._webixConfig, {
              view: 'radio',
              on: {}
          });
          return that;
      };
      Object.defineProperty(CtlRadio.prototype, "options", {
          /**
           * 修改下拉选项
           */
          set: function (nv) {
              var value = nv.map(function (item) {
                  return { id: item.id, value: item.text };
              });
              if (!this._webix) {
                  _.merge(this._webixConfig, {
                      options: value
                  });
                  return;
              }
              this._webix.define('options', value);
              this._webix.refresh();
          },
          enumerable: true,
          configurable: true
      });
      return CtlRadio;
  }(CtlInput));
  //# sourceMappingURL=CtlRadio.js.map

  webix.protoUI({
      name: 'codemirror-editor',
      defaults: {},
      $init: function (config) {
          this.$view.innerHTML =
              "<textarea style='width:100%;height:100%;'></textarea>";
          this._waitEditor = webix.promise.defer();
          this.$ready.push(this._render_cm_editor);
          _.extend(this.config, config);
          if (config.on && typeof config.on.onInited === 'function') {
              config.on.onInited.call(this);
          }
      },
      _render_cm_editor: function () {
          this._render_when_ready();
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
      _render_when_ready: function () {
          var CodeMirror = _.get(window, 'CodeMirror');
          this._editor = CodeMirror.fromTextArea(this.$view.firstChild, __assign({}, this.config));
          this._waitEditor.resolve(this._editor);
          this.setValue(this.config.value);
          if (this._focus_await) {
              this.focus();
          }
      },
      _set_inner_size: function () {
          if (!this._editor || !this.$width)
              return;
          this._updateScrollSize();
          this._editor.scrollTo(0, 0); //force repaint, mandatory for IE
      },
      _updateScrollSize: function () {
          var box = this._editor.getWrapperElement();
          var height = (this.$height || 0) + 'px';
          box.style.height = height;
          box.style.width = (this.$width || 0) + 'px';
          var scroll = this._editor.getScrollerElement();
          if (scroll.style.height !== height) {
              scroll.style.height = height;
              this._editor.refresh();
          }
      },
      $setSize: function (x, y) {
          if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
              this._set_inner_size();
          }
      },
      setValue: function (value) {
          if (!value && value !== 0) {
              value = '';
          }
          this.config.value = value;
          if (this._editor) {
              this._editor.setValue(value);
              //by default - clear editor's undo history when setting new value
              if (!this.config.preserveUndoHistory) {
                  this._editor.clearHistory();
              }
              this._updateScrollSize();
          }
      },
      getValue: function () {
          return this._editor ? this._editor.getValue() : this.config.value;
      },
      focus: function () {
          this._focus_await = true;
          if (this._editor) {
              this._editor.focus();
          }
      },
      getEditor: function (waitEditor) {
          return waitEditor ? this._waitEditor : this._editor;
      },
      // //undo, redo, etc
      // undo: function () {
      //     this._editor.undo();
      // },
      // redo: function () {
      //     this._editor.redo();
      // },
      undoLength: function () {
          return this._editor.historySize().undo;
      }
  }, webix.ui.view);
  var CtlCodeMirror = /** @class */ (function (_super) {
      __extends(CtlCodeMirror, _super);
      function CtlCodeMirror() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlCodeMirror.create = function (module, vjson) {
          var that = new CtlCodeMirror(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlCodeMirrorDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  }
              }
          });
          return that;
      };
      /**
       * 撤销
       */
      CtlCodeMirror.prototype.undo = function () {
          this._webix.getEditor().undo();
      };
      /**
       * 重做
       */
      CtlCodeMirror.prototype.redo = function () {
          this._webix.getEditor().redo();
      };
      /**
       * 添加内容
       */
      CtlCodeMirror.prototype.append = function (msg) {
          var editor = this._webix.getEditor();
          var CodeMirror = _.get(window, 'CodeMirror');
          editor.replaceRange(msg, CodeMirror.Pos(editor.lastLine()));
      };
      /**
       * 移动光标到文档开始处
       */
      CtlCodeMirror.prototype.goDocStart = function () {
          this._webix.getEditor().execCommand('goDocStart');
      };
      /**
       * 移动光标到文档结束处
       */
      CtlCodeMirror.prototype.goDocEnd = function () {
          this.execCommand('goDocEnd');
      };
      /**
       * 移动光标到行开始处
       */
      CtlCodeMirror.prototype.goLineStart = function () {
          this.execCommand('goLineStart');
      };
      /**
       * 移动光标到行结束处
       */
      CtlCodeMirror.prototype.goLineEnd = function () {
          this.execCommand('goLineEnd');
      };
      /**
       * 移动光标到上一行
       */
      CtlCodeMirror.prototype.goLineUp = function () {
          this.execCommand('goLineUp');
      };
      /**
       * 移动光标到下一行
       */
      CtlCodeMirror.prototype.goLineDown = function () {
          this.execCommand('goLineDown');
      };
      /**
       * 获取对应行的内容
       */
      CtlCodeMirror.prototype.getLine = function (n) {
          return this._webix.getEditor().getLine(n);
      };
      /**
       * 设置scroll到position位置
       */
      CtlCodeMirror.prototype.scrollTo = function (x, y) {
          this._webix.getEditor().scrollTo(x, y);
      };
      CtlCodeMirror.prototype.clear = function () {
          this.value = '';
      };
      /**
       * 执行命令
       */
      CtlCodeMirror.prototype.execCommand = function (cmd) {
          return this._webix.getEditor().execCommand(cmd);
      };
      /**
       * 刷新编辑器
       */
      CtlCodeMirror.prototype.refresh = function () {
          this._webix.getEditor().refresh();
      };
      Object.defineProperty(CtlCodeMirror.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      return CtlCodeMirror;
  }(CtlBase));
  //# sourceMappingURL=CtlCodeMirror.js.map

  var CtlSidebar = /** @class */ (function (_super) {
      __extends(CtlSidebar, _super);
      function CtlSidebar() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlSidebar.create = function (module, vjson) {
          var that = new CtlSidebar(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlSidebarDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              // 'data',
              'dataSource',
              'onNodeClick',
              'onDataComplete'
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              select: true,
              filterMode: {
                  showSubItems: false
              },
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  },
                  onItemClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeClick, that, item);
                  },
                  onItemDblClick: function (id) {
                      var item = this.getItem(id);
                      YvEventDispatch(that.onNodeDblClick, that, item);
                  }
              }
          });
          return that;
      };
      /**
       * 拼音方式过滤查找树
       */
      CtlSidebar.prototype.filter = function (nv) {
          if (!nv) {
              this._webix.filter('');
              return;
          }
          this._webix.filter(function (node) {
              var value = node.value;
              var nodePy = getFirstPinyin(value).toLowerCase();
              return nodePy.indexOf(nv.toLowerCase()) >= 0 || value.toLowerCase().indexOf(nv) >= 0;
          });
      };
      Object.defineProperty(CtlSidebar.prototype, "value", {
          /**
           * 获取值
           */
          get: function () {
              if (!this._webix) {
                  return this._webixConfig.value;
              }
              return this._webix.getValue();
          },
          /**
           * 设置值
           */
          set: function (nv) {
              if (!this._webix) {
                  this._webixConfig.value = nv;
              }
              else {
                  this._webix.setValue(nv);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlSidebar.prototype, "dataReal", {
          /**
           * 设置数据
           */
          set: function (nv) {
              // dataSource call back
              this._webix.clearAll();
              this._webix.parse(nv);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlSidebar.prototype, "dataSource", {
          /**
           * 获取数据源设置
           */
          get: function () {
              return this._dataSource;
          },
          /**
           * 设置数据源
           */
          set: function (nv) {
              this._dataSource = nv;
              if (this._module.loadFinished) {
                  // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                  // onLoad 之前都不需要主动触发 _rebindDataSource
                  this._rebindDataSource();
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 重新请求数据
       */
      CtlSidebar.prototype.reload = function () {
          if (this.dataSourceBind && this.dataSourceBind.reload) {
              this.dataSourceBind.reload();
          }
      };
      /**
       * 展开或收起状态互换
       */
      CtlSidebar.prototype.toggle = function () {
          return this._webix.toggle();
      };
      /**
       * 是否折叠状态
       */
      CtlSidebar.prototype.isCollapsed = function () {
          return this._webix.config.collapsed;
      };
      //重新绑定数据源
      CtlSidebar.prototype._rebindDataSource = function () {
          var _this = this;
          var innerMethod = function () {
              if (_this.dataSourceBind) {
                  _this.dataSourceBind.destory();
                  _this.dataSourceBind = undefined;
              }
              if (_this._webix && _this._module) {
                  _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                  _this.dataSourceBind.init();
              }
          };
          if (!this._module.loadFinished) {
              // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
              _.defer(innerMethod);
          }
          else {
              // 否则实时调用 rebind
              innerMethod();
          }
      };
      CtlSidebar.prototype._dataSourceProcess = function (data) {
          if (!this.dataSource ||
              _.isArray(this.dataSource) ||
              _.isFunction(this.dataSource)) {
              return data;
          }
          if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
              return data;
          }
          if (!this.dataSource.parentField ||
              !this.dataSource.displayField ||
              !this.dataSource.valueField) {
              return data;
          }
          var idField = this.dataSource.valueField;
          var textField = this.dataSource.displayField;
          var parentField = this.dataSource.parentField;
          data = _.cloneDeep(data);
          // 第一遍扫描, 建立映射关系
          var nodeMap = {};
          var rootNode = [];
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              nodeMap[row[idField]] = {
                  value: row[textField],
                  id: row[idField],
                  row: row
              };
              if (row.icon) {
                  nodeMap[row[idField]].icon = row.icon;
              }
          }
          // 第二遍扫描，建立父子关系
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              var parent_1 = row[parentField];
              var id = row[idField];
              if (!parent_1 || parent_1 === '0') {
                  // 没有父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
              else if (nodeMap.hasOwnProperty(parent_1)) {
                  //找到父亲
                  var parentNode = nodeMap[parent_1];
                  if (parentNode.hasOwnProperty('data')) {
                      parentNode.data.push(nodeMap[id]);
                  }
                  else {
                      parentNode.data = [nodeMap[id]];
                  }
              }
              else {
                  // 没有找到父亲，作为根节点
                  rootNode.push(nodeMap[id]);
              }
          }
          return rootNode;
      };
      //刷新状态时，自动重绑数据源
      CtlSidebar.prototype.refreshState = function () {
          _super.prototype.refreshState.call(this);
          this._rebindDataSource();
      };
      /**
       * 根据id获取一行数据
       */
      CtlSidebar.prototype.getItem = function (id) {
          return this._webix.getItem(id);
      };
      /**
       * 选中一行
       * @param id
       */
      CtlSidebar.prototype.select = function (id) {
          // this._webix.showItem(id);
          var pid = id;
          while (pid) {
              this._webix.open(pid);
              pid = this._webix.getParentId(pid);
          }
          this._webix.select(id);
      };
      return CtlSidebar;
  }(CtlBase));
  //# sourceMappingURL=CtlSidebar.js.map

  webix.protoUI({
      name: 'xterm',
      defaults: {},
      $init: function (config) {
          this._domid = webix.uid();
          this.$view.innerHTML = "<div id='" + this._domid + "' style='width:100%;height:100%;'></div>";
          this.$ready.push(this._ready);
          _.extend(this.config, config);
          if (config.on && typeof config.on.onInited === 'function') {
              config.on.onInited.call(this);
          }
      },
      _ready: function () {
          this.isXtermLoad = false;
      },
      _set_inner_size: function () {
          if (!this._term || !this.$width)
              return;
          this._updateScrollSize();
          // this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
      },
      destructor: function () {
          if (this.$destructed) {
              return;
          }
          this.$destructed = true;
          if (this.config.on && typeof this.config.on.onDestruct === 'function') {
              this.config.on.onDestruct.call(this);
          }
      },
      _updateScrollSize: function () {
          var box = this._term.element;
          var height = (this.$height || 0) + 'px';
          box.style.height = height;
          box.style.width = (this.$width || 0) + 'px';
          if (this._fitAddon) {
              this._fitAddon.fit();
              this._updateXtermInfo();
          }
      },
      _updateXtermInfo: function () {
          var info = {
              "xtermCols": this._term.cols,
              "xtermRows": this._term.rows,
              "xtermWp": this.$width,
              "xtermHp": this.$height
          };
          this.wrapper.xtermInfo = info;
          if (this.wrapper._connection) {
              this.wrapper._resizeClientData(info);
          }
      },
      $setSize: function (x, y) {
          var _this = this;
          if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
              _.defer(function () {
                  _this._set_inner_size();
                  if (_this.isXtermLoad == false) {
                      _this.isXtermLoad = true;
                      //@ts-ignore
                      require(['xterm', 'xterm-addon-fit'], function (xterm, addon) {
                          var term = new xterm.Terminal(_this.config.termConfig);
                          if (_this.wrapper.allowInput) {
                              term.onData(function (data) {
                                  _this.wrapper._sendClientData(data);
                              });
                          }
                          var fitAddon = new addon.FitAddon();
                          term.loadAddon(fitAddon);
                          term.open(_this.$view.firstChild);
                          fitAddon.fit();
                          _this._term = term;
                          _this._fitAddon = fitAddon;
                          _this._updateXtermInfo();
                          if (_this.wrapper._shouldConnectUrl) {
                              _this.wrapper.connectHost(_this.wrapper._shouldConnectUrl);
                              delete _this.wrapper._shouldConnectUrl;
                          }
                      });
                  }
              });
          }
      }
  }, webix.ui.view);
  var CtlXterm = /** @class */ (function (_super) {
      __extends(CtlXterm, _super);
      function CtlXterm() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlXterm.create = function (module, vjson) {
          var that = new CtlXterm(vjson);
          that._module = module;
          _.defaultsDeep(vjson, CtlXtermDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, [
              'value',
              'allowInput',
              'onOpen',
              'onClose',
          ]);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                      this.wrapper = that;
                  },
                  onDestruct: function () {
                      that.connectionClose();
                      that.removeHandle();
                  }
              }
          });
          return that;
      };
      Object.defineProperty(CtlXterm.prototype, "term", {
          /**
           * 获取终端
           */
          get: function () {
              return this._webix._term;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CtlXterm.prototype, "fitAddon", {
          /**
           * 获取填充插件
           */
          get: function () {
              return this._webix._fitAddon;
          },
          enumerable: true,
          configurable: true
      });
      CtlXterm.prototype.clear = function () {
          this.term.clear();
      };
      CtlXterm.prototype.connectHost = function (host) {
          if (!this.term) {
              this._shouldConnectUrl = host;
              return;
          }
          if (!this._connection) {
              var hostUrl = host;
              if (hostUrl.indexOf("?") === -1) {
                  hostUrl = hostUrl + "?" + qs.stringify(this.xtermInfo);
              }
              else {
                  var params = hostUrl.slice(hostUrl.indexOf("?") + 1);
                  if (params.length > 0) {
                      hostUrl = hostUrl + "&" + qs.stringify(this.xtermInfo);
                  }
                  hostUrl += qs.stringify(this.xtermInfo);
              }
              this._connection = new WebSocket(hostUrl);
              this._connection.onopen = this._onSocketOpen.bind(this);
              this._connection.onmessage = this._onSocketMessage.bind(this);
              this._connection.onerror = this._onSocketError.bind(this);
              this._connection.onclose = this._onSocketClose.bind(this);
          }
          else {
              this.term.write('Error: WebSocket Not Supported\r\n');
          }
      };
      CtlXterm.prototype.sendMessage = function (msg) {
          this._sendClientData(msg);
      };
      CtlXterm.prototype.connectionClose = function () {
          if (this._connection) {
              console.log('WebSocket closed', this._connection);
              this._connection.close();
          }
      };
      CtlXterm.prototype._onSocketOpen = function () {
          this.term.write('连接已建立，正在等待数据...\r\n');
          if (this.onOpen) {
              YvEventDispatch(this.onOpen, this, undefined);
          }
          this._sendInitData({ operate: 'connect' });
      };
      CtlXterm.prototype._onSocketMessage = function (msg) {
          var data = msg.data.toString();
          this.term.write(data);
      };
      CtlXterm.prototype._onSocketClose = function () {
          if (this._webix) {
              this.term.write("\r\n连接已关闭\r\n");
              if (this.onClose) {
                  YvEventDispatch(this.onClose, this, undefined);
              }
          }
          this._connection = undefined;
      };
      CtlXterm.prototype._onSocketError = function () {
          this.term.write("\r\n连接发生异常\r\n");
      };
      CtlXterm.prototype._sendInitData = function (options) {
          if (!this._connection) {
              console.error('_connection 没有初始化');
              return;
          }
          //连接参数
          this._connection.send(JSON.stringify(options));
      };
      CtlXterm.prototype._resizeClientData = function (data) {
          if (!this._connection) {
              console.error('_connection 没有初始化');
              return;
          }
          //发送指令
          this._connection.send(JSON.stringify(__assign({ "operate": "resize" }, data)));
      };
      CtlXterm.prototype._sendClientData = function (data) {
          if (!this._connection) {
              console.error('_connection 没有初始化');
              return;
          }
          //发送指令
          this._connection.send(JSON.stringify({ "operate": "command", "command": data }));
      };
      return CtlXterm;
  }(CtlBase));
  //# sourceMappingURL=CtlXterm.js.map

  webix.protoUI({
      name: 'xconsolelog',
      defaults: {},
      $init: function (config) {
          this._domid = webix.uid();
          this.$view.innerHTML = "<div id='" + this._domid + "' class=\"vc-log\"></div>";
          this.$ready.push(this._ready);
          _$1.extend(this.config, config);
          if (config.on && typeof config.on.onInited === 'function') {
              config.on.onInited.call(this);
          }
      },
      _ready: function () {
      },
      _set_inner_size: function () {
          if (!this._term || !this.$width)
              return;
          this._updateScrollSize();
          // this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
      },
      _updateScrollSize: function () {
          var box = this._term.element;
          var height = (this.$height || 0) + 'px';
          box.style.height = height;
          box.style.width = (this.$width || 0) + 'px';
      },
      $setSize: function (x, y) {
          if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
              this._set_inner_size();
          }
      }
  }, webix.ui.view);
  var CtlConsoleLog = /** @class */ (function (_super) {
      __extends(CtlConsoleLog, _super);
      function CtlConsoleLog() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._realHtml = new Array();
          _this.realRender = _$1.debounce(function () {
              $(_this._webix.$view).find('.vc-log').append(_this._realHtml.join(''));
              _this._realHtml = [];
          });
          return _this;
      }
      CtlConsoleLog.create = function (module, vjson) {
          var that = new CtlConsoleLog(vjson);
          that._module = module;
          _$1.defaultsDeep(vjson, CtlConsoleLogDefault);
          var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
          // 将 vjson 存至 _webixConfig
          that._webixConfig = vjson;
          // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
          _$1.assign(that, yvanProp);
          // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
          _$1.merge(vjson, that._webixConfig, {
              on: {
                  onInited: function () {
                      var _this = this;
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                      _$1.defer(function () {
                          $(_this.$view).on('click', '.vc-fold', function (e) {
                              that.vcfoldclick(this);
                          });
                      });
                  },
                  onAfterDelete: function () {
                      that.removeHandle();
                  }
              }
          });
          return that;
      };
      /**
       * @param logs 需要打印的json
       */
      CtlConsoleLog.prototype.printLog = function (logs) {
          var logHtml = '<div class="vc-item">';
          if (!logs) {
              logHtml += '<div><i class="vc-code-string">undefined</i></div>';
          }
          else {
              logHtml += this.log2html(logs);
          }
          logHtml += "</div>";
          this.renderDom(logHtml);
      };
      CtlConsoleLog.prototype.renderDom = function (domHtml) {
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
      };
      /**
        * 递归生成html
        */
      CtlConsoleLog.prototype.log2html = function (params) {
          if (this.isArray(params) || this.isObject(params)) {
              return this.obj2html(params);
          }
          else if (this.isNumber(params) || this.isBoolean(params)) {
              return '<div><i class="vc-code-number">' + params + '</i></div>';
          }
          else {
              return '<div><i class="vc-code-string">"' + params.toString() + '"</i></div>';
          }
      };
      CtlConsoleLog.prototype.obj2html = function (params, title) {
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
          }
          else {
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
                  }
                  else if (this.isNumber(val) || this.isBoolean(val)) {
                      obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-number">' + val + '</i></div>';
                  }
                  else {
                      obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-string">"' + val + '"</i></div>';
                  }
              }
          }
          else if (this.isArray(params)) {
              for (var i = 0; i < params.length; i++) {
                  obj2htmlContent += '<div>' + this.obj2html(params[i]) + '</div>';
              }
          }
          obj2htmlContent += '</div>';
          return obj2htmlContent;
      };
      /**
       * div打开关闭
       */
      CtlConsoleLog.prototype.vcfoldclick = function (params) {
          var vcFoldElements = params.parentElement.children;
          var vcFoldContent = vcFoldElements[vcFoldElements.length - 1];
          if (vcFoldContent.classList.contains("vc-hidden")) {
              vcFoldContent.classList.remove("vc-hidden");
          }
          else {
              vcFoldContent.classList.add("vc-hidden");
          }
      };
      /**
     * 搜索并打开div
     */
      CtlConsoleLog.prototype.searchText = function (inputValue) {
          var items;
          for (var index = 0; index < this._webix.$view.children.length; index++) {
              var element = this._webix.$view.children[index];
              if (element.classList.contains("vc-log")) {
                  items = element;
              }
          }
          this.removeSelected(items);
          if (!inputValue) {
              return;
          }
          this.itemContainsText(items, inputValue);
      };
      CtlConsoleLog.prototype.itemContainsText = function (params, inputValue) {
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
                  this.itemContainsText(item, inputValue);
              }
          }
      };
      CtlConsoleLog.prototype.removeSelected = function (params) {
          for (var i = 0; i < params.children.length; i++) {
              var item = params.children[i];
              item.classList.remove("vc-code-string-selected");
              this.removeSelected(item);
          }
      };
      /**
     * 全部清空
     */
      CtlConsoleLog.prototype.vcClearAll = function () {
          var vcLog = $('#' + this._webix._domid)[0];
          vcLog.innerHTML = '';
      };
      /**
     * 全部收起
     */
      CtlConsoleLog.prototype.vcCloseAll = function () {
          var vcLog = $('#' + this._webix._domid)[0];
          this.closeOrOpen(vcLog, false);
      };
      /**
       * 全部展开
       */
      CtlConsoleLog.prototype.vcOpenAll = function () {
          var vcLog = $('#' + this._webix._domid)[0];
          this.closeOrOpen(vcLog, true);
          // var vvv = _.cloneDeepWith(vcLog, function customizer(value) {
          //   if (_.isElement(value)) {
          //     return value.cloneNode(true);
          //   }
          // });
          // this.closeOrOpen(vvv, true);
          // vcLog.innerHTML = vvv.innerHTML;
      };
      CtlConsoleLog.prototype.closeOrOpen = function (items, isOpen) {
          for (var i = 0; i < items.children.length; i++) {
              var item = items.children[i];
              if (item.classList.contains("vc-fold-content")) {
                  if (isOpen) {
                      item.classList.remove("vc-hidden");
                  }
                  else {
                      item.classList.add("vc-hidden");
                  }
              }
              this.closeOrOpen(item, isOpen);
          }
      };
      /**
       * tools
       */
      CtlConsoleLog.prototype.isNumber = function (value) {
          return Object.prototype.toString.call(value) == '[object Number]';
      };
      CtlConsoleLog.prototype.isString = function (value) {
          return Object.prototype.toString.call(value) == '[object String]';
      };
      CtlConsoleLog.prototype.isArray = function (value) {
          return Object.prototype.toString.call(value) == '[object Array]';
      };
      CtlConsoleLog.prototype.isBoolean = function (value) {
          return Object.prototype.toString.call(value) == '[object Boolean]';
      };
      CtlConsoleLog.prototype.isUndefined = function (value) {
          return value === undefined;
      };
      CtlConsoleLog.prototype.isNull = function (value) {
          return value === null;
      };
      CtlConsoleLog.prototype.isSymbol = function (value) {
          return Object.prototype.toString.call(value) == '[object Symbol]';
      };
      CtlConsoleLog.prototype.isFunction = function (value) {
          return Object.prototype.toString.call(value) == '[object Function]';
      };
      CtlConsoleLog.prototype.isObject = function (value) {
          return (Object.prototype.toString.call(value) == '[object Object]' ||
              // if it isn't a primitive value, then it is a common object
              (!this.isNumber(value) &&
                  !this.isString(value) &&
                  !this.isBoolean(value) &&
                  !this.isArray(value) &&
                  !this.isNull(value) &&
                  !this.isFunction(value) &&
                  !this.isUndefined(value) &&
                  !this.isSymbol(value)));
      };
      /**
     * Simple JSON stringify, stringify top level key-value
     */
      CtlConsoleLog.prototype.JSONStringify = function (stringObject) {
          if (!this.isObject(stringObject) && !this.isArray(stringObject)) {
              return JSON.stringify(stringObject);
          }
          var prefix = '{', suffix = '}';
          if (this.isArray(stringObject)) {
              prefix = '[';
              suffix = ']';
          }
          var str = prefix;
          var keys = this.getObjAllKeys(stringObject);
          for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = stringObject[key];
              try {
                  // key
                  if (!this.isArray(stringObject)) {
                      if (this.isObject(key) || this.isArray(key) || this.isSymbol(key)) {
                          str += Object.prototype.toString.call(key);
                      }
                      else {
                          str += key;
                      }
                      str += ': ';
                  }
                  // value
                  if (this.isArray(value)) {
                      str += 'Array[' + value.length + ']';
                  }
                  else if (this.isObject(value) || this.isSymbol(value) || this.isFunction(value)) {
                      str += Object.prototype.toString.call(value);
                  }
                  else {
                      str += JSON.stringify(value);
                  }
                  if (i < keys.length - 1) {
                      str += ', ';
                  }
              }
              catch (e) {
                  continue;
              }
          }
          str += suffix;
          return str;
      };
      /**
     * get an object's all keys ignore whether they are not enumerable
     */
      CtlConsoleLog.prototype.getObjAllKeys = function (obj) {
          if (!this.isObject(obj) && !this.isArray(obj)) {
              return [];
          }
          if (this.isArray(obj)) {
              var m_1 = [];
              obj.forEach(function (_, index) {
                  m_1.push(index);
              });
              return m_1;
          }
          return Object.getOwnPropertyNames(obj).sort();
      };
      /**
       * get an object's prototype name
       */
      CtlConsoleLog.prototype.getObjName = function (obj) {
          return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '');
      };
      return CtlConsoleLog;
  }(CtlBase));
  //# sourceMappingURL=CtlConsoleLog.js.map

  // export const webix = require("../webix/webix");
  webix.i18n.setLocale('zh-CN');
  _.set(window, 'webix', webix);
  /**
   * 深度遍历 vjson
   * @param vjson 视图JSON
   * @param resolver 分析函数
   * @return 记录 resolver 方法返回 true 时，对象的访问路径
   */
  function deepTravVJson(vjson, resolver) {
      var markerList = [];
      deepTrav1(vjson, resolver, markerList);
      return markerList;
  }
  function deepTrav1(obj, resolver, marker) {
      var isMarker = resolver(obj);
      if (marker && isMarker === true) {
          marker.unshift({ id: 0, keyName: '', object: obj });
      }
      _.forOwn(obj, function (value, key) {
          if (typeof value !== 'object') {
              return;
          }
          if (_.has(obj, 'view') && obj.view === 'toolbar') {
              if (key === 'dataSource' || key === 'suggest' || key === 'options') {
                  return;
              }
          }
          else {
              // 模型、数据、数据源不扫描
              if (key === 'data' ||
                  key === 'dataSource' ||
                  key === 'suggest' ||
                  key === 'options') {
                  return;
              }
          }
          //事件不扫描
          if (key === 'on' && _.isObject(value)) {
              return;
          }
          if (_.startsWith(key, 'on') && _.size(key) > 2) {
              return;
          }
          var isMarkerChild = deepTrav1(value, resolver, marker);
          if (marker && isMarkerChild === true) {
              isMarker = true;
              marker.unshift({ id: obj.id, keyName: key, object: value });
          }
      });
      // 删除作废对象
      _.remove(obj, function (v) { return v && v.isFiltered; });
      return isMarker;
  }
  /**
   * 根据 vjson 中的 ctlName, 合并属性
   * @param vjson 原始 vjson 视图
   * @param ctlOption 要被扩展的 ctlName 属性对
   */
  function viewExtend(vjson, ctlOption) {
      // 收集所有 ctlName 属性，放到收集器的 collector.ctls
      // 收集所有 entityName 属性，放到收集器的 collector.entity
      var collector = {
          ctls: {}
      };
      deepTravVJson(vjson, function (obj) {
          if (obj.ctlName) {
              _.set(collector.ctls, obj.ctlName, obj);
          }
      });
      _.forOwn(ctlOption, function (extendVJson, ctlName) {
          if (_.has(collector.ctls, ctlName)) {
              _.merge(_.get(collector.ctls, ctlName), extendVJson);
          }
      });
      return vjson;
  }
  var $internalHooks = ['data', 'destory', 'watches', 'computed'];
  /**
   * 收集成员变量
   */
  function collectDataFromConstructor(vm, Component) {
      // override _init to prevent to init as Vue instance
      var originalInit = Component.prototype._init;
      Component.prototype._init = function () {
          var _this = this;
          // proxy to actual vm
          var keys = Object.getOwnPropertyNames(vm);
          // 2.2.0 compat (props are no longer exposed as self properties)
          if (vm.$options.props) {
              for (var key in vm.$options.props) {
                  if (!vm.hasOwnProperty(key)) {
                      keys.push(key);
                  }
              }
          }
          keys.forEach(function (key) {
              if (key.charAt(0) !== '_') {
                  Object.defineProperty(_this, key, {
                      get: function () { return _.get(vm, key); },
                      set: function (value) {
                          _.set(vm, key, value);
                      },
                      configurable: true
                  });
              }
          });
      };
      // should be acquired class property values
      var data = new Component();
      // restore original _init to avoid memory leak (#209)
      Component.prototype._init = originalInit;
      // create plain data object
      var plainData = {};
      Object.keys(data).forEach(function (key) {
          if (data[key] !== undefined) {
              _.set(plainData, key, data[key]);
          }
      });
      return plainData;
  }
  /**
   * 收集成员方法
   */
  function collectMethods(proto, options) {
      Object.getOwnPropertyNames(proto).forEach(function (key) {
          // 如果是constructor，则不处理。
          if (key === 'constructor') {
              return;
          }
          // 记录下每级的 viewExtend 方法
          if (key === 'viewExtend') {
              // options.viewExtends.push(proto[key]);
              console.error('不支持使用 viewExtend, 请考虑使用 YvanUI.viewExtend(super.viewResolver(),{})');
              return;
          }
          // 记录下每级的 viewIntercept 方法
          if (key === 'viewIntercept') {
              // options.viewIntercepts.push(proto[key]);
              console.error('不支持使用 viewIntercept, 请考虑使用 super.viewResolver()');
              return;
          }
          // 记录下每级的 onLoad 方法
          if (key === 'onLoad') {
              options.onLoads.push(proto[key]);
              return;
          }
          // 记录下每级的 onShow 方法
          if (key === 'onShow') {
              options.onShows.push(proto[key]);
          }
          // 如果原型属性(方法)名是vue生命周期钩子名，则直接作为钩子函数挂载在options最外层
          if ($internalHooks.indexOf(key) > -1) {
              options[key] = proto[key];
              return;
          }
          // 先获取到原型属性的descriptor。
          // 在前文已提及，计算属性其实也是挂载在原型上的，所以需要对descriptor进行判断
          var descriptor = Object.getOwnPropertyDescriptor(proto, key);
          if (descriptor.value !== void 0) {
              // 如果属性值是一个function，则认为这是一个方法，挂载在methods下
              if (typeof descriptor.value === 'function') {
                  if (!_.has(options.methods, key)) {
                      options.methods[key] = descriptor.value;
                  }
              }
              else {
                  // 如果不是，则认为是一个普通的data属性。
                  // 但是这是原型上，所以更类似mixins，因此挂在mixins下。
                  options.mixins.push({
                      data: function () {
                          var _a;
                          return _a = {}, _a[key] = descriptor.value, _a;
                      }
                  });
              }
          }
          else if (descriptor.get || descriptor.set) {
              (options.computed || (options.computed = {}))[key] = {
                  get: descriptor.get,
                  set: descriptor.set
              };
          }
      });
  }
  /**
   * 基础混入器
   */
  function createCommonMix() {
      return {};
  }
  /**
   * 判断组件是否被删除后，是否需要预占宽度
   */
  function cmpNeedOccupied(code) {
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
  function wrapperWebixConfig(module, vjson) {
      // 形成最终的 viewResolver 方法
      deepTravVJson(vjson, function (obj) {
          // 检查组件是否被过滤(不渲染)
          var isFiltered = false;
          var componentRenderFilter = _.get(window, 'YvanUI.componentRenderFilter');
          if (componentRenderFilter && componentRenderFilter(obj) === false) {
              isFiltered = true;
          }
          if (isFiltered) {
              // 组件不需要渲染
              if (_.has(obj, 'hiddenPlaceholder')) {
                  // 如果有 hiddenPlaceholder 属性，最优先使用 hiddenPlaceholder, 替换现有的 vjson
                  var ph = obj.hiddenPlaceholder;
                  _.forOwn(obj, function (v, k) { return delete obj[k]; });
                  _.assign(obj, ph);
              }
              else if (cmpNeedOccupied(obj)) {
                  // 需要预占宽度的组件，变成 template
                  _.forOwn(obj, function (v, k) {
                      if (k !== 'height' && k !== 'width') {
                          delete obj[k];
                      }
                  });
                  obj.view = "template";
                  obj.borderless = true;
                  obj.template = "";
              }
              else {
                  // 其他情况，直接告知外循环，删除本对象
                  obj.isFiltered = true;
              }
              return;
          }
          if (obj.view === 'iframe') {
              return;
          }
          // if (module && _.has(obj, 'id')) {
          //   if (obj.id !== 'MainWindowFirstPage') {
          //     console.error('禁用 ID 属性', obj)
          //   }
          // }
          if (typeof obj.placeId === 'string') {
              obj.id = module.instanceId + '$' + obj.placeId;
          }
          if (typeof obj.view === 'string') {
              switch (obj.view) {
                  case 'button':
                      CtlButton.create(module, obj);
                      break;
                  case 'text':
                      CtlText.create(module, obj);
                      break;
                  case 'number':
                  case 'counter':
                      CtlNumber.create(module, obj);
                      break;
                  case 'datepicker':
                  case 'date':
                  case 'datetime':
                      CtlDatePicker.create(module, obj);
                      break;
                  case 'codemirror-editor':
                      CtlCodeMirror.create(module, obj);
                      break;
                  case 'dataview':
                      CtlDataview.create(module, obj);
                      break;
                  case 'datatable':
                      CtlDatatable.create(module, obj);
                      break;
                  case 'xterm':
                      CtlXterm.create(module, obj);
                      break;
                  case 'xconsolelog':
                      CtlConsoleLog.create(module, obj);
                      break;
                  // case 'echarts':
                  //   CtlECharts.create(module, obj);
                  //   break
                  case 'sidebar':
                      CtlSidebar.create(module, obj);
                      break;
                  case 'daterangepicker':
                  case 'daterange':
                  case 'datetimerange':
                      CtlDateRangePicker.create(module, obj);
                      break;
                  case 'combo':
                  case 'combobox':
                      CtlCombo.create(module, obj);
                      break;
                  case 'multicombo':
                      CtlMultiCombo.create(module, obj);
                      break;
                  case 'search':
                  case 'searchbox':
                      CtlSearch.create(module, obj);
                      break;
                  case 'check':
                  case 'checkbox':
                      CtlCheckBox.create(module, obj);
                      break;
                  case 'switch':
                  case 'switchbox':
                      CtlSwitch.create(module, obj);
                      break;
                  case 'radio':
                  case 'radiobox':
                      CtlRadio.create(module, obj);
                      break;
                  case 'tree':
                      CtlTree.create(module, obj);
                      break;
                  case 'treetable':
                      CtlTreeTable.create(module, obj);
                      break;
                  case 'tabview':
                      CtlTab.create(module, obj);
                      break;
                  case 'grid':
                      CtlGrid.create(module, obj);
                      break;
                  case 'form':
                      CtlForm.create(module, obj);
                      break;
                  case 'carousel':
                      CtlCarousel.create(module, obj);
                      break;
              }
          }
      });
      if (module) {
          vjson.$scope = module;
      }
  }
  /**
   * 将传统 ts Class 转换为 vue 对象.
   * 普通模块对象和 dialog 对象都要经过转换
   */
  function componentFactory(Component, options) {
      if (options === void 0) { options = {}; }
      //return VueComponent<BaseModule<M, Refs, INP>>(options)
      if (!options.mixins) {
          options.mixins = [];
      }
      if (!options.methods) {
          options.methods = {};
      }
      if (!options.viewExtends) {
          options.viewExtends = [];
      }
      if (!options.viewIntercepts) {
          options.viewIntercepts = [];
      }
      if (!options.onLoads) {
          options.onLoads = [];
      }
      if (!options.onShows) {
          options.onShows = [];
      }
      // 获取构造函数原型，这个原型上挂在了该类的method
      for (var proto = Component.prototype; proto.constructor !== Vue; proto = Object.getPrototypeOf(proto)) {
          // 一直向上收集, 直到 Object 级
          collectMethods(proto, options);
      }
      // 添加公共基础 MIX
      options.mixins.push(createCommonMix());
      // 解析 @Watch 装饰器方法，执行 watch
      var watches = Component.prototype.watches;
      delete Component.prototype.watches;
      // 实例化Component构造函数，并收集其自身的(非原型上的)属性导出
      options.mixins.push({
          data: function () {
              var data = __assign({ refs: {}, dialog: undefined, inParamter: undefined, dialogParent: undefined, instanceId: _.uniqueId('_mins_id_'), loadFinished: false }, collectDataFromConstructor(this, Component));
              return data;
          },
          created: function () {
              var _this = this;
              if (_.isArray(watches)) {
                  _.each(watches, function (item) {
                      _this.$watch(item.expr, item.handler, {
                          deep: item.deep,
                          immediate: item.immediate
                      });
                      //console.log('$watch', item.expr, item.handler, { deep: item.deep, immediate: item.immediate })
                  });
              }
          },
          destroyed: function () { },
          methods: {
              onLoad: function () {
                  var _this = this;
                  _.each(options.onLoads, function (load) {
                      load.call(_this);
                  });
              },
              onShow: function () {
                  var _this = this;
                  _.each(options.onShows, function (load) {
                      load.call(_this);
                  });
              },
              buildView: function () {
                  // 获取到 viewResolver 方法，拿到最原始的 vjson
                  var vjson = this.viewResolver();
                  // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
                  wrapperWebixConfig(this, vjson);
                  return vjson;
              },
              closeDialog: function () {
                  this.dialog.close();
              },
              setInParamter: function (inParamter) {
                  this.inParamter = inParamter;
              },
              showDialog: function (inParamter, container, isFromSearchBox) {
                  if (isFromSearchBox === void 0) { isFromSearchBox = false; }
                  // 显示对话框
                  var module = this;
                  module.inParamter = inParamter;
                  module.dialogParent = container;
                  // 获取到 viewResolver 方法，拿到最原始的 vjson
                  var vjson = module.viewResolver();
                  if (!_.has(vjson, 'body')) {
                      vjson.body = {
                          template: 'dialog 没有 body'
                      };
                  }
                  else {
                      if (!_.has(vjson.body, 'padding')) {
                          vjson.body.padding = 10;
                      }
                  }
                  // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
                  wrapperWebixConfig(module, vjson.body);
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
                                      onAfterRender: function () {
                                          module._titleLabel = this;
                                      }
                                  }
                              },
                              {
                                  view: "icon", icon: "fa fa-window-maximize", click: function () {
                                      dialog.config.fullscreen = !dialog.config.fullscreen;
                                      if (dialog.config.fullscreen) {
                                          dialog.config.oldtop = dialog.config.top;
                                          dialog.config.oldleft = dialog.config.left;
                                          dialog.config.left = 0;
                                          dialog.config.top = 0;
                                          this.define({ icon: 'fa fa-window-restore' });
                                      }
                                      else {
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
                          onShow: function () {
                              module.onLoad();
                              module.loadFinished = true;
                          },
                          onDestruct: function () {
                              module.onClose();
                          }
                      },
                  });
                  var dialog = webix.ui(vjson);
                  module._webixId = this.dialog = dialog;
                  this.dialog.show();
                  $(this.dialog.$view).keypress(function (event) {
                      if (event.keyCode === 27) {
                          module.onEsc();
                          event.stopPropagation();
                          event.preventDefault();
                          return;
                      }
                      if (event.keyCode === 13) {
                          module.onEnter();
                          if (isFromSearchBox) {
                              event.stopPropagation();
                          }
                          event.preventDefault();
                          return;
                      }
                  });
              }
          }
      });
      // 通过 vue.extend 生成一个 vue 类型的功能模块对象
      var VueModule = Vue.extend(options);
      return VueModule;
  }
  /**
   * 在目标 DOM 选择器上渲染模块
   */
  function render(selector, baseModule) {
      var lastHandle = _.get(window, 'LastRenderHandler');
      if (lastHandle) {
          lastHandle.destructor();
          _.set(window, 'LastRenderHandler', null);
      }
      var cfg = baseModule.buildView();
      cfg.container = selector;
      baseModule._webixId = webix.ui(cfg);
      baseModule.onLoad();
      webix.event(window, 'resize', function () {
          // $$(baseModule._webixId).resize();
          baseModule._webixId.resize();
      });
      _.set(window, 'LastRenderHandler', baseModule._webixId);
      return baseModule._webixId;
  }
  /**
   * 在占位空间 spaceId 上渲染 vjson
   * @param module 当前模块
   * @param spaceId 占位空间
   * @param vjson 界面描述
   */
  function renderPlace(module, spaceId, vjson) {
      wrapperWebixConfig(module, vjson);
      webix.ui(vjson, webix.$$(module.instanceId + '$' + spaceId));
  }
  //# sourceMappingURL=YvanRender.js.map

  function downLoad(downLoadUrl, filename, data, header) {
      var YvanUI = _.get(window, 'YvanUI');
      YvanUI.loading();
      var createObjectURL = function (object) {
          return (window.URL) ? window.URL.createObjectURL(object) : _.get(window, 'webkitURL').createObjectURL(object);
      };
      // const formData = new FormData();
      // _.forOwn(data, (v, k) => {
      //     formData.append(k, v);
      // });
      var formData = data ? qs.stringify(data) : '';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', downLoadUrl);
      xhr.responseType = 'blob';
      //xhr.setRequestHeader('Authorization', $.cookie('auth'))
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      if (header) {
          _.forOwn(header, function (v, k) {
              xhr.setRequestHeader(k, v);
          });
      }
      xhr.onload = function (e) {
          if (this.status === 200) {
              var blob = this.response;
              if (_.hasIn(window, 'navigator.msSaveOrOpenBlob')) {
                  navigator.msSaveBlob(blob, filename);
                  YvanUI.clearLoading();
              }
              else {
                  var a = document.createElement('a');
                  var url = createObjectURL(blob);
                  a.href = url;
                  a.download = filename;
                  $('body').append(a);
                  a.click();
                  $(a).remove();
                  window.URL.revokeObjectURL(url);
                  YvanUI.clearLoading();
              }
          }
      };
      xhr.send(formData);
  }
  /**
   * 创建一个 Ajax 客户端
   */
  function createAjax(createOption) {
      if (createOption.baseUrl) {
          axios.defaults.baseURL = createOption.baseUrl;
      }
      return function (option) {
          var ax = {
              url: option.url
          };
          if (option.method === 'DOWNLOAD') {
              downLoad(createOption.baseUrl + option.url, option.fileName || 'file', option.data, option.headers);
              return new Promise(function (resolver, reject) {
              });
          }
          if (option.method === 'POST-JSON') {
              ax.method = 'POST';
              ax.headers = __assign({ 'Content-Type': 'application/json' }, option.headers);
              ax.data = JSON.stringify(option.data);
          }
          else if (option.method === 'POST-FILE') {
              //TODO 刘壮. 上传文件
              var forms = new FormData();
              ax.headers = __assign({ 'Content-Type': 'multipart/form-data' }, option.headers);
              _.forOwn(option.data, function (value, key) {
                  if (key === 'files') {
                      var i_1 = 0;
                      _.each(value, function (f) {
                          forms.append('file' + (++i_1), f);
                      });
                  }
                  else {
                      forms.append(key, value);
                  }
              });
              ax.data = forms;
              ax.method = 'POST';
          }
          else if (option.method === 'POST') {
              ax.method = 'POST';
              ax.headers = __assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, option.headers);
              ax.data = qs.stringify(option.data);
          }
          else if (option.method === 'GET') {
              ax.method = 'GET';
              ax.params = option.data;
              ax.headers = __assign({}, option.headers);
          }
          else {
              throw new Error('not implements');
          }
          return new Promise(function (resolver, reject) {
              axios(ax).then(function (resolverRaw) {
                  resolver(resolverRaw.data);
              }).catch(function (reason) {
                  reject(reason);
              });
          });
      };
  }
  //# sourceMappingURL=YvanUIAjax.js.map

  (function (Db) {
      var Client = /** @class */ (function () {
          function Client(createOption) {
              this.baseUrl = createOption.baseUrl;
              this.ajax = createOption.ajax;
              this.defaultDb = createOption.defaultDb;
          }
          Client.prototype.execute = function (option) {
              var _this = this;
              return new Promise((function (resolve, reject) {
                  var sqlTimeId = _.uniqueId('SQL');
                  console.time(sqlTimeId);
                  _this.ajax({
                      url: _this.baseUrl + '/execute',
                      method: 'POST-JSON',
                      data: {
                          db: _this.defaultDb,
                          sqlId: option.sqlId,
                          params: option.params
                      }
                  }).then(function (root) {
                      if (root && root.success) {
                          var _a = root.data, sql = _a.sql, resParams = _a.params, data = _a.data;
                          if (sql) {
                              console.log('SQL-execute', { sql: sql, resParams: resParams });
                          }
                          resolve(data);
                          return;
                      }
                      reject(root.msg);
                  }).catch(function (err) {
                      reject(err);
                  }).finally(function () {
                      console.timeEnd(sqlTimeId);
                  });
              }));
          };
          Client.prototype.query = function (option) {
              var _this = this;
              return new Promise((function (resolve, reject) {
                  var sqlTimeId = _.uniqueId('SQL');
                  console.time(sqlTimeId);
                  _this.ajax({
                      url: _this.baseUrl + '/query',
                      method: 'POST-JSON',
                      data: {
                          db: _this.defaultDb,
                          filterModel: option.filterModel,
                          sortModel: option.sortModel,
                          limit: option.limit,
                          limitOffset: option.limitOffset,
                          needCount: option.needCount,
                          sqlId: option.sqlId,
                          params: option.params,
                      }
                  }).then(function (root) {
                      if (root && root.success) {
                          var _a = root.data, sql = _a.sql, resParams = _a.params, data = _a.data;
                          if (sql) {
                              console.log('SQL-query', { sql: sql, resParams: resParams });
                          }
                          resolve(root.data);
                          return;
                      }
                      reject(root.msg);
                  }).catch(function (err) {
                      reject(err);
                  }).finally(function () {
                      console.timeEnd(sqlTimeId);
                  });
              }));
          };
          return Client;
      }());
      Db.Client = Client;
  })(exports.Db || (exports.Db = {}));
  /**
   * 创建一个 db 客户端
   */
  function createDb(createOption) {
      return new exports.Db.Client(createOption);
  }
  //# sourceMappingURL=YvanUIDb.js.map

  /**
   * 获取页面 URL 问号之后的参数
   */
  function getQueryString() {
      var url = document.location.search;
      var theRequest = {};
      if (url.indexOf("?") >= 0) {
          var str = url.substr(1);
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
              var vs = strs[i].split("=");
              theRequest[vs[0]] = unescape(vs[1]);
          }
      }
      return theRequest;
  }
  /**
   * 统一吧下划线（字符串/对象/数组）变成驼峰命名
   */
  function camelCase(obj) {
      if (typeof obj === 'string') {
          return _.camelCase(obj);
      }
      if (_.isArray(obj)) {
          return _.map(obj, function (item) {
              return camelCase(item);
          });
      }
      if (typeof obj === 'object') {
          var ret_1 = {};
          _.forOwn(obj, function (value, key) {
              ret_1[_.camelCase(key)] = value;
          });
          return ret_1;
      }
      console.error('无法转换' + obj);
  }
  /**
   * 统一吧驼峰（字符串/对象/数组）变成下划线
   */
  function snakeCase(obj) {
      if (typeof obj === 'string') {
          return _.snakeCase(obj);
      }
      if (_.isArray(obj)) {
          return _.map(obj, function (item) {
              return snakeCase(item);
          });
      }
      if (typeof obj === 'object') {
          var ret_2 = {};
          _.forOwn(obj, function (value, key) {
              ret_2[_.snakeCase(key)] = value;
          });
          return ret_2;
      }
      console.error('无法转换' + obj);
  }
  /**
   * 将任意 planObject 对象，转换为 hash 描述
   */
  function param(obj) {
      return $.param(obj);
  }
  /**
   * 将 hash 描述转换为 planObject 对象
   * @param s
   */
  function unparam(query) {
      var queryString = {};
      if (query.slice(0, 1) === "#") {
          query = query.slice(1);
      }
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          pair[0] = decodeURIComponent(pair[0]);
          pair[1] = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof queryString[pair[0]] === "undefined") {
              queryString[pair[0]] = pair[1];
          }
          else if (typeof queryString[pair[0]] === "string") {
              var arr = [queryString[pair[0]], pair[1]];
              queryString[pair[0]] = arr;
          }
          else {
              queryString[pair[0]].push(pair[1]);
          }
      }
      return queryString;
  }
  //# sourceMappingURL=YvanUIUtils.js.map

  var BaseModule = /** @class */ (function (_super) {
      __extends(BaseModule, _super);
      function BaseModule() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      /**
       * 模块被渲染完成之后调用
       */
      BaseModule.prototype.onLoad = function () { };
      /**
       * 每次从隐藏状态换显出来后调用
       */
      BaseModule.prototype.onShow = function () { };
      /**
       * 根据名称，获取空白区域操作句柄
       */
      BaseModule.prototype.getPlace = function (placeId) {
          return webix.$$(_.get(this, 'instanceId') + '$' + placeId);
      };
      BaseModule.prototype.validate = function (entityName) {
          var _this = this;
          return new Promise(function (resolver, reject) {
              var ctlMappings = _.get(_this, '_entityCtlMapping.' + entityName);
              var result = {};
              if (_.get(ctlMappings, '_required') === true || _.has(ctlMappings, 'onValidate')) {
                  var validateResult = ctlMappings._resultToShowOrHide();
                  if (validateResult) {
                      ctlMappings._showTootip(validateResult);
                      ctlMappings._showValidateError();
                      ctlMappings.focus();
                      _.set(result, ctlMappings.entityName, validateResult);
                  }
              }
              else {
                  var isShow_1 = false;
                  _.forEach(ctlMappings, function (ctl, key) {
                      if (_.get(ctl, '_required') === true || _.has(ctl, 'onValidate')) {
                          var validateResult = ctl._resultToShowOrHide();
                          if (validateResult) {
                              ctl._showValidateError();
                              _.set(result, key, validateResult);
                              if (!isShow_1) {
                                  isShow_1 = true;
                                  ctl._showTootip(validateResult);
                                  ctl.focus();
                              }
                          }
                      }
                  });
              }
              if (_.size(result) > 0) {
                  reject(result);
              }
              else {
                  resolver(_.get(_this, entityName));
              }
          });
      };
      Object.defineProperty(BaseModule.prototype, "title", {
          get: function () {
              if (this._webixId) {
                  // webix 对象已经出现
                  return this._webixId.config.title;
              }
              return '无法获取';
          },
          /**
           * 获取或设置 window 标题
           */
          set: function (v) {
              if (this._webixId && _.has(this, '_titleLabel')) {
                  // webix 对象已经出现
                  this._webixId.define('title', v);
                  var _titleLabel = _.get(this, '_titleLabel');
                  _titleLabel.define('label', v);
                  _titleLabel.refresh();
                  return;
              }
              console.error('无法设置 title');
          },
          enumerable: true,
          configurable: true
      });
      return BaseModule;
  }(Vue));
  var BaseDialog = /** @class */ (function (_super) {
      __extends(BaseDialog, _super);
      function BaseDialog() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      /**
       * 按下 ESC 键
       */
      BaseDialog.prototype.onEsc = function () {
          this.closeDialog();
      };
      /**
       * 按下 Enter 键
       */
      BaseDialog.prototype.onEnter = function () {
          debugger;
      };
      /**
       * 关闭后触发
       */
      BaseDialog.prototype.onClose = function () { };
      /**
       * 显示进行中的状态
       */
      BaseDialog.prototype.showLoading = function () {
          webix.extend(this._webixId, webix.OverlayBox);
          //this._webix.showOverlay("<div style='...'>There is no data</div>");
          this._webixId.showOverlay('Loading...');
      };
      /**
       * 关闭进行中的状态
       */
      BaseDialog.prototype.closeLoading = function () {
          this._webixId.hideOverlay();
      };
      return BaseDialog;
  }(BaseModule));
  /**
   * 装饰业务模块
   * @param options
   */
  function BizModule(option) {
      return function (Component) {
          return componentFactory(Component, option);
      };
      // const option = {
      //     ...createOption,
      //     template: `<webix-ui ref='webixui' :config='viewResolver()'/>`,
      //     ...createMixins<M, Refs, INP>(createOption)
      // }
      // return VueComponent<BaseModule<M, Refs, INP>>(option)
  }
  /**
   * 装饰字段（监听某个属性值变化）
   */
  function Watch(propName, deep, immediate) {
      if (deep === void 0) { deep = false; }
      if (immediate === void 0) { immediate = false; }
      if (typeof deep === 'undefined') {
          deep = false;
      }
      if (typeof immediate === 'undefined') {
          immediate = false;
      }
      return function (target, propertyKey, descriptor) {
          if (typeof target.watches === 'undefined') {
              target.watches = [];
          }
          var watch = {
              expr: propName,
              deep: deep,
              immediate: immediate,
              handler: descriptor.value
          };
          target.watches.push(watch);
      };
  }
  //# sourceMappingURL=YvanUIModule.js.map

  // eslint-disable-next-line import/no-extraneous-dependencies
  /**
   * 导出代码生成器
   */
  function getTS() {
      return ts;
  }
  /**
   * 导出代码生成器
   */
  function tsCodeGenerate(tsNode) {
      var resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.ES2019, 
      /*setParentNodes*/ false, ts.ScriptKind.TS);
      var printer = ts.createPrinter({
          newLine: ts.NewLineKind.LineFeed
      });
      var result = printer.printNode(ts.EmitHint.Unspecified, tsNode, resultFile);
      return result;
  }
  /**
   * 导出代码AST解析器
   */
  function tsCodeParse(content) {
      var file = ts.createSourceFile("someFileName.ts", content, ts.ScriptTarget.ES2019, 
      /*setParentNodes*/ false, ts.ScriptKind.TS);
      return file.statements;
  }
  function getTSDemo2() {
      var resultFile = ts.createSourceFile("someFileName.ts", contentText, ts.ScriptTarget.ES2019, 
      /*setParentNodes*/ false, ts.ScriptKind.TS);
      return resultFile;
  }
  function getTSDemo() {
      function makeFactorialFunction() {
          var functionName = ts.createIdentifier("factorial");
          var paramName = ts.createIdentifier("n");
          var parameter = ts.createParameter(
          /*decorators*/ undefined, 
          /*modifiers*/ undefined, 
          /*dotDotDotToken*/ undefined, paramName);
          var condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
          var ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], 
          /*multiline*/ true);
          var decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
          var recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
          var statements = [
              ts.createEnumDeclaration(undefined, undefined, ts.createIdentifier("MyEnum"), [
                  ts.createEnumMember(ts.createIdentifier("member"), undefined),
                  ts.createEnumMember(ts.createIdentifier("user"), undefined)
              ]),
              ts.createIf(condition, ifBody), ts.createReturn(recurse)
          ];
          return ts.createFunctionDeclaration(
          /*decorators*/ undefined, 
          /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)], 
          /*asteriskToken*/ undefined, functionName, 
          /*typeParameters*/ undefined, [parameter], 
          /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), ts.createBlock(statements, /*multiline*/ true));
      }
      var resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.ES2019, 
      /*setParentNodes*/ false, ts.ScriptKind.TS);
      var printer = ts.createPrinter({
          newLine: ts.NewLineKind.LineFeed
      });
      var result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
      return result;
  }
  var contentText = "export type Refs = {\n};\n\nexport default abstract class<M, INP> extends YvanUI.BaseDialog<M, Refs, INP> {\n\n    main: {\n        FADMINID:string,\n        FADMINNAME: string,\n        FADMINPHONE: string,\n        FEMAIL: string\n    } = {\n        FADMINID:'',\n        FADMINNAME: '',\n        FADMINPHONE:'',\n        FEMAIL:''\n    };\n\n    viewResolver(): any {\n        console.log(this, this.inParamter);\n\n        return {\n            title: '\u8054\u7CFB\u65B9\u5F0F\u7EF4\u62A4',\n            modal: true,\n            width: 400,\n            height: 200,\n            body: {\n                rows: [\n                    {\n                        view: 'text',\n                        entityName: \"main.FADMINNAME\",\n                        label: \"\u7BA1\u7406\u5458\u540D\u79F0\",\n                        required: true,\n                        width: 320,\n                    },\n                    {\n                        view: 'text',\n                        entityName: 'main.FADMINPHONE',\n                        label: '\u7BA1\u7406\u5458\u8054\u7CFB\u65B9\u5F0F',\n                        width: 320,\n                        required: true,\n                    },\n                    {\n                        view: 'text',\n                        entityName: \"main.FEMAIL\",\n                        label: \"\u8054\u7CFBEMAIL\",\n                        width: 320,\n                        required: true,\n                    },\n                    {\n                        cols: [\n                            {width: 110},\n                            {\n                                view: \"button\", text: \"\u786E\u5B9A\", cssType: \"primary\", width: 0,\n                                onClick: {\n                                    type: 'function',\n                                    bind: 'ok'\n                                }\n                            },\n                            {\n                                view: \"button\", text: \"\u53D6\u6D88\", cssType: 'default', width: 0,\n                                onClick: {\n                                    type: 'function',\n                                    bind: 'cancel'\n                                }\n                            }\n                        ]\n                    }\n                ]\n            }\n        }\n    }\n}";
  //# sourceMappingURL=YvanUICode.js.map

  var PropertyDescription = /** @class */ (function () {
      function PropertyDescription() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          this.propertyes = {
              props: [],
              events: []
          };
          _.each(args, function (arg) {
              _this.merge(arg);
          });
      }
      PropertyDescription.prototype.merge = function (pd) {
          this.propertyes.props = (_.uniqBy(__spreadArrays(this.propertyes.props, pd.props), 'name'));
          if (pd.events) {
              if (this.propertyes.events) {
                  this.propertyes.events = (_.uniqBy(__spreadArrays(this.propertyes.events, pd.events), 'name'));
              }
              else {
                  this.propertyes.events = _.uniqBy(__spreadArrays(pd.events), 'name');
              }
          }
      };
      /**
       * 根据分组名 获取属性定义
       */
      PropertyDescription.prototype.getPropsByGroup = function (name) {
          return _.filter(this.propertyes.props, function (i) { return i.group === name; });
      };
      /**
       * 获取全部事件
       */
      PropertyDescription.prototype.getEvents = function () {
          return this.propertyes.events;
      };
      return PropertyDescription;
  }());
  //# sourceMappingURL=PropertyDescription.js.map

  var PropertyDescriptionTable = new Map();
  PropertyDescriptionTable.set('layout', new PropertyDescription({
      props: [
          {
              name: 'borderless',
              default: true,
              group: 'css',
              desc: '有无边框',
              type: 'boolean'
          },
          {
              name: 'type',
              default: '',
              group: 'css',
              desc: '布局类型',
              type: ['line', 'clean', 'wide', 'space', 'form']
          }
      ]
  }));
  var YvBase = {
      props: [
          {
              name: 'entityName',
              default: '',
              group: 'bind',
              desc: '实体类名',
              type: 'string'
          },
          {
              name: 'ctlName',
              default: '',
              group: 'bind',
              desc: '控件名',
              type: 'string'
          },
          {
              name: 'css',
              default: '',
              group: 'css',
              desc: '样式类名',
              type: 'string'
          },
          {
              name: 'attr',
              default: {},
              group: 'css',
              desc: 'HTML属性',
              type: 'object'
          },
          {
              name: 'render',
              default: true,
              group: 'common',
              desc: '是否显示',
              type: 'boolean'
          },
          {
              name: 'padding',
              default: undefined,
              group: 'css',
              desc: '内边距',
              type: 'object'
          },
          {
              name: 'margin',
              default: undefined,
              group: 'css',
              desc: '外边距',
              type: 'object'
          },
          {
              name: 'ff',
              default: 0,
              group: 'common',
              desc: '自动定焦时间',
              type: 'number'
          }
      ],
      events: [{ name: 'onRender', desc: '第一次控件被渲染时触发' }]
  };
  var YvDataSource$1 = {
      props: [
          {
              name: 'type',
              default: '',
              group: 'data',
              desc: '数据源类型',
              type: 'dataSource'
          }
      ],
      events: [{ name: 'onDataComplete', desc: '数据绑定完成后触发' }]
  };
  PropertyDescriptionTable.set('template', new PropertyDescription(YvBase, {
      props: [
          {
              name: 'template',
              default: '',
              group: 'common',
              desc: 'HTML内容',
              type: 'string'
          }
      ]
  }));
  PropertyDescriptionTable.set('text', new PropertyDescription(YvBase, {
      props: [
          {
              name: 'label',
              default: '',
              group: 'common',
              desc: '文本描述',
              type: 'string'
          },
          {
              name: 'labelAlign',
              default: '',
              group: 'common',
              desc: '描述对齐方式',
              type: ['left', 'right', 'center']
          },
          {
              name: 'labelWidth',
              default: undefined,
              group: 'common',
              desc: '文本宽度',
              type: 'number'
          },
          {
              name: 'gravity',
              default: 1,
              group: 'common',
              desc: '占位权重',
              type: 'number'
          },
          {
              name: 'readonly',
              default: false,
              group: 'common',
              desc: '只读',
              type: 'boolean'
          },
          {
              name: 'disabled',
              default: false,
              group: 'common',
              desc: '禁用',
              type: 'boolean'
          },
          {
              name: 'required',
              default: false,
              group: 'common',
              desc: '必填',
              type: 'boolean'
          },
          {
              name: 'value',
              default: '',
              group: 'common',
              desc: '字段值',
              type: 'string'
          },
          {
              name: 'prompt',
              default: '请输入',
              group: 'common',
              desc: '水印',
              type: 'string'
          },
          {
              name: 'validType',
              default: '',
              group: 'common',
              desc: '校验类型',
              type: 'valid'
          }
      ]
  }));
  PropertyDescriptionTable.set('button', new PropertyDescription(YvBase, {
      props: [
          {
              name: 'text',
              default: '',
              group: 'common',
              desc: '按钮标题',
              type: 'string'
          },
          {
              name: 'icon',
              default: '',
              group: 'common',
              desc: '图标样式',
              type: 'string'
          },
          {
              name: 'disabled',
              default: false,
              group: 'common',
              desc: '是否禁用',
              type: 'boolean'
          },
          {
              name: 'gravity',
              default: 1,
              group: 'css',
              desc: '占位权重',
              type: 'number'
          },
          {
              name: 'tooltip',
              default: '',
              group: 'common',
              desc: '悬停提示',
              type: 'string'
          },
          {
              name: 'cssType',
              default: 'default',
              group: 'css',
              desc: '样式类型',
              type: ['default', 'primary', 'danger', 'success']
          }
      ],
      events: [{ name: 'onClick', desc: '第一次控件被渲染时触发' }]
  }));
  PropertyDescriptionTable.set('label', new PropertyDescription(YvBase, {
      props: [
          {
              name: 'label',
              default: '',
              group: 'common',
              desc: '标签内容',
              type: 'string'
          },
          {
              name: 'align',
              default: 'left',
              group: 'common',
              desc: '对齐方式',
              type: ['left', 'right', 'center']
          },
          {
              name: 'disabled',
              default: false,
              group: 'common',
              desc: '是否禁用',
              type: 'boolean'
          },
          {
              name: 'width',
              default: 100,
              group: 'css',
              desc: '宽度',
              type: 'number'
          },
          {
              name: 'gravity',
              default: 1,
              group: 'css',
              desc: '占位权重',
              type: 'number'
          },
          {
              name: 'tooltip',
              default: '',
              group: 'common',
              desc: '悬停提示',
              type: 'string'
          }
      ]
  }));
  PropertyDescriptionTable.set('tree', new PropertyDescription(YvDataSource$1, YvBase, {
      props: [
          {
              name: 'showCheckbox',
              default: false,
              group: 'common',
              desc: '显示勾选',
              type: 'boolean'
          },
          {
              name: 'showLeftIcon',
              default: true,
              group: 'common',
              desc: '显示左侧图标',
              type: 'boolean'
          },
          {
              name: 'showIcon',
              default: true,
              group: 'common',
              desc: '显示图标',
              type: 'boolean'
          }
      ],
      events: [
          { name: 'onNodeClick', desc: '节点被点击后触发' },
          { name: 'onNodeDblClick', desc: '节点被双击后触发' }
      ]
  }));
  //# sourceMappingURL=PropertyDescriptionTable.js.map

  /**
   * 扩展 echarts 组件
   */
  webix.protoUI({
      name: 'echarts'
  }, webix.ui.template);
  var CtlECharts = /** @class */ (function (_super) {
      __extends(CtlECharts, _super);
      function CtlECharts() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CtlECharts.create = function (module, vjson) {
          var that = new CtlECharts(_.cloneDeep(vjson));
          that._module = module;
          if (vjson.hasOwnProperty('debugger')) {
              debugger;
          }
          // 提取基础属性 onRender / ctlName / entityName 等等
          var yvanProp = parseYvanPropChangeVJson(vjson, []);
          // 将 yvanProp 合并至当前 CtlBase 对象
          _.assign(that, yvanProp);
          // 删除 vjson 所有数据, 替换为 template 语法
          _.forOwn(vjson, function (value, key) {
              delete vjson[key];
          });
          _.merge(vjson, {
              view: 'echarts',
              template: "<div role=\"echarts\"></div>",
              on: {
                  onAfterRender: function () {
                      that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                      that._resetECharts();
                  },
                  onDestruct: function () {
                      if (that._echartsHandler) {
                          that._echartsHandler.dispose();
                          delete that._echartsHandler;
                      }
                      that.removeHandle();
                  }
              }
          });
          if (that.vjson.id) {
              vjson.id = that.vjson.id;
          }
          return that;
      };
      CtlECharts.prototype.setOption = function (option, opts) {
          var _this = this;
          this._echartsHandler.setOption(option, opts);
          _.defer(function () {
              _this._echartsHandler.resize();
          });
      };
      Object.defineProperty(CtlECharts.prototype, "handle", {
          get: function () {
              return this._echartsHandler;
          },
          enumerable: true,
          configurable: true
      });
      // setOption(option: echarts.EChartOption, opts?: echarts.EChartsOptionConfig): void {
      //     this._echartsHandler.setOption(option, opts);
      //     _.defer(() => {
      //         this._echartsHandler.resize();
      //     });
      // }
      //
      // setOption2(option: echarts.EChartOption | echarts.EChartsResponsiveOption, notMerge?: boolean, lazyUpdate?: boolean): void {
      //     this._echartsHandler.setOption(option, notMerge, lazyUpdate);
      //     _.defer(() => {
      //         this._echartsHandler.resize();
      //     });
      // }
      CtlECharts.prototype.resize = function () {
          this._echartsHandler.resize();
      };
      CtlECharts.prototype.clear = function () {
          this._echartsHandler.clear();
      };
      CtlECharts.prototype._resetECharts = function () {
          var _this = this;
          var $el = $(this._webix._viewobj).find('[role="echarts"]')[0];
          var el = $el;
          this._echartsHandler = echarts.init(el);
          this._echartsHandler.on('click', function (params) {
              YvEventDispatch(_this.onClick, _this, params);
          });
      };
      return CtlECharts;
  }(CtlBase));
  //# sourceMappingURL=CtlECharts.js.map

  function userComponentFactory(Component, name) {
  }
  /**
   * 自定义组件
   */
  function UserComponent(name) {
      return function (Component) {
          return userComponentFactory();
      };
  }
  // 自定义组件
  var UserComponentBase = /** @class */ (function () {
      function UserComponentBase() {
      }
      return UserComponentBase;
  }());
  //# sourceMappingURL=UserComponent.js.map

  exports.BaseDialog = BaseDialog;
  exports.BaseModule = BaseModule;
  exports.BizModule = BizModule;
  exports.CtlButton = CtlButton;
  exports.CtlCarousel = CtlCarousel;
  exports.CtlCheckBox = CtlCheckBox;
  exports.CtlCodeMirror = CtlCodeMirror;
  exports.CtlCombo = CtlCombo;
  exports.CtlConsoleLog = CtlConsoleLog;
  exports.CtlDatatable = CtlDatatable;
  exports.CtlDataview = CtlDataview;
  exports.CtlDatePicker = CtlDatePicker;
  exports.CtlDateRangePicker = CtlDateRangePicker;
  exports.CtlECharts = CtlECharts;
  exports.CtlForm = CtlForm;
  exports.CtlGrid = CtlGrid;
  exports.CtlMultiCombo = CtlMultiCombo;
  exports.CtlNumber = CtlNumber;
  exports.CtlRadio = CtlRadio;
  exports.CtlSearch = CtlSearch;
  exports.CtlSidebar = CtlSidebar;
  exports.CtlSwitch = CtlSwitch;
  exports.CtlTab = CtlTab;
  exports.CtlText = CtlText;
  exports.CtlTree = CtlTree;
  exports.CtlTreeTable = CtlTreeTable;
  exports.CtlXterm = CtlXterm;
  exports.PropertyDescription = PropertyDescription;
  exports.PropertyDescriptionTable = PropertyDescriptionTable;
  exports.UserComponent = UserComponent;
  exports.UserComponentBase = UserComponentBase;
  exports.Watch = Watch;
  exports.YvEventDispatch = YvEventDispatch;
  exports.alert = alert;
  exports.camelCase = camelCase;
  exports.clearLoading = clearLoading;
  exports.complexValid = complexValid;
  exports.componentFactory = componentFactory;
  exports.confirm = confirm;
  exports.createAjax = createAjax;
  exports.createBroker = createBroker;
  exports.createDb = createDb;
  exports.dbs = dbs;
  exports.deepTravVJson = deepTravVJson;
  exports.dict = dict;
  exports.downLoad = downLoad;
  exports.error = error;
  exports.extend = extend;
  exports.formatter = formatter;
  exports.getQueryString = getQueryString;
  exports.getServerPrefix = getServerPrefix;
  exports.getTS = getTS;
  exports.getTSDemo = getTSDemo;
  exports.getTSDemo2 = getTSDemo2;
  exports.hideTooltip = hideTooltip;
  exports.initDesign = initDesign;
  exports.isDesignMode = isDesignMode;
  exports.loading = loading;
  exports.msg = msg;
  exports.msgError = msgError;
  exports.msgInfo = msgInfo;
  exports.msgSuccess = msgSuccess;
  exports.param = param;
  exports.prompt = prompt;
  exports.render = render;
  exports.renderPlace = renderPlace;
  exports.showTooltip = showTooltip;
  exports.snakeCase = snakeCase;
  exports.tsCodeGenerate = tsCodeGenerate;
  exports.tsCodeParse = tsCodeParse;
  exports.unparam = unparam;
  exports.validType = validType;
  exports.version = version;
  exports.viewExtend = viewExtend;
  exports.wrapperWebixConfig = wrapperWebixConfig;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=yvan-ui.js.map
