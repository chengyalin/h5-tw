<template>
	<div class="passwordEdit">
		<div class="passwordEdit-title">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">重置密码</p>
			<p class="font-blue font-14" @click="submitForm">完成</p>
		</div>
		<div class="passwordEdit-info">
			<div>
				<div  class="tw-input-row" >
					<!--<span class="tw-input-icon bg-contain tw-input-code"></span>-->
					<span class="name">验证身份</span>
					<input type="text" placeholder="请输入验证码"  v-model="askData.authCode">
					<span class="font-12 font-green" @click="sendCode">{{ showSecond }}</span>
				</div>
				<span class="line-normal"></span>
				<p class="font-12 passwordEdit-phone">
					账号已与 {{phone1}} 绑定，请通过验证码确认身份
				</p>

				<div  class="tw-input-row" >
					<!--<span class="tw-input-icon bg-contain tw-input-code"></span>-->
					<span  class="name">新密码</span>
					<input type="password" placeholder="设置新密码"  v-model="new_password">
				</div>
				<span class="line-normal"></span>
				<div  class="tw-input-row" >
					<!--<span class="tw-input-icon bg-contain tw-input-code"></span>-->
					<span class="name">确认密码</span>
					<input type="password" placeholder="再次输入新密码" v-model="re_password">
				</div>
				<span class="line-normal"></span>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { network } from '@assets/js/network';
import { CONFIG } from '@assets/js/config';
import md5 from 'js-md5'
import { setBodyColor } from '@assets/js/mUtils';


export default {
	data () {
  		return {
  			showSecond:"发送验证码",
  			askData:{
        		phone:'',
        		authCode:''
        	},
        	second:60,
        	phone1: '',
        	new_password: '',
        	re_password: ''
  		}
  	},
  	mounted(){
  		var that = this
  		setBodyColor(true);
  		that.askData.phone = JSON.parse(localStorage.getItem("twUser")).phone
  		that.phone1 = that.askData.phone.substr(0,3)+"****"+that.askData.phone.substr(7)
  	},
  	methods: {
  		goBack () {
  			history.go(-1);
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
		},
		submitForm () {
			var that= this
			var reg_pwd = /^[0-9a-zA-z]{6,}$/;
			if (!reg_pwd.test(that.new_password)) {
				Vue.toast('新密码不合法',{duration:1500})
				return false
			}
			if (that.new_password != that.re_password) {
				Vue.toast('两次密码不一致',{duration:1500})
				return false
			}
			if (!that.askData.authCode.trim().length) {
				Vue.toast('验证码不能为空',{duration:1500})
				return false
			}
			//that.new_password = md5(that.new_password)
			//that.re_password = md5(that.re_password)
			that.askData.password = md5(that.new_password)
			network(CONFIG.userForgetPwd, that.askData, {codeFlag:true}).then((res) => {
				if (res.head.code == 0) {
					Vue.toast('重置密码成功, 请重新登录',{duration:1500})
					setTimeout(() => {
						that.logOff()
					},1000);
				} else {
					Vue.toast(res.head.message,{duration:1500})
				}
			})
		},
		logOff(){
  			var that = this
  			network(CONFIG.logout, {}).then((res) => {
  				if(res.head.code == 0){
  					localStorage.clear();
					that.goBack();
  				}
  			})
  		}
  	},
  	destroyed(){
		setBodyColor();
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
.passwordEdit-info {
	width: 17rem;
	margin: 0 auto;
}
.passwordEdit .tw-input-row {
	width: 17rem;
}
.passwordEdit .tw-input-row>input {
	padding: 1rem 0rem 1rem 0.3rem;
	width: 10rem;
	/*height: 1.5rem;*/
}
.passwordEdit .tw-input-row .name {
	width: 3rem;
	display: inline-block;
}
.passwordEdit-phone {
	margin-bottom: 1rem;
	margin-top: 0.5rem;
}
</style>
