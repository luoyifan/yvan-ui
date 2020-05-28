import { __assign, __extends } from "tslib";
import { CtlBase } from '../../CtlBase';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import * as YvanMessage from '../../YvanUIMessage';
import { YvEventDispatch } from '../../YvanEvent';
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
            ;
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
        YvanMessage.showTooltip(this, msg);
    };
    CtlInput.prototype._hideTootip = function () {
        YvanMessage.hideTooltip(this);
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
export { CtlInput };
//# sourceMappingURL=CtlInput.js.map