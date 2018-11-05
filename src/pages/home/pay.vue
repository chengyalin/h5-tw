<template>
	<div class="pay-page has-footer has-footer-iphoneX">
		<div v-if = "mainData.stateId == 1 || askData.paymentNo" class="text-center public-padding-v bg-white">
			<div class="time-wrap">
				<p class="time font-20">{{countDownData | formatCountDown}}</p>
				<p class="font-12 font-grey">剩余支付时间</p>
			</div>
		</div>
		<div v-if = "mainData.stateId == 1" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				订单金额
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{mainData.totalAmount | formatMoney}}</p>
				<p class="font-12 font-lightGray">含可退押金{{ mainData.depositAmount - mainData.zmAmount | formatMoney}}</p>
			</div>
		</div>
		<div v-else-if = "askData.paymentNo" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				订单金额
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{ rentAmount | formatMoney}}</p>
				<p class="font-12 font-lightGray">含可退押金{{ depositAmount | formatMoney}}</p>
			</div>
		</div>
		<div v-else-if = "type == 'relet'" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				支付金额
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{reletNumber*renewRent | formatMoney}}</p>
				<!--
				<p class="font-12 font-lightGray">共{{reletNumber}}天</p>
				-->
			</div>
		</div>
		<div v-else-if = "rentPayType" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				<span>支付金额&nbsp;</span>
				<span v-if = "rentPayType == 'fullPay'" class="public-tag-red public-tag-small font-white font-10">租金9.8折</span>
			</div>
			<div v-if="rentPayType == 'fullPay'" class="text-right">
				<p class="amount font-blue font-bold font-16">{{mainData.fullAmount | formatMoney}}</p>
				<p v-if="mainData.isPayDeposit == 'N'" class="font-12 font-lightGray">含可退押金{{order.depositAmount | formatMoney}}</p>
			</div>
			<div v-else class="text-right">
				<p v-if="payAmount" class="amount font-blue font-bold font-16">{{payAmount | formatMoney}}</p>
				<p v-else-if = "rentPayType == 'divide'" class="amount font-blue font-bold font-16">{{mainData.billAmount | formatMoney}}</p>
				<p v-else class="amount font-blue font-bold font-16">{{mainData.firstAmount | formatMoney}}</p>
				<!--
				<p v-if="rentPayType == 'payRemain'" class="font-12 font-lightGray">
					<span>（共{{order.allPayCycle - order.payCycle + 1}}期）</span>
				</p>
				<p v-else class="font-12 font-lightGray">
					第{{order.payCycle}}期
					<span v-if = "rentPayType == 'dividePay'">（共{{order.allPayCycle}}期）</span>
				</p>
				-->
			</div>
		</div>
		<div v-else-if = "order.rentType == '长租' && order.anthb_pay_state == '1' && !order.rentPaymentId" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				<span>支付金额</span>
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{order.rentAmount | formatMoney}}</p>
			</div>
		</div>
		<div v-else-if = "order.rentType == '长租'" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div v-if = "order.anthb_pay_state == '1'" class="font-bold">
				<span>支付金额</span>
			</div>
			<div v-else class="font-bold">
				<span>预授押金</span>
				<span class="public-tag-black font-white font-10">可退</span>
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{order.depositAmount | formatMoney}}</p>
				<!--
				<p class="font-12 font-lightGray">已信用减免{{ order.zmAmount | formatMoney}}</p>
				-->
			</div>
		</div>
		<ul class="pay-type-list bg-white public-padding-v">
			<!--
			<li v-if="freeFlag" class="item display-flex-between flex-align-center" @click="payType = 'free'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-zhima.svg"/>
					<p class="vertical-middle">芝麻分免押支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'free'}"></span>
				</div>
			</li>
			-->
			<li v-if="publicClient != 'wechat'" class="item display-flex-between flex-align-center" @click="payType = 'alipay'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-alipay.png"/>
					<p class="vertical-middle">支付宝支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'alipay'}"></span>
				</div>
			</li>
			<li v-if="publicClient != 'alipay' &&  (order.anthb_pay_state != '1' || order.rentType != '长租' || order.rentPaymentId)" class="item display-flex-between flex-align-center" @click="payType = 'wechat'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-wechat.png"/>
					<p class="vertical-middle">微信支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'wechat'}"></span>
				</div>
			</li>
		</ul>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white" @click="submit">
			<span class="bg-blue text-center font-white  public-lineheight block" v-if = "askData.paymentNo">去支付 {{rentAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "mainData.stateId == 1">去支付 {{mainData.totalAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "rentPayType == 'fullPay'">去支付 {{mainData.fullAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "mainData.stateId == 17 && order.rentType == '长租' && order.anthb_pay_state == '1' && !order.rentPaymentId">去支付 {{order.rentAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "rentPayType == 'dividePay'">去支付 {{mainData.firstAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "rentPayType == 'divide'">去支付 {{mainData.billAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "payAmount">去支付 {{payAmount | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "type == 'relet'">去支付 {{reletNumber*renewRent | formatMoney}}</span>
			<span class="bg-blue text-center font-white  public-lineheight block" v-else-if = "mainData.stateId == 17">去支付 {{order.depositAmount | formatMoney}}</span>
		</div>
		<div id="alipayWrap"></div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor , getClient} from '@assets/js/mUtils';
import { Previewer } from 'vux'
export default {
	data () {
  		return {
  			mainData:{},
  			askData:{
  				trade_no:'',
  				paymentNo:''
  			},
			payType:'alipay',
			freeFlag:false,
		   	publicClient:'',
		   	order:{},
		   	countDownData:30 * 1000 * 60,
		   	type:'',
		   	reletNum:0,//续租天数
		   	renewRent:0,//续租单价,
		   	rentAmount:0,
		   	depositAmount:0,
		   	rentPayType:'',
		   	payAmount:0,
		   	instalmentId:""
	  	}
  	},
  	mounted(){
		var that = this;
		var query = that.$route.query;
		if(query.type == 'relet'){
			that.type = query.type;
			that.reletNumber = query.time;
			that.renewRent = query.renewRent;
			that.askData.renewDays = query.time;
			that.askData.orderNumbers = query.orderNumbers;
		}else{
			getClient(that);
			//获取订单号或者支付号
			if(query.rentPayType){
				that.rentPayType = query.rentPayType;
				that.askData.orderNo = query.orderNo;
				if(query.payAmount){
					that.payAmount = query.payAmount;
				}
				if(query.instalmentId){
					that.instalmentId = query.instalmentId;
				}
			}if(query.orderNumber){
				that.askData.orderNo = query.orderNumber;
			}else if(query.orderNo){
				that.askData.orderNo = query.orderNo;
			}else if(query.paymentNo){
				that.askData.paymentNo = query.paymentNo;
				that.mainData.createDate = parseInt(query.createDate);
				that.rentAmount = query.rentAmount;
				that.depositAmount = query.depositAmount;
				that.countdown();
			}else if(query.out_trade_no){
				that.askData.orderNo = query.out_trade_no;
				that.trade_no = query.trade_no;
				that.payType = 'alipay';
			}
			if(that.publicClient == 'wechat' || that.publicClient == 'alipay'){
				that.payType = that.publicClient;
			}
			/*
			if(query.freeFlag){
				that.freeFlag = true;
				that.payType = 'free';
			}
			*/
			if(that.askData.orderNo){
				that.initData();
			}
		}
	},
	destroyed(){
		var that = this;
		if(that.timeInterval){
			clearInterval(that.timeInterval);
		}
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderInfoDetailsInfo, that.askData).then((res)=> {
				res.details.createDate = parseInt(res.details.createDate);
				that.mainData = res.details;
				that.order = res.details.orders[0];
				if(that.mainData.stateId == 1){
					that.countdown();
				}
			})
		},
		countdown(){
			var that = this;
			that.timeInterval = setInterval(function(){
				if(that.countDownData <= 0){
		      		clearInterval(that.timeInterval);
		      		that.countDownData = 0;
		      		Vue.toast('订单超时',{duration:1500});
		      		setTimeout(function(){
		      			that.$router.push({path: '/orderDetails',query: { orderNo:that.askData.orderNo}});
		      		},300)
		      	}else{
		      		that.countDownData = that.mainData.createDate + 30 * 60 * 1000 - (new Date().getTime());
		      	}
			},1000)
		},
		submit(){
			var that = this;
			if(that.mainData.stateId == 1 || that.askData.paymentNo){
				if(that.payType == 'alipay'){
					that.askData.paymentType = "ALIPAY_H5";
					network(CONFIG.shoppingPaySign, that.askData).then((res)=> {
						var formSumbit = res.details.form;
					    	var str = formSumbit.substring(0,formSumbit.indexOf("<script>"));
					    	var scriptStr = formSumbit.substring(formSumbit.indexOf("<script>")).replace("<script>","").replace("<\/script>","");
					    	document.getElementById("alipayWrap").innerHTML = str;
					    	eval(scriptStr);
					})
				}else if(that.payType == 'wechat'){
					if(IFWECHAT){
	        				that.askData.paymentType = "WECHAT_JSAPI";
	        				that.askData.openid =  localStorage.getItem("wechatOpenid");
	        				network(CONFIG.shoppingPaySign, that.askData).then((res)=> {
							if (typeof WeixinJSBridge == "undefined"){
							   	if( document.addEventListener ){
							       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							   	}else if (document.attachEvent){
							       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
							       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							   	}
							}else{
							   onBridgeReady();
							};
						})
	        			}else{
	        				that.askData.paymentType = "WECHAT_H5";
	        				network(CONFIG.shoppingPaySign, that.askData).then((res)=> {
							window.location.replace(res.details.mwebUrl)
						})
	        			}
				}else if(that.payType == 'free'){
					network(CONFIG.alipayRentCreate, { "order_number": that.askData.orderNo }).then((res)=> {
						window.location.replace(res.details.toUrl)
					})
				}
			}else if(that.type == 'relet'){
				if(that.payType == 'alipay'){
					that.askData.paymentType = "ALIPAY_H5";
					network(CONFIG.shoppingRenewPaySign, that.askData).then((res)=> {
						var formSumbit = res.details.form;
					    	var str = formSumbit.substring(0,formSumbit.indexOf("<script>"));
					    	var scriptStr = formSumbit.substring(formSumbit.indexOf("<script>")).replace("<script>","").replace("<\/script>","");
					    	document.getElementById("alipayWrap").innerHTML = str;
					    	eval(scriptStr);
					})
				}else if(that.payType == 'wechat'){
					if(IFWECHAT){
	        				that.askData.paymentType = "WECHAT_JSAPI";
	        				that.askData.openid =  localStorage.getItem("wechatOpenid");
	        				network(CONFIG.shoppingRenewPaySign, that.askData).then((res)=> {
							if (typeof WeixinJSBridge == "undefined"){
							   	if( document.addEventListener ){
							       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							   	}else if (document.attachEvent){
							       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
							       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							   	}
							}else{
							   onBridgeReady();
							};
						})
	        			}else{
	        				that.askData.paymentType = "WECHAT_H5";
	        				network(CONFIG.shoppingRenewPaySign, that.askData).then((res)=> {
	        					window.location.replace(res.details.mwebUrl)
						})
	        			}
				}
			}else if(that.order.rentType == '长租'){
				if(that.order.anthb_pay_state == 1){
					that.askData.payType = that.order.rentPaymentId?'longRentByStagesDeposit':'longRentByStages';
				}else if(that.rentPayType){
					if(that.rentPayType == 'fullPay'){
						that.askData.payType = 'fullAmount'
					}else if(that.rentPayType == 'dividePay'){
						that.askData.payType = 'firstPay'
					}else if(that.rentPayType == 'divide' || that.rentPayType == 'payRemain'){
			        		that.askData.orderNumbers = that.askData.orderNo;
			        		that.askData.payType = "currentAndResidueBill";
			        		that.askData.orderNo = that.instalmentId;
					}
				}else{
					that.askData.payType = "deposit";
				}
				if(that.payType == 'alipay'){
					that.askData.paymentType = "ALIPAY_H5";
					network(CONFIG.paymentLongPaySign, that.askData).then((res)=> {
						var formSumbit = res.details.form;
					    	var str = formSumbit.substring(0,formSumbit.indexOf("<script>"));
					    	var scriptStr = formSumbit.substring(formSumbit.indexOf("<script>")).replace("<script>","").replace("<\/script>","");
					    	document.getElementById("alipayWrap").innerHTML = str;
					    	eval(scriptStr);
					})
				}else if(that.payType == 'wechat'){
					if(IFWECHAT){
	        				that.askData.paymentType = "WECHAT_JSAPI";
	        				that.askData.openid =  localStorage.getItem("wechatOpenid");
	        				network(CONFIG.paymentLongPaySign, that.askData).then((res)=> {
							if (typeof WeixinJSBridge == "undefined"){
							   	if( document.addEventListener ){
							       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							   	}else if (document.attachEvent){
							       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
							       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							   	}
							}else{
							   onBridgeReady();
							};
						})
	        			}else{
	        				that.askData.paymentType = "WECHAT_H5";
	        				network(CONFIG.paymentLongPaySign, that.askData).then((res)=> {
	        					window.location.replace(res.details.mwebUrl)
						})
	        			}
				}
			}
		}
	}
}
function onBridgeReady(wechatPay){
   WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId":wechatPay.appId,      //公众号名称，由商户传入     
           "timeStamp":wechatPay.timeStamp,         //时间戳，自1970年以来的秒数     
           "nonceStr":wechatPay.nonceStr, //随机串     
           "package":wechatPay.package,     
           "signType":"MD5",         //微信签名方式：     
           "paySign":wechatPay.paySign //微信签名 
       },
       function(res){     
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
           		Vue.toast('支付成功',{duration:1500});
           } 
       }
   ); 
};
</script>

<style>
.pay-page .time-wrap{
	padding-top: 1.3rem;
	padding-bottom: 1rem;
	border-bottom: 0.05rem solid #EEEEEE;
}
.pay-page .time-wrap .time{
	margin-bottom: 0.1rem;
}
.pay-page .amount-wrap{
	padding-top: 1.1rem;
	padding-bottom: 1rem;
	margin-bottom: 0.4rem;
}
.pay-page .amount-wrap .amount{
	margin-bottom: 0.1rem;
}
.pay-page .pay-type-list{
	padding-top: 0.4rem;
	padding-bottom: 0.4rem;
}
.pay-page .pay-type-list .item{
	border-bottom: 0.05rem solid #EEEEEE;
	padding: 0.7rem 0;
}
.pay-page .pay-type-list .item:last-child{
	border: none;
}
.pay-page .pay-type-list .icon{
	width: 1rem;
	margin-right: 0.4rem;
}

</style>