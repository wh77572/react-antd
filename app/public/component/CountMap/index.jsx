import React, { Component } from 'react'
import { Map, Marker, Polygon } from 'react-amap'

import './index.less'

// 将内容展示划分为三个层级
// 地图的缩放层级 (11-13 区县、14-15 商圈、16-18 小区)
// const mapLevel = [11, 12, 14]
const mapLevel = [11, 14, 16]

// 保存地图数据
window.southwest = {}
window.northeast = {}
window.mapZoom = mapLevel[0]

export default class CountMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 地图缩放层级
      defaultZoom: mapLevel[0],
      // 地图中心坐标点
      mapCenter: null,
      // 行政区域路径
      areaPath: [],
      // 是否显示行政区域
      areaShow: false,
    }

    this.timerId = null

    // 获取当前城市的坐标点
    this.getCityLocation = (cityName) => {
      window.AMap.service('AMap.Geocoder', () => {
        const geocoder = new window.AMap.Geocoder({})

        // 地理编码,返回地理编码结果
        geocoder.getLocation(cityName, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const geo = result.geocodes[0]
            if (geo) {
              this.cityCode = geo.addressComponent.citycode
              this.setState({
                mapCenter: [geo.location.lng, geo.location.lat]
              })
            }
          }
        })
      })
    }

    // 获取地图可视范围,并记录东南西北范围坐标
    this.getMapBounds = () => {
      clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        // 获取地图缩放层级
        const zoom = this.mapInstance.getZoom()
        this.setState({
          defaultZoom: zoom
        })
        window.mapZoom = zoom

        // 获取当前地图视图范围
        const bounds = this.mapInstance.getBounds()

        // 西南坐标
        window.southwest = {
          lng: bounds.southwest.lng,
          lat: bounds.southwest.lat
        }

        // 东北坐标
        window.northeast = {
          lng: bounds.northeast.lng,
          lat: bounds.northeast.lat
        }

        // 执行父组件回调
        this.props.handleMapChange &&
          this.props.handleMapChange()
      }, 10)
    }

    // 获取地图区域
    this.getMapArea = (areaName) => {
      // 加载行政区划插件
      window.AMap.service('AMap.DistrictSearch', () => {
        // 实例化DistrictSearch
        const district = new window.AMap.DistrictSearch({
          subdistrict: 0, // 返回下一级行政区
          extensions: 'all', // 返回行政区边界坐标组等具体信息
          level: 'district' // 查询行政级别为 区/县
        });

        // 行政区查询
        district.search(areaName, (status, result) => {
          let match

          if (this.inMarker) {
            result.districtList.forEach((item) => {
              if (item.citycode === this.cityCode) {
                match = item
              }
            })

            if (match !== undefined) {
              this.setState({
                areaPath: match.boundaries,
                areaShow: true,
              })
            }
          }
        })
      })
    }

    // 定义地图的处理事件
    this.mapEvents = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance
        this.getMapBounds()

        // 监听地图的缩放事件
        // 通过鼠标缩放地图将先后触发zoomend和moveend事件
        window.AMap.event.addListener(mapInstance, 'zoomend', () => {
          this.getMapBounds()
        })

        // 监听地图的平移事件
        // 地图移动结束后触发，包括平移，以及中心点变化的缩放。
        // 如地图有拖拽缓动效果，则在缓动结束后触发
        // 设置Map的zoom属性不会触发moveend事件
        // 设置Map的center属性会触发moveend事件
        window.AMap.event.addListener(mapInstance, 'moveend', () => {
          // 点击marker缩放层级,将设置map的zoom和center属性,
          // 会先触发moveend事件,一定时间后再先后触发zoomend和moveend事件
          // 进而多次触发getMapBounds,这里进行简单的判断
          if (this.isMarkerClick) {
            this.isMarkerClick = false
          } else {
            this.getMapBounds()
          }
        })
      }
    }

    // 定义覆盖物的处理事件
    this.markerEvents = {
      // 鼠标滑入覆盖物显示行政区域图
      mouseover: (event) => {
        if (this.state.defaultZoom < mapLevel[1]) {
          this.inMarker = true
          this.getMapArea(event.target.F.extData.name)
        }
      },

      // 鼠标滑出覆盖物隐藏行政区区域图
      mouseout: (event) => {
        this.inMarker = false
        this.setState({
          areaShow: false,
        })
      },

      // 点击覆盖物切换到指定层级
      click: (event) => {
        const zoom = this.state.defaultZoom

        if (zoom < mapLevel[1]) {
          // 从一级视图切换到二级视图
          this.setState({
            defaultZoom: mapLevel[1]
          })
        } else if (zoom < mapLevel[2]) {
          // 从二级视图切换到三级视图
          this.setState({
            defaultZoom: mapLevel[2]
          })
        } else {
          // 点击三级视图将获取所在小区的房源列表
          this.props.handleMapChange &&
            this.props.handleMapChange(event.target.F.extData.areaId)
        }

        this.setState({
          areaShow: false,
        })

        this.isMarkerClick = true

        // 一二级视图下将地图坐标中心点切换为覆盖物的坐标点
        if (zoom < mapLevel[2]) {
          this.setState({
            mapCenter: [event.target.F.position.lng, event.target.F.position.lat]
          })
        }
      }
    }
  }

  componentDidMount() {
    this.getCityLocation(this.props.cityName)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cityName !== nextProps.cityName) {
      this.getCityLocation(nextProps.cityName)
    }
  }

  render() {
    return this.state.mapCenter === null ? null : (
      <div style={{ width: '100%', height: '100%' }}>
        <Map
          useAMapUI
          amapkey="444be3cce8d7d63512f4cbbc7d037f1e"
          version="1.4.6"
          center={this.state.mapCenter}
          zoom={this.state.defaultZoom}
          zooms={[11, 18]}
          events={this.mapEvents}
        >
          {
            this.props.mapData.map((item, index) => {
              const position = [item.longitude, item.latitude]
              return (
                <Marker
                  key={item.areaId}
                  position={position}
                  events={this.markerEvents}
                  extData={item}
                >
                  {
                    this.state.defaultZoom < mapLevel[2] ? (
                      <div className="marker-style">
                        <p>{item.name}</p>
                        <p>{item.count}套</p>
                      </div>
                    ) : (
                      <div className="marker-span-style">
                        <span>{item.name}</span>
                        <span>{item.count}间</span>
                      </div>
                    )
                  }
                </Marker>
              )
            })
          }
          {
            this.state.areaPath.map((item, index) => {
              return (
                <Polygon
                  key={index}
                  path={item}
                  draggable={false}
                  visible={this.state.areaShow}
                  style={{
                    strokeWeight: 2,
                    strokeColor: '#ea1b1b',
                    fillOpacity: 0
                  }}
                />
              )
            })
          }
        </Map>
      </div>
    )
  }
}
