<template>
	<div class="login">
		<div class="login-close" @click="goBack">
			<img class="login-close-btn" src="~@assets/img/icon-close.png" />
		</div>
		<div class="font-darkGray login-title">
			<p class="login-name">欢迎，</p>
			<p class="font-16">登录探物，用酷的方式探寻世界</p>
		</div>
		<div class="tw-input-group">
			<div>
				<div class="tw-input-row" :class="{'tw-bg-white': phoneColor}">
					<span class="tw-input-icon bg-contain tw-input-user" :class="{'tw-input-user-selected': phoneColor}"></span>
					<input type="tel" placeholder="请输入手机号" v-model="askData.phone" maxlength="11" @focus="phoneColor = true" @blur="phoneColor = false">
				</div>
				<div v-if="pwdCode" class="tw-input-row" :class="{'tw-bg-white': codeColor}">
					<span class="tw-input-icon bg-contain tw-input-code" :class="{'tw-input-code-selected': codeColor}"></span>
					<input type="text" placeholder="请输入验证码" v-model="askData.code" @focus="codeColor = true;phoneColor = false" @blur="codeColor = false">
					<span class="font-12 font-green" @click="sendCode">{{ showSecond }}</span>
				</div>
				<div v-else class="tw-input-row" :class="{'tw-bg-white': pwdColor}">
					<span class="tw-input-icon bg-contain tw-input-pwd" :class="{'tw-input-code-selected': pwdColor}"></span>
					<input type="password" placeholder="请输入密码" v-model="askData.password" ref="inputPassword" @focus="pwdColor = true;phoneColor = false" @blur="pwdColor = false">
					<span class="font-12 bg-contain pwd-eye" @click="changeSeen" :class="{'pwd-eye-selected': pwdEye}"></span>
				</div>
			</div>
		</div>
		<!--<div class="login-footer bg-contain fixd-center">
			<div class="other-login">
				<router-link class="go-register font-14" to="/register"> 立即注册</router-link>
				<div class="login-other">
					<span class="login-other-ways weixin"></span>
					<span class="login-other-ways qq"></span>
					<span class="login-other-ways weibo"></span>
				</div>
			</div>
		</div>-->
		<div class="font-grey font-12 pwd-code relative">
			<p v-if="pwdCode" @click="pwdCode = !pwdCode">密码登录</p>
			<p v-else @click="pwdCode = !pwdCode">验证码登录</p>
			<router-link to="/passwordForget">忘记密码？</router-link>
		</div>
		<button class="login-btn relative" @click="submitForm">登录</button>
		<router-link class="go-register font-14" to="/register"> 立即注册</router-link>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { network } from '@assets/js/network';
	import { CONFIG } from '@assets/js/config';
	import md5 from 'js-md5'

	export default {
		data() {
			return {
				phoneColor: true,
				codeColor: false,
				pwdColor: false,
				pwdEye: false, // 密码可见和隐藏
				pwdCode: true, // 判断是否密码or验证码登陆
				ifAlipay: '',
				askData: {
					phone: '',
					code: '',
					password: ''
				},
				second: 60,
				showSecond: "获取验证码"
			}
		},
		mounted() {
			var that = this;
			that.ifAlipay = IFALIPAY;
			var query = that.$route.query;
			// 还有其他方式登录的
			if(query.wechatUnionid) {
				localStorage.setItem("wechatUnionid", query.wechatUnionid)
				localStorage.setItem("wechatOpenid", query.wechatUnionid)
				network(CONFIG.loginThird, {
					third_account: query.wechatUnionid,
					loginType: "wechat",
					client_type: "wechat",
				}, {
					codeFlag: true
				}).then((res) => {
					if(res.head.code == 0){
						localStorage.setItem("twUser", JSON.stringify(res.details))
						setTimeout(() => {
							if(IFPCFLAG){
								window.history.go(-2)
							}else{
								that.goBack();
							}
						}, 10);
					}
				})
			} else if(localStorage.getItem('alipayOpenId')) {
				network(CONFIG.loginThird, {
					third_account: localStorage.getItem("alipayOpenId"),
					loginType: "alipay",
					client_type: "alipay",
				}, {
					codeFlag: true
				}).then((res) => {
					if(res.head.code == 0) {
						localStorage.setItem("twUser", JSON.stringify(res.details))
						setTimeout(() => {
							that.goBack();
						}, 10);
					}
				})
			}

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
				if(that.ifAlipay) {
					client_type = "alipay" // 支付宝
				} else if(IFWECHAT) {
					client_type = "wechat" // 微信
				} else if(localStorage.getItem("source")) {
					client_type = localStorage.getItem("source")
				} else {
					client_type = "web"
				}

				// 验证码
				if(that.pwdCode) {
					var _askData = {
						phone: that.askData.phone.trim(),
						code: that.askData.code.trim(),
						client_type: client_type
					}
					if(!reg_tel.test(_askData.phone)) {
						Vue.toast('手机号码不合格', {
							duration: 1500
						})
						return false
					}
					if(!_askData.code.trim().length) {
						Vue.toast('验证码不能为空', {
							duration: 1500
						})
						return false
					}
					if(localStorage.getItem("wechatUnionid")) {
						_askData.wechat = localStorage.getItem("wechatUnionid");
					}
					if(localStorage.getItem("alipayOpenId")) {
						_askData.alipay = localStorage.getItem("alipayOpenId");
					}
					network(CONFIG.userLoginSMS, _askData).then((res) => {
						if(res.head.code == 0) {
							Vue.toast('登录成功', {
								duration: 1500
							})
							localStorage.setItem("twUser", JSON.stringify(res.details));
							that.$router.back();
						} else {
							Vue.toast(res.head.message, {
								duration: 1500
							})
						}
					})
				} else {
					var askData = {
						phone: that.askData.phone.trim(),
						password: that.askData.password.trim(),
						deviceToken: '',
						installationId: '',
						client_type: client_type,
						type: "web",
						client: "web",
						blackBox: typeof(_fmOpt) != "undefined" ? _fmOpt.getinfo() : ""
					}
					if(!reg_tel.test(askData.phone)) {
						Vue.toast('手机号码不合格', {
							duration: 1500
						})
						return false
					}
					if(!reg_pwd.test(askData.password)) {
						Vue.toast('密码不合格', {
							duration: 1500
						})
						return false
					} else {
						askData.password = md5(askData.password);
					}
					if(localStorage.getItem("alipayOpenId")) {
						askData.alipay = localStorage.getItem("alipayOpenId");
					};
					if(localStorage.getItem("wechatUnionid")) {
						askData.wechat = localStorage.getItem("wechatUnionid");
					};
					network(CONFIG.login, askData, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							Vue.toast('登录成功', {
								duration: 1500
							})
							localStorage.setItem("twUser", JSON.stringify(res.details));
							that.goBack();
						} else {
							Vue.toast(res.head.message, {
								duration: 1500
							})
						}
					})
				}
			},
			// 发送验证码
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
					network(CONFIG.userSMScode, _askData, {
						codeFlag: true
					}).then((res) => {
						if(res.head.code == 0) {
							Vue.toast('发送成功', {
								duration: 1500
							})
						} else {
							that.second = 1
							// 错误信息
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
	.login .tw-input-user {
		background-image: url(~@assets/img/icon-user-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1.1rem;
	}
	
	.login .tw-input-code {
		background-image: url(~@assets/img/icon-code-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1.1rem;
	}
	
	.login .tw-input-pwd {
		background-image: url(~@assets/img/icon-pwd-unselected.png);
		position: absolute;
		left: 2rem;
		top: 1.1rem;
	}
	
	.login .pwd-eye {
		background-image: url(~@assets/img/icon-pwd-hide.png);
		display: inline-block;
		width: 3rem;
		height: 0.6rem;
	}
	
	.login .pwd-code {
		width: 13.7rem;
		margin-top: 0.7rem;
		display: flex;
		justify-content: space-between;
		padding-left: 2rem;
	}
	
	.login .tw-bg-white {
		background-color: #fff;
	}
	
	.login .tw-input-user-selected {
		background-image: url(~@assets/img/icon-user-selected.png);
	}
	
	.login .tw-input-code-selected {
		background-image: url(~@assets/img/icon-code-selected.png);
	}
	
	.login .tw-input-pwd-selected {
		background-image: url(~@assets/img/icon-pwd-selected.png);
	}
	
	.login .pwd-eye-selected {
		background-image: url(~@assets/img/icon-pwd-visible.png);
	}
	
	.login .login-other {
		width: 5rem;
		display: flex;
		justify-content: space-around;
	}
	
	.login .login-other-ways {
		display: inline-block;
		width: 1rem;
		height: 1.1rem;
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: left center;
	}
	
	.login .login-other .weixin {
		background-image: url(~@assets/img/icon-weixin.png);
	}
	
	.login .login-other .qq {
		background-image: url(~@assets/img/icon-qq.png);
	}
	
	.login .login-other .weibo {
		background-image: url(~@assets/img/icon-weibo.png);
	}
	
	.login .go-register {
		height: 0.8rem;
		line-height: 0.8rem;
		color: #3ED8C4;
		border-bottom: 1px solid #3ED8C4;
		margin: 0 0 0 2rem;
	}
	
	.login .login-footer {
		height: 6.2rem;
		/*background-image: url(~@assets/img/login-footer.png);*/
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.login .other-login {
		/*display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 1rem;
		width: 14rem;
		left: 1.8rem;*/
		margin: 3rem 0 0 2rem;
	}
</style>
`