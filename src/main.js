import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import '@fortawesome/fontawesome-free/css/all.css'
import {myMixin} from './mixins'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.use(firestorePlugin)
Vue.config.productionTip = false
Vue.use(vuetify, {
  iconfont: 'fa'
 })

 //create a global mixins
Vue.mixin(myMixin)

Vue.use(DatetimePicker)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
