import { createAction } from 'redux-actions'

import {
  CHECK_LOGIN_OR_REGISTER,
} from './actionType'

// 或者点击登录还是注册
export const checkLoginOrRegister = createAction(CHECK_LOGIN_OR_REGISTER)
