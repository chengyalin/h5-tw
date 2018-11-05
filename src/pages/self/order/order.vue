<template>
	<div class="order-page public-card-page">
		<div class="page-bg fixed left top right bg-gradient-normal"></div>
		<header class="order-header fixed left top right" :style="{'background-color':'rgba(255,255,255,'+headAlpha+')'}" @click = "typeFlag = true">
			<div class="text-center font-16 font-bold font-white">
				<span class="vertical-middle">{{allFlag?'全部订单':typeList[askData.order_state].name}}</span>
				<img class="icon vertical-middle" src="~@assets/img/arrow-up-white.png"/>
			</div>
			<div class="cover absolute left top right bottom text-center font-16 font-bold" :style="{'opacity':headAlpha}">
				<span class="vertical-middle">{{allFlag?'全部订单':typeList[askData.order_state].name}}</span>
				<img class="icon vertical-middle" src="~@assets/img/arrow-down-gray.png"/>
			</div>
		</header>
		<ul class="order-list public-padding-v">
			<li class="bg-white public-padding-v relative public-card-content" v-for="(item,index) in listData">
				<span v-if="item.stateId == 17 && item.anthb_pay_state == 1" class="state absolute bg-green font-white font-12 text-center" >{{item.orders[0].rentPaymentId?'待付押金':'待付款'}}</span>
				<span v-else class="state absolute bg-green font-white font-12 text-center" :class="{'bg-BBB':item.stateId == 11 || item.stateId == 14 || item.stateId == 19}">{{item.state}}</span>
				<div class="product-wrap clearfix" v-for="(cItem,cIndex) in item.orders" @click="goOrderDetail(item.orderNo)">
					<div class="content float-left">
						<p class="name font-bold line-clamp-2">{{cItem.productName}}</p>
						<div v-if="cItem.rentType == '短租'">
							<div class="point-item font-grey font-12 relative">
								<p class="vertical-middle">{{cItem.beginDate | formatTime2}}-{{cItem.endDate | formatTime2}} ({{cItem.rentDay}}{{cItem.reletDay == 0?'':' + '+cItem.reletDay}}天)</p>
							</div>
							<div class="point-item font-grey font-12 relative">
								租金: {{cItem.originalRent | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{cItem.depositAmount | formatMoney}}&nbsp;
								<span v-if = "cItem.depositAmount > 0" class="public-tag-black public-tag-small font-white">可退</span>
								<span v-else class="public-tag-green font-white">全免</span>
							</div>
						</div>
						<div v-else>
							<div class="point-item font-grey font-12 relative long">
								<p class="vertical-middle">{{cItem.skuName}}</p>
							</div>
							<div class="point-item font-grey font-12 relative">
								租金: {{cItem.renewRent | formatMoney}}x{{cItem.allPayCycle}}期&nbsp;&nbsp;&nbsp;押金: {{cItem.depositAmount | formatMoney}}&nbsp;
								<span v-if = "cItem.depositAmount > 0" class="public-tag-black public-tag-small font-white">可退</span>
								<span v-else class="public-tag-green font-white">全免</span>
							</div>
						</div>
					</div>
					<div class="float-right text-right">
						<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+cItem.imageSrc+')'}">
							<img class="icon" v-if="cItem.insuranceAmount > 0" src="~@assets/img/insurance-green.png" />
						</div>
						<span class="font-BBB font-12">×{{cItem.rentTotal}}</span>
					</div>
				</div>
				<div class="foot-wrap display-flex-between flex-align-center font-12">
					<div>
						<!--
						<p v-if="item.stateId == 1" class="font-grey">请在 {{item.countDownData | formatCountDown2}} 内支付</p>
						-->
					</div>
					<div v-if = "item.orders[0]" class="btn-wrap">
						<span @click="orderCancel(index)" v-if="(item.orders.length > 1 && item.stateId == 1) || (( item.stateId == 17 || item.stateId == 18 ) && ( item.isPayDeposit == 'Y' || item.orders[0].depositAmount == 0 ) && item.anthb_pay_state == 0 )" class="btn vertical-middle text-center">取消订单</span>
						<span @click="pay(index,'short')"v-if="item.orders[0].orderType != 'ALIMI' && item.stateId == 1" class="btn vertical-middle text-center active">付款</span>
						<span @click="followExpress(index)" v-if="( item.orders.length > 1 && item.stateId == 9 ) || (( item.anthb_pay_state == 1 || ( item.orders.length > 1 && item.parentReturnFlag != 0 )) && item.stateId == 5 ) || (( item.orders.length == 1 || item.orders[0].rentType == '短租') && ( item.stateId == 7 || item.stateId == 8 ) && item.isFullPay == 'Y' ) || item.stateId == 2 || item.stateId == 4  || item.stateId == 15 || item.stateId == 16" class="btn vertical-middle text-center">跟踪订单</span>
						<span @click="relet(index)" v-if="item.orders[0].rentType == '短租' && ( item.parentReturnFlag == 0 || item.stateId != 5 ) && item.orders[0].supportFlag == 0 && ( item.stateId == 4 || item.stateId == 5 || item.stateId == 16 )" class="btn vertical-middle text-center">续租</span>
						<span @click="returnProduct(index,1)" v-if="( item.orders.length == 1 || ( item.orders.length > 1 && item.parentReturnFlag == 0 )) && item.stateId == 5" class="btn vertical-middle text-center">{{item.parentReturnFlag == 0?'归还':(item.parentReturnFlag == 1?'预约成功':'归还中')}}</span>
						<span @click="refundBill(index)" v-if="item.stateId == 9 || item.stateId == 10 || (item.stateId == 11 && ( item.isPayDeposit == 'Y' || item.orders[0].rentPaymentId))" class="btn vertical-middle text-center">退款明细</span>
						<span @click="goBill(index)" v-if="item.anthb_pay_state == 0 && item.isFullPay == 'N' &&  item.orders[0].payCycle == item.orders[0].allPayCycle && (item.stateId == 2 || item.stateId == 4 || item.stateId == 5 || item.stateId == 8 || item.stateId == 16)" class="btn vertical-middle text-center">查看账单</span>
						<span @click="appraiseAdd(index)" v-if="item.orders.length == 1 && ( item.stateId == 7 || item.stateId == 8 || item.stateId == 9 || item.stateId == 10 || item.stateId == 15 )" class="btn vertical-middle text-center">{{item.orders[0].appraiseId?'查看口碑':'发布口碑'}}</span>
						<router-link :to="{path: '/productDetails', query: {productId: item.orders[0].productId}}" v-if="item.orders.length == 1 && item.stateId == 14" class="btn vertical-middle text-center">重新下单</router-link>
						<span @click="deleteOrder(index)" v-if="item.stateId == 11 || item.stateId == 14 || item.stateId == 19" class="btn vertical-middle text-center">删除订单</span>
						<span @click="pay(index,'divide')" v-if="item.orders[0].orderType != 'ALIMI' && item.anthb_pay_state == 0 && item.isFullPay == 'N' && item.orders[0].refundFlag != 1 && item.orders[0].payCycle != item.orders[0].allPayCycle && item.depositRefundStatus == 0 && (item.stateId == 2 || item.stateId == 4 || item.stateId == 5 || item.stateId == 16)" class="btn vertical-middle text-center active">支付租金</span>
						<span @click="pay(index,'deposit')" v-if="item.orders[0].orderType != 'ALIMI' && item.anthb_pay_state == 0 && item.isPayDeposit == 'N' && item.stateId == 17" class="btn vertical-middle text-center active">支付押金</span>
						<span @click="orderCancel(index,1)" v-if="item.anthb_pay_state == 0 && item.orders[0].depositAmount != 0 && item.isPayDeposit == 'Y' && item.stateId == 17" class="btn vertical-middle text-center">{{item.depositRefundStatus == 0?'申请退款':(item.depositRefundStatus == 1?'退款中':'退款成功')}}</span>
						<span @click="pay(index,'first')" v-if="item.orders[0].orderType != 'ALIMI' && item.stateId == 18" class="btn vertical-middle text-center active">{{item.isPayDeposit == 'Y'?'支付租金':'付款'}}</span>
						<span @click="pay(index,'huabei')" v-if="item.anthb_pay_state == 1 && item.stateId == 17" class="btn vertical-middle text-center active">{{item.orders[0].rentPaymentId?'支付押金':'付款'}}</span>
					</div>
				</div>
			</li>
		</ul>
		<div v-if="noDataFlag" class="noData-wrap-bg bg-white fixed ">
			<div class="noData-wrap center absolute text-center">
				<img class="noData-image" src="~@assets/img/message-null.png"/>
				<p class="font-lightGray">暂无任何订单</p>
			</div>
		</div>
		<mt-spinner v-if="listData.length && more == 1" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="typeFlag">
				<div class="public-popup-shadow" @click="typeFlag = false"></div>
				<div class="bg-white absolute top left right">
					<ul class="type-list font-16">
						<li class="display-flex-between" v-for="(item,index) in typeList" @click="changeType(item.id)">
							<span>{{item.name}}</span>
							<div v-if="(index == 0 && allFlag) || (askData.order_state == item.id && index > 0 && !allFlag)" class="checkbox">
								<span class="public-checkbox border-box block active"></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="selectProductFlag">
				<div class="public-popup-shadow" @click="selectProductFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						选择{{selectProductTitle}}产品
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="selectProduct-popup-wrap public-card-content public-padding-v">
						<div v-for="(item,index) in selectOrders" class="product-item display-flex-between flex-align-center" @click="selectProductMulti?selectProduct(index):selectProductIndex = index">
							<div class="checkbox">
								<span v-if="selectProductMulti" class="public-checkbox border-box block" :class="{'active':selectProductArray[index]}"></span>
								<span v-else class="public-checkbox border-box block" :class="{'active':index == selectProductIndex}"></span>
							</div>
							<div class="product-wrap clearfix">
								<div class="content float-left">
									<p class="name font-bold line-ellipsis">{{item.productName}}</p>
									<div v-if="selectProductExpress && item.express && item.express.length">
										<div class="point-item font-grey font-12 relative">
											<p class="vertical-middle">{{item.express[index].stateDetails}}</p>
										</div>
									</div>
									<div v-else>
										<div class="point-item font-grey font-12 relative">
											<p v-if="item.beginDate" class="vertical-middle">{{item.beginDate | formatTime2}}-{{item.endDate | formatTime2}} ({{item.rentDay || item.time}}{{item.reletDay == 0?'':' + '+item.reletDay}}天)</p>
											<p v-else-if="item.rentBeginDatetime" class="vertical-middle">{{item.rentBeginDatetime | formatTime2}}-{{item.rentEndDatetime | formatTime2}} ({{item.orderTime}}{{item.renewDays == 0?'':' + '+item.renewDays}}天)</p>
										</div>
										<div v-if="item.rentAmount" class="point-item font-grey font-12 relative">
											租金: {{item.rentAmount | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{item.depositAmount | formatMoney}}
										</div>
										<div v-else-if="item.orderRentAmount" class="point-item font-grey font-12 relative">
											租金: {{item.orderRentAmount | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{item.orderDepositAmount | formatMoney}}
										</div>
									</div>
									<!--
									<div v-else>
										<div class="point-item font-grey font-12 relative long">
											<p class="vertical-middle">{{item.skuName}}</p>
										</div>
										<div class="point-item font-grey font-12 relative">
											租金: {{item.productRent | formatMoney}}x{{item.allPayCycle}}期&nbsp;&nbsp;&nbsp;押金: {{item.depositAmount | formatMoney}}
										</div>
									</div>
									-->
								</div>
								<div class="float-right text-right">
									<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}">
										<img class="icon" v-if = "item.insuranceAmount > 0" src="~@assets/img/insurance-green.png"/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-blue font-white font-bold text-center public-lineheight" @click="selectProductSubmit">确定</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="fullPayFlag">
				<div class="public-popup-shadow" @click="fullPayFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 relative font-bold">
						选择支付方式
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="public-padding-v">
						<div class="payType-item text-center public-lineheight display-flex-between flex-align-center relative" @click="payType = 'fullPay'">
							<div>
								一次性支付&nbsp;
								<span class="public-tag-red font-white font-10" style="padding: 0.05rem 0.2rem;">租金9.8折</span>
							</div>
							<div class="checkbox">
								<span class="public-checkbox border-box block" :class="{active:payType == 'fullPay'}"></span>
							</div>
						</div>
						<span class="line-normal"></span>
						<div class="payType-item text-center public-lineheight display-flex-between flex-align-center" @click="payType = 'dividePay'">
							<div>
								分期支付
							</div>
							<div class="checkbox">
								<span class="public-checkbox border-box block" :class="{active:payType == 'dividePay'}"></span>
							</div>
						</div>
					</div>
					<div class="picker-btn font-16 text-center public-lineheight"  @click="pay">确定</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="deleteFlag">
				<div class="public-popup-shadow" @click="deleteFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-grey font-14 relative">
						确定删除此订单？
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="font-16 text-center public-lineheight"  @click="deleteOrder">确定</div>
					<div class="picker-btn font-16 text-center public-lineheight"  @click="deleteFlag = false">取消</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
const navTop = 3*clientWidth/18.75;

export default {
	data() {
		return {
			askData:{
			    "order_state" :1,
			    "size" :20,
			    "start":-1
			},
			more:1,
			switchShow:false,
			noDataFlag:false,
			listData: [],
			allFlag:true,
			headAlpha:0,
			typeList:[{id:0,name:'全部订单'},{id:1,name:'待付款'},{id:2,name:'已预约'},{id:3,name:'发货中'},{id:4,name:'体验期'},{id:5,name:'待评价'}],
			typeFlag:false,
  			selectProductFlag:false,
  			selectProductIndex:0,
  			selectProductMulti:false,
  			selectProductExpress:false,
  			selectProductArray:[],
  			selectProductTitle:'',
  			selectOrders:[],
  			fullPayFlag:false,//选择支付方式弹窗（一次性 / 分期）,
  			payType:'',
  			deleteFlag:false,//删除订单弹窗
  			sysTime:0
		}
	},
	mounted() {
		var that = this;
		if(localStorage.getItem("orderStateInit")){
			var state = localStorage.getItem("orderStateInit");
			if(state == 0){
				that.allFlag = true;
				that.askData.order_state = 1;
			}else{
				that.allFlag = false;
				that.askData.order_state = state;
			}
		}
		if(localStorage.getItem("twUser")){
			that.initData();
			window.addEventListener('scroll', that.scrollBottom)
		}else{
			that.goLogin();
		}
	},
	methods: {
		initData(){
			var that = this;
			that.askData.start = -1;
			that.more = 1;
			that.switchShow = false;
			that.noDataFlag = false;
			that.listData = [];
			if(that.allFlag){
            		that.askData.order_state = 1;
            };
			that.getData();
		},
		getData(){
			var that = this;
			if (that.more == 0 || that.switchShow) {
		        return false;
		    };
		    that.switchShow = true;
			var _url = that.allFlag?CONFIG.orderInfoList:CONFIG.orderInfoTypeList;
			network(_url, that.askData).then((res) => {
				that.switchShow = false;
				that.sysTime = res.head.sysTime;
				var details = res.details;
				if(details.length){
					var stamp = new Date().getTime();
					details.map((item,index) => {
						if(item.stateId == 1){
							item.countDownData = item.createDate * 1 + 30 * 60 * 1000 - stamp;
						}
					})
					that.listData = that.listData.concat(res.details);
					that.askData.start = res.result.start;
					that.more = res.result.more;
					if(that.allFlag){
                    		that.askData.order_state = res.result.state;
                    };
				}
				that.noDataFlag = that.listData.length?false:true;
				/*列表不要倒计时 但是谁知道哪天又要了先留着
				that.countdown();
				*/
			})
		},
		goOrderDetail(orderNo){
			var that = this;
			that.$router.push({path: '/orderDetails',query: { orderNo:orderNo}});
		},
		countdown:function(){
		    var that = this;
		    if(that.timeInterval ){
		        clearInterval(that.timeInterval);
		    };
		    that.timeInterval = setInterval(function(){
		    		var stamp = new Date().getTime();
		    		that.listData.map(item => {
		    			if(item.countDownData || item.countDownData === 0){
		    				if(item.countDownData <= 0){
		    					item.countDownData = 0;
		    					if(that.sysTime - item.createDate < 186000){
		    						clearInterval(that.timeInterval);
		    						Vue.toast('订单超时',{duration:1500})
		    						setTimeout(function(){
		    							 that.initData();
		    						},1000)
		    					}
		    				}else{
		    					item.countDownData = item.createDate * 1 + 30 * 60 * 1000 - stamp;
		    				}
		    			}
		    		})
		    },1000)
		},
		changeType(type){
			var that = this;
			if(type == 0){
            		that.allFlag = true;
            	}else{
            		that.allFlag = false;
            		that.askData.order_state = type;
            	};
            	localStorage.setItem("orderStateInit",type)
            	that.typeFlag = false;
            	that.initData();
		},
		scrollBottom(){
	    		var that = this;
	    		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if(scrollTop > navTop){
				that.headAlpha = 1;
			}else{
				that.headAlpha = scrollTop/navTop;
			}
			if((scrollTop + clientHeight) == scrollHeight){
				that.getData();
			}
	    },
	    //退款明细
  		refundBill(index){
  			var that = this;
  			if(!that.selectProductFlag){
	  			var order = that.listData[index];
	  			if(order.orders.length == 1){
	  				that.$router.push({path: '/refundBill',query: { orderNumber:order.orderNo}});
	  			}else{
	  				that.selectProductTitle = '查看';
	  				that.selectOrders = order.orders;
	  				that.selectProductIndex = 0;
	  				that.selectProductMulti = false;
	  				that.selectProductExpress = false;
	  				that.selectProductSubmit = that.refundBill;
	  				that.selectProductFlag = true;
	  			}
	  		}else{
	  			that.$router.push({path: '/refundBill',query: { orderNumber:that.selectOrders[that.selectProductIndex].orderNumber}});
	  		}
  		},
  		//订单跟踪
  		followExpress(index){
  			var that = this;
  			if(!that.selectProductFlag){
  				var order = that.listData[index];
	  			if(order.orders.length == 1){
	  				that.$router.push({path: '/express',query: { orderNumber:order.orders[0].orderNumber}});
	  			}else{
	  				that.selectProductTitle = '查看';
	  				that.selectOrders = order.orders;
	  				that.selectProductIndex = 0;
	  				that.selectProductMulti = false;
	  				that.selectProductExpress = true;
	  				that.selectProductSubmit = that.followExpress;
	  				that.selectProductFlag = true;
	  			}
  			}else{
  				that.$router.push({path: '/express',query: { orderNumber:that.selectOrders[that.selectProductIndex].orderNumber}});
  			}
  		},
  		//选择产品
  		selectProduct(index){
  			var that = this;
  			Vue.set(that.selectProductArray,index,!that.selectProductArray[index])
  		},
  		//归还
  		returnProduct(index){
  			var that = this;
  			if(!that.selectProductFlag){
  				var order = that.listData[index];
  				if(order.parentReturnFlag != 0){
	  				that.$router.push({path: '/returnResult',query: { orderNumber:order.orders[0].orderNumber}});
	  			}else if(order.orders.length == 1){
	  				that.$router.push({path: '/returnProduct',query: { orderNo:order.orderNo,selectProductArray:[0]}});
	  			}else {
	  				Indicator.open();
	  				network(CONFIG.orderNotReturned,{
	  					orderNo:order.orderNo
	  				},{method:'GET'}).then((res) => {
	  					Indicator.close();
	  					if(res.details.length && res.details.length == 1){
	  						that.$router.push({path: '/returnProduct',query: { orderNo:order.orderNo,selectProductArray:[0]}});
	  					}else if(res.details.length){
	  						that.selectProductTitle = '归还';
	  						that.selectOrders = res.details;
			  				that.selectProductArray = [];
			  				that.selectProductMulti = true;
			  				that.selectProductExpress = false;
			  				that.selectProductSubmit = that.returnProduct;
			  				that.selectProductFlag = true;
	  					}else{
	  						Vue.toast('无可归还产品',{duration:1500})
	  					}
					});
	  			}
  			}else{
  				var arr = [];
  				that.selectProductArray.map((item,index) => {
  					if(item){
  						arr.push(index)
  					}
  				})
  				if(arr.length){
  					that.$router.push({path: '/returnProduct',query: { orderNo:that.selectOrders[0].orderNo,selectProductArray:arr}});
  				}else{
  					Vue.toast('请选择归还产品',{duration:1500})
  				}
  			}
  		},
  		//续租
  		relet(index){
  			var that = this;
  			if(that.selectProductFlag){
  				var arr = [];
  				that.selectProductArray.map((item,index) => {
  					if(item){
  						arr.push(that.selectOrders[index].orderNumber)
  					}
  				})
  				if(arr.length){
  					that.$router.push({path: '/relet',query: { orderNumbers:arr.join(",")}});
  				}else{
  					Vue.toast('请选择续租产品',{duration:1500})
  				}
  			}else{
  				var order = that.listData[index];
  				if(order.orders.length == 1){
  					that.$router.push({path: '/relet',query: { orderNumbers:order.orderNo}});
  				}else{
  					Indicator.open();
	  				network(CONFIG.orderRenew,{
	  					orderNo:order.orderNo
	  				},{method:'GET'}).then((res) => {
	  					Indicator.close();
	  					if(res.details.length && res.details.length == 1){
	  						that.$router.push({path: '/relet',query: { orderNumbers:res.orders[0].orderNumber}});
	  					}else if(res.details.length){
	  						that.selectProductTitle = '续租';
			  				that.selectOrders = res.details;
			  				that.selectProductArray = [];
			  				that.selectProductMulti = true;
			  				that.selectProductExpress = false;
			  				that.selectProductSubmit = that.relet;
			  				that.selectProductFlag = true;
	  					}else{
	  						Vue.toast('无可续租产品',{duration:1500})
	  					}
					});
  				}
  			}
  		},
  		//发布口碑
  		appraiseAdd(index){
  			var that = this;
  			var index = index?index:0;
  			var product = that.listData[index].orders[0];
  			if(product.appraiseId && product.appraiseId.length){
  				that.$router.push({path: '/appraise',query: { productId:product.productId}});
  			}else{
  				that.$router.push({path: '/appraiseAdd',query: { productId:product.productId,orderNumber:product.orderNumber}});
  			}
  		},
  		// 申请售后
  		showService(item){
  			var that = this
			localStorage.setItem('serviceAfterSale', JSON.stringify(item))
  			if(item.supportFlag == 0) {
  				that.$router.push({path: '/self/serviceAfterSale',query: {state: 1, refundType: 2, orderNumber: item.orderNumber}});
  			} else {
  				that.$router.push({path: '/self/serviceSuccess',query: {state: 2, refundType: 2, orderNumber:item.orderNumber,type: that.askData.type}});
  			}
  		},
  		pay(index,type){
  			var that = this;
  			if(that.fullPayFlag){
  				if(that.payType){
  					 that.$router.push({path: '/pay',query: {orderNo:that.selectOrder.orderNo,rentPayType:that.payType}});
  				}else{
  					Vue.toast('请选择支付方式',{duration:1500})
  				}
  			}else if(index || index === 0){
  				that.selectOrder = that.listData[index];
  				if(type == 'deposit' || type == 'short'){
	  				 that.$router.push({path: '/pay',query: {orderNo:that.selectOrder.orderNo}});
	  			}else if(type == 'first'){
	  				that.fullPayFlag = true;
	  			}else if(type == 'divide'){
	  				that.$router.push({path: '/divideBill',query: {orderNo:that.selectOrder.orderNo}});
	  			}else{
  					that.$router.push({path: '/pay',query: {orderNo:that.selectOrder.orderNo}});
  				}
  			}
  		},
  		goBill(index){
  			var that = this;
  			var order = that.listData[index];
  			that.$router.push({path: '/orderBill',query: {orderNo:order.orderNo}});
  		},
  		deleteOrder(index){
  			var that = this;
  			if(that.deleteFlag){
  				Indicator.open();
  				that.deleteFlag = false;
  				network(CONFIG.orderInfoDelete,{
	  				orderNo:that.selectOrder.orderNo
	  			}).then((res) => {
	  				Indicator.close();
	  				Vue.toast('删除成功',{duration:1500});
	  				that.initData();
				});
  			}else{
  				that.deleteFlag = true;
  				that.selectOrder = that.listData[index];
  			}

  		},
  		// 取消订单
		orderCancel(index, type){
			var that = this
			localStorage.setItem('orderCancel', JSON.stringify(that.listData[index]))
			// if type == 1 申请退款
			if(type == 1) {
				if (that.listData[index].depositRefundStatus == 0) {
					if ( that.listData[index].anthb_pay_state == 1) {
						that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 4, orderNo: that.listData[index].orderNo, orderNumber: that.listData[index].orders[0].orderNumber}});
					} else if (that.listData[index].anthb_pay_state == 0){
						that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 3, orderNo: that.listData[index].orderNo, orderNumber: that.listData[index].orders[0].orderNumber}});
					} else {
						that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 0, orderNo: that.listData[index].orderNo, orderNumber: that.listData[index].orders[0].orderNumber}});
					}

				} else{
//					审核订单
					that.$router.push({path: '/self/serviceSuccess',query: {state: 2,refundType: 1, orderNumber: that.listData[index].orders[0].orderNumber}});
				}
			} else {
				that.$router.push({path: '/self/applyCancel',query: {title: '取消订单', orderNo: that.listData[index].orderNo}});
			}
		}
	},
	activated(){
		var that = this;
		window.addEventListener('scroll', that.scrollBottom)
	},
	deactivated(){
		var that = this;
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom)
	},
	destroyed(){
		var that = this;
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom)
	}
}
</script>

