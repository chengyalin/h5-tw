<template>
	<div class="productByRentType-page bg-white">
		<div class="productByRentType-banner-wrap relative">
			<swipe class="swipe relative" :auto = '0' :showIndicators = 'banners.length > 1'>
			    <swipe-item v-for="(item,index) in banners" :key = "index">
			    		<div class="image bg-buffer bg-cover" :style="{'background-image':'url('+item.bannerImageSrc+')'}"></div>
			    </swipe-item>
			</swipe>
		</div>
		<div >
			<div class="title-h2-wrap">
				<span class="h2 font-20 font-darkGray font-bold">热门产品</span>
			</div>
			<div class="product-scroll-wrap product-hot-wrap">
				<ul v-if="hotByTypeList.length > 1" class="product-scroll-list">
					<router-link class="vertical-top" v-for = "(item,index) in [hotByTypeList[0],hotByTypeList[1]]" :key = "index" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}">
						<span class="bg-cover image" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
						<p class="font-darkGray font-bold font-14 line-clamp-2 name">{{item.productName}}</p>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.productRent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/日</span>
						</div>
					</router-link>
				</ul>
			</div>
			<swipe class="home-product-swipe relative" :auto = '0' :showIndicators = 'hotByTypeList.length > 5'>
			    <swipe-item v-for="(pItem,pIndex) in Math.ceil((hotByTypeList.length-2)/3)">
				    <ul class="closeProduct-list public-padding-v relative">
						<router-link class="display-flex-between" v-for = "(item,index) in [hotByTypeList[pIndex*3+2],hotByTypeList[pIndex*3+3],hotByTypeList[pIndex*3+4]]" v-if = "item" :key = "index" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}">
							<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.productImageSrc+')'}"></span>
							<div class="content display-flex-between flex-column">
								<div>
									<p class="name font-bold line-ellipsis">{{item.productName}}</p>
									<div class="star-wrap">
										<div class="star-list vertical-middle font-12 font-lightGray">
											<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
							                    <span v-if="item.appraiseAvgScore >= starItem" class="star"></span>
							                    <span v-else-if="item.appraiseAvgScore < starItem && (item.appraiseAvgScore*1+1) > starItem" class="star" :style = "{'width':item.appraiseAvgScore%1*100+'%'}"></span>
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
		<div class="title-h2-wrap">
			<span class="h2 font-20 font-darkGray font-bold">所有产品</span>
		</div>
		<ul class="home-product-list overflow-hidden">
			<router-link v-for = "(item,index) in products" :key = "index" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}">
				<div class="image bg-cover bg-buffer block relative" :style="{'background-image':'url('+item.productImageSrc+')'}">
					<span v-if="item.showTag" class="public-tag-red font-white font-10">{{item.showTag}}</span>
				</div>
				<p class="name font-darkGray font-16 font-bold">{{item.productName}}</p>
				<div class="star-wrap">
					<div class="star-list vertical-middle font-12 font-lightGray">
						<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
		                    <span v-if="item.appraiseAvgScore >= starItem" class="star"></span>
		                    <span v-else-if="item.appraiseAvgScore < starItem && (item.appraiseAvgScore*1+1) > starItem" class="star" :style = "{'width':item.appraiseAvgScore%1*100+'%'}"></span>
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
		<mt-spinner v-if="products.length && more" type="triple-bounce" color="#00DCC4"></mt-spinner>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Swipe, SwipeItem } from 'vue-swipe';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
export default {
	data () {
  		return {
  			askData:{
		      rentType :0,
		      pageSize:10,
		      pageNum:1,
		      clientType:'web:h5'
		    },
		    more:true,
		    switchShow:false,
  			banners:[],
  			hotByTypeList:[],
  			products:[],
  		}
  	},
  	mounted(){
		var that = this;
		that.askData.rentType = that.$route.query.rentType;
		if(that.askData.rentType == 0){
			document.title = '热门短租'
		}
		that.getData();
		window.addEventListener('scroll', that.scrollBottom)
	},
	activated(){
		var that = this;
		window.scrollTo(0,0);
		window.addEventListener('scroll', that.scrollBottom)
	},
	deactivated(){
		var that = this;
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom)
	},
	methods:{
		initData(){
			var that = this;
			that.askData.pageNum = 1;
            that.more = true;
            that.switchShow = false;
            that.products = [];
            that.getData();
		},
		getData(){
        		var that = this;
        		if (!that.more|| that.switchShow) {
		        return false;
		    };
		    that.switchShow = true;
		    network(CONFIG.products,that.askData,{method:'GET'}).then((res) => {
	    			var details = res.details;
			    if(!that.banners.length && !that.hotByTypeList.length){
				    	that.hotByTypeList = details.hotProductList;
				    that.banners = details.bannerList;
				}
			    that.products =  that.products.concat(details.allProductList.data);
			    that.askData.pageNum = details.allProductList.page.pageNum + 1;
			    that.more =  that.askData.pageNum <= details.allProductList.page.pages;
		    		that.switchShow = false;
			});
        },
        scrollBottom(){
        		var that = this;
        		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if((scrollTop + clientHeight) == scrollHeight){
				that.getData();
			}
        }
	},
	components: {
		'swipe': Swipe,
	    'swipe-item': SwipeItem,
	}
}
</script>

<style>
@import '~vue-swipe/dist/vue-swipe.css';
.home-product-list{
	padding: 0 0.9rem;
}
.home-product-list li{
	margin-bottom: 1.4rem;
}
.home-product-list li .image{
	height: 8.5rem;
	margin-bottom: 0.3rem;
	border-radius: 0.1rem;
}
.home-product-list li .name{
	line-height: 1.3;
}
.home-product-list li .public-price-wrap{
	margin-top: 0.3rem;
}
.home-product-list li .public-tag-red{
	position: absolute;
	top: 0.6rem;
	right: 0.6rem;
}
.home-product-swipe{
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
.product-hot-wrap .product-scroll-list li{
	width: 8.2rem;
	margin-right: 0.6rem;
}
.product-hot-wrap .product-scroll-list li .image{
	height: 5.3rem;
}
.product-hot-wrap .product-scroll-list{
	margin-bottom: 1rem;
}

.productByRentType-banner-wrap{
	padding-top: 0.6rem;
	height: 5rem;
}
.productByRentType-banner-wrap .mint-swipe,
.productByRentType-banner-wrap .mint-swipe-items-wrap{
	overflow:visible;
}
.productByRentType-page .productByRentType-banner-wrap .image{
	border-radius: 0.1rem;
	height: 5rem;
	margin: 0 0.9rem 0.2rem 0.9rem;
	box-shadow: 0 0 0.8rem rgba(0,0,0,0.16);
}
.productByRentType-page .product-scroll-list{
	margin-bottom: 0.5rem;
}
</style>
