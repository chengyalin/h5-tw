<template>
	<div class="theme-page bg-white min-height-full">
		<ul class="theme-list clearfix">
			<router-link class="relative float-left" v-for = "(item,index) in listData" :key = "item.id" tag="li" :to = "{path:'/themeDetails',query:{themeId:item.id}}">
				<div class="image bg-cover bg-buffer block relative font-white font-12" :style="{'background-image':'url('+item.image+')'}">
					<span class="time-tag absolute line-ellipsis">#{{item.tag}}</span>
					<div class="count absolute line-ellipsis">
						<img class="icon vertical-middle" src="~@assets/img/eye-white.png"/>
						<span class="vertical-middle">{{item.viewCount}}</span>
					</div>
				</div>
				<p class="name font-darkGray font-16 font-bold line-ellipsis">{{item.title}}</p>
				<p class="font-lightGray line-ellipsis">{{item.subtitle}}</p>
			</router-link>
		</ul>
		<mt-spinner v-if="listData.length && more" type="triple-bounce" color="#00DCC4"></mt-spinner>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
export default {
	data () {
  		return {
  			askData:{
		        pageSize:20,
		        pageNum:1,
		        clientType:'web:h5'
		    },
		    switchShow:false,
			more:true,
			listData:[],
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.getData();
		window.addEventListener('scroll', that.scrollBottom)
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
		setBodyColor();
		window.removeEventListener('scroll', that.scrollBottom)
	},
	methods: {
		getData() {
			var that = this;
			if(that.more == 0 || that.switchShow) {
				return false;
			};
			that.switchShow = true;
			network(CONFIG.themes, that.askData).then((res) => {
				var details = res.details;
               	that.listData = that.listData.concat(details.data);
				that.askData.pageNum = details.page.pageNum + 1;
				that.more =  that.askData.pageNum <= details.page.pages;
				that.switchShow = false;
			});
		},
		scrollBottom() {
			var that = this;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if((scrollTop + clientHeight) == scrollHeight) {
				that.getData();
			}
		},
	}

}
</script>

<style>
.theme-page .theme-list{
	padding-top: 1rem;
}
.theme-page .theme-list li{
	width: 8.1rem;
	margin: 0 0 1rem 0.85rem;
}
.theme-page .theme-list li .image{
	height: 10rem;
}
.theme-page .theme-list li .time-tag{
	line-height: 0.8rem;
	padding: 0.1rem 0.15rem;
	background: rgba(0,0,0,0.4);
	bottom: 0.4rem;
	border-radius: 0.1rem;
}
</style>
