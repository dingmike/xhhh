import request from '@/utils/request'


//园区景区

// 添加园区
export function savePark(data) {
  let params = new URLSearchParams();
  params.append('parkName', data.parkName);       //你要传给后台的参数值 key/value
  return request({
    url: 'sightCategory/savePark',
    method: 'post',
    data: params
  })
}

// 查询园区下所有景区
export function selectParkScenery(query) {
  return request({
    url: 'sightCategory/selectLevel',
    method: 'get',
    params: query
  })
}

// 添加景区
export function saveSight(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id（添加ID为空，修改带ID）
  params.append('pId', data.park);  // 园区ID
  params.append('name', data.sceneryName); // 名称
  return request({
    url: 'sightCategory/saveSight',
    method: 'post',
    data: params
  })
}

// 查看园区列表和景区列表
export function parkList(query) {
  // level 1-园区，2-景区
  return request({
    url: 'sightCategory/list',
    method: 'get',
    params: query
  })
}
// 删除园区或者景区
export function deletePark(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'sightCategory/deletePark',
    method: 'post',
    data: params
  })
}


// 添加/更新景点
export function saveSightSpot(data) {
  let params = new URLSearchParams();
  params.append('title', data.title);
  params.append('openTime', data.openTime);
  params.append('sightCategory', data.sightCategory);
  params.append('spotDetails', data.spotDetails);
  params.append('masterImg', data.masterImg);
  params.append('inOut', data.inOut);
  params.append('requiredMoney', data.requiredMoney==undefined?null:data.requiredMoney);
  params.append('status', data.status);
  params.append('notes', data.notes);
  return request({
    url: 'sightspot/save',
    method: 'post',
    data: params
  })
}
// 查看景点介绍列表
export function getSightSpotList(query) {
  return request({
    url: 'sightspot/list',
    method: 'get',
    params: query
  })
}

// 查看景点详情
export function getSpotDetail(query) {
  return request({
    url: 'sightspot/index',
    method: 'get',
    params: query
  })
}

// 删除景点
export function deleteSpot(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'sightspot/delete',
    method: 'post',
    data: params
  })
}
