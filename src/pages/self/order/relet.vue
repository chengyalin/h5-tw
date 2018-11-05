<template>
	<div v-cloak v-if="listData.length" class="relet-page public-card-page has-footer has-footer-iphoneX">
		<div class="relet-header bg-white public-padding-v">
			<div class="radius-1 public-card-content">
				<div class="product-wrap clearfix" v-for="(item,index) in listData" v-if="index < showNum || showFlag">
					<div class="content float-left">
						<p class="name line-ellipsis">{{item.productName}}</p>
						<div v-if="!item.skuName">
							<div class="point-item font-grey font-12 relative clearfix">
								<p class="vertical-middle">{{item.beginDate | formatTime2}}-{{item.endDate | formatTime2}} ({{item.time}}{{item.reletDay == 0?'':' + '+item.reletDay}}天)</p>
								<span class="font-BBB float-right">×{{item.totalNum}}</span>
							</div>
						</div>
						<div v-else>
							<div class="point-item font-grey font-12 relative long">
								<p class="vertical-middle">{{item.skuName}}</p>
							</div>
						</div>
					</div>
					<div class="float-right text-right">
						<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+ item.imageSrc +')'}"></div>
					</div>
				</div>
			</div>
			<div v-if="listData.length > showNum" class="toggle-btn font-12 font-lightGray text-center" :class="{active:showFlag}" @click="showFlag = !showFlag">
				<span>{{showFlag?'收起':'展开'}}</span>
				<img class="icon" src="~@assets/img/arrow-down-gray.png"/>
			</div>
		</div>
		<div class="relet-wrap bg-white display-flex-between public-padding-v" @click="timeFlag = true">
			<span>续租天数</span>
			<span v-if="selectNum" class="public-arrow-right">{{selectNum}}天</span>
			<span v-else class="font-lightGray">未选择</span>
		</div>
		<div class="foot fixed left bottom right iphoneX-footer fixd-center bg-white font-bold">
			<div v-if="selectNum" class="font-blue public-lineheight public-padding-v">
				续租金额：{{selectNum * renewRent | formatMoney}}
				<span class="btn absolute top right bg-blue font-white text-center" @click="submit">确认续租</span>
			</div>
			<span v-else class="bg-blue text-center font-white public-lineheight block" @click="timeFlag = true">选择续租天数</span>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="timeFlag">
				<div class="public-popup-shadow" @click="timeFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						选择续租时间
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
					<div class="picker-btn font-bold text-center public-lineheight"  @click="timeSave">确定</div>
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
Vue.component(Picker.name, Picker);
export default {
	data () {
  		return {
  			showNum:2,
  			askData:{},
  			listData:[],
  			selectProductArray:[],
  			showFlag:false,
  			timeFlag:false,
  			packListData:{},
  			selectNum:0,
  			selectNumimg:0,
  			slots: [
		        {
		          flex: 1,
		          values: [],
		          className: 'slot1',
		          textAlign: 'center',
		          defaultIndex:0
		        }
		    ],
		    renewRent:0
	  	}
  	},
  	mounted(){
		var that = this;
		that.askData.orderNumbers = that.$route.query.orderNumbers;
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoRenewalInit, that.askData).then((res)=> {
				that.listData = res.result.orders;
				that.renewRent = res.result.renewRent;
				var time = parseInt(res.result.time);
				if(time > 0){
					var arr = [];
					for(var i = 0 ; i < time ; i++){
						arr.push(i+1+"天");
					}
					that.slots[0].values = arr;
				}else{
					that.$router.back();
				}
			})
		},
		onValuesChange(picker, values) {
			var that = this;
		    that.selectNumimg = values[0];
		},
		timeSave(){
			var that = this;
			that.selectNum = that.selectNumimg.replace("天","");
			that.slots[0].defaultIndex = that.selectNum - 1;
			that.timeFlag = false;
		},
		submit(){
			var that = this;
			var query = {
				orderNumbers:that.askData.orderNumbers,
				type:'relet',
				time:that.selectNum,
				renewRent:that.renewRent
			}
			that.$router.replace({path: '/pay',query: query});
		}
	}
}
</script>

<style>
.relet-page.public-card-page{
	padding-top: 0;
}
.relet-page .relet-header{
	overflow: hidden;
}
.relet-page .public-card-content{
	margin-bottom: 0.2rem;
}
.relet-page .public-card-content .product-wrap{
	padding-bottom: 0.5rem;
	border-bottom: 0.05rem solid #EEEEEE;
}
.relet-page .public-card-content .product-wrap .image{
	margin-bottom: 0;
}
.relet-page .public-card-content .product-wrap:last-child{
	border: none;
}
.relet-page .public-card-content .product-wrap .content{
	width: 13rem;
}
.relet-page .toggle-btn{
	width: 2.5rem;
	margin: 0 auto 1rem auto;
}
.relet-page .toggle-btn .icon{
	width: 0.5rem;
}
.relet-page .toggle-btn.active .icon{
	transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
}
.relet-page .relet-wrap{
	margin-top: 0.4rem;
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
}
.relet-page .foot .btn{
	width: 7rem;
}
</style>