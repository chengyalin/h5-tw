<template>
	<div class="coupon-page has-header">
		<ul class="coupon-type-list fixed left top right fixd-center bg-white font-lightGray public-padding-v">
			<li class="vertical-top relative" :class="{'active':askData.queryType == 0}" @click="changeType(0)">未使用{{countType0?'('+countType0+')':''}}</li>
			<li class="vertical-top relative" :class="{'active':askData.queryType == 1}" @click="changeType(1)">已失效{{countType1?'('+countType1+')':''}}</li>
			<li class="float-right"><router-link to="/couponAdd" class="font-grey">兑换优惠券</router-link></li>
		</ul>
		<ul class="coupon-list public-padding-v">
			<li v-for="(item,index) in listData" :key = "index" class="bg-blue relative" :class="{'active': askData.queryType == 1}">
				<div class="info font-bold font-white">
					<div class="main line-ellipsis">
						<span v-if="item.couponType == 'money'" class="vertical-bottom">¥</span>
						<span class="value vertical-bottom">{{item.couponValue}}</span><span v-if="item.couponType == 'discount'" class="vertical-bottom">折</span>
						<span v-else-if="item.couponType == 'rent'" class="vertical-bottom">{{item.rentType == '短租'?'天':'月'}}</span>
						<span class="type vertical-middle">{{item.rentType}}</span>
						<span class="vertical-middle">•</span>
						<span class="vertical-middle">{{item.couponName}}</span>
					</div>
					<router-link to="/home" v-if = "askData.queryType == 0" class="btn font-blue text-center bg-white absolute font-12">
						去使用
					</router-link>
					<span v-else class="btn font-BBB text-center bg-white absolute font-12">已失效</span>
				</div>
				<div v-if="item.couponRequest > 0" class="time font-white-60 font-12">
					<span>满{{item.couponRequest}}</span><span v-if="item.couponType == 'money'">减{{item.couponValue}}</span>
					<span v-else-if="item.couponType == 'discount'">打{{item.couponValue}}折</span>
					<span v-else>{{item.rentType == '短租'?'天':'月'}}免{{item.couponValue}}{{item.rentType == '短租'?'天':'月'}}</span>
					<span> / 截止：{{item.expireTime | formatTime5 }}</span>
				</div>
				<div v-else class="time font-white-60 font-12">
					<span>无门槛优惠券</span>
					<span> / 截止：{{item.expireTime | formatTime5 }}</span>
				</div>
				<div class="line-dashed-wrap"></div>
				<div class="foot font-white-40 font-12">
					优惠对象仅限租金，
					<span v-if="item.availProducts && item.availProducts.length">适用于部分商品</span>
					<span v-else-if="item.couponType == 'money'">适用于全场{{item.rentType}}商品</span>
					<span v-else>不同产品在合并支付时不可使用</span>
					<span v-if="item.availProducts && item.availProducts.length && askData.queryType == 0" class="btn absolute" @click="tips = item.availProducts ; tipFlag = true">立即查看</span>
				</div>
			</li>
		</ul>
		<div v-if="noDataFlag" class="noData-wrap center fixed text-center">
			<img class="noData-image" src="~@assets/img/message-null.png"/>
			<p class="font-lightGray">暂无任何优惠券</p>
		</div>
		<mt-spinner v-if="listData.length && more == 'Y'" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="tipFlag">
				<div class="public-popup-shadow"></div>
				<div class="public-popup-center bg-white relative absolute center">
					<p class="public-popup-center-title text-center font-20 font-bold">
						可用产品
					</p>
					<div class="public-popup-center-content">
						<ul class="public-popup-center-list">
							<li v-for="(item,index) in tips" class="relative">{{item}}</li>
						</ul>
					</div>
					<div class="btn font-16 font-blue text-center public-lineheight"  @click="tipFlag = false">我知道了</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { setBodyColor } from '@assets/js/mUtils';
	import { Spinner } from 'mint-ui';
	Vue.component(Spinner);
	export default {
		data() {
			return {
				askData: {
					"pageNum": 0,
					"pageSize": 20,
					"queryType": 0
				},
				switchShow: false,
				more: 'Y',
				noDataFlag: false,
				listData: [],
				tipFlag:false,
				tips:[],
				countType0:0,
				countType1:0,
			}
		},
		mounted() {
			var that = this;
			setBodyColor(true);
			that.getData();
			//这里为了获取已经失效的数量 非常傻比
			network(CONFIG.userCouponList,{
				"pageNum": 0,
				"pageSize": 20,
				"queryType": 1
			}).then((res) => {
				that.countType1 = res.result.count;
			})
			window.addEventListener('scroll', that.scrollBottom)
		},
		activated(){
			var that = this;
			window.addEventListener('scroll', that.scrollBottom)
		},
		deactivated(){
			var that = this;
			window.removeEventListener('scroll',that.scrollBottom)
		},
		destroyed(){
			var that = this;
			setBodyColor();
			window.removeEventListener('scroll',that.scrollBottom)
		},
		methods: {
			initData(){
				var that = this;
				that.askData.pageNum = 0;
				that.more = 'Y';
				that.noDataFlag = false;
				that.listData = [];
				that.getData();
			},
			getData() {
				var that = this;
				if (that.more == 'N' || that.switchShow) {
			        return false;
			    };
			    that.switchShow = true;
				network(CONFIG.userCouponList, that.askData).then((res) => {
					var details = res.details;
					that.listData = that.listData.concat(details);
					that.askData.pageNum = res.result.pageNum;
					that.more = res.result.more;
					that.switchShow = false;
					that.noDataFlag = that.listData.length == 0;
					if(that.askData.queryType == 0){
						that.countType0 = res.result.count;
					}else{
						that.countType1 = res.result.count;
					}
				})
			},
			changeType(type) {
				var that = this;
				that.askData.queryType = type;
				that.initData();
			},
			scrollBottom(){
		    		var that = this;
		    		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
				if((scrollTop + clientHeight) == scrollHeight){
					that.getData();
				}
		    }
		}
	}
</script>

<style>
.coupon-page .coupon-type-list{
	padding-top: 0.7rem;
	box-shadow: 0 0.1rem 0.5rem rgba(0,0,0,0.04);
	z-index: 10;
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
}
.coupon-page .coupon-type-list li{
	margin-right: 1rem;
	padding-bottom: 0.6rem
}
.coupon-page .coupon-type-list li:last-child{
	margin-right: 0;
}
.coupon-page .coupon-type-list li.active{
	color: #333333;
	font-weight: bold;
}
.coupon-page .coupon-type-list li.active:after{
	content: "";
	position: absolute;
	width: 1.3rem;
	height: 0.2rem;
	background: #333333;
	bottom: 0;
	left: 50%;
	margin-left: -0.65rem;
}
.coupon-page .coupon-list{
	padding-top: 0.8rem;
}
</style>