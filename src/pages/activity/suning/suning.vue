<template>
	<div class="suning-page relative">
		<img class="block width-full" src="https://resource.tanwuapp.com/FojeZzIdqW0tfEk_xawQa0TUSWAQ" />
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/FhYsKspTCi01d8bqLAq7IuK_oifC"/>
			<div class="absolute top left right">
				<ul class="input-list">
					<li class="relative">
						<input type="text" class="input" placeholder="请填写手机号" v-model="askData.phone"/>
						<span class="code-btn" @click="sendCode">{{sendFlag ? '剩余 '+ second +'s' : '获取验证码'}}</span>
					</li>
					<li>
						<input type="text" class="input" placeholder="填写验证码" v-model="askData.code"/>
					</li>
				</ul>
				<div class="agree-wrap">
					<span class="agree-checkbox vertical-bottom" :class="{active:agreeFlag}" @click="agreeFlag = !agreeFlag"></span>
					<span class="font-white vertical-bottom">同意</span><router-link to="/service-terms" class="font-white vertical-bottom">服务条款</router-link>
				</div>
				<div class="submit-btn" :class="{active:!agreeFlag || havingFlag == 'Y'}" @click="submit">
					{{havingFlag == 'Y' ? '已领取' : '领取优惠券'}}
				</div>
			</div>
		</div>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/FhwoyFZLaM9pX2TLO3Z33NEb3Df0" />
			<div class="rule-wrap absolute left bottom right">
				<h2>#领券方式</h2>
				<p>新用户注册成为探物新用户，即可领取50元短租产品无门槛优惠券一张，此券有效期：2018年10月20日-10月23日；</p>
				<h2>#使用方式</h2>
				<p>此券可直接用于抵扣租金，不可用于抵扣安心享服务及押金；</p>
				<h2>#备注</h2>
				<p>当实付租金不足50元时，也可使用优惠券，抵扣后需支付0.01元；</p>
				<p>优惠券仅可使用一次，抵扣金额不足50元时，没有结余。</p>
			</div>
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
				askData:{
					phone:'',
					code:'',
					"scene":'regAndLogin'
				},
				sendFlag:false,
				second:60,
				agreeFlag:true,
				activityAskData:{
	            		activityName:"suning",
	            	},
	            	havingFlag:'N',
	            	source:''
			}
		},
		mounted() {
			var that = this;
			that.activityInit();
			var source = "";
			var query = that.$route.query || {};
        		if(query.source){
            		source = query.source;
            		that.source = source;
            		localStorage.setItem("source",source);
            	}
        		//活动访问统计
			var reqStr = {
        			activityName:that.activityAskData.activityName,
        			action:'访问',
        			source:source
        		};
			network(CONFIG.systemClientLog,{
				platform:'h5',
				type:'info',
				url:'',
				reqStr:JSON.stringify(reqStr)
			},{codeFlag:true}).then((res) => {});
		},
		methods: {
			activityInit(){
            		var that = this;
            		network(CONFIG.activityExtendInit,that.activityAskData,{codeFlag:true}).then((res) => {
					console.log('res',res)
					if(res.head.code == 0) {
						if(res.details.isReceiveAll){
							that.havingFlag = 'Y';
						}
					} 
				});
            	},
			sendCode(){
				var that = this;
				if(!that.sendFlag){
					var reg_tel = /^1\d{10}$/;
					if(!reg_tel.test(that.askData.phone)) {
					 	Vue.toast('手机不合法',{duration:1500})
						return false;
					};
					that.sendFlag = true;
					that.countdown();
					var askData = {
						phone: that.askData.phone,
						useType: 0
					};
					network(CONFIG.userSMScode, askData, {codeFlag:true}).then((res) => {
						if (res.head.code == 0) {
							Vue.toast('发送成功',{duration:1500})
						} else {
							that.second = 1
							Vue.toast(res.head.message,{duration:1500})
						}
					})
				}
			},
			countdown(){
				var that = this;
				var second = that.second;
				if(second <= 0) {
					that.second = 60;
					that.sendFlag = false
					return false;
				};
				setTimeout(() => {
					that.second = that.second - 1;
					that.countdown();
				}, 1000)
			},
			receiveCoupons() {
				var that = this;
				if(that.havingFlag == "Y") {
					return false;
				};
				network(CONFIG.activityExtendGrantCoupon,{
					activityName:that.activityAskData.activityName
				},{codeFlag:true}).then((res) => {
					if(res.head.code == 0) {
						Vue.toast('领取成功', {
							duration: 1500
						});
						Indicator.close();
						that.havingFlag = "Y";
						var reqStr = {
			        			activityName:that.activityAskData.activityName,
			        			action:'领取优惠券',
			        			source:that.source
			        		};
						network(CONFIG.systemClientLog,{
							platform:'h5',
							type:'info',
							url:'',
							reqStr:JSON.stringify(reqStr)
						},{codeFlag:true}).then((res) => {});
					}else {
						Indicator.close();
						Vue.toast(res.head.message,{duration:1500})
					}
				});
			},
			submit(){
				var that = this;
				if(that.havingFlag == "Y") {
					return false;
				};
				var start = new Date('2018-09-19 23:59:59').getTime();
				var end = new Date('2018-10-23 23:59:59').getTime();
				var stamp = new Date().getTime();
				if(stamp < start){
					Vue.toast('活动尚未开始',{duration:1500})
					return false;
				}
				if(stamp > end){
					Vue.toast('活动已结束',{duration:1500})
					return false;
				}
				var reg_tel = /^1\d{10}$/;
				if(!reg_tel.test(that.askData.phone)) {
				 	Vue.toast('手机不合法',{duration:1500})
					return false;
				};
				if(!that.askData.code.trim()){
					Vue.toast("请输入收到的验证码",{className: ['myToast-warning']});
					return false;
				}
				if(!that.agreeFlag){
					Vue.toast('请先同意服务条款',{duration:1500})
					return false;
				}
				Indicator.open();
				network(CONFIG.activityLaterAction, that.askData, {codeFlag:true}).then((res) => {
					if (res.head.code == 0) {
						localStorage.setItem("twUser",JSON.stringify(res.details.resp));
						that.receiveCoupons();
					} else {
						Indicator.close();
						Vue.toast(res.head.message,{duration:1500})
					}
				})
			}
		}
	}
