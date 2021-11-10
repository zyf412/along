import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import '@/assets/css/global.css'
import router from './router'
import axios from 'axios'
import nProgress from 'nprogress'

axios.defaults.baseURL = 'http://127.0.0.1:80/'
Vue.config.productionTip = false
axios.interceptors.request.use(config => {
  // 在request拦截器中，展示进度条nprogress.start()
  nProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  // 在response拦截器中，隐藏进度条nprogress.done()
  nProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
