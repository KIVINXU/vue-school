import request from '@/utils/request'

export function fetchList(url, query) {
  return request({
    url: url,
    method: 'post',
    data: query
  })
}
//创建table数据
export function createTable(url, data) {
 return request({
   url: url,
   method: 'post',
   data
 })
}
//人员录入请求
export function createPerson(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
