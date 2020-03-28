export const ringColors = {
  1: '#DC251F',
  2: '#00863E',
  3: '#183885',
  4: '#E9943A',
  5: '#0194DA',
  6: '#E86496',
};

export const saturationColors = {
  A: 'rgb(0,136,0)',
  B: 'rgb(85,183,0)',
  C: 'rgb(255,255,0)',
  D: 'rgb(255,152,0)',
  E: 'rgb(255,74,0)',
  F: 'rgb(255,5,0)',
};
export const fields = [
  {
    name: 'ID',
    key: 'id',
    hide: true,
    value: null,
  },
  {
    name: '所在道路',
    key: 'road',
    value: null,
  },
  {
    name: '经度',
    key: 'lon',
    value: null,
  },
  {
    name: '纬度',
    key: 'lat',
    value: null,
  },
  {
    name: '天桥类型',
    key: 'type',
    value: null,
  },
  {
    name: '结构形式',
    key: 'constructure',
    value: null,
  },
  {
    name: '技术等级',
    key: 'level',
    value: null,
  },
  {
    name: '材料形式',
    key: 'material',
    value: null,
  },
  {
    name: '长度(m)',
    key: 'length',
    value: null,
  },
  {
    name: '宽度(m)',
    key: 'width',
    value: null,
  },
  {
    name: '面积(㎡)',
    key: 'area',
    value: null,
  },
  {
    name: '梯道面积(㎡)',
    key: 'stairArea',
    value: null,
  },
  {
    name: '环路',
    key: 'ring',
    value: null,
  },
  {
    name: '流量',
    key: 'flow',
    value: null,
  },
  {
    name: '优化建议',
    key: 'advice',
    value: null,
  },
  {
    name: '服务水平等级',
    key: 'saturation',
    value: null,
  },
];
export const fieldMap = fields.reduce((cur, next) => {
  if (!next.hide) {
    cur[next.key] = next.name;
  }
  return cur;
}, {});
