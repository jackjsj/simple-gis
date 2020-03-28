import { ringColors, saturationColors } from '@/assets/js/constant';
import { saturation2Code } from '@/assets/js/utils';

export default class MarkerFactory {
  // 获取彩色Marker
  static getColorfulMarker(point, isSelected) {
    return new BMap.Marker(new BMap.Point(point.lon, point.lat), {
      // 指定Marker的icon属性为Symbol
      icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        fillColor: ringColors[point.ring], //填充颜色
        fillOpacity: 1,
        strokeWeight: 1,
        strokeOpacity: 0.5,
        scale: isSelected ? 2 : 1,
        strokeColor: ringColors[point.ring],
      }),
    });
  }

  static getBubbleMarker(point, isSelected) {
    return new BMap.Circle(new BMap.Point(point.lon, point.lat), point.flow, {
      strokeColor: isSelected ? '#6ac160' : '#ddd',
      fillColor: saturationColors[saturation2Code(point.saturation)],
      strokeWeight: isSelected ? 2 : 1,
      fillOpacity: 0.4,
      strokeStyle: isSelected ? 'solid' : 'dashed',
    });
  }
}
