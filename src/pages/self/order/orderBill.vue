<template>
	<div v-cloak v-if="listData.length" class="orderBill-page public-card-page has-footer">
		<div class="public-padding-v">
			<div class="bg-white radius-1">
				<div class="public-card-content public-padding-v relative">
					<div class="refundBill-head text-center">
						<p class="font-bold">{{listData[listData.length - 1] && listData[listData.length - 1].paymentState == 'Y'?'全部还清':'总待还金额'}}</p>
						<div v-if="listData[listData.length - 1].paymentState == 'Y'" class="price-wrap font-bold active bg-green inline-block"></div>
						<div v-else class="price-wrap font-bold">
							<span class="font-16">¥ </span>
							<span class="refundAmount font-26">{{overdueAmount * 1 + totalAmount * 1}}</span>
						</div>
						<div class="font-12">
							<span>合计{{listData.length}}期 </span>
							<span v-if="overdueAmount > 0">(含{{overdueCount}}期滞纳金{{overdueAmount | formatMoney}})</span>
						</div>
					</div>
					<div class="line-dashed-wrap relative"></div>
				</div>
				<ul class="orderBill-list public-padding-v" :class="{'active':askData.orderNo}">
					<li v-for="(item,index) in listData" class="display-flex-between flex-align-center" @click="billShow(item)">
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
			</div>
		</div>
		<div v-if="listData[listData.length - 1].paymentState == 'N'" class="fixed left bottom right public-lineheight bg-blue font-white text-center font-bold" @click="pay">提前还款</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="billFlag">
				<div class="public-popup-shadow" @click="billFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 relative font-bold">
						第{{bill.payCycle}}期账单明细
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="orderBill-list public-padding-v font-12">
						<div class="price-wrap font-bold text-center font-blue" :class="{'font-red':bill.isOverdue == 1,'font-green':bill.waitFlag && bill.paymentState == 'N','font-darkGray':bill.paymentState == 'Y'}">
							<span class="icon font-16 vertical-middle">¥ </span>
							<span class="refundAmount vertical-middle">{{bill.monthlyRent * 1 + bill.overdueFine * 1}}</span>
							<span v-if="bill.isOverdue == 1" class="public-tag-red public-tag-small font-white font-10 vertical-middle">已逾期</span>
							<span v-else-if="bill.paymentState == 'Y'" class="public-tag-gray font-white font-10 vertical-middle">已支付</span>
							<span v-else-if="bill.waitFlag" class="public-tag-green font-white font-10 vertical-middle">待支付</span>
							<span v-else class="public-tag-darkGreen font-white  public-tag-small font-10 vertical-middle">未支付</span>
						</div>
						<p class="title font-lightGray">包含以下部分</p>
						<div class="item display-flex-between">
							<span class="font-lightGray">月租金</span>
							<span>{{bill.monthlyRent | formatMoney}}</span>
						</div>
						<div class="item display-flex-between">
							<span class="font-lightGray">滞纳金</span>
							<span :class="{'font-red':bill.overdueFine > 0}">{{bill.overdueFine | formatMoney}}</span>
						</div>
						<div class="line line-normal"></div>
						<div class="item display-flex-between">
							<span class="font-lightGray">最迟还款日</span>
							<span>{{bill.instalmentPayDate | formatTime5}}</span>
						</div>
						<div class="item display-flex-between">
							<span class="font-lightGray">实际付款日</span>
							<span v-if="bill.paymentDate">{{bill.paymentDate | formatTime5}}</span>
							<span v-else>未支付</span>
						</div>
						<div class="item display-flex-between">
							<span class="font-lightGray">支付方式</span>
							<span >{{bill.paymentType?bill.paymentType:'未支付'}}</span>
						</div>
					</div>
					<div class="bg-blue font-white font-bold font-16 text-center public-lineheight" @click="billFlag = false">完成</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
