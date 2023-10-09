import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import store from './store'
import router from './router'

import './utils/filters/index'

import '@/icons/index' // icon
import '@/utils/permission' // permission control

import api from '@/utils/api/api'
import config from '@/config/index'

Vue.prototype.$api = api
Vue.prototype.$config = config

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
