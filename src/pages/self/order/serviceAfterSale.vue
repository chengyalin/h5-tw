<template>
	<div class="serviceAfterSale">
		<div class="applyCancel-title">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">申请退款</p>
			<p class="font-blue font-14" @click="chat">客服</p>
		</div>
		<div class="service-content">
			<div class="product-list" >
				<div class="product-list-left">
					<p class="font-14 font-darkGray line-ellipsis">{{order.productName}}</p>
					<p class="font-12 font-grey sku-name" v-if = "order.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ order.skuName }} <span class="float-right">x{{ order.rentTotal }}</span></p>
					<p class="font-12 font-grey sku-name" v-if = "order.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
						{{ order.beginDate | formatTime2}}-{{order.endDate | formatTime2}} （{{order.time}}{{order.reletDay == 0?'':' + '+order.reletDay}}天）
						<span class="float-right">x{{ order.rentTotal }}</span>
					</p>
				</div>
				<p class="product-list-right bg-cover" :style="{'background-image':'url('+order.imageSrc+')'}"></p>
			</div>
			<p class="wrap-list font-12"  @click="listFlagShow">查看包装清单</p>
			<p class="font-12 font-BBB">温馨提示：退货时请检查好你的包裹，确保将包装清单中的物件完整归还，以免因缺件产生二次快递费用。</p>
		</div>
		<div class="exchange">
			<p class="public-arrow-right exchange-title" :class="{'public-arrow-down': serviceRefundShow}" @click="serviceRefund">退货退款</p>
			<div class="exchange-content" v-if="serviceRefundShow" v-for ="(item, index) in reasons" :key="item.id">
				<p>
					<span class="exchange-checked" :class="{checked: selectId1 == index}" @click="selectId1 = index"></span>
					<span>{{item}}</span>
				</p>
				<span class="line-normal"></span>
			</div>
			
		</div>
		<div class="exchange font-14">
			<p class=" public-arrow-right exchange-title font-darkGray" :class="{'public-arrow-down': serviceExchangeShow}" @click="serviceExchange">退换产品</p>
			<div class="exchange-content font-grey" v-if = "serviceExchangeShow" v-for ="(item, index) in reasons" :key="item.id"> 
				<p>
					<span class="exchange-checked" :class="{checked: selectId2 == index}" @click="selectId2 = index"></span>
					<span>{{item}}</span>
				</p>
				<span class="line-normal"></span>
			</div>
		</div>
		<packList :packListData = "packListData" :listFlag = 'listFlag' @packListHidden="packListHidden"></packList>
		<div class="bg-blue font-white text-center font-14 netSubmit" @click="submit">下一步</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { publicChat , getMapSendDay } from '@assets/js/mUtils';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import packList from '@components/packList';

export default {
	data () {
  		return {
  			order: {},
  			reasons: [],
  			serviceRefundShow: false, // 退货退款
  			serviceExchangeShow: false, // 退换产品
  			type: '',
  			selectId1: null,
  			selectId2: null,
  			askData: {},
  			listFlag:false,
  			packListData:{},
  		}
  	},
  	mounted(){
  		var that = this 
  		that.order = JSON.parse(localStorage.getItem('serviceAfterSale'))
//		network(CONFIG.serviceInit,{type:type}).then((res) => {
//	    	that.reasons = res.details.reasons;
//		});
  	},
  	methods: {
  		goBack(){
  			history.go(-1)
  		},
  		chat(){
			var that = this;
			publicChat();
		},
		minData(){
			var that = this
			network(CONFIG.serviceInit,{type:that.type}).then((res) => {
		    	that.reasons = res.details.reasons;
			});
		},
		// 退货退款
		serviceRefund(){
			var that = this 
			that.selectId1 = null
			that.serviceRefundShow = !that.serviceRefundShow
			if (that.serviceRefundShow) {
				that.type = 2
				that.serviceExchangeShow = false
			}
			that.minData()
		},
		// 退还产品
		serviceExchange(){
			var that = this
			that.selectId2 = null
			that.serviceExchangeShow = !that.serviceExchangeShow
			if (that.serviceExchangeShow) {
				that.type = 3
				that.serviceRefundShow = false
			}
			that.minData()
		},
		// 查看包装清单
		listFlagShow(){
			var that = this;
			var packListData = that.order;
			if(!packListData.packList){
				var list = packListData.productList.split(",");
				for( let i = 0 ; i < list.length ; i++){
					let arr = list[i].split("*");
					list[i] =  {
						name:arr[0],
						count:arr[1]
					}
				}
				packListData.packList = list;
			}
			that.packListData = packListData;
			that.listFlag = true
		},
		packListHidden(){
			var that = this;
			that.listFlag = false;
		},
		submit(){
			var that = this
			var title;
			if(that.selectId1 == null && that.selectId2 == null){
    			Vue.toast('请选择退货退款或退还产品的原因',{duration:1500})
    			return false
    		}
			if(that.selectId1 == null && that.serviceRefundShow){
    			Vue.toast('请选择退货退款的原因',{duration:1500})
    			return false
    		}
			if(that.selectId2 == null && that.serviceExchangeShow){
    			Vue.toast('请选择退还产品的原因',{duration:1500})
    			return false
    		}
			if (that.serviceRefundShow) {
				title = 1
				that.askData.serviceReason = that.reasons[that.selectId1]
			} else {
				title = 2
				that.askData.serviceReason = that.reasons[that.selectId2]
			}
			that.$router.replace({path: '/self/serviceRefundExchange',query: {title:title,serviceReason:that.askData.serviceReason,orderNumber:that.order.orderNumber}});
		}
  	},
	components: {
		packList
	}
}
</script>

<style>
.serviceAfterSale .applyCancel-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	background: #fff;
	align-items: center;
	justify-content: space-between;
}
.serviceAfterSale .applyCancel-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.service-content {
	padding: 0.8rem 0.9rem ;
	background: #fff;
}
.serviceAfterSale .product-list {
	/*width: 17rem;*/
	margin: 0 auto;
	padding: 0.8rem 0 0;
}

.serviceAfterSale .product-list-right {
	width: 2.6rem;
	height: 2.6rem;
}
.serviceAfterSale .product-list-left {
	width: 12.6rem;
}
.serviceAfterSale .product-list {
	display: flex;
	justify-content: space-between;
}
.serviceAfterSale .product-list .sku-name {
	margin-left: 0.7rem;
	position: relative;
	margin-top: 0.3rem;
}
.serviceAfterSale .product-list .circle {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	margin-right: 0.2rem;
	position: absolute;
	left: -0.7rem;
	top: 0.15rem;
	background-image: url(~@assets/img/circle-gray.png);
}
.serviceAfterSale .wrap-list {
	color: #3ED8C4;
	margin-bottom: 0.8rem;
}
.serviceAfterSale .exchange {
	margin-top: 0.4rem;
	padding: 0 0.8rem;
	background: #FFF;
}
.serviceAfterSale .exchange .exchange-title {
	height: 2.8rem;
	line-height: 2.8rem;
}
.serviceAfterSale .public-arrow-right {
	background-image:url(~@assets/img/arrow-up-gray.png) ;
	background-size: 0.5rem auto;
}
.serviceAfterSale .public-arrow-down {
		background-image:url(~@assets/img/arrow-down-gray.png) ;
	background-size: 0.5rem auto;
}
.serviceAfterSale .exchange-checked {
	display: inline-block;
	width: 0.8rem;
	height: 0.8rem;
	border: 1px solid #eee;
	border-radius: 50%;
	margin-right: 0.5rem;
}
.serviceAfterSale .exchange-content p{
	/*background: red;*/
	height: 2.8rem;
	line-height: 2.8rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.serviceAfterSale .checked {
	width: 0.9rem;
	height: 0.9rem;
	background-image: url(~@assets/img/self/icon-select.png);
}
.serviceAfterSale .netSubmit {
	height: 2.2rem;
	line-height: 2.2rem;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
