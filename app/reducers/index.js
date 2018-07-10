import { routerReducer as routing, } from 'react-router-redux'
import { combineReducers } from 'redux'

import {
  loginOrRegisterVal,
  anotherVal,
  changeCityVal
} from './common'

const rootReducer = combineReducers({
  routing,
  config: (state = {}) => state,
  loginOrRegisterVal, // 点击登录或者注册
  anotherVal, // 面包屑接收第三方的值
  changeCityVal // 切换城市
});

export default rootReducer;
