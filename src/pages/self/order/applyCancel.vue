<template>
	<div class="applyCancel">
		<div class="applyCancel-title">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">{{orderTitle=='取消订单'?'取消订单':'申请退款'}}</p>
			<p class="font-blue font-14" @click="chat">客服</p>
		</div>
		<div class="applyCancel-product">
			<ul>
				<li v-for="(item, index) in orders1" :key="item.id">
					<div class="product-list" >
						<div class="product-list-left">
							<p class="font-14 font-darkGray line-ellipsis">{{item.productName}}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ item.skuName }}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
								{{ item.beginDate | formatTime2}}-{{item.endDate | formatTime2}}  （{{item.time}}{{item.reletDay == 0?'':' + '+item.reletDay}}天）
								<span class="float-right">x{{ item.rentTotal }}</span>
							</p>
						</div>
						<p class="product-list-right bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}"></p>
					</div>
					<span class="line-normal"></span>
				</li>
				<li v-for="(item, index) in orders2" :key="item.id" v-if = "stateShow && !stateFlag">
					<div class="product-list" >
						<div class="product-list-left">
							<p class="font-14 font-darkGray line-ellipsis">{{item.productName}}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ item.skuName }}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
								{{ item.beginDate | formatTime2}}-{{item.endDate | formatTime2}}  （{{item.time}}{{item.reletDay == 0?'':' + '+item.reletDay}}天）
								<span class="float-right">x{{ item.rentTotal }}</span>
							</p>
						</div>
						<p class="product-list-right bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}"></p>
					</div>
					<span class="line-normal"></span>
					
				</li>
				<li>
					<div class="product-list" v-if = "orderTitle=='申请退款'">
						<div class="product-list-left">
							<p class="font-14 font-darkGray line-ellipsis">{{orders.productName}}</p>
							<p class="font-12 font-grey sku-name" v-if = "orders.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ orders.skuName }}</p>
							<p class="font-12 font-grey sku-name" v-if = "orders.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
								{{ orders.beginDate | formatTime2}}-{{orders.endDate | formatTime2}}  （{{orders.time}}{{orders.reletDay == 0?'':' + '+orders.reletDay}}天）
								<span class="float-right">x{{ orders.rentTotal }}</span>
							</p>
						</div>
						<p class="product-list-right bg-cover" :style="{'background-image':'url('+orders.imageSrc+')'}"></p>
					</div>
					<span class="line-normal"></span>
				</li>
			
			</ul>
			<div class="bg-white text-center font-12 font-lightGray unfold-packup-state" v-if = "stateShow">
				<p class="unfold public-arrow-right" v-if = "stateFlag" @click="stateFlag = !stateFlag">展开</p>
				<p class="packup public-arrow-right" v-else @click="stateFlag = !stateFlag">收起</p>
			</div>
		</div>
		<div class="applyCancel-reason">
			<p class="font-darkGray font-14">选择{{orderTitle=='取消订单'?'取消订单':'申请退款'}}原因</p>
			<ul>
				<li class="reason-item" v-for="(item, index) in reasons" :key="item.id">
					<p>
						<span class="select bg-contain" :class="{'check': checkedId == index}"  @click="changeSelect(index)"></span>
					 	{{item}}
					</p>
					 <span class="line-normal"></span>
				</li>
			</ul>
		</div>
		<div  class="applyCancel-explain" v-if="orderTitle == '申请退款'">
			<textarea placeholder=" 申请退款说明（100字以内）" v-model="askData.reason"  maxlength="100"></textarea>
		</div>
		<div class="font-14 bg-blue text-center footer font-white" @click="submitForm">
			提 交
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { publicChat , getMapSendDay } from '@assets/js/mUtils';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Filter } from '@assets/js/filter';

