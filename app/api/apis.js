/* eslint-disable camelcase */
import { api } from 'utils'

// api加下划线的形式命名api名称，并且首字母大写，每个api后面加注释，例如

const publicParam = '/saas20/api/1/AptGuest'

// 登录
export const Api_Login = api.request(
  publicParam + '/customer/authenticate',
  { method: 'post' }
)
