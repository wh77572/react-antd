import React, { Component } from 'react'
import { Carousel } from 'antd'
import _ from 'lodash'
import { Map, Circle } from 'react-amap';

import CountMap from '../../public/component/CountMap'
import './index.less'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <CountMap />
      </div>
    )
  }
}
