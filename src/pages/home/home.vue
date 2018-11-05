<template>
	<div class="home-page has-header has-footer has-footer-iphoneX bg-white">
		<div class="home-header bg-gradient-normal fixed left top right fixd-center">
			<div class="home-header-bg" :style="{'background-color':'rgba(255,255,255,'+headAlpha+')'}">
				<router-link to="/search" class="search-wrap relative font-12 block">
					想体验什么？搜搜看
					<span class="bg absolute top right bottom left font-lightGray" :style="{'opacity':headAlpha}">想体验什么？搜搜看</span>
				</router-link>
				<div class="shopping-bag bg-contain" @click="goShoppingCar"><span class="bg bg-contain absolute left top right bottom" :style="{'opacity':headAlpha}"></span></div>
			</div>
		</div>
		<div class="home-banner-wrap bg-gradient-normal relative">
			<swipe v-if = "banners.length" class="home-swipe relative" :showIndicators = 'banners.length > 1'>
			    <swipe-item v-for="(item,index) in banners" :key = "index">
			    		<div class="image bg-cover bg-buffer" :style="{'background-image':'url('+item.bannerImageSrc+')'}" @click="See(item.bannerLink)"></div>
			    </swipe-item>
			</swipe>
			<div v-else class="home-swipe relative">
				<div class="image bg-buffer"></div>
			</div>
		</div>
		<div v-if="productTypes.length" class="home-type-list-wrap">
			<div class="home-type-list font-14 font-bold font-darkGray bg-white relative" id="nav-list">
				<div class="home-type-scroll relative">
					<span v-for="(item,index) in productTypes" :key="index" @click="changeType(item.type_id)" class="home-type-item vertical-middle relative" :class="{ active: item.type_id == askData.typeId }">{{item.type_name}}</span>
				</div>
			</div>
		</div>
		<div v-else class="home-type-list-wrap public-padding-v overflow-hidden">
			<div class="buffer1 bg-buffer"></div>
		</div>
		<div v-if="askData.typeId == 0">
			<div class="title-h2-wrap display-flex-between">
				<span class="h2 font-20 font-darkGray font-bold">热门短租</span>
				<router-link v-if="hotProducts.length" class="btn-right font-lightGray font-12 public-arrow-right" :to="{path:'/productByRentType',query:{rentType:0}}">更多</router-link>
			</div>
			<div class="product-scroll-wrap">
				<ul v-if="hotProducts.length" class="product-scroll-list">
					<router-link class="vertical-top" v-for="(item,index) in hotProducts" :key = "index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}" @click = "umeng('首页热门短租', '点击', item.productName)">
						<span class="bg-cover bg-buffer image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/日</span>
						</div>
					</router-link>
				</ul>
				<ul v-else class="product-scroll-list overflow-hidden">
					<li class="vertical-top" v-for="(item,index) in 3">
						<span class="bg-buffer image"></span>
						<p class="bg-buffer buffer2 name"></p>
						<div class="bg-buffer public-price-wrap buffer3"></div>
					</li>
				</ul>
			</div>
			<span class="line-normal"></span>
			<div class="title-h2-wrap display-flex-between">
				<span class="h2 font-20 font-darkGray font-bold">优选长租</span>
				<router-link v-if="hotLongPrdoucts.length" class="btn-right font-lightGray font-12 public-arrow-right" :to="{path:'/productByRentType',query:{rentType:1}}">更多</router-link>
			</div>
			<div class="product-scroll-wrap">
				<ul v-if="hotLongPrdoucts.length" class="product-scroll-list">
					<router-link class="vertical-top" v-for="(item,index) in hotLongPrdoucts" :key="index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}" @click = "umeng('首页优选长租', '点击', item.productName)">
						<span class="bg-cover image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/日</span>
						</div>
					</router-link>
				</ul>
				<ul v-else class="product-scroll-list overflow-hidden">
					<li class="vertical-top" v-for="(item,index) in 3">
						<span class="bg-buffer image"></span>
						<p class="bg-buffer buffer2 name"></p>
						<div class="bg-buffer public-price-wrap buffer3"></div>
					</li>
				</ul>
			</div>
			<span class="line-normal"></span>
		</div>
		<div v-else-if="hotByTypeList.length">
			<div class="title-h2-wrap">
				<span class="h2 font-20 font-darkGray font-bold">热门产品</span>
			</div>
			<div class="product-scroll-wrap product-hot-wrap">
				<ul class="product-scroll-list">
					<router-link class="vertical-top" v-for="(item,index) in [hotByTypeList[0],hotByTypeList[1]]" :key = "index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}">
						<span class="bg-cover image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/日</span>
						</div>
					</router-link>
				</ul>
			</div>
			<swipe class="home-product-swipe relative" :auto='0'>
				<swipe-item v-for="(pItem,pIndex) in Math.ceil((hotByTypeList.length-2)/3)">
					<ul class="closeProduct-list public-padding-v relative">
						<router-link class="display-flex-between" v-for="(item,index) in [hotByTypeList[pIndex*3+2],hotByTypeList[pIndex*3+3],hotByTypeList[pIndex*3+4]]" v-if="item" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}">
							<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
							<div class="content display-flex-between flex-column">
								<div>
									<p class="name font-bold line-ellipsis">{{item.productName}}</p>
									<div class="star-wrap">
										<div class="star-list vertical-middle font-12 font-lightGray">
											<div class="star-item vertical-middle bg-full" v-for="starItem in 5">
												<span v-if="item.appraiseAvgScore >= starItem" class="star"></span>
												<span v-else-if="item.appraiseAvgScore < starItem && (item.appraiseAvgScore*1+1) > starItem" class="star" :style="{'width':item.appraiseAvgScore%1*100+'%'}"></span>
											</div>
											<span class="vertical-middle">{{item.appraiseAvgScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraiseCount}}</span>
										</div>
									</div>
								</div>
								<div class="public-price-wrap">
									<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
									<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
								</div>
							</div>
						</router-link>
					</ul>
				</swipe-item>
			</swipe>
			<span class="line-normal"></span>
		</div>
		<div v-if="products.length" class="title-h2-wrap">
			<span class="h2 font-20 font-darkGray font-bold">{{askData.typeId == 0?'推荐产品':'所有产品'}}</span>
		</div>
		<ul v-if="products.length" class="home-product-list">
			<router-link v-for="(item,index) in products" :key="index" tag="li" :to="{path:'/productDetails',query:{productId:item.productId}}">
				<div class="image bg-cover bg-buffer block relative" :style="{'background-image':'url('+item.productImageSrc+')'}">
					<span v-if="item.showTag" class="public-tag-red font-white font-10">{{item.showTag}}</span>
				</div>
				<p class="name font-darkGray font-16 font-bold">{{item.productName}}</p>
				<div class="star-wrap">
					<div class="star-list vertical-middle font-12 font-lightGray">
						<div class="star-item vertical-middle bg-full" v-for="starItem in 5">
							<span v-if="item.appraiseAvgScore >= starItem" class="star"></span>
							<span v-else-if="item.appraiseAvgScore < starItem && (item.appraiseAvgScore*1+1) > starItem" class="star" :style="{'width':item.appraiseAvgScore%1*100+'%'}"></span>
						</div>
						<span class="vertical-middle">{{item.appraiseAvgScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraiseCount}}</span>
					</div>
				</div>
				<div class="public-price-wrap">
					<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
					<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
				</div>
			</router-link>
		</ul>
		<div v-else style="height: 30rem;"></div>
		<mt-spinner v-if="products.length && more" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<tabs></tabs>
		<div class="Bullet-slide-area" v-show="Bulletslidearea" v-if="topicArrea.length">
			<div class="mask-area"></div>
			<div class="mask-scroll-area">
				<swiper :options="swiperOptionM" ref="mySwiper">
					<div class="swiper-slide bg-contain" v-for="(item,index) in topicArrea" :key = "index" @click="See(item.url)" :style="{'background-image':'url('+item.image+')'}"></div>
				</swiper>
				<div class="close" @click="Bulletslidearea=false"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { Swipe, SwipeItem } from 'vue-swipe';
	import Tabs from '@components/tabs';
	import 'swiper/dist/css/swiper.css';
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import { Spinner } from 'mint-ui';
	Vue.component(Spinner.name, Spinner);
	
	var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
	const navTop = 9.4 * clientWidth / 18.75;

	export default {
		data() {
			return {
				//弹出框的轮播
				swiperOptionM: { 
					notNextTick: true,
					initialSlide: 0, 
					autoplay: 3000,
					direction: 'vertical',
					grabCursor: true,
					setWrapperSize: true, 
					autoHeight: true, 
					paginationClickable: true,
					scrollbar: '.swiper-scrollbar',
					mousewheelControl: true,
					observer: true, 
					observeParents: true,
					effect: 'coverflow', 
					grabCursor: true, 
					centeredSlides: true, 
					slidesPerView: 'auto', 
					direction: 'horizontal',
					coverflowEffect: { 
						rotate: 0,
						stretch: -50, 
						depth: 300, 
						modifier: 1, 
						slideShadows: false, 
					}
				},
				Bulletslidearea: true, //轮播遮罩层区域显示与隐藏
				askData: {
					typeId: 0,
					pageSize: 10,
					pageNum: 1,
					clientType: 'web:h5'
				},
				more: true,
				switchShow: false,
				productTypes: [],
				banners: [],
				hotLongPrdoucts: [],
				hotProducts: [],
				products: [],
				hotByTypeList: [{}, {}],
				headAlpha: 0,
				topicArrea: [],
			}
		},
		mounted() {
			this.getEnterAppCueInfo();
		},
		created() {
			var that = this;
			network(CONFIG.productTypes).then((res) => {
				that.productTypes = res.details
			});
			that.getData();
			//window.addEventListener('scroll', that.scrollBottom)
		},
		activated() {
			var that = this;
			window.addEventListener('scroll', that.scrollBottom);
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(document.getElementById("nav-list")) {
				if(scrollTop > navTop) {
					that.headAlpha = 1;
					document.getElementById("nav-list").classList.add("active","fixd-center");
				} else {
					that.headAlpha = scrollTop / navTop;
					document.getElementById("nav-list").classList.remove("active","fixd-center");
				}
			}
		},
		deactivated() {
			var that = this;
			window.scrollTo(0, 0);
			window.removeEventListener('scroll', that.scrollBottom)
		},
		destroyed() {
			var that = this;
			window.scrollTo(0, 0);
			window.removeEventListener('scroll', that.scrollBottom)
		},
		methods: {
			getEnterAppCueInfo() {
				var that = this;
				if(!localStorage.getItem("enterAppCueInfo")) {
					network(CONFIG.enterAppCueInfo, {}, {
						method: 'GET'
					}).then(function(res) {
						if(res.head.code == 0) {
							that.topicArrea = res.details;
							if(res.details.bannerPopFlag == 'Y' && localStorage.getItem("enterAppCueInfoId") != res.details.title) {
								that.Bulletslidearea = true;
								localStorage.setItem("enterAppCueInfoId", that.details.title);
							}
						}
						localStorage.setItem("enterAppCueInfo", true);
					});
				};
			},

			initData() {
				var that = this;
				that.askData.pageNum = 1;
				that.more = true;
				that.switchShow = false;
				that.products = [];
				if(document.getElementById("nav-list") && document.getElementById("nav-list").classList.contains('active')) {
					document.documentElement.scrollTop = navTop;
					document.body.scrollTop = navTop;
				}
				that.getData();
			},
			getData() {
				var that = this;
				if(!that.more || that.switchShow) {
					return false;
				};
				that.switchShow = true;
				network(CONFIG.homes, that.askData, {
					method: 'GET'
				}).then((res) => {
					var details = res.details;
					if(!that.banners.length) {
						that.hotProducts = details.shortProductList;
						that.hotLongPrdoucts = details.longProductList;
						that.banners = details.bannerList;
					}
					that.products = that.products.concat(details.recommendedProductList.data);
					that.askData.pageNum = details.recommendedProductList.page.pageNum + 1;
					that.more = that.askData.pageNum <= details.recommendedProductList.page.pages;
					that.hotByTypeList = details.hotByTypeList;
					that.switchShow = false;
				});
			},
			scrollBottom() {
				var that = this;
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
				if(document.getElementById("nav-list")) {
					if(scrollTop > navTop) {
						that.headAlpha = 1;
						document.getElementById("nav-list").classList.add("active","fixd-center");
					} else {
						that.headAlpha = scrollTop / navTop;
						document.getElementById("nav-list").classList.remove("active","fixd-center");
					}
				}
				if((scrollTop + clientHeight) == scrollHeight) {
					that.getData();
				}
			},
			changeType(id) {
				var that = this;
				that.askData.typeId = id;
				that.initData();
			},
			goShoppingCar() {
				var that = this;
				if(!that.goLogin()){
					return false;
				}
				that.$router.push({
					path: '/self/shoppingCart'
				});
			}
		},
		components: {
			'swipe': Swipe,
			'swipe-item': SwipeItem,
			Tabs,
			swiper,
			swiperSlide
		}
	}
