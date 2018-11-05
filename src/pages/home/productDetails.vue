<template>
	<div v-cloak class="productDetails-page has-footer has-footer-iphoneX bg-white">
		<div id = "point1" class="product-banner-wrap relative bg-buffer">
			<swipe class="product-swipe relative">
				<swipe-item v-for="item in mainData.products.image_list_src">
					<img :src="item" class="image width-full" />
				</swipe-item>
			</swipe>
		</div>
		<ul class="point-list fixed left right bg-white top text-center font-grey font-12 fixd-center" :style="{'opacity':headAlpha}">
			<li class="vertical-middle" v-for="(item,index) in pointList" :class="{active:item.start <= scrollTop && item.end > scrollTop}" @click="scroll(item.start)">{{item.name}}</li>
		</ul>
		<div v-if="mainData.products.product_id" class="product-info public-padding-v">
			<div class="name font-darkGray font-20 font-bold">
				<p>{{mainData.products.name}}</p>
				<span v-if="mainData.products.showTag" class="showTag public-tag-red font-white font-10">{{mainData.products.showTag}}</span>
			</div>
			<div class="description font-12 font-grey" :class="{'line-clamp-3':descriptionFlag && !descriptionShow}" ref="description">
				{{mainData.products.description}}
				<span v-if="descriptionFlag && descriptionShow" class="font-darkGray" @click="descriptionShow = !descriptionShow">收起</span>
				<span v-if="descriptionFlag && !descriptionShow" class="btn font-darkGray" @click="descriptionShow = !descriptionShow">展开</span>
			</div>
		</div>
		<div v-else class="product-info public-padding-v">
			<div class="bg-buffer buffer1" style="margin-top: 0.8rem;margin-bottom: 0.5rem;"></div>
			<div class="bg-buffer buffer1" style="margin-bottom: 0.3rem;"></div>
			<div class="bg-buffer buffer1" style="width: 5rem;margin-bottom: 2rem;"></div>
		</div>
		<div class="product-result public-padding-v relative">
			<div v-if="mainData.products.product_id" class="public-price-wrap">
				<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-26 font-bold">{{mainData.products.minRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{mainData.products.minRent | formatDecimal}}</span>
				<span class="vertical-bottom font-grey font-10">/{{mainData.products.rentUnit}}</span>
			</div>
			<div v-else class="public-price-wrap">
				<div class="bg-buffer buffer1" style="width: 5rem;margin-bottom: 0.3rem;"></div>
				<div class="bg-buffer buffer1" style="width: 5rem;"></div>
			</div>
			<p v-if="mainData.products.product_id" class="font-lightGray font-12">市场价 ¥{{mainData.products.price}}</p>
			<div class="right text-center absolute right top bottom" @click="GoTo('/appraise',{'productId':productId})">
				<p v-if="mainData.product_appraise.total && mainData.product_appraise.total > 999">999+</p>
				<p v-else class="count font-darkGray">{{mainData.product_appraise.total?mainData.product_appraise.total:'0'}}</p>
				<p class="font-12 font-grey font-bold">用户口碑</p>
				<span class="line-normal vertical-line absolute left top"></span>
			</div>
		</div>
		<span class="line-normal"></span>
		<div v-if="mainData.products.product_id" class="public-padding-v">
			<div v-if="mainData.products.rentType == '短租'" class="select-result-wrap public-arrow-right" @click="calendarShow">
				<p v-if="tplData.diff" class="font-darkGray font-bold">已选: {{tplData.startStamp | formatTime2}} - {{tplData.endStamp | formatTime2}} (共{{tplData.diff}}天)</p>
				<p v-else class="font-darkGray font-bold">请选择租赁日期（{{mainData.products.minDay}}天起租）</p>
				<div v-if="tplData.diff" class="price font-12">
					<span>日租金{{tplData.averagePrice | formatMoney}}&nbsp;</span>
					<span>总租金{{tplData.averagePrice * tplData.diff | formatMoney}}</span>
				</div>
				<div v-else class="price font-lightGray font-12">
					<span>周租金{{mainData.products.weekRent | formatMoney}}/日&nbsp;</span>
					<span>月租金{{mainData.products.monthRent | formatMoney}}/日</span>
				</div>
			</div>
			<div v-else class="select-result-wrap public-arrow-right" @click="skuShow">
				<p v-if="selectSku.skuId" class="font-darkGray font-bold">已选: {{selectSku.skuName}}</p>
				<p v-else class="font-darkGray font-bold">请选择租赁属性</p>
				<div v-if="longData.partsSelect.length" class="font-grey font-12 line-ellipsis">
					<span class="vertical-middle price">(</span><span class="vertical-middle price" v-for="(item,index) in longData.parts" v-if="item.check">{{item.name}}&nbsp;</span><span class="vertical-middle price">)</span>
				</div>
				<div v-else-if="!selectSku.skuId" class="price font-grey font-12">
					<span>该产品最少租赁{{mainData.products.minDay}}{{mainData.products.rentUnit}}</span>
				</div>
			</div>
		</div>
		<div v-else class="public-padding-v">
			<div class="select-result-wrap">
				<div class="bg-buffer buffer1" style="margin-bottom: 0.3rem;"></div>
				<div class="bg-buffer buffer1" style="width: 5rem;"></div>
			</div>
		</div>
		<span class="line-normal"></span>
		<ul v-if="mainData.products.product_id" class="product-activity-list font-12 public-padding-v">
			<li :class="{'public-arrow-right':mainData.coupons.length}" @click="couponShow">
				<span class="vertical-middle font-BBB">优惠</span>
				<p v-if="mainData.coupons.length" class="content vertical-middle font-grey line-ellipsis">
					<span v-for="(item,index) in mainData.coupons">{{item.couponName}} </span>
				</p>
				<p v-else class="content vertical-middle font-lightGray">暂无可领取优惠券</p>
			</li>
			<li class="public-arrow-right" @click="zhima">
				<span class="vertical-middle font-BBB">信用</span>
				<p class="content vertical-middle font-grey line-ellipsis">
					<span v-if="mainData.product_appraise.zmFlag == 'Y' && mainData.invalid == 'false'">{{'当前可减免押金金额 ¥ '+mainData.userDeposit}}</span>
					<span v-else>芝麻分650及以上有机会减免押金</span>
				</p>
			</li>
			<li class="public-arrow-right" @click="configNameFlag = true">
				<span class="vertical-middle font-BBB">服务</span>
				<div class="content vertical-middle font-grey line-ellipsis">
					<p class="vertical-middle" v-for="(item,index) in configName">
						<span v-if="index != 0">&nbsp;·&nbsp;</span><span class="font-grey">{{item.title}}</span>
					</p>
				</div>
			</li>
		</ul>
		<ul v-else class="product-activity-list font-12 public-padding-v">
			<li class="display-flex-between flex-align-center" style="padding: 0.3rem 0;">
				<span class="font-BBB">优惠</span>
				<div class="bg-buffer buffer1" style="width: 15.3rem;"></div>
			</li>
			<li class="display-flex-between flex-align-center" style="padding: 0.3rem 0;">
				<span class="font-BBB">信用</span>
				<div class="bg-buffer buffer1" style="width: 15.3rem;"></div>
			</li>
			<li class="display-flex-between flex-align-center" style="padding: 0.3rem 0;">
				<span class="font-BBB">服务</span>
				<div class="bg-buffer buffer1" style="width: 15.3rem;"></div>
			</li>
		</ul>
		<div v-if="mainData.products.product_id">
			<span class="line-normal"></span>
			<div class="title-h2-wrap display-flex-between">
				<span class="h2 font-20 font-darkGray font-bold">租赁规则</span>
				<span v-if="mainData.products.rentType == '长租'" class="btn-right font-lightGray font-12 public-arrow-right" @click="iframeToggle(mainData.longRentProcedureUrl)">更多规则</span>
			</div>
			<div class="public-padding-v">
				<img class="width-full block" src="~@assets/img/productDetails-rule.png" />
				<ul class="rule-list">
					<li v-for="(item,index) in mainData.productRules" class="public-arrow-right" @click="iframeToggle(item.ruleDetailsUrl)">
						<span class="point vertical-middle"></span>
						<span class="content vertical-middle font-darkGray font-14 line-ellipsis">{{item.ruleTitle}}</span>
					</li>
					<li>
						<router-link class="font-BBB font-12" :to="{path:'/rule',query:{productId:productId}}">更多常见问题</router-link>
					</li>
				</ul>
			</div>
			<span class="line-normal"></span>
			<div id = "point2" class="title-h2-wrap display-flex-between">
				<span class="h2 font-20 font-darkGray font-bold">用户口碑</span>
				<span class="btn-right font-lightGray font-12 public-arrow-right" style="padding-top: 0.2rem;padding-bottom: 0.2rem;" @click="GoTo('/appraise',{'productId':productId})">共{{mainData.product_appraise.total}}条</span>
			</div>
			<div class="star-wrap public-padding-v">
				<div class="star-list vertical-middle font-12 font-lightGray">
					<div class="star-item vertical-middle bg-full" v-for="starItem in 5">
						<span v-if="mainData.products.avg_score >= starItem" class="star"></span>
						<span v-else-if="mainData.products.avg_score < starItem && (mainData.products.avg_score*1+1) > starItem" class="star" :style="{'width':mainData.products.avg_score%1*100+'%'}"></span>
					</div>
					<span class="vertical-middle">{{mainData.products.avg_score}}</span>
				</div>
			</div>
			<div v-if="mainData.product_appraise.list.length" class="appraise-list">
				<div class="public-appraise-item relative vertical-top" v-if="index == 0" v-for="(item,index) in mainData.product_appraise.list" @click="GoTo('/appraise',{'productId':productId})">
					<span class="avatar bg-buffer bg-cover" :style="{'background-image':'url('+item.head_thumb+')'}"></span>
					<div class="header">
						<p class="name font-darkGray font-bold line-ellipsis">
							<span class="vertical-middle">{{item.nickname || '已重置'}}</span>
							<span v-if="item.productAppraiseType == 'ORDER'" class="vertical-middle public-tag-black font-white font-10">已体验</span>
						</p>
						<p class="time font-lightGray font-12">{{item.datetime | formatTime5}}</p>
					</div>
					<div class="line-clamp-3 font-gray">
						{{item.details}}
					</div>
					<!--
					<ul v-if="item.image_list_src.length" class="image-list">
						<li class="bg-cover vertical-top bg-buffer" :class="'previewer-img'+index" @click="previewerShow(index,cIndex)" v-for="(cItem,cIndex) in item.image_list_src" :key="item.appraise_id + cIndex" v-if="cIndex < 3" :style="{'background-image':'url('+cItem+')'}"></li>
					</ul>
					-->
					<div>
						<previewer :list="previewerList" ref="previewer" :options="item.options"></previewer>
					</div>
				</div>
			</div>
			<span v-if="mainData.videos.length" class="line-normal"></span>
			<div v-if="mainData.videos.length" id = "point2" class="title-h2-wrap display-flex-between">
				<span class="h2 font-20 font-darkGray font-bold">相关视频</span>
			</div>
			<div v-if="mainData.videos.length" class="video-wrap" >
				<ul class="video-list">
					<router-link class="vertical-top" v-for = "(item,index) in mainData.videos" :key = "index" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId,fromProductFlag:true}}">
						<div class="image bg-cover bg-buffer relative" :style="{'background-image':'url('+item.imageSrc+')'}">
							<span v-if="item.value3" class="time absolute font-bold font-white font-12">{{item.value3}}</span>
						</div>
						<p class="name font-bold font-16 line-ellipsis">{{item.productName}}</p>
						<p class="type font-lightGray font-12">{{item.value2}} / #{{item.videoType}}</p>
					</router-link>
				</ul>
			</div>
			<span class="line-normal"></span>
			<div id = "point3" class="title-h2-wrap">
				<span class="h2 font-20 font-bold" :class="{'font-BBB':!likeFlag}" @click="likeFlag = true">猜你喜欢</span>
				<span class="font-20 font-bold" :class="{'font-BBB':likeFlag}" style="margin-left: 0.8rem;" @click="likeFlag = false">最近浏览</span>
			</div>
			<div class="product-scroll-wrap">
				<ul v-if="likeFlag" class="product-scroll-list">
					<router-link class="vertical-top" v-for="(item,index) in mayBeYouLikeProducts" :key="index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}">
						<span class="bg-cover image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-blue font-12 font-bold">￥</span><span class="price vertical-bottom font-blue font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-blue font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
						</div>
					</router-link>
				</ul>
				<ul v-else class="product-scroll-list">
					<router-link class="vertical-top" v-for="(item,index) in historyBrowse" :key="index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}">
						<span class="bg-cover image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-blue font-12 font-bold">￥</span><span class="price vertical-bottom font-blue font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-blue font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
						</div>
					</router-link>
				</ul>
			</div>
			<iframe id = "point4" v-if="mainData.products.detailsURL" class="iframe-product width-full" :src="mainData.products.detailsURL" :height="clientHeight"></iframe>
		</div>
		<div v-if="mainData.products.product_id" class="footer fixed left bottom right bg-white text-center iphoneX-footer fixd-center">
			<div class="btn1 font-darkGray font-12" @click="chat">
				<span class="image bg-cover headset"></span> 客服
			</div>
			<div class="btn1 font-darkGray font-12" @click="GoToByCheck('/self/shoppingCart')">
				<span class="image bg-cover shoppongBag"></span> 清单
			</div>
			<span v-if="mainData.products.productState != '1'" class="btn3 font-white bg-BBB font-bold">暂无库存</span>
			<span v-if="mainData.products.rentType == '短租' && mainData.products.productState == '1'" class="btn2 font-white bg-blue font-bold" @click="shoppingSave">加入清单</span>
			<span v-if="mainData.products.rentType == '短租' && mainData.products.productState == '1'" class="btn2 font-white bg-darkGray font-bold" @click="submit">免押租赁</span>
			<span v-if="mainData.products.rentType == '长租' && mainData.products.productState == '1'" class="btn3 font-white bg-blue font-bold" @click="submit">立即租赁</span>
		</div>
		<img class="home-btn fixed" @click="GoTo('/')" src="~@assets/img/productDetails-home.png"/>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left fixd-center" v-if="configNameFlag">
				<div class="public-popup-shadow" @click="configNameFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						服务说明
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<ul class="config-list">
						<li v-for="(item,index) in configName" :style="{'background-image':'url('+item.icon+')'}" class="relative">
							<p class="name font-bold font-darkGray">{{item.subtitle}}</p>
							<p class="font-grey font-12">{{item.desc}}</p>
						</li>
					</ul>
					<div class="bg-blue font-white font-bold text-center public-lineheight" @click="configNameFlag = false">完成</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left fixd-center" v-if="couponFlag">
				<div class="public-popup-shadow" @click="couponFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
						优惠券
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="coupont-wrap ">
						<ul class="coupon-list public-padding-v">
							<li v-for="(item,index) in mainData.coupons" :key = "index" class="bg-blue relative">
								<div class="info font-bold font-white">
									<div class="main line-ellipsis">
										<span v-if="item.couponType == 'money'" class="vertical-bottom">¥</span>
										<span class="value vertical-bottom">{{item.couponValue}}</span><span v-if="item.couponType == 'discount'" class="vertical-bottom">折</span>
										<span v-else-if="item.couponType == 'rent'" class="vertical-bottom">{{item.rent_type == '0'?'天':'月'}}</span>
										<span class="type vertical-middle">{{item.rent_type == 0?'短租':'长租'}}</span>
										<span class="vertical-middle">•</span>
										<span class="vertical-middle">{{item.couponName}}</span>
									</div>
									<span v-if="item.isReceived == 'Y'" class="btn btn-white-40 font-white text-center bg-white absolute font-12">已领取</span>
									<span v-else class="btn font-blue text-center bg-white absolute font-12" @click="couponReceive(index)">领取</span>
								</div>
								<div v-if="item.couponRequest > 0" class="time font-white-60 font-12">
									<span>满{{item.couponRequest}}</span><span v-if="item.couponType == 'money'">减{{item.couponValue}}</span>
									<span v-else-if="item.couponType == 'discount'">打{{item.couponValue}}折</span>
									<span v-else>{{item.rent_type == '0'?'天':'月'}}免{{item.couponValue}}{{item.rent_type == '0'?'天':'月'}}</span>
									<span> / 截止：{{item.couponExpireDatetime | formatTime5 }}</span>
								</div>
								<div v-else class="time font-white-60 font-12">
									<span>无门槛优惠券</span>
									<span> / 截止：{{item.couponExpireDatetime | formatTime5 }}</span>
								</div>
								<div class="line-dashed-wrap"></div>
								<div class="foot font-white-40 font-12">
									优惠对象仅限租金，适用范围详见我的-优惠券
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left fixd-center" id="popup" v-if="skuFlag">
				<div class="public-popup-shadow" @click="skuFlag = false"></div>
				<div class="longSelect-wrap absolute bottom left right">
					<div class="product-wrap public-padding-v">
						<span class="image vertical-bottom bg-cover bg-buffer" :style="{'background-image':'url('+mainData.products.image_list_src[0]+')'}"></span>
						<div class="content vertical-bottom">
							<div v-if="selectSku.skuId" class="public-price-wrap">
								<span class="vertical-bottomd font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-26 font-bold">{{selectSku.skuPrice | formatInt}}</span><span class="vertical-bottom font-red font-10">{{selectSku.skuPrice | formatDecimal}}</span>
								<span class="vertical-bottom font-grey font-10">/{{mainData.products.rentUnit}}</span>
							</div>
							<div v-else class="public-price-wrap">
								<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-26 font-bold">{{mainData.products.minRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{mainData.products.rent | formatDecimal}}</span>
								<span class="vertical-bottom font-grey font-10">/{{mainData.products.rentUnit}}</span>
							</div>
							<p v-if="selectStr" class="line-ellipsis">已选：{{selectStr}}</p>
							<p v-else>选择：租赁时长、属性</p>
						</div>
					</div>
					<div class="scroll-wrap bg-white">
						<ul class="longSelect-list">
							<li v-for="(item,index) in longData.categorys">
								<p class="type font-bold">{{item.typeName}}</p>
								<span v-for="(cItem,cIndex) in item.propertys" @click="selectLong(index,cIndex)" class="select-item font-12 font-grey vertical-middle text-center" :class="{'active':cItem.select,'disable':cItem.disable}">{{cItem.propertyValue}}</span>
							</li>
						</ul>
						<div v-if="longData.parts.length" class="parts-wrap">
							<span class="line-normal"></span>
							<p class="title font-bold public-padding-v">选购配件</p>
							<ul class="parts-list public-padding-v">
								<li v-for="(item,index) in longData.parts" class="public-arrow-right display-flex-between flex-align-center">
									<div class="checkbox">
										<span class="public-checkbox border-box block" :class="{'active':item.check}" @click="selectParts(index)"></span>
									</div>
									<p class="content line-clamp-2" @click="packShow(index)">{{item.name}}</p>
									<span class="price font-12 text-right" @click="packShow(index)">{{item.price | formatMoney}}</span>
								</li>
							</ul>
							<div class="public-padding-v">
								<div class="parts-tip font-12 font-grey">
									<p>配件费用不包含在总租金内，将在首期支付中扣除</p>
									<p>配件为一次性买断，租期结束无需归还</p>
								</div>
							</div>
						</div>
						<div v-if="selectSku.skuId && selectSku.skuInsuranceFlag != 0" class="parts-wrap">
							<span class="line-normal"></span>
							<p class="title font-bold public-padding-v">安心享</p>
							<ul class="parts-list public-padding-v">
								<li class="display-flex-between flex-align-center">
									<div class="checkbox">
										<span v-if="selectSku.skuInsuranceFlag == 2" class="public-checkbox border-box block active"></span>
										<span v-else class="public-checkbox border-box block" :class="{'active':longData.skuInsuranceCheck}" @click="longData.skuInsuranceCheck = !longData.skuInsuranceCheck"></span>
									</div>
									<p class="content">
										<span>安心享</span><span v-if="selectSku.skuInsuranceFlag == 2">（必选）</span>
									</p>
									<span class="price font-12 text-right">{{selectSku.skuInsurance | formatMoney}}</span>
								</li>
							</ul>
							<!--
							<span class="inline-block insurance-tip font-12 font-green">查看安心享范围</span>
							-->
						</div>
					</div>
					<div class="bg-blue font-white font-bold text-center public-lineheight" @click="submit">提交订单</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="packFlag">
				<div class="public-popup-shadow black"></div>
				<div class="absolute width-full center">
					<swipe class="packList-swipe relative" :auto='0' :showIndicators="false" :defaultIndex="defaultIndex" @change="packSwipe">
						<swipe-item v-for="item in longData.parts">
							<div class="swipe-item text-center">
								<div class="image bg-cover bg-buffer" :style="{'background-image':'url('+item.image+')'}"></div>
								<p class="name font-white line-clamp-2">{{item.name}}</p>
								<p class="font-green font-16">{{item.price | formatMoney}}</p>
							</div>
						</swipe-item>
					</swipe>
				</div>
				<div class="packList-swipe-header fixed left top right text-center font-white font-bold font-16">
					<span class="close-btn absolute" @click="packFlag = false"></span> {{packIndex}} / {{longData.parts.length}}
				</div>
			</div>
		</transition>
		<calendar :tplData="tplData" :mainData="mainData" :calendarFlag="calendarFlag" :askData="askData" :price="price" @calendarHidden="calendarHidden" @submit="doNothing" ref="calendar"></calendar>
		<popupIframe :popupIframeFlag="popupIframeFlag" :popupIframeUrl="popupIframeUrl" @iframeToggle="iframeToggle"></popupIframe>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Swipe, SwipeItem } from 'vue-swipe';
