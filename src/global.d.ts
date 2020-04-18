import lodash from 'lodash'
// import { BaseModule } from './YvanModule'
import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}
declare global {
  // const agGrid: any
  const layer: any
  // const webix: any
  const _: typeof lodash
  export function addTab<M, Refs, INP>(
    text: string,
    id: string
  ): // module: BaseModule<M, Refs, INP>
  void
}

// eslint-disable-next-line
// eslint-disable-next-line