</script>

<style>
	@import '~vue-swipe/dist/vue-swipe.css';
	.home-page {
		padding-top: 3.1rem;
	}
	
	.home-header {
		z-index: 20;
	}
	
	.home-header .home-header-bg {
		padding: 0.7rem 2.8rem 0.7rem 0.7rem;
	}
	
	.home-header .search-wrap {
		line-height: 1.7rem;
		height: 1.7rem;
		padding: 0 0.5rem 0 1.8rem;
		border-radius: 1.7rem;
		background-color: rgba(255, 255, 255, 0.1);
		background-image: url(~@assets/img/search-white.png);
		background-size: 0.6rem 0.6rem;
		background-repeat: no-repeat;
		background-position: 0.9rem center;
		color: rgba(255, 255, 255, 0.4)
	}
	
	.home-header .search-wrap > .bg {
		background-color: #F6F6F6;
		padding: 0 0.5rem 0 1.8rem;
		border-radius: 1.7rem;
		background-image: url(~@assets/img/search-gray.png);
		background-size: 0.6rem 0.6rem;
		background-repeat: no-repeat;
		background-position: 0.9rem center;
	}
	
	.home-header .shopping-bag {
		position: absolute;
		width: 2rem;
		height: 2rem;
		right: 0.5rem;
		bottom: 0.6rem;
		background-image: url(~@assets/img/shoppingBag-white.png);
		background-size: 1.4rem 1.4rem;
	}
	
	.home-header .shopping-bag > .bg {
		background-image: url(~@assets/img/shoppingBag-home-black.png);
		background-size: 1.4rem 1.4rem;
	}
	
	.home-banner-wrap {
		padding-bottom:0.4rem;
		height: 8rem;
	}
	
	.home-banner-wrap:before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 5.1rem;
		border-left: 18.75rem solid transparent;
		border-bottom: 1.95rem solid #FFFFFF;
	}
	
	.home-banner-wrap:after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 5.1rem;
		background: #FFFFFF;
	}
	
	.home-banner-wrap .home-swipe {
		height: 8rem;
		overflow: hidden;
		z-index: 10;
		/*
		box-shadow: 0 1rem 2rem 0 rgb(0, 0, 0, 0.1);
		*/
	}
	.home-banner-wrap .image {
		height: 8rem;
		margin: 0 0.65rem;
		border-radius: 0.1rem;
	}
	
	.home-type-list-wrap {
		position: relative;
		height: 2.3rem;
		margin-bottom: 0.2rem;
		margin-top: 0.3rem;
	}
	
	.home-type-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 2.3rem;
	}
	
	.home-type-list.active {
		position: fixed;
		top: 2.4rem;
		z-index: 10;
	}
	
	.home-type-scroll {
		overflow-x: auto;
		white-space: nowrap;
		margin-right: 0.9rem;
		padding-right: 0.3rem;
	}
	/*谁知道哪天会不会又要加上去
	.home-type-list:after {
		content: "";
		position: absolute;
		right: 0.9rem;
		top: 0;
		bottom: 0;
		width: 1.1rem;
		background: -webkit-linear-gradient(left, rgba(255,255,255,0),rgba(255,255,255,1));
		background: -o-linear-gradient(right, rgba(255,255,255,0),rgba(255,255,255,1));
		background: -moz-linear-gradient(right, rgba(255,255,255,0),rgba(255,255,255,1));
		background: linear-gradient(to right, rgba(255,255,255,0),rgba(255,255,255,1));
	}
	*/
	
	.home-type-list .home-type-item {
		padding: 0.6rem;
		line-height: 1.1rem;
	}
	
	.home-type-list .home-type-item.active {
		font-size: 0.8rem;
	}
	
	.home-type-list .home-type-item.active:after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0.8rem;
		right: 0.8rem;
		height: 0.15rem;
		background: #333333;
	}
	
	.home-product-list {
		padding: 0 0.9rem;
	}
	
	.home-product-list li {
		margin-bottom: 1.4rem;
	}
	
	.home-product-list li .image {
		height: 8.5rem;
		margin-bottom: 0.3rem;
		border-radius: 0.1rem;
	}
	
	.home-product-list li .name {
		line-height: 1.3;
	}
	
	.home-product-list li .public-price-wrap {
		margin-top: 0.3rem;
	}
	
	.home-product-list li .public-tag-red {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
	}
	
	.home-product-swipe {
		height: 15rem;
	}
	
	.home-product-swipe .mint-swipe-indicator {
		opacity: 1!important;
		background: #f6f6f6!important;
	}
	
	.home-product-swipe .mint-swipe-indicator.is-active {
		top: 0!important;
		width: 0.3rem!important;
		height: 0.3rem!important;
		background: #DDDDDD!important;
	}
	
	.product-hot-wrap .product-scroll-list li {
		width: 8.2rem;
		margin-right: 0.6rem;
	}
	
	.product-hot-wrap .product-scroll-list li .image {
		height: 5.3rem;
	}
	
	.product-hot-wrap .product-scroll-list {
		margin-bottom: 1rem;
	}
	
	.home-page .buffer1 {
		height: 1rem;
		margin-top: 0.6rem;
		margin-bottom: 0.4rem;
	}
	
	.home-page .buffer2 {
		height: 0.8rem;
		min-height: 0!important;
		margin-top: 0.4rem;
	}
	
	.home-page .buffer3 {
		height: 0.8rem;
		width: 5.1rem;
		margin-top: 0.3rem;
	}
	
	.home-page .Bullet-slide-area {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 995;
	}
	
	.home-page .mask-area {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 995;
		background-color: #000;
		opacity: .8;
	}
	
	.home-page .close {
		width: 1.7rem;
		height: 1.7rem;
		background: url("~@assets/img/close.png");
		background-size: cover;
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -0.85rem;
		z-index: 996;
	}
	
	.home-page .main-img-topic {
		border-radius: 0.1rem;
	}
	
	.home-page .main-img {
		width: 100%;
		height:19.7rem;
		border-radius: 0.1rem;
	}
	
	.home-page .swiper-container {
		z-index: 1000;
	}
	
	.home-page .mask-scroll-area {
		height: 22.7rem;
		overflow: hidden;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 996;
	}
	
	.home-page .Bullet-slide-area .swiper-slide {
		width: 15.3rem;
		height: 19.7rem;
		overflow: hidden;
	}
</style>