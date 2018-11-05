<template>
	<div class="botao-page">
		<img class="width-full block" src="https://resource.tanwuapp.com/FtLDovtKEqxAjgFppl11Opfmr71h"/>
		<!--
		<ul>
			<li>
				<img class="width-full block" src="https://resource.tanwuapp.com/FitEho3Kt7PKBL3DCXXVilQu2QXo"/>
			</li>
			<li>
				<img class="width-full block" src="https://resource.tanwuapp.com/FjOrJyaEgEvJW3QmcD33YDnSzkwN"/>
			</li>
			<li>
				<img class="width-full block" src="https://resource.tanwuapp.com/FkR9f5f_PtyZuE-_vGm1yMW4XsI9"/>
			</li>
			<li>
				<img class="width-full block" src="https://resource.tanwuapp.com/FhCwxI57WIh1csJ8JjWLWIQLp02J"/>
			</li>
		</ul>
		-->
		<ul class="product-list">
			<li v-for="item in productList" class="relative">
				<img  class="width-full block" :src="item.image"/>
				<span class="product" @click="copy(item)"></span>
			</li>
		</ul>
		<div class="relative">
			<img class="width-full block" src="https://resource.tanwuapp.com/FhLdDhUE_CRsUKwd-ST5urFiIbOa"/>
			<ul class="rule-list absolute">
				<li v-for="item in rules">
					<span class="title font-white font-12">{{item.title}}</span>
					<p class="content font-12">{{item.content}}</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import VueClipboard from 'vue-clipboard2';
	Vue.use(VueClipboard)
	export default {
		data() {
			return {
				askData:{
					activityName:'botao'	
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
	            			title:'活动方法',
	            			content:'派酒店用户在活动页面注册成为探物用户即可享受优惠价格租赁服务；'
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
        		localStorage.setItem("opeActivityTag",'botao_'+source);
    			that.umeng('botao彩色之旅', '访问', source);
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
			copy(item){
				var that = this;
				if(item.link){
					that.$copyText(item.link).then(function (e) {
			        		Vue.toast('吱口令已复制，打开支付宝下单租赁吧！', {duration: 1500})
			        }, function (e) {
			        		Vue.toast('复制失败,请打开支付宝搜索探物', {duration: 3000})
			        })
				}else{
					 Vue.toast('复制失败,请打开支付宝搜索探物', {duration: 3000})
				}
				var reqStr = {
	        			activityName:that.askData.activityName,
	        			productName:item.name,
	        			productId:item.id,
	        			action:'copy',
	        			source:that.source
	        		};
				network(CONFIG.systemClientLog,{
					platform:'h5',
					type:'info',
					url:'',
					reqStr:JSON.stringify(reqStr)
				},{codeFlag:true}).then((res) => {});
				that.umeng('baotao彩色之旅'+item.name, '访问', that.source);
			}
		}
	}
</script>

<style>
.botao-page .rule-list {
	left: 3.2rem;
	right: 3.2rem;
	top: 6.5rem;
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
</style>