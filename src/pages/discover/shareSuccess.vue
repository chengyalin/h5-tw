<template>
	<div v-cloak class="shareSuccess-page text-center">
		<img class="image" src="~@assets/img/paySuccess-person.png"/>
		<p class="h2 font-16 font-blue font-bold">发布成功！</p>
		<span class="btn fixed public-lineheight bg-blue font-white font-bold" @click="goBack">返回动态列表</span>
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
	},
	methods:{
		goBack(){
			var that = this;
			that.$router.back();
		}
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.shareSuccess-page{
	padding-top: 2.8rem;
}
.shareSuccess-page > .image{
	width: 5.5rem;
	margin-bottom: 1rem;
}
.shareSuccess-page .h2{
	margin-bottom: 0.5rem;
}
.shareSuccess-page .h3{
	margin-bottom: 0.06rem;
}
.shareSuccess-page .btn{
	bottom: 5.5rem;
	width: 8.3rem;
	left: 50%;
	margin-left: -4.15rem;
	border-radius: 0.1rem;
}
</style>