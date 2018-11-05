<template>
	<div v-cloak class="selectCoupon-page has-footer bg-white" >
		<ul class="coupon-list public-padding-v">
			<li v-for="(item,index) in coupon" :key = "index" class="bg-blue relative" :class="{'active':item.disabled}" @click="submit(index)">
				<div class="info font-bold font-white">
					<div class="main line-ellipsis">
						<span v-if="item.couponType == 'money'" class="vertical-bottom">¥</span>
						<span class="value vertical-bottom">{{item.couponValue}}</span><span v-if="item.couponType == 'discount'" class="vertical-bottom">折</span>
						<span v-else-if="item.couponType == 'rent'" class="vertical-bottom">{{item.rentType == '短租'?'天':'月'}}</span>
						<span class="type vertical-middle">{{item.rentType}}</span>
						<span class="vertical-middle">•</span>
						<span class="vertical-middle">{{item.couponName}}</span>
					</div>
					<span class="btn bg-green text-center font-white absolute font-12" v-if="index == couponIndex">已选择</span>
				</div>
				<div v-if="item.couponRequest > 0" class="time font-white-60 font-12">
					<span>满{{item.couponRequest}}</span><span v-if="item.couponType == 'money'">减{{item.couponValue}}</span>
					<span v-else-if="item.couponType == 'discount'">打{{item.couponValue}}折</span>
					<span v-else>{{item.rentType == '短租'?'天':'月'}}免{{item.couponValue}}{{item.rentType == '短租'?'天':'月'}}</span>
					<span> / 截止：{{item.couponExpireDatetime | formatTime5 }}</span>
				</div>
				<div v-else class="time font-white-60 font-12">
					<span>无门槛优惠券</span>
					<span> / 截止：{{item.couponExpireDatetime | formatTime5 }}</span>
				</div>
				<div class="line-dashed-wrap"></div>
			</li>
		</ul>
		<div class="fixed left bottom right font-grey bg-white text-center public-lineheight" @click="submit(null)">
			<span class="line-normal absolute left top right"></span>
			不使用优惠券
		</div>
	</div>
</template>

<script>
import { setBodyColor } from '@assets/js/mUtils';
export default {
	data () {
  		return {
			coupon:[],
			couponIndex:null,
			judgeData:{}
  		}
  	},
	mounted () {
		var that = this;
		setBodyColor(true);
		that.couponIndex = that.$route.query.couponIndex;
		var coupon = that.$route.query.coupon;
		var judgeData = that.$route.query.judgeData;
		if(judgeData){
			coupon.map(item => {
				//判断优惠券能否使用 长租没做！！！！
				if(judgeData.time ){
					if((parseInt(judgeData.time) < parseInt(item.couponRequest) && item.couponType == 'rent') || (parseFloat(judgeData.couponCalculateAmount) < parseFloat(item.couponRequest) && item.couponType != 'rent')){
						item.disabled = true
					}
				}
				/*
				if((judgeData.rentType == '短租' && (judgeData.couponCalculateAmount < item.couponRequest || judgeData.item < item.couponRequest)) || (judgeData.rentType == '长租' && ((item.couponType != 'rent' && judgeData.couponCalculateAmount < item.couponRequest) || (item.couponType == 'rent' && judgeData.time < item.couponRequest)))){
					item.disabled = true
				}
				*/
			})
		}
		that.coupon = coupon;
	},
	methods: {
		submit(value){
			var that = this;
			if(value != null && that.coupon[value].disabled){
				return false;
			}
			eventBus.$emit('couponIndex',value);
	        that.$router.back();
		}
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style >
.selectCoupon-page .coupon-list li {
	padding-bottom: 1.6rem;
}
</style>
