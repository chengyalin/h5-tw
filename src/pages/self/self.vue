<template>
	<div class="self">
		<div>
			<div class="self-head">
				<div class="self-information">
					<div class="self-msg">
						<p class="self-name" v-if="selfInfo.uuid">{{ selfInfo.nickName }} </p>
						<P class="self-name" v-else @click="goLogin">登录 / 注册 ></P>
						<router-link v-if="selfInfo.uuid" to="/self/selfEdit" class="self-more bg-arrow-right font-12">个人主页</router-link>
					</div>
					<router-link v-if="selfInfo.uuid" to='/self/selfEdit'>
						<div class="portrait" :style="{'background-image':'url(' + selfInfo.headImg + ')' }"></div>
					</router-link>
					<div v-else class="portrait portrait-img" @click="goLogin"></div>
				</div>
				<div class="zhima bg-cover">
					<div class="zhima-credit">
						<p class="limit" v-if="selfInfo.uuid && selfInfo.haveZhiMa  == 'Y'">芝麻信用可用额度</p>
						<p class="limit" v-else>芝麻信用免押额度</p>
						<p class="zhima-price" v-if="selfInfo.nickName && selfInfo.haveZhiMa  == 'Y'">
							￥<span class="price">{{ selfInfo.zhiMaCredit }}</span>
						</p>
						<p class="zhima-price" v-else>
							￥<span class="price">0.00</span>
						</p>
						<div class="zhima-rent">
							<p class="rent">授权芝麻信用 立享免押资格</p>
							<p @click="goToZhima(1)" class="credit-limit public-arrow-right font-12" v-if="selfInfo.nickName && selfInfo.haveZhiMa  == 'Y' && selfInfo.isAllAuth  == 'N'">提升额度&nbsp;  </p>
							<p @click="goToZhima(1)" class="credit-limit public-arrow-right credit-limit1 font-12 credit-limit-look" v-else-if="selfInfo.nickName && selfInfo.isAllAuth  == 'Y'">查看额度 &nbsp;</p>
							<p @click="goToZhima(2)" class="credit-limit public-arrow-right font-12" v-else>去授权 </p>
						</div>
						<!--<p class="zhima-rent">
							<span class="rent">授权芝麻信用 立享免押资格</span>
							<span @click="goToZhima(1)" class="credit-limit  credit-limit1 font-12" v-if="selfInfo.nickName && selfInfo.haveZhiMa  == 'Y' && selfInfo.isAllAuth  == 'N'">提升额度&nbsp;  </span>
							<span @click="goToZhima(1)" class="credit-limit credit-limit1 font-12 credit-limit-look" v-else-if="selfInfo.nickName && selfInfo.isAllAuth  == 'Y'">查看额度 &nbsp;</span>
							<span @click="goToZhima(2)" class="credit-limit public-arrow-right font-12" v-else>去授权 </span>
						</p>-->
					</div>
				</div>
			</div>
			<div class="self-order-wrap">
				<div class="order-title public-arrow-right">
					<span class="font-black   font-14 font-bold">我的订单</span>
					<span @click="GoToOrder(0)" class="font-grey font-12 ">查看全部</span>
				</div>
				<ul class="order-state font-12">
					<li @click="GoToOrder(1)">
						<p class="self-order-icon"></p>
						<p class="order-list-num">
							待付款
							<span v-if="selfInfo.waitPay != 0 && selfInfo.nickName">{{  selfInfo.waitPay }}</span>
						</p>
					</li>
					<li @click="GoToOrder(2)">
						<p class="self-order-icon"></p>
						<p class="order-list-num">
							已预约
							<span v-if="selfInfo.booking != 0  && selfInfo.nickName">{{  selfInfo.booking  }}</span>
						</p>
					</li>
					<li @click="GoToOrder(3)">
						<p class="self-order-icon"></p>
						<p class="order-list-num">
							发货中
							<span v-if="selfInfo.shipping != 0  && selfInfo.nickName">{{  selfInfo.shipping  }}</span>
						</p>
					</li>
					<li @click="GoToOrder(4)">
						<p class="self-order-icon"></p>
						<p class="order-list-num">
							体验期
							<span v-if="selfInfo.experience != 0  && selfInfo.nickName">{{  selfInfo.experience  }}</span>
						</p>
					</li>
					<li @click="GoToOrder(5)">
						<p class="self-order-icon"></p>
						<p class="order-list-num">
							待评价
							<span v-if=" selfInfo.waitReview  != 0  && selfInfo.nickName">{{  selfInfo.waitReview   }}</span>
						</p>
					</li>
				</ul>
				
			</div>
			
			<div class="mine-list">
				<ul>
					<li>
						<div class="public-arrow-right" @click="goTooTher(1)">
							<span class="line-normal line-normal-top"></span>
							<span class="mine-icon"></span>
							<span class="mine-title">
									购物清单
								</span>
							<span class="mine-right font-15" v-if = "selfInfo.listCount != 0">{{selfInfo.listCount}}</span>
							<span class="line-normal"></span>
						</div>
					</li>
					<li>
						<div class="public-arrow-right" @click="goTooTher(2)">
							<span class="mine-icon"></span>
							<span class="mine-title">
									优惠券
								</span>
							<span class="mine-right font-15" v-if = 'selfInfo.couponCount != 0'>{{selfInfo.couponCount}}</span>
						</div>
						<span class="line-normal"></span>
					</li>
					<li>
						<div class="public-arrow-right" @click="goTooTher(3)">
							<span class="mine-icon"></span>
							<span class="mine-title">
									帮助中心
							</span>
							<span class="line-normal"></span>
						</div>
					</li>
					<!--<li>
							<div class="public-arrow-right" @click="goTooTher(4)">
								<span class="mine-icon"></span>
								<span class="mine-title">
									邀请好友
								</span>
							</div>
						</li>-->
					<li>
						<div class="public-arrow-right" @click="goTooTher(5)">
							<span class="mine-icon"></span>
							<span class="mine-title">
									设置
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div style="height: 4.2rem;"></div>
		<router-view></router-view>
		<tabs></tabs>
	</div>
