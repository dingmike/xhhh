import request from '@/utils/request'


//众筹

//获取众筹列表
export function fundProductList(query) {
  return request({
    url: 'fundingProduct/list',
    method: 'get',
    params: query
  })
}

//获取众筹详情
export function fundingProductDetail(query) {
  return request({
    url: 'fundingProduct/index',
    method: 'get',
    params: query
  })
}
//获取众筹参与人数列表
export function partInFundPersonList(query) {
  return request({
    url: 'fundingProduct/haveNember',
    method: 'get',
    params: query
  })
}
//获取总的分红历史记录列表
export function adminRecord(query) {
  return request({
    url: 'fundingProduct/adminRecord',
    method: 'get',
    params: query
  })
}
//获取单个会员分红历史记录列表
export function memberRecord(query) {
  return request({
    url: 'fundingProduct/memberRecord',
    method: 'get',
    params: query
  })
}

//添加/更新众筹项目
export function saveFund(data) {
  let params = new URLSearchParams();
  params.append('spotId', data.spotId);
  params.append('name', data.name);
  params.append('sightCategory', data.sightCategory);
  params.append('Notes', data.notes);
  params.append('spotDetails', data.spotDetails);
  params.append('money', data.money);
  params.append('status', data.status);
  params.append('masterImg', data.masterImg);
  return request({
    url: '/fundingProduct/save',
    method: 'post',
    data: params
  })
}
// 众筹停业
export function deleteFund(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);   // 主键Id
  return request({
    url: 'fundingProduct/delete',
    method: 'post',
    data: params
  })
}
// 整体分红
export function overallBonus(data) {
  let params = new URLSearchParams();
  params.append('categoryId', data.categoryId);
  params.append('money', data.money);
  params.append('passWord', data.passWord);
  return request({
    url: 'fundingProduct/overallBonus',
    method: 'post',
    data: params
  })
}
// 单个分红
export function singleBonus(data) {
  let params = new URLSearchParams();
  params.append('fundingNumber', data.fundingNumber);
  params.append('money', data.money);
  params.append('passWord', data.passWord);
  return request({
    url: 'fundingProduct/singleBonus',
    method: 'post',
    data: params
  })
}
