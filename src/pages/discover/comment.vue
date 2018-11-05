<template>
	<div class="shareComment-page bg-white has-footer has-footer-iphoneX">
		<ul class="shareComment-list public-padding-v">
			<li class="public-appraise-item relative" v-for="(item,index) in listData">
				<router-link :to="{path: '/self/selfEdit', query:{uuid: item.userUid}}" class="avatar bg-buffer bg-cover" :style="{'background-image':'url('+item.headThumb+')'}"></router-link>
				<p class="name font-darkGray font-bold line-ellipsis">
					<span class="vertical-middle" @click="reply(index)">{{item.type == 0?item.nickname:item.replyNickname}}</span>
				</p>
				<p class="time font-lightGray font-12">{{item.timestamp | formatTime5}}</p>
				<span class="public-comment-like absolute top right font-lightGray" :class="{'active':item.praise}" @click="praise(index)">{{item.praiseCount > 0 ? item.praiseCount : ''}}</span>
				<p v-if="item.type == 1" class="reply font-lightGray line-ellipsis relative">{{item.nickname}} : {{item.commentContent}}</p>
				<div class="font-darkGray" @click="reply(index)">
					{{item.type == 0?item.commentContent:item.replyContent}}
				</div>
			</li>
		</ul>
		<p v-if="!more && listData.length" class="tip-end text-center font-BBB font-10">—— END ——</p>
		<div class="public-comment-footer border-box fixed left bottom right bg-white font-12 display-flex-between font-darkGray iphoneX-footer">
			<input v-if="replyItem && replyItem.type == 1" @keypress="keypressSubmit(comment,$event)" class="comment-input font-12" v-model="comment" type="text" maxlength="100" :placeholder="replyItem?'回复：'+replyItem.replyNickname:'有什么想说的？直接评论吧'" />
			<input v-else @keypress="keypressSubmit(comment,$event)" class="comment-input font-12" v-model="comment" type="text" maxlength="100" :placeholder="replyItem?'回复：'+replyItem.nickname:'有什么想说的？直接评论吧'" />
			<span class="comment-btn absolute font-BBB font-16" :class="{'font-green':comment && comment.length}" @click="submit(comment)">发送</span>
		</div>
		<div v-if="noDataFlag && !listData.length" class="noData-wrap center fixed text-center width-full">
			<img class="noData-image" src="~@assets/img/message-null.png" />
			<p class="font-lightGray">暂无评论</p>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { setBodyColor } from '@assets/js/mUtils';

	export default {
		data() {
			return {
				askData: {
					pageSize: 10,
					pageNum: 1
				},
				switchShow: false,
				noDataFlag: false,
				more: true,
				listData: [],
				comment: '',
				replyItem: null,
			}
		},
		mounted() {
			var that = this;
			setBodyColor(true);
			var query = that.$route.query;
			if(query.shareId) {
				that.askData.shareId = query.shareId;
				that.listAPI = CONFIG.shareComments;
				that.praiseAPI = CONFIG.shareCommentPraise;
				that.commentAPI = CONFIG.shareComment;
			} else if(query.videoId) {
				that.askData.videoId = query.videoId;
				that.listAPI = CONFIG.videoComment;
				that.praiseAPI = CONFIG.videoCommentPraise;
				that.commentAPI = CONFIG.videoCommentRelease;
			} else if(query.themeId) {
				that.askData.themeId = query.themeId;
				that.listAPI = CONFIG.themesComment;
				that.praiseAPI = CONFIG.themeCommentPraise;
				that.commentAPI = CONFIG.themeCommentRelease;
			}
			that.getData();
			window.addEventListener('scroll', that.scrollBottom)
		},
		methods: {
			initData() {
				var that = this;
				that.more = true;
				that.listData = [];
				that.askData.pageNum = 1;
				that.noDataFlag = false;
				that.getData();
			},
			getData() {
				var that = this;
				if(!that.more || that.switchShow) {
					return false;
				};
				that.switchShow = true;
				network(that.listAPI, that.askData, {
					method: 'GET'
				}).then((res) => {
					that.listData = that.listData.concat(res.data);
					that.askData.pageNum++;
					that.more = that.askData.pageNum <= res.page.pages;
					that.switchShow = false;
					if(!that.listData.length) {
						that.noDataFlag = true
					}
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
			praise(index) {
				var that = this;
				if(!that.goLogin()){
					return false;
				}
				var item = that.listData[index];
				network(that.praiseAPI, {
					commentId: item.commentId,
					praiseStatus: !item.praise,
					flag: item.praise ? 'N' : 'Y'
				}).then((res) => {
					item.praise = !item.praise;
					item.praiseCount = item.praise ? item.praiseCount + 1 : item.praiseCount - 1;
				});
			},
			keypressSubmit(value, e){
				var that = this;
				if(e && e.keyCode == 13 && value) {
					that.submit(value)
				}
			},
			submit(value) {
				var that = this;
				if(value){
					var askData = {
						replyCommentId: that.replyItem ? that.replyItem.commentId : 0,
						content: value
					};
					if(that.askData.shareId) {
						askData.shareId = that.askData.shareId;
					} else if(that.askData.videoId) {
						askData.videoId = that.askData.videoId;
					} else if(that.askData.themeId) {
						askData.themeId = that.askData.themeId;
					}
					network(that.commentAPI, askData).then((res) => {
						Vue.toast('评论成功', {
							duration: 1500
						});
						that.comment = "";
						that.replyItem = null;
						that.initData();
					});
				}
			},
			reply(index) {
				var that = this;
				that.replyItem = that.listData[index];
			}
		},
		activated() {
			var that = this;
			window.addEventListener('scroll', that.scrollBottom)
		},
		deactivated() {
			var that = this;
			window.removeEventListener('scroll', that.scrollBottom)
		},
		destroyed() {
			var that = this;
			setBodyColor();
			window.removeEventListener('scroll', that.scrollBottom)
		},
	}
</script>

<style>
	.shareComment-page .shareComment-list {
		padding-top: 0.7rem;
	}
	
	.shareComment-page .public-appraise-item {
		padding-bottom: 1.3rem;
	}
	
	.shareComment-page .public-appraise-item .reply {
		margin-bottom: 0.2rem;
		padding-left: 0.4rem;
		line-height: 1rem;
		height: 1rem;
	}
	
	.shareComment-page .public-appraise-item .reply:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0.25rem;
		height: 0.5rem;
		width: 0.1rem;
		background: #3ED8C4;
	}
	
	.shareComment-page .public-comment-footer{
		padding-right: 3.1rem;
	}
	
	.shareComment-page .comment-input {
		width: 100%;
	}
	.shareComment-page .tip-end {
		padding-top: 0.2rem;
		padding-bottom: 1.7rem;
	}
</style>