import calendar from '@components/calendar';
import popupIframe from '@components/popupIframe';
import { publicChat, getMapSendDay} from '@assets/js/mUtils';
import { Previewer } from 'vux'
var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
const navTop = 9.2*clientWidth/18.75;

export default {
	data() {
		return {
			mainData: {
				products: {},
				coupons: [],
				similar_products: [],
				videos: [],
				product_appraise: {
					list: []
				},
			},
			configName: [],
			descriptionFlag: false,
			descriptionShow: false,
			configNameFlag: false, //服务说明弹出框,
			couponFlag: false, //优惠券弹出框
			calendarFlag: false, //日期选择器弹出框
			skuFlag: false, //sku属性弹出框
			price: [], //长租价格曲线
			tplData: { //时间选择器数据
				productId: 0,
				setStatus: 0,
				startStamp: null,
				endStamp: null,
				optionalDate: [],
				hasEmptyGrid: [],
				empytGrids: [],
				public_year: [],
				public_month: [],
				public_days: [],
				noCalendarClearFlag: true //点击关闭按钮 保存数据
			},
			askData: {
				total: 1
			},
			previewerList: [],
			longData: {
				categorys: [],
				insuranceRange: [],
				parts: [],
				partsSelect: [],
				skus: []
			},
			selectArr: [],
			selectStrArr: [],
			selectStr: "",
			selectSku: {},
			popupIframeFlag: false, //加载iframe弹出框
			popupIframeUrl: "", //iframe弹出框链接,
			likeFlag: true, //猜你喜欢
			historyBrowse: [],
			mayBeYouLikeProducts: [],
			clientHeight: 0,
			packFlag: false, //配件查看flag
			defaultIndex: 0,
			packIndex: 0,
			pointList:[{name:'商品',start:0,end:0},{name:'口碑',start:0,end:0},{name:'推荐',start:0,end:0},{name:'详情',start:0,end:0}],
			headAlpha: 0,
			scrollTop:0
		}
	},
	mounted() {
		var that = this;
		that.pageInit();
		var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		that.clientHeight = clientHeight;
		if(!localStorage.getItem("mapSendDay")) {
			getMapSendDay();
		};
	},
	methods: {
		pageInit() {
			var that = this;
			that.productId = that.$route.query.productId || that.$route.query.product_id;
			that.tplData.productId = that.productId;
			window.scrollTo(0, 0);
			that.initData();
		},
		initData() {
			var that = this;
			network(CONFIG.product, {
				"product_id": that.productId,
				"client": 'web'
			}).then((res) => {
				that.configName = res.productServices;
				that.historyBrowse = res.historyBrowse;
				that.mayBeYouLikeProducts = res.mayBeYouLikeProducts;
				var details = res.details;
				details.products.image_list_src = details.products.image_list_src.split(",");
				details.product_appraise.list.forEach(function(item, index) {
					item.image_list_src = item.image_list_src.length ? item.image_list_src.split(",") : [];
				})
				that.mainData = details;
				setTimeout(function() {
					if(that.$refs && that.$refs.description){
						let descriptionHeight = that.$refs.description.offsetHeight;
						let height = 2.7 * clientWidth / 18.75;
						if(descriptionHeight > height) {
							that.descriptionFlag = true
						}
					}
				}, 30);
				setTimeout(function(){
					that.pointList.map((item,index) => {
						var offsetTop1 = document.getElementById("point"+(index+1)) ? document.getElementById("point"+(index+1)).offsetTop : 0;
						var offsetTop2 = index == 3 ? 0 : ( document.getElementById("point"+(index+2)) ? document.getElementById("point"+(index+2)).offsetTop : 0);
						var more = clientWidth/18.75;
						item.start = index ? offsetTop1 - more : 0;
						item.end = index == 3 ? 10000 :offsetTop2 - more;
					})
				},200)
				window.addEventListener('scroll', that.scrollBottom);
				that.umeng('商品详情', '访问', details.products.name);
			});
		},
		GoTo(href, query) {
			var that = this;
			var params = {
				path: href
			}
			if(query) {
				params.query = query
			}
			that.$router.push(params);
		},
		GoToByCheck(href,query){
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			that.GoTo(href,query);
		},
		doNothing(){
			//代替submit 因为更改了按钮的逻辑
		},
		//展示时间选择器
		calendarShow() {
			var that = this;
			if(that.mainData.products.productState != '1'){
				Vue.toast('该产品暂无库存', {
					duration: 1500
				});
				return false;
			}
			if(!that.goLogin()){
				return false;
			}
			if(that.price.length) {
				that.calendarFlag = true;
			} else {
				Indicator.open();
				network(CONFIG.productPrice, {
					"product_id": that.productId
				}).then((res) => {
					that.price = res.result.price;
					network(CONFIG.optionalDate, {
						"product_id": that.productId
					}).then((res) => {
						var optionalDate = res.details.optionalDate;
						optionalDate.map(function(item, index) {
							item.begin = item.begin.substring(0, 10) + "000";
							item.end = item.end.substring(0, 10) + "000";
							//备用 返回时间第一天 作为第一天初始化数据
							if(!index) {
								that.firstDayStamp = item.begin;
							}
						})
						that.tplData.optionalDate = optionalDate;
						that.$refs.calendar.initCalendar();
						Indicator.close();
						that.calendarFlag = true;
						that.umeng('租期选择', '访问', that.mainData.products.name);
					});
				});
			}
		},
		//隐藏时间选择器
		calendarHidden() {
			var that = this;
			that.calendarFlag = false;
		},
		//加入清单
		shoppingSave() {
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			if(that.tplData.diff) {
				if(that.shoppingSaveFlag) {
					return false;
				}
				that.shoppingSaveFlag = true;
				network(CONFIG.shoppingSave, {
					beginDate: that.tplData.startStamp,
					endDate: that.tplData.endStamp,
					productId: that.productId,
				}).then((res) => {
					that.userbaseInfo = res.details;
					Vue.toast('添加成功', {
						duration: 1500
					});
					that.shoppingSaveFlag = false;
				});
			} else {
				that.calendarShow();
			}
		},
		//展现优惠券
		couponShow() {
			var that = this;
			if(that.mainData.coupons.length) {
				if(!that.goLogin()){
					return false;
				}
				that.couponFlag = true;
			}
		},
		//领取优惠券
		couponReceive(index) {
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			if(that.mainData.coupons[index].isReceived == "N") {
				network(CONFIG.couponReceive, {
					"coupon_id": that.mainData.coupons[index].couponId
				}).then((res) => {
					Vue.toast('领取成功', {
						duration: 1500
					});
					that.mainData.coupons[index].isReceived = "Y";
				});
			};
		},
		previewerShow(index, cIndex) {
			var that = this;
			var list = [];
			that.mainData.product_appraise.list[index].image_list_src.map(item => {
				list.push({
					src: item,
				})
			})
			that.mainData.product_appraise.list[index].options = {
				getThumbBoundsFn(i) {
					let thumbnail = document.querySelectorAll('.previewer-img' + index)[i]
					let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
					let rect = thumbnail ? thumbnail.getBoundingClientRect():{}
					return {
						x: rect.left,
						y: rect.top + pageYScroll,
						w: rect.width
					}
				}
			}
			that.previewerList = list;
			setTimeout(function() {
				that.$refs.previewer[index].show(cIndex)
			}, 100)
		},
		skuShow() {
			var that = this;
			if(that.mainData.products.productState != '1'){
				Vue.toast('该产品暂无库存', {
					duration: 1500
				});
				return false;
			}
			if(!that.goLogin()){
				return false;
			}
			if(that.mainData.products.productState != 1) {
				Vue.toast('暂无库存', {
					duration: 1500
				});
				return false;
			}
			if(that.longData.skus.length) {
				that.skuFlag = true
			} else {
				Indicator.open();
				network(CONFIG.productInit, {
					"productId": that.productId
				}).then((res) => {
					Indicator.close();
					var details = res.details;
					that.longData.skus = details.skus;
					details.categorys.map(function(item, index) {
						item.propertys.map(function(cItem, cIndex) {
							if(that.getCount([cItem.propertyId]) == 0) {
								cItem.disable = true
							};
							cItem.select = false
						})
					});
					details.parts.map(function(item, index) {
						item.check = false
					})
					details.partsSelect = [];
					details.skuInsuranceCheck = true;
					that.longData = details;
					that.skuFlag = true;
				});
			}
		},
		selectLong(index, cIndex) {
			var that = this;
			var child = that.longData.categorys[index].propertys[cIndex];
			if(child.disable) {
				return false;
			}
			if(!child.select) {
				that.longData.categorys[index].propertys.map(function(item, index) {
					item.select = false;
				})
				that.selectArr[index] = child.propertyId;
				that.selectStrArr[index] = child.propertyValue;
			} else {
				that.selectArr[index] = null;
				that.selectStrArr[index] = null;
			}
			Vue.set(child, "select", !child.select);
			that.longData.categorys.map(function(value, key) {
				if(key != index) {
					value.propertys.map(function(cItem, cIndex) {
						var arr = that.selectArr.concat();
						arr[key] = cItem.propertyId;
						cItem.disable = that.getCount(arr) == 0
					})
				}
			});
			var selectCount = 0,
				selectStr = [];
			that.selectStrArr.map(function(item) {
				if(item) {
					selectCount++;
					selectStr.push(item);
				}
			})
			that.selectSku = selectCount == that.longData.categorys.length ? that.getCount(that.selectArr, 'sku') : {};
			that.selectStr = selectStr.length ? selectStr.join("、") : '';
		},
		getCount(arr, type) {
			var that = this;
			var skus = that.longData.skus;
			var count = 0,
				sku;
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
		//选择配件 
		selectParts(index) {
			var that = this;
			var parts = that.longData.parts[index],
				partsSelect = [];
			parts.check = !parts.check;
			that.longData.parts.map(item => {
				if(item.check) {
					partsSelect.push(item)
				}
			});
			that.longData.partsSelect = partsSelect;
		},
		iframeToggle(url) {
			var that = this;
			that.popupIframeUrl = url ? url : that.popupIframeUrl;
			that.popupIframeFlag = !that.popupIframeFlag;
		},
		submit() {
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			if(that.mainData.products.rentType == '短租') {
				if(that.tplData.diff ) {
					localStorage.setItem('placeOrderData', JSON.stringify({
						startStamp: that.tplData.startStamp,
						endStamp: that.tplData.endStamp,
						price: that.price
					}))
					/*
					that.$router.push({
						path: '/placeOrder',
						query: {
							productId: that.productId
						}
					});
					*/
					window.location.href = "#/placeOrder?productId="+that.productId
				} else {
					that.calendarShow()
				}
			} else {
				if(that.selectSku.skuId) {
					localStorage.setItem('placeOrderData', JSON.stringify({
						selectSku: that.selectSku,
						longData: that.longData
					}))
					/*
					that.$router.push({
						path: '/placeOrder',
						query: {
							productId: that.productId
						}
					});
					*/
					window.location.href = "#/placeOrder?productId="+that.productId
				} else if(that.skuFlag) {
					Vue.toast('请选择完整属性', {
						duration: 1500
					});
				} else {
					that.skuShow();
				}
			}
		},
		chat() {
			var that = this;
			that.umeng('商品详情-联系客服', '访问', that.mainData.products.name);
			publicChat();
		},
		packShow(index) {
			var that = this;
			that.defaultIndex = index;
			that.packIndex = index + 1;
			that.packFlag = true;
		},
		packSwipe(index) {
			var that = this;
			that.packIndex = index + 1;
		},
		zhima() {
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			if(that.mainData.product_appraise.zmFlag == 'Y') {
				that.GoTo('/zhimaSuccess');
			} else {
				that.GoTo('/zhima');
			}
		},
		scrollBottom() {
			var that = this;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			that.scrollTop = scrollTop;
			if(scrollTop > navTop) {
				that.headAlpha = 1;
			} else {
				that.headAlpha = scrollTop / navTop;
			}
		},
		scroll(height){
			var that = this;
			window.scrollTo(0,height);
		}
	},
	deactivated(){
      var that = this;
      window.removeEventListener('scroll',that.scrollBottom)
    },
    destroyed(){
      var that = this;
      window.removeEventListener('scroll',that.scrollBottom)
    },
	watch: {
		'$route': 'pageInit'
	},
	components: {
		'swipe': Swipe,
		'swipe-item': SwipeItem,
		calendar,
		Previewer,
		popupIframe
	}
}
</script>

<style>
@import '~vue-swipe/dist/vue-swipe.css';
.has-footer {
	padding-bottom: 2.5rem;
}

.productDetails-page .product-banner-wrap,
.productDetails-page .product-swipe,
.productDetails-page .product-swipe .image {
	height: 15rem;
}

.productDetails-page .product-info .name {
	line-height: 1.3;
	padding-top: 0.6rem;
	padding-bottom: 0.3rem;
}

.productDetails-page .product-info .name .showTag{
	display: inline-block;
	margin-top: 0.3rem;
}

.productDetails-page .product-info .description {
	position: relative;
	line-height: 1.5;
	margin-bottom: 0.9rem;
	text-align: justify;
}

.productDetails-page .product-info .description .btn {
	position: absolute;
	bottom: 0;
	right: 0;
	line-height: 1.2;
	background: #FFFFFF;
	padding-left: 0.5rem;
	background: -webkit-linear-gradient(left, rgba(255,255,255,0) , rgba(255,255,255,1) 20% ,rgba(255,255,255,1));
	background: -o-linear-gradient(right, rgba(255,255,255,0), rgba(255,255,255,1) 20%, rgba(255,255,255,1)); 
	background: -moz-linear-gradient(right, rgba(255,255,255,0), rgba(255,255,255,1) 20%, rgba(255,255,255,1)); 
	background: linear-gradient(to right, rgba(255,255,255,0) , rgba(255,255,255,1) 20%, rgba(255,255,255,1));
}

.productDetails-page .product-info .public-tag-red {
	position: relative;
	top: -0.15rem;
}

.productDetails-page .product-result {
	margin-bottom: 0.9rem;
}

.productDetails-page .product-result .right {
	padding: 0 0.9rem;
}

.productDetails-page .product-result .right .count {
	margin: 0.2rem 0;
}

.productDetails-page .product-result .public-price-wrap {
	margin-bottom: 0.2rem;
}

.product-activity-list {
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
}

.product-activity-list li {
	padding: 0.4rem 0;
}

.product-activity-list li .content {
	padding-left: 0.4rem;
	width: 14rem;
}

.productDetails-page .rule-list {
	padding-top: 0.4rem;
	padding-bottom: 1rem;
}

.productDetails-page .rule-list li {
	padding: 0.3rem 0;
	margin-top: 0.1rem;
	line-height: 1.3;
}

.productDetails-page .rule-list li:last-child {
	margin-top: 0;
}

.productDetails-page .rule-list li .point {
	width: 0.2rem;
	height: 0.2rem;
	border: 0.1rem solid #DDDDDD;
	border-radius: 100%;
	margin-right: 0.1rem;
}

.productDetails-page .rule-list li .content {
	width: 15rem;
}

.productDetails-page .appraise-list {
	white-space: nowrap;
	padding: 0.2rem 0.9rem 1.3rem 0.9rem;
}

.productDetails-page .appraise-list .public-appraise-item .header {
	padding-left: 2.3rem;
}

.productDetails-page .appraise-list .public-appraise-item {
	width: 100%;
	padding-left: 0;
}

.productDetails-page .public-appraise-item .image-list li {
	width: 4rem;
	height: 0;
	padding-bottom: 4rem;
	margin-right: 0.3rem;
	border-radius: 0.1rem;
}

.productDetails-page .public-appraise-item .image-list li:last-child {
	margin: 0;
}

.productDetails-page .star-wrap {
	position: relative;
	top: -0.8rem;
}

.productDetails-page .select-result-wrap {
	padding-top: 0.8rem;
	padding-bottom: 0.9rem;
}

.productDetails-page .select-result-wrap .price {
	margin-top: 0.4rem;
	line-height: 1;
}

.productDetails-page .footer {
	z-index: 10;
	height: 2.5rem;
	display: flex;
	display: -webkit-flex;
	justify-content: space-between;
	-webkit-justify-content: space-between;
	box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.05);
}

