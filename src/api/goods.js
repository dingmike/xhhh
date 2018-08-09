import request from '@/utils/request'

export function fetchGoodsList(query) {
  return request({
    url: 'goods/list',
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
