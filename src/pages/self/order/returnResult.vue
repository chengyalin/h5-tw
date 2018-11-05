<template>
	<div v-cloak class="returnResult-page has-footer">
		<div v-if="mainData.reservationType == 'SF'" class="returnResult-header bg-white">
			<ul v-if="mainData.reservationSuccess == 'Y'" class="step-list">
				<li class="type1 relative">
					预约取件
					<span class="point absolute"></span>
				</li>
				<li class="type1 relative">
					填写单号
					<span class="point absolute"></span>
				</li>
				<li class="type2 relative">
					产品寄回中
					<p class="font-12 font-lightGray">我们会在收到产品后为你处理订单</p>
					<span class="point absolute"></span>
				</li>
				<li class="relative font-lightGray">
					归还成功
					<span class="point absolute"></span>
				</li>
			</ul>
			<ul v-else class="step-list">
				<li class="type1 relative">
					预约取件
					<span class="point absolute"></span>
				</li>
				<li class="type2 relative">
					填写单号
					<p class="font-12 font-lightGray">请在快递上门取件后，填写快递单号</p>
					<span class="point absolute"></span>
				</li>
				<li class="relative font-lightGray">
					产品寄回中
					<span class="point absolute"></span>
				</li>
				<li class="relative font-lightGray">
					归还成功
					<span class="point absolute"></span>
				</li>
			</ul>
		</div>
		<div v-else-if="mainData.reservationType == 'SELF'" class="returnResult-header bg-white">
			<ul v-if="mainData.reservationSuccess == 'Y'" class="step-list">
				<li class="type1 relative">
					产品自还中
					<span class="point absolute"></span>
				</li>
				<li class="type2 relative">
					归还成功
					<p class="font-12 font-lightGray">待产品检测完毕后，押金将在48小时内退还</p>
					<span class="point absolute"></span>
				</li>
			</ul>
			<ul v-else class="step-list">
				<li class="type2 relative">
					产品自还中
					<p class="font-12 font-lightGray">请确保在租期结束前，将产品送还至所选网点</p>
					<span class="point absolute"></span>
				</li>
				<li class="relative font-lightGray">
					归还成功
					<span class="point absolute"></span>
				</li>
			</ul>
		</div>
		<div v-else class="returnResult-header bg-white">
			<!-- 所以根本没有这个状态是吗
			<ul v-if="mainData.reservationSuccess == 'Y'" class="step-list">
				<li class="type1 relative">
					填写单号
					<span class="point absolute"></span>
				</li>
				<li class="type1 relative">
					产品寄回中
					<span class="point absolute"></span>
				</li>
				<li class="type2 relative">
					归还成功
					<p class="font-12 font-lightGray">待产品检测完毕后，押金将在48小时内退还</p>
					<span class="point absolute"></span>
				</li>
			</ul>
			-->
			<ul class="step-list">
				<li class="type1 relative">
					填写单号
					<span class="point absolute"></span>
				</li>
				<li class="type2 relative">
					产品寄回中
					<p class="font-12 font-lightGray">我们会在收到产品后为你处理订单</p>
					<span class="point absolute"></span>
				</li>
				<li class="relative font-lightGray">
					归还成功
					<span class="point absolute"></span>
				</li>
			</ul>
		</div>
		<div v-if="mainData.reservationType == 'SF'" class="returnResult-content public-padding-v">
			<div class="returnResult-item">
				<p class="title">取件信息</p>
				<p class="font-lightGray">顺丰速运&nbsp;&nbsp;{{mainData.reservationDatetime}}</p>
			</div>
			<div class="returnResult-item">
				<p class="title">自还地址</p>
				<p class="h2 font-lightGray">{{mainData.selfName}}</p>
				<p class="h2 font-lightGray">{{mainData.reservationName}}&nbsp;&nbsp;{{mainData.reservationPhone}}</p>
				<p class="h2 font-lightGray">{{mainData.reservationAddress}}</p>
			</div>
		</div>
		<div v-else-if="mainData.reservationType == 'SELF'" class="returnResult-content public-padding-v">
			<div class="returnResult-item">
				<p class="title">自还时间</p>
				<p class="font-lightGray">{{mainData.reservationDatetime}}</p>
			</div>
			<div class="returnResult-item">
				<p class="title">自还地址</p>
				<p class="h2 font-lightGray">{{mainData.selfName}}</p>
				<p class="h2 font-lightGray">{{mainData.reservationName}}&nbsp;&nbsp;{{mainData.reservationPhone}}</p>
				<p class="h2 font-lightGray">{{mainData.reservationAddress}}</p>
			</div>
		</div>
		<div v-else class="returnResult-content public-padding-v">
			<div class="returnResult-item">
				<p class="title">寄回快递信息</p>
				<p class="font-lightGray">顺丰速运&nbsp;&nbsp;{{mainData.expressNumber}}</p>
			</div>
			<div class="returnResult-item">
				<p class="title">探物收件信息</p>
				<p class="h2 font-lightGray">{{mainData.reservationName}}&nbsp;&nbsp;{{mainData.reservationPhone}}</p>
				<p class="h2 font-lightGray">{{mainData.reservationAddress}}</p>
			</div>
		</div>
		<span v-if="mainData.reservationType == 'SF' && mainData.reservationSuccess == 'N'" class="fixed left bottom right bg-blue font-white text-center font-bold public-lineheight" @click="setExpressNumber">填写单号</span>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import packList from '@components/packList';