.productDetails-page .footer .btn1 {
	width: 16.4%;
}

.productDetails-page .footer .btn1 .image {
	display: block;
	margin: 0 auto;
	width: 1.6rem;
	height: 1.6rem;
}

.productDetails-page .footer .btn1 .headset {
	background-image: url(~@assets/img/headset-black.png);
}

.productDetails-page .footer .btn1 .shoppongBag {
	background-image: url(~@assets/img/shoppingBag-black.png);
}

.productDetails-page .footer .btn2 {
	width: 33.6%;
	line-height: 2.5rem;
}

.productDetails-page .footer .btn3 {
	width: 67.2%;
	line-height: 2.5rem;
}

.productDetails-page .config-list {
	padding: 1rem;
	padding-bottom: 3rem;
	max-height: 16.5rem;
	overflow-y: auto;
}

.productDetails-page .config-list li {
	padding-left: 2.2rem;
	margin-bottom: 1.3rem;
	background-repeat: no-repeat;
	background-position: left center;
	background-size: 1.3rem auto;
}

.productDetails-page .config-list li .name {
	margin-bottom: 0.1rem;
}

.productDetails-page .parts-wrap {
	padding-bottom: 1rem;
}

.productDetails-page .parts-wrap .title,
.productDetails-page .insurance-wrap .title {
	padding-top: 1.3rem;
	padding-bottom: 0.7rem;
}

