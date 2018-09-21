import request from '@/utils/request'

export function fetchUsersList(query) {
  return request({
    url: 'member/list',
    method: 'get',
    params: query
  })
}
export function getRanks() {
  return request({
    url: 'member/mgList',
    method: 'get',
    params: ''
  })
}
export function rechargeList(query) {
  return request({
    url: 'recharge/list',
    method: 'get',
    params: query
  })
}

// 冻结用户
export function disableUser(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);       //你要传给后台的参数值 key/value

  return request({
    url: 'member/disable',
    method: 'post',
    data: params
  })
}

// 启用用户
export function enableUser(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);       //你要传给后台的参数值 key/value
  return request({
    url: 'member/enable',
    method: 'post',
    data:params
  })
}
// 不激活用户
export function notActivationUser(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);       //你要传给后台的参数值 key/value

  return request({
    url: 'member/notActivation',
    method: 'post',
    data: params
  })
}

// 激活用户
export function isActivationUser(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);       //你要传给后台的参数值 key/value
  return request({
    url: 'member/isActivation',
    method: 'post',
    data:params
  })
}

//设置用户等级
export function setUsermg(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);       //你要传给后台的参数值 key/value
  return request({
    url: 'member/setUsermg',
    method: 'post',
    data:params
  })
}

//设置等级积分
export function setUpmg(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('score', data.score);
  return request({
    url: 'member/setUpmg',
    method: 'post',
    data: params
  })
}
// 获取会员等级列表
export function mgList() {
  return request({
    url: 'member/mgList',
    method: 'get',
    params: ''
  })
}

// 会员充值
export function recharge(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('rechargeType', data.rechargeType);
  params.append('money', data.money);
  params.append('password', data.password);

  return request({
    url: 'member/Recharge',
    method: 'post',
    data: params
  })
}

// 获取提现列表
export function getWithDrawList() {
  return request({
    url: 'userWithdraw/list',
    method: 'get',
    params: ''
  })
}

// 通过提现
export function idPassed(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  return request({
    url: 'userWithdraw/idPassed',
    method: 'post',
    data: params
  })
}


// 获取會員转账列表
export function getTransferList(query) {
  return request({
    url: 'member/transferRecord',
    method: 'get',
    params: query
  })
}









export function fetchGoodDetail(query) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params: query
  })
}

export function searchGoods(query) {
  return request({
    url: 'goods/search',
    method: 'get',
    params: query
  })
}
export function downUpGoods(data) {
  return request({
    url: 'goods/downUp',
    method: 'post',
    data
  })
}
export function deleteGoods(query) {
  return request({
    url: 'goods/delete',
    method: 'get',
    params: query
  })
}

export function updateHotStateGoods(data) {
  return request({
    url: 'goods/updateHotState',
    method: 'post',
    data
  })
}


export function getSpecifications(query) {
  return request({
    url: 'goods/getSpecifications',
    method: 'get',
    params: query
  })
}

export function getSpecValue(query) {
  return request({
    url: 'goods/getSpecValue',
    method: 'get',
    params: query
  })
}
















export function fetchArticle() {
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
