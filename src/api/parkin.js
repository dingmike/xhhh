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



