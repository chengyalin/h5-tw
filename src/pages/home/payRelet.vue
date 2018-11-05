<template>
	<div class="pay-page">
		<div v-if = "mainData.stateId == 1" class="text-center public-padding-v bg-white">
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
				<p class="amount font-blue font-bold font-16">{{(order.depositAmount * 1 + order.rentAmount * 1) | formatMoney}}</p>
				<p class="font-12 font-lightGray">含可退押金{{ order.depositAmount | formatMoney}}</p>
			</div>
		</div>
		<div v-else-if = "order.rentType == '长租'" class="amount-wrap bg-white public-padding-v display-flex-between">
			<div class="font-bold">
				<span>预授押金</span>
				<span class="public-tag-black font-white font-10">可退</span>
			</div>
			<div class="text-right">
				<p class="amount font-blue font-bold font-16">{{order.depositAmount | formatMoney}}</p>
				<p class="font-12 font-lightGray">已信用减免{{ order.zmAmount | formatMoney}}</p>
			</div>
		</div>
		<ul class="pay-type-list bg-white public-padding-v">
			<li v-if="freeFlag" class="item display-flex-between flex-align-center" @click="payType = 'free'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-alipay.png"/>
					<p class="vertical-middle">芝麻分免押支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'free'}"></span>
				</div>
			</li>
			<li v-if="publicClient != 'wechat'" class="item display-flex-between flex-align-center" @click="payType = 'alipay'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-alipay.png"/>
					<p class="vertical-middle">支付宝支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'alipay'}"></span>
				</div>
			</li>
			<li v-if="publicClient != 'alipay'" class="item display-flex-between flex-align-center" @click="payType = 'wechat'">
				<div>
					<img class="icon vertical-middle" src="~@assets/img/pay-wechat.png"/>
					<p class="vertical-middle">微信支付</p>
				</div>
				<div class="checkbox">
					<span class="public-checkbox border-box block" :class="{active:payType == 'wechat'}"></span>
				</div>
			</li>
		</ul>
		<div class="fixed left bottom right font-white bg-blue font-bold text-center public-lineheight" @click="submit">
			<span v-if = "mainData.stateId == 1">去支付 {{order.rentAmount | formatMoney}}</span>
			<span v-else-if = "mainData.stateId == 17">去支付 {{order.depositAmount | formatMoney}}</span>
		</div>
		<div id="alipayWrap"></div>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor , getClient} from '@assets/js/mUtils';
import { Previewer } from 'vux'
export default {
	data () {
  		return {
  			mainData:{},
  			askData:{
  				trade_no:''
  			},
			payType:'alipay',
			freeFlag:false,
		   	publicClient:'',
		   	order:{},
		   	countDownData:30 * 1000 * 60
	  	}
  	},
  	mounted(){
		var that = this;
		//getClient(that);
		//获取订单号或者支付号
		var query = that.$route.query;
		if(query.orderNumber){
			that.askData.orderNo = query.orderNumber;
		}else if(query.orderNo){
			that.askData.orderNo = query.orderNo;
		}else if(query.paymentNo){
			that.askData.paymentNo = query.paymentNo;
		}else if(query.out_trade_no){
			that.askData.orderNo = query.out_trade_no;
			that.trade_no = query.trade_no;
			that.payType = 'alipay';
		}
		if(that.publicClient){
			that.payType = that.publicClient;
		}
		if(query.freeFlag){
			that.freeFlag = true;
			that.payType = 'free';
		}
		if(that.askData.orderNo){
			that.initData();
		}
	},
	destroyed(){
		var that = this;
		clearInterval();
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
			setInterval(function(){
				if(that.countDownData <= 0){
		      		clearInterval();
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
			if(that.mainData.stateId == 1){
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
							window.location.href = res.details.mwebUrl;
						})
	        			}
				}else if(that.payType == 'free'){
					network(CONFIG.alipayRentCreate, { "order_number": that.askData.orderNo }).then((res)=> {
						window.location.href = res.details.toUrl;
					})
				}
			}else if(that.order.rentType == '长租'){
				that.askData.payType = "deposit"
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
							window.location.href = res.details.mwebUrl;
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