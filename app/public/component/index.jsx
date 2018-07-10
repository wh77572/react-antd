import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import '../style/component.less'
import '../style/resetAntd.less'
import '../style/theme.less'

@connect((state, props) => ({}))
export default class App extends Component {
  // 初始化页面常量 绑定事件方法
  constructor() {
    super()
  }

  // 组件已经加载到dom中
  componentDidMount() {
  }

  componentWillUpdate() {
  }

  render() {
    const { children } = this.props
    return (
      <div className="container-box">
        {children}
      </div>
    )
  }
}
