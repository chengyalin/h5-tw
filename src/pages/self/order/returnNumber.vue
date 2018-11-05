<template>
	<div v-cloak class="returnNumber-page has-footer">
		<div class="input-wrap bg-white public-padding-v">
			<input class="input width-full block" placeholder="输入顺丰速递单号" v-model="askData.expressNumber" maxlength="30"></input>
		</div>
		<p v-if="tipFlag && !askData.expressNumber.trim().length" class="tip font-red public-padding-v">请填写物流单号</p>
		<div class="fixed left bottom right bg-blue font-white text-center public-lineheight" @click="submit">完成</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
export default {
	data () {
  		return {
  			askData:{
  				orderNumbers:'',
  				expressNumber:''
  			},
			tipFlag:false,
			sfFlag:false
  		}
  	},
	mounted () {
		var that = this;
		that.askData.orderNumbers = that.$route.query.orderNumbers;
		that.sfFlag = that.$route.query.type == 'sf'
	},
	methods: {
		submit(){
			var that = this;
			if(!that.askData.expressNumber.trim().length){
				that.tipFlag = true;
				return false;
			}
			if(!checkNumber(that.askData.expressNumber)){
				Vue.toast('订单号输入不合法', {
					duration: 1500
				});
				return false;
			}
			network(CONFIG.orderInfoReservationExpress, that.askData).then((res)=> {
				if(that.sfFlag){
					that.$router.back(-1);
				}else{
					that.$router.repalce({path: '/returnResult',query: { orderNumbers:that.askData.orderNumbers.split(",")[0]}});
				}
			})
		}
	}
}
function checkNumber(str) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(str)) {
    return true;
  }else{
  	return false;
  }
}
</script>

<style >
.returnNumber-page .input-wrap{
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
}
.returnNumber-page .input::-webkit-input-placeholder{
    color:#BBBBBB;
}
.returnNumber-page .tip{
	margin-top: 0.3rem;
}
</style>
