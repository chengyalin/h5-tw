<template>
	<div class="nationalDay-page">
		<img class="block width-full" src="https://resource.tanwuapp.com/FkhVHP9VwF5g3X0X8jfx_SkUZYse"/>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/Fp6MXhPfZtfaRn8Z6vky9vpVWl85"/>
			<span class="absolute couponRule-btn" @click="couponRuleFlag = true"></span>
			<span class="absolute coupon-btn font-18 font-white font-bold" @click="receiveCoupons">{{havingFlag == 'Y'?'已领取':'领取优惠大礼包'}}</span>
		</div>
		<div v-for="(item,index) in listData" class="relative">
			<img class="block width-full" :src="item.image"/>
			<ul class="product-list">
				<li v-for="(cItem,cIndex) in item.products"  @click="goProduct(cItem)"></li>
			</ul>
			<span v-if="!alipayMiniappFlag && index == 3" class="contact-btn" @click="chat">联系客服</span>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="couponRuleFlag">
				<div class="public-popup-shadow" @click="couponRuleFlag = false"></div>
				<div class="rule-popup absolute center">
					<img class="block width-full" src="https://resource.tanwuapp.com/Fh5Gr4ucZB5xz_gBKMXDZGzlK2tJ"/>
					<div class="rule-wrap font-12">
						<p class="h2 text-center font-18 font-bold">优惠券使用规则</p>
						<span class="title relative font-12 inline-block">活动时间</span>
						<p class="word font-12">2018年9月15日-2018年10月14日</p>
						<span class="title relative font-12 inline-block">优惠券使用方法</span>
						<p class="word">在活动页领取每种品类优惠券2张，共14张，在支付宝探物小程序—我的—我的优惠券中查看，下单时使用，活动优惠不可叠加使用；</p>
						<span class="title relative font-12 inline-block">活动邮费</span>
						<p class="word">全场产品来回邮费均由用户承担；</p>
						<span class="close absolute" @click="couponRuleFlag = false"></span>
					</div>
					<img class="block width-full" src="https://resource.tanwuapp.com/Fv7oxq7ZEvgtivERM51_8ARV1lM9"/>
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
				askData:{
	            		activityName:"nationalDay",
	            	},
	            	havingFlag:'N',
	            	source:'',
	            	activityLogs:[],
	            	alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	ruleFlag:false,
	            	couponRuleFlag:false,
	            	listData:[
	            		{
	            			image:'https://resource.tanwuapp.com/FpHHdzamNfx6u8-kDUBj1rXVCvaX',
	            			products:[
		            			{id:167,name:'GoPro 6'},
			            		{id:259,name:'索尼 黑卡6'},
			            		{id:278,name:'富士 X-T100'},
			            		{id:171,name:'佳能EOS 200D'}
		            		],
	            		},
	            		{
	            			image:'https://resource.tanwuapp.com/FmoEW4JvQg0WutJsMBUSANSTTMBJ',
	            			products:[
		            			{id:83,name:'佳能 EF 16-35mm'},
			            		{id:109,name:'索尼 FE 24-70mm f4'},
			            		{id:100,name:'大疆 晓 全能版'},
			            		{id:197,name:'大疆 御 全能版'}
		            		],
	            		},
	            		{
	            			image:'https://resource.tanwuapp.com/FmK89DPytDJo2iAgs87XGvU8nIme',
	            			products:[
		            			{id:75,name:'switch 套装'},
			            		{id:55,name:'索尼 ps4 slim'},
			            		{id:67,name:'飞宇 G5'},
			            		{id:256,name:'爱奇艺奇遇 II VR'}
		            		],
	            		},
	            		{
	            			image:'https://resource.tanwuapp.com/Fj5cbd4Qwbs8aw5HaKdIFIu6jAPJ',
	            			products:[
		            			{id:243,name:'极米（XGIMI）Z6'},
			            		{id:261,name:'韶音 AS650'},
		            		],
	            		}
	            	],
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false,
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
        		if(!IFALIPAYMINIAPP){
				that.umeng('国庆万份现金鼓励', '访问', source);
        		}
        		localStorage.setItem("opeActivityTag",'nationalDay_'+source);
			that.activityInit();
			//活动访问统计
			var reqStr = {
        			activityName:that.askData.activityName,
        			source:source
        		};
			network(CONFIG.systemClientLog,{
				platform:'h5',
				type:'info',
				url:CONFIG.activityExtendInit,
				reqStr:JSON.stringify(reqStr)
			},{codeFlag:true}).then((res) => {});
			
		},
		methods: {
			activityInit(){
            		var that = this;
            		network(CONFIG.activityExtendInit,that.askData,{codeFlag:true}).then((res) => {
					if(res.head.code == 0) {
						if(res.details.isReceiveAll){
							that.havingFlag = 'Y';
						}
					} 
				});
            	},
			receiveCoupons() {
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
				//产品访问统计
				var reqStr = {
	        			activityName:that.askData.activityName,
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
					that.umeng('国庆万份现金鼓励', '访问', item.name);
				}
				if(IFALIPAYMINIAPP){
					my.navigateTo({url: '/pages/productDetails/productDetails?productId='+item.id});
				}else{
					window.open('alipays://platformapi/startapp?appId=2017082408357898&page=pages/productDetails/productDetails&query=productId%3d'+item.id)
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
.nationalDay-page .product-list {
	position: absolute;
	top: 0;
	left: 1.1rem;
}
.nationalDay-page .product-list li {
	display: inline-block;
	vertical-align: top;
	margin-right: 0.5rem;
	margin-bottom: 1.5rem;
	width: 8rem;
	height: 11rem;
}
.nationalDay-page .rule-btn {
	bottom: 1rem;
	width: 6rem;
	height: 1.3rem;
	left: 50%;
	margin-left: -2.5rem;
}
.nationalDay-page .rule-popup{
	width: 16.1rem;
}
.nationalDay-page .rule-wrap{
	background-image: url('https://resource.tanwuapp.com/FhURRpEXj2oE-Hi3i9ESjOvMio13');
	background-repeat:repeat-y ;
	background-size: 100% auto;
	color: #FF7421;
	padding: 0 0.8rem 0 1.5rem;
	overflow: hidden;
}
.nationalDay-page .rule-wrap .h2{
	margin-bottom: 0.5rem;
}
.nationalDay-page .rule-wrap .title{
	background: rgba(255,155,96,0.3);
	padding: 0.1rem 0.5rem;
	line-height: 1;
	border-radius: 1rem;
	margin-bottom: 0.4rem;
	left: -0.5rem;
}
.nationalDay-page .rule-wrap .word{
	margin-bottom: 0.3rem;
}
.nationalDay-page .rule-wrap .code{
	width: 4.4rem;
	right: 2.35rem;
	bottom: 1.1rem;
}
.nationalDay-page .rule-wrap .code-word{
	line-height: 1.2;
}
.nationalDay-page .rule-wrap .code-word:after{
	content: '';
	/*
	position: absolute;
	right: 0;
	top: 0;
	border-top: 0.23rem solid red;
	border-bottom: 0.23rem solid red;
	border-right: 0.4rem solid red;
	*/
}
.nationalDay-page .rule-wrap .close{
	right: 0;
	top:0;
	width: 2.4rem;
	height: 2.4rem;
	background: url('https://resource.tanwuapp.com/FkjQRp_1UHdIGDAjzMSVxBDdt5pI') no-repeat center;
	background-size:0.8rem ;
}
.nationalDay-page .couponRule-btn {
	bottom: 3.1rem;
	width: 5rem;
	height: 1rem;
	left: 50%;
	margin-left: -2.5rem;
}
.nationalDay-page .coupon-btn{
	bottom: 4.7rem;
	height: 2rem;
	line-height: 2rem;
	text-align: center;
	left: 50%;
	width: 9rem;
	margin-left: -4.5rem;
	letter-spacing: 0.05rem;
}
.nationalDay-page .contact-btn {
	position: absolute;
	bottom: 4.5rem;
	height: 1.5rem;
	text-align: center;
	line-height: 1.5rem;
	color: #FFFFFF;
	font-size: 0.7rem;
	letter-spacing: 0.2rem;
	padding: 0 1.4rem;
	left: 50%;
	background: #0088f9;
	border-radius: 3rem;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
	background: -webkit-linear-gradient(#fdb436, #fc6d0b);
    background: -o-linear-gradient(#fdb436,  #fc6d0b);
    background: -moz-linear-gradient(#fdb436,  #fc6d0b);
    background: linear-gradient(#fdb436,  #fc6d0b); 
}
</style>