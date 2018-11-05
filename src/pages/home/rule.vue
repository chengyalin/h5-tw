<template>
	<div class="rule-page">
		<p v-if="askData.productId" class="h2 font-18">关于该商品的常见问题</p>
		<p v-else-if="askData.ruleType" class="h2 font-18">{{askData.ruleType}}</p>
		<p v-else-if="ruleType.length" class="h2 font-18">选择对应问题的分类</p>
		<ul v-if="listData.length" class="rule-list fixd-center">
		    <li class="relative font-16" v-for="(item,index) in listData"  @click="iframeToggle(item.ruleDetailsUrl)">
		    		<p class="public-arrow-right">{{item.ruleTitle}}</p>
		       <span class="line-normal absolute left bottom right"></span>
		    </li>
		</ul>
		<ul v-else-if="ruleType.length" class="rule-list fixd-center">
		    <li class="relative font-16" v-for="(item,index) in ruleType"  @click="selectType(item.ruleType)">
		    		<p class="public-arrow-right">{{item.ruleType}}</p>
		       <span class="line-normal absolute left bottom right"></span>
		    </li>
		</ul>
		<div v-if="askData.productId" class="footer text-center font-bold bg-white">
			<router-link class="bg-blue font-white vertical-middle btn" :to = "{path:'/rule'}">更多问题</router-link>
			<span class="bg-white font-blue vertical-middle btn" @click="chat">联系客服</span>
		</div>
		<div v-else class="footer text-center font-bold bg-white">
			<span class="bg-white font-blue vertical-middle btn btn2" @click="chat">联系客服</span>
		</div>
		<popupIframe :popupIframeFlag = "popupIframeFlag" :popupIframeUrl = "popupIframeUrl" @iframeToggle="iframeToggle"></popupIframe>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
import popupIframe from '@components/popupIframe';
import { publicChat } from '@assets/js/mUtils';
export default {
	data () {
  		return {
			askData:{},
			listData:[],
			ruleType:[],
			popupIframeFlag:false,
			popupIframeUrl:'',
	  	}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.pageInit();
	},
	destroyed(){
		var that = this;
		setBodyColor();
	},
	methods:{
		pageInit(){
			var that =this;
			if(that.$route.query.productId){
				that.askData.productId = that.$route.query.productId;
				that.askData.ruleType = '';
				that.initData();
			}else if(that.$route.query.ruleType){
				that.askData.ruleType = that.$route.query.ruleType;
				that.askData.productId = '';
				that.initData();
			}else{
				that.listData = [];
				that.askData.productId = '';
				that.askData.ruleType = '';
				if(!that.ruleType.length){
					network(CONFIG.ruleTypes).then((res) => {
						that.ruleType = res.details.types;
					});
				}
			}
		},
		initData(){
			var that = this;
            network(CONFIG.ruleList,that.askData).then((res) => {
            		that.listData = res.details.ruleList;
			});
		},
		iframeToggle(url){
			var that = this;
			that.popupIframeUrl = url?url:that.popupIframeUrl;
			that.popupIframeFlag = !that.popupIframeFlag;
		},
		selectType(type){
			var that = this;
			that.$router.push({path: '/rule',query: { ruleType: type }});
		},
		chat(){
			var that = this;
			publicChat();
		},
	},
	watch:{
   		'$route':'pageInit'
   	}, 
	components: {
	    popupIframe
	}
}
</script>

<style>
.rule-page .h2{
	padding: 1.25rem 0 0.35rem 0.75rem;
}
.rule-page .rule-list{
	position: fixed;
	top:2.9rem ;
	margin-left: 0.75rem;
	bottom: 5.15rem;
	right: 0;
	left: 0;
	overflow-y: auto;
}
.rule-page .rule-list li{
	color: #4E4E4E;
	padding: 0.95rem 1rem 0.95rem 0;	
}
.rule-page .footer{
	position: fixed;
	padding-bottom: 2.25rem;
	bottom: 0;
	left: 0;
	right: 0;
	padding-top: 0.5rem;
}
.rule-page .footer .btn{
	width: 7rem;
	height: 2.4rem;
	line-height: 2.4rem;
	border: 1px solid #0E4F6A;
	border-radius: 0.15rem;
	margin: 0 0.6rem;
}
.rule-page .footer .btn2{
	width: 17.25rem;
	margin: 0;
}
</style>