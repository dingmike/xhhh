import request from '@/utils/request'


//入园参考

// 添加入园参考
export function saveParkin(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('name', data.name);
  params.append('img', data.img);
  params.append('intro', data.intro);
  params.append('spotId', data.spotId);
  return request({
    url: 'garden/save',
    method: 'post',
    data: params
  })
}
// 查看入园参考列表
export function parkinList(query) {
  return request({
    url: 'garden/list',
    method: 'get',
    params: query
  })
}



// 查询入园详情
export function parkinDetail(query) {
  return request({
    url: 'garden/index',
    method: 'get',
    params: query
  })
}

// 添加景区
export function deletParkin(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  return request({
    url: 'garden/delete',
    method: 'post',
    data: params
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
  params.append('id', data.id);
  params.append('title', data.title);
  params.append('openTime', data.openTime);
  params.append('sightCategory', data.sightCategory);
  params.append('spotDetails', data.spotDetails);
  params.append('masterImg', data.masterImg);
  params.append('inOut', data.inOut);
  params.append('requiredMoney', data.requiredMoney==undefined?0:data.requiredMoney);
  params.append('status', data.status==undefined?'':data.status);
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
