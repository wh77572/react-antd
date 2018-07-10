import fetch from 'isomorphic-fetch'
import { message } from 'antd'
import axios from 'axios'
import QS from 'qs'

import { prefix, suffix, timeout } from '../config'

// axios配置
const axiosBaseConfig = {
  // baseURL: prefix,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // 跨域请求，是否带上认证信息
  withCredentials: true, // default
  // http返回的数据类型
  // 默认是json，可选'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default
  // http请求返回状态码检查
  validateStatus: status =>
    status >= 200 && status < 300, // default
  // 请求数据预处理
  // transformRequest: [(data, headers) => {
  //   // 加入token？
  //   const token = sessionStorage.getItem('token')
  //   if (token) {
  //     data.token = token
  //   }
  //   // 请求对象转换成jon字符串
  //   if (typeof data === 'object') {
  //     return JSON.stringify(data)
  //   }
  //   return data
  // }],
  // 返回数据预处理
  transformResponse: [respData =>
    // 检查返回status值
    // if (typeof respData.status !== 'undefined') {
    //   if (respData.status === 1) {
    //     return respData
    //   }
    //   throw new Error(respData.errMsg || 'respData.status不为0')
    // }
    respData,
  ],
}
// axios 实例
const axiosInstance = axios.create(axiosBaseConfig)

// 拦截器
axiosInstance.interceptors.request.use(req => req, error =>
  // 当请求错误时
  Promise.reject(error))

axiosInstance.interceptors.response.use(resp => resp, (error) => {
  // 当返回错误时
  if (axios.isCancel(error)) {
    return Promise.reject(new Error('请求被取消'))
  }
  if ('code' in error && error.code === 'ECONNABORTED') {
    return Promise.reject(new Error('请求超时'))
  }
  return Promise.reject(error)
})

function axiosPost(url, reqData, target, handleCancel) {
  // const newUrl = `${prefix}${url}`
  const newUrl = `${url}`
  const config = {
    cancelToken: handleCancel ? handleCancel.token : undefined,
  }
  let sendData = reqData

  // 通过传参中的contentType传值来满足multipart/form-data头数据类型
  const reqJSON = QS.parse(reqData)
  const formData = new FormData()

  if (reqJSON.contentType === 'multipart/form-data') {
    config.headers = {
      'Content-Type': reqJSON.contentType
    }
    delete reqJSON.contentType

    Object.keys(reqJSON).forEach(key => {
      formData.append(key, reqJSON[key])
    })
    sendData = formData
  }

  return axiosInstance.post(newUrl, sendData, config)
}

function axiosGet(url, reqData, handleCancel) {
  // const newUrl = `${prefix}${url}`
  const newUrl = `${url}`

  return axiosInstance.get(newUrl, reqData, {
    cancelToken: handleCancel ? handleCancel.token : undefined,
  })
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url        请求url
 * @param  {object} options    传给axios的配置
 * @return {function}
 */
function request(url, options) {
  return function (reqData, handleCancel) {
    if (options.method === 'post') {
      return axiosPost(url, reqData, handleCancel);
    }
    // else if (options.method === 'get') {
    //   return axiosGet(url, reqData, handleCancel);
    // }
    return axiosGet(url, reqData, handleCancel);
  }
}

export {
  request
}

export const createAjaxAction = (httpHandle, startAction, endAction) => {
  return (reqData, cb, reject, handleCancel) =>
    (dispatch) => {
      // requet start
      const qs = QS
      const ticket = localStorage.getItem('ticket')
      if (ticket) {
        axiosInstance.defaults.headers.intebox_sso_tkt = ticket
      } else {
        delete axiosInstance.defaults.headers.intebox_sso_tkt
      }
      startAction && dispatch(startAction());
      httpHandle(qs.stringify(reqData), handleCancel)
        .then((responseData) => {
          endAction && dispatch(endAction({ req: qs.stringify(reqData), res: responseData.data }));
          return responseData.data
        })
        .then((responseData) => {
          switch (responseData.errorCode) {
            case 0:
              cb && cb(responseData);
              break;
            default:
              if (responseData.errorCode.toString() === '-9999') {
                //todo 登出
                sessionStorage.clear()
              }
              if (reject) {
                reject(responseData)
              } else {
                message.error(responseData.message)
              }
              break
          }
        })
        .catch((error) => {
          //todo 异常信息美化
          if (reject) {
            reject({ errorCode: -1, message: error.message })
          } else {
            message.error(error.message)
          }
        })
    }
};
