<template>
	<div class="shareByTag-page has-footer">
		<div class="big-image bg-darkGray bg-cover relative" :style="{'background-image':'url('+image+')'}">
			<div v-if="askData.tag" class="content absolute font-white">
				<p>热门话题</p>
				<p class="font-bold tag">#{{askData.tag}}</p>
			</div>
		</div>
		<p class="public-padding-v desc">
			{{desc}}
		</p>
		<span class="line-normal"></span>
		<div class="share-list public-padding-v">
			<share v-for="(item,index) in listData" :key="item.share_id" :item="item" :index="index" :listData="listData" @report="report" @confirmShow="confirmShow"></share>
		</div>
		<mt-spinner v-if="listData.length && more == 'Y'" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<div class="btn fixed left bottom right text-center bg-blue font-white font-bold font-16" @click="shareAdd">发动态参与话题</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="followFlag">
				<div class="public-popup-shadow" @click="followFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-grey relative">
						确认不再关注此探友
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="font-16 text-center public-lineheight" @click="disFollow">确定</div>
					<div class="picker-btn font-16 text-center public-lineheight" @click="followFlag = false">取消</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="confirmFlag">
				<div class="public-popup-shadow" @click="confirmFlag = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-grey relative" :class="{'font-red':listData[reportIndex].uuid != uuid}">
						{{listData[reportIndex].uuid == uuid?'确定删除此条动态？':'确定举报此条动态？'}}
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="font-16 text-center public-lineheight" @click="report">确定</div>
					<div class="picker-btn font-16 text-center public-lineheight" @click="confirmFlag = false">取消</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import share from '@components/shareItem';
	import { setBodyColor } from '@assets/js/mUtils';
	import { Spinner } from 'mint-ui';
	Vue.component(Spinner.name, Spinner);
	export default {
		data() {
			return {
				askData: {
					pageSize: 20,
					pageNum: 0,
					clientType: 'web:h5'
				},
				switchShow: false,
				more: 'Y',
				listData: [],
				image: "",
				desc: "",
				followFlag: false,
				confirmFlag: false,
			}
		},
		mounted() {
			var that = this;
			that.askData.tag = that.$route.query.tag;
			that.getData();
			setBodyColor(true);
			window.addEventListener('scroll', that.scrollBottom)
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
		methods: {
			getData() {
				var that = this;
				if(that.more == 'N' || that.switchShow) {
					return false;
				};
				that.switchShow = true;
				network(CONFIG.sharesByTag, that.askData).then((res) => {
					var details = res.details;
					details.shares.forEach(function(item, index) {
						item.image_src_list = item.image_src_list.length ? item.image_src_list.split(",") : [];
						item.tagFlag = true;
						item.isFollow = item.isFollow == 'Y'?'true':'false';
					});
					that.listData = that.listData.concat(details.shares);
					if(details.tag) {
						that.image = details.image;
						that.desc = details.desc;
					}
					that.askData.pageNum = res.result.pageNum;
					that.more = res.result.more;
					that.switchShow = false;
					setTimeout(function() {
						that.listData.forEach(function(item, index) {
							if(that.$refs['details' + item.share_id] && that.$refs['details' + item.share_id].length) {
								let height = that.$refs['details' + item.share_id][0].offsetHeight;
								if(height > 57) {
									Vue.set(that.listData[index], 'detailsFlag', true)
								}
							}
						});
					}, 10)
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
			shareAdd() {
				var that = this;
				if(!that.goLogin()){
					return false;
				}
				that.$router.push({
					path: '/shareAdd',
					query: {
						tag: that.askData.tag
					}
				});
			},
			confirmShow(index) {
				var that = this;
				that.followFlag = true;
				that.followIndex = index;
			},
			disFollow() {
				var that = this;
				network(CONFIG.userFollow, {
					uuid: that.listData[that.followIndex].uuid,
					follow: 'N'
				}).then((res) => {
					Vue.toast('已取消关注', {
						duration: 1500
					});
					that.followFlag = false;
					that.listData[that.followIndex].isFollow = 'false';
				});
			},
			//举报或者删除
			report(index) {
				var that = this;
				if(that.confirmFlag) {
					that.confirmFlag = false;
					if(that.uuid == that.listData[that.reportIndex].uuid) {
						network(CONFIG.shareDelete, {
							share_id: that.listData[that.reportIndex].share_id
						}).then((res) => {
							Vue.toast('删除成功', {
								duration: 1500
							});
							that.listData.splice(index, 1);
						});
					} else {
						network(CONFIG.reportShare, {
							share_id: that.listData[that.reportIndex].share_id
						}).then((res) => {
							Vue.toast('举报成功', {
								duration: 1500
							});
						});
					}

				} else {
					that.reportIndex = index;
					that.uuid = JSON.parse(localStorage.getItem("twUser")) ? JSON.parse(localStorage.getItem("twUser")).uuid : "";
					that.confirmFlag = true;
				}

			}
		},
		components: {
			share
		}
	}
</script>

<style>
	@import '~vue-swipe/dist/vue-swipe.css';
	.shareByTag-page {
		padding-bottom: 3rem;
	}
	.shareByTag-page .big-image {
		height: 9.1rem;
	}
	
	.shareByTag-page .big-image .content {
		left: 0.9rem;
		bottom: 1.2rem;
	}
	
	.shareByTag-page .big-image .tag {
		font-size: 1.3rem;
		margin-top: 0.1rem;
	}
	
	.shareByTag-page .desc {
		padding-top: 0.8rem;
		padding-bottom: 1.3rem;
		line-height: 1.5;
	}
	
	.shareByTag-page .share-list {
		padding-top: 1.5rem;
	}
	
	.shareByTag-page .btn {
		line-height: 2.4rem;
	}
</style>