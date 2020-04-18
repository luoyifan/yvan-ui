export function getFirstPinyin(msg: string): string {
    return _.get(window, 'getFirstPinyin')(msg);
}