.productDetails-page .parts-list li {
	margin-bottom: 0.7rem;
}

.productDetails-page .parts-list li:last-child {
	margin-bottom: 0;
}

.productDetails-page .parts-list li .checkbox {
	flex: 0 1 1.3rem;
	-webkit-flex: 0 1 1.3rem;
}

.productDetails-page .parts-list li .content {
	flex: 1 1 auto;
	-webkit-flex: 1 1 auto;
}

.productDetails-page .parts-list li .price {
	width: 3.8rem;
	flex: 0 1 3.8rem;
	-webkit-flex: 0 1 3.8rem;
}

.productDetails-page .parts-tip {
	padding: 0.6rem 0.8rem 0.5rem 0.8rem;
	background: #F6F6F6;
	border-radius: 0.1rem;
	margin-top: 0.6rem;
}

.productDetails-page .insurance-tip {
	margin: 0.1rem 0 1rem 2.2rem;
}

.productDetails-page .buffer1 {
	height: 1rem;
}

.productDetails-page .packList-swipe {
	height: 100%;
}

.productDetails-page .point-list {
	z-index: 10;
}

.productDetails-page .point-list li {
	width: 25%;
	line-height: 1rem;
}

.productDetails-page .point-list li.active {
	color: #36646E;
}
.productDetails-page .video-wrap{
	overflow-x: auto;
}
.productDetails-page .video-list{
	padding-left: 0.9rem;
	padding-bottom: 1.3rem;
	white-space: nowrap;
}
.productDetails-page .video-list li {
	width: 17rem;
	margin-right: 0.4rem;
}
.productDetails-page .video-list li .image{
	height: 8.5rem;
	border-radius: 0.2rem;
}
.productDetails-page .video-list li .image:before{
	content: "";
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	-webkit-transform: translate(-50%,-50%);
	border-left: 1.2rem solid rgba(255,255,255,0.6);
	border-top: 0.7rem solid transparent;
	border-bottom: 0.7rem solid transparent;
}
.productDetails-page .video-list li .name{
	margin-top: 0.5rem;
	margin-bottom: 0.3rem;
}
.productDetails-page .video-list li .time{
	right: 0.4rem;
	bottom: 0.4rem;
	padding: 0.1rem;
	background: rgba(0,0,0,0.4);
	border-radius: 0.1rem;
}
.productDetails-page .coupont-wrap {
	max-height: 21rem;
	padding-bottom: 1.7rem;
	overflow-y: auto;
}
.productDetails-page .home-btn {
	width: 2.8rem;
	height: 2.8rem;
	right: 0.9rem;
	bottom: 3.2rem;
}
</style>