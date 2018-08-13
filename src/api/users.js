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

export function disableUser(data) {
  return request({
    url: 'member/disable',
    method: 'post',
    data
  })
}

export function enableUser(data) {
  return request({
    url: 'member/enable',
    method: 'post',
    data
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
