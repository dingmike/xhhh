import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
/*
*
* Create a cookie that expires 7 days from now, valid across the entire site:
* Cookies.set('name', 'value', { expires: 7 });
*
* */
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 }) // 7天后失效
}

export function removeToken() {
  debugger
  return Cookies.remove(TokenKey)
}
