<template>
	<div id="app">
		<transition name="router-fade" mode="out-in" v-if="initFlag">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
			</keep-alive>
		</transition>
		<transition name="router-fade" mode="out-in" v-if="initFlag">
			<router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	export default {
		name: 'app',
		data() {
			return {
				initFlag: false
			}
		},
		mounted() {
			var that = this;
			setTimeout(function(){
				that.beforeEnter();
			},400);
		},
		methods:{
			beforeEnter(){
				var that = this;
				var query = that.$route.query;
				//判断 是否微信登陆/app登陆 (这里应当不判断微信登陆吧
				/*if(query.wechatUnionid) {
					localStorage.setItem("wechatUnionid", query.wechatUnionid);
					localStorage.setItem("wechatOpenid", query.wechatUnionid);
					network(CONFIG.loginThird, {
						third_account: query.wechatUnionid,
						loginType: "wechat",
						client_type: "wechat",
					}, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							localStorage.setItem("twUser", JSON.stringify(res.details));
						}
						that.initFlag = true;
					});
				} else 
				*/
				if(query.token && query.sign) {
					network(CONFIG.webLoginAuth, query, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							localStorage.setItem("twUser", JSON.stringify(res.details));
						}
						that.initFlag = true;
					});
				} else {
					that.initFlag = true;
				}
			}
		}
	}
</script>

<style>
	@import 'assets/css/public.css';
</style>