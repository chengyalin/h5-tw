<template>
	<div v-cloak v-if="mainData.allPayCycle" class="divideBill-page public-card-page">
		<div class="public-padding-v">
			<div class="bg-white radius-1 divideBill-content">
				<div class="public-card-content public-padding-v relative">
					<div class="divideBill-head text-center">
						<p class="font-bold">第{{mainData.payCycle}}期账单明细</p>
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
					<div class="display-flex-between">
						<p class="title font-lightGray font-bold">本期明细</p>
					</div>
					<ul class="orderBill-list" v-if="mainData.historyOverDueInfo && mainData.historyOverDueInfo.length">
						<li v-for="(item,index) in mainData.historyOverDueInfo" class="display-flex-between flex-align-center">
							<div>
								<div>
									<span :class="{'font-green':item.waitFlag && item.paymentState == 'N','font-red':item.isOverdue == 1}">第{{item.payCycle}}期&nbsp;</span>
									<span v-if="item.isOverdue == 1" class="public-tag-red font-white public-tag-small font-10">已逾期</span>
									<span v-else-if="item.paymentState == 'Y'" class="public-tag-gray font-white public-tag-small font-10">已支付</span>
									<span v-else-if="item.waitFlag" class="public-tag-green font-white  public-tag-small font-10">待支付</span>
									<span v-else class="public-tag-darkGreen font-white font-10">未支付</span>
								</div>
								<p class="time font-12 font-BBB">{{item.instalmentPayDate | formatTime5}}</p>
							</div>
							<div class="text-right" :class="{'public-arrow-right':askData.orderNo}">
								<p class="font-bold">{{item.monthlyRent * 1 + item.overdueFine * 1 | formatMoney}}</p>
								<p v-if="item.overdueFine > 0" class="font-12 font-lightGray">(含滞纳金{{item.overdueFine | formatMoney}})</p>
							</div>
						</li>
					</ul>
					<div v-if = "mainData.paymentState == 'N'" class="btn bg-blue font-white public-lineheight font-bold text-center" @click="pay">立即支付</div>
				</div>
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
		//that.askData.instalmentId = that.$route.query.instalmentId;
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			if(localStorage.getItem('billData')){
				that.mainData = JSON.parse(localStorage.getItem('billData'));
			}
			/*
			network(CONFIG.longRectQueryBillDetailRest, that.askData).then((res)=> {
				var details = res.details;
				that.mainData = details;
			})
			*/
		},
		pay(){
			var that = this;
			that.$router.replace({path: '/pay',query: {orderNo:that.mainData.orderNumber,rentPayType:'divide',instalmentId:that.mainData.instalmentId}});
			//that.$router.replace({path: '/pay',query: {orderNo:that.mainData.orderNumber,rentPayType:'divide',payAmount:that.mainData.amount * 1 + that.mainData.totalOverdueAmount * 1,instalmentId:that.askData.instalmentId}});
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
.divideBill-page .orderBill-list{
	padding-bottom: 1.2rem;
}
.divideBill-page .orderBill-list.active{
	padding-bottom: 2rem;
}
.divideBill-page .orderBill-list li{
	padding: 0.5rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.divideBill-page .orderBill-list li:last-child{
	border: none;
}
.divideBill-page .orderBill-list li .time{
	margin-top: 0.1rem;
}
.divideBill-page .orderBill-list li .public-arrow-right{
	padding-right: 0.7rem;
}
.divideBill-page .orderBill-list .title{
	margin-bottom: 0.4rem;
}
.divideBill-page .orderBill-list .item{
	margin-bottom:0.3rem ;
}
.divideBill-page .orderBill-list .price-wrap{
	padding: 1.4rem 0;
}
.divideBill-page .orderBill-list .price-wrap .icon{
	position: relative;
	bottom: -0.1rem;
}
.divideBill-page .orderBill-list .line{
	margin-top: 0.7rem;
	margin-bottom: 0.7rem;
}

</style>