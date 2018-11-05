<template>
	<div v-if="mainData.orderNo" class="paySuccessHuabei-page public-card-page has-footer">
		<div class="public-padding-v">
			<div class="bg-white radius-1">
				<div class="public-card-content public-padding-v relative">
					<div v-if="mainData.isPayDeposit == 'Y'" class="step-content text-center">
						<img class="image" src="~@assets/img/paySuccess-person.png"/>
						<p class="state font-20 font-bold font-blue">预约成功！</p>
						<p class="font-12">仓库小哥正在积极为你安排发货</p>
						<img class="step" src="~@assets/img/paySuccessHuabei-step2.png"/>
					</div>
					<div v-else class="step-content text-center">
						<p class="font-20 font-bold">第2步: 支付押金</p>
						<p v-if="mainData.zmAmount == 0" class="tip font-12">支付剩余押金，免审核极速发货</p>
						<p v-else class="tip font-12">请继续支付押金完成预约，已信用减免{{mainData.zmAmount | formatMoney}}</p>
						<div class="amount-wrap font-bold font-blue">
							<span class="mark relative font-20">¥</span>
							<span class="amount">{{order.depositAmount | formatInt}}</span>
							<span class="font-20">{{order.depositAmount | formatDecimal}}</span>
						</div>
						<img class="step" src="~@assets/img/paySuccessHuabei-step.png"/>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div class="product-wrap clearfix">
						<p class="title font-lightGray font-12">订单商品</p>
						<div class="content float-left">
							<p class="name font-bold line-ellipsis">{{order.productName}}</p>
							<div>
								<div class="point-item font-grey font-12 relative long">
									<p class="vertical-middle">{{order.skuName}}</p>
								</div>
							</div>
						</div>
						<div class="float-right text-right">
							<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+ order.imageSrc +')'}"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="mainData.isPayDeposit == 'Y'" class="foot bg-white fixed left bottom right display-flex-between public-lineheight font-bold public-padding-v">				
			<div class="btn font-blue bg-white text-center" @click="goIndex">
				返回首页
			</div>
			<div class="btn bg-blue font-white text-center" @click="goOrderDetail">
				查看订单
			</div>
		</div>
		<router-link v-else replace :to="{path: '/pay', query: {orderNo:mainData.orderNo}}" class="fixed left bottom right bg-blue font-white text-center public-lineheight font-bold">去支付 {{order.depositAmount | formatMoney}}</router-link>
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
  			order:{}
	  	}
  	},
  	mounted(){
  		var that = this;
		var query = that.$route.query;
		if(query.hbIsPayRent){
			that.hbIsPayRent = query.hbIsPayRent;
		}
		if(query.hbIsDeposit){
			that.hbIsDeposit = query.hbIsDeposit;
		}
		if(query.orderNo){
			that.askData.orderNo = query.orderNo;
			that.initData();
		}
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoDetailsInfo, that.askData).then((res) => {
  				that.mainData = res.details;
  				that.order = res.details.orders[0];
  				if(that.mainData.isPayDeposit == 'Y'){
  					document.title = '预约成功'
  				}
			});
		},
		goIndex(){
			var that = this;
			that.$router.replace({path: '/home'});
		},
		goOrderDetail(){
			var that = this;
			that.$router.replace({path: '/orderDetails',query: { orderNo:that.askData.orderNo}});
		}
	}
}
</script>

<style>
.paySuccessHuabei-page .step-content{
	padding: 1.5rem 0;
}
.paySuccessHuabei-page .step-content .tip{
	margin-top: 0.3rem;
	margin-bottom: 1.3rem;
}
.paySuccessHuabei-page .step-content .state{
	margin-bottom: 0.3rem;
}
.paySuccessHuabei-page .step-content .mark{
	top: -1.3rem;
	left: -0.2rem;
}
.paySuccessHuabei-page .step-content .amount-wrap{
	line-height:1;
	padding-bottom: 1rem;
}
.paySuccessHuabei-page .step-content .amount{
	font-size: 2.5rem;
}
.paySuccessHuabei-page .step-content .step{
	width: 12.3rem;
	height: 2.8rem;
	margin-top: 2.9rem;
}
.paySuccessHuabei-page .step-content .image{
	width: 5.5rem;
	height: 4.2rem;
	margin-bottom: 0.9rem;
}
.paySuccessHuabei-page .public-card-content .product-wrap{
	padding-top: 1.1rem;
	padding-bottom: 1.8rem;
}
.paySuccessHuabei-page .public-card-content .product-wrap .title{
	margin-bottom: 0.4rem;
}
.paySuccessHuabei-page .foot {
	padding-top: 0.4rem;
	padding-bottom: 0.4rem;
}
.paySuccessHuabei-page .foot .btn{
	width: 8.1rem;
	border-radius: 0.1rem;
	border: 0.05rem solid #36646E;
}
</style>