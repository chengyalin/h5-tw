<template>
	<div v-cloak v-if="mainData.orderNumber" class="refundBill-page public-card-page">
		<div class="public-padding-v">
			<div class="bg-white radius-1">
				<div class="public-card-content public-padding-v relative">
					<div class="refundBill-head text-center">
						<p class="font-bold">退回金额</p>
						<div v-if="mainData.refundState == '已完成'" class="price-wrap font-bold">
							<span class="font-16">¥ </span>
							<span class="refundAmount font-26">{{mainData.refundAmount}}</span>
						</div>
						<p v-else class="price-wrap font-26 font-bold">待核算</p>
						<p class="font-12">待交易完成，金额会退回至你支付账户</p>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div class="refundBill-content">
						<div class="deposit-wrap display-flex-between flex-align-center">
							<div class="font-bold">
								<span>押金</span>
								<span class="public-tag-black font-white font-10">可退</span>
							</div>
							<span class="font-bold">{{mainData.depositAmount | formatMoney}}</span>
						</div>
						<div class="display-flex-between flex-align-center">
							<span class="font-bold">支付金额</span>
							<span class="font-bold">{{mainData.totalAmount | formatMoney}}</span>
						</div>
						<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>租金</span>
							<span v-if="mainData.rentType == '短租'">{{mainData.originalRent | formatMoney}}</span>
							<span v-else>{{mainData.monthRent | formatMoney}}x{{mainData.rentCycle}}期</span>
						</div>
						<div v-if="mainData.partsAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>配件</span>
							<span>{{mainData.partsAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.insuranceAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>安心享</span>
							<span>{{mainData.insuranceAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.couponAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>优惠券</span>
							<span>- {{mainData.couponAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.activityCouponAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>活动优惠</span>
							<span>- {{mainData.activityCouponAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.reletAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>续租费用</span>
							<span>{{mainData.reletAmount | formatMoney}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="foot bg-white radius-1 public-card-content public-padding-v">
				<div class="product-wrap clearfix">
					<div class="content float-left">
						<p class="name font-bold line-ellipsis">{{mainData.productName}}</p>
						<div v-if="mainData.rentType == '短租'">
							<div class="point-item font-grey font-12 relative clearfix">
								<p class="vertical-middle">{{mainData.beginDate | formatTime2}}-{{mainData.endDate | formatTime2}} ({{mainData.time}}{{mainData.reletDay == 0?'':' + '+mainData.reletDay}}天)</p>
								<span class="font-BBB float-right">×{{mainData.rentTotal}}</span>
							</div>
						</div>
						<div v-else>
							<div class="point-item font-grey font-12 relative long">
								<p class="vertical-middle">{{mainData.skuName}}</p>
							</div>
						</div>
					</div>
					<div class="float-right text-right">
						<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+ mainData.imageSrc +')'}"></div>
					</div>
				</div>
				<p class="order-number font-12 font-BBB">订单编号：{{mainData.orderNumber}}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
export default {
	data () {
  		return {
  			askData:{},
  			mainData:{},
  			item:{}
	  	}
  	},
  	mounted(){
		var that = this;
		that.askData.orderNumber = that.$route.query.orderNumber;
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoRefundDetail, that.askData).then((res)=> {
				that.mainData = res.details;
			})
		},
	}
}
</script>

<style>
.refundBill-page .refundBill-head{
	padding: 1rem 0 0.7rem 0;
}
.refundBill-page .refundBill-head .refundAmount{
	font-size: 1.7rem;
}
.refundBill-page .refundBill-head .price-wrap{
	margin-top: 0.4rem;
	margin-bottom: 0.2rem;
}
.refundBill-page .line-dashed-wrap{
	margin: 1rem 0;
}
.refundBill-page .refundBill-content{
	padding-top: 0.3rem;
	padding-bottom: 1.8rem;
}
.refundBill-page .deposit-wrap{
	margin-bottom: 0.6rem;
}
.refundBill-page .small-item{
	margin-top: 0.2rem;
}
.refundBill-page .product-wrap{
	border-bottom: 0.05rem dashed #D8D8D8;
}
.refundBill-page .foot{
	margin-top: 0.4rem;
}
.refundBill-page .foot .order-number{
	padding: 0.5rem 0;
}
</style>