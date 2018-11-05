<template>
	<div class="themeDetails-page has-footer bg-white has-footer-iphoneX">
		<div class="big-image bg-buffer bg-cover" :style="{'background-image':'url('+mainData.themeBigImage+')'}"></div>
		<div v-if="mainData.themeId" class="public-padding-v">
			<p class="name font-darkGray">{{mainData.themeTitle}}</p>
			<div class="display-flex-between flex-align-center">
				<div class="source">
					<span class="avatar bg-buffer bg-cover vertical-middle" :style="{'background-image':'url('+mainData.themeContentSourceLogo+')'}"></span>
					<div class="vertical-middle">
						<p class="font-bold font-darkGray">{{mainData.themeContentSourceName || '探物科技'}}</p>
						<p class="font-12 font-lightGray">发布于 {{mainData.themeCreateDatetime | formatTime8}}</p>
					</div>
				</div>
				<span v-if="mainData.themeTag" class="tag font-green font-bold font-12">#{{mainData.themeTag}}</span>
			</div>
			<div class="desc font-darkGray">{{mainData.themeDesc}}</div>
			<!--
			<iframe :src="mainData.themeUrl" width="100%" :height="clientHeight"></iframe>
			-->
			<div v-html="mainData.themeDetails"></div>
			<div class="like-wrap text-center font-blue font-12">
				<span class="like-btn inline-block relative" :class="{'active':mainData.praiseFlag == 1}" @click="praise"></span>
				<p>赞 {{mainData.praiseCount}}</p>
			</div>
		</div>
		<span class="line-normal"></span>
		<div class="title-h2-wrap">
			<span class="h2 font-20 font-darkGray font-bold">评论</span>
		</div>
		<ul v-if="mainData.commentList.length" class="comments-list font-12 public-padding-v">
			<li class="line-ellipsis font-darkGray" v-for = "(item,index) in mainData.commentList" @click="reply(index)">
				<span>{{item.nickname}}</span>
				<span v-if="item.type == 1">回复 {{item.replyNickname}}</span>
				<span>：</span>
				<span class="font-grey">{{item.commentContent || item.replyContent}}</span>
			</li>
		</ul>
		<p v-else class="comments-none text-center font-lightGray">趁没人，快抢个沙发吧～</p>
		<router-link tag = 'div' v-if="mainData.commentCount > 5" class="comments-more font-green font-12 font-bold text-center" :to = "{path:'/comment',query:{themeId:askData.themeId}}">
			<span class="public-arrow-right">查看全部{{mainData.commentCount}}条评论</span>
		</router-link>
		<div class="public-comment-footer border-box fixed left bottom right bg-white font-12 display-flex-between font-darkGray iphoneX-footer fixd-center">
			<input @keypress="keypressSubmit(comment,$event)" class="comment-input font-12" v-model="comment" type="text" maxlength="100" :placeholder="replyItem?'回复：'+replyItem.nickname:'有什么想说的？直接评论吧'"/>
			<span class="comment-btn absolute font-BBB font-16" :class="{'font-green':comment && comment.length}" @click="submit(comment)">发送</span>
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
			askData:{},
			mainData:{
				commentList:[],
				productList:[]
			},
			switchShow:false,
			clientHeight:0,
			comment:'',
			replyItem:null
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.askData.themeId = that.$route.query.themeId;
		that.initData();
		var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		that.clientHeight = clientHeight;
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.themesInfo,that.askData,{method:'GET'}).then((res) => {
				that.mainData = res.details;
			});
		},
		praise(){
			var that = this;
			if(that.switchShow) {
				return false;
			};
			that.switchShow = true;
			network(CONFIG.themesPraise,{
				praiseStatus:that.mainData.praiseFlag == 0,
				themeId:that.askData.themeId
			}).then((res) => {
				that.mainData.praiseFlag = that.mainData.praiseFlag == 0?1:0;
				that.mainData.praiseCount = that.mainData.praiseFlag == 1?that.mainData.praiseCount+1:that.mainData.praiseCount-1;
				that.switchShow = false;
			});
		},
		keypressSubmit(value, e){
			var that = this;
			if(e && e.keyCode == 13 && value) {
				that.submit(value)
			}
		},
		submit(value){
            	var that = this;
            	if( value ){
            		network(CONFIG.themeCommentRelease,{
				 	themeId: that.askData.themeId, 
                		content: value.trim(),
                		replyCommentId: that.replyItem ?  that.replyItem.commentId : 0,
		    		}).then((res) => {
	               Vue.toast('评论成功',{duration:1500});
	               that.comment = "";
	               that.replyItem = null;
	               that.initData();
				});
            	}
        },
        reply(index){
        		var that = this;
        		that.replyItem = that.mainData.commentList[index];
        }
	},
	destroyed(){
		setBodyColor();
	},
}
</script>

<style>
.themeDetails-page .big-image{
	height: 15rem;
}
.themeDetails-page .name{
	font-size: 1.3rem;
	padding-top: 0.7rem;
	padding-bottom: 1.1rem;
}
.themeDetails-page .desc{
	line-height: 1.5;
	padding-top: 2.7rem;
	padding-bottom: 1rem;
}
.themeDetails-page .tag{
	padding: 0.3rem 0.4rem;
	background: rgba(62,216,196,0.1);
	border-radius: 0.1rem;
}
.themeDetails-page .source .avatar{
	width: 1.8rem;
	height: 1.8rem;
	border-radius: 100%;
	margin-right: 0.3rem;
}
.themeDetails-page .comments-list{
	margin-bottom: 1rem;
}
.themeDetails-page .comments-list li{
	margin-bottom: 0.4rem;
}
.themeDetails-page .comments-more{
	margin-bottom: 2.1rem;
}
.themeDetails-page .comment-input{
	width: 100%;
}
.themeDetails-page .like-wrap{
	padding-top: 2rem;
	padding-bottom: 1.5rem;
}
.themeDetails-page .like-btn{
	width: 2.8rem;
	height: 2.8rem;
	background: rgba(54,100,110,0.06) url(~@assets/img/like-big-green.svg) no-repeat center;
	background-size: 0.9rem;
	border-radius: 0.1rem;
	margin-bottom: 0.4rem;
}
.themeDetails-page .like-btn:after{
	content: "";
	display: none;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border-radius: 0.1rem;
	background: #36646E url(~@assets/img/like-big-gray.svg) no-repeat center;
}
.themeDetails-page .like-btn.active:after{
	display: block;
}
.themeDetails-page .comments-none{
	padding-top: 1rem;
	padding-bottom: 2.5rem;
}
.themeDetails-page .public-comment-footer{
	padding-right: 3.1rem;
}
</style>