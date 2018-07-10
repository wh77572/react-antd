/**
 * Created by neo on 2018/5/24.
 * 周边检索 - 高德地图
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.less';

const AMap = window.AMap
const AMapUI = window.AMapUI

// 返回随机ID
function getId() {
  return Math.random()
    .toString(36)
    .slice(2);
}

// POI搜索类型
const PoiTypes = [{
  name: '地铁',
  value: 'dt'
}, {
  name: '公交',
  value: 'gj'
}, {
  name: '餐饮',
  value: 'cy'
}, {
  name: '超市',
  value: 'cs'
}, {
  name: '银行',
  value: 'yh'
}, {
  name: '影院',
  type: '电影院',
  value: 'yy'
}, {
  name: '酒店',
  value: 'jd'
}, {
  name: '医院',
  value: 'yiy'
}, {
  name: '景区',
  type: '旅游景点',
  value: 'jq'
}, {
  name: '加油站',
  value: 'jyz',
  last: true
}]

// 地址检索的列表组件
function RoadLine(props) {
  return (
    <li>
      <div className="addr">{`${props.index + 1}.距离${props.address.replace(/;/g, '、')}${props.name}`}</div>
      <div className="dis">{`${props.distance}米`}</div>
    </li>
  )
}

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.containerId = getId();

    this.state = {
      pois: [],
      selectedItem: PoiTypes[0].value, //默认第一个
      roomLngLat: null
    }
  }

  static propTypes = {
    // 选择的城市
    city: PropTypes.string.isRequired,
    // 客房经纬度
    position: PropTypes.shape({
      lng: PropTypes.number,
      lat: PropTypes.number
    }).isRequired,
    // 搜索半径
    radius: PropTypes.number
  }

  static defaultProps = {
    style: {
      width: '100%',
      height: '420px'
    },
    position: {
      lng: '',
      lat: ''
    },
    city: '全国',
    radius: 2000,
  };

  componentDidMount() {
    this.initMap();
  }

  componentWillReceiveProps(nextProps) {
    // 获取客房的经纬度，并转化为高德地图中经纬度对象，用于计算两点距离
    const roomLngLat = new AMap.LngLat(nextProps.position.lng, nextProps.position.lat);
    this.setState({ roomLngLat })
  }

  // 初始化并进行默认查询
  initMap() {
    this.map = new AMap.Map(this.containerId, {
      resizeEnable: true
    });

    // 使用搜索服务
    AMap.service(['AMap.PlaceSearch'], () => {
      this.queryPOI(PoiTypes[0].name)
    });

    AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
      //添加一个缩放控件
      this.map.addControl(new BasicControl.Zoom({
        position: 'rb'
      }));
    });
  }

  // 渲染检索列表的内容输出
  renderRoadLine() {
    if (this.state.pois && this.state.pois.length) {
      return (
        <div className="road-line">
          <div className="road-line-box">
            <ul className="road-line-list">
              {
                this.state.pois.map((item, index) => {
                  return <RoadLine index={index} key={item.id} {...item} />
                })
              }
            </ul>
          </div>
        </div>
      )
    }
    return null;
  }

  // 点击周边配套查询
  handleItemClick(item) {
    this.setState({
      selectedItem: item.value
    });

    this.queryPOI(item.type || item.name);
  }

  // 查询地图检索坐标点
  queryPOI(word) {
    const { city, position, radius } = this.props;

    this.map.clearMap();

    const placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
      pageSize: 20,
      pageIndex: 1,
      type: word, // 兴趣点类别
      city: city, // 城市
      map: this.map,
    });

    placeSearch.searchNearBy('', [position.lng, position.lat], radius, (status, result) => {
      // 处理显示
      let pois = [];

      if (status === 'complete' && result.info === 'OK') {
        pois = this.processPoiResult(result.poiList.pois);
      }

      this.setState({ pois: pois });
    });
  }

  // 处理poi查询结果
  processPoiResult(poiResult) {
    const items = [];

    for (let i = 0; i < poiResult.length; i += 1) {
      const poi = poiResult[i];

      const dis = parseInt(this.getDistance(poi.location), 10);

      items.push({
        id: poi.id,
        address: poi.address,
        name: poi.name,
        distance: dis,
      });
    }

    return items;
  }

  // 计算两个经纬度之间距离
  getDistance(location) {
    const lnglat2 = new AMap.LngLat(location.lng, location.lat);
    return Math.round(this.state.roomLngLat.distance(lnglat2));
  }

  render() {
    const { style } = this.props;

    return (
      <div
        style={{
          ...style,
          position: 'relative'
        }}
        className="around-map"
      >
        <div id={this.containerId} ref="map" style={style} />
        <div className="tools">
          <ul className="tools-icon-list">
            {
              PoiTypes.map(item => {
                return (
                  <li
                    className={classNames({
                      active: item.value === this.state.selectedItem
                    })}
                    key={item.value}
                    onClick={this.handleItemClick.bind(this, item)}
                  >
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
          {this.renderRoadLine()}
        </div>
      </div>
    );
  }
}
