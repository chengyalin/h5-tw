<template>
	<div class="video-page bg-white has-footer has-footer-iphoneX">
		<div class="banner-wrap">
			<swipe v-if = "banners.length" class="swipe relative" :showIndicators = 'banners.length > 1'>
				<swipe-item v-for="(item,index) in banners" :key="index">
					<div class="image bg-buffer bg-cover" @click="See(item.bannerLink)" :style="{'background-image':'url('+item.bannerImageSrc+')'}"></div>
				</swipe-item>
			</swipe>
			<div v-else class="swipe relative">
				<div class="image bg-buffer"></div>
			</div>
		</div>
		<div class="title-h2-wrap display-flex-between">
			<span class="h2 font-20 font-darkGray font-bold">专题精选</span>
			<router-link v-if = "themes.length" class="btn-right font-lightGray font-12 public-arrow-right" to="/theme">更多</router-link>
		</div>
		<ul v-if="themes.length" class="theme-list">
			<router-link class="relative vertical-top" v-for = "(item,index) in themes" :key = "index" tag="li" :to = "{path:'/themeDetails',query:{themeId:item.themeId}}">
				<div class="image bg-cover bg-buffer block relative font-white font-12" :style="{'background-image':'url('+item.themeImage+')'}">
					<span class="time-tag absolute line-ellipsis">#{{item.themeTag}}</span>
					<div class="count absolute line-ellipsis">
						<img class="icon vertical-middle" src="~@assets/img/eye-white.png"/>
						<span class="vertical-middle">{{item.themeViewCount}}</span>
					</div>
				</div>
				<p class="name font-darkGray font-16 font-bold line-ellipsis">{{item.themeTitle}}</p>
				<p class="font-lightGray line-ellipsis">{{item.themeSubtitle}}</p>
			</router-link>
		</ul>
		<ul v-else class="theme-list overflow-hidden">
			<li class="relative vertical-top" v-for = "(item,index) in 3" :key = "index">
				<div class="image bg-cover bg-buffer block" ></div>
				<p class="bg-buffer buffer1" style="margin-top: 0.5rem;margin-bottom: 0.3rem;"></p>
				<p class="bg-buffer buffer1" style="width: 5rem;"></p>
			</li>
		</ul>
		<div class="title-h2-wrap display-flex-between">
			<span class="h2 font-20 font-darkGray font-bold">热门视频</span>
			<router-link v-if = "hotVideos.length" class="btn-right font-lightGray font-12 public-arrow-right" to="/video">更多</router-link>
		</div>
		<ul v-if="hotVideos.length" class="video-list public-padding-v">
			<router-link v-if="index == 0" v-for="(item,index) in hotVideos" :key = "index" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId}}">
				<div class="image bg-cover bg-buffer relative" :style="{'background-image':'url('+item.videoImageSrc+')'}">
					<span class="time-tag absolute font-white font-12 font-bold">{{item.length}}</span>
				</div>
				<p class="name font-16 font-darkGray font-bold">{{item.productName}}</p>
				<div class="font-lightGray font-12">
					{{item.author}} / #{{item.videoType}}
				</div>
			</router-link>
		</ul>
		<ul v-else class="video-list public-padding-v">
			<li >
				<div class="image bg-cover bg-buffer"></div>
				<p class="bg-buffer buffer1" style="margin-top: 0.5rem;margin-bottom: 0.3rem;"></p>
				<p class="bg-buffer buffer1" style="width: 5rem;"></p>
			</li>
		</ul>
		<ul v-if="listData.length" class="video-hot-list public-padding-v">
			<router-link v-if="index != 0 && index < 3" v-for="(item,index) in hotVideos" :key = "index" class="display-flex-between" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId}}">
				<div class="image bg-cover bg-buffer relative" :style="{'background-image':'url('+item.videoImageSrc+')'}">
					<span class="time-tag absolute font-white font-12 font-bold">{{item.length}}</span>
				</div>
				<div class="content display-flex-between flex-column">
					<p class="name font-16 font-darkGray font-bold line-clamp-2">{{item.productName}}</p>
					<div class="font-lightGray font-12">
						{{item.author}} / #{{item.videoType}}
					</div>
				</div>
			</router-link>
		</ul>
		<div v-if="listData.length" class="title-h2-wrap">
			<span class="h2 font-20 font-darkGray font-bold">全部视频</span>
		</div>
		<ul v-if="listData.length" class="video-list public-padding-v">
			<router-link v-for = "(item,index) in listData" :key = "index" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId}}">
				<div class="image bg-cover bg-buffer relative" :style="{'background-image':'url('+item.videoImageSrc+')'}">
					<span class="time-tag absolute font-white font-12 font-bold">{{item.length}}</span>
				</div>
				<p class="name font-16 font-darkGray font-bold">{{item.videoTitle}}</p>
				<div class="font-lightGray font-12">
					{{item.author}} / #{{item.videoType}}
				</div>
			</router-link>
		</ul>
		<mt-spinner v-if="listData.length && more" type="triple-bounce" color="#00DCC4"></mt-spinner>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { Swipe, SwipeItem } from 'vue-swipe';
