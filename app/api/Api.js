/* eslint-disable camelcase */
import { createAjaxAction } from '../utils/ajax'

import {
  Api_Login,
} from './apis'

// 登录/注册
export const fetchLogin = createAjaxAction(Api_Login)
