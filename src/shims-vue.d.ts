// eslint-disable-next-line
import Vue from 'vue';
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
export * from '@types/jquery'

declare module '*.vue' {
    export default Vue;
}

declare global {
    const agGrid: any
    const layer: any
    // const YvanUI: YvanUI.Static
}
