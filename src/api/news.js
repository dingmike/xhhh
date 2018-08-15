import request from '@/utils/request'
export function getNewsList(query) {
  return request({
    url: 'notice/list',
    method: 'get',
    params: query
  })
}


export function getUserInfo(userId) {
  const data = {
    id: userId
  }
  return request({
    url: 'user/adminInfo',
    method: 'get',
    params: data
  })
}

export function logout() {

  return request({
    url: 'logout',
    method: 'get',
    params: ''
  })
}
