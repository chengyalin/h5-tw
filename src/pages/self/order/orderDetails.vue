<template>
	<div v-cloak v-if="mainData.orderNo" class="orderDetail-page public-card-page">
		<div class="public-padding-v">
			<div class="bg-white">
				<div class="orderDetail-header public-card-header bg-gradient-normal font-white relative font-12 public-padding-v">
					<p v-if="mainData.stateId == 17 && order.anthb_pay_state == 1" class="state font-20 font-bold">
						{{order.rentPaymentId?'待付押金':'待付款'}}
					</p>
					<p v-else class="state font-20 font-bold">{{mainData.state}}</p>
					<p v-if="mainData.stateId == 1" class="font-white-60">请在30分钟内支付，超时订单自动取消</p>
					<p v-else-if="mainData.stateId == 17 && order.anthb_pay_state == 1" class="font-white-60">
						{{order.rentPaymentId?'你的租金已付，请完成押金支付':'请在30分钟内支付，超时订单自动取消'}}
					</p>
					<p v-else-if="mainData.stateId == 14" class="font-white-60">订单已超时，如需再次租赁请重新下单</p>
					<p v-else class="font-white-60">{{mainData.stateValue}}</p>
					<div v-if="mainData.express.length && mainData.stateId != 17 && mainData.stateId != 18 && mainData.stateId != 19" class="express-wrap relative" @click="followExpress">
						<p class="express-icon vertical-middle font-bold">订单跟踪</p>
						<div class="public-arrow-right">
							<p class="font-bold font-14 line-ellipsis">{{mainData.express[0].stateDetails}}</p>
							<p class="line-ellipsis font-white-60">{{mainData.express[0].expressAcceptTime | formatTime9}}</p>
						</div>
					</div>
				</div>
				<div class="orderDetail-content public-card-content public-padding-v relative">
					<div class="address-wrap">
						<div class="title">
							<img class="icon vertical-middle" src="~@assets/img/box-black.svg" />
							<span class="font-12 font-bold vertical-middle">配送方式</span>
						</div>
						<p class="font-grey">{{order.selfId == 0?(order.rentType == '短租'?'顺丰到付':'顺丰包邮'):'上门自提'}}</p>
						<div class="title">
							<img class="icon vertical-middle" src="~@assets/img/address-black.svg" />
							<span class="font-12 font-bold vertical-middle">{{order.selfId == 0?'收货地址':'自提地址'}}</span>
						</div>
						<div v-if="order.selfId == 0">
							<p class="name font-grey">{{order.deliveryName}}&nbsp;&nbsp;&nbsp;{{order.deliveryPhone}}</p>
							<p class="font-grey font-12">{{order.deliveryAddress}}</p>
						</div>
						<div v-else>
							<p class="name font-grey">{{mainData.outAddress[0]}}&nbsp;&nbsp;&nbsp;{{mainData.outAddress[1]}}</p>
							<p class="font-grey font-12">{{mainData.outAddress[2]}}</p>
						</div>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div v-for="(item,index) in mainData.orders" class="product-item">
						<span v-if="index > 0" class="line-normal"></span>
						<div class="product-wrap clearfix">
							<div class="content float-left">
								<p class="name font-bold">{{item.productName}}</p>
								<div v-if="item.rentType == '短租'">
									<div class="point-item font-grey font-12 relative">
										<p class="vertical-middle">{{item.beginDate | formatTime2}}-{{item.endDate | formatTime2}} ({{item.time}}{{item.reletDay == 0?'':' + '+item.reletDay}}天)</p>
									</div>
									<div class="point-item font-grey font-12 relative">
										租金: {{item.originalRent | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{item.depositAmount | formatMoney}}
									</div>
								</div>
								<div v-else>
									<div class="point-item font-grey font-12 relative long">
										<p class="vertical-middle">{{item.skuName}}</p>
									</div>
									<div class="point-item font-grey font-12 relative">
										租金: {{item.productRent | formatMoney}}x{{item.allPayCycle}}期&nbsp;&nbsp;&nbsp;押金: {{item.depositAmount | formatMoney}}
									</div>
								</div>
								<div class="pack-btn font-12 font-green inline-block" @click="listFlagShow(index)">查看包装清单</div>
							</div>
							<div class="float-right text-right">
								<router-link :to="{path: '/productDetails', query: {productId: item.productId}}" class="image block bg-buffer bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}">
									<img class="icon" v-if="item.insuranceAmount > 0" src="~@assets/img/insurance-green.png" />
								</router-link>
								<span class="font-BBB font-12">×{{item.rentTotal}}</span>
							</div>
						</div>
						<div class="btn-wrap text-right font-12">
							<!--
							<span @click="orderCancel" v-if="(( item.orderStateId == 17) && ( mainData.isPayDeposit == 'N' || order.depositAmount == 0 ) && order.anthb_pay_state == 0 )" class="btn vertical-middle text-center">取消订单</span>
							-->
							<span @click="orderCancel" v-if="(item.orderStateId == 1 && item.rentType == '短租' && mainData.orders.length == 1) || ( item.orderStateId == 17 && item.anthb_pay_state == 1 && !item.rentPaymentId) || (( item.orderStateId == 17 || item.orderStateId == 18 ) && mainData.isPayDeposit == 'N' && item.anthb_pay_state == 0 )" class="btn vertical-middle text-center">取消订单</span>
							<span @click="orderCancel(1,index,item.orderStateId)" v-if="item.orderStateId == 2 || ( item.orderStateId == 17 && item.anthb_pay_state == 1 && item.rentPaymentId && order.anthb_pay_state == 1) || ( item.orderStateId == 18 && mainData.isPayDeposit == 'Y' && order.depositAmount != 0 )" class="btn vertical-middle text-center">{{item.refundFlag == 0?'申请退款':(item.refundFlag == 1?'退款中':'退款成功')}}</span>
							<span @click="refundSuccess(index)" v-if="item.orderStateId == 11 && mainData.orders.length > 1 && item.rentPaymentId" class="btn vertical-middle text-center">退款成功</span>
							<span @click="returnProduct(index)" v-if="mainData.orders.length > 1 && item.returnFlag != 0 && item.orderStateId == 5" class="btn vertical-middle text-center">{{item.returnFlag == 0?'归还':item.returnFlag == 1?'预约成功':'归还中'}}</span>
							<span @click="showService(item)" v-if="item.orderStateId == 5 && item.returnFlag == 0" class="btn vertical-middle text-center">{{item.supportFlag == 0?'申请售后':(item.supportFlag == 1?'售后中':'售后成功')}}</span>
							<span @click="appraiseAdd(index)" v-if="item.orderStateId == 5 || ( mainData.orders.length > 1 && ( item.orderStateId == 7 || item.orderStateId == 8 || item.orderStateId == 9 || item.orderStateId == 10 || item.orderStateId == 15 ))" class="btn vertical-middle text-center">{{item.appraiseId?'查看口碑':'发布口碑'}}</span>
							<span @click="goBill" v-if="item.rentType == '长租' && item.anthb_pay_state == 0 && ( item.orderStateId == 9 || item.orderStateId == 10 )" class="btn vertical-middle text-center">查看账单</span>
							<router-link :to="{path: '/productDetails', query: {productId: item.productId}}" v-if="mainData.orders.length > 1 && item.orderStateId == 14" class="btn vertical-middle text-center">重新下单</router-link>
						</div>
					</div>
					<span class="line-normal"></span>
					<div class="bill-wrap">
						<div v-if="order.rentType == '短租'">
							<div class="display-flex-between flex-align-center">
								<span class="font-bold">总租金</span>
								<span v-if="mainData.orders.length > 1" class="font-bold">{{mainData.totalAmount - mainData.depositAmount +  mainData.zmAmount * 1 + mainData.reletAmount * 1 + mainData.reletAmount * 1 | formatMoney}}</span>
								<span v-else class="font-bold">{{mainData.totalAmount - mainData.depositAmount +  mainData.zmAmount * 1 + mainData.reletAmount * 1 | formatMoney}}</span>
							</div>
							<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
								<span>租金</span>
								<span>{{mainData.originalRent | formatMoney}}</span>
							</div>
						</div>
						<div v-else>
							<div class="display-flex-between flex-align-center">
								<span class="font-bold">实际分期金额</span>
								<span class="font-bold">{{(mainData.totalAmount - order.depositAmount)/order.allPayCycle | formatSub}}x{{order.allPayCycle}}期</span>
							</div>
							<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
								<span>租金</span>
								<span>{{order.productRent | formatMoney}}x{{order.allPayCycle}}期</span>
							</div>
						</div>
						<div v-if="mainData.partsAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>配件</span>
							<span>{{mainData.partsAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.insuranceAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>安心享</span>
							<span>{{mainData.insuranceAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.couponAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>优惠券</span>
							<span>- {{mainData.couponAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.activitySaleAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>活动优惠</span>
							<span>- {{mainData.activitySaleAmount | formatMoney}}</span>
						</div>
						<div v-if="mainData.reletAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>续租费用</span>
							<span>{{mainData.reletAmount | formatMoney}}</span>
						</div>
						<div class="deposit-wrap display-flex-between flex-align-center">
							<div class="font-bold">
								<span>押金</span>
								<span v-if="mainData.depositAmount -  mainData.zmAmount == 0" class="public-tag-green font-white font-10">全免</span>
								<span v-else class="public-tag-black font-white font-10">可退</span>
							</div>
							<span class="font-bold">	{{mainData.depositAmount -  mainData.zmAmount | formatMoney}}</span>
						</div>
						<div class="text-right font-12">
							<span v-if="mainData.zmAmount > 0" class="font-lightGray text-through">{{mainData.depositAmount | formatMoney}}</span>
						</div>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div class="foot font-BBB font-12">
						<div class="display-flex-between">
							<p>订单编号: {{mainData.orderNo}}</p>
							<span class="copy-btn" v-clipboard:copy="mainData.orderNo" v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</span>
						</div>
						<p>下单时间: {{mainData.createDate | formatTime9}}</p>
					</div>
				</div>
			</div>
			<div v-if="mainData.remark" class="remark-wrap font-grey bg-white public-padding-v">
				备注：{{mainData.remark}}
			</div>
		</div>
		<div class="foot-wrap fixed left bottom right bg-white border-box public-padding-v display-flex-between flex-align-center font-12 iphoneX-footer fixd-center">
			<div>
				<p v-if="mainData.stateId == 1 || (mainData.stateId == 17 && !order.rentPaymentId && order.anthb_pay_state == 1)" class="font-grey">请在 {{countDownData | formatCountDown2}} 内支付</p>
			</div>
			<div class="btn-wrap">
				<span @click="orderCancel" v-if="(mainData.orders.length > 1 && mainData.stateId == 1) || (( mainData.stateId == 17 || mainData.stateId == 18 ) && ( mainData.isPayDeposit == 'Y' || order.depositAmount == 0 ) && order.anthb_pay_state == 0 )" class="btn vertical-middle text-center">取消订单</span>
				<span @click="pay('short')" v-if="order.orderType != 'ALIMI' && mainData.stateId == 1" class="btn vertical-middle text-center active">付款</span>
				<span @click="followExpress" v-if="( mainData.orders.length > 1 && mainData.stateId == 9 ) || (( order.anthb_pay_state == 1 || ( mainData.orders.length > 1 && mainData.parentReturnFlag != 0 )) && mainData.stateId == 5 ) || (( mainData.orders.length == 1 || order.rentType == '短租') && ( mainData.stateId == 7 || mainData.stateId == 8 ) && mainData.isFullPay == 'Y' ) || mainData.stateId == 2 || mainData.stateId == 4  || mainData.stateId == 15 || mainData.stateId == 16" class="btn vertical-middle text-center">跟踪订单</span>
				<span @click="relet" v-if="order.rentType == '短租' && ( mainData.parentReturnFlag == 0 || mainData.stateId != 5 ) && order.supportFlag == 0 && ( mainData.stateId == 4 || mainData.stateId == 5 || mainData.stateId == 16 )" class="btn vertical-middle text-center">续租</span>
				<span @click="returnProduct('')" v-if="( mainData.orders.length == 1 || ( mainData.orders.length > 1 && mainData.parentReturnFlag == 0 )) && mainData.stateId == 5" class="btn vertical-middle text-center">{{mainData.parentReturnFlag == 0?'归还':(mainData.parentReturnFlag == 1?'预约成功':'归还中')}}</span>
				<span @click="refundBill" v-if="mainData.stateId == 9 || mainData.stateId == 10 || (mainData.stateId == 11 && ( mainData.isPayDeposit == 'Y' || mainData.isPayRent == 'Y'))" class="btn vertical-middle text-center">退款明细</span>
				<span @click="goBill" v-if="order.anthb_pay_state == 0 && mainData.isFullPay == 'N' &&  order.payCycle == order.allPayCycle && (mainData.stateId == 2 || mainData.stateId == 4 || mainData.stateId == 5 || mainData.stateId == 8 || mainData.stateId == 16)" class="btn vertical-middle text-center">查看账单</span>
				<span @click="appraiseAdd('')" v-if="mainData.orders.length == 1 && ( mainData.stateId == 7 || mainData.stateId == 8 || mainData.stateId == 9 || mainData.stateId == 10 || mainData.stateId == 15 )" class="btn vertical-middle text-center">{{order.appraiseId?'查看口碑':'发布口碑'}}</span>
				<router-link :to="{path: '/productDetails', query: {productId: mainData.orders[0].productId}}" v-if="mainData.orders.length == 1 && mainData.stateId == 14" class="btn vertical-middle text-center">重新下单</router-link>
				<span @click="deleteFlag = true" v-if="mainData.stateId == 11 || mainData.stateId == 14 || mainData.stateId == 19" class="btn vertical-middle text-center">删除订单</span>
				<span @click="pay('divide')" v-if="order.orderType != 'ALIMI' && order.anthb_pay_state == 0 && mainData.isFullPay == 'N' && order.refundFlag != 1 && order.payCycle != order.allPayCycle && (mainData.stateId == 2 || mainData.stateId == 4 || mainData.stateId == 5 || mainData.stateId == 16)" class="btn vertical-middle text-center active">支付租金</span>
				<span @click="pay('deposit')" v-if="order.orderType != 'ALIMI' && order.anthb_pay_state == 0 && mainData.isPayDeposit == 'N' && mainData.stateId == 17" class="btn vertical-middle text-center active">支付押金</span>
				<span @click="orderCancel(1,0,mainData.stateId)" v-if="order.anthb_pay_state == 0 && order.depositAmount != 0 && mainData.isPayDeposit == 'Y' && mainData.stateId == 17" class="btn vertical-middle text-center">{{order.refundFlag == 0?'申请退款':(order.refundFlag == 1?'退款中':'退款成功')}}</span>
				<span @click="fullPayFlag = true" v-if="order.orderType != 'ALIMI' && mainData.stateId == 18" class="btn vertical-middle text-center active">{{mainData.isPayDeposit == 'Y'?'支付租金':'付款'}}</span>
				<span @click="pay('huabei')" v-if="order.anthb_pay_state == 1 && mainData.stateId == 17" class="btn vertical-middle text-center active">{{order.rentPaymentId?'支付押金':'付款'}}</span>
			</div>
		</div>
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
									<div v-if="selectProductExpress">
										<div class="point-item font-grey font-12 relative">
											<p class="vertical-middle">{{mainData.express[index].stateDetails}}</p>
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
										<img class="icon" v-if="item.insuranceAmount > 0" src="~@assets/img/insurance-green.png" />
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
					<div class="picker-btn font-16 text-center public-lineheight" @click="pay('first')">确定</div>
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
					<div class="font-16 text-center public-lineheight" @click="deleteOrder">确定</div>
					<div class="picker-btn font-16 text-center public-lineheight" @click="deleteFlag = false">取消</div>
				</div>
			</div>
		</transition>
		<!--
			包装清单 弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left fixd-center" v-if="listFlag">
				<div class="public-popup-shadow" @click="listFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						包装清单（{{packListData.packList.length}}{{order.parts.length?'+'+order.parts.length:''}}）
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="packList-wrap">
						<div class="product-wrap display-flex-between">
							<span class="image bg-buffer bg-cover" :style="{'background-image':'url('+packListData.imageSrc+')'}"></span>
							<p class="name font-bold">{{packListData.productName}}</p>
						</div>
						<ul class="packList-list  font-12">
							<li v-for="(item,index) in packListData.packList" class="display-flex-between">
								<div class="name line-ellipsis relative">{{item.name}}</div>
								<div class="count font-grey text-right">*{{item.count}}</div>
							</li>
						</ul>
						<div v-if="order.parts && order.parts.length" class="parts-wrap">
							<p class="title font-bold">选购配件</p>
							<ul class="packList-list font-12">
								<li v-for="(item,index) in order.parts" class="display-flex-between">
									<div class="name line-ellipsis relative">{{item.name}}</div>
									<div class="count font-grey text-right">*1</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="bg-blue font-white font-bold text-center public-lineheight"  @click="listFlag = false">完成</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import popupIframe from '@components/popupIframe';
	import packList from '@components/packList';
	import VueClipboard from 'vue-clipboard2';
	Vue.use(VueClipboard)

	export default {
		data() {
			return {
				askData: {},
				mainData: {
					express: [],
					orders: [{}],
					outAddress: []
				},
				order: {},
				countDownData: 30 * 1000 * 60,
				selectProductFlag: false,
				selectProductIndex: 0,
				selectProductMulti: false,
				selectProductExpress: false,
				selectProductArray: [],
				selectProductTitle: '',
				selectOrders: [],
				listFlag: false,
				packListData: {},
				fullPayFlag: false, //选择支付方式弹窗（一次性 / 分期）,
				payType: '',
				deleteFlag: false, //删除订单弹窗
				sysTime: 0
			}
		},
		created() {
			var that = this;
			if(localStorage.getItem("twUser")){
				that.askData.orderNo = that.$route.query.orderNo;
				that.initData();
			}else{
				that.goBack();
			}
		},
		mounted() {
			var that = this;
		},
		methods: {
			// 取消订单
			orderCancel(type, index, stateId) {
				var that = this
				if(type == 1) { // 申请退款
					localStorage.setItem('orderCancel', JSON.stringify(that.mainData.orders[index]))
					if(that.mainData.orders[index].refundFlag == 0) {
						if (stateId == 17 || stateId == 18) {
							if(that.mainData.orders[index].anthb_pay_state == 1) {
								that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 4, orderNumber: that.mainData.orders[index].orderNumber}});
							} else {
								that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 3, orderNumber: that.mainData.orders[index].orderNumber}});
							} 
						} else {
							that.$router.push({path: '/self/applyCancel',query: {title: '申请退款',type : 0, orderNumber: that.mainData.orders[index].orderNumber}});
						}
					} else {
						// 审核订单
						that.$router.push({path: '/self/serviceSuccess',query: {state: 2,refundType: 1, orderNumber: that.mainData.orders[index].orderNumber}});
					}
				} else { // 取消订单
					localStorage.setItem('orderCancel', JSON.stringify(that.mainData))
					that.$router.push({path: '/self/applyCancel',query: {title: '取消订单',orderNo: that.askData.orderNo}});
				}
			},
			refundSuccess(index){
				var that = this;
				that.$router.push({path: '/self/serviceSuccess',query: {state: 3,refundType: 1, orderNumber: that.mainData.orders[index].orderNumber}});
			},
			initData() {
				var that = this;
				localStorage.setItem('orderCancel', JSON.stringify(that.mainData))
				network(CONFIG.orderInfoDetailsInfo, that.askData).then((res) => {
					var details = res.details;
					that.sysTime = res.head.sysTime;
					details.outAddress = details.outAddress.split(",");
					var originalRent = 0,activitySaleAmount = 0;
					details.orders.map(item => {
						originalRent += item.originalRent;
						activitySaleAmount += item.activitySaleAmount * 1;
					})
					details.originalRent = originalRent;
					details.activitySaleAmount = activitySaleAmount;
					that.mainData = details;
					that.order = details.orders[0];
					//原租金 多订单的时候自己相加
					
					if(details.stateId == 1 || (details.stateId == 17 && !that.order.rentPaymentId && that.order.anthb_pay_state == 1)) {
						that.countdown();
					}
				});
			},
			copySuccess() {
				Vue.toast('复制成功', {
					duration: 1500
				})
			},
			copyError() {
				Vue.toast('复制失败', {
					duration: 1500
				})
			},
			countdown() {
				var that = this;
				if(that.timeInterval) {
					clearInterval(that.timeInterval);
				};
				that.timeInterval = setInterval(function() {
					if(that.countDownData <= 0) {
						that.countDownData = 0;
						if(that.sysTime - that.mainData.createDate < 186000) {
							clearInterval(that.timeInterval);
							Vue.toast('订单超时', {
								duration: 1500
							})
							setTimeout(function() {
								that.initData();
							}, 1000)
						}
					} else {
						that.countDownData = that.mainData.createDate * 1 + 30 * 60 * 1000 - (new Date().getTime());
					}
				}, 1000)
			},
			//退款明细
			refundBill() {
				var that = this;
				if(that.mainData.orders.length == 1 || that.selectProductFlag) {
					that.selectProductIndex = that.mainData.orders.length == 1 ? 0 : that.selectProductIndex;
					that.$router.push({
						path: '/refundBill',
						query: {
							orderNumber: that.mainData.orders[that.selectProductIndex].orderNumber
						}
					});
				} else {
					that.selectProductTitle = '查看';
					that.selectOrders = that.mainData.orders;
					that.selectProductIndex = 0;
					that.selectProductMulti = false;
					that.selectProductExpress = false;
					that.selectProductSubmit = that.refundBill;
					that.selectProductFlag = true;
				}
			},
			//订单跟踪
			followExpress() {
				var that = this;
				if(that.mainData.orders.length == 1 || that.selectProductFlag) {
					that.selectProductIndex = that.mainData.orders.length == 1 ? 0 : that.selectProductIndex;
					that.$router.push({
						path: '/express',
						query: {
							orderNumber: that.mainData.orders[that.selectProductIndex].orderNumber
						}
					});
				} else {
					that.selectProductTitle = '查看';
					that.selectOrders = that.mainData.orders;
					that.selectProductIndex = 0;
					that.selectProductMulti = false;
					that.selectProductExpress = true;
					that.selectProductSubmit = that.followExpress;
					that.selectProductFlag = true;
				}
			},
			//选择产品
			selectProduct(index) {
				var that = this;
				Vue.set(that.selectProductArray, index, !that.selectProductArray[index])
			},
			//归还
			returnProduct(index) {
				var that = this;
				if(that.selectProductFlag) {
					var arr = [];
					that.selectProductArray.map((item, index) => {
						if(item) {
							arr.push(index)
						}
					})
					if(arr.length || that.mainData.orders.length == 1) {
						that.$router.push({
							path: '/returnProduct',
							query: {
								orderNo: that.askData.orderNo,
								selectProductArray: arr
							}
						});
					} else {
						Vue.toast('请选择归还产品', {
							duration: 1500
						})
					}
				}else if(index || index === 0) {
					var order = that.mainData.orders[index];
					if(order.returnFlag == 0) {
						var arr = [index];
						that.$router.push({
							path: '/returnProduct',
							query: {
								orderNo: that.askData.orderNo,
								selectProductArray: arr
							}
						});
					} else {
						that.$router.push({
							path: '/returnResult',
							query: {
								orderNumber: order.orderNumber
							}
						});
					}
				} else if(that.mainData.parentReturnFlag != 0) {
					that.$router.push({
						path: '/returnResult',
						query: {
							orderNumber: that.mainData.orders[0].orderNumber
						}
					});
				} else {
					Indicator.open();
					network(CONFIG.orderNotReturned,{
	  					orderNo:that.askData.orderNo
	  				},{method:'GET'}).then((res) => {
						Indicator.close();
						if(res.details.length && res.details.length == 1) {
							that.$router.push({
								path: '/returnProduct',
								query: {
									orderNo: that.askData.orderNo,
									selectProductArray: [0]
								}
							});
						} else if(res.details.length) {
							that.selectProductTitle = '归还';
							that.selectOrders = res.details;
							that.selectProductArray = [];
							that.selectProductMulti = true;
							that.selectProductExpress = false;
							that.selectProductSubmit = that.returnProduct;
							that.selectProductFlag = true;
						} else {
							Vue.toast('无可归还产品', {
								duration: 1500
							})
						}
					});
				}
			},
			//续租
			relet() {
				var that = this;
				if(that.selectProductFlag) {
					var arr = [];
					that.selectProductArray.map((item, index) => {
						if(item) {
							arr.push(that.selectOrders[index].orderNumber)
						}
					})
					if(arr.length) {
						that.$router.push({
							path: '/relet',
							query: {
								orderNumbers: arr.join(",")
							}
						});
					} else {
						Vue.toast('请选择续租产品', {
							duration: 1500
						})
					}
				} else {
					Indicator.open();
					network(CONFIG.orderRenew,{
	  					orderNo: that.askData.orderNo
	  				},{method:'GET'}).then((res) => {
						Indicator.close();
						if(res.details.length && res.details.length == 1) {
							that.$router.push({
								path: '/relet',
								query: {
									orderNumbers: res.details[0].orderNumber
								}
							});
						} else if(res.details.length) {
							that.selectProductTitle = '续租';
							that.selectOrders = res.details;
							that.selectProductArray = [];
							that.selectProductMulti = true;
							that.selectProductExpress = false;
							that.selectProductSubmit = that.relet;
							that.selectProductFlag = true;
						} else {
							Vue.toast('无可续租产品', {
								duration: 1500
							})
						}
					});
				}
			},
			//发布口碑
			appraiseAdd(index) {
				var that = this;
				var index = index ? index : 0;
				var order = that.mainData.orders[index];
				if(order.appraiseId && order.appraiseId.length) {
					that.$router.push({
						path: '/appraise',
						query: {
							productId: order.productId
						}
					});
				} else {
					that.$router.push({
						path: '/appraiseAdd',
						query: {
							productId: order.productId,
							orderNumber: order.orderNumber
						}
					});
				}
			},
			listFlagShow(index) {
				var that = this;
				var packListData = that.mainData.orders[index];
				if(!packListData.packList) {
					var list = packListData.productList.split(",");
					for(let i = 0; i < list.length; i++) {
						let arr = list[i].split("*");
						list[i] = {
							name: arr[0],
							count: arr[1]
						}
					}
					packListData.packList = list;
				}
				that.packListData = packListData;
				that.listFlag = true
			},
			packListHidden() {
				var that = this;
				that.listFlag = false;
			},
			// 申请售后
			showService(item) {
				var that = this
				localStorage.setItem('serviceAfterSale', JSON.stringify(item))
				if(item.supportFlag == 0) {
					that.$router.push({path: '/self/serviceAfterSale',query: {state: 1,refundType: 2,orderNumber: item.orderNumber}});
				} else if (item.supportFlag == 1){
					that.$router.push({path: '/self/serviceSuccess',query: {state: 2,refundType: 2,orderNumber: item.orderNumber,type: that.askData.type}});
				} else {
					that.$router.push({path: '/self/serviceSuccess',query: {state: 3,refundType: 2,orderNumber: item.orderNumber,type: that.askData.type}});
				}
			},
			pay(type) {
				var that = this;
				if(type == 'deposit' || type == 'short') {
					that.$router.push({
						path: '/pay',
						query: {
							orderNo: that.askData.orderNo
						}
					});
				} else if(type == 'first') {
					if(that.payType) {
						that.$router.push({
							path: '/pay',
							query: {
								orderNo: that.askData.orderNo,
								rentPayType: that.payType
							}
						});
					} else {
						Vue.toast('请选择支付方式', {
							duration: 1500
						})
					}
				} else if(type == 'divide') {
					that.$router.push({
						path: '/divideBill',
						query: {
							orderNo: that.askData.orderNo
						}
					});
				} else {
					that.$router.push({
						path: '/pay',
						query: {
							orderNo: that.askData.orderNo
						}
					});
				}
			},
			goBill() {
				var that = this;
				that.$router.push({
					path: '/orderBill',
					query: {
						orderNo: that.askData.orderNo
					}
				});
			},
			deleteOrder() {
				var that = this;
				Indicator.open();
				that.deleteFlag = false;
				network(CONFIG.orderInfoDelete, {
					orderNo: that.askData.orderNo
				}).then((res) => {
					Indicator.close();
					Vue.toast('删除成功', {
						duration: 1500
					});
					that.$router.back();
				});
			}
		},
		components: {
			popupIframe,
			packList
		}
	}
</script>

<style>
	.orderDetail-page {
		padding-bottom: 4.5rem;
	}
	
	.orderDetail-page .orderDetail-header {
		padding-top: 0.7rem;
		padding-bottom: 0.8rem;
	}
	
	.orderDetail-page .orderDetail-header .state {
		margin-bottom: 0.1rem;
	}
	
	.orderDetail-page .orderDetail-header .express-wrap {
		padding-top: 0.7rem;
		margin-top: 0.6rem;
		border-top: 0.05rem solid rgba(255, 255, 255, 0.1);
		line-height: 0.9rem;
	}
	
	.orderDetail-page .orderDetail-header .express-icon {
		padding-left: 0.9rem;
		margin-bottom: 0.2rem;
		background: url(~@assets/img/express-white.svg) no-repeat left center;
		background-size: 0.5rem;
	}
	
	.orderDetail-page .address-wrap {
		padding-top: 0.1rem;
		padding-bottom: 0.4rem;
	}
	
	.orderDetail-page .address-wrap .title {
		margin-bottom: 0.3rem;
		margin-top: 0.7rem;
	}
	
	.orderDetail-page .address-wrap .title .icon {
		height: 0.6rem;
		margin-right: 0.3rem;
		position: relative;
		top: -0.04rem;
	}
	
	.orderDetail-page .address-wrap .name {
		margin-bottom: 0.1rem;
	}
	
	.orderDetail-page .line-dashed-wrap {
		margin: 0.5rem 0;
	}
	
	.orderDetail-page .orderDetail-content .deposit-wrap {
		padding-top: 0.7rem;
		padding-bottom: 0.2rem;
	}
	
	.orderDetail-page .orderDetail-content .bill-wrap {
		padding-top: 1rem;
		padding-bottom: 1.5rem;
	}
	
	.orderDetail-page .orderDetail-content .foot {
		padding-top: 0.2rem;
		padding-bottom: 0.7rem;
		line-height: 0.9rem;
	}
	
	.orderDetail-page .orderDetail-content .foot .copy-btn {
		border: 0.05rem solid #EEEEEE;
		padding: 0 0.4rem;
	}
	
	.orderDetail-page .remark-wrap {
		margin-top: 0.4rem;
		padding-top: 0.6rem;
		padding-bottom: 0.6rem;
	}
	
	.orderDetail-page .foot-wrap {
		box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.03);
		line-height: 1.4rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
	
	.orderDetail-page .btn-wrap .btn {
		width: 3.7rem;
		border: 0.05rem solid #333333;
		margin-left: 0.7rem;
		line-height: 1.4rem;
	}
	
	.orderDetail-page .btn-wrap .btn:first-child {
		margin-left: 0;
	}
	
	.orderDetail-page .btn-wrap .btn.active {
		color: #E6361F;
		border-color: #E6361F;
	}
	
	.orderDetail-page .orderDetail-content .product-wrap {
		padding-top: 0.6rem;
		padding-bottom: 0;
	}
	
	.orderDetail-page .product-item .pack-btn {
		/*margin-bottom: 0.5rem;*/
	}
	
	.orderDetail-page .product-item {
		padding-bottom: 0.5rem;
	}
	
	.orderDetail-page .product-item .btn-wrap .btn {
		margin-top: 0.9rem;
	}
	
	.orderDetail-page .payType-item {
		padding: 0.5rem 0;
	}
</style>
