<template>
	<div class="follower-page bg-white">
		<ul class="follower-list public-padding-v">
			<li v-for="(item,index) in listData" class="display-flex-between flex-align-center">
				<router-link :to="{path: '/self/selfEdit', query:{uuid: item.uuid}}" class="avatar bg-buffer bg-cover" :style="{'background-image':'url('+item.head_thumb+')'}"></router-link>
				<router-link :to="{path: '/self/selfEdit', query:{uuid: item.uuid}}" class="name font-bold line-ellipsis" tag = "p">{{item.nick_name}}</router-link>
				<span class="follow-btn font-green font-12" :class="{'active':item.is_follow == 'true'}" @click="follow(index)">{{item.is_follow == 'true'?'已关注':'+ 关注'}}</span>
			</li>
		</ul>
		<div v-if="noDataFlag" class="noData-wrap center fixed text-center">
			<img class="noData-image" src="~@assets/img/message-null.png"/>
			<p v-if = "selfFlag && followersFlag" class="font-lightGray">一个粉丝也没有T^T</p>
			<p v-else-if = "selfFlag" class="font-lightGray">快去关注一些有趣的人吧</p>
			<p v-else-if = "followersFlag" class="font-lightGray">成为TA的头号粉丝吧</p>
			<p v-else class="font-lightGray">高冷的TA，还没有关注任何人</p>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="confirmFlag">
				<div class="public-popup-shadow" @click="confirmFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-grey font-14 relative">
						确认不再关注此探友
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="font-16 text-center public-lineheight"  @click="follow">确定</div>
					<div class="picker-btn font-16 text-center public-lineheight"  @click="confirmFlag = false">取消</div>
				</div>
			</div>
		</transition>
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
			askData:{
				size:20,
				start:-1,
			},
		    switchShow:false,
		    noDataFlag:false,
			more:true,
			listData:[],
			networkUrl:'',
			followersFlag:false,
			selfFlag:false,
			confirmFlag:false
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		if(that.$route.query.uuid){
			that.askData.uuid = that.$route.query.uuid;
			if(localStorage.getItem("twUser") && JSON.parse(localStorage.getItem("twUser")).uuid == that.askData.uuid){
				that.selfFlag = true
			}
		}else{
			that.selfFlag = true
			that.askData.uuid = localStorage.getItem("twUser") ? JSON.parse(localStorage.getItem("twUser")).uuid : '';
		}
		that.followersFlag = that.$route.query.type?true:false;
		that.networkUrl = that.$route.query.type?CONFIG.userFollowers:CONFIG.userFollows;
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
            network(that.networkUrl,that.askData).then((res) => {
				var details = res.details.details;
				console.log(details)
				that.listData = that.listData.concat(details);
				that.askData.start = res.result.start;
				that.more = res.result.more;
				that.switchShow = false;
				if(!that.listData.length){
					that.noDataFlag = true;
				}
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
	    confirmShow(index){
			var that = this;
			that.confirmFlag = true;
			that.followIndex = index;
		},
		follow(index){
			var that = this;
			var item = that.confirmFlag?that.listData[that.followIndex]:that.listData[index];
			if(item.is_follow == 'true' && !that.confirmFlag){
	    			that.confirmShow(index)
	    		}else{
	    			network(CONFIG.userFollow, {
					uuid:item.uuid,
					follow:item.is_follow == 'true'?'N':'Y'
				}).then((res) => {
					if(res.result.flag == 1){
						Vue.toast('关注成功',{duration:1500});
						item.is_follow = 'true';
					}else{
						Vue.toast('已取消关注',{duration:1500});
						item.is_follow = 'false';
						that.confirmFlag = false;
					}
				});
	    		}
		}
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
	}
}
</script>

<style>
.follower-list li{
	padding: 1rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.follower-list li:last-child{
	border: none;
}
.follower-list .avatar{
	display: block;
	width: 1.8rem;
	height: 1.8rem;
	border-radius: 100%;
}
.follower-list .name{
	width: 11.5rem;
}
</style>