import { handleActions } from 'redux-actions'

import {
  CHECK_LOGIN_OR_REGISTER,
  CHECK_BREAD_VALUE,
  CHANGE_CITY_VALUE
} from '../actions/actionType'

//点击切换登录或者注册
const loginOrRegisterValue = () => ({})
export const loginOrRegisterVal = handleActions({
  [CHECK_LOGIN_OR_REGISTER](state, action) {
    state.loginOrRegisterVal = action.payload
    return { ...state }
  }
}, loginOrRegisterValue())

// 面包屑接收第三方的值
const anotherValue = () => ({})
export const anotherVal = handleActions({
  [CHECK_BREAD_VALUE](state, action) {
    state.value = action.payload
    return { ...state }
  }
}, anotherValue())

// 切换城市
const changeCityValue = () => ({})
export const changeCityVal = handleActions({
  [CHANGE_CITY_VALUE](state, action) {
    const tempState = Object.assign({}, state)
    tempState.value = action.payload
    return { ...tempState }
  }
}, changeCityValue())
