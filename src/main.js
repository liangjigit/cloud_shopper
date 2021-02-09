// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//引用vue
import Vue from 'vue'
Vue.config.productionTip = false

//引用router
import router from './router'

//引用vuex
import store from './store'

//引用axios
import api from './api/index.js'
Vue.prototype.$api = api

//引入mint-ui
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint)

//引用vant-ui
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

//非父子组件通信中心 $bus
const vueEvent = new Vue();
export default vueEvent;

// 全局变量 GLOBAL
import Global from './util/Global'
Vue.prototype.GLOBAL = Global

//解决浏览器不能识别es6，转为es5
import 'babel-polyfill'

//解决不支持Promise的问题
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

//移动端适配，引用rem
import 'lib-flexible/flexible.js'
//提供了css跨浏览器的高度一致性
import 'normalize.css'

//用于移动端调试
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//动态改变头部title设置
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

//滑动特效插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
import 'swiper/dist/css/swiper.css'

//引用App
import App from './App.vue'

// 路由进入前 判断是否登录
router.beforeEach((to, from, next) => {
    window.localStorage.URL = to.fullPath;
    if (to.query.state == '0') {
        document.title = to.meta.title = '我的会员'
    } else if (to.query.state == '1') {
        document.title = to.meta.title = '门店会员'
    } else if (to.query.state == '2') {
        document.title = to.meta.title = '分配无归属会员'
    } else if (to.query.state == '3') {
        document.title = to.meta.title = '卡券发放给'
    }
    if (to.matched.some(m => m.meta.auth)) {
        if (window.localStorage.isLogin === '1') {
            next()
        } else {
            next(router.replace({ path: '/login' }))
        }
    } else {
        next();
    }
})

// 跑起来吧
new Vue({
    router,
    store,
    el: '#app',
    render: function (h) {
        return h(App);
    }
})