export default {
	data () {
  		return {
//			selectShow: false,
  			orders: {},
  			reasons: [],
  			checkedId: null,
  			askData:{
	        	cancelDesc:'',
	        	type: "",
	        	reason: ''
	       },
	       stateShow: false,
	       stateFlag: false,
	       orders1: [],
	       orders2: [],
	       type:'', //状态
	       orderTitle: ''
  			
  		}
  	},
  	mounted(){
  		var that = this
  		document.title = that.$route.query.title=='取消订单'?'取消订单':'申请退款';
  		if (that.$route.query.title == '申请退款') {
  			if (that.$route.query.orderNo) {
  				that.orders = JSON.parse(localStorage.getItem('orderCancel')).orders[0]
  			} else {
  				that.orders = JSON.parse(localStorage.getItem('orderCancel'))
  			}
  		} else {
  			that.askData.orderNo = that.$route.query.orderNo
  			that.orders = JSON.parse(localStorage.getItem('orderCancel'))
  			that.orders1 = that.orders.orders.slice(0, 2)
  			that.orders2 = that.orders.orders.slice(2, that.orders.orders.length)
  		}
  		
  		
  		
  		if (that.orders2.length) {
  			that.stateShow = true
  			that.stateFlag = true
  		}
  		
  		
  		that.askData.orderNumber = that.$route.query.orderNumber
  		that.orderTitle = that.$route.query.title
  		that.askData.type = that.$route.query.type
  		that.myInitData()
  	},
  	methods: {
  		goBack(){
  			history.go(-1)
  		},
  		chat(){
			var that = this;
			publicChat();
		},
  		myInitData(){
    		var that = this;
    		if (that.orderTitle == '取消订单') {
    			that.type = 4
    		} else if (that.orderTitle == '申请退款') {
    			that.type = 1
    		}
    		network(CONFIG.serviceInit,{type:that.type}).then((res) => {
		    	that.reasons = res.details.reasons;
			});
    	},
    	changeSelect(index){
    		var that = this
			that.checkedId = index
    	},
    	submitForm(){
    		var that = this 
    		var that = this;
    		if(that.checkedId == null){
    			Vue.toast('请选择取消订单的原因',{duration:1500})

    			return false
    		}
    		if (that.orderTitle == '申请退款') {
    			if(!that.askData.reason){
	    			Vue.toast('请填写退款说明',{duration:1500})
	    			return false
	    		};
    		}
    		
	        that.askData.cancelCause = that.reasons[that.checkedId];
	        var urlStr = that.orderTitle == '取消订单' ? CONFIG.orderInfoCancel : CONFIG.orderInfoApplyServiceOrRefund
    		network(urlStr, that.askData).then((res) => {
		    	if(res.head.code == 0){
		    		if (that.orderTitle == '取消订单') {
		    			history.go(-1);
		    		} else {
		    			that.$router.replace({path: '/self/serviceSuccess',query: {state: 1,refundType : 1, orderNumber: that.askData.orderNumber}});
		    		}
		    	}
			});
    	}
    	
  	},
	components: {
	}
}
</script>

<style>
.applyCancel-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	background: #fff;
	align-items: center;
	justify-content: space-between;
}
.applyCancel-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.applyCancel-product li {
	padding: 0.8rem 0.9rem 0;
	background: #fff;
}
.applyCancel .product-list {
	/*width: 17rem;*/
	margin: 0 auto;
	padding-bottom: 0.8rem;
}
.applyCancel li:last-of-type .line-normal {
	display: none;
}
.applyCancel .product-list-right {
	width: 2.6rem;
	height: 2.6rem;
}
.applyCancel .product-list-left {
	width: 12.6rem;
}
.applyCancel .product-list {
	display: flex;
	justify-content: space-between;
}
.applyCancel .product-list .sku-name {
	margin-left: 0.7rem;
	position: relative;
	margin-top: 0.3rem;
}
.applyCancel .product-list .circle {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	margin-right: 0.2rem;
	position: absolute;
	left: -0.7rem;
	top: 0.15rem;
	background-image: url(~@assets/img/circle-gray.png);
}
.applyCancel .unfold-packup-state {
	height: 2rem;
}
.applyCancel .unfold-packup-state p {
	width: 1.5rem;
	/*background: red;*/
	margin: 0 auto;
}
.applyCancel .unfold-packup-state .unfold {
	background-image: url(~@assets/img/arrow-down-gray.png);
	background-size: 0.5rem auto;
}
.applyCancel .unfold-packup-state .packup {
	background-image: url(~@assets/img/arrow-up-gray.png);
	background-size: 0.5rem auto;
}
.applyCancel-reason {
	padding: 0.8rem 0.9rem 1.1rem;
	margin: 0 auto;
	background: #fff;
	margin-top: 0.4rem;
	margin-bottom: 0.4rem;
}
.applyCancel-reason .reason-item p{
	height: 2.6rem;
	line-height: 2.6rem;
	display: flex;
	align-items: center;
	/*justify-content: flex-start;*/
}
.applyCancel-reason .reason-item .select {
	display: inline-block;
	width: 0.8rem;
	height: 0.8rem;
	margin-right: 0.5rem;
	border-radius: 50%;
	border: 1px solid #eee;
}
.applyCancel-reason .reason-item .check {
	background-image: url(~@assets/img/self/icon-select.png);
	border: none;
	width: 0.9rem;
	height: 0.9rem;
}
.applyCancel .footer {
	height: 2.2rem;
	line-height: 2.2rem;
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
} 
.applyCancel-explain {
	padding: 0.8rem 0.8rem;
	background: #fff;
	height: 4.5rem;
	margin-bottom: 2.2rem;
	
}
.applyCancel-explain textarea {
	border: none;
	width: 100%;
	height: 5rem;
	/*margin-left: 0.7rem;*/
	/*margin-top: 0.3rem;*/
}
</style>
