<template>
	<div class="express-page has-footer has-footer-iphoneX">
		<div class="header bg-buffer bg-cover">
			<span class="image bg-buffer bg-cover vertical-middle" :style="{'background-image': 'url('+ mainData.productImgSrc +')'}"></span>
			<div v-if="mainData.orderStatus" class="vertical-middle font-bold font-white">
				<p class="status">订单状态：{{mainData.orderStatus}}</p>
				<div v-if="mainData.expressNo">
					<span class="vertical-middle">物流单号：{{mainData.expressNo}}</span>
					<span class="copy-btn vertical-middle font-12" v-clipboard:copy="mainData.expressNo" v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</span>
				</div>
				<p v-else>物流单号：暂无物流</p>
			</div>
		</div>
		<ul class="express-list public-padding-v">
			<li v-for="(item,index) in listData" :key="index" class="relative">
				<p class="title">{{item.orderStateDetails}}</p>
				<p class="font-12 font-lightGray">{{item.expressAcceptTime | formatTime9}}</p>
			</li>
		</ul>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white">
			<span class="bg-blue text-center font-white public-lineheight block" @click="chat">联系客服</span>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { publicChat } from '@assets/js/mUtils';
	import { setBodyColor } from '@assets/js/mUtils';
	import VueClipboard from 'vue-clipboard2'
	Vue.use(VueClipboard)

	export default {
		data() {
			return {
				askData: {
					pageSize: 10,
					pageNum: 1
				},
				more: true,
				mainData: {},
				switchShow: false,
				listData: [],
				noDataFlag: false,
			}
		},
		mounted() {
			var that = this
			setBodyColor(true);
			that.askData.orderNumber = that.$route.query.orderNumber
			that.getData();
		},
		methods: {
			getData() {
				var that = this
				if(!that.more || that.switchShow) {
					return false;
				}
				that.switchShow = true;
				network(CONFIG.orderCourier, that.askData, {
					method: 'GET'
				}).then((res) => {
					that.mainData = res.details;
					var orderStates = res.details.orderStates;
					that.listData = that.listData.concat(orderStates.data);
					that.askData.pageNum++;
					that.more = that.askData.pageNum <= orderStates.page.pages;
					that.switchShow = false;
					if(!that.listData.length) {
						that.noDataFlag = true
					}
				})
			},
			scrollBottom() {
				var that = this;
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
				if((scrollTop + clientHeight) == scrollHeight) {
					that.getData();
				}
			},
			chat() {
				var that = this;
				publicChat();
			},
			copySuccess() {
				Vue.toast('复制成功', {
					duration: 1500
				})
			},
			copyError() {
				Vue.toast('复制失败', {
					duration: 1500
				})
			},
		},
		deactivated() {
			var that = this;
			window.removeEventListener('scroll', that.scrollBottom)
		},
		destroyed() {
			var that = this;
			window.removeEventListener('scroll', that.scrollBottom);
			setBodyColor();
		}
	}
</script>

<style>
	.express-page .header {
		padding: 1.3rem 0 1.3rem 0.9rem;
		background-image: url(~@assets/img/self/express-title.png);
	}
	
	.express-page .header .image {
		height: 2.6rem;
		width: 2.6rem;
		margin-right: 0.6rem;
	}
	
	.express-page .header .status {
		margin-bottom: 0.1rem;
	}
	
	.express-page .header .copy-btn {
		border: 0.05rem solid rgba(255, 255, 255, 0.4);
		padding: 0 0.4rem;
		margin-left: 0.2rem;
		font-weight: normal;
	}
	
	.express-page .express-list {
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		padding-left: 1.3rem;
		padding-right: 1.1rem;
	}
	
	.express-page .express-list li {
		padding-left: 1.2rem;
		padding-bottom: 1.1rem;
	}
	
	.express-page .express-list li:after {
		content: "";
		position: absolute;
		left: -0.15rem;
		top: 0.3rem;
		width: 0.2rem;
		height: 0.2rem;
		border: 0.1rem solid #DDDDDD;
		background: #FFFFFF;
		border-radius: 100%;
	}
	
	.express-page .express-list li:first-child:after {
		width: 0.9rem;
		height: 0.9rem;
		left: -0.4rem;
		top: 0.1rem;
		border: none;
		background: #3ED8C4 url(~@assets/img/right-white.png) no-repeat center;
		background-size: 60%;
	}
	
	.express-page .express-list li:before {
		content: "";
		position: absolute;
		width: 0.1rem;
		top: 0.2rem;
		bottom: -0.2rem;
		background: #DDDDDD;
		left: 0;
	}
	
	.express-page .express-list li:last-child:before {
		bottom: 2rem;
	}
	
	.express-page .express-list .title {
		line-height: 1rem;
		margin-bottom: 0.1rem;
	}
</style>