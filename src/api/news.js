import request from '@/utils/request'
export function getNewsList(query) {
  return request({
    url: 'notice/list',
    method: 'get',
    params: query
  })
}

export function deleteNews(data) {
  let params = new URLSearchParams();
  params.append('id', data.id);
  return request({
    url: 'notice/delete',
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
