import Vue from 'vue'
import webix from 'webix'
import { BaseModule } from './YvanUIModule'

export type VJson = any

export type ViewExtendType<T> = {
  [P in keyof T]?: Partial<T[P]>
}