</template>

<script>
	import Tabs from '@components/tabs';
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { setBodyColor } from '@assets/js/mUtils';

	export default {
		data() {
			return {
				selfInfo: "",
				askData: {
					nick_name: "",
					phone: "",
					email: "",
					sex: "",
					head_thumb: ""
				},
			}
		},
		mounted() {
			var that = this;
			setBodyColor(true);
			if(localStorage.getItem("selfInfo")) {
				this.selfInfo = JSON.parse(localStorage.getItem("selfInfo"));
			}

			network(CONFIG.user, {}, {
				codeFlag: true
			}).then((res) => {
				if(res.head.code == 0) {
					this.selfInfo = res.details;
					localStorage.setItem("selfInfo", JSON.stringify(that.selfInfo))
				}
			})
			
		},
		methods: {
			// 跳转详情页
			GoToOrder(state) {
				var that = this;
				if(!that.selfInfo.nickName) {
					that.goLogin();
					return false;
				}
				localStorage.setItem("orderStateInit", state)
				that.$router.push('/order')
			},
			goTooTher(index) {
				var that = this;
				if(!that.selfInfo.nickName) {
					that.goLogin();
					return false;
				}
				if(index == 1) {
					that.$router.push('/self/shoppingCart')
				} else if(index == 2) {
					that.$router.push('/coupon')
				} else if(index == 3) {
					that.$router.push('/self/help')
				} else if(index == 4) {
					//				that.$router.push('')
				} else if(index == 5) {
					that.$router.push('/self/setup')
				}
			},
			goToZhima(state) {
				var that = this;
				if(!that.selfInfo.nickName) {
					that.goLogin();
					return false;
				}
				if(state == 1) {
					that.$router.push('/zhimaSuccess')
				} else if(state == 2) {
					that.$router.push('/zhima')
				}
			}
		},
		destroyed() {
			setBodyColor();
		},
		components: {
			Tabs
		}
	}
