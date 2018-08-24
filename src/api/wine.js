import request from '@/utils/request'


//种酒

// 添加种酒分类
export function saveWineClassify(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('name', data.name);
  return request({
    url: 'liquorCategory/save',
    method: 'post',
    data: params
  })
}



// 查看种酒分类列表
export function wineClassifyList(query) {
  return request({
    url: 'liquorCategory/list',
    method: 'get',
    params: query
  })
}
// 查看种酒列表
export function wineList(query) {
  return request({
    url: 'liquorProduct/list',
    method: 'get',
    params: query
  })
}
// 查看种酒详情
export function wineDetail(query) {
  return request({
    url: 'liquorProduct/index',
    method: 'get',
    params: query
  })
}
// 添加/更新种酒
export function saveWine(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('liquorCategory', data.liquorCategory);
  params.append('name', data.name);
  params.append('standard', data.standard);
  params.append('money', data.money);
  params.append('largessIntegral', data.largessIntegral);
  params.append('img', data.img);
  params.append('imgDesc', data.imgDesc);
  params.append('context', data.context);
  return request({
    url: 'liquorProduct/save',
    method: 'post',
    data: params
  })
}
// 删除种酒分类
export function deleteWineClassify(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'liquorCategory/delete',
    method: 'post',
    data: params
  })
}

// 删除种酒
export function deleteWine(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'liquorProduct/delete',
    method: 'post',
    data: params
  })
}


// 查看种酒订单列表
export function wineOrderList(query) {
  return request({
    url: 'cellarOrder/list',
    method: 'get',
    params: query
  })
}

// 查看种酒订单详情
export function wineOrderDetail(query) {
  return request({
    url: 'cellarOrder/index',
    method: 'get',
    params: query
  })
}


// 种酒已窖藏
export function wineCollected(data) {
  let params = new URLSearchParams();
  params.append('orderId', data.orderId);
  params.append('context', data.context);
  params.append('cellarNumber', data.cellarNumber);
  return request({
    url: 'cellarOrder/collected',
    method: 'post',
    data: params
  })
}
// 种酒已启坛
export function wineAlreadyOpen(data) {
  let params = new URLSearchParams();
  params.append('orderId', data.orderId);
  params.append('type', data.type);
  params.append('expressNumber', data.expressNumber);
  return request({
    url: 'cellarOrder/alreadyOpen',
    method: 'post',
    data: params
  })
}// 种酒已失效
export function wineAlreadyInvalid(data) {
  let params = new URLSearchParams();
  params.append('orderId', data.orderId);
  params.append('remarks', data.remarks);
  return request({
    url: 'cellarOrder/alreadyInvalid',
    method: 'post',
    data: params
  })
}
