import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HouseIndex.less';

@connect((state, props) => ({
}))
export default class HouseIndex extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  // 组件已经加载到dom中
  componentDidMount() {
  }

  // 组件将接收新的传参时触发
  componentWillReceiveProps(nextProps) {
    // if (nextProps.changeCityVal.value) {}
  }

  render() {
    return (
      <div className="house-index">
        <img src="../public/images/one-piece.png" alt="" />
      </div>
    );
  }
}