</script>

<style>
	/* .has-footer { */
	
	.self .self-head {
		background-image: url(~@assets/img/self/selfHead.png);
		background-repeat: no-repeat;
		background-size: 100%;
		height: 14rem;
	}
	
	.self .self-information {
		height: 1.0rem;
		color: #FFF;
		padding: 1.7rem 1.2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.self .self-name {
		display: block;
		font-size: 1rem;
		font-weight: bold;
	}
	
	.self .self-msg .self-more {
		display: inline-block;
		width: 3rem;
		height: 0.9rem;
		line-height: 0.9rem;
		background: url(~@assets/img/self/arrows2.png);
		background-repeat: no-repeat;
		background-size: 0.25rem;
		background-position: right;
		color: rgba(255, 255, 255, 0.6);
	}
	
	.self .portrait {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		overflow: hidden;
		background-repeat: no-repeat;
		background-size: 100%;
	}
	
	.self .portrait-img {
		background-image: url(~@assets/img/default-portrait.png);
	}
	
	.self .zhima {
		/* padding: 1rem 1rem 1.5rem 1rem; */
		width: 100%;
		height: 10rem;
		margin: 0 auto;
		background-image: url(~@assets/img/self/zhimaCredit.png);
	}
	
	.self .zhima-credit {
		padding: 1rem 0 0 2rem;
	}
	
	.self .limit {
		font-size: 0.7rem;
		color: #333333;
		font-weight: bold;
	}
	
	.self .zhima-price {
		color: #3E6D78;
		font-size: 0.8rem;
		font-weight: bold;
	}
	
	.self .zhima-price .price {
		font-size: 1.7rem;
	}
	
	.self .zhima-rent {
		color: #999;
		font-size: 0.6rem;
		margin-top: 1.2rem;
		height: 1.4rem;
		line-height: 1.4rem;
		display: flex;
		justify-content: space-between;
	}
	
	.self .zhima-rent .rent,
	.self .zhima-rent .credit-limit {
		display: inline-block;
	}
	.self .zhima-rent .credit-limit1{
		background-position: 3.7rem center;
	}
	.self .zhima-rent .rent {
		/* width: 7.2rem; */
	}
	
	.self .credit-limit {
		width: 3rem;
		height: 1.5rem;
		line-height: 1.5rem;
		text-align: center;
		background-color: #3ED8C4;
		color: #fff;
		border-radius: 0.7rem;
		/*float: right;*/
		margin-right: 2rem;
		padding: 0 0.8rem;
		background-position:3.8rem center;
		background-image: url(~@assets/img/arrow-right-white.png);
		/*background-position: 3rem 0.39rem;
		background-size: 0.32rem;*/
		background-repeat: no-repeat;
	}
	
	
	.self .credit-limit-look {
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid #ddd;
		color: #bbb;
		background-image: url(~@assets/img/arrow-right-gray.png);
		background-position: 3.3rem center;
		background-size: 0.35rem;
		background-repeat: no-repeat;
	}
	
	.self .zhima-rent .bg-arrow-right {
		background-position: 2.7rem;
		background-size: 0.7rem;
	}
	
	.self .self-order-wrap {
		padding: 0 1.2rem;
		clear: both;
		/*margin-top: 0.2rem;*/
	}
	
	.self .order-title {
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.4rem;
	}
	
	.self .look-all {
		background-image: url(~@assets/img/self/arrows1.png);
		background-repeat: no-repeat;
		background-size: 0.4rem;
		background-position: right;
		background-position: 2.5rem 0.05rem;
	}
	
	.self .order-state {
		clear: both;
		/* width: 16.5rem; */
		display: flex;
		margin: 0 auto;
		justify-content: space-between;
		/* align-items: center; */
		padding: 0 0.8rem 0 .5rem;
	}
	
	.self .order-state li {
		text-align: center;
		/* width: 20%; */
		height: 2.5rem;
		color: #666;
	}
	
	.self .order-state .self-order-icon {
		width: 1.8rem;
		height: 1.8rem;
		background-repeat: no-repeat;
		background-size: 1.8rem;
		background-position: center;
		margin: 0 auto;
	}
	
	.self .order-state li:nth-of-type(1) .self-order-icon {
		background-image: url(~@assets/img/self/self-order-icon1.png);
	}
	
	.self .order-state li:nth-of-type(2) .self-order-icon {
		background-image: url(~@assets/img/self/self-order-icon2.png);
	}
	
	.self .order-state li:nth-of-type(3) .self-order-icon {
		background-image: url(~@assets/img/self/self-order-icon3.png);
	}
	
	.self .order-state li:nth-of-type(4) .self-order-icon {
		background-image: url(~@assets/img/self/self-order-icon4.png);
	}
	
	.self .order-state li:nth-of-type(5) .self-order-icon {
		background-image: url(~@assets/img/self/self-order-icon5.png);
	}
	
	.self .order-list-num {
		position: relative;
	}
	
	.self .order-list-num span {
		position: absolute;
		right: -0.8rem;
		top: -0.1rem;
		display: inline-block;
		border-radius: 50%;
		text-align: center;
		line-height: 0.6rem;
		font-size: 0.5rem;
		min-width: 0.6rem;
		height: 0.6rem;
		background: #E6361F;
		color: #fff;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding: 0 0.1rem;
	}
	
	.self .mine-list {
		margin-top: 1rem;
		padding: 0 1.2rem;
	}
	
	.self .mine-list li div {
		display: flex;
		height: 2.7rem;
		/* width: 16.5rem; */
		/* line-height: 2.7rem; */
		margin: 0 auto;
		font-size: 0.7rem;
		/*border-top: 1px solid #EEEEEE;*/
		/*background-image: url(~@assets/img/self/arrows1.png);
	background-repeat: no-repeat;
	background-size: 0.4rem 0.6rem;
	background-position: right 50%;*/
		position: relative;
	}
	
	.self .mine-list li span {
		/*display: inline-block;*/
	}
	.self .mine-list li div .line-normal {
		position: absolute;
		left: 0;
		bottom: 0;
	}
	.self .mine-list li div .line-normal-top {
		position: absolute;
		left: 0;
		top: 0;
	}
	.self .mine-title {
		width: 3.2rem;
		/* text-align: center; */
		height: 2.7rem;
		line-height: 2.7rem;
		margin-left: 0.5rem;
	}
	
	.self .mine-right {
		position: absolute;
		right: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
	}
	
	.self .mine-icon {
		width: 1.5rem;
		height: 2.7rem;
		/* margin-top: 0.7rem; */
		background-repeat: no-repeat;
		background-size: 1.5rem;
		background-position: center;
	}
	
	.self .mine-list li:nth-of-type(1) .mine-icon {
		background-image: url(~@assets/img/self/mine-line1.png);
	}
	
	.self .mine-list li:nth-of-type(2) .mine-icon {
		background-image: url(~@assets/img/self/mine-line2.png);
	}
	
	.self .mine-list li:nth-of-type(3) .mine-icon {
		background-image: url(~@assets/img/self/mine-line3.png);
	}
	/*.self .mine-list li:nth-of-type(4) .mine-icon {
	background-image: url(~@assets/img/self/mine-line4.png);
}*/
	
	.self .mine-list li:nth-of-type(4) .mine-icon {
		background-image: url(~@assets/img/self/mine-line5.png);
	}
	/* } */
</style>