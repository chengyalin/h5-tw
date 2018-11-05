<template>
	<div class="searchResult-page bg-white">
		<div class="search-header fixed left right top bg-white text-right fixd-center">
			<div class="search-wrap inline-block relative text-left">
				<input @keypress="submit" type="text" class="search-input" v-model="keywords" placeholder="想体验什么？搜搜看" autofocus="true" id="search"/>
				<span v-if="keywords.length" class="clear-btn absolute" @click="keywords = ''"></span>
			</div>
			<ul v-if="!noDataFlag" class="sort-list display-flex-between font-12">
				<li @click="sort(0)">
					<span class="vertical-middle">综合</span>
				</li>
				<li @click="sort(1)">
					<span class="vertical-middle">价格</span>
					<img v-if = "askData.sortName == 1" class="sort vertical-middle" :class="{'up':askData.sortType == 1}" src="~@assets/img/sort-down.png"/>
					<img v-else class="sort vertical-middle" src="~@assets/img/sort-gray.png"/>
				</li>
				<li @click="sort(2)">
					<span class="vertical-middle">最新</span>
					<img v-if = "askData.sortName == 2" class="sort vertical-middle" :class="{'up':askData.sortType == 1}" src="~@assets/img/sort-down.png"/>
					<img v-else class="sort vertical-middle" src="~@assets/img/sort-gray.png"/>
				</li>
				<li @click="sort(3)">
					<span class="vertical-middle">人气</span>
					<img v-if = "askData.sortName == 3" class="sort vertical-middle" :class="{'up':askData.sortType == 1}" src="~@assets/img/sort-down.png"/>
					<img v-else class="sort vertical-middle" src="~@assets/img/sort-gray.png"/>
				</li>
			</ul>
			<span class="line-normal"></span>
		</div>
		<ul v-if = "listData.length" class="closeProduct-list public-padding-v">
			<router-link class="display-flex-between" v-for = "(item,index) in listData" tag="li" :to = "{path:'/productDetails',query:{productId:item.product_id}}">
				<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.image_src+')'}"></span>
				<div class="content display-flex-between flex-column">
					<div>
						<p class="name font-darkGray font-bold line-ellipsis">{{item.name}}</p>
						<div class="star-wrap">
							<div class="star-list vertical-middle font-12 font-lightGray">
								<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
				                    <span v-if="item.avg_score >= starItem" class="star"></span>
				                    <span v-else-if="item.avg_score < starItem && (item.avg_score*1+1) > starItem" class="star" :style = "{'width':item.avg_score%1*100+'%'}"></span>
				                </div>
				                <span class="vertical-middle">{{item.appraiseScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraise_count}}</span>
							</div>
						</div>
					</div>
					<div class="public-price-wrap">
						<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.rent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.rent | formatDecimal}}</span>
						<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
					</div>
				</div>
			</router-link>
		</ul>
		<div v-else-if="noDataFlag" class="noData-wrap text-center">
			<img class="image" src="~@assets/img/message-null.png"/>
			<div>
				<span class="font-grey">暂无该产品，你可协助我们</span>
				<router-link class="font-green" :to = "{path:'/suggestProduct'}">补充产品</router-link>
			</div>
		</div>
		<div v-if="likeData.length">
			<p class="font-20 font-bold public-padding-v">猜你喜欢</p>
			<ul class="closeProduct-list public-padding-v">
				<router-link class="display-flex-between" v-for = "(item,index) in likeData" tag="li" :to = "{path:'/productDetails',query:{productId:item.product_id}}">
					<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.image_src+')'}"></span>
					<div class="content display-flex-between flex-column">
						<div>
							<p class="name font-darkGray font-bold line-ellipsis">{{item.name}}</p>
							<div class="star-wrap">
								<div class="star-list vertical-middle font-12 font-lightGray">
									<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
					                    <span v-if="item.avg_score >= starItem" class="star"></span>
					                    <span v-else-if="item.avg_score < starItem && (item.avg_score*1+1) > starItem" class="star" :style = "{'width':item.avg_score%1*100+'%'}"></span>
					                </div>
					                <span class="vertical-middle">{{item.appraiseScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraise_count}}</span>
								</div>
							</div>
						</div>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.rent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.rent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
						</div>
					</div>
				</router-link>
			</ul>
		</div>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
