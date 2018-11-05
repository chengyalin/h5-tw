import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import filter from './assets/js/filter'
import Toast from 'vue-easy-toast'
import { Indicator } from 'mint-ui'

window.Indicator = Indicator;

Vue.use(require('vue-wechat-title'));

Vue.use(Indicator);

Vue.use(Toast);

window.eventBus = new Vue();

router.afterEach((to,from,next) => {
	if(from.path != '/productDetail' && to.path != '/home'){
		window.scrollTo(0,0);
		//console.log("scroll top")
	}else{
		//console.log("keep")
	}
})

new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
});
