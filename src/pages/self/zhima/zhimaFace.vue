<template>
	<div class="zhimaFace">
		<!--
		<div class="zhima-card">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">人脸识别</p>
			<p class="font-blue font-14"></p>
		</div>
		-->
		<div class="font-26 font-darkGray text-center zhimaFace-recognition">
			<p>完成认证即可</p>
			<p>提高押金减免额度</p>
			<p class="zhima-portrait bg-contain"></p>
		</div>
		<div class="zhima-accredit-card font-14 font-white  text-center">
			<p class="public-arrow-right zhima-accredit-btn" @click="goFace">
				开始刷脸
			</p>
			<p class="font-12 font-darkGray">
				<img class="tick" src="~@/assets/img/self/zhimaTick.png" /> 仅用于你本人申请额度, 隐私信息严格保密
			</p>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';

	export default {
		data() {
			return {
				askData: {
					clientType: "web",
				},
				bizNo: "",
				askData11: {}
			}
		},
		beforeCreate() {
			var that = this;
			if(that.$route.query.bizNo) {
				var authType = 1;
				if(localStorage.getItem("zhimaFrom")) {
					var zhimaFrom = JSON.parse(localStorage.getItem("zhimaFrom"));
					authType = zhimaFrom.type ? 0 : 1;
				}
				network(CONFIG.authFaceQuery, {
					bizNo: that.$route.query.bizNo,
					authType: authType
				}, {
					codeFlag: true
				}).then((res) => {
					var zhimaFrom = JSON.parse(localStorage.getItem("zhimaFrom"));
					if(res.head.code == 0) {
						that.goBack();
						/*if(localStorage.getItem("zhimaFrom")) {
	  						if(!res.details.isIdCard){
	  							that.$router.replace({path: '/zhimaIDcard'});
	  						}else if(zhimaFrom.page == 'placeOrder'){
								location.href = "#/home/placeOrder?product_id="+zhimaFrom.product_id;
	  						}else{
	  							that.$router.replace({path: '/zhimaSuccess'});
							}
	  					}else {
	  						that.$router.replace({path: '/zhimaSuccess'});
	  					}
	  					*/
					} else {
						Vue.toast(res.head.message, {
							duration: 1500
						})
					}
				})
			}
		},
		mounted() {
			var that = this;
			if(IFALIPAY) {
				that.askData.clientType = "alipay";
			}
		},
		methods: {
			goFace() {
				var that = this;
				that.askData = that.askData
				network(CONFIG.authFaceInit, that.askData).then((res) => {
					if(res.head.code == 0) {
						localStorage.setItem("bizNo", res.details.bizNo);
						window.location.href = res.details.url;
					} else {

					}
				});
			}
		}
	}
</script>

<style>
	.zhima-card {
		padding: 0 0.8rem;
		height: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.zhima-card .go-back {
		/*display: inline-block;*/
		width: 0.5rem;
		height: 0.8rem;
		/*margin-top: 0.8rem;*/
		background-image: url(~@assets/img/arrow-left-black.png);
	}
	
	.zhimaFace-recognition {
		margin-top: 2.1rem;
	}
	
	.zhima-portrait {
		width: 12rem;
		height: 12rem;
		margin: 0 auto;
		background-image: url(~@assets/img/self/zhima-face.png);
		margin-top: 3rem;
	}
	
	.zhimaFace .zhima-accredit-card {
		/*display: block;*/
		width: 12.5rem;
		height: 4rem;
		position: fixed;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.zhimaFace .zhima-accredit-btn {
		background: #3ED8C4;
		width: 12rem;
		height: 2.2rem;
		line-height: 2.2rem;
		border-radius: 1.5rem;
		margin-bottom: 0.5rem;
	}
	
	.zhimaFace .tick {
		width: 0.5rem;
		height: 0.6rem;
	}
</style>