import axios from '@/utils/axios'

// 获取表格数据
export const gitUsrt = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 编辑用户
export const editorUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
// 分配用户角色
export const Assign = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
// 删除单个用户
export const augburto = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
// 修改用户状态
export const userDisplay = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
