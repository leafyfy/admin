import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import whel from '@/views/whel'
import user from '@/views/users/user'
import projectRoles from '@/views/rights/projectRoles'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    }, {
      // 登录页
      name: 'login',
      path: '/login',
      component: login
    }, {
      // 主页
      name: 'home',
      path: '/home',
      component: home,
      redirect: { name: 'whel' },
      children: [
        {
          name: 'whel',
          path: 'whel',
          component: whel
        },
        {
          // 用户列表
          name: 'user',
          path: 'users',
          component: user
        },
        {
          // 角色列表
          name: 'projectRoles',
          path: 'projectRoles',
          component: projectRoles
        }
      ]
    }
  ]
})
