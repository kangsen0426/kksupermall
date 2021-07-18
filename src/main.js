import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//给vue添加一个属性 $bus 用于监听图片的加载完成
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