</script>

<style>
	.suning-page .rule-wrap{
		padding: 0 3.5rem 5.8rem 3.5rem;
		color: #D8363F;
	}
	.suning-page .rule-wrap h2{
		font-size: 0.7rem;
		margin-bottom: 0.1rem;
		font-weight: bold;
	}
	.suning-page .rule-wrap p{
		font-size: 0.65rem;
		line-height: 1.2;
		margin-bottom: 0.3rem;
	}
	.suning-page .input-list{
		padding: 0 0 0.3rem 2.45rem;
	}
	.suning-page .input-list li{
		position: relative;
		background: url('https://resource.tanwuapp.com/FtUD5uK2EHBLP-pG58889tgjIzu-') no-repeat center;
		background-size:contain ;
		width: 14.825rem;
		height: 3.025rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding-left: 0.6rem;
		padding-top: 0.8rem;
		margin-bottom: -0.3rem;
	}
	.suning-page .input-list li .input{
		height: 1.4rem;
		line-height: 1.4rem;
		width: 8rem;
		background: transparent;
	}
	.suning-page .input-list li .input:focus{
		background: none;
		outline: none;
		border: none;
	}
	.suning-page .input-list li .code-btn{
		position: absolute;
		right: 1.5rem;
		top: 0.95rem;
		padding: 0.3rem 0;
		line-height: 1;
		color: #FFFFFF;
		background: #EA3517;
		border-radius: 1.1rem;
		width: 3.7rem;
		font-size: 0.55rem;
		text-align: center;
	}
	.suning-page .submit-btn{
		display: block;
		margin: 0 auto;
		width: 13.65rem;
		height: 2.95rem;
		background: url('https://resource.tanwuapp.com/FqShoX0ty1wlnHKaNykMnyua1s5B') no-repeat center;
		background-size:contain ;
		text-align: center;
		line-height: 2.95rem;
		font-size: 1rem;
		color: #C3232C;
	}
	.suning-page .submit-btn.active{
		color: #666666;
	}	
	.suning-page .agree-wrap{
		margin-left: 2.5rem;
		line-height: 1;
		font-size: 0.625rem;
		padding-bottom: 0.5rem;
	}
	.suning-page .agree-wrap .agree-checkbox{
		position: relative;
		width: 0.875rem;
		height: 0.875rem;
		background: #FFFFFF;
		border-radius: 0.15rem;
		margin-right: 0.4rem;
	}
	.suning-page .agree-wrap .agree-checkbox.active:after{
		content: "";
		position: absolute;
		top:0;
		right: -0.3rem;
		width: 0.95rem;
		height: 0.775rem;
		background: url('https://resource.tanwuapp.com/FgC-HoGr0utmCfZjuwxYfJmVLglG') no-repeat center;
		background-size:contain ;
	}
</style>