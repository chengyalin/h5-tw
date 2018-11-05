<template>
	<div class="passwordForget">
		<!--<div class="password-progress">
			<div class="password-progress-item">
				<span class="progress-left"></span>
				<span class="progress-center"></span>
				<span class="progress-right"></span>
			</div>
		</div>-->
		<div class="passwordEdit-title">
			<!--<p class="go-back bg-contain" @click="goBack"></p>-->
			<!--<p class="font-16 font-darkGray font-bold"></p>
			<p class="font-blue font-14"></p>-->
		</div>
		<div class="font-darkGray login-title">
			<p class="font-20">Hi，重置密码</p>
			<p class="font-16">密码建议怎么好记怎么来hhh～</p>
		</div>
		<div class="tw-input-group">
			<div>
				<div class="tw-input-row" :class="{'tw-bg-white': phoneColor}" >
					<span class="tw-input-icon bg-contain tw-input-user" :class="{'tw-input-user-selected': phoneColor}"></span>
					<input type="tel" placeholder="请输入注册手机号码" v-model="askData.phone" maxlength="11" @focus="phoneColor = true" @blur="phoneColor = false">
				</div>
				<div  class="tw-input-row" :class="{'tw-bg-white': codeColor}">
					<span class="tw-input-icon bg-contain tw-input-code" :class="{'tw-input-code-selected': codeColor}"></span>
					<input type="text" placeholder="请输入验证码"  v-model="askData.authCode" @focus="codeColor = true;phoneColor = false" @blur="codeColor = false">
					<span class="font-12 font-green" @click="sendCode">{{ showSecond }}</span>
				</div>

			</div>
			<!--<div v-else>-->
				<div class="tw-input-row" :class="{'tw-bg-white': pwdColor}">
					<span class="tw-input-icon bg-contain tw-input-pwd" :class="{'tw-input-pwd-selected': pwdColor}"></span>
					<input type="password" placeholder="请输入密码" ref="inputPassword" v-model="passwordBefore1" @focus="pwdColor = true;phoneColor = false " @blur="pwdColor = false">
					<!--<span class="font-12 bg-contain pwd-eye" @click="changeSeen"  :class="{'pwd-eye-selected': pwdEye}"></span>-->
				</div>
		</div>
		<button class="login-btn" @click="submitForm">确认</button>
	</div>
</template>

<script>
import Vue from 'vue'
import { network } from '@assets/js/network';
import { CONFIG } from '@assets/js/config';
import md5 from 'js-md5'


export default {
	data () {
  		return {
  			phoneColor: true,
  			codeColor: false,
  			pwdColor: false,
  			pwdColor2: false,
  			pwdEye: false,
  			pwdEye2: false,
  			pwdCode: true,
  			askData:{
        		phone:'',
        		authCode:''
        	},
        	second:60,
        	showSecond:"发送验证码",
        	setFlag:false,
        	passwordBefore1: '',
        	passwordBefore2: ''
  		}
  	},
  	mounted () {

  	},
  	methods: {
  		goBack(){
  			history.go(-1)
  		},
  		changeSeen () {
			this.pwdEye = !this.pwdEye
			this.$refs.inputPassword.type = this.pwdEye ? 'text' : 'password'

		},
		 changeSeen2 () {
			this.pwdEye2 = !this.pwdEye2
			this.$refs.inputPassword2.type = this.pwdEye2 ? 'text' : 'password'
		},
  		submitForm () {
  			var that = this
			var reg_pwd = /^[0-9a-zA-z]{6,}$/;
			var reg_tel = /^1\d{10}$/;
			var reg_zipcode = /^\d{6}$/;
			if (!reg_tel.test(that.askData.phone)) {
				Vue.toast('手机号码不合格',{duration:1500})
				return false
			}
//				if (that.passwordBefore1 != that.passwordBefore2) {
//					Vue.toast('两次密码不一样',{duration:1500})
//					return false
//				}
			that.askData.password = md5(that.passwordBefore1)
			network(CONFIG.userForgetPwd, that.askData, {codeFlag:true}).then((res) => {
				if (res.head.code == 0) {
					Vue.toast('修改密码成功',{duration:1500})
					setTimeout(() => {
						history.go(-1)
					}, 800)
				} else {
					
					// 报错信息
					Vue.toast(res.head.message,{duration:1500})
				}

			})

  		},
  		sendCode () {
			var that = this
			var reg_tel = /^1\d{10}$/;
			if(!reg_tel.test(that.askData.phone)) {
				Vue.toast('手机号码不合格',{duration:1500})
				return false;
			}
			if (!that.ifSendCode) {
				that.showSecond = "剩余" + that.second + "s";
				that.ifSendCode = true;
				that.countdown();
				var _askData = {
					phone: that.askData.phone,
					useType: 3
				}
				network(CONFIG.userSMScode, _askData,  {codeFlag:true}).then((res) => {
					if (res.head.code == 0) {
						Vue.toast('发送成功',{duration:1500})
					} else {
						that.second = 1
						// 错误信息
						Vue.toast(res.head.message,{duration:1500})
					}
				})
			}
		},
		countdown () {
			var that = this;
		    var second = that.second;
		    if (second == 0) {
		        that.showSecond = "重新获取";
		        that.second = 60;
		        that.ifSendCode = false
		        return false;
		    };
		    setTimeout(()=> {
		        that.second = that.second - 1;
		        that.showSecond = "剩余" + that.second + "s";
		        that.countdown();
		    },1000)
		}
  	},
	components: {
	}
}
</script>

<style>

.passwordEdit-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.passwordEdit-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.progress-center {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 1.2rem;
	display: inline-block;
	height: 1px;
	margin-bottom: 0.2rem;
	background: #ddd;
}
.passwordForget .tw-input-user {
	background-image: url(~@assets/img/icon-user-unselected.png);
	position: absolute;
	left: 2rem;
	top: 1rem;
}
.passwordForget .tw-input-code {
	background-image: url(~@assets/img/icon-code-unselected.png);
	position: absolute;
	left: 2rem;
	top: 1.1rem;
}
.passwordForget .tw-input-pwd {
	background-image: url(~@assets/img/icon-pwd-unselected.png);
	position: absolute;
	left: 2rem;
	top: 1.1rem;
}
.passwordForget .pwd-eye {
	background-image: url(~@assets/img/icon-pwd-hide.png);
	display: inline-block;
	width: 3rem;
	height: 0.6rem;
}
.passwordForget .pwd-code {
	width: 13.7rem;
	margin-top: 0.7rem;
	display: flex;
	justify-content: space-between;
	padding-left: 2rem;
}
.passwordForget .tw-bg-white {
	background-color: #fff;

}
.passwordForget .tw-input-user-selected {
	background-image: url(~@assets/img/icon-user-selected.png);
}
.passwordForget .tw-input-code-selected {
	background-image: url(~@assets/img/icon-code-selected.png);
}
.passwordForget .tw-input-pwd-selected {
	background-image: url(~@assets/img/icon-pwd-selected.png);
}
.passwordForget .pwd-eye-selected {
	background-image: url(~@assets/img/icon-pwd-visible.png);
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
</style>
