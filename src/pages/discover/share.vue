<template>
	<div class="share-page bg-white has-footer has-footer-iphoneX relative">
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
		<div v-if="listData.length" class="share-list public-padding-v">
			<share v-for="(item,index) in listData" :key="item.share_id" :item="item" :index="index" :listData="listData" @report="report" @confirmShow="confirmShow"></share>
		</div>
		<div v-else class="share-list public-padding-v">
			<div class="share-item relative" v-for="(item,index) in 3">
				<span class="avatar bg-cover bg-buffer"></span>
				<div class="display-flex-between flex-align-center" style="padding-top: 0.4rem;padding-bottom: 1.3rem;">
					<div class="bg-buffer buffer1" style="width: 4.7rem;"></div>
					<div class="bg-buffer buffer1" style="width: 2.3rem;"></div>
				</div>
				<ul class="image-list">
					<li class="bg-cover vertical-top bg-buffer" v-for="(cItem,cIndex) in 3"></li>
				</ul>
				<div class="bg-buffer buffer1" style="margin-top: 0.2rem;"></div>
				<div style="margin-top: 1.3rem;">
					<div class="vertical-middle bg-buffer buffer1" style="width: 1.8rem;margin-right: 0.4rem;"></div>
					<div class="vertical-middle bg-buffer buffer1" style="width: 1.8rem;"></div>
				</div>
			</div>
		</div>
		<mt-spinner v-if="listData.length && more == 1" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<img :class="{'active':addFlag && listData.length}" class="share-add-btn fixed" src="~@assets/img/share-add-green.svg" @click="shareAdd" />
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
	import { Swipe, SwipeItem } from 'vue-swipe';
	import { setBodyColor } from '@assets/js/mUtils';
	import share from '@components/shareItem';
	import { Spinner } from 'mint-ui';
	Vue.component(Spinner.name, Spinner);
	let t1 = 0;
	let t2 = 0;
	let timer = null;
	export default {
		data() {
			return {
				askData: {
					pageSize: 20,
					pageNum: 1,
					clientType: 'web:h5'
				},
				switchShow: false,
				more: 1,
				listData: [],
				banners: [],
				followFlag: false,
				confirmFlag: false,
				descriptionShow: false,
				descriptionFlag: false,
				image_src_list: [],
				previewDetail: {},
				comment: '',
				addFlag:true,
			}
		},
		mounted() {
			var that = this;
			setBodyColor(true);
			that.getData();
			window.addEventListener('scroll', that.scrollBottom);
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
				if(that.more == 0 || that.switchShow) {
					return false;
				};
				that.switchShow = true;
				network(CONFIG.shares, that.askData).then((res) => {
					var details = res.details;
					details.forEach(function(item, index) {
						item.image_src_list = item.image_src_list.length ? item.image_src_list.split(",") : [];
					});
					that.listData = that.listData.concat(details);
					that.askData.start = res.result.start;
					that.more = res.result.more;
					that.switchShow = false;
					if(!that.banners.length && res.result.bannerList && res.result.bannerList.length) {
						that.banners = res.result.bannerList;
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
				t1 = scrollTop;
				clearTimeout(timer);
				timer = setTimeout(that.isScrollEnd, 1000);
				that.addFlag = false;
			},
			isScrollEnd() {
				var that = this;
				t2 = document.documentElement.scrollTop || document.body.scrollTop;
				if(t2 == t1) {
					that.addFlag = true;
				}
			},
			shareAdd() {
				var that = this;
				if(!that.goLogin()) {
					return false;
				}
				that.$router.push({
					path: '/shareAdd'
				});
			},
			confirmShow(index) {
				var that = this;
				that.followFlag = true;
				that.followIndex = index;
			},
			//取关
			disFollow() {
				var that = this;
				that.followFlag = false;
				network(CONFIG.userFollow, {
					uuid: that.listData[that.followIndex].uuid,
					follow: 'N'
				}).then((res) => {
					Vue.toast('已取消关注', {
						duration: 1500
					});
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
					that.uuid = localStorage.getItem("twUser") ? JSON.parse(localStorage.getItem("twUser")).uuid : "";
					that.confirmFlag = true;
				}
			},
			// 点赞
			praise() {
				var that = this
				network(CONFIG.sharePraise, {
					share_id: that.previewDetail.share_id,
					praise: that.previewDetail.is_praise == "Y" ? "N" : "Y",
					be_uuid: that.previewDetail.uuid
				}).then((res) => {
					that.previewDetail.is_praise = (res.details.flag == "1") ? "Y" : "N";
					that.previewDetail.count_praise = res.details.count_praise;
				})
			}
		},
		components: {
			'swipe': Swipe,
			'swipe-item': SwipeItem,
			share
		}
	}
</script>

<style>
	@import '~vue-swipe/dist/vue-swipe.css';
	.share-page{
		padding-bottom: 1rem;
	}
	.share-page .banner-wrap {
		padding-top: 0.7rem;
		padding-bottom: 2rem;
	}
	.share-page .mint-swipe,
	.share-page .mint-swipe-items-wrap{
		overflow:visible;
	}
	
	.share-page .swipe {
		height: 7.5rem;
	}
	
	.share-page .swipe .image{
		margin: 0 0.9rem;
		height: 7.5rem;
		border-radius: 0.1rem;
		box-shadow: 0 0.5rem 1rem 0 rgb(0, 0, 0, 0.08);
	}
	
	.share-page .share-add-btn {
		opacity: 0;
		width: 2.8rem;
		height: 2.8rem;
		right: 0.9rem;
		bottom: 3.2rem;
	}
	.share-page .share-add-btn.active{
		opacity: 1;
		transition: opacity 0.3s;
		-webkit-transition: opacity 0.3s;
	}
	.share-page .buffer1 {
		height: 1rem;
	}
	/*
	.share-page .mint-swipe-item {
		width: auto;
		padding-left: 0.9rem;
		padding-right: 0.9rem;
		border-radius: 0.1rem;
		overflow: hidden;
	}
	*/
</style>