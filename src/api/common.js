import request from '@/utils/request'


// 删除oss图片
export function deleteOssImg(data) {
  let params = new URLSearchParams();
  params.append('imgUrl', data.imgUrl);       //你要传给后台的参数值 key/value
  return request({
    url: 'deleteBlog', // 假地址 自行替换
    method: 'post',
    data: params
  })
}
