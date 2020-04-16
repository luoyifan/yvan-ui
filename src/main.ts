import Vue from "vue";
import moment = require("moment");
import * as YvanUI from '@/lib'

Vue.config.productionTip = false;

Object.assign(window, {
    YvanUI: YvanUI,
    moment: moment
});