import { setBodyColor } from '@assets/js/mUtils';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
export default {
	data () {
  		return {
			askData:{},
		    switchShow:false,
			more:true,
			listData:[],
			hotVideos:[],
			themes:[],
			banners:[]
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		network(CONFIG.news,{clientType:'web:h5'},{method:'GET'}).then((res) => {
			var details = res.details;
           	that.listData = details.videos.data;
           	that.themes = details.themes;
           	that.banners = details.banners;
           	that.hotVideos = details.hotVideos;
			that.askData.pageNum = details.videos.page.pageNum + 1;
			that.askData.pageSize = details.videos.page.pageSize;
		});
		window.addEventListener('scroll', that.scrollBottom)
	},
	methods:{
		getData(){
			var that = this;
			if (!that.more || that.switchShow) {
		        return false;
		    };
		    that.switchShow = true;
            network(CONFIG.videos,that.askData,{method:'GET'}).then((res) => {
				var details = res.data;
               	that.listData = that.listData.concat(details);
				that.askData.pageNum = res.page.pageNum + 1;
				that.more =  that.askData.pageNum <= res.page.pages;
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
	    },
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
		setBodyColor();
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom)
	},
	components: {
		'swipe': Swipe,
	    'swipe-item': SwipeItem
	}
}
</script>

<style>
@import '~vue-swipe/dist/vue-swipe.css';
.video-page {
	padding-bottom: 1rem;
}
.video-page .banner-wrap {
	padding-top: 0.7rem;
	padding-bottom: 0.4rem;
}
.video-page .mint-swipe,
.video-page .mint-swipe-items-wrap{
	overflow:visible;
}

.video-page .swipe {
	height: 7.5rem;
}

.video-page .swipe .image{
	margin: 0 0.9rem;
	height: 7.5rem;
	border-radius: 0.1rem;
	box-shadow: 0 0.5rem 1rem 0 rgb(0, 0, 0, 0.08);
}

.video-page .theme-list{
	white-space: nowrap;
	overflow-x: auto;
	padding-left: 0.9rem;
	padding-bottom: 0.9rem;
}
.video-page .video-list li{
	padding-bottom: 1.5rem;
}
.video-page .video-list li:last-child{
	padding-bottom: 1.1rem;
}
.video-page .video-list .image{
	height: 8.5rem;
	border-radius: 0.1rem;
}
.video-page .video-list .name{
	line-height: 1.375;
	margin-top: 0.5rem;
	margin-bottom: 0.3rem;
}
.video-page .time-tag{
	line-height: 0.8rem;
	padding: 0.1rem 0.15rem;
	background: rgba(0,0,0,0.4);
	right: 0.4rem;
	bottom: 0.4rem;
	border-radius: 0.1rem;
}
.video-page .video-hot-list li{
	padding-bottom: 1.3rem;
}
.video-page .video-hot-list li:last-child{
	padding-bottom: 0.9rem;
}
.video-page .video-hot-list li .image{
	height: 4.5rem;
	width: 8rem;
	border-radius: 0.2rem;
}
.video-page .video-hot-list li .content{
	width: 8rem;
}
.video-page .buffer1{
	height: 0.8rem;
}
</style>