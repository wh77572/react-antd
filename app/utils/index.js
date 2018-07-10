import * as ajaxFun from './ajax'

export const api = ajaxFun;

export function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
