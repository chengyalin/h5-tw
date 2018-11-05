<template>
	<div v-cloak class="placeOrder-page public-card-page has-footer has-footer-iphoneX">
		<div v-if = "mainData.agreementUrl" class="public-padding-v">
			<div class="bg-white">
				<div class="placeOrder-header public-card-header bg-gradient-normal font-white relative font-12 public-padding-v">
					<div class="display-flex-between flex-align-center font-white-60">
						<div class="switch text-center relative" :class="{active:selfFlag}" @click="selectSelfType">
							<span>快递</span><span>自提</span>
						</div>
						<div v-if="!selfFlag && mainData.product.rentType == '短租'">顺丰到付（预计{{sendTime | formatTime2}}发货）</div>
					</div>
					<div v-if="selfFlag" class="address-wrap relative">
						<p class="address-icon vertical-middle font-bold">{{selfList[selfIndex].selfName}}</p>
						<div class="public-arrow-right" @click="selectSelf">
							<p class="font-bold font-14">{{selfList[selfIndex].selfAddress[0]}}&nbsp;&nbsp;&nbsp;{{selfList[selfIndex].selfAddress[1]}}</p>
							<p class="line-ellipsis font-white-60">{{selfList[selfIndex].selfAddress[2]}}</p>
						</div>
					</div>
					<div v-else class="address-wrap relative">
						<p class="address-icon vertical-middle font-bold">收货人信息</p>
						<div v-if="mainData.delivery && mainData.delivery.name" class="public-arrow-right" @click="selectAddress">
							<p class="font-bold font-14">{{mainData.delivery.name}}&nbsp;&nbsp;&nbsp;{{mainData.delivery.phone}}</p>
							<p class="line-ellipsis font-white-60">{{mainData.delivery.province}}{{mainData.delivery.city}}{{mainData.delivery.area}}{{mainData.delivery.address}}</p>
						</div>
						<div v-else class="public-arrow-right" @click="selectAddress">
							<p class="font-bold font-14">请添加收货地址</p>
							<p class="line-ellipsis font-white-60">顺丰到付一般会根据收件地区提前2-3日发货</p>
						</div>
					</div>
				</div>
				<div class="placeOrder-content public-card-content public-padding-v relative">
					<div v-if = "listIds" class="product-wrap-list">
						<div v-for="(item,index) in mainData.products" class="product-wrap relative clearfix">
							<div class="content float-left">
								<p class="name font-bold line-ellipsis">{{item.productName}}</p>
								<div class="point-item font-grey font-12 relative">
									<p class="vertical-middle">{{item.beginDate | formatTime2}}-{{item.endDate | formatTime2}} ({{item.rentTime}}天）</p>
								</div>
								<div class="point-item font-grey font-12 relative">
									租金: {{item.originalRent | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{item.productDeposit | formatMoney}}
								</div>
								<div class="pack-btn font-12 font-green" @click="packListShow(index)">查看包装清单</div>
							</div>
							<div class="float-right text-right">
								<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+item.imageSrc+')'}"></div>
								<span class="font-BBB font-12">×{{item.rentTotal}}</span>
							</div>
						</div>
					</div>
					<div v-else class="product-wrap clearfix">
						<div class="content float-left">
							<p class="name font-bold line-ellipsis">{{mainData.product.productName}}</p>
							<div v-if="mainData.product.rentType == '短租'">
								<div class="point-item font-grey font-12 relative">
									<p class="vertical-middle">{{askData.begin_date | formatTime2}}-{{askData.end_date | formatTime2}} ({{askData.time}}天）</p>
									<img class="icon vertical-middle" src="~@assets/img/edit-green.svg" @click="calendarShow"/>
								</div>
								<div class="point-item font-grey font-12 relative">
									租金: {{shortRent * askData.time * askData.total / mainData.product.activityDisCount | formatMoney}}&nbsp;&nbsp;&nbsp;押金: {{mainData.product.price * askData.total | formatMoney}}
								</div>
								<div class="pack-btn font-12 font-green" @click="listFlag = true">查看包装清单</div>
							</div>
							<div v-else>
								<div class="point-item long font-grey font-12 relative" >
									<p class="vertical-middle">{{selectSku.skuName}}</p>
									<img class="icon absolute right top" src="~@assets/img/edit-green.svg" @click="skuShow"/>
								</div>
								<div class="point-item font-grey font-12 relative">
									租金: {{selectSku.skuPrice | formatMoney}}x{{selectSku.rentTime}}期&nbsp;&nbsp;&nbsp;押金: {{selectSku.skuDeposit | formatMoney}}
								</div>
								<div class="pack-btn font-12 font-green" @click="listFlag = true">查看包装清单</div>
							</div>
						</div>
						<span class="image float-right bg-buffer bg-cover" :style="{'background-image':'url('+mainData.product.image_src+')'}"></span>
					</div>
					<span v-if="mainData.product && mainData.product.rentType == '短租'" class="line-normal"></span>
					<div v-if="mainData.product && mainData.product.rentType == '短租'" class="display-flex-between">
						<span class="font-bold">租赁数量</span>
						<div>
							<div class="count-wrap text-center display-flex-between flex-align-center">
								<span class="btn minus-btn font-20 relative" :class="{active:askData.total <= 1}" @click="changeCount('minus')"></span>
								<span class="font-bold">{{askData.total}}</span>
								<span class="btn plus-btn font-20 relative" :class="{active:askData.total >= mainData.product.spaceStock}" @click="changeCount('plus')"></span>
							</div>
						</div>
					</div>
					<span v-if="mainData.parts && mainData.parts.length" class="line-normal"></span>
					<div v-if="mainData.parts && mainData.parts.length" class="display-flex-between flex-align-center" @click="partsFlag = true">
						<span class="font-bold">选购配件</span>
						<div>
							<span class="font-BBB font-12 public-arrow-right">{{partsAmount && partsAmount > 0?'':'请选择'}}</span>
						</div>
					</div>
					<div v-if="partsAmount">
						<div v-if="item.check" v-for="(item,index) in mainData.parts" class="parts-item display-flex-between flex-align-center font-12 font-grey">
							<span class="name">{{item.name}}</span>
							<span>{{item.price | formatMoney}}</span>
						</div>
					</div>
					<span v-if = "(listIds && insurancePluralFlag) || (mainData.product.rentType == '短租' && mainData.product.insuranceFlag != 0) || (mainData.product.rentType == '长租' && selectSku.skuInsuranceFlag != 0)" class="line-normal"></span>
					<div v-if = "(mainData.product.rentType == '短租' && mainData.product.insuranceFlag != 0) || (mainData.product.rentType == '长租' && selectSku.skuInsuranceFlag != 0)" class="display-flex-between flex-align-center" @click="insuranceFlag = true">
						<div>
							<span class="font-bold">安心享 {{mainData.product.insuranceFlag == 2 || selectSku.skuInsuranceFlag == 2?'(必选）':''}}</span>
							<p class="tip font-12 font-BBB">可降低产品意外损坏赔付费用</p>
						</div>
						<div>
							<div v-if="askData.insurance_flag == 'Y'" class="font-grey font-12 public-arrow-right">
								<span v-if="mainData.product.rentType == '短租'">{{mainData.product.insuranceAmount*askData.total | formatMoney}}</span>
								<span v-else>{{selectSku.skuInsurance | formatMoney}}</span>
							</div>
							<span v-else class="font-BBB font-12 public-arrow-right">请选择</span>
						</div>
					</div>
					<div v-else-if = "listIds && insurancePluralFlag" class="display-flex-between flex-align-center" @click="insuranceFlag = true">
						<div>
							<span class="font-bold">安心享</span>
							<p class="tip font-12 font-BBB">可降低产品意外损坏赔付费用</p>
						</div>
						<div>
							<div v-if="insuranceAmount && insuranceAmount > 0" class="font-grey font-12 public-arrow-right">
								<span >{{insuranceAmount | formatMoney}}</span>
							</div>
							<span v-else class="font-BBB font-12 public-arrow-right">请选择</span>
						</div>
					</div>
					<span class="line-normal"></span>
					<div class="display-flex-between flex-align-center" @click="selectCoupon">
						<span class="font-bold">优惠券</span>
						<div>
							<span v-if="discountAmount != 0" class="font-grey font-12 public-arrow-right">- {{discountAmount | formatMoney}}</span>
							<span v-else-if="couponConditionalCount != 0" class="font-BBB font-12 public-arrow-right">请选择</span>
							<span v-else class="font-BBB font-12">暂无可用优惠券</span>
						</div>
					</div>
					<div class="line-dashed-wrap relative"></div>
					<div v-if="listIds">
						<div class="display-flex-between flex-align-center">
							<span class="font-bold">总租金</span>
							<span class="font-bold">	{{mainData.rentAmount * 1 + partsAmount * 1 + insuranceAmount * 1 - discountAmount * 1 | formatMoney}}</span>
						</div>
						<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>租金</span>
							<span>	{{mainData.totalOriginalRent | formatMoney}}</span>
						</div>
					</div>
					<div v-else-if="mainData.product.rentType == '短租'">
						<div class="display-flex-between flex-align-center">
							<span class="font-bold">总租金</span>
							<span class="font-bold">{{totalAmount - (askData.total * mainData.product.price - zmAmountReal) | formatMoney}}</span>
						</div>
						<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>租金</span>
							<span>{{shortRent * askData.time * askData.total / mainData.product.activityDisCount | formatMoney}}</span>
						</div>
					</div>
					<div v-else>
						<div class="display-flex-between flex-align-center">
							<span class="font-bold">实际分期金额</span>
			            		<span class="font-bold">{{(totalAmount-depositAmount)/selectSku.rentTime | formatSub}}x{{selectSku.rentTime}}期</span>
						</div>
						<div class="small-item display-flex-between flex-align-center font-12 font-lightGray">
							<span>租金</span>
							<span>{{selectSku.skuPrice | formatMoney}}x{{selectSku.rentTime}}期</span>
						</div>
					</div>
					
					<div v-if="partsAmount && partsAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>配件</span>
						<span>{{partsAmount | formatMoney}}</span>
					</div>
					<!--
						insuranceFlag :0:不可选 1:可选 2:必选
					-->
					<div v-if="insuranceAmount && insuranceAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>安心享</span>
						<span>{{insuranceAmount | formatMoney}}</span>
					</div>
					<div v-else-if="askData.insurance_flag == 'Y' && ((mainData.product.rentType == '短租' && mainData.product.insuranceFlag != 0) || (mainData.product.rentType == '长租' && selectSku.skuInsuranceFlag != 0))" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>安心享</span>
						<span v-if = "mainData.product.rentType == '短租'">{{mainData.product.insuranceAmount * askData.total | formatMoney}}</span>
						<span v-else>{{selectSku.skuInsurance * askData.total | formatMoney}}</span>
					</div>
					<div v-if="discountAmount != 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>优惠券</span>
						<span>- {{discountAmount | formatMoney}}</span>
					</div>
					<!--
						activityType :0:折扣 1:买赠 2:减免
					-->
					<div v-if="activityAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>活动优惠</span>
						<span>- {{activityAmount | formatMoney}}</span>
					</div>
					<div v-else-if="listIds && mainData.activitySaleAmount > 0" class="small-item display-flex-between flex-align-center font-12 font-lightGray">
						<span>活动优惠</span>
						<span>- {{mainData.activitySaleAmount | formatMoney}}</span>
					</div>
					<div class="deposit-wrap display-flex-between flex-align-center">
						<div class="font-bold">
							<span>押金</span>
							<span v-if="(listIds && mainData.depositAmount - mainData.reliefAmount == 0) || (mainData.product.rentType == '长租' && depositAmount == 0) || (mainData.product.rentType == '短租' && ( askData.total * mainData.product.price - zmAmountReal == 0 ))" class="public-tag-green font-white font-10">全免</span>
							<span v-else class="public-tag-black font-white font-10">可退</span>
						</div>
						<span v-if = "listIds">{{mainData.depositAmount - mainData.reliefAmount | formatMoney}}</span>
						<span v-else-if="mainData.product.rentType == '短租'" class="font-bold">{{ askData.total * mainData.product.price - zmAmountReal | formatMoney}}</span>
						<span v-else class="font-bold">{{ depositAmount | formatMoney}}</span>
					</div>
					<div class="text-right font-12">
						<div v-if = "mainData.checkFlag == 0" class="font-lightGray text-through">
							<span v-if = "listIds">{{mainData.depositAmount | formatMoney}}</span>
							<span v-else-if = "mainData.product.rentType == '短租'">{{askData.total * mainData.product.price | formatMoney}}</span>
							<span v-else>{{selectSku.skuDeposit | formatMoney}}</span>
						</div>
						<span v-else class="inline-block font-green" @click="zhima">授权芝麻信用，立即减免押金 &gt;</span>
					</div>
				</div>
			</div>
			<div v-if="mainData.product.rentType == '长租'" class="huabei-wrap bg-white public-padding-v display-flex-between">
				<div>
					<p class="font-bold">花呗分期付租金（推荐）</p>
					<p class="font-12 font-grey">订单免审核，极速发货</p>
				</div>
				<div>
					<span class="public-switch bg-blue block relative" :class="{'active':askData.antHbState == 0}" @click="huabeiShow"></span>
				</div>
			</div>
			<div class="remark-wrap bg-white public-padding-v" @click="editRemark">
				<p v-if="askData.app_remark && askData.app_remark.trim().length" class="public-arrow-right font-grey line-ellipsis">{{askData.app_remark}}</p>
				<p v-else class="public-arrow-right font-BBB">添加备注信息</p>
			</div>
			<div class="agree-wrap font-BBB font-12">
				<div class="checkbox vertical-middle">
					<span class="public-checkbox border-box block" :class="{'active':agreeFlag}" @click="agreeFlag = !agreeFlag"></span>
				</div>
				<span class="vertical-middle">我同意</span>
				<span v-for = "(item,index) in mainData.agreements" class="vertical-middle text-underline" @click="iframeToggle(item.agreementUrl)">{{item.agreementName}}</span>
			</div>
		</div>
		<div v-if = "mainData.agreementUrl">
			<div v-if="listIds" class="foot-wrap fixed left bottom right bg-white border-box fixd-center iphoneX-footer">
				<p class="font-blue font-bold line-ellipsis">支付金额：¥{{totalAmount | formatInt}}<span class="font-12">{{totalAmount | formatDecimal}}</span></p>
				<p class="rent font-10 font-lightGray">总租金: {{mainData.rentAmount * 1 + partsAmount * 1 + insuranceAmount * 1 - discountAmount * 1 | formatMoney}}</p>
				<span class="btn absolute top right bg-blue font-white font-bold text-center" @click="submit">确认支付</span>
			</div>
			<div v-else-if="mainData.product.rentType == '短租'" class="foot-wrap fixed left bottom right bg-white border-box fixd-center iphoneX-footer">
				<p class="font-blue font-bold line-ellipsis">支付金额：¥{{totalAmount | formatInt}}<span class="font-12">{{totalAmount | formatDecimal}}</span></p>
				<p class="rent font-10 font-lightGray">总租金: {{totalAmount - (askData.total * mainData.product.price - zmAmountReal) | formatMoney}}</p>
				<span class="btn absolute top right bg-blue font-white font-bold text-center" @click="submit">确认支付</span>
			</div>
			<div v-else-if="askData.antHbState == 1" class="foot-wrap fixed left bottom right bg-white border-box fixd-center iphoneX-footer">
				<p class="font-bold line-ellipsis" style="line-height: 1.7rem;">花呗分期：{{(totalAmount-depositAmount)/selectSku.rentTime | formatSub}}x{{selectSku.rentTime}}期</p>
				<span class="btn absolute top right bg-blue font-white font-bold text-center" @click="submit">确认支付</span>
			</div>
			<div v-else class="foot-wrap fixed left bottom right bg-white border-box fixd-center iphoneX-footer">
				<p class="font-bold line-ellipsis">预授押金：{{depositAmount | formatMoney}}</p>
				<p class="rent font-10 font-lightGray">预付押金可极大提高审核通过率</p>
				<span class="btn absolute top right bg-blue font-white font-bold text-center" @click="submit">提交审核</span>
			</div>
		</div>
		<!--
			包装清单 弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left fixd-center" v-if="listFlag">
				<div class="public-popup-shadow" @click="listFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						包装清单（{{mainData.product.list.length}}{{partsCount?'+'+partsCount:''}}）
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="packList-wrap">
						<div class="product-wrap display-flex-between">
							<span class="image bg-buffer bg-cover" :style="{'background-image':'url('+mainData.product.image_src+')'}"></span>
							<p class="name font-bold">{{mainData.product.productName}}</p>
						</div>
						<ul class="packList-list  font-12">
							<li v-for="(item,index) in mainData.product.list" class="display-flex-between">
								<div class="name line-ellipsis relative">{{item.name}}</div>
								<div class="count font-grey text-right">*{{item.count}}</div>
							</li>
						</ul>
						<div v-if="mainData.parts && mainData.parts.length && partsCount" class="parts-wrap">
							<p class="title font-bold">选购配件</p>
							<ul class="packList-list font-12">
								<li v-if = "item.check" v-for="(item,index) in mainData.parts" class="display-flex-between">
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
		<!--
			意外保险弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="insuranceFlag">
				<div class="public-popup-shadow" @click="insuranceFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						安心享
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<ul v-if="listIds" class="insuranceFlag-list">
						<li v-for="(item,index) in mainData.insurances" v-if="item.insuranceFlag != 0" class="relative" @click="selectInsurance(index)">
							<div class="checkbox absolute left">
								<span class="public-checkbox border-box block" :class="{'active':item.check || item.insuranceFlag == 2}"></span>
							</div>
							<div class="main display-flex-between">
								<span class="image bg-buffer bg-cover" :style="{'background-image':'url('+mainData.products[index].imageSrc+')'}" ></span>
								<div class="content">
									<div class="name-wrap display-flex-between">
										<p class="name font-bold line-ellipsis">{{item.productName}}</p>
										<div class="font-blue">
											<span class="font-10">￥</span><span class="font-16">{{item.insuranceAmount}}</span>
										</div>
									</div>
									<p class="font-lightGray font-12">
										<span v-for="item in mainData.products[index].insuranceRange">{{item}}</span>
									</p>
								</div>
							</div>
						</li>
					</ul>
					<ul v-else class="insuranceFlag-list">
						<li class="relative" @click="selectInsurance">
							<div class="checkbox absolute left">
								<span class="public-checkbox border-box block" :class="{'active':askData.insurance_flag == 'Y'}"></span>
							</div>
							<div class="main display-flex-between">
								<span class="image bg-buffer bg-cover" :style="{'background-image':'url('+mainData.product.image_src+')'}" ></span>
								<div class="content">
									<div class="name-wrap display-flex-between">
										<p class="name font-bold line-ellipsis">{{mainData.product.productName}}</p>
										<div v-if="mainData.product.rentType == '短租'" class="font-blue">
											<span class="font-10">￥</span><span class="font-16">{{mainData.product.insuranceAmount}}</span>
										</div>
										<div v-else class="font-blue">
											<span class="font-10">￥</span><span class="font-16">{{selectSku.skuInsurance}}</span>
										</div>
									</div>
									<p class="font-lightGray font-12">
										<span v-for="item in mainData.product.insuranceRange">{{item}}</span>
									</p>
								</div>
							</div>
						</li>
					</ul>
					<div class="bg-blue font-white font-bold text-center public-lineheight"  @click="insuranceFlag = false">完成</div>
				</div>
			</div>
		</transition>
		<!--
			选购配件 弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="partsFlag">
				<div class="public-popup-shadow" @click="partsFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						选购配件
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<ul class="parts-list">
						<li class="display-flex-between flex-align-center public-arrow-right" v-for = "(item,index) in mainData.parts">
							<div class="checkbox">
								<span class="public-checkbox border-box block" :class="{'active':item.check}" @click="selectParts(index)"></span>
							</div>
							<p class="name line-clamp-2" @click="packShow(index)">{{item.name}}</p>
							<span class="price font-12 text-right" @click="packShow(index)">{{item.price | formatMoney}}</span>
						</li>
						<li class="tip font-12 font-grey">
							<p>配件费用不包含在总租金内，将在首期支付中扣除</p>
							<p>配件为一次性买断，租期结束无需归还</p>
						</li>
					</ul>
					<div class="bg-blue font-white font-bold text-center public-lineheight"  @click="partsFlag = false">完成</div>
				</div>
			</div>
		</transition>
		<!--
			配件 弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="packFlag">
				<div class="public-popup-shadow black"></div>
				<div class="absolute width-full center">
					<swipe class="packList-swipe relative" :auto = '0' :showIndicators = "false" :defaultIndex = "defaultIndex" @change = "packSwipe">
					    <swipe-item v-for="item in mainData.parts">
						    	<div class="swipe-item text-center">
						    		<div class="image bg-cover bg-buffer" :style="{'background-image':'url('+item.image+')'}"></div>
							    	<p class="name font-white line-clamp-2">{{item.name}}</p>
							    	<p class="font-green font-16">{{item.price | formatMoney}}</p>
						    	</div>
					    </swipe-item>
					</swipe>
				</div>
				<div class="packList-swipe-header fixed left top right text-center font-white font-bold font-16">
					<span class="close-btn absolute" @click="packFlag = false"></span>
					{{packIndex}} / {{mainData.parts.length}}
				</div>
			</div>
		</transition>
		<!--
			sku选择弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="skuFlag">
				<div class="public-popup-shadow" @click="skuFlag = false"></div>
				<div class="longSelect-wrap absolute bottom left right">
					<div class="product-wrap public-padding-v">
						<span class="image vertical-bottom bg-cover bg-buffer" :style="{'background-image':'url('+mainData.product.image_src+')'}"></span>
						<div class="content vertical-bottom">
							<div v-if="selectSkuPopup.skuId" class="public-price-wrap">
								<span class="vertical-bottomd font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-26 font-bold">{{selectSkuPopup.skuPrice | formatInt}}</span><span class="vertical-bottom font-red font-10">{{selectSkuPopup.skuPrice | formatDecimal}}</span>
								<span class="vertical-bottom font-grey font-10">/月</span>
							</div>
							<div v-else class="public-price-wrap">
								<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-26 font-bold">{{mainData.product.rent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{mainData.product.rent | formatDecimal}}</span>
								<span class="vertical-bottom font-grey font-10">/月</span>
							</div>
							<p v-if="selectStrPopup" class="line-ellipsis">已选：{{selectStrPopup}}</p>
							<p v-else>选择：租赁时长、属性</p>
						</div>
					</div>
					<div class="scroll-wrap bg-white">
						<ul class="longSelect-list">
							<li v-for="(item,index) in longDataPopup.categorys">
								<p class="type font-bold">{{item.typeName}}</p>
								<span v-for="(cItem,cIndex) in item.propertys" @click="selectLong(index,cIndex)" class="select-item font-12 font-grey vertical-middle text-center" :class="{'active':cItem.select,'disable':cItem.disable}">{{cItem.propertyValue}}</span>
							</li>
						</ul>
					</div>
					<div class="bg-blue font-white font-bold text-center public-lineheight" @click="skuSave">确认</div>
				</div>
			</div>
		</transition>
		<!--
			确认不使用弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="huabeiFlag">
				<div class="public-popup-shadow"  @click="huabeiFlag = false"></div>
				<div class="confirm-popup fixed bg-white center text-center">
					<img class="image" src="~@assets/img/huabei-person.png"/>
					<p class="title font-16 font-bold">确定不使用花呗分期付款？</p>
					<p class="tip inline-block font-12 font-grey">花呗分期可享全期免手续费服务，</br> 无需审核闪电发货</p>
					<div class="btn bg-blue font-white font-bold public-lineheight" @click="huabeiFlag = false">继续使用</div>
					<span class="inline-block font-12 font-grey" @click="askData.antHbState = 0;huabeiFlag = false">放弃花呗，不使用</span>
				</div>
			</div>
		</transition>
		<!--
			确认不支付押金弹窗
		-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="depositFlag">
				<div class="public-popup-shadow" @click="depositFlag = false"></div>
				<div class="confirm-popup fixed bg-white center text-center">
					<img class="image" src="~@assets/img/deposit-confirm.png"/>
					<p class="title font-16 font-bold">预授押金可提高订单通过率</p>
					<p class="tip inline-block font-12 font-grey">订单在审核状态中可随时预授押金</p>
					<div class="btn bg-blue font-white font-bold public-lineheight" @click="submit('Y')">预授押金</div>
					<span class="inline-block font-12 font-grey" @click="submit">不用了，提交订单</span>
				</div>
			</div>
		</transition>
		<calendar :tplData = "tplData" :mainData = "mainData" :calendarFlag = "calendarFlag" :askData = "askData" :price = "price" @calendarHidden="calendarHidden" @submit="calendarSave" ref="calendar"></calendar>
		<popupIframe :popupIframeFlag = "popupIframeFlag" :popupIframeUrl = "popupIframeUrl" @iframeToggle="iframeToggle"></popupIframe>
		<div id="alipayWrap"></div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Swipe, SwipeItem } from 'vue-swipe';
import popupIframe from '@components/popupIframe';
import calendar from '@components/calendar';
import { getDiffByStamp , getMapSendDay } from '@assets/js/mUtils'
export default {
  	data() {
  		return {
  			askData:{
  				selfId:0,
  				self_id:0,
  				total:1,
  				app_remark:'',
  				begin_date:'',
  				end_date:'',
  				time:0,
  				insurance_flag:'N',
  				antHbState:1,
  				client:'web'
  			},
  			popupIframeFlag:false,//加载iframe弹出框
            popupIframeUrl:"",//iframe弹出框链接
  			totalAmount:0,
  			mainData:{
  				agreements:[],
  				product:{},
  				delivery:"",
  				coupon:[],
  				parts:[],
  				//多订单数据
  				selfs:[],
  				lists:[]
  			},
  			selfFlag:false,
  			selfList:[],
  			selfIndex:0,
  			mapSendDay:3,
  			agreeFlag:false,//是否同意租赁协议
  			zmAmountReal:0,
  			couponIndex:null,
  			couponSelect:null,
  			couponConditionalCount:0,
  			discountAmount:0,
  			shortRent:0,
  			listFlag:false, //包装清单弹出框，
  			insuranceFlag:false,//意外保险弹出框,
  			calendarFlag:false,//短租时间选择器弹出框
  			tplData:{//时间选择器数据
  				productId:0,
	            	setStatus:0,
	            	startStamp:null,
	            	endStamp:null,
	            	optionalDate:[],
	            	hasEmptyGrid:[],
	            	empytGrids:[],
	            	public_year:[],
	            	public_month:[],
	            	public_days:[],
            },
  			price:[],//短租 价格曲线
  			longData:{
            		categorys:[],
            		insuranceRange:[],
            		parts:[],
            		skus:[]
            },
            longDataPopup:{
            		categorys:[],
            		insuranceRange:[],
            		parts:[],
            		skus:[]
            },
            skuFlag:false,//sku选择器弹出框
            selectArr:[],
            selectStrArr:[],
            selectStr:"",
            selectSku:{},
            selectArrPopup:[],
            selectStrArrPopup:[],
            selectStrPopup:"",
            selectSkuPopup:{},
            depositAmount:0,
            partsFlag:false,//配件弹窗，
            huabeiFlag:false,//是否不使用花呗弹窗
            depositFlag:false,//是否不支付押金弹窗
            listIds:'',
            insuranceAmount:0,//保险金额
            insurancePluralFlag:true,//多订单有可选的保险
            partsAmount:0,//配件金额，
            partsCount:0,//配件个数
            packFlag:false,//配件查看flag
            defaultIndex:0,
           	packIndex:0,
           	activityAmount:0//活动优惠金额
  		}
  	},
  	created(){
  		var that = this;
  		that.pageInit();
  	},
  	mounted(){
  		var that = this;
  		eventBus.$on('selectAddress', function(data){
  			Vue.set(that.mainData,'delivery', data);
	    }.bind(that));
	    eventBus.$on('selfIndex', function(data){
	        that.selfIndex = data;
	    }.bind(that));
	    eventBus.$on('remark', function(data){
	        that.askData.app_remark = data;
	    }.bind(that));
  		eventBus.$on('couponIndex', function(data){
	        that.couponIndex = data;
			that.couponSelect = data == null?null:that.mainData.coupon[that.couponIndex];
		    that.calculate();
	    }.bind(that));
	    if(!localStorage.getItem("mapSendDay")){
			getMapSendDay(function(){
				that.mapSendDay = localStorage.getItem("mapSendDay")
			})
		}else{
			that.mapSendDay = localStorage.getItem("mapSendDay")
		}
  	},
  	/*
  	//本地刷新 体验不好 但是没办法了 卧槽也有大坑
  	beforeRouteEnter(to, from, next) {
  		if(from.path == '/productDetails' || from.path == '/self/shoppingCart'){
  			window.location.reload();
  		}
		next();
	},
	*/
	//此方式体验好 但是有大坑 暂时无法解决 
  	beforeRouteLeave(to, from, next) {
		if (to.path == "/productDetails" || to.path == "/pay" || to.path == "/paySuccess" || to.path == '/shoppingCart' || to.path == '/login') {
			from.meta.keepAlive = false;
		} else {
			from.meta.keepAlive = true;
		}
		next();
	},
  	methods:{
  		pageInit(){
  			var that = this;
  			if(that.$route.query.listIds){
	  			that.askData.antHbState = 0;
	  			that.listIds = that.$route.query.listIds.split(",");
	  		}else{
		  		that.askData.product_id = that.$route.query.productId ;
		  		that.tplData.productId = that.askData.product_id;
	  		}
	  		that.initData();
	  	},
  		initData(){
  			var that = this;
  			if(that.listIds){
  				network(CONFIG.shoppingOrderInit,{listIds:that.listIds}).then((res) => {
  					var details = res.details;
  					details.insurances.map(item => {
  						if(item.insuranceFlag == 1 || item.insuranceFlag == 2){
  							item.check = true;
  						}
  					})
  					var arr = []
  					details.lists.map(item => {
  						item.products.map(cItem => {
  							arr.push(cItem)
  						})
  					})
  					details.product = {};
  					details.products = arr;
	  				that.mainData = details;
	  				var selfList = details.selfs;
	  				selfList.map(function(item,index){
	  					item.selfAddress = item.selfAddress.split(",");
	  					if(item.selected){
	  						that.selfIndex = index;
	  					}
	  				});
	  				that.selfList = selfList;
	  				that.calculate(true);
				});
  			}else{
  				network(CONFIG.orderInfo,{product_id:that.askData.product_id}).then((res) => {
	  				var mainData = res.details;
	  				if(mainData.product.rentType == '短租'){
	  					var placeOrderData = JSON.parse(localStorage.getItem('placeOrderData'));
				  		that.askData.begin_date = placeOrderData.startStamp;
				  		that.askData.end_date = placeOrderData.endStamp;
				  		that.askData.time = getDiffByStamp(that.askData.begin_date,that.askData.end_date);
				  		that.price = placeOrderData.price;
				  		that.sendTime = ((that.askData.begin_date - (that.mapSendDay-1) * 24 * 3600 * 1000) < Date.parse(new Date())) ? Date.parse(new Date()):(that.askData.begin_date - that.mapSendDay * 24 * 3600 * 1000);
	  					that.askData.insurance_flag = ( mainData.product.insuranceFlag == "0" ) ? "N" : "Y";
	  					that.askData.antHbState = 0;
	  				}else{
	  					var placeOrderData = JSON.parse(localStorage.getItem('placeOrderData'));
	  					that.longData = placeOrderData.longData;
	  					that.selectSku = placeOrderData.selectSku;
	  					that.selectStrArr = placeOrderData.selectSku.skuName.split(",");
	  					that.selectArr = placeOrderData.selectSku.skuId.split("-");
	  					that.selectStr = that.selectStrArr.join("、");
	  					that.askData.insurance_flag = that.selectSku.skuInsuranceFlag == 2 || that.longData.skuInsuranceCheck?'Y':'N';
	  					mainData.parts = placeOrderData.longData.parts;
	  					that.askData.antHbState = 1;
	  				}
	  				var list = mainData.product.list.split(",");
	  				for( let i = 0 ; i < list.length ; i++){
	  					let arr = list[i].split("*");
	  					list[i] =  {
	  						name:arr[0],
	  						count:arr[1]
	  					}
	  				}
	  				mainData.product.list = list;
	  				that.mainData = mainData;
	  				that.calculate(true);
				});
  			}
  		},
  		iframeToggle(url){
			var that = this;
			that.popupIframeUrl = url?url:that.popupIframeUrl;
			that.popupIframeFlag = !that.popupIframeFlag;
		},
  		//选择数量
  		changeCount(type){
  			var that = this;
  			if(type == 'plus' && that.askData.total < that.mainData.product.spaceStock){
  				that.askData.total ++;
  				that.calculate(true);
  			}else if(type == 'minus' && that.askData.total > 1){
  				that.askData.total --;
  				that.calculate(true);
  			}
  		},
  		//选则收货方式
  		selectSelfType(){
  			var that = this;	
  			if(that.selfList.length){
  				that.selfFlag = !that.selfFlag;
  			}else{
  				Indicator.open();
  				network(CONFIG.orderSelfs,{
	  				productId:that.askData.product_id,
	  				rentType:that.mainData.product.rentType == '长租'?1:0,
	  				count:that.askData.total,
	  				beginTimestamp:that.askData.begin_date,
	  				endTimestamp:that.askData.end_date,
	  				city:localStorage.getItem("city")?localStorage.getItem("city"):'',
	  				skuId:that.selectSku.skuId
	  			},{method:'GET'}).then((res) => {
	  				Indicator.close();
	  				var selfList = res.details;
	  				selfList.map(function(item,index){
	  					item.selfAddress = item.selfAddress.split(",");
	  					if(item.selected){
	  						that.selfIndex = index;
	  					}
	  				});
	  				that.selfList = selfList;
	  				that.selfFlag = !that.selfFlag;
	  				that.selectSelf();
				});
  			}
  		},
  		//选择自提地址
  		selectSelf(){
  			var that = this;
  			that.$router.push({path: '/selfs',query: { selfData:that.selfList ,selfIndex:that.selfIndex}});
  		},
  		//选择收货地址
  		selectAddress(){
  			var that = this;
  			that.$router.push({path: '/self/address',query:{selectFlag:true}});
  		},
  		//选择保险
  		selectInsurance(index){
  			var that = this;
  			if(that.listIds){
  				var item = that.mainData.insurances[index];
  				if(item.insuranceFlag == 1){
  					Vue.set(item,'check',!item.check);
  				}
  			}else{
  				if(that.mainData.product.rentType == '短租'){
  					that.askData.insurance_flag = ( that.askData.insurance_flag == 'Y' && that.mainData.product.insuranceFlag == "1" )?'N':'Y';
  				}else{
  					that.askData.insurance_flag = ( that.askData.insurance_flag == 'Y' && that.selectSku.skuInsuranceFlag == "1" )?'N':'Y';
  				}
  			}
  			that.calculate();
  		},
  		//选择配件
  		selectParts(index){
			var that = this;
			Vue.set(that.mainData.parts[index],'check',!that.mainData.parts[index].check);
			that.calculate();
		},
		//配件查看
		packShow(index){
			var that = this;
			that.defaultIndex = index;
			that.packIndex = index+1;
			that.packFlag = true;
		},
		//配件滑动
		packSwipe(index){
			var that = this;
			that.packIndex = index+1;
		},
  		//选择优惠券
  		selectCoupon(){
  			var that = this;
  			if(that.couponConditionalCount == 0){
  				return false;
  			}
  			var product = that.mainData.product;
  			var judgeData = '',couponCalculateAmount = 0;
  			if(!that.listIds){
  				if(product.rentType == '长租'){
  					var selectSku = that.selectSku;
  					if(product.activityType  == 0){
						couponCalculateAmount = selectSku.skuPrice * product.activityDisCount;
					}else if(product.activityType == 2){
						couponCalculateAmount = selectSku.skuPrice * (selectSku.rentTime - product.freeRentTimes);
					}else{
						couponCalculateAmount = selectSku.skuPrice * selectSku.rentTime;
					}
  				}else{
  					couponCalculateAmount = that.shortRent * that.askData.time * that.askData.total;
  					if(product.activityType  == 0){
						couponCalculateAmount =  that.shortRent * that.askData.time * that.askData.total * product.activityDisCount;
					}else if(product.activityType == 2){
						couponCalculateAmount =  that.shortRent * that.askData.total * (that.askData.time - product.freeRentTimes);
					}else{
						couponCalculateAmount =  that.shortRent * that.askData.time * that.askData.total;
					}
  				}
  				judgeData = {
					rentType:product.rentType,
					time:that.askData.time || that.selectSku.rentTime,
					couponCalculateAmount:couponCalculateAmount
				}
  			};
  			that.$router.push({
  				path: '/selectCoupon',
  				query: {
  					coupon:that.mainData.coupon,
  					couponIndex:that.couponIndex,
  					judgeData:judgeData
  				}
  			});
  		},
  		//选择是否使用花呗弹窗
  		huabeiShow(){
  			var that = this;
  			if(that.askData.antHbState == 1){
				that.huabeiFlag = true;
			}else{
				that.askData.antHbState = 1
			}
  		},
  		//编辑备注
  		editRemark(){
  			var that = this;
  			that.$router.push({path: '/remark',query: { remark:that.askData.app_remark}});
  		},
  		//计算价格
  		calculate(flag){
			var that = this;
			var totalAmount = 0,
				mainData = that.mainData,
				product = that.mainData.product,
				coupon = that.mainData.coupon,
				time = that.mainData.product.rentType == '长租'? that.selectSku.rentTime:that.askData.time,
				total = that.askData.total,
				discountAmount = 0,
				selectSku = that.selectSku,
				rentAmount = that.mainData.rentAmount,
				insuranceAmount = 0,
				partsAmount = 0,
				activityAmount = 0;
			var shortRent = product.rentType == '短租'?that.getShortRent():0;
			if(coupon.length){
				//长租还没有判断！！！！！
				var couponCalculateAmount = product.rentType == '长租'?selectSku.skuPrice * selectSku.rentTime:(that.listIds?rentAmount:shortRent * time * total);
				//匹配最优优惠券 满减》减免》折扣
				if(flag){
					var arr1 = [],arr2 = [],arr3 = [],couponConditionalCount = 0;
					for(let i = 0; i < coupon.length; i++) {
						coupon[i].myIndex = i;
						if(( coupon[i].couponType != 'rent' && parseFloat(coupon[i].couponRequest) <= parseFloat(couponCalculateAmount)) || (coupon[i].couponType == 'rent' && parseInt(coupon[i].couponRequest) <= parseInt(time))) {
							if(coupon[i].couponType == 'money'){
								arr1.push(coupon[i])
							}else if(coupon[i].couponType == 'rent'){
								arr2.push(coupon[i])
							}else{
								arr3.push(coupon[i])
							}
							couponConditionalCount ++;
						}
					};
					var arr = arr1.length?arr1:(arr2.length?arr2:arr3);
					that.bestCoupon(arr,couponCalculateAmount);
					that.couponConditionalCount = couponConditionalCount;
				}
				//计算优惠券
				var couponSelect = that.couponSelect;
				if(!couponSelect || (couponSelect && couponSelect.couponType != 'rent' && parseFloat(couponCalculateAmount) < parseFloat(couponSelect.couponRequest)) || (couponSelect && couponSelect.couponType == 'rent' && parseInt(time) < parseInt(couponSelect.couponRequest))) {
					discountAmount = 0;
					couponSelect = null;
				}else if(couponSelect && couponSelect.couponType == 'discount'){
					var _couponCalculateAmount = product.rentType == '长租'?selectSku.skuPrice:couponCalculateAmount;
					discountAmount = _couponCalculateAmount * (100 - couponSelect.couponValue)/100;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else if(couponSelect && couponSelect.couponType == 'rent' && product.rentType == '短租'){
					discountAmount = couponCalculateAmount * couponSelect.couponValue/time;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else if(couponSelect && couponSelect.couponType == 'rent' && product.rentType == '长租'){
					discountAmount = couponCalculateAmount * couponSelect.couponValue/time;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else{
					discountAmount = couponSelect.couponValue;
				}
			}
			
			that.discountAmount = discountAmount;
			
			//计算 配件
			if(mainData.parts && mainData.parts.length){
				var count = 0;
				mainData.parts.map(function(item){
					if(item.check){
						partsAmount += parseFloat(item.price);
						count ++ ;
					}
				});
				that.partsAmount = partsAmount;
				that.partsCount = count;
			}
			if(that.listIds){
				var arr = [];
				for(var i = 0;i<mainData.insurances.length;i++){
			    		if(mainData.insurances[i].insuranceFlag == 2 || that.mainData.insurances[i].check){
			    			insuranceAmount += parseFloat(mainData.insurances[i].insuranceAmount);
			    		}
			    		if(mainData.insurances[i].insuranceFlag != 0){
			    			arr.push(mainData.insurances[i]);
			    		}
			    	}
				if(arr.length){
					that.insuranceAmount = insuranceAmount;
				}else{
					that.insurancePluralFlag = false;
				}
				//此处先判断优惠券是否减过了头
				discountAmount =  mainData.rentAmount - discountAmount > 0 ? discountAmount : mainData.rentAmount;
				totalAmount = mainData.rentAmount * 1 - discountAmount + mainData.depositAmount * 1 - mainData.reliefAmount * 1 + insuranceAmount;
				that.discountAmount = discountAmount;			
			}else if(product.rentType == '长租'){
				//长租：收取押金=原押金-可用额度>0?原押金-可用额度:0
				that.depositAmount = (selectSku.skuDeposit - mainData.maxZmAmount) > 0?(selectSku.skuDeposit - mainData.maxZmAmount):0;
				totalAmount = that.depositAmount - discountAmount + parseFloat(partsAmount);
				if(product.activityType  == 0){
					activityAmount = selectSku.skuPrice * selectSku.rentTime * ( 1 - product.activityDisCount );
					totalAmount += selectSku.skuPrice * product.activityDisCount * selectSku.rentTime;
				}else if(product.activityType == 2){
					activityAmount = selectSku.skuPrice * product.freeRentTimes;
					totalAmount += selectSku.skuPrice * (selectSku.rentTime - product.freeRentTimes);
				}else{
					totalAmount += selectSku.skuPrice * selectSku.rentTime;
				}
				that.activityAmount = activityAmount;
				if(that.askData.insurance_flag == 'Y') {
					totalAmount += parseFloat( selectSku.skuInsurance );
				}
			}else{
				//短租：收取押金=原押金-可用额度>产品最低收取押金?原押金-可用额度:产品最低收取押金
				//真实芝麻减免金额
				var zmAmountReal = ( product.price * total - that.mainData.maxZmAmount ) > ( product.minDeposit * total) ? (1 * that.mainData.maxZmAmount).toFixed(2) : ((product.price - product.minDeposit) * total).toFixed(2);
				//总金额 = 总押金 - 芝麻减免 - 优惠 + 配件 + 短租租金
				//此处先判断优惠券是否减过了头
				var discountRent = shortRent * time * total - discountAmount > 0 ? shortRent * time * total - discountAmount : 0 ;
				that.discountAmount = shortRent * time * total - discountAmount > 0 ? discountAmount : shortRent * time * total;
				totalAmount = parseFloat(product.price) * total - parseFloat(zmAmountReal)   + parseFloat(partsAmount) + discountRent;
				that.shortRent = shortRent;
				that.zmAmountReal = zmAmountReal;
				if(that.askData.insurance_flag == 'Y') {
					totalAmount += parseFloat( product.insuranceAmount * total );
				}
				if(product.activityType  == 0){
					activityAmount = shortRent * time * total / product.activityDisCount - shortRent * time * total;
				}else if(product.activityType == 2){
					activityAmount = shortRent * total  * product.freeRentTimes;
					totalAmount -= activityAmount;
				}
				that.activityAmount = activityAmount;
			}
			that.totalAmount = totalAmount > 0 ? totalAmount : 0;
		},
		//根据价格曲线计算短租价格
		getShortRent(){
			var that = this;
			var averagePrice = 0;
			if(that.askData.time < that.price[0].date) {
				averagePrice = that.price[0].price;
			} else if(that.askData.time > that.price[that.price.length - 1].date) {
				averagePrice = that.price[that.price.length - 1].price;
			} else {
				for(let i = 0; i < that.price.length; i++) {
					if(that.askData.time == that.price[i].date) {
						averagePrice = that.price[i].price;
						break;
					};
				};
			};
			return averagePrice
		},
		//获取最优优惠券
		bestCoupon(arr,couponCalculateAmount){
			var that = this;
			if(!arr.length){
				that.couponSelect = null;
				that.couponIndex = null;
				return false;
			}
			var product = that.mainData.product,
				bestIndex = 0,
				bestAmount = 0;
			for(let i = 0;i<arr.length;i++){
				var couponSelect = arr[i],discountAmount = 0;
				if(couponSelect && couponSelect.couponType == 'discount'){
					//var _couponCalculateAmount = product.rentType == '长租'?that.selectSku.skuPrice:couponCalculateAmount;
					discountAmount = couponCalculateAmount * (100 - couponSelect.couponValue)/100;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else if(couponSelect && couponSelect.couponType == 'rent' && product.rentType == '短租'){
					discountAmount = couponCalculateAmount * couponSelect.couponValue/that.askData.time;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else if(couponSelect && couponSelect.couponType == 'rent' && product.rentType == '长租'){
					discountAmount = couponCalculateAmount * couponSelect.couponValue/that.selectSku.rentTime;
					discountAmount = Math.round(discountAmount*Math.pow(10,2))/Math.pow(10,2);
				}else{
					discountAmount = parseFloat(couponSelect.couponValue);
				}
				if(discountAmount > bestAmount){
					bestIndex = i;
					bestAmount = discountAmount;
				}
			}
			that.couponSelect = arr[bestIndex];
			that.couponIndex = arr[bestIndex].myIndex;
		},
		//展示时间选择器
		calendarShow(){
			var that = this;
			if(that.tplData.optionalDate.length){
				that.calendarFlag = true;
			}else{
				//need loading
				network(CONFIG.optionalDate,{ "product_id": that.askData.product_id }).then((res) => {
					var optionalDate = res.details.optionalDate;
					optionalDate.map(function(item,index){
						item.begin = item.begin.substring(0, 10) + "000";
						item.end = item.end.substring(0, 10) + "000";
						//备用 返回时间第一天 作为第一天初始化数据
						if(!index){
							that.firstDayStamp = item.begin;
						}
					})
					that.tplData.optionalDate = optionalDate;
					that.$refs.calendar.initCalendar();
					that.calendarFlag = true;
				});
			}
		},	
		//隐藏时间选择器
		calendarHidden(){
			var that = this;
			that.calendarFlag = false;
		},
		calendarSave(){
			var that = this;
			localStorage.setItem('placeOrderData',JSON.stringify({startStamp:that.tplData.startStamp,endStamp:that.tplData.endStamp,price:that.price}));
			that.askData.begin_date = that.tplData.startStamp;
	  		that.askData.end_date = that.tplData.endStamp;
	  		that.askData.time = getDiffByStamp(that.askData.begin_date,that.askData.end_date);
	  		that.sendTime = ((that.askData.begin_date - (that.mapSendDay-1) * 24 * 3600 * 1000) < Date.parse(new Date())) ? Date.parse(new Date()):(that.askData.begin_date - that.mapSendDay * 24 * 3600 * 1000);
  			that.calculate(true);
		},
		skuShow(){
			var that = this;
			that.longDataPopup = JSON.parse(JSON.stringify(that.longData));
			that.selectSkuPopup =  JSON.parse(JSON.stringify(that.selectSku));
			that.selectStrArrPopup = that.selectSkuPopup.skuName.split(",");
			that.selectArrPopup = that.selectSkuPopup.skuId.split("-");
			that.selectStrPopup = that.selectStrArrPopup.join("、");
			that.skuFlag = true;
		},
		selectLong(index,cIndex){
			var that = this;
			var child = that.longDataPopup.categorys[index].propertys[cIndex];
			if(child.disable){
				return false;
			}
			if(!child.select){
				that.longDataPopup.categorys[index].propertys.map(function(item,index){
					item.select = false;
				})
				that.selectArrPopup[index] = child.propertyId;
				that.selectStrArrPopup[index] = child.propertyValue;
			}else{
				that.selectArrPopup[index] = null;
				that.selectStrArrPopup[index] = null;
			}
			Vue.set(child,"select",!child.select);
			that.longDataPopup.categorys.map(function(value,key){
				if(key != index){
					value.propertys.map(function(cItem,cIndex){
			    			var arr = that.selectArrPopup.concat();
			    			arr[key] = cItem.propertyId;
			    			cItem.disable = that.getCount(arr) == 0
			    		})
				}
		    	});
	    		var selectCount = 0,selectStrPopup = [];
			that.selectStrArrPopup.map(function(item){
				if(item){
					selectCount++;
					selectStrPopup.push(item);
				}
			})
			that.selectSkuPopup = selectCount == that.longDataPopup.categorys.length?that.getCount(that.selectArrPopup,'sku'):{};
			that.selectStrPopup = selectStrPopup.length?selectStrPopup.join("、"):'';
		},
		skuSave(){
			var that = this;
			if(!that.selectSkuPopup.skuId){
				Vue.toast('请选择完整属性',{duration:1500})
				return false;
			}
			that.longData = JSON.parse(JSON.stringify(that.longDataPopup));
			that.selectSku =  JSON.parse(JSON.stringify(that.selectSkuPopup));
			that.selectStrArr = that.selectSku.skuName.split(",");
			that.selectArr = that.selectSku.skuId.split("-");
			that.selectStr = that.selectStrArr.join("、");
			that.askData.insurance_flag = that.selectSku.skuInsuranceFlag != 0 ?'Y':'N';
			localStorage.setItem('placeOrderData',JSON.stringify({selectSku:that.selectSku,longData:that.longData}))
			that.skuFlag = false;
			that.calculate(true);
		},
		getCount(arr, type) {
			var that = this;
			var skus = that.longData.skus;
			var count = 0,sku;
			for(var i = 0; i < skus.length; i++) {
				var item = skus[i];
				var flag = true;
				for(var j = 0; j < arr.length; j++) {
					if(arr[j] && item.skuId.indexOf(arr[j]) < 0) {
						flag = false;
						break
					}
				}
				if(flag) {
					if(type == 'sku') {
						sku = item;
					} else {
						if(item.remainingNum != 0) {
							count = 1;
							break
						}
					}
				}
			}
			return type == 'sku' ? sku : count
		},
		//查看清单 （多订单）
		packListShow(index){
			var that = this;
			var product = that.mainData.products[index];
			var list = product.productList.split(",");
			for( let i = 0 ; i < list.length ; i++){
				let arr = list[i].split("*");
				list[i] =  {
					name:arr[0],
					count:arr[1]
				}
			}
			that.mainData.product = {
				image_src:product.imageSrc,
				list:list,
				productName:product.productName
			}
			that.listFlag = true;
		},
		//确认支付
		submit(depositFlag){
			var that = this;
			var product = that.mainData.product;
			if(that.submitFlag){
				Vue.toast('请不要重复提交',{duration:1500})
				return false;
			};
			if(product.rentType == '短租' && (!that.askData.time || that.askData.time == 0)){
				Vue.toast('请选择正确的租赁日期',{duration:1500})
		      	return false;
		    };
		    if(product.rentType == '长租' && !that.selectSku.skuId){
		    		Vue.toast('请选择完整的属性',{duration:1500})
		      	return false;
		    };
		    if(that.selfFlag){
		    		that.askData.self_id = that.selfList[that.selfIndex].selfId;
		    		that.askData.selfId = that.selfList[that.selfIndex].selfId;
		    }else if(!that.mainData.delivery || !that.mainData.delivery.delivery_id){
		    		Vue.toast('请选择收货地址',{duration:1500})
		      	return false;
		    }else{
		    		that.askData.delivery_id = that.mainData.delivery.delivery_id;
		    		that.askData.deliveryId = that.mainData.delivery.delivery_id;
		    }
		    if(!that.agreeFlag){
		    		Vue.toast('你需同意用户租赁协议',{duration:1500})
				return false;
			};
			if(product.rentType == '长租'){
				that.askData.skuId = that.selectSku.skuId;
			}
			//获取选择的配件
			if(that.mainData.parts && that.mainData.parts.length){
				var parts = [];
				that.mainData.parts.map(function(item){
					if(item.check){
						parts.push(item.partsId)
					}
				})
				that.askData.partsIds = parts.length?parts.join(","):'';
			};
			
			if(that.listIds){
				//计算多订单的保险
				var arr = [];
				for(var i = 0;i<that.mainData.insurances.length;i++){
					var item = that.mainData.insurances[i];
					arr.push({
		    				listId:item.listId,
		    				insuranceFlag:(item.check || item.insuranceFlag == 2)?'Y':'N'
		    			});
			    	}
				that.askData.lists = arr;
				that.askData.appRemark = that.askData.app_remark;
			}
			
			//优惠券
			if(that.couponSelect && that.couponSelect.userCouponId){
				that.askData.user_coupon_id = that.couponSelect.userCouponId;
				that.askData.couponId = that.couponSelect.userCouponId;
			}
			
			//黑盒数据
			var black_box = typeof(_fmOpt) != "undefined" ?_fmOpt.getinfo():"";
			that.askData.blackBox = black_box;	
			
			//活动标志统计
			if(localStorage.getItem("opeActivityTag")){
		    		that.askData.opeActivityTag = localStorage.getItem("opeActivityTag")
		    }
			
			Indicator.open();
			if(that.listIds){
				//防止重复点击
				that.submitFlag = true;
				network(CONFIG.shoppingOrderSave,that.askData,{codeFlag:true}).then((res) => {
					Indicator.close();
					if(res.head.code == 0){
						var result = res.result;
						var query = {
					    		paymentNo:result.paymentNo,
					    		createDate:result.createDate,
					    		rentAmount:result.payAmount,
					    		depositAmount:that.mainData.depositAmount - that.mainData.reliefAmount
					    }
						that.$router.replace({path: '/pay',query: query});
					}else{
						Vue.toast(res.head.message,{duration:1500})
					}
					that.submitFlag = false;
				});
			}else if( product.rentType == '短租' || ( product.rentType == '长租' && ( that.depositFlag || that.askData.antHbState == 1))){
				//防止重复点击
				that.submitFlag = true;
				that.depositFlag = false;
				network(CONFIG.orderSave,that.askData,{codeFlag:true}).then((res) => {
					Indicator.close();
					if(res.head.code == 0){
						var orderNumber = res.result.order_number;
						if(product.rentType == '短租' || (product.rentType == '长租' && depositFlag == 'Y')){
							if (res.result.refreshDate == "Y"){
								Vue.toast('库存不足',{duration:1500})
							}else{
							 	//_czc.push(['_trackEvent', '确认订单', '访问',that.product.productName]);
						       	// localStorage.setItem("placeOrder","order");
						       	//借还订单
							    var query = {
							    		orderNo:orderNumber
							    }
							    if(IFALIPAY && product.isFree == 'Y' && product.rentType == '短租'){
							    		query.freeFlag = true;
							    }
							    that.$router.replace({path: '/pay',query: query});
							}
						}else if(product.rentType == '长租' && that.askData.antHbState == 1){
							var query = {
						    		orderNo:orderNumber
						    }
							that.$router.replace({path: '/pay',query: query});
							/*
							network(CONFIG.paymentLongPaySign,{
					        		"orderNo":orderNumber,
					        		"trade_no":"",
					        		"payType":"longRentByStages",
					        		"paymentType": "ALIPAY_H5"
							}).then((res) => {
								var formSumbit = res.details.form;
							    	var str = formSumbit.substring(0,formSumbit.indexOf("<script>"));
							    	var scriptStr = formSumbit.substring(formSumbit.indexOf("<script>")).replace("<script>","").replace("<\/script>","");
							    	document.getElementById("alipayWrap").innerHTML = str;
							    	eval(scriptStr);
							});
							*/
						}else{
							that.$router.replace({path: '/paySuccess',query: {orderNo:orderNumber,submitFlag:true}});
						}
					}else{
						Vue.toast(res.head.message,{duration:1500})
					}
					that.submitFlag = false;
					that.umeng('确认订单', '点击', that.mainData.products ? that.mainData.products.productName : that.mainData.product.productName);
				});
			}else{
				//弹出是否支付长租押金
				that.depositFlag = true
			}
		},
		zhima() {
			var that = this;
			if(that.mainData.checkFlag == 1){
				that.$router.push('/zhima');
			}else if(that.mainData.checkFlag == 2){
				that.$router.push('/zhimaFace');
			}else if(that.mainData.checkFlag == 3){
				that.$router.push('/zhimaIDcard');
			}
		},
  	}, 
  	components: {
  		'swipe': Swipe,
	    'swipe-item': SwipeItem,
  		calendar,
	    popupIframe
	}
 }
</script>

<style>
.placeOrder-page .placeOrder-header{
	padding-top: 0.6rem;
	padding-bottom: 1.1rem;
}
.placeOrder-page .placeOrder-header .switch{
	width: 4.2rem;
	height: 1.6rem;
	line-height: 1.6rem;
	border: 0.05rem solid rgba(255,255,255,0.4);
	border-radius: 1.6rem;
}
.placeOrder-page .placeOrder-header .switch span{
	margin: 0 0.4rem;
}
.placeOrder-page .placeOrder-header .switch:after{
	content: '快递';
	position: absolute;
	background: #FFFFFF;
	width: 2.1rem;
	height: 1.4rem;
	line-height: 1.4rem;
	border-radius: 1.4rem;
	left: 0.1rem;
	top: 0.1rem;
	color: #3E6D78;
	font-weight: bold;
}
.placeOrder-page .placeOrder-header .switch.active:after{
	content: '自提';
	left: auto;
	right: 0.1rem;
}
.placeOrder-page .placeOrder-header .address-wrap{
	margin-top: 0.6rem;
	padding-top: 1rem;
	border-top: 0.05rem solid rgba(255,255,255,0.1);
	line-height: 0.9rem;
}
.placeOrder-page .address-wrap .address-icon{
	padding-left: 0.9rem;
	margin-bottom: 0.2rem;
	background: url(~@assets/img/address-white.png) no-repeat left center;
	background-size:0.5rem ;
}
.placeOrder-page .placeOrder-content .line-normal:nth-of-type(1){
	display: none;
}
.placeOrder-page .pack-btn{
	margin-bottom: 1.2rem;
	width: 4rem;
}
.placeOrder-page .count-wrap{
	border: 0.05rem solid #EEEEEE;
	height: 1.2rem;
	line-height: 1.2rem;
	min-width: 3.3rem;
	border-radius: 1.2rem;
}
.placeOrder-page .count-wrap .btn{
	width: 1.2rem;
	height: 1.2rem;
}
.placeOrder-page .count-wrap .btn:after,
.placeOrder-page .count-wrap .plus-btn:before{
	content: '';
	position: absolute;
	width: 0.4rem;
	height: 0.1rem;
	background: #333333;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	-webkit-transform: translate(-50%,-50%);
}
.placeOrder-page .count-wrap .plus-btn:before{
	height: 0.4rem;
	width: 0.1rem;
}
.placeOrder-page .count-wrap .btn.active:after,
.placeOrder-page .count-wrap .plus-btn.active:before{
	background: #DDDDDD;
}
.placeOrder-page .placeOrder-content{
	padding-bottom: 2rem;
}
.placeOrder-page .placeOrder-content .line-normal{
	margin: 0.6rem 0;
}
.placeOrder-page .placeOrder-content .tip{
	margin-top: 0.1rem;
}
.placeOrder-page .placeOrder-content .deposit-wrap{
	padding-top: 0.7rem;
	padding-bottom: 0.2rem;
}
.placeOrder-page .placeOrder-content .line-dashed-wrap{
	margin: 1.3rem 0;
}
.placeOrder-page .remark-wrap{
	margin-top: 0.4rem;
	padding-top: 0.6rem;
	padding-bottom: 0.6rem;
}
.placeOrder-page .agree-wrap{
	padding:0.6rem 0 1.7rem 0;
}
.placeOrder-page .checkbox{
	padding-right: 0.1rem;
}
.placeOrder-page .foot-wrap{
	box-shadow: 0 0 0.6rem rgba(0,0,0,0.06);
	padding: 0.4rem 7rem 0.4rem 0.9rem;
}
.placeOrder-page .foot-wrap .btn{
	line-height: 2.5rem;
	width: 7rem;
}
.placeOrder-page .foot-wrap .rent{
	line-height: 0.7rem;
}
.placeOrder-page .placeOrder-content .parts-item{
	margin-top: 0.4rem;
}
.insuranceFlag-list{
	margin: 0 1.5rem 4.8rem 0.6rem;
}
.insuranceFlag-list li{
	margin-top: 1rem;
	padding-left: 1.5rem;
}
.insuranceFlag-list li .checkbox{
	top: 0.85rem;
}
.insuranceFlag-list li .main{
	border-bottom: 0.05rem solid #EEEEEE;
}
.insuranceFlag-list li:last-child .main{
	border: none;
}
.insuranceFlag-list li .content{
	width: 11.8rem;
	text-align: justify;
	line-height: 1.333;
	padding-bottom: 1rem;
}
.insuranceFlag-list li .image{
	width: 2.6rem;
	height: 2.6rem;
}
.insuranceFlag-list li .name-wrap{
	margin-bottom: 0.2rem;
}
.insuranceFlag-list li .name{
	width: 9rem;
}
.placeOrder-page .huabei-wrap{
	margin-top: 0.2rem;
	padding-top: 0.5rem;
	padding-bottom: 0.4rem;
}
.placeOrder-page .public-popup .parts-list{
	padding: 1.1rem 0.9rem;
	margin-bottom: 2.7rem;
}
.placeOrder-page .public-popup .parts-list li{
	margin-bottom: 0.7rem;
}
.placeOrder-page .public-popup .parts-list .name{
	width: 11.4rem;
}
.placeOrder-page .public-popup .parts-list .price{
	width: 3rem;
}
.placeOrder-page .public-popup .parts-list .tip{
	background: #F6F6F6;
	padding: 0.6rem 0.8rem 0.5rem 0.8rem;
	border-radius: 0.1rem;
}
.confirm-popup {
	width: 15rem;
	padding: 2.3rem 0 1.5rem 0;
	border-radius: 0.2rem;
}
.confirm-popup .image{
	width: 4.3rem;
	height: 4.7rem;
}
.confirm-popup .title{
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
}
.confirm-popup .btn{
	margin: 2.5rem 1.8rem 0.8rem 1.8rem;
	border-radius: 0.2rem;
}
.placeOrder-page .product-wrap-list{
	padding-bottom: 0.9rem;
}
.placeOrder-page .product-wrap-list .product-wrap{
	border-top: 0.05rem solid #EEEEEE;
}
.placeOrder-page .product-wrap-list .product-wrap:first-child{
	border: none;
}
.placeOrder-page .product-wrap-list .pack-btn{
	margin-bottom: 0.5rem;
}
</style>