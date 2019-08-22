import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入字体图标
import '@/styles/icon.less'
import '@/styles/index.less'
// 引入ElementUI
import ElementUI from 'element-ui'
// 引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css'

// 导航守卫
router.beforeEach((to, from, next) => {
  let mytocen = localStorage.getItem('loginIndex')
  if (mytocen || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  // 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')
