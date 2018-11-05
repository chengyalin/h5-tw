<template>
	<div class="videoDetails-page has-footer has-footer-iphoneX">
		<div class="bg-page fixed left top right bottom left bg-cover" :style="{'background-image':'url('+mainData.background+')'}"></div>
		<div class="bg-page2 fixed left top right bottom left"></div>
		<div v-if="mainData.source" class="videoDetails-content fixed left top bottom right fixd-center">
			<div class="video-wrap bg-buffer">
			    	<video :src="mainData.source" id="video" controls="controls" class="block width-full">
			    		当前浏览器不支持 video直接播放,请升级
			    	</video>
			    	<div v-if="!playFlag" @click = "playFlag = true" onclick="document.getElementById('video').play()" class="video-cover bg-cover absolute left top right bottom" :style="{'background-image':'url('+mainData.background+')'}"></div>
		    </div>
			<div class="video-info public-padding-v">
				<p class="name font-16 font-white font-bold">{{mainData.title}}</p>
				<p class="desc font-12 font-white-40">{{mainData.desc}}</p>
				<div class="display-flex-between flex-align-center font-12">
					<p class="font-white-40">发布于 {{mainData.time}} / 时长 {{mainData.time}}</p>
					<p v-if="mainData.tag" class="tag font-white">#{{mainData.tag}}</p>
				</div>
			</div>
			<span class="line-normal"></span>
			<div v-if="!fromProductFlag && mainData.products.length">
				<div class="title-h2-wrap">
					<span class="h2 font-20 font-white-60 font-bold">相关产品</span>
				</div>
				<ul class="closeProduct-list public-padding-v relative">
					<router-link class="display-flex-between relative" v-for = "(item,index) in mainData.products" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}" @click = "umeng('动态点击进入商品详情', '点击', item.productName)">
						<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.productImage+')'}"></span>
						<div class="content display-flex-between flex-column">
							<div>
								<p class="name font-white-60 font-bold line-ellipsis">{{item.productName}}</p>
								<div class="star-wrap">
									<div class="star-list vertical-middle font-12 font-lightGray">
										<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
						                    <span v-if="item.appraiseScore >= starItem" class="star"></span>
						                    <span v-else-if="item.appraiseScore < starItem && (item.appraiseScore*1+1) > starItem" class="star" :style = "{'width':item.appraiseScore%1*100+'%'}"></span>
						                </div>
						                <span class="vertical-middle">{{item.appraiseScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraiseCount}}</span>
									</div>
								</div>
							</div>
							<div class="public-price-wrap">
								<span class="vertical-bottom font-white font-12 font-bold">￥</span><span class="price vertical-bottom font-white font-16 font-bold">{{item.rent | formatInt}}</span><span class="vertical-bottom font-white font-10">{{item.rent | formatDecimal}}</span>
								<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
							</div>
						</div>
					</router-link>
				</ul>
			</div>
			<div v-if="fromProductFlag && mainData.moreVideos.length">
				<div class="title-h2-wrap">
					<span class="h2 font-20 font-white-60 font-bold">更多视频</span>
				</div>
				<ul class="video-hot-list public-padding-v">
					<router-link v-for = "(item,index) in mainData.moreVideos" :key = "index" class="display-flex-between" tag="li" :to = "{path:'/videoDetails',query:{videoId:item.videoId}}">
						<div class="image bg-cover bg-buffer relative" :style="{'background-image':'url('+item.background+')'}">
							<span class="time-tag absolute font-white font-12 font-bold">{{item.time}}</span>
						</div>
						<div class="content display-flex-between flex-column">
							<p class="name font-white-60 font-bold line-clamp-2">{{item.title}}</p>
							<div class="font-white-40 font-12">
								{{item.author}} / #{{item.videoType}}
							</div>
						</div>
					</router-link>
				</ul>
			</div>
			<span class="line-normal"></span>
			<div class="title-h2-wrap">
				<span class="h2 font-20 font-white-60 font-bold">评论</span>
			</div>
			<div v-if="mainData.commentList && mainData.commentList.length" class="comments-list font-12 public-padding-v">
				<div class="item line-ellipsis font-white" v-for = "(item,index) in mainData.commentList" @click="reply(index)">
					<span>{{item.nickname}}</span>
					<span v-if="item.type == 1">回复 {{item.replyNickname}}</span>
					<span>：</span>
					<span class="font-white-60">{{item.commentContent || item.replyContent}}</span>
				</div>
			</div>
			<!--
			<div v-else-if="mainData.comments && mainData.comments.length" class="comments-list font-12 public-padding-v">
				<div v-for = "(item,index) in mainData.comments">
					<div class="item line-ellipsis font-white"  @click="reply(index)">
						<span>{{item.nickname}}</span>
						<span>：</span>
						<span class="font-white-60">{{item.content}}</span>
					</div>
					<div  v-for = "(cItem,cIndex) in item.replys" class="item line-ellipsis font-white" >
						<span>{{cItem.nickname}}</span>
						<span>回复 {{cItem.replyNickname}}</span>
						<span>：</span>
						<span class="font-white-60">{{cItem.content}}</span>
					</div>
				</div>
			</div>
			-->
			<p v-else class="comments-none text-center font-BBB">趁没人，快抢个沙发吧～</p>
			<router-link tag = 'div' v-if="mainData.commentsCount > 5" class="comments-more font-green font-12 font-bold text-center" :to = "{path:'/comment',query:{videoId:askData.videoId}}">
				<span class="public-arrow-right">查看全部{{mainData.commentsCount}}条评论</span>
			</router-link>
		</div>
		<div class="public-comment-footer border-box fixed left bottom right font-12 font-white iphoneX-footer fixd-center">
			<div class="display-flex-between">
				<input @keypress="keypressSubmit(comment,$event)" @focus="commentBtnFlag = true" @blur="commentBtnFlag = false" class="comment-input font-12 font-white" v-model="comment" type="text" maxlength="100" :placeholder="replyItem?'回复：'+replyItem.nickname:'有什么想说的？直接评论吧'"/>
				<div v-if = "!commentBtnFlag && !comment.length" class="comment-count-wrap text-center font-lightGray text-center" @click="praise">
					<span class="icon icon-like bg-contain inline-block" :class="{active:mainData.isPraise == 'Y'}"></span>
					<p class="font-10">{{mainData.praiseCount}}</p>
				</div>
				<router-link v-if = "!commentBtnFlag && !comment.length" class="comment-count-wrap text-center font-lightGray text-center" :to = "{path:'/comment',query:{videoId:askData.videoId}}">
					<img class="icon" src="~@assets/img/comment-darkGrey.svg"/>
					<p class="font-10">{{mainData.commentsCount}}</p>
				</router-link>
				<div v-else class="comment-btn absolute font-BBB font-16" :class="{'font-green':comment && comment.length}" @click="submit(comment)">发送</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
