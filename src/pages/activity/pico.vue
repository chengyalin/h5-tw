<template>
	<div class="pico-page">
		<img class="block width-full" src="https://resource.tanwuapp.com/Fvs_wgsxzPdrAXwfzh-0ai5Y4uNU"/>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/Fl-j2IIapLCyJxR9TFO5rRASKMYz"/>
			<div class="rule-wrap absolute left top right">
				<h2>#活动时间</h2>
				<p>2018年9月20日 ~ 9月23日</p>
				<h2>#参与方式</h2>
				<p>在本页面填写您的手机号和对应验证码，即可参与活动报名。</p>
				<h2>#活动奖品</h2>
				<p>报名截止后，我们将从所有报名者中，随机抽取30名幸运粉丝，获得小怪兽2 VR一体机两周免费试用资格。（试用需支付一定设备押金，归还设备后全额返还）</p>
				<h2>#领取优惠券</h2></p>
				<p>免费试用资格将以【探物】APP优惠券形式发放。获得资格的幸运粉丝，凭报名手机号登录【探物】APP，在【我的】→【优惠券】中查看并使用。</p>
				<h2>#领奖方式</h2>
				<p>获得资格的粉丝名单将于2018年9月24日，在新浪微博“Pico虚拟现实”中公布，同时也将通过短信方式告知，敬请关注。</p>
				<h2>#活动解释权</h2>
				<p>本活动最终解释权归Pico所有。</p>
			</div>
		</div>
		<div class="relative">
			<img class="block width-full" src="https://resource.tanwuapp.com/FqOj3gWnPdK6_4xwDbpuSvx8JQEX"/>
			<div class="absolute top left right">
				<ul class="input-list">
					<li>
						<input type="text" class="input" placeholder="请填写手机号" v-model="askData.phone"/>
						<span class="code-btn" @click="sendCode">{{sendFlag ?  second +'s' : '获取验证码'}}</span>
					</li>
					<li>
						<input type="text" class="input" placeholder="填写验证码" v-model="askData.code"/>
					</li>
				</ul>
				<div class="submit-btn" @click="submit">
					报名参加
				</div>
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
				second:60
			}
		},
		mounted() {
		},
		methods: {
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
			submit(){
				var that = this;
				var start = new Date('2018-09-19 23:59:59').getTime();
				var end = new Date('2018-09-23 23:59:59').getTime();
				var stamp = new Date().getTime();
				if(stamp < start){
					Vue.toast('活动尚未开始',{duration:1500})
					return false;
				}
				if(stamp > end){
					Vue.toast('活动报名时间已结束',{duration:1500})
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
				Indicator.open();
				network(CONFIG.activityLaterAction, that.askData, {codeFlag:true}).then((res) => {
					if (res.head.code == 0) {
						localStorage.setItem("twUser",JSON.stringify(res.details.resp));
						var arr = localStorage.getItem("picoEnroll") ? localStorage.getItem("picoEnroll").split(",") : [];
						if(arr.indexOf(that.askData.phone) > -1){
							Indicator.close();
							Vue.toast('该账号已经预约',{duration:1500})
						}else{
							var reqStr = {
				        			activityName:'picoEnroll',
				        			phone:that.askData.phone
				        		};
							network(CONFIG.systemClientLog,{
								platform:'h5',
								type:'info',
								url:"",
								reqStr:JSON.stringify(reqStr)
							},{codeFlag:true}).then((res) => {
								Indicator.close();
								arr.push(that.askData.phone);
								localStorage.setItem("picoEnroll",arr.join(","));
								Vue.toast('预约成功',{duration:1500})
							});
						}
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
	.pico-page .rule-wrap{
		padding: 0.6rem 1.9rem 0 1.9rem;
	}
	.pico-page .rule-wrap h2{
		font-size: 0.8rem;
		margin-bottom: 0.15rem;
	}
	.pico-page .rule-wrap p{
		line-height: 1.1;
		margin-bottom: 0.5rem;
	}
	.pico-page .input-list{
		padding: 1.7rem 0.5rem 0.7rem 0.5rem;
	}
	.pico-page .input-list li{
		position: relative;
		background: url('https://resource.tanwuapp.com/FvCn1NqKCTytNKPUbB45AxLT3bvg') no-repeat center;
		background-size:contain ;
		padding: 0.9rem 0.8rem;
		margin-bottom: -0.2rem;
	}
	.pico-page .input-list li .input{
		height: 1.4rem;
		line-height: 1.4rem;
		width: 11rem;
		background: transparent;
	}
	.pico-page .input-list li .input:focus{
		background: none;
		outline: none;
		border: none;
	}
	.pico-page .input-list li .code-btn{
		position: absolute;
		right: 0.8rem;
		top: 0.9rem;
		height: 1.4rem;
		line-height: 1.4rem;
		color: #FFFFFF;
		background: #6ad48e;
		border-radius: 1.4rem;
		width: 4.5rem;
		text-align: center;
	}
	.pico-page .submit-btn{
		display: block;
		margin: 0 auto;
		width: 10.1rem;
		height: 2.4rem;
		background: url('https://resource.tanwuapp.com/FiIe7CNHRbkEC7xijB0HsxlYeYZ-') no-repeat center;
		background-size:contain ;
		text-align: center;
		line-height: 2.4rem;
		font-size: 1rem;
		color: #EB6100;
		font-weight: bold;
	}
</style>