<style>
.order-page{
	padding-top: 3.5rem;
}
.order-page .page-bg{
	height: 8.9rem;
	z-index: 1;
}
.order-page .order-header{
	line-height: 2.2rem;
	z-index: 20;
}
.order-page .order-header .icon{
	width: 0.5rem;
}
.order-page .page-bg:after{
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	border-left: 18.75rem solid transparent;
	border-bottom:3.3rem solid #F7F7F7;
}
.order-page .order-list{
	position: relative;
	z-index: 2;
}
.order-page .order-list li{
	margin-bottom: 1.4rem;
	padding-top: 0.6rem;
}
.order-page .order-list li .state{
	left: 0.9rem;
	top: -0.4rem;
	width: 3.9rem;
	height: 1.4rem;
	line-height: 1.4rem;
}
.order-page .order-list .product-wrap{
	padding-bottom: 0.5rem!important;
	border-bottom: 0.05rem solid #EEEEEE;
}
.order-page .foot-wrap{
	height: 2.5rem;
	line-height: 1.4rem;
}
.order-page .btn-wrap .btn{
	width: 3.7rem;
	border: 0.05rem solid #333333;
	margin-left: 0.7rem;
	line-height: 1.4rem;
}
.order-page .btn-wrap .btn:first-child{
	margin-left: 0;
}
.order-page .btn-wrap .btn.active{
	color: #E6361F;
	border-color: #E6361F;
}
.order-page .noData-wrap-bg{
	left: 0.9rem;
	bottom: 0.9rem;
	right: 0.9rem;
	top: 3.6rem;
	border-radius:0.1rem ;
	z-index: 2;
}
.order-page .type-list{
	padding: 0 1.25rem 0.9rem 1.25rem;
}
.order-page .type-list li{
	padding: 0.9rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.order-page .type-list li:last-child{
	border: none;
}
.order-page .order-list .name{
	height: 1.9rem;
}
.order-page .public-card-content .product-wrap .content{
	width: 12rem;
}
</style>
