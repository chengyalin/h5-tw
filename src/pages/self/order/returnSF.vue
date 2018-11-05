<template>
	<div v-cloak class="returnSF-page has-footer">
		<div class="public-padding-v bg-white">
			<div v-if="sfFlag" class="returnSF-item returnSF-time display-flex-between flex-align-start" @click="timeFlag = true">
				<img class="icon" src="~@assets/img/time-green.svg"/>
				<div class="content">
					<div class="display-flex-between public-arrow-right">
						<p>上门取件时间</p>
						<span v-if = "selectTime.length && selectTime[0]" class="time">{{selectTime[0]}} {{selectTime[1]}}</span>
						<span v-else class="time font-BBB">请选择</span>
					</div>
				</div>
			</div>
			<div v-else>
				<div class="returnSF-item returnSF-express display-flex-between flex-align-start" @click="setExpressNumber">
					<img class="icon" src="~@assets/img/sf-black.png"/>
					<div class="content">
						<div class="public-arrow-right">
							填写单号
						</div>
					</div>
				</div>
				<p class="tip font-BBB font-12">温馨提示：产品寄回时请选择顺丰速递并支付运费。</p>
			</div>
			<div v-if="sfFlag" class="returnSF-item display-flex-between flex-align-start" @click="selectAddress">
				<img class="icon" src="~@assets/img/address-send-green.svg"/>
				<div class="content">
					<p class="h2 public-arrow-right">上门取件地址</p>
					<div v-if ="selectDelivery && selectDelivery.delivery_id">
						<div class="h3 font-12">
							<p class="vertical-middle">{{selectDelivery.name}}&nbsp;&nbsp;{{selectDelivery.phone}}</p><img v-if="selectDelivery.delivery_id == defaultDelivery.delivery_id || selectDelivery.delivery_default == 'Y'" class="default vertical-middle" src="~@assets/img/default.png"/>
						</div>
						<p class="h3 font-12">{{selectDelivery.province}}{{selectDelivery.city}} {{selectDelivery.area}} {{selectDelivery.address}}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="returnSF-item returnSF-backInfo public-padding-v bg-white display-flex-between flex-align-start">
			<img class="icon" src="~@assets/img/address-get-green.svg"/>
			<div class="content">
				<p class="h2">探物收件地址</p>
				<p class="h3 font-12">{{backInfo.address[0]}}&nbsp;&nbsp;{{backInfo.address[1]}}</p>
				<p class="h3 font-12">{{backInfo.address[2]}}</p>
			</div>
		</div>
		<span v-if="sfFlag" class="fixed left bottom right bg-blue font-white text-center font-bold public-lineheight" @click="submit">确认预约</span>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="timeFlag">
				<div class="public-popup-shadow" @click="timeFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						选择取件时间
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
					<div class="picker-btn font-bold text-center public-lineheight"  @click="timeSave">完成</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Picker } from 'mint-ui';
import { getTime } from '@assets/js/mUtils';
Vue.component(Picker.name, Picker);

