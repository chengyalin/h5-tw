<template>
	<div class="serviceSuccess has-footer has-footer-iphoneX">
		<!--
		<div class="applyCancel-title">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">{{refundType == 1?'申请退款': mainData.refundType}}</p>
			<p class="font-blue font-14" @click="chat">客服</p>
		</div>
		-->
		<div class="text-center service-state bg-white">
			<p class="font-14 font-darkGray" v-if="state == 1">我们会及时为你处理，请耐心等候</p>
			<p class="font-14 font-darkGray" v-if="state == 2">订单通过审核，有任何疑问请咨询客服</p>
			<p class="font-14 font-darkGray" v-if="state == 3">申请退款成功，有任何疑问请咨询客服</p>
			<p class="font-12 font-BBB">订单审核通过后，退款将退还至原支付账户</p>
			<div class="service-progress">
				<span class="state state1 bg-contain" v-if="state == 1"></span>
				<span class="state state2 bg-contain" v-if="state == 2"></span>
				<span class="state state3 bg-contain" v-if="state == 3"></span>
			</div>
		</div>
		
		<div class="serviceSuccess-detail">
			<div class="product-list" >
				<div class="product-list-left">
					<p class="font-14 font-darkGray line-ellipsis">{{mainData.productName}}</p>
					<p class="font-12 font-grey sku-name" v-if = "mainData.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ mainData.skuName }} <span class="float-right">x{{ mainData.rentTotal }}</span></p>
					<p class="font-12 font-grey sku-name" v-if = "mainData.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
						{{ mainData.beginDate | formatTime2}}-{{mainData.endDate | formatTime2}}  （{{mainData.time}}{{mainData.reletDay == 0? '':'+'+mainData.reletDay}}天）
						<span class="float-right">x{{ mainData.rentTotal }}</span>
					</p>
				</div>
				<p class="product-list-right bg-cover" :style="{'background-image':'url('+mainData.imageSrc+')'}"></p> 
			</div>
			<span class="line-normal"></span>
			<p class="refund-item font-darkGray font-14" v-if="mainData.refundType == '退货退款' || mainData.refundType == '申请退押金' || mainData.refundType == '申请退款' || mainData.refundType == '支付宝小程序退租金'">退款总额 <span class="float-right price">￥{{ mainData.refundRent }}</span></p>
			<span class="line-normal"></span>
			<p class="refund-item font-darkGray font-14">售后类型 <span class="float-right font-grey">{{ mainData.refundType }}</span></p>
			<span class="line-normal"></span>
			<p class="refund-item font-darkGray font-14">退款原因<span class="float-right font-grey">{{mainData.serviceReason}}</span></p>
			<span class="font-12 font-grey reason">{{ mainData.refundDesc }}</span><br />
			<!--<span class="font-12 font-grey reason1">一收到游戏机就无法开机，怀疑是电池出问题。</span>-->
			<span class="serviceImage bg-cover bg-buffer" v-for="(item,index) in mainData.serviceImage" :style="{'background-image':'url('+item+')'}"></span>
			<span class="line-normal"></span>
			<div class="order-time">
				<p class="font-12 font-BBB">订单编号：{{ mainData.orderNumber }}</p>
				<p class="font-12 font-BBB">申请时间：{{ mainData.refundDatetime | formatTime4}}</p>
			</div>
		</div>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white">
			<span class="bg-blue text-center font-white  public-lineheight block"@click="chat">联系客服</span>
		</div>
	</div>
</template>

<script>
import { publicChat , getMapSendDay } from '@assets/js/mUtils';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';

export default {
	data () {
  		return { 
  			state: '',
  			mainData:{
        		serviceImage:[]
        	},
        	refundType: ''
  		}
  	},
  	mounted(){
  		var that = this
  		var orderNumber = that.$route.query.orderNumber
		that.state = that.$route.query.state
		that.refundType = that.$route.query.refundType
//		that.type = that.$route.query.type
		network(CONFIG.orderInfoRefundInfo, {orderNumber: orderNumber}).then((res) => {
			if (res.head.code == 0) {
				that.mainData = res.details;
				that.mainData.serviceImage = that.mainData.serviceImage.length?that.mainData.serviceImage.split(","):[];
				
			}
		})
  	},
  	methods: {
  		goBack(){
  			history.go(-1)
  		},
  		chat(){
			var that = this;
			publicChat();
		},
  	},

	components: {
	}
}
</script>

<style>
.serviceSuccess .applyCancel-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	background: #fff;
	align-items: center;
	justify-content: space-between;
}
.serviceSuccess .applyCancel-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.serviceSuccess .service-state {
	margin-top: 1px;
	padding-top: 1.4rem;
	height: 8.2rem;
	margin-bottom: 0.4rem;
}
.serviceSuccess .service-progress {
	margin-top: 1.2rem;
}
.serviceSuccess .service-progress .state {
	width: 13.8rem;
	height: 2rem;
	display: inline-block;
}
.serviceSuccess .service-progress .state1 {
	background-image: url(~@assets/img/self/serviceSuccess-state1.png);
}
.serviceSuccess .service-progress .state2 {
	background-image: url(~@assets/img/self/serviceSuccess-state2.png);
}
.serviceSuccess .service-progress .state3 {
	background-image: url(~@assets/img/self/serviceSuccess-state3.png);
}
.serviceSuccess-detail {
	padding: 0 0.9rem;
	background: white;
}
.serviceSuccess-detail .refund-item {
	height: 2.5rem;
	line-height: 2.5rem;
}
.serviceSuccess-detail .refund-item .price {
	color: #E6361F;
}
.serviceSuccess-detail .reason {
	display: inline-block;
	margin-bottom: 4.7rem;
}
.serviceSuccess-detail .reason1 {
	display: inline-block;
	margin-bottom: 3.5rem;
}
.serviceSuccess-detail .order-time {
	padding: 0.5rem 0;	
}
.serviceSuccess .product-list {
	/*width: 17rem;*/
	margin: 0 auto;
	padding: 0.8rem 0;
}

.serviceSuccess .product-list-right {
	width: 2.6rem;
	height: 2.6rem;
}
.serviceSuccess .product-list-left {
	width: 12.6rem;
}
.serviceSuccess .product-list {
	display: flex;
	justify-content: space-between;
}
.serviceSuccess .product-list .sku-name {
	margin-left: 0.7rem;
	position: relative;
	margin-top: 0.3rem;
}
.serviceSuccess .product-list .circle {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	margin-right: 0.2rem;
	position: absolute;
	left: -0.7rem;
	top: 0.15rem;
	background-image: url(~@assets/img/circle-gray.png);
}
.serviceSuccess  .serviceImage {
	width: 4rem;
	height: 4rem;
	display: inline-block;
	margin-right: 0.3rem;
}
</style>
