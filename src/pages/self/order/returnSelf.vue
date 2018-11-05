<template>
	<div v-cloak class="returnSelf-page has-footer">
		<div class="public-padding-v">
			<div class="returnSelf-header">
				<p>选择上门自还网点地址</p>
				<p class="tip font-lightGray font-12">请确保在租期结束前，将产品送还至所选网点</p>
			</div>
			<ul class="returnSelf-list">
				<li class="display-flex-between flex-align-center" v-for="(item,index) in selfInfo" @click="selectIndex = index">
					<div class="check">
						<span class="public-checkbox border-box block" :class="{'active':index == selectIndex}"></span>
					</div>
					<div class="content font-12">
						<p class="name font-bold font-14">{{item.selfName}}</p>
						<p class="font-grey">{{item.selfAddress[2]}}</p>
						<p class="font-grey">{{item.selfAddress[0]}}&nbsp;&nbsp;&nbsp;{{item.selfAddress[1]}}</p>
					</div>
				</li>
			</ul>
		</div>
		<span class="fixed left bottom right bg-blue font-white text-center font-bold public-lineheight" @click="submit">确定</span>
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
  			selectIndex:null,
  			orderNumbers:[],
  			selfInfo:[]
	  	}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.orderNumbers = that.$route.query.orderNumbers.split(",");
		that.askData.order_number = that.orderNumbers[0];
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.reservationCheck, that.askData).then((res)=> {
				var selfInfo = res.details.selfInfo;
				selfInfo.map(item => {
					var selfAddress = item.selfAddress.split(",");
					item.selfAddress = selfAddress;
				})
				that.selfInfo = selfInfo;
			})
		},
		submit(){
			var that = this;
			if(that.selectIndex == null){
				Vue.toast('请选择自还地址',{duration:1500})
			}else{
				network(CONFIG.orderInfoReservationSave, {
					orderNumbers:that.orderNumbers.join(","),
					self_id: that.selfInfo[that.selectIndex].selfId
				}).then((res)=> {
					that.$router.replace({path: '/returnResult',query: { orderNumber:that.orderNumbers[0]}});
				})
			}
		}
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.returnSelf-page .returnSelf-header{
	padding-top: 0.8rem;
}
.returnSelf-page .returnSelf-header .tip{
	margin-top: 0.1rem;
	margin-bottom: 0.9rem;
}
.returnSelf-page .returnSelf-list li{
	padding-top: 0.9rem;
	padding-bottom: 0.9rem;
	border-bottom: 0.05rem solid #EEEEEE;
}
.returnSelf-page .returnSelf-list li:last-child{
	border: none;
}
.returnSelf-page .returnSelf-list li .content{
	width: 15.4rem;
}
.returnSelf-page .returnSelf-list li .content .name{
	margin-bottom: 0.1rem;
}
</style>