export default {
	data () {
  		return {
  			askData:{},
  			backInfo:{
  				address:[]
  			},
  			defaultDelivery:{},
  			selectDelivery:{},
  			timeFlag:false,
  			slots: [
		        {
		          flex: 1,
		          values: [],
		          className: 'slot1',
		          textAlign: 'center'
		        }, {
		          flex: 1,
		          values: [],
		          className: 'slot2',
		          textAlign: 'center'
		        }
		     ],
		     selectTimeing:[],
		     selectTime:[],
		     sfFlag:false
	  	}
  	},
  	mounted(){
		var that = this;
  		that.askData.orderNumbers = that.$route.query.orderNumbers;
  		if(that.$route.query.type == 'sf'){
  			that.sfFlag = true;
  		}else{
  			document.title = "自行寄出"
  		}
		that.initData();
		that.initPickerData()
		eventBus.$on('selectAddress', function(data){
  			that.selectDelivery = data;
	    }.bind(that));
	},
	/*
	//本地刷新 体验不好 但是没办法了 草 大坑
  	beforeRouteEnter(to, from, next) {
  		if(from.path == '/returnProduct'){
  			window.location.reload();
  		}
		next();
	},
	*/
	beforeRouteLeave(to, from, next) {
		if (to.path == "/returnProduct") {
			from.meta.keepAlive = false;
		} else {
			from.meta.keepAlive = true;
		}
		next();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoReservationCheck, that.askData).then((res)=> {
				var backInfo = res.details.backInfo;
				backInfo.address = backInfo.address.split(",");
				that.backInfo = backInfo;
				if(res.details.defaultDelivery && res.details.defaultDelivery.delivery_id){
					that.defaultDelivery = res.details.defaultDelivery;
					that.selectDelivery = res.details.defaultDelivery;
				}
			})
		},
		submit(){
			var that = this;
			var askData = that.askData;
			if(!that.selectTime || !that.selectTime.length){
				Vue.toast('请选择取件时间',{duration:1500});
				return false;
			}else{
				askData.date_time = that.selectTime[0] == '今天' ? getTime(new Date().getTime()) + ' ' + that.selectTime[1] : getTime(new Date().getTime() + 24 * 60 * 60 * 1000) + ' ' + that.selectTime[1];
			}
			if(!that.selectDelivery.delivery_id){
				Vue.toast('请选择取件地址',{duration:1500});
				return false;
			}else{
				askData.name = that.selectDelivery.name;
				askData.phone = that.selectDelivery.phone;
				askData.address = that.selectDelivery.province+that.selectDelivery.city+that.selectDelivery.area+that.selectDelivery.address;
			}
			network(CONFIG.orderInfoReservationSave,askData).then((res)=> {
				that.$router.replace({path: '/returnResult', query: {orderNumber: askData.orderNumbers.split(",")[0]}});
			})
		},
		onValuesChange(picker, values) {
			var that = this;
			if(values[0] == '今天'){
				picker.setSlotValues(1, that.todayData);
			}else{
				picker.setSlotValues(1, that.fullData);
			}
		    that.selectTimeing = values;
		},
		timeSave(){
			var that = this;
			that.selectTime = that.selectTimeing
			that.timeFlag = false;
		},
		//选择地址
  		selectAddress(){
  			var that = this;
  			that.$router.push({path: '/self/address',query:{selectFlag:true}});
  		},
		initPickerData(){
			var that = this;
			var hour = new Date().getHours();
			var days = [];
			var fullData = [];
			for(let i = 10; i < 19; i++) {
				if(i == 13) continue;
				fullData.push(i + ":00");
			};
			if(hour < 9) {
				days.push("今天");
				that.todayData = fullData;
				that.slots[1].values = fullData;
			} else if(hour < 16) {
				days.push("今天");
				var todayData = [];
				for(let i = hour + 2; i < 19; i++) {
					if(i == 13) continue;
					todayData.push(i + ":00");
				};
				that.todayData = todayData;
				that.slots[1].values = todayData;
			} else{
				that.slots[1].values = fullData;
			}
			days.push("明天");
			that.fullData = fullData;
			that.slots[0].values = days;
		},
		setExpressNumber(){
			var that = this;
			that.$router.replace({path: '/returnNumber',query: { orderNumbers:that.askData.orderNumbers,type:'sf'}});
		}
	}
}
</script>

<style>
.returnSF-page .returnSF-item{
	padding-top: 0.8rem;
	padding-bottom: 0.7rem;
}
.returnSF-page .returnSF-item .content{
	width: 15.7rem;
}
.returnSF-page .returnSF-item .icon{
	width: 0.8rem;
}
.returnSF-page .returnSF-item .default{
	width: 1.2rem;
	margin-left: 0.5rem;
}
.returnSF-page .returnSF-item .time{
	padding-right: 0.2rem;
}
.returnSF-page .returnSF-time{
	border-bottom: 0.05rem solid #EEEEEE;
}
.returnSF-page .h2{
	margin-bottom: 0.4rem;
}
.returnSF-page .h3{
	padding-top: 0.1rem;
}
.returnSF-page .returnSF-backInfo{
	margin-top: 0.4rem;
}
.returnSF-page .tip{
	padding-bottom: 1rem;
}
.returnSF-page .returnSF-express{
	padding-bottom: 0.4rem;
}
</style>