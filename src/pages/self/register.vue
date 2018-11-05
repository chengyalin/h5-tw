<template>
	<div class="login">
		<div class="login-close">
			<router-link to="/self">
				<img class="login-close-btn" src="~@assets/img/icon-close.png" />
			</router-link>
		</div>
		<div class="font-darkGray login-title">
			<p class="login-name">你好，</p>
			<p class="font-16">注册探物，立即探索新奇特</p>
		</div>
		<div class="tw-input-group">
			<div>
				<div class="tw-input-row" :class="{'tw-bg-white': phoneColor}">
					<span class="tw-input-icon bg-contain tw-input-user" :class="{'tw-input-user-selected': phoneColor}"></span>
					<input type="tel" placeholder="请输入手机号" v-model="askData.phone" maxlength="11" @focus="phoneColor = true" @blur="phoneColor = false">
				</div>
				<div class="tw-input-row" :class="{'tw-bg-white': codeColor}">
					<span class="tw-input-icon bg-contain tw-input-code" :class="{'tw-input-code-selected': codeColor}"></span>
					<input type="text" placeholder="请输入验证码" v-model="askData.code" @focus="codeColor = true;phoneColor = false" @blur="codeColor = false">
					<span class="font-12 font-green" @click="sendCode">{{ showSecond }}</span>
				</div>
				<div class="tw-input-row" :class="{'tw-bg-white': pwdColor}">
					<span class="tw-input-icon bg-contain tw-input-pwd" :class="{'tw-input-code-selected': pwdColor}"></span>
					<input type="password" placeholder="请输入密码" v-model="askData.password" ref="inputPassword" @focus="pwdColor = true;phoneColor = false" @blur="pwdColor = false">
					<!--<span class="font-12 bg-contain pwd-eye" @click="changeSeen" :class="{'pwd-eye-selected': pwdEye}"></span>-->
				</div>
			</div>
		</div>
		<div class="font-lightGray font-12 register-clause">
			<p>
				注册代表你同意《
				<router-link to="/copyright-terms" class="down-line">探物隐私协议</router-link>》和《
				<router-link to="/service-terms" class="down-line">服务条款</router-link>》
			</p>
		</div>
		<button class="login-btn" @click="submitForm">注册</button>
		<div class="other-login1">
			已有账号，
			<router-link replace class="go-register1 font-14" to="/login"> 立即登录</router-link>
		</div>
		<!--<div class="register-footer fixd-center">
			<div class="other-login1">
				已有账号，
				<router-link replace class="go-register font-14" to="/login"> 立即登录</router-link>
			</div>
		</div>-->

	</div>
</template>

