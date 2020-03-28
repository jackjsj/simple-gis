<template>
  <div class="home flex-col">
    <div class="flex aic jcb pl20 pr20 flex-none">
      <p class="b f30 title">北京市过街天桥可视化养护管理系统</p>
      <div class="flex aic ">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          default-active=""
          @select="onMenuItemChange">
          <el-submenu index="1">
            <template slot="title">信息显示</template>
            <el-menu-item index="点位图">点位图</el-menu-item>
            <el-menu-item index="气泡图">气泡图</el-menu-item>
            <el-menu-item index="待优化设施">待优化设施</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">信息统计</template>
            <el-menu-item @click="showStatResult(item.name)"
              v-for="item in statisticIndex"
              :key="item.name">{{item.name}}</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">数据导出</template>
            <el-menu-item
              v-for="item in exportItems"
              :key="item.name"
              @click="exportExcel(item)">{{item.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button type="danger" icon="el-icon-user-solid" round
          @click="logout">登出</el-button>
      </div>

    </div>
    <div class="rel flex1">
      <div id="map" class="map">
      </div>
      <div class="search-bar flex-col">
        <el-input placeholder="请输入关键字模糊查询" v-model="searchContent"
          class="input-with-select"
          @keyup.enter.native="search">
          <!-- <template #prepend>
            <el-button type="primary" icon="el-icon-location"
              @click="showPoints">定位</el-button>
          </template> -->
          <template #append>
            <el-button type="primary" icon="el-icon-search"
              @click="search">搜索道路名称</el-button>
          </template>
        </el-input>
        <!-- 搜索结果 -->
        <el-card v-show="searchResultVisible" :body-style="{
        padding:0
      }">
          <div class="search-result-list mb10">
            <div
              class="result-item f14 rel"
              v-for="(item,index) in pagedResult"
              :key="item.id"
              @click="onItemClick(item)">
              <div>
                <label class="b">{{index+(curPage-1)*10+1}}</label>
              </div>
              <div>
                <label>名称：{{item.name}}</label>
              </div>
              <div>
                <label>所在道路：{{item.road}}</label>
              </div>
              <div>
                <label>所在环路：{{item.ring}}</label>
              </div>
              <div>
                <label>流量：{{item.flow}}</label>
              </div>
              <div v-show="item.advice">
                <label style="color:#e57067;font-weight:bold;">优化建议：{{item.advice}}</label>
              </div>
              <div class="to-be-optimized" v-show="item.advice">待优化</div>
            </div>
          </div>
          <el-pagination
            class="mb10"
            layout="prev, pager, next"
            background
            :pager-count="5"
            :current-page.sync="curPage"
            :total="filteredResults.length">
          </el-pagination>
        </el-card>
      </div>
      <!-- <div class="toolbar" >
        <el-popover placement="top-start"
          width="300"
          trigger="hover">
          <el-button slot="reference" type="primary" icon="el-icon-set-up">总量</el-button>
          <template>
            <p class="b f16">
              北京市五环内过街天桥总数： {{points.length}}个
            </p>
          </template>
        </el-popover>
        <el-popover placement="top"
          trigger="hover"
          width="100">
          <el-button slot="reference" type="primary" icon="el-icon-set-up">不同环路天桥数量</el-button>
          <template>
            <p class="b f16"
              v-for="(value,ring) in ringColors" :key="ring">
              {{ring>5?5:ring}}环{{ring>5?'外':''}}:{{countByRing[ring] || 0}}个
            </p>
          </template>
        </el-popover>
        <el-popover placement="top"
          trigger="hover"
          width="100">
          <el-button slot="reference" type="primary" icon="el-icon-set-up">不同类型天桥数量</el-button>
          <template>
            <p class="b f16"
              v-for="(value,type) in countByType" :key="type">
              {{type}}:{{countByType[type] || 0}}个
            </p>
          </template>
        </el-popover>
      </div> -->
      <!-- 图例 -->
      <div class="legend-box">
        <p class="f20 mb10">图例</p>
        <!-- 环路 -->
        <div class="flex jcb pb10 mb10 bbd aic">
          <span class="f16">环路：</span>
          <div
            class="flex aic f16"
            v-for="(value,key) in ringColors" :key="key">
            <div class="legend-item" :style="`background:${value}`"></div>
            <span>{{key>5?5:key}}环{{key>5?'外':''}}</span>
          </div>
        </div>
        <!-- 服务水平 -->
        <div class="flex jcb aic">
          <span class="f16">服务水平：</span>
          <div
            class="flex aic f16"
            v-for="(value,key) in saturationColors" :key="key">
            <div class="legend-item" :style="`background:${value}`"></div>
            <span>{{key}}级</span>
          </div>
        </div>
      </div>
      <!-- 信息卡 -->
      <transition name="fade">
        <el-card class="info-card"
          v-show="infoCardVisible">
          <template #header>
            <div class="flex aic jcb">
              <span class="f16 b">{{currentDetail.name}}</span>
              <el-button style="padding:0"
                @click="infoCardVisible = false;"
                icon="el-icon-close" type="text"></el-button>
            </div>
          </template>
          <Detail :value="currentDetail"
            @detailUpdate="onDetailUpdate"></Detail>
        </el-card>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx';
import { Pagination, Menu, MenuItem, Submenu } from 'element-ui';
import { ringColors, saturationColors, fieldMap } from '@/assets/js/constant';
import { saturation2Code } from '@/assets/js/utils';
import MapManager from '@/assets/js/MapManager';
import Detail from '@/components/Detail';

const filterRules = {
  hasAdvice(item) {
    return !!item.advice;
  },
};

const statisticIndex = [
  {
    name: '总量',
  },
  {
    name: '不同环路天桥数量',
  },
  {
    name: '不同类型天桥数量',
  },
];

const exportItems = [
  {
    name: '按【所在环路】导出',
    key: 'ring',
  },
  {
    name: '按【服务等级】导出',
    key: 'saturation',
  },
  {
    name: '按【天桥类型】导出',
    key: 'type',
  },
];
// 将workbook装化成blob对象
function workbook2blob(workbook) {
  // 生成excel的配置项
  const wopts = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  // 将字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  });
  return blob;
}

// 将blob对象创建bloburl，然后用a标签实现弹出下载框
function openDownloadDialog(blob, fileName) {
  if (typeof blob === 'object' && blob instanceof Blob) {
    blob = URL.createObjectURL(blob); // 创建blob地址
  }
  const aLink = document.createElement('a');
  aLink.href = blob;
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || '';
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  //   移动端
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  aLink.dispatchEvent(event);
}

export default {
  components: {
    'el-pagination': Pagination,
    'el-menu': Menu,
    'el-submenu': Submenu,
    'el-menu-item': MenuItem,
    Detail,
  },
  data() {
    return {
      searchContent: '',
      searchResultVisible: false,
      ringColors, // 环路颜色
      saturationColors, // 服务等级颜色
      statisticIndex,
      exportItems,
      points: [],
      searchResults: [],
      curPage: 1,
      infoCardVisible: false,
      currentDetail: {},
      countByRing: {},
      countByType: {},
      countBySaturation: {},
      filterList: [],
      mode: '',
    };
  },
  computed: {
    pagedResult() {
      const start = (this.curPage - 1) * 10;
      const end = this.curPage * 10;
      return this.filteredResults.slice(start, end);
    },
    // 获取待优化项过滤列表
    filteredResults() {
      let result = this.searchResults;
      this.filterList.forEach(rule => {
        result = result.filter(filterRules[rule]);
      });
      if (this.mapManager) {
        this.mapManager.addPoints(result, this.mode);
      }
      return result;
    },
  },
  async mounted() {
    // 请求点位数据
    await this.loadPoints();
    this.initMap();
  },
  methods: {
    // 登出
    logout() {
      sessionStorage.setItem('isLogin', '0');
      this.$router.push('/login');
    },
    // 数据导出
    exportExcel(item) {
      const { key, name } = item;
      const wb = XLSX.utils.book_new();
      // 处理数据 1. 将服务水平转为代码
      const points = this.points.map(p => ({
        ...p,
        saturation: saturation2Code(p.saturation),
      }));
      let countBy = {};
      switch (key) {
        case 'ring':
          countBy = this.countByRing;
          break;
        case 'type':
          countBy = this.countByType;
          break;
        default:
          countBy = this.countBySaturation;
          break;
      }
      Object.keys(countBy).forEach(_key => {
        let sheetName = _key;
        if (key === 'ring') {
          sheetName = _key > 5 ? '5环外' : `${_key}环`;
        }
        // 生成Excel数据
        const json = points
          .filter(p => p[key] == _key)
          .map(p => ({
            ...Object.keys(p).reduce((cur, next) => {
              if (fieldMap[next]) {
                cur[fieldMap[next]] = p[next];
              }
              return cur;
            }, {}),
          }));
        const sheet = XLSX.utils.json_to_sheet(json);
        XLSX.utils.book_append_sheet(wb, sheet, sheetName);
      });
      const workbookBlob = workbook2blob(wb);
      // 点击下载
      openDownloadDialog(workbookBlob, `${name}.xlsx`);
    },

    async loadPoints() {
      const ld = this.$loading();
      try {
        const { data } = await axios.get('http://localhost:3000/points');
        ld.close();
        this.points = data;
        data.forEach(item => {
          const { ring, type, saturation } = item;
          if (!this.countByRing[ring]) {
            this.countByRing[ring] = 1;
          } else {
            this.countByRing[ring]++;
          }
          if (!this.countByType[type]) {
            this.countByType[type] = 1;
          } else {
            this.countByType[type]++;
          }
          const saturationCode = saturation2Code(saturation);
          if (!this.countBySaturation[saturationCode]) {
            this.countBySaturation[saturationCode] = 1;
          } else {
            this.countBySaturation[saturationCode]++;
          }
        });
      } catch {
        this.$nofity({
          title: '提示',
          message: '连接服务器失败！',
          type: 'error',
          duration: 0,
        });
      }
    },
    initMap() {
      this.mapManager = new MapManager(pt => this.onItemClick(pt));
      this.map = this.mapManager.getMap();
      // this.showPoints();
    },
    // 查询点位
    search() {
      this.curPage = 1;
      const result = this.points.filter(pt =>
        pt.name.includes(this.searchContent),
      );
      this.searchResults = result;
      this.searchResultVisible = true;
    },
    // 点击定位加载点位
    async showPoints() {
      this.mapManager.resetMapLocation();
      this.searchContent = '';
      this.search();
    },
    // 列表点击
    onItemClick(item) {
      this.mapManager.locate(item, this.mode);
      this.currentDetail = item;
      this.infoCardVisible = true;
    },
    onDetailUpdate(data) {
      const ld = this.$loading();
      axios.post('http://localhost:3000/point/edit', data).then(resp => {
        ld.close();
        if (resp.status === 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          const target = this.points.find(item => item.id === data.id);
          if (target) {
            Object.assign(target, data);
          }
        } else {
          this.$message({
            message: '修改失败',
            type: 'error',
          });
        }
      });
    },

    // 显示统计结果
    showStatResult(type) {
      switch (type) {
        case '总量':
          this.$alert(
            `北京市五环内过街天桥总数： ${this.points.length}个`,
            type,
          );
          break;
        case '不同环路天桥数量':
          this.$alert(
            Object.keys(this.ringColors)
              .map(
                ring =>
                  `<p class="b f16">${ring > 5 ? 5 : ring}环${
                    ring > 5 ? '外' : ''
                  }:${this.countByRing[ring] || 0}个</p>`,
              )
              .join(''),
            type,
            { dangerouslyUseHTMLString: true },
          );
          break;
        case '不同类型天桥数量':
          this.$alert(
            Object.keys(this.countByType)
              .map(
                type =>
                  `<p class="b f16">${type}:${this.countByType[type] ||
                    0}个</p>`,
              )
              .join(''),
            type,
            { dangerouslyUseHTMLString: true },
          );
          break;
        default:
      }
    },

    // 菜单变化
    onMenuItemChange(mode) {
      if (mode && this.mode !== mode) {
        this.mode = mode;
        if (mode === '待优化设施') {
          this.filterList = ['hasAdvice'];
        } else {
          this.filterList = [];
        }
        // 渲染地图
        this.showPoints();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  height: 100%;
}
.map {
  height: 100%;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 10px;
  bottom: 10px;
  white-space: nowrap;
  cursor: pointer;
  z-index: 10;
  text-size-adjust: none;
  text-align: center;
  white-space: nowrap;
  border-radius: 3px;
  transition: all 0.3s;
  background: #fff;

  &:hover {
    background: rgb(139, 164, 220);
    color: #fff;
  }
}
.toolbar-btn {
  padding: 0 10px;
  border-right: 1px solid #ddd;
  &:last-child {
    border: none;
  }
}
.search-bar {
  display: flex;
  position: absolute;
  left: 10px;
  top: 10px;
  width: 380px;
}
.legend-box {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 400px;
}
.legend-item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  &:last-child {
    margin-bottom: 0;
  }
  opacity: 0.8;
}
.el-card {
  padding: 0;
}
.search-result-list {
  height: 600px;
  overflow: auto;
}
.result-item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  transition: all 0.5s;
  text-align: left;
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
  &:hover {
    background: rgba(139, 164, 220, 0.4);
  }
}
.to-be-optimized {
  position: absolute;
  top: 0;
  right: 0;
  background: #e57067;
  padding: 10px;
  font-size: 12px;
  color: #fff;
}
.info-card {
  position: absolute;
  top: 10px;
  right: 10px;
  // width: 400px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #ddd;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s;
}
.fade-enter {
  opacity: 0;
  transform: translateX(100%);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
<style lang="scss">
.home {
  .el-card__body {
    padding: 5px;
  }
  .el-dialog {
    position: absolute;
    right: 10px;
    top: 10px;
    overflow: auto;
  }
  .el-dialog--center .el-dialog__body {
    padding: 10px 10px 25px;
  }
  .el-card__header {
    padding: 8px 10px;
  }
  .el-submenu__title {
    font-size: 20px;
    color: #000 !important;
    font-weight: bold;
  }
}
</style>
