import {
  PropertyDescription,
  PropertyDescriptionInterface
} from './PropertyDescription'

export const PropertyDescriptionTable = new Map<String, PropertyDescription>()

PropertyDescriptionTable.set(
  'layout',
  new PropertyDescription({
    props: [
      {
        name: 'borderless',
        default: true,
        group: 'css',
        desc: '有无边框',
        type: 'boolean'
      },
      {
        name: 'type',
        default: '',
        group: 'css',
        desc: '布局类型',
        type: ['line', 'clean', 'wide', 'space', 'form']
      }
    ]
  })
)

const YvBase: PropertyDescriptionInterface = {
  props: [
    {
      name: 'entityName',
      default: '',
      group: 'bind',
      desc: '实体类名',
      type: 'string'
    },
    {
      name: 'ctlName',
      default: '',
      group: 'bind',
      desc: '控件名',
      type: 'string'
    },
    {
      name: 'css',
      default: '',
      group: 'css',
      desc: '样式类名',
      type: 'string'
    },
    {
      name: 'attr',
      default: {},
      group: 'css',
      desc: 'HTML属性',
      type: 'object'
    },
    {
      name: 'render',
      default: true,
      group: 'common',
      desc: '是否显示',
      type: 'boolean'
    },
    {
      name: 'padding',
      default: undefined,
      group: 'css',
      desc: '内边距',
      type: 'object'
    },
    {
      name: 'margin',
      default: undefined,
      group: 'css',
      desc: '外边距',
      type: 'object'
    },
    {
      name: 'ff',
      default: 0,
      group: 'common',
      desc: '自动定焦时间',
      type: 'number'
    }
  ],
  events: [{ name: 'onRender', desc: '第一次控件被渲染时触发' }]
}

const YvDataSource: PropertyDescriptionInterface = {
  props: [
    {
      name: 'type',
      default: '',
      group: 'data',
      desc: '数据源类型',
      type: 'dataSource'
    }
  ],
  events: [{ name: 'onDataComplete', desc: '数据绑定完成后触发' }]
}

PropertyDescriptionTable.set(
  'template',
  new PropertyDescription(YvBase, {
    props: [
      {
        name: 'template',
        default: '',
        group: 'common',
        desc: 'HTML内容',
        type: 'string'
      }
    ]
  })
)

PropertyDescriptionTable.set(
  'text',
  new PropertyDescription(YvBase, {
    props: [
      {
        name: 'label',
        default: '',
        group: 'common',
        desc: '文本描述',
        type: 'string'
      },
      {
        name: 'labelAlign',
        default: '',
        group: 'common',
        desc: '描述对齐方式',
        type: ['left', 'right', 'center']
      },
      {
        name: 'labelWidth',
        default: undefined,
        group: 'common',
        desc: '文本宽度',
        type: 'number'
      },
      {
        name: 'gravity',
        default: 1,
        group: 'common',
        desc: '占位权重',
        type: 'number'
      },
      {
        name: 'readonly',
        default: false,
        group: 'common',
        desc: '只读',
        type: 'boolean'
      },
      {
        name: 'disabled',
        default: false,
        group: 'common',
        desc: '禁用',
        type: 'boolean'
      },
      {
        name: 'required',
        default: false,
        group: 'common',
        desc: '必填',
        type: 'boolean'
      },
      {
        name: 'value',
        default: '',
        group: 'common',
        desc: '字段值',
        type: 'string'
      },
      {
        name: 'prompt',
        default: '请输入',
        group: 'common',
        desc: '水印',
        type: 'string'
      },
      {
        name: 'validType',
        default: '',
        group: 'common',
        desc: '校验类型',
        type: 'valid'
      }
    ]
  })
)

PropertyDescriptionTable.set(
  'button',
  new PropertyDescription(YvBase, {
    props: [
      {
        name: 'text',
        default: '',
        group: 'common',
        desc: '按钮标题',
        type: 'string'
      },
      {
        name: 'icon',
        default: '',
        group: 'common',
        desc: '图标样式',
        type: 'string'
      },
      {
        name: 'disabled',
        default: false,
        group: 'common',
        desc: '是否禁用',
        type: 'boolean'
      },
      {
        name: 'gravity',
        default: 1,
        group: 'css',
        desc: '占位权重',
        type: 'number'
      },
      {
        name: 'tooltip',
        default: '',
        group: 'common',
        desc: '悬停提示',
        type: 'string'
      },
      {
        name: 'cssType',
        default: 'default',
        group: 'css',
        desc: '样式类型',
        type: ['default', 'primary', 'danger', 'success']
      }
    ],
    events: [{ name: 'onClick', desc: '第一次控件被渲染时触发' }]
  })
)

PropertyDescriptionTable.set(
  'label',
  new PropertyDescription(YvBase, {
    props: [
      {
        name: 'label',
        default: '',
        group: 'common',
        desc: '标签内容',
        type: 'string'
      },
      {
        name: 'align',
        default: 'left',
        group: 'common',
        desc: '对齐方式',
        type: ['left', 'right', 'center']
      },
      {
        name: 'disabled',
        default: false,
        group: 'common',
        desc: '是否禁用',
        type: 'boolean'
      },
      {
        name: 'width',
        default: 100,
        group: 'css',
        desc: '宽度',
        type: 'number'
      },
      {
        name: 'gravity',
        default: 1,
        group: 'css',
        desc: '占位权重',
        type: 'number'
      },
      {
        name: 'tooltip',
        default: '',
        group: 'common',
        desc: '悬停提示',
        type: 'string'
      }
    ]
  })
)

PropertyDescriptionTable.set(
  'tree',
  new PropertyDescription(YvDataSource, YvBase, {
    props: [
      {
        name: 'showCheckbox',
        default: false,
        group: 'common',
        desc: '显示勾选',
        type: 'boolean'
      },
      {
        name: 'showLeftIcon',
        default: true,
        group: 'common',
        desc: '显示左侧图标',
        type: 'boolean'
      },
      {
        name: 'showIcon',
        default: true,
        group: 'common',
        desc: '显示图标',
        type: 'boolean'
      }
    ],
    events: [
      { name: 'onNodeClick', desc: '节点被点击后触发' },
      { name: 'onNodeDblClick', desc: '节点被双击后触发' }
    ]
  })
)
