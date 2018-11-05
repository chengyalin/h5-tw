<template>
	<div class="video-page bg-white min-height-full">
		<ul class="video-list public-padding-v">
			<router-link v-for = "(item,index) in listData" :key = "'video'+ item.videoId" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId}}">
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
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
export default {
	data () {
  		return {
			askData:{},
		    switchShow:false,
			more:true,
			listData:[]
  		}
  	},
  	mounted(){
		var that = this;
		that.getData();
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
		window.removeEventListener('scroll',that.scrollBottom)
	},
	destroyed(){
		var that = this;
		window.removeEventListener('scroll',that.scrollBottom)
	}
}
</script>

<style>
.video-page .video-list{
	padding-top: 1rem;
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
</style>