export default {
	data () {
  		return {
  			askData:{},
  			listData:[],
  			totalAmount:0,
  			billFlag:false,
  			bill:{},
  			totalOverdueAmount:0,
  			overdueAmount:0,
  			overdueCount:0
	  	}
  	},
  	mounted(){
		var that = this;
		var query = that.$route.query;
		if(query.orderNo){
			that.askData.orderNo = query.orderNo;
			document.title = '总账单';
		}else if(query.orderNumber){
			that.askData.orderNumber = query.orderNumber;
		}
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			if(that.askData.orderNo){
				network(CONFIG.longRectQueryInstalmentBillsRest, that.askData).then((res)=> {
					var details = res.details;
					var sysTime = res.head.sysTime;
					var amount = 0;
					for(var i = 0;i < details.length;i++){
						var bill = details[i];
						if(bill.paymentState == 'N'){
							amount += (bill.monthlyRent * 1 + bill.overdueFine * 1);
						}
						if(i > 0 && bill.instalmentPayDate > sysTime && details[i-1].instalmentPayDate < sysTime){
							bill.waitFlag = true;
						}
						
					}
					that.totalAmount = amount.toFixed(2);
					that.listData = details;
				})
			}else{
				network(CONFIG.longRemainWaitPayBill, that.askData).then((res)=> {
					var details = res.details;
					that.totalAmount = details.totalAmount;
					that.totalOverdueAmount = details.totalOverdueAmount;
					that.overdueAmount = details.overdueAmount;
					if(details.instalments){
						var count = 0;
						details.instalments.map(item => {
							if(item.isOverdue == 1){
								count ++;
							}
						})
						that.overdueCount = count;
						that.listData = details.instalments;
					}
				})
			}
		},
		pay(){
			var that = this;
			var arr = [];
			that.listData.map(item => {
				arr.push(item.instalmentId)
			})
			var query = {
				orderNo:that.askData.orderNumber || that.askData.orderNo,
				rentPayType:'payRemain',
				instalmentId:arr.join(","),
				payAmount:that.overdueAmount * 1 + that.totalAmount * 1
			}
			that.$router.replace({path: '/pay',query: query});
		},
		billShow(item){
			var that = this;
			if(that.askData.orderNo){
				that.bill = item;
				that.billFlag = true
			}
		}
	}
}
</script>

<style>
.orderBill-page{
	padding-bottom: 4rem;
}
.orderBill-page .refundBill-head{
	padding: 1rem 0 0.7rem 0;
}
.orderBill-page .refundBill-head .refundAmount{
	font-size: 1.7rem;
}
.orderBill-page .refundBill-head .price-wrap{
	margin-top: 0.4rem;
	margin-bottom: 0.2rem;
}
.orderBill-page .refundBill-head .price-wrap.active{
	margin-top: 0.7rem;
	width: 1.9rem;
	height: 1.9rem;
	border-radius: 100%;
	background-image:url(~@assets/img/right-white.png) ;
	background-repeat:no-repeat ;
	background-size:60% ;
	background-position:center ;
}
.orderBill-page .line-dashed-wrap{
	margin: 1rem 0 0.4rem 0;
}
.orderBill-page .orderBill-list{
	padding-bottom: 1.2rem;
}
.orderBill-page .orderBill-list.active{
	padding-bottom: 2rem;
}
.orderBill-page .orderBill-list li{
	padding: 0.5rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.orderBill-page .orderBill-list li:last-child{
	border: none;
}
.orderBill-page .orderBill-list li .time{
	margin-top: 0.1rem;
}
.orderBill-page .orderBill-list li .public-arrow-right{
	padding-right: 0.7rem;
}
.orderBill-page .orderBill-list .title{
	margin-bottom: 0.4rem;
}
.orderBill-page .orderBill-list .item{
	margin-bottom:0.3rem ;
}
.orderBill-page .orderBill-list .price-wrap{
	padding: 1.4rem 0;
}
.orderBill-page .orderBill-list .price-wrap .icon{
	position: relative;
	bottom: -0.1rem;
}
.orderBill-page .orderBill-list .line{
	margin-top: 0.7rem;
	margin-bottom: 0.7rem;
}
.orderBill-page .public-popup .refundAmount{
	font-size: 1.7rem;
}
.orderBill-page .public-popup .orderBill-list .price-wrap .icon{
	position: relative;
	bottom: -0.3rem;
}
</style>