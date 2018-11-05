<template>
	<div v-cloak class="divideBill-page public-card-page">
		<div v-if="mainData.orderNumber" class="public-padding-v">
			<div class="bg-white radius-1 divideBill-content">
				<div class="public-card-content public-padding-v relative">
					<div class="divideBill-head text-center">
						<p class="font-bold">第{{mainData.payCycle}}期账单</p>
						<div v-if="mainData.paymentState == 'Y'" class="price-wrap font-bold active bg-green inline-block"></div>
						<div v-else class="price-wrap font-bold">
							<span class="icon font-16 vertical-middle">¥&nbsp;</span>
							<span class="refundAmount font-26 vertical-middle">{{mainData.needPayAmount}}</span>
							<span v-if="mainData.isOverdue == 1" class="public-tag-red font-white font-10 vertical-middle">已逾期</span>
						</div>
						<p v-if="mainData.paymentState == 'Y'" class="font-12">本期租金已支付</p>
						<p v-else class="font-12" :class="{'font-green':mainData.isOverdue != 1}">请于{{mainData.instalmentPayDate | formatTime2}}之前支付</p>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div class="title display-flex-between">
						<p class="font-bold">本期明细</p>
						<span v-if="mainData.isOverdue == 1" class="public-arrow-right font-12" @click="goOverdueBill">查看</span>
					</div>
					<div class="item display-flex-between font-grey font-12">
						<p class="font-bold">含租金</p>
						<p>{{mainData.totalOverdueAmount | formatMoney}}</p>
					</div>
					<div v-if="mainData.overdueAmount > 0" class="item display-flex-between font-grey font-12">
						<p class="font-bold">含滞纳金</p>
						<p>{{mainData.overdueAmount | formatMoney}}</p>
					</div>
					<div class="item display-flex-between font-grey font-12">
						<p class="font-bold">期数</p>
						<p>共{{mainData.includeCycle}}期</p>
					</div>
					<div v-if = "mainData.paymentState == 'N'" class="btn bg-blue font-white public-lineheight font-bold text-center" @click="pay">立即支付</div>
				</div>
			</div>
			<div class="divideBill-foot bg-white public-padding-v">
				<p class="title font-lightGray">账单总览</p>
				<div class="list">
					<div class="item display-flex-between flex-align-center" @click="goOrderBill">
						<span class="font-bold">总账单</span>
						<p class="public-arrow-right font-12 font-grey">{{mainData.allPayCycle * mainData.amount | formatMoney}}({{mainData.allPayCycle}}期)</p>
					</div>
					<div class="item display-flex-between flex-align-center">
						<span class="font-bold">已支付账期</span>
						<p class="font-12 font-grey">{{mainData.yetCycle}}期</p>
					</div>
					<div class="item display-flex-between flex-align-center">
						<span class="font-bold">未支付账期</span>
						<p class="font-12 font-grey">{{mainData.allPayCycle-mainData.yetCycle}}期</p>
					</div>
				</div>
				<div class="btn public-lineheight text-center" @click="goOrderBill('wait')">提前还款</div>
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
	  	}
  	},
  	mounted(){
		var that = this;
		that.askData.orderNumber = that.$route.query.orderNo;
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.longRectOrderDetailToBill, that.askData).then((res)=> {
				that.mainData = res.details;
			})
		},
		goOrderBill(flag){
			var that = this;
			if(flag == 'wait'){
				that.$router.push({path: '/orderBill',query: {orderNumber:that.askData.orderNumber}});
			}else{
				that.$router.push({path: '/orderBill',query: {orderNo:that.askData.orderNumber}});
			}
		},
		pay(){
			var that = this;
			that.$router.replace({path: '/pay',query: {orderNo:that.askData.orderNumber,rentPayType:'divide',instalmentId:that.mainData.instalmentId}});
		},
		goOverdueBill(){
			var that = this;
			localStorage.setItem('billData',JSON.stringify(that.mainData));
			that.$router.push({path: '/overdueBill'});
		}
	}
}
</script>

<style>
.divideBill-page{
	padding-bottom: 2rem;
}
.divideBill-page .divideBill-head {
	padding: 1rem 0 0.7rem 0;
}
.divideBill-page .divideBill-head  .refundAmount{
	font-size: 1.7rem;
}
.divideBill-page .divideBill-head  .price-wrap{
	margin-top: 0.4rem;
	margin-bottom: 0.2rem;
}
.divideBill-page .divideBill-head .price-wrap.active{
	margin-top: 0.7rem;
	width: 1.9rem;
	height: 1.9rem;
	border-radius: 100%;
	background-image:url(~@assets/img/right-white.png) ;
	background-repeat:no-repeat ;
	background-size:60% ;
	background-position:center ;
}
.divideBill-page .divideBill-head .price-wrap .icon{
	position: relative;
	bottom: -0.3rem;
}
.divideBill-page .divideBill-content{
	padding-bottom: 1.5rem;
}
.divideBill-page .divideBill-content .title{
	margin-bottom: 0.7rem;
	line-height: 1rem;
}
.divideBill-page .divideBill-content .item{
	padding-bottom: 0.5rem;
}
.divideBill-page .divideBill-content .btn{
	margin-top: 1.2rem;
	box-shadow: 0 0.2rem 0.9rem rgba(54,100,110,0.3);
}
.divideBill-page .line-dashed-wrap{
	margin: 1rem 0;
}
.divideBill-page .divideBill-foot{
	margin-top: 0.6rem;
	padding-top: 1rem;
	padding-bottom: 1.5rem;
}
.divideBill-page .divideBill-foot .title{
	margin-bottom: 0.2rem;
}
.divideBill-page .divideBill-foot .list .item{
	padding: 0.65rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.divideBill-page .divideBill-foot .list .item:last-child{
	border: none;
}
.divideBill-page .divideBill-foot .btn{
	width: 7.5rem;
	border: 0.05rem solid #333333;
	margin-top: 1rem;
	margin: 1rem auto 0 auto;
}
</style>