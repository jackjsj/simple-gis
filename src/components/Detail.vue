<template>
  <div class="detail">
    <el-form ref="form"
      label-position="left" label-width="110px">
      <el-form-item v-for="f in fields.filter(f=>!f.hide)"
        :key="f.key"
        :label="f.name">
        <el-input :readonly="!editing" v-model="f.value"></el-input>
      </el-form-item>
      <el-form-item
        label="开启编辑">
        <el-switch
          v-model="editing">
        </el-switch>
      </el-form-item>
      <div class="flex" v-show="editing" style="justify-content:flex-end;">
        <el-button @click="submit">{{editing ? '提交':'确定'}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { Switch } from 'element-ui';

export default {
  components: {
    'el-switch': Switch,
  },
  data() {
    return {
      fields: [
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
      ],
      editing: false,
    };
  },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    value(newValue) {
      this.fields.forEach(f => {
        f.value = newValue[f.key];
      });
    },
  },
  mounted() {},
  methods: {
    submit() {
      const data = {};
      this.fields.forEach(f => {
        data[f.key] = f.value;
      });
      this.$emit('detailUpdate', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 5px;
}
.el-input {
  // width: 200px;
}
.detail {
  height: 580px;
  overflow: auto;
}
</style>
<style lang="scss">
.detail {
  // .el-form-item__label {
  //   width: 100px;
  // }
  .el-input__inner {
    height: 30px;
  }
  .el-form-item__label{
    line-height: 30px;
  }
  .el-form-item__content{
    line-height: 30px;
  }
  .el-input__inner:read-only {
    background: rgba(238, 238, 238, 0.5);
  }
}
</style>
