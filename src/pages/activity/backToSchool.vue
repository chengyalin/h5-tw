<template>
	<div class="backToSchool-page">
		<div class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/Fu1kV-pcq9WctFb1tuYMD9Y9rH4O"/>
			<span class="coupon-btn" v-if="havingFlag == 'Y'">已领取</span>
			<span class="coupon-btn" v-else @click="receiveCoupons">一键领取</span>
		</div>
		<div v-if="alipayFlag" class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/FrMMcX1NoqXd4RyabN8HC6ZJnbLl"/>
			<div class="product-list">
				<div class="product-item" v-for="item in alipayListData" @click="goProduct(item)"></div>
			</div>
		</div>
		<div v-else class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/FsnCJ5NSy_8Dl3488XBCIE3ys7n9"/>
			<div class="product-list">
				<div class="product-item" v-for="item in listData" @click="goProduct(item)"></div>
			</div>
		</div>
		<div class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/FviDnQXPUeWw-NYrOl2zgialQm5J"/>
			<span v-if="!alipayMiniappFlag" class="contact-btn" @click="chat">联系客服</span>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { publicChat } from '@assets/js/mUtils';
	export default {
		data() {
			return {
				askData:{
	            		activityName:"backToSchool",
	            	},
	            	havingFlag:'N',
	            	source:'',
	            	activityLogs:[],
	            	alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	listData:[
	            		{id:75,name:'switch 套装'},
	            		{id:55,name:'索尼 ps4 slim'},
	            		{id:278,name:'富士 X-T100'},
	            		{id:62,name:'索尼 RX100'},
	            		{id:223,name:'爱奇艺 VR'},
	            		{id:197,name:'大疆 御 air 全能版'}
	            	],
	            	alipayListData:[
	            		{id:75,name:'switch 套装'},
	            		{id:55,name:'索尼 ps4 slim'},
	            		{id:278,name:'富士 X-T100'},
	            		{id:62,name:'索尼 RX100'},
	            		{id:223,name:'爱奇艺 VR'},
	            		{id:228,name:'FIIL 无线耳机'}
	            	],
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false
			}
		},
		mounted() {
			var that = this;
			if(IFALIPAY){
				that.alipayFlag = true;
			}
			if(IFALIPAYMINIAPP){
				that.alipayMiniappFlag = true;
			}else{
				that.umeng('开学季发福利', '访问', source);
			}
			var query = that.$route.query || {};
			if(query.client_type == 'android'){
				that.androidFlag = true;
				if(query.version == 2){
					that.version2Flag = true;
				}
			}
			var source = "";
        		if(query.source){
            		source = query.source;
            		localStorage.setItem("source",source);
            	}
        		localStorage.setItem("opeActivityTag",'backToSchool_'+source);
			that.activityInit();
		},
		methods: {
			activityInit:function(){
            		var that = this;
            		network(CONFIG.activityExtendInit,that.askData,{codeFlag:true}).then((res) => {
					if(res.head.code == 0) {
						if(res.details.activityLogs && res.details.activityLogs.length){
							that.havingFlag = 'Y';
							that.activityLogs = res.details.activityLogs;
						}
					} 
				});
            	},
			receiveCoupons: function() {
				var that = this;
				if(that.havingFlag == "Y") {
					return false;
				};
				if(!that.goLogin()) {
					return false;
				}
				network(CONFIG.activityExtendGrantCoupon,that.askData).then((res) => {
					if(res.head.code == 0) {
						Vue.toast('领取成功', {
							duration: 1500
						});
						that.havingFlag = "Y";
					}
				});
			},
			goProduct(item){
				var that = this;
				if(!IFALIPAYMINIAPP){
					that.umeng('开学季发福利', '访问', item.name);
				}
				if(IFALIPAYMINIAPP){
					my.navigateTo({url: '/pages/productDetails/productDetails?productId='+item.id});
				}else if(IFALIPAY){
					window.open('alipays://platformapi/startapp?appId=2017082408357898&page=pages/productDetails/productDetails&query=productId%3d'+item.id)
				}else if(that.androidFlag && that.version2Flag){
					var result = {
						productId:item.id
					}
					window.android.start('productDetails',JSON.stringify(result))
				}else{
					//兼容iOS 一定要加product_id 不然会崩
					window.location.href = "/#/productDetails?product_id="+item.id+'&productId='+item.id;
				}
			},
			chat(){
				var that = this;
				publicChat();
			}
		}
	}
</script>

<style>
.backToSchool-page .product-list{
	position: absolute;
	top: 5.5rem;
	left: 1.2rem;
}
.backToSchool-page .product-list .product-item{
	display: inline-block;
	vertical-align: top;
	margin-right: 0.2rem;
	margin-bottom: 1.5rem;
	width: 8rem;
	height: 11rem;
} 
.backToSchool-page .contact-btn {
	position: absolute;
	bottom: 6rem;
	height: 1.3rem;
	text-align: center;
	line-height: 1.3rem;
	color: #FFFFFF;
	font-size: 0.7rem;
	letter-spacing: 0.2rem;
	padding: 0 1.2rem;
	left: 50%;
	background: #0088f9;
	border-radius: 2.6rem;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
}
.backToSchool-page .coupon-btn {
	position: absolute;
	bottom: 0.6rem;
	height: 1.5rem;
	text-align: center;
	line-height: 1.5rem;
	color: #032BB9;
	font-size: 0.7rem;
	letter-spacing: 0.2rem;
	padding: 0 1.6rem;
	left: 50%;
	border-radius: 1.5rem;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
	font-weight: bold;
}
</style>