<script>
	import Vue from 'vue'
	import { network } from '@assets/js/network';
	import { CONFIG } from '@assets/js/config';
	import md5 from 'js-md5'
	import { getMapAddress } from '@assets/js/mUtils';

	export default {
		data() {
			return {
				phoneColor: true,
				codeColor: false,
				pwdColor: false,
				pwdEye: false,
				pwdCode: true,
				second: 60,
				pwdEye: false, // 密码可见和隐藏

				showSecond: "获取验证码",
				askData: {
					"phone": "",
					"code": "",
					"password": "",
					"head_thumb": "",
					"nick_name": "",
					"realname": "",
					"idcard": "",
					"qq": "",
					"weixin": "",
					"alipay": "",
					"sinaweibo": "",
					"invite_code": "",
					"deviceToken": "",
					"installationId": "",
					"client_type": "web",
					"client": "web",
					"email": "",
					"type": "web"
				}
			}
		},
		mounted() {
			var that = this;
			that.ifAlipay = IFALIPAY;
			var client_type;
			if(IFALIPAY) {
				client_type = "alipay"
			} else if(IFWECHAT) {
				client_type = "wechat"
			} else if(localStorage.getItem("source")) {
				client_type = localStorage.getItem("source")
			} else {
				client_type = "web"
			};
			that.askData.client_type = client_type;
			if(localStorage.getItem("alipayOpenId")) {
				that.askData.alipay = localStorage.getItem("alipayOpenId");
			};
			if(localStorage.getItem("wechatUnionid")) {
				that.askData.wechat = localStorage.getItem("wechatUnionid");
			}
			//活动标志统计
			if(localStorage.getItem("opeActivityTag")){
		    		that.askData.opeActivityTag = localStorage.getItem("opeActivityTag")
		    }
			getMapAddress(function(){
				that.province = localStorage.getItem("province")
				that.city = localStorage.getItem("city")
			})		
		},
		methods: {
			changeSeen() {
				this.pwdEye = !this.pwdEye
				this.$refs.inputPassword.type = this.pwdEye ? 'text' : 'password'
			},
			submitForm() {
				var that = this
				var client_type; // 默认类型
				var reg_pwd = /^[0-9a-zA-z]{6,}$/;
				var reg_tel = /^1\d{10}$/;
				var reg_zipcode = /^\d{6}$/;
				if(!reg_tel.test(that.askData.phone.trim())) {
					Vue.toast('手机号码不合格', {
						duration: 1500
					})
					return false
				}
				if(that.askData.code.trim().length == 0) {
					Vue.toast('验证码不能为空', {
						duration: 1500
					})
					return false
				}
				if(!reg_pwd.test(that.askData.password)) {
					Vue.toast('密码不合格', {
						duration: 1500
					})
					return false
				}
				// 获取省份和城市
				
				if (that.province){
					that.askData.province = that.province
				}
				if (that.city) {
					that.askData.city = that.city
				}
				that.askData.password = md5(that.askData.password.trim())
				var _askData = {
					phone: that.askData.phone,
					third_account: that.askData.alipay || that.askData.wechat,
					loginType: that.askData.client_type,
					client_type: that.askData.client_type,
					deviceToken: "",
					installationId: ""
				}
				if(that.ifRegist == 'Y') {
					if(confirm('该账号已注册是否绑定？')) {
						network(CONFIG.updataThirdInfo, _askData, {
							codeFlag: true
						}).then((res) => {
							if(res.head.code == 0) {
								localStorage.setItem('twUser', JSON.stringify(res.details))
								that.$router.replace({
									path: '/zhimaAccredit'
								});
							} else { // 报错信息  
								Vue.toast(res.head.message, {
									duration: 1500
								})
							}
						})
					} else {
						that.second = 1
					}
				} else {
					that.askData.blackBox = typeof(_fmOpt) != "undefined" ? _fmOpt.getinfo() : "";
					network(CONFIG.register, that.askData, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							Vue.toast('注册成功', {
								duration: 1500
							})
							localStorage.setItem("twUser", JSON.stringify(res.details));
							that.$router.replace({
								path: '/zhimaAccredit'
							});
						} else {
							//报错信息
							Vue.toast(res.head.message, {
								duration: 1500
							})
						}
					})

				}
			},
			sendCode() {
				var that = this
				var reg_tel = /^1\d{10}$/;
				if(!reg_tel.test(that.askData.phone)) {
					Vue.toast('手机号码不合格', {
						duration: 1500
					})
					return false;
				}
				if(!that.ifSendCode) {
					that.showSecond = "剩余" + that.second + "s";
					that.ifSendCode = true;
					that.countdown();
					var _askData = {
						phone: that.askData.phone,
						useType: 1
					}
					if(that.askData.alipay) {
						_askData.third_account = "alipay";
					}
					network(CONFIG.checkTelCode, _askData, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							that.ifRegist = res.result.registered
						} else {
							Vue.toast(res.head.message, {
								duration: 1500
							})
							that.second = 1;
							Vue.toast(res.head.message, {
								duration: 1500
							})
						}
					})
				}
			},
			countdown() {
				var that = this;
				var second = that.second;
				if(second == 0) {
					that.showSecond = "重新获取";
					that.second = 60;
					that.ifSendCode = false
					return false;
				};
				setTimeout(() => {
					that.second = that.second - 1;
					that.showSecond = "剩余" + that.second + "s";
					that.countdown();
				}, 1000)
			}
		},

		components: {}
	}
</script>

<style>
	.tw-input-user {
		background-image: url(~@assets/img/icon-user-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1rem;
	}
	
	.tw-input-code {
		background-image: url(~@assets/img/icon-code-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1.1rem;
	}
	
	.tw-input-pwd {
		background-image: url(~@assets/img/icon-pwd-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1.1rem;
	}
	
	.pwd-eye {
		background-image: url(~@assets/img/icon-pwd-hide.png);
		display: inline-block;
		width: 3rem;
		height: 0.6rem;
	}
	
	.pwd-code {
		width: 13.7rem;
		margin-top: 0.7rem;
		display: flex;
		justify-content: space-between;
		padding-left: 2rem;
	}
	
	.tw-bg-white {
		background-color: #fff;
	}
	
	.tw-input-user-selected {
		background-image: url(~@assets/img/icon-user-selected.png);
	}
	
	.tw-input-code-selected {
		background-image: url(~@assets/img/icon-code-selected.png);
	}
	
	.tw-input-pwd-selected {
		background-image: url(~@assets/img/icon-pwd-selected.png);
	}
	
	.pwd-eye-selected {
		background-image: url(~@assets/img/icon-pwd-visible.png);
	}
	
	.register-clause {
		width: 13.7rem;
		margin-top: 0.7rem;
		margin-left: 2rem;
	}
	
	.register-footer {
		height: 3.9rem;
		width: 18.75rem;
		/*background: url(~@assets/img/register-footer.png);*/
		background-repeat: no-repeat;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.other-login1 {
		margin: 1.5rem 0 0 2rem;
	}
	
	.go-register1 {
		height: 0.8rem;
		line-height: 0.8rem;
		color: #3ED8C4;
		border-bottom: 1px solid #3ED8C4;
	}
	/*弹窗popup*/
	
	.popup {
		width: 15.5rem;
		height: 10rem;
		line-height: 10rem;
		text-align: center;
		background: #f7e8ce;
		color: #333;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 8px;
	}
	
	.login .down-line {
		display: inline-block;
		text-decoration: underline;
	}
</style>