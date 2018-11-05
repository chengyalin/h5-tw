<template>
	<div class="search-page bg-white has-header">
		<div class="search-header fixed left right top bg-white fixd-center">
			<div class="search-wrap inline-block relative">
				<input @keypress="submit(keywords,$event)" type="text" class="search-input" v-model="keywords" placeholder="想体验什么？搜搜看" autofocus="true" id="search"/>
				<span v-if="keywords.length" class="clear-btn absolute" @click="keywords = ''"></span>
			</div>
			<span class="line-normal"></span>
			<span class="cancal-btn absolute" @click="routerBack">取消</span>
		</div>
		<ul v-if= "products.length" class="history-list public-padding-v font-12">
			<router-link v-for = "(item,index) in products" class="relative" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}">
				<p class="word">{{item.productName}}</p>
				<span class="line-normal"></span>
			</router-link>
		</ul>
		<div v-else>
			<div class="title-h2-wrap" style="padding-top: 0.9rem;">
				<span class="h2 font-16 font-darkGray font-bold">大家都在搜</span>
			</div>
			<ul class="hotSearch-list public-padding-v font-12">
				<li v-for = "item in hotSearch" class="vertical-middle" @click="submit(item)">{{item}}</li>
			</ul>
			<div v-if = "historyList.length">
				<div class="title-h2-wrap display-flex-between" style="padding-bottom: 0;">
					<span class="h2 font-16 font-darkGray font-bold">历史记录</span>
					<span class="btn-right font-lightGray font-12" @click="clear">清空</span>
				</div>
				<ul class="history-list public-padding-v font-12">
					<li v-for = "(item,index) in historyList" class="relative">
						<p class="word" @click="submit(item)">{{item}}</p>
						<span class="line-normal"></span>
						<span class="delete-btn bg-contain absolute right" @click="clearOne(index)"></span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
export default {
	data () {
  		return {
  			keywords:'',
			askData:{},
			hotSearch:[],
			historyList:[],
			products:[]
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		network(CONFIG.searchKey).then((res) => {
           	that.hotSearch = res.details.keys;
		});
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			if(localStorage.getItem("searchRecord")){
            		that.historyList = JSON.parse(localStorage.getItem("searchRecord"));
            };
		},
		submit(value,e){
            	var that = this;
            	if(!e || (e && e.keyCode == 13)){
				var getSeartch = localStorage.getItem("searchRecord")?JSON.parse(localStorage.getItem("searchRecord")):[];
				if(getSeartch.indexOf(value)!= -1){
					getSeartch.splice(getSeartch.indexOf(value),1);
				};
				getSeartch.unshift(value);
				if(getSeartch.length > 10){
					getSeartch.pop();
				};
				that.historyList = getSeartch;
				localStorage.setItem('searchRecord',JSON.stringify(getSeartch));
                that.$router.push({name: 'searchResult',params:{key:value}});
            	}else if(e && e.keyCode != 13 && value ){
            		network(CONFIG.searchBar,{keyword:value},{codeFlag:true}).then((res) => {
		           	if(res.head.code == 0){
		           		that.products = res.details.products;
		           	}
				});
            	}
        },
        clear(){
            var that = this;
            that.historyList = [];
            localStorage.removeItem('searchRecord');
        },
        clearOne(index){
        		var that = this;
        		if(that.historyList.length == 1){
        			that.clear();
        		}else{
        			var getSeartch = localStorage.getItem("searchRecord")?JSON.parse(localStorage.getItem("searchRecord")):[];
				getSeartch.splice(index,1);
				that.historyList = getSeartch;
				localStorage.setItem('searchRecord',JSON.stringify(getSeartch));
        		}
        },
        routerBack(){
        		var that = this;
        		that.$router.go(-1);
        }
	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.search-page .search-header{
	padding-top: 0.3rem;
	z-index: 10;
}
.search-page .search-header .search-wrap {
	padding: 0.35rem 2.2rem 0.35rem 1.8rem;
	border-radius: 1.7rem;
	background:#F6F6F6 url(~@assets/img/search-gray.png) no-repeat 0.9rem center;
	background-size: 0.6rem 0.6rem;
	margin-bottom: 0.3rem;
	margin-left: 0.9rem;
}
.search-page .search-header .search-wrap .search-input{
	line-height: 1rem;
	height: 1rem;
	width: 11rem;
	background: transparent;
}
.search-page .search-header .search-wrap .search-input::-webkit-input-placeholder{
    color: #999999;
}
.search-page .search-header .search-wrap .clear-btn{
	right: 0.7rem;
	top: 50%;
	margin-top: -0.3rem;
	width: 0.6rem;
	height: 0.6rem;
	border-radius: 100%;
	background: #ddd url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.3rem ;
}
.search-header .cancal-btn{
	right: 0.4rem;
	padding: 0.5rem;
	top: 0.17rem;
}
.search-page .hotSearch-list li{
	padding: 0.2rem 0.8rem;
	border-radius: 1rem;
	background: #F6F6F6;
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}
.search-page .history-list li .word{
	padding: 0.7rem 0;
	margin-right: 2rem;
}
.search-page .history-list li .delete-btn{
	top: 50%;
	margin-top: -0.3rem;
	width: 0.6rem;
	height: 0.6rem;
	border-radius: 100%;
	background-color: #DDDDDD;
	background-image: url(~@assets/img/close-white.svg);
	background-size:0.3rem ;
}
.search-page .title-h2-wrap{
	padding-bottom: 0.6rem;
}
</style>
