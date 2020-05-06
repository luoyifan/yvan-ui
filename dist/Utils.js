// @ts-ignore
import pinyin from 'pinyin';
export function getFirstPinyin(msg) {
    var r = pinyin(msg, {
        style: pinyin.STYLE_FIRST_LETTER,
        heteronym: true,
    });
    return _.map(r, function (ar) { return ar.join(''); }).join('');
}
//# sourceMappingURL=Utils.js.map