import { setBodyColor } from '@assets/js/mUtils';
export default {
	data () {
  		return {
  			askData:{},
  			mainData:{},
  			orderNumbers:""
	  	}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.askData.orderNumber = that.$route.query.orderNumber;
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoReservationInfo, that.askData).then((res)=> {
				that.mainData = res.details.reservation;
				var orders = res.details.orders;
				var orderNumbers = [];
				res.details.orders.map(item => {
					orderNumbers.push(item.orderNumber);
				})
				that.orderNumbers = orderNumbers.join(",");
			})
		},
		setExpressNumber(){
			var that = this;
			that.$router.push({path: '/returnNumber',query: { orderNumbers:that.orderNumbers,type:'sf'}});
		}
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.returnResult-page .returnResult-header{
	padding: 1rem;
	padding-left: 1.4rem;
	border-bottom: 0.4rem solid #fafafa;
}
.returnResult-page .returnResult-header .step-list li{
	padding: 0.55rem 0 0.55rem 0.9rem;
}
.returnResult-page .returnResult-header .step-list li:before,
.returnResult-page .returnResult-header .step-list li:after{
	content: '';
	position: absolute;
	width: 0.1rem;
	top: 0;
	bottom: 50%;
	left: 0;
	background: #DDDDDD;
}
.returnResult-page .returnResult-header .step-list li:after{
	top: 50%;
	bottom: 0;
}
.returnResult-page .returnResult-header .step-list li:first-child:before,
.returnResult-page .returnResult-header .step-list li:last-child:after{
	display: none;
}
.returnResult-page .returnResult-header .step-list li.type1:before,
.returnResult-page .returnResult-header .step-list li.type1:after,
.returnResult-page .returnResult-header .step-list li.type2:before{
	background: #3ED8C4;
}
.returnResult-page .returnResult-header .step-list li .point{
	left: -0.17rem;
	top: 50%;
	margin-top: -0.2rem;
	width: 0.2rem;
	height: 0.2rem;
	border: 0.1rem solid #DDDDDD;
	border-radius: 100%;
	background: #FFFFFF;
	z-index: 2;
}
.returnResult-page .returnResult-header .step-list li.type1 .point{
	border-color: #3ED8C4;
}
.returnResult-page .returnResult-header .step-list li.type2 .point{
	width: 0.9rem;
	height: 0.9rem;
	left: -0.4rem;
	margin-top: -0.45rem;
	border: none;
	background: #3ED8C4 url(~@assets/img/right-white.png) no-repeat center;
	background-size:66% ;
}
.returnResult-page .returnResult-content .returnResult-item{
	padding: 0.9rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.returnResult-page .returnResult-content .returnResult-item:last-child{
	border: none;
}
.returnResult-page .returnResult-content .returnResult-item .title{
	margin-bottom: 0.3rem;
}
.returnResult-page .returnResult-content .returnResult-item .h2{
	margin-bottom: 0.1rem;
}
</style>