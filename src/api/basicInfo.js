import request from '@/utils/request'
export function getBasicInfo(query) {
  return request({
    url: 'companyInfo/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('companyDetails', data.companyDetails);
  params.append('companyAddress', data.companyAddress);
  params.append('wechatAccount', data.wechatAccount);
  params.append('wechatCode', data.wechatCode);
  params.append('blogAccount', data.blogAccount);
  params.append('blogCode', data.blogCode);
  params.append('telephone', data.telephone);
  params.append('mailbox', data.mailbox);
  params.append('contactQq', data.contactQq);
  return request({
    url: 'companyInfo/save',
    method: 'post',
    data: params
  })
}


export function getNewsById(query) {
  return request({
    url: 'notice/index',
    method: 'get',
    params: query
  })
}

export function saveAndUpdateNews(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  params.append('title', data.title);
  params.append('content', data.content);
  params.append('type', data.type);
  return request({
    url: 'notice/save',
    method: 'post',
    data: params
  })
}
export function logout() {

  return request({
    url: 'logout',
    method: 'get',
    params: ''
  })
}
