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
export declare function createContextMenu(config: any, scope: any): any;
