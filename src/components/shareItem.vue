<template>
	<div class="share-item relative">
		<router-link :to="{path: '/self/selfEdit', query:{uuid: item.uuid}}" class="avatar bg-buffer bg-cover" :style="{'background-image':'url('+item.head_thumb+')'}"></router-link>
		<p class="name font-darkGray font-bold line-ellipsis">
			<router-link :to="{path: '/self/selfEdit', query:{uuid: item.uuid}}" class="vertical-middle" tag = "span">{{item.nick_name}}</router-link>
		</p>
		<p class="time font-lightGray font-12">{{item.datetime | formatTime11}}</p>
		<span v-if="!item.hideFollow && uuid != item.uuid" class="follow-btn font-green absolute right font-12" :class="{'active':item.isFollow == 'true'}" @click="follow">{{item.isFollow == 'true'?'已关注':'+ 关注'}}</span>
		<div v-if="item.image_src_list && item.image_src_list.length == 1" class="image-count-1 bg-cover bg-buffer" :style="{'background-image':'url('+item.image_src_list[0]+')'}" @click="pictureShow(0)"></div>
		<ul v-else-if="item.image_src_list.length" class="image-list">
			<li class="bg-cover vertical-top bg-buffer" v-for="(cItem,cIndex) in item.image_src_list" :key="item.share_id + cIndex" :style="{'background-image':'url('+cItem+')'}" @click="pictureShow(cIndex)"></li>
		</ul>
		<div class="font-grey relative">
			<div class="details" :class="{'active':item.detailsFlag && !item.detailsShow}" :ref="'details'+item.share_id">
				<router-link v-if="item.tag && !item.tagFlag" class="tag font-green font-bold" :to="{path:'/shareByTag',query:{tag:item.tag}}">#{{item.tag}}</router-link>
				<span v-else-if = "item.tag" class="tag">#{{item.tag}}</span>
				{{item.detail}}
			</div>
			<span v-if="item.detailsFlag" class="details-btn text-center absolute left bottom right" :class="{'active':item.detailsShow}" @click="detailsShow">
				<img class="icon absolute bottom" src="~@assets/img/arrow-down-gray.png"/>
			</span>
		</div>
		<div class="foot font-12 font-grey clearfix">
			<div class="vertical-middle" @click="praise">
				<span class="icon praise vertical-middle bg-contain" :class="{'active':item.is_praise == 'Y'}"></span>
				<span class="vertical-middle">{{item.count_praise}}</span>
			</div>
			<router-link class="vertical-middle" :to="{path:'/comment',query:{shareId:item.share_id}}">
				<span class="icon comment vertical-middle bg-contain"></span>
				<span class="vertical-middle">{{item.comment_count}}</span>
			</router-link>
			<span class="more-btn float-right" @click="report"></span>
		</div>
		<transition name="anim-up">
			<div class="preview" v-if="previewFlag">
				<div class="public-popup fixed top right bottom left">
					<div class="public-popup-shadow black"></div>
					<div class="absolute width-full center">
						<swipe class="packList-swipe relative" :auto='0' :showIndicators="false" :defaultIndex="defaultIndex" @change="packSwipe">
							<swipe-item v-for="item in image_src_list">
								<div class="swipe-item text-center">
									<div class="image bg-contain" :style="{'background-image':'url('+item+')'}"></div>
								</div>
							</swipe-item>
						</swipe>
						<div class="font-white public-padding-v font-12 description-detail" :class="{'line-clamp-2': descriptionFlag && !descriptionShow}">
							<div :class="{'description': !descriptionShow}" ref="description">
								<div :class="{'public-popup-shadow': descriptionShow}" @click="descriptionShow = false">
									<div :class="{'description-footer': descriptionShow}">
										<span v-if="previewDetail.tag" class="tag font-green">#{{previewDetail.tag}} </span> <span style="text-shadow: 3px 2px 6px #000;">{{previewDetail.detail}}</span>
										<span v-if="descriptionFlag && !descriptionShow" class="btn tag font-green" @click.stop="descriptionShow = !descriptionShow"> <span class="font-white"> ...</span> 查看更多</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="packList-swipe-header fixed left top right text-center font-white font-bold font-16">
						<span class="close-btn absolute" @click="previewFlag = false;descriptionShow = false"></span> {{packIndex}} / {{image_src_list.length}}
					</div>
				</div>
				<div class="public-comment-footer border-box fixed left bottom right font-12 display-flex-between font-darkGray">
					<input class="comment-input font-12" @keypress="keypressSubmit(comment,$event)" @focus="commentBtnFlag = true" @blur="commentBtnFlag = false" v-model="comment" type="text" maxlength="100" placeholder="有什么想说的？直接评论吧" />
					<div class="foot font-12 font-grey clearfix">
						<div v-if = "!commentBtnFlag && !comment.length" class="vertical-middle" @click="praise">
							<span class="icon praise vertical-middle bg-contain" :class="{'active':previewDetail.is_praise == 'Y'}"></span>
							<span class="vertical-middle">{{previewDetail.count_praise}}</span>
						</div>
						<router-link v-if = "!commentBtnFlag && !comment.length" class="vertical-middle" :to="{path:'/comment',query:{shareId:previewDetail.share_id}}">
							<span class="icon comment vertical-middle bg-contain"></span>
							<span class="vertical-middle">{{previewDetail.comment_count}}</span>
						</router-link>
						<div v-else class="comment-btn absolute font-BBB font-16" :class="{'font-green':comment && comment.length}" @click="submit(comment)">发送</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { Swipe, SwipeItem } from 'vue-swipe';

	export default {
		data() {
			return {
				uuid: JSON.parse(localStorage.getItem("twUser")) ? JSON.parse(localStorage.getItem("twUser")).uuid : "",
				previewFlag: false, // 图片预览
				defaultIndex: 0,
				packIndex: 0,
				descriptionFlag: false,
				descriptionShow: false,
				comment: '',
				commentBtnFlag:false
			}
		},
		props: ['item', 'index', 'listData'],
		mounted() {
			var that = this;
			var item = that.item;
			setTimeout(function() {
				if(that.$refs['details' + item.share_id]) {
					let height = that.$refs['details' + item.share_id].offsetHeight;
					if(height > 57) {
						Vue.set(item, 'detailsFlag', true)
					}
				}
			}, 10);
		},
		methods: {
			praise() {
				var that = this;
				var item = that.item;
				network(CONFIG.sharePraise, {
					share_id: item.share_id,
					praise: item.is_praise == "Y" ? "N" : "Y",
					be_uuid: item.uuid
				}).then((res) => {
					item.is_praise = (res.details.flag == "1") ? "Y" : "N";
					item.count_praise = res.details.count_praise;
				});
			},
			follow(item) {
				var that = this;
				if(!that.goLogin()){
					return false;
				}
				var item = that.item;
				if(item.isFollow == 'true') {
					that.$emit("confirmShow", that.index);
				} else {
					network(CONFIG.userFollow, {
						uuid: item.uuid,
						follow: item.isFollow == 'true' ? 'N' : 'Y'
					}).then((res) => {
						if(res.result.flag == 1) {
							Vue.toast('关注成功', {
								duration: 1500
							});
							item.isFollow = 'true';
						} else {
							Vue.toast('已取消关注', {
								duration: 1500
							});
							item.isFollow = 'false';
						}
					});
				}
			},
			report() {
				var that = this;
				if(!that.goLogin()){
					return false;
				}
				that.$emit("report", that.index);
			},
			detailsShow() {
				var that = this;
				var item = that.item;
				Vue.set(item, 'detailsShow', !item.detailsShow)
			},
			pictureShow(index) {
				var that = this
				that.previewFlag = true;
				that.image_src_list = that.listData[that.index].image_src_list
				that.previewDetail = that.listData[that.index]
				that.packIndex = index + 1
				that.defaultIndex = index;
				setTimeout(() => {
					let descriptionHeight = that.$refs.description.offsetHeight;
					if(descriptionHeight > 40) {
						that.descriptionFlag = true
					}
				}, 10)
			},
			packSwipe(index) {
				var that = this;
				that.packIndex = index + 1;
			},
			keypressSubmit(value, e){
				var that = this;
				if(e && e.keyCode == 13 && value) {
					that.submit(value)
				}
			},
			submit(value) {
				var that = this
				if( value) {
					var askData = {
						replyCommentId: 0,
						content: value,
						shareId: that.previewDetail.share_id
					}
					network(CONFIG.shareComment, askData).then((res) => {
						Vue.toast('评论成功', {
							duration: 1500
						});
						that.comment = "";
						that.previewDetail.comment_count = parseInt(that.previewDetail.comment_count) + 1
					});
				}
			},

		},
		components: {
			'swipe': Swipe,
			'swipe-item': SwipeItem,
		}
	}
</script>

<style>

</style>