export default {
	data () {
  		return {
			askData:{},
			mainData:{
				moreVideos:[],
				products:[],
				comments:[]
			},
			playFlag:false,
			comment:'',
			replyItem:null,
			fromProductFlag:false,
			commentBtnFlag:false
  		}
  	},
  	mounted(){
		var that = this;
		that.pageInit();
	},
	methods:{
		pageInit(){
			var that = this;
			that.askData.videoId = that.$route.query.videoId;
			that.fromProductFlag = that.$route.query.fromProductFlag?true:false;
			window.scrollTo(0,0);
			that.initData();
		},
		initData(){
			var that = this;
			network(CONFIG.videoDetails,that.askData).then((res) => {
				that.mainData = res.details;
				that.umeng('视频详情','访问',that.mainData.title)
			});
		},
		praise(){
			var that = this;
			if(that.switchShow) {
				return false;
			};
			that.switchShow = true;
			network(CONFIG.videoPraise,{
				praiseStatus:that.mainData.isPraise == 'N',
				videoId:that.askData.videoId
			}).then((res) => {
				that.mainData.isPraise = that.mainData.isPraise == 'N'?'Y':'N';
				that.mainData.praiseCount = that.mainData.isPraise == 'Y'?that.mainData.praiseCount+1:that.mainData.praiseCount-1;
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
            		network(CONFIG.videoCommentRelease,{
				 	videoId:that.askData.videoId,
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
        		that.replyItem = that.mainData.comments[index];
        }
	},
	watch:{
   		'$route':'pageInit'
   	}
}
</script>

<style>
.videoDetails-page .bg-page{
	filter:blur(2rem);
	-webkit-filter:blur(2rem);
	background-attachment: fixed;
}
.videoDetails-page .bg-page2{
	background: rgba(0,0,0,0.6);
}
.videoDetails-page .video-wrap,
.videoDetails-page .video-cover{
	height: 10.54rem;
}
.videoDetails-page .video-cover:before{
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
.videoDetails-page .video-info{
	padding-bottom: 0.7rem;
}
.videoDetails-page .video-info .name{
	padding-top: 0.8rem;
	padding-bottom: 0.3rem;
	line-height: 1.375;
}
.videoDetails-page .video-info .desc{
	margin-bottom: 0.9rem;
}
.videoDetails-page .video-info .tag{
	padding: 0.3rem 0.4rem;
	border-radius: 0.1rem;
	background: rgba(255,255,255,0.2);
}
.videoDetails-page .comments-list{
	margin-bottom: 1rem;
}
.videoDetails-page .comments-list .item{
	margin-bottom: 0.4rem;
}
.videoDetails-page .comments-more{
	margin-bottom: 2.1rem;
}
.videoDetails-page .line-normal{
	background: rgba(255,255,255,0.04);
}
.videoDetails-page .closeProduct-list{
	margin-bottom: 0.9rem;
	margin-top: 0.6rem;
}
.videoDetails-page .closeProduct-list li{
	padding-right: 1.1rem;
}
.videoDetails-page .closeProduct-list li .content{
	width: 9.7rem;
}
.videoDetails-page .closeProduct-list:before{
	content: "";
	position: absolute;
	background: rgba(255,255,255,0.04);
	left: 1.8rem;
	top: -0.6rem;
	bottom: 1rem;
	right: 0.9rem;
	border-radius: 0.2rem;
}
.videoDetails-page .public-comment-footer{
	line-height: 1.1;
	box-shadow: 0 0 0 0.05rem rgba(255,255,255,0.04);
}
.videoDetails-page .public-comment-footer .comment-input{
	background: rgba(255,255,255,0.1);
	width: 12.4rem;
	margin-right: 0.3rem;
}
.videoDetails-page .public-comment-footer .icon{
	width: 0.8rem;
	height: 0.8rem;
}
.videoDetails-page .public-comment-footer .comment-btn {
	right: 1.5rem;
}
.videoDetails-page .public-comment-footer .icon-like{
	background-image: url(~@assets/img/like-darkGrey.svg);
}
.videoDetails-page .public-comment-footer .icon-like.active{
	background-image: url(~@assets/img/like-comment-green.png);
}
.videoDetails-page .comments-none{
	padding-top: 1.3rem;
	padding-bottom: 2.3rem;
}
.videoDetails-page .videoDetails-content{
	bottom: 2.2rem;
	overflow-y: auto;
}
.videoDetails-page .video-hot-list li{
	padding-bottom: 0.7rem;
}
.videoDetails-page .video-hot-list li:last-child{
	padding-bottom: 0.9rem;
}
.videoDetails-page .video-hot-list li .image{
	height: 4.5rem;
	width: 8rem;
	border-radius: 0.2rem;
}
.videoDetails-page .video-hot-list li .content{
	width: 8rem;
}
.videoDetails-page .time-tag{
	line-height: 0.8rem;
	padding: 0.1rem 0.15rem;
	background: rgba(0,0,0,0.4);
	right: 0.4rem;
	bottom: 0.4rem;
	border-radius: 0.1rem;
}
</style>
