<template>
	<div class="botao-page">
		<img class="width-full block" src="https://resource.tanwuapp.com/FtLDovtKEqxAjgFppl11Opfmr71h"/>
		<!--
		<img class="width-full block" src="https://resource.tanwuapp.com/FoV-JDoWQ_xyIQanY-H9udxlXcSK"/>
		-->
		<ul class="product-list">
			<li v-for="item in productList" class="relative">
				<img  class="width-full block" :src="item.image"/>
				<span class="product" @click="goProduct(item)"></span>
			</li>
		</ul>
		<div class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/Fmj4PryN3cS6X3CrMKxUo_YrKjON"/>
			<ul class="rule-list absolute">
				<li v-for="item in rules">
					<span class="title font-white font-12">{{item.title}}</span>
					<p class="content font-12">{{item.content}}</p>
				</li>
			</ul>
		</div>
		<img v-if="alipayMiniappFlag" class="block width-full" src="https://resource.tanwuapp.com/FmtY9wyZqCmncWIjAIkwY7hWvU1Y"/>
		<div v-else class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/FkTNN4a4wRPQFtVcKxt8wyZt0UmT"/>
			<span class="contact-btn absolute" @click="chat"/>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { publicChat } from '@assets/js/mUtils';
	import VueClipboard from 'vue-clipboard2';
	Vue.use(VueClipboard)
	export default {
		data() {
			return {
				askData:{
					activityName:'botaoTW'	
				},
				source:'',
				alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false,
	            	productList:[
		            		{
		            			id:301,
		            			name:'pico G2',
		            			image:'https://resource.tanwuapp.com/FitEho3Kt7PKBL3DCXXVilQu2QXo',
		            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序康骁欣翌pZ2静髂揽腌'
		            		},
		            		{
		            			id:261,
		            			name:'韶音 AS650',
		            			image:'https://resource.tanwuapp.com/FjOrJyaEgEvJW3QmcD33YDnSzkwN',
		            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序W巧0虹W聆2静萏樟舔'
		            		},
		            		{
		            			id:302,
		            			name:'维圣 Vilta M',
		            			image:'https://resource.tanwuapp.com/FkR9f5f_PtyZuE-_vGm1yMW4XsI9',
		            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序w迅J斯8P2静敢簟醴'
		            		},
		            		{
		            			id:185,
		            			name:'frontRow 便携摄像机',
		            			image:'https://resource.tanwuapp.com/FhCwxI57WIh1csJ8JjWLWIQLp02J',
		            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序亮达W昂n聆2静吾闲荀'
		            		},
			    ],
	            	rules:[
	            		{
	            			title:'活动时间',
	            			content:'2018年10月1日-2018年10月21日；'
	            		},
	            		{
	            			title:'一元租',
	            			content:'一元租产品的租期不为7天时，收取正常租金；'
	            		},
	            		{
	            			title:'五折租',
	            			content:'五折产品的显示价格已经为折扣价格，无需使用优惠券；'
	            		},
	            		{
	            			title:'活动邮费',
	            			content:'租赁产品来回邮寄需用顺丰快递且邮费均由用户承担。'
	            		}
	            	]
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
        		localStorage.setItem("opeActivityTag",'botaoTW_'+source);
    			that.umeng('botao彩色之旅TW', '访问', source);
    			var reqStr = {
        			activityName:that.askData.activityName,
        			action:'访问',
        			source:source
        		};
        		network(CONFIG.systemClientLog,{
        			platform:'h5',
				type:'info',
				url:'',
				reqStr:JSON.stringify(reqStr)
        		}).then((res) => {});
		},
		methods: {
			chat(){
				var that = this;
				publicChat();
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
					that.umeng('botao彩色之旅TW', '访问', item.name);
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
		}
	}
</script>

<style>
.botao-page .rule-list {
	left: 3.2rem;
	right: 3.2rem;
	top: 6.7rem;
}
.botao-page .rule-list .title{
	position: relative;
	left: -0.3rem;
	line-height: 1;
	padding: 0.1rem 0.3rem;
	border-radius: 2rem;
	background: #0756B3;
}
.botao-page .rule-list .content{
	color: #0756B3;
	line-height: 1.2;
	padding: 0.4rem 0 0.4rem 0;
}
.botao-page .product-list li .product{
	position: absolute;
	left: 0.7rem;
	top: 2rem;
	width: 13rem;
	height: 13rem;
}
.botao-page .product-list li:nth-child(2n) .product{
	left: auto;
	right: 0.7rem;
}
.botao-page .contact-btn{
	width: 5.8rem;
	height: 1.6rem;
	top: 1.3rem;
	left: 50%;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
}
</style>