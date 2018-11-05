<template>
	<div class="serviceRelect">
		<div class="trace-title">
			<button class="return-back" @click="goBack"></button>
			<p class="trace-title-info text-center font-16 font-bold">
				产品续租
			</p>
			<button class="font-14 font-grey service" @click="chat">客服</button>
		</div>
		<div class="applyCancel-product">
			<ul>
				<li v-for="(item, index) in orders1" :key="item.id">
					<div class="product-list" >
						<div class="product-list-left">
							<p class="font-14 font-darkGray line-ellipsis">{{item.productName}}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '长租'"><span class="inline-block circle bg-contain "></span>{{ item.skuName }}</p>
							<p class="font-12 font-grey sku-name" v-if = "item.rentType == '短租'"><span class="inline-block circle bg-contain "></span>
								{{ item.beginDate | formatTime2}}-{{item.endDate | formatTime2}}  （{{item.rentDay}}天）
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
								{{ item.beginDate | formatTime2}}-{{item.endDate | formatTime2}}  （{{item.rentDay}}天）
								<span class="float-right">x{{ item.rentTotal }}</span>
							</p>
						</div>
						<p class="product-list-right bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}"></p>
					</div>
					<span class="line-normal"></span>
					
				</li>
			
			
			</ul>
			<div class="bg-white text-center font-12 font-lightGray unfold-packup-state" v-if = "stateShow">
				<p class="unfold public-arrow-right" v-if = "stateFlag" @click="stateFlag = !stateFlag">展开</p>
				<p class="packup public-arrow-right" v-else @click="stateFlag = !stateFlag">收起</p>
			</div>
		</div>
		<div class="bg-white select-time font-14">
			<p class=" font-darkGray">续租天数</p>
			<p class="font-lightGray">未选择</p>
		</div>
		<div class="font-14 bg-blue text-center footer font-white">
			选择续租天数
		</div>
	</div>
</template>

<script>
import { publicChat , getMapSendDay } from '@assets/js/mUtils';


export default {
	data () {
  		return {
  			orders: [],
  			orders1: [],
  			orders2: [],
  			stateShow: false,
	        stateFlag: false,
	        
  		}
  	},
  	mounted(){
  		var that = this
  		that.orders = JSON.parse(localStorage.getItem('orders'))
  		that.orders1 = that.orders.orders.slice(0, 2)
  		that.orders2 = that.orders.orders.slice(2, that.orders.orders.length)
  		if (that.orders2.length) {
  			that.stateShow = true
  			that.stateFlag = true
  		}
  	},
  	methods:{
  		chat(){
			var that = this;
			publicChat();
		},
		goBack () {
			history.go(-1)
		}
  	},
	components: {
	}
}
</script>

<style>
.serviceRelect .trace-title {
	width: 100%;
	height: 2.1rem;
	line-height: 2.1rem;
	position: relative;
}
.serviceRelect .return-back {
	width: 1rem;
	position: absolute;
	left: 0.9rem;
	top: 0;
	height: 2.1rem;
	background: none;
	background-image: url(~@assets/img/arrow-left-black.png);
	background-repeat: no-repeat;
	background-size: 0.4rem 0.7rem;
	background-position: 0 center;
}
.serviceRelect .service {
	width: 2.3rem;
	text-align: center;
	height: 2.1rem;
	line-height: 2.1rem;
	position: absolute;
	right: 0;
	top: 0;
	background: none;
}
.serviceRelect .applyCancel-product li {
	padding: 0.8rem 0.9rem 0;
	background: #fff;
}
.serviceRelect .product-list {
	/*width: 17rem;*/
	margin: 0 auto;
	padding-bottom: 0.8rem;
}
.serviceRelect li:last-of-type .line-normal {
	display: none;
}
.serviceRelect .product-list-right {
	width: 2.6rem;
	height: 2.6rem;
}
.serviceRelect .product-list-left {
	width: 12.6rem;
}
.serviceRelect .product-list {
	display: flex;
	justify-content: space-between;
}
.serviceRelect .product-list .sku-name {
	margin-left: 0.7rem;
	position: relative;
	margin-top: 0.3rem;
}
.serviceRelect .product-list .circle {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	margin-right: 0.2rem;
	position: absolute;
	left: -0.7rem;
	top: 0.15rem;
	background-image: url(~@assets/img/circle-gray.png);
}
.serviceRelect .unfold-packup-state {
	height: 2rem;
}
.serviceRelect .unfold-packup-state p {
	width: 1.5rem;
	/*background: red;*/
	margin: 0 auto;
}
.serviceRelect .unfold-packup-state .unfold {
	background-image: url(~@assets/img/arrow-down-gray.png);
	background-size: 0.5rem auto;
}
.serviceRelect .unfold-packup-state .packup {
	background-image: url(~@assets/img/arrow-up-gray.png);
	background-size: 0.5rem auto;
}
.serviceRelect .select-time {
	height: 2.6rem;
	line-height: 2.6rem;
	margin-top: 0.4rem;
	padding: 0 0.9rem;
	display: flex;
	justify-content: space-between;
	
}
.serviceRelect .footer {
	height: 2.2rem;
	line-height: 2.2rem;
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
} 
</style>
