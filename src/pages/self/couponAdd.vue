<template>
	<div class="couponAdd-page">
		<div class="couponAdd-content public-padding-v">
			<div class="display-flex-between">
				<div	 class="input-wrap">
					<input class="input" type="text" v-model="askData.cdkCode" placeholder="请输入兑奖码"/>
				</div>
				<span class="btn bg-blue font-white text-center font-bold" @click="submit">兑换</span>
			</div>
			<p v-if="errorFlag" class="tip font-red">兑换码有误，请核对后再次输入</p>
			<p class="tip-title font-bold">兑换须知</p>
			<ul class="tip-list font-12">
				<li v-for="item in tipList" class="relative">{{item}}</li>
			</ul>
		</div>
		<div class="fixed fixd-center left bottom right public-lineheight bg-blue font-white text-center font-bold" @click="chat">联系客服</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { setBodyColor } from '@assets/js/mUtils';
	import { publicChat } from '@assets/js/mUtils';
	export default {
		data() {
			return {
				askData:{
					cdkCode:''
				},
				tipList:[
					'输入有效兑奖码后可领取奖品，每个兑奖码兑换一次奖品。',
					'请确保您的兑奖码正确，且处于有效期内，超出有效期的兑奖码无法兑换。',
					'如兑换奖励为实物奖品，请联系客服告知收货地址及相关收货信息，客服确认后将会为您发放奖品。。',
					'其它相关信息请咨询探物客服。'
				],
				errorFlag:false
			}
		},
		mounted() {
			var that = this;
			setBodyColor(true);
		},
		destroyed(){
			var that = this;
			setBodyColor();
		},
		methods: {
			chat() {
				var that = this;
				publicChat();
			},
			submit(){
				var that = this;
				that.errorFlag = false;
				network(CONFIG.activityCovertCoupon, that.askData, {codeFlag: true}).then((res) => {
					if (res.head.code == 0) {
						Vue.toast('兑换成功',{duration:1500});
						that.goBack();
					} else {
						that.errorFlag = true;
						//Vue.toast(res.head.message,{duration:1500})
					}
				})
			}
		}
	}
</script>

<style>
.couponAdd-page .couponAdd-content{
	padding-top: 1rem;
}
.couponAdd-page .btn{
	width: 4.4rem;
	line-height: 2.2rem;
}
.couponAdd-page .input-wrap{
	padding: 0.5rem 0.7rem;
	background: #F7F7F7;
}
.couponAdd-page .input-wrap .input{
	width: 10.8rem;
	background: none;
	line-height: 1.2rem;
}
.couponAdd-page .input-wrap .input::-webkit-input-placeholder{
    color:#BBBBBB;
}
.couponAdd-page .tip{
	margin-top: 0.4rem;
}
.couponAdd-page .tip-title{
	margin-top: 1.5rem;
}
.couponAdd-page .tip-list li{
	margin-top: 0.5rem;
	padding-left: 0.8rem;
}
.couponAdd-page .tip-list li:after{
	content: '';
	position: absolute;
	left: 0;
	top: 0.19rem;
	width: 0.2rem;
	height: 0.2rem;
	border-radius: 100%;
	border: 0.1rem solid #DDDDDD;
}
</style>