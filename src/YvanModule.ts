import Vue from 'vue'
import webix from 'webix'
import { BaseModule } from './YvanUIModule'

/**
 * 扩展 grid 组件
 */
webix.protoUI(
  {
    name: 'grid'
  },
  webix.ui.template
)

/**
 * 扩展 echarts 组件
 */
webix.protoUI(
  {
    name: 'echarts'
  },
  webix.ui.template
)

export type VJson = any

export type ViewExtendType<T> = {
  [P in keyof T]?: Partial<T[P]>
}

