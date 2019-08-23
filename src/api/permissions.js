import axios from '@/utils/axios'

// 获取左侧菜单栏权限
export const perm = () => {
  return axios({
    url: 'menus'
  })
}
