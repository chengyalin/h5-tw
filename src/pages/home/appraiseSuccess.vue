<template>
	<div v-cloak class="appraiseSuccess-page text-center">
		<img class="image" src="~@assets/img/paySuccess-person.png"/>
		<p v-if = "askData.order_number" class="h2 font-16 font-blue font-bold">发布成功！</p>
		<div v-else>
			<p class="h2 font-16 font-blue font-bold">口碑审核中</p>
			<p class="h3 font-grey">未租赁该产品的用户发布口碑需经过审核</p>
			<p class="h3 font-grey">审核通过后即可在口碑列表查看</p>
		</div>
		<span v-if = "askData.order_number" class="btn fixed public-lineheight bg-blue font-white font-bold" @click="getCoupon">领取优惠券</span>
		<span v-else class="btn fixed public-lineheight bg-blue font-white font-bold" @click="goBack">返回口碑列表</span>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
export default {
	data () {
  		return {
  			askData:{
  				order_number:''
  			},
	  	}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		if(that.$route.query.orderNumber){
			document.title = '发布成功';
			that.askData.order_number =  that.$route.query.orderNumber;
			that.askData.appraise_id =  that.$route.query.appraiseId;
		}
	},
	methods:{
		goBack(){
			var that = this;
			that.$router.back();
		},
		getCoupon(){
			var that = this;
			Indicator.open();
			network(CONFIG.appraiseCoupon,that.askData).then((res) => {
				Indicator.close();
				Vue.toast('已领取10元优惠券',{duration:1500});
				that.goBack();
			});
		}
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.appraiseSuccess-page{
	padding-top: 2.8rem;
}
.appraiseSuccess-page > .image{
	width: 5.5rem;
	margin-bottom: 1rem;
}
.appraiseSuccess-page .h2{
	margin-bottom: 0.5rem;
}
.appraiseSuccess-page .h3{
	margin-bottom: 0.06rem;
}
.appraiseSuccess-page .btn{
	bottom: 5.5rem;
	width: 8.3rem;
	left: 50%;
	margin-left: -4.15rem;
	border-radius: 0.1rem;
}
</style>