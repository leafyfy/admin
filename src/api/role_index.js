import axios from '@/utils/axios'

// 角色列表
export const roleGrid = (params) => {
  return axios({
    url: 'roles',
    params
  })
}
