


import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import App from './App.vue'
window.fetchApi = require('./js/fetchApi.js');
window.sha256 = require('./js/sha256.min.js')

Vue.config.productionTip = false
Vue.use(VueMaterial)

new Vue({
  render: h => h(App),
}).$mount('#app')
