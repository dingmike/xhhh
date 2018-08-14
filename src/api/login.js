import request from '@/utils/request'
export function loginByUsername(username, password) {
  debugger
  var params = new URLSearchParams();
  params.append('account', username);       //你要传给后台的参数值 key/value
  params.append('password', password);
  /*const data = {
    account: username,
    password:password
  }*/
  return request({
    // url: '/login/login',
    // url: 'auth/login',
    url: 'login',
    method: 'post',
    data: params
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
/*
export function getUserInfo(token) {
  return request({
    url: 'user/userInfo',
    method: 'get',
    params: { token }
  })
}*/

