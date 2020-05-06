import { YvEventDispatch } from './YvanEvent';
import webix from 'webix';
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
export function createContextMenu(config, scope) {
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