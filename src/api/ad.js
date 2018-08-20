import request from '@/utils/request'


//广告

// 添加广告
export function saveAd(data) {
  let params = new URLSearchParams();
  params.append('parkName', data.parkName);       //你要传给后台的参数值 key/value
  return request({
    url: 'productSow/save',
    method: 'post',
    data: params
  })
}



// 查看广告列表
export function adList(query) {
  return request({
    url: 'productSow/index',
    method: 'get',
    params: query
  })
}
// 查看广告分类列表
export function adCategoryList(query) {
  return request({
    url: 'productSow/categoryList',
    method: 'get',
    params: query
  })
}
// 删除广告
export function deletePark(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'productSow/delete',
    method: 'post',
    data: params
  })
}