export default {
	data () {
  		return {
  			keywords:'',
			askData:{
				"size" :20,
				"start":-1,
				"productId":-1,
				"search_str":'',
				"sortName":0,
				"sortType":0
			},
			more:1,
			switchShow:false,
			noDataFlag:false,
			listData:[],
			likeData:[]
		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.keywords = that.$route.params.key || "";
		that.initData();
		window.addEventListener('scroll', that.scrollBottom);
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
		submit(e){
			if(e.keyCode == 13){
	            	var that = this;
	            	if(that.keywords.trim().length){
	            		var getSeartch = localStorage.getItem("searchRecord")?JSON.parse(localStorage.getItem("searchRecord")):[];
		            	if(getSeartch.indexOf(that.keywords)!= -1){
			        		getSeartch.splice(getSeartch.indexOf(that.keywords),1);
			        	};
			        	getSeartch.unshift(that.keywords);
			        	if(getSeartch.length > 10){
			        		getSeartch.pop();
			        	};
			        	localStorage.setItem('searchRecord',JSON.stringify(getSeartch));
	            	} 
				that.initData();
			}
        },
        initData(){
			var that = this;
	        	that.askData.start = "-1";
			that.listData = [];
			that.more = 1;
			that.switchShow = false;
			that.noDataFlag = false;
	        	that.askData.search_str = that.keywords;
	        	that.getData();
        },
        getData(){
        		var that = this;
        		if (that.more == 0 || that.switchShow) {
		        return false;
		    };
		    that.switchShow = true;
		    network(CONFIG.searchProducts,that.askData).then((res) => {
	           	that.listData = that.listData.concat(res.details.products) ;
				that.askData.start = res.result.start;
				that.more = res.result.more;
				that.switchShow = false;
				that.noDataFlag = that.listData.length == 0;
				if(!that.likeData.length && res.details.homeHotProducts){
					that.likeData = res.details.homeHotProducts;
				}
			});
        },
        sort(type){
	        	var that = this;
	        	if(type == that.askData.sortName){
	        		that.askData.sortType = (that.askData.sortType == 1)?0:1;
	        	}else{
	        		that.askData.sortName = type;
	        		that.askData.sortType = 0;
	        	}
			that.initData();
		},
		 scrollBottom(){
        		var that = this;
        		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if((scrollTop + clientHeight) == scrollHeight){
				that.getData();
			}
        },
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.searchResult-page{
	padding-top: 4.1rem;
}
.searchResult-page .search-header{
	padding-top: 0.3rem;
	z-index: 10;
}
.searchResult-page .search-header .search-wrap {
	padding: 0.35rem 2.2rem 0.35rem 1.8rem;
	border-radius: 1.7rem;
	background:#F6F6F6 url(~@assets/img/search-gray.png) no-repeat 0.9rem center;
	background-size: 0.6rem 0.6rem;
	margin-bottom: 0.3rem;
	margin-left: 0.9rem;
	margin-right: 0.9rem;
}
.searchResult-page .search-header .search-wrap .search-input{
	line-height: 1rem;
	height: 1rem;
	width: 13rem;
	background: transparent;
}
.searchResult-page .search-header .search-wrap .search-input::-webkit-input-placeholder{
    color: #999999;
}
.searchResult-page .search-header .search-wrap .clear-btn{
	right: 0.7rem;
	top: 50%;
	margin-top: -0.3rem;
	width: 0.6rem;
	height: 0.6rem;
	border-radius: 100%;
	background: #ddd url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.3rem ;
}
.searchResult-page .search-header .cancal-btn{
	right: 0.4rem;
	padding: 0.5rem;
	top: 0.17rem;
}
.searchResult-page .closeProduct-list{
	margin-top: 0.8rem;
}
.searchResult-page .sort-list{
	padding: 0 1.8rem;
}
.searchResult-page .sort-list li{
	padding:0.2rem 0.3rem 0.6rem 0.3rem;
}
.searchResult-page .sort-list li .sort{
	width: 0.3rem;
	position: relative;
	top: -0.05rem;
	margin-left: 0.1rem;
}
.searchResult-page .sort-list li .sort.up{
	transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
}
.searchResult-page .noData-wrap{
	padding-top: 0.2rem;
	padding-bottom: 3.5rem;
}
.searchResult-page .noData-wrap .image{
	width:7.4rem;
	height: 6.3rem;
	margin-bottom: 1rem;
}
</style>
