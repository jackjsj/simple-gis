import MarkerFactory from '@/assets/js/MarkerFactory';

export default class MapManager {
  constructor(onClick) {
    // 百度地图API功能
    const map = new BMap.Map('map', {
      enableMapClick: false,
    }); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity('北京'); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    this.map = map;
    map.addEventListener('click', e => e.overlay && onClick(e.overlay.info));
  }

  resetMapLocation() {
    this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
  }

  getMap() {
    return this.map;
  }

  locate(point, mode) {
    if (this.activeOverlay) {
      this.map.removeOverlay(this.activeOverlay);
      this.activeOverlay = null;
    }
    // this.map.clearOverlays();
    this.map.panTo(new BMap.Point(point.lon, point.lat));
    let marker;
    if (mode === '气泡图') {
      marker = MarkerFactory.getBubbleMarker(point, true);
    } else {
      marker = MarkerFactory.getColorfulMarker(point, true);
    }
    this.activeOverlay = marker;
    this.map.addOverlay(this.activeOverlay);
  }

  // 添加点位
  addPoints(points, mode) {
    this.map.clearOverlays();
    points.forEach(pt => {
      let marker;
      if (mode === '气泡图') {
        marker = MarkerFactory.getBubbleMarker(pt);
      } else {
        marker = MarkerFactory.getColorfulMarker(pt);
      }
      marker.info = pt;
      this.map.addOverlay(marker);
    });
  }
}
