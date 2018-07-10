import { hashHistory } from 'react-router'

/**
 * 验证手机号
 * @param {Object} option 参数配置
 * @param {string} option.requiredMsg 必填项提示文本
 * @param {string} option.errorMsg 校验错误提示文本
 */
export const validMobile = ({
    requiredMsg = '请输入手机号码',
    errorMsg = '手机号码有误，请重新输入'
  } = {}) => {
  return (rule, value, callback) => {
    if (value) {
      if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(errorMsg)
      } else {
        callback()
      }
    } else {
      callback(requiredMsg)
    }
  }
}

/**
 * 验证图片验证码
 * @param {Object} form 表单组件
 */
export const validImgCode = (form) => {
  return (ruler, value, callback) => {
    if (value) {
      if (!/^[0-9a-z]{4}$/i.test(value)) {
        callback('验证码有误，请重新输入');
      } else {
        callback()
      }
    } else {
      callback('请输入验证码');
    }
  }
}

/**
 * 验证短信验证码
 * @param {Object} form 表单组件
 */
export const validMobileCode = (form) => {
  return (ruler, value, callback) => {
    if (form.isMobileCodeError) {
      callback()
      return;
    }

    if (value) {
      if (!/^\d{6}$/i.test(value)) {
        callback('短信验证码有误，请重新输入');
      } else {
        callback()
      }
    } else {
      callback('请输入短信验证码');
    }
  }
}

/**
 * 验证密码
 * @param {Object} form 表单组件
 */
export const validPwd = (form) => {
  return (ruler, value, callback) => {
    if (value) {
      if (!/^\w{6,16}$/.test(value)) {
        callback('密码格式有误，请填写6-16位数字、英文字母或字符');
      } else {
        callback()
      }
    } else {
      callback('请设置密码');
    }
  }
}

/**
 * 验证确认密码
 * @param {Object} form 表单组件
 * @param {string} field 密码字段名称
 */
export const validComparePwd = (form, field = 'password') => {
  return (rule, value, callback) => {
    if (value) {
      if (value !== form.getFieldValue(field) && form.getFieldValue(field)) {
        callback('密码不一致，请重新输入');
      } else {
        callback();
      }
    } else {
      callback('请确认密码')
    }
  }
}

/**
 * 提交接口后的错误显示验证
 * @param {Object} form 表单组件
 * @param {string} type 错误类型
 */
export const validBySubmit = (form, type) => {
  return (rule, value, callback) => {
    if (form[type]) {
      form[type] = false
      callback(form.errorMsg)
    } else {
      callback()
    }
  }
}

// 检测是否登录
export const checkIsLogin = function () {
  return localStorage.getItem('ticket') !== null
}

// 保存用户信息
export const saveUserInfo = function (data) {
  localStorage.setItem('ticket', data.ticket)
  localStorage.setItem('userPersonId', data.personId)
  localStorage.setItem('userNickName', data.nickname)
  localStorage.setItem('userMobile', data.mobile)
  localStorage.setItem('userAvator', data.headPicUrl || '')
}

// 退出登录
export const loginOut = function () {
  localStorage.removeItem('ticket')
  localStorage.removeItem('userPersonId')
  localStorage.removeItem('userNickName')
  localStorage.removeItem('userMobile')
  localStorage.removeItem('userAvator')

  hashHistory.push('/?' + new Date().getTime())
}


// 拼接 一室一厅一卫
export const concatRoomType = (v) => {
  let str = ''
  if (v.roomCount) {
    str += v.roomCount + '室'
  }
  if (v.hallCount) {
    str += v.hallCount + '厅'
  }
  if (v.toiletCount) {
    str += v.toiletCount + '卫'
  }
  return str
}
