<template>
	<div class="midAutumn-page">
		<div class="relative overflow-hidden">
			<img class="block width-full" src="https://resource.tanwuapp.com/Flk1-yzZyYE8-cveIETVN2D-yQMB"/>
		</div>
		<img class="block width-full" src="https://resource.tanwuapp.com/FgPRde1U1wqUMTvF9VmUifd2eqIE"/>
		<img class="block width-full" src="https://resource.tanwuapp.com/FtGiUOTw6klgaxnRKNsnGPDfk8Ss"/>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/FjMbB0ksEleR3rYo9LDLr9Ws5uSq"/>
			<ul class="products-list absolute">
				<li v-for="(item,index) in listData" @click="goProduct(item)"></li>
			</ul>
		</div>
		<img class="block width-full" src="https://resource.tanwuapp.com/FlhkhBBD0jSHaYE3_lGzROIImpN2"/>
		<img class="block width-full" src="https://resource.tanwuapp.com/FuObaUMXbnB6rqWK8iEKEjVx_phB"/>
		<img class="block width-full" src="https://resource.tanwuapp.com/FmqSXZPpob2p8vnYpN73f_fCQA-c"/>
		<img class="block width-full" src="https://resource.tanwuapp.com/Fk-35fWITuCDJMD32iazGJmj8ky1"/>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/Fu5MBSyLWLQw89hYsKZ2kWx_S9Zb"/>
			<span v-if="!alipayMiniappFlag" class="contact-btn" @click="chat">联系客服</span>
		</div>
		<div class="fixed left right top fixd-center overflow-hidden" style="top: 1.3rem; height: 3rem;">
			<span class="absolute rule-btn font-12 font-white text-center" @click="ruleFlag = true">活动规则</span>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-show="ruleFlag" @click="ruleFlag = false">
				<div class="public-popup-shadow"></div>
				<div class="rule-popup absolute center">
					<img class="block width-full" src="https://resource.tanwuapp.com/FmNudgoN8kIWXLMe_ESM4na6gWgJ"/>
				</div>
			</div>
		</transition>
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
				source:'',
				alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false,
	           	listData:[
            			{id:246,name:'libratone q adapt'},
	            		{id:256,name:'爱奇艺奇遇 II VR'},
	            		{id:259,name:'索尼 黑卡6'}
            		],
            		ruleFlag:false
			}
		},
		mounted() {
			var that = this;
			if(IFALIPAY){
				that.alipayFlag = true;
			}
			if(IFALIPAYMINIAPP){
				that.alipayMiniappFlag = true;
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
            		that.source = source;
            		localStorage.setItem("source",source);
            	}
        		localStorage.setItem("opeActivityTag",'midAutumn_'+source);
        		if(!IFALIPAYMINIAPP){
        			that.umeng('中秋节', '访问', source);
        			var reqStr = {
	        			activityName:'midAutumn',
	        			source:source
	        		};
	        		network(CONFIG.systemClientLog,{
	        			platform:'h5',
					type:'info',
					url:'',
					reqStr:JSON.stringify(reqStr)
	        		}).then((res) => {});
        		}
		},
		methods: {
			goProduct(item){
				var that = this;
				//产品访问统计
				var reqStr = {
	        			activityName:'midAutumn',
	        			source:that.source,
	        			id:item.id,
	        			name:item.name
	        		};
				network(CONFIG.systemClientLog,{
					platform:'h5',
					type:'info',
					url:'',
					reqStr:JSON.stringify(reqStr)
				},{codeFlag:true}).then((res) => {});
				if(!IFALIPAYMINIAPP){
					that.umeng('中秋节', '访问', item.name);
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
					//兼容辣鸡iOS 一定要加product_id 不然会崩
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
.midAutumn-page .rule-btn {
	top: 0;
	right: -0.43rem;
	background: #3E7BCC;
	line-height: 1;
	padding: 0.3rem 0.6rem 0.3rem 0.4rem;
	border-radius: 1rem;
}
.midAutumn-page .products-list{
	top: 1.5rem;
	left: 2rem;
	right: 1.5rem;
}
.midAutumn-page .products-list li{
	height: 4.6rem;
	margin-bottom: 3.4rem;
}
.midAutumn-page .products-list li:first-child{
	margin-bottom: 3.4rem;
}
.midAutumn-page .products-list li:nth-child(2){
	margin-bottom: 2rem;
}
.midAutumn-page .contact-btn {
	position: absolute;
	width: 5rem;
	bottom: 5.6rem;
	height: 1.3rem;
	text-align: center;
	line-height: 1.3rem;
	color: #FFFFFF;
	font-size: 0.6rem;
	font-weight: bold;
	letter-spacing: 0.1rem;
	left: 50%;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
	background: #3E7BCC;
	border-radius: 2rem;
	border: 0.1rem solid #FFFFFF;
}
.midAutumn-page .rule-popup{
	width:16rem ;
}
</style>