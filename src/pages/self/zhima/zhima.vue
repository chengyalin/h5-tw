<template>
	<div class="zhima">
		<div class="zhima-accredit">
			<div class="zhima-title">
				<img class="zhima-title-img" src="~@assets/img/self/zhima-title.png" />
				<p class="font-30 font-white text-center">立即授权芝麻信用</p>
				<p class="font-16 font-white text-center">享租赁减免押金资格</p>
			</div>
			<div class="zhima-accredit-verification">
				<ul>
					<li>
						<input class="input" type="text" placeholder="授权人真实姓名" v-model="askData.certName" />
						<span class="line-normal"></span>
					</li>
					<li>
						<input class="input" type="text" placeholder="授权人身份证号码" v-model="askData.certNo" />
						<span class="line-normal"></span>
					</li>
					<li>
						<input class="input" type="text" placeholder="输入由你身份证申请的手机号码" v-model="askData.phone" />
						<span class="line-normal"></span>
					</li>
					<li v-if="accountFlag">
						<input class="input" type="text" placeholder="由您身份证申请的银行账号" v-model="askData.bankCard" />
						<span class="line-normal"></span>
					</li>
					<li>
						<input class="input" type="text" placeholder="输入验证码" v-model="askData.authCode" />
						<span class="zhima-code font-12" @click="sendCode">{{ showSecond }}</span>
						<span class="line-normal"></span>
					</li>
					<li class="zhima-code-error" v-if="secondError">
						<span class="font-12">验证码有误，请核对后重新输入</span>
					</li>
				</ul>
				<button class="font-14 font-white zhima-submit" @click="submitForm">确认授权</button>
			</div>
			<div class="zhima-accredit">
				<div class="zhima-accredit-info zhima-accredit-list">
					<p class="font-14 font-darkGray zhima-accredit-explain">- 芝麻信用授权说明 -</p>
					<ul>
						<li>
							<p class="font-14 font-darkGray"><span class="zhima-dian"></span> 为什么要授权芝麻信用？</p>
							<span class="font-12 font-grey zhima-accredit-explain-info">授权芝麻信用后，可以根据你的芝麻信用分值减免产品押金。</span>
						</li>
						<li>
							<p class="font-14 font-darkGray"><span class="zhima-dian"></span> 芝麻信用免押额度该如何使用？</p>
							<span class="font-12 font-grey zhima-accredit-explain-info">产品下单后，你的免押额度会自动减免产品押金，不免预约费用，不可提现使用。</span>
						</li>
						<li>
							<p class="font-14 font-darkGray"><span class="zhima-dian"></span>在探物授权芝麻信用安全吗？</p>
							<span class="font-12 font-grey zhima-accredit-explain-info">探物承诺，用户授权之后，身份信息仅用于免押认证，绝不透露给第三方，无信息泄密的风险，可放心授权。</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="zhima-footer">
				<img src="~@/assets/img/self/zhima-footer.png" />
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { network } from '@assets/js/network';
	import { CONFIG } from '@assets/js/config';

	export default {
		data() {
			return {
				agreeFlag: false,
				askData: {
					certName: '',
					certNo: '',
					phone: '',
					bankCard: '',
					type: 'web',
					client: "web",
					authCode: ''
				},
				accountFlag: false,
				auth_code: "",
				showSecond: "获取验证码",
				second: 60,
				secondError: false
			}
		},
		mounted() {
			var that = this
			var query = that.$route.query;
			if(query.auth_code){
				that.auth_code = query.auth_code;
				network(CONFIG.authAuthQuery, {notVerify:true},{codeFlag:true}).then((res) => {
					if(!res.details.authorized){
						network(CONFIG.authAuthStart, {code:that.auth_code},{codeFlag:true}).then((res) => {
							if(res.head.code != 0){
								Vue.toast(res.head.message, {
									duration: 1500
								})
							}
	            			});
					}
				})
			}
			if(query.auth_code || !IFALIPAY) {
				network(CONFIG.payZmxyInit,{},{codeFlag:true}).then((res) => {
					if(res.details.certNo.length) {
						that.askData.certName = res.details.name;
						that.askData.phone = res.details.phone;
						that.askData.certNo = res.details.certNo;
					}
				})
			} else if(IFALIPAY) {
				window.location.href = CONFIG.zhimaOpenAuth;
			}
		},
		methods: {
			submitForm() {
				var that = this
				var reg_pwd = /^[0-9a-zA-z]{6,}$/;
				var reg_tel = /^1\d{10}$/;
				var reg_zipcode = /^\d{6}$/;
				var reg_bankCard1 =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				var taiwanreg=/^[A-Z][0-9]{9}$/;
　　				var xianggangreg=/^[A-Z][0-9]{6}\([0-9A]\)$/;
　　				var aomenreg=/^[157][0-9]{6}\([0-9]\)$/;
				if(that.askData.certName.trim().length == 0) {
					Vue.toast('姓名不能为空', {
						duration: 1500
					})
					return false;
				};
				if(!reg_bankCard1.test(that.askData.certNo) && !taiwanreg.test(that.askData.certNo) && !xianggangreg.test(that.askData.certNo) &&!aomenreg.test(that.askData.certNo)) {
					Vue.toast('身份证号不正确', {
						duration: 1500
					})
					return false;
				};
				if(!reg_tel.test(that.askData.phone)) {
					Vue.toast('手机号码不合法', {
						duration: 1500
					})
					return false;
				};
				if(that.accountFlag && !that.askData.bankCard) {
					Vue.toast('银行账号不能为空', {
						duration: 1500
					})
					return false;
				};
				if(that.askData.authCode == "") {
					Vue.toast('验证码不能为空', {
						duration: 1500
					})
					return false
				}
				that.askData.needVerify = true;
				that.askData.blackBox = typeof(_fmOpt) != "undefined" ? _fmOpt.getinfo() : "";
				if(IFALIPAY) {
					network(CONFIG.authZhimaScore, that.askData, {
						codeFlag: true,
					}).then((res) => {
						if(res.head.code == 0) {
							if(!res.details.isFace) {
								that.$router.replace({path: '/zhimaFace'});
							} else {
								if(localStorage.getItem("zhimaFrom")) {
									var zhimaFrom = JSON.parse(localStorage.getItem("zhimaFrom"));
									if(zhimaFrom.page == 'placeOrder') {
										if(!res.details.isIdCard) {
											that.$router.replace({path: '/zhimaIDcard'});
										} else {
											that.$router.replace({path: '/zhimaSuccess'});
										}
									} else {
										that.$router.replace({path: '/zhimaSuccess'});
									}
								} else {
									that.$router.replace({path: '/zhimaSuccess'});
								}
							}
						} else if(res.head.code == 101) {
							if(res.details && res.details.againFlag == "Y") {
								that.accountFlag = true;
							}
							Vue.toast(res.head.message, {
								duration: 1500
							})
						} else {
							Vue.toast(res.head.message, {
								duration: 1500
							})
						}
					})
				} else {
					that.askData.name = that.askData.certName.trim();
					network(CONFIG.payZmxyAuth, that.askData, {
						codeFlag: true,
					}).then((res) => {
						if(res.head.code == 0) {
							localStorage.setItem("zhimaInfo", JSON.stringify(that.askData))
							location.replace(res.details.toUrl)
						} else if(res.head.code == 101) {
							if(res.details && res.details.againFlag == "Y") {
								that.accountFlag = true;
							}
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
						'phone': that.askData.phone,
						'useType': 0
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
							that.secondError = true
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
	.zhima-accredit {
		background: linear-gradient(bottom, #1CCECA 100%, #21DED2 100%);
		background: -moz-linear-gradient(bottom, #1CCECA 100%, #21DED2 100%);
		background: -webkit-linear-gradient(bottom, #1CCECA 100%, #21DED2 100%);
		background: -o-linear-gradient(bottom, #1CCECA 100%, #21DED2 100%);
		background: -ms-linear-gradient(bottom, #1CCECA 100%, #21DED2 100%);
		background: -webkit-gradient(bottom, #1CCECA 100%, #21DED2 100%);
	}
	
	.back {
		padding: 0 0.8rem;
		height: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.back .go-back {
		/*display: inline-block;*/
		width: 0.5rem;
		height: 0.8rem;
		/*margin-top: 0.8rem;*/
		background-image: url(~@assets/img/arrow-left-black.png);
	}
	
	.zhima-title {
		height: 7.5rem;
	}
	
	.zhima-title-img {
		width: 3.8rem;
		height: 0.9rem;
		margin: 0.7rem 0 0.9rem 0.9rem;
	}
	
	.font-30 {
		font-size: 1.5rem;
	}
	
	.zhima-accredit-verification {
		width: 17rem;
		padding: 0.5rem 0;
		background: #fff;
		margin: 0 auto;
		margin-bottom: 0.5rem;
	}
	.zhima-accredit-verification .input::-webkit-input-placeholder{
    color:#BBBBBB;
}
	.zhima-accredit-info {
		width: 17rem;
		height: 18rem;
		background: #fff;
		margin: 0 auto;
		margin-bottom: 0.5rem;
	}
	
	.zhima-accredit-info li,
	.zhima-accredit-verification li {
		height: 2.8rem;
		width: 14rem;
		margin: 0 auto;
		position: relative;
	}
	
	.zhima-accredit-info li input,
	.zhima-accredit-verification li input {
		height: 2.8rem;
		width: 100%;
	}
	
	.zhima-accredit-info ul,
	.zhima-accredit-verification ul {
		padding-top: 0.5rem;
		padding-bottom: 1.4rem;
	}
	
	.zhima-code {
		position: absolute;
		right: 0;
		top: 1rem;
		color: #3ED8C4;
	}
	
	.zhima-submit {
		display: block;
		width: 14rem;
		height: 2.2rem;
		text-align: center;
		line-break: 2.2rem;
		background: #3ED8C4;
		margin: 0 auto 2rem;
		border-radius: 1.1rem;
	}
	
	.zhima-accredit-explain {
		text-align: center;
		padding: 1.4rem 0 0.6rem;
	}
	
	.zhima-dian {
		display: inline-block;
		width: 0.2rem;
		height: 0.2rem;
		border-radius: 50%;
		border: 1px solid #3ED8C4;
		margin-right: 0.2rem;
	}
	
	.zhima-accredit-explain-info {
		display: inline-block;
		margin-left: 0.9rem;
	}
	
	.zhima-accredit-list li {
		margin-bottom: 1rem;
	}
	
	.zhima-accredit-list li p {
		margin-bottom: 0.3rem;
	}
	
	.zhima-footer {
		height: 2.5rem;
		text-align: center;
	}
	
	.zhima-footer img {
		width: 5.8rem;
		height: 0.8rem;
		margin-top: 0.5rem;
	}
	
	.zhima-code-error {
		color: #E6361F;
	}
	
	.zhima-accredit-verification .zhima-code-error {
		height: 1.2rem;
		line-height: 1.2rem;
	}
</style>