<template>
	<div class="self-edit">
		<div class="self-info font-white">
			<div class="self-item">
				<div>
					<p class="font-20 font-bold">{{ minData.nick_name }}</p>
					<p class="font-12">{{ minData.area }}</p>
				</div>
				<p class="portrait bg-cover" :style="{'background-image':'url('+ minData.head_thumb +')'}"></p>
			</div>
			<p class="font-12 intro">{{ minData.intro }}</p>
			<div class="attention-fans">
				<div class="attention-fans-info">
					<router-link :to="{path: '/follower', query:{uuid:minData.uuid}}" class="attention block">
						<p class="font-12">关注</p>
						<p class="font-16">{{ minData.follow_count }}</p>
					</router-link>
					<router-link :to="{path: '/follower', query:{uuid:minData.uuid,type: 1}}" class="fans block">
						<p class="font-12">粉丝</p>
						<p class="font-16">{{ minData.follower_count }}</p>
					</router-link>
				</div>
				<router-link class="edit-info" to="/self/personalInfo" v-if="selfFalg">编辑个人资料</router-link>
				<p v-else class="self-attention text-center font-12 font-white" :class="{'active':minData.is_follow == 'Y'}" @click="follow"> <span> {{ minData.is_follow == 'Y'? '已关注':'+&nbsp;关注'}}</span> </p>
			</div>
		</div>
		<div class="message-null" v-if="listData.length == 0 && noDataFlag">
			<img src="~@assets/img/message-null.png" />
			<p class="font-14 font-lightGray">快发布一条动态吧</p>
		</div>
		<div style="height: 1.5rem;"></div>
		<div>
			<div v-if="changeType == 0">
				<div class="share-list public-padding-v">
					<share v-for="(item,index) in listData" :key="item.share_id" :item="item" :index="index" :listData="listData" @report="report" @confirmShow="confirmShow"></share>
				</div>
			</div>
			<div v-else>
				体验详情
			</div>
		</div>
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
					<p class="public-popup-bottom-title text-center font-16 font-red relative">
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
	import { setBodyColor } from '@assets/js/mUtils';
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import share from '@components/shareItem';

	export default {
		data() {
			return {
				changeType: 0,
				askData: {
					pageSize: 20,
					pageNum: 0
				},
				minData: {},
				listData: [],
				more: 1,
				switchShow: false,
				noDataFlag: false,
				selfFalg: false,
				confirmFlag: false,
				followFlag:false
			}
		},
		mounted() {
			var that = this
			setBodyColor(true)
			if(that.$route.query.uuid) {
				that.askData.uuid = that.$route.query.uuid
			} else {
				that.askData.uuid = JSON.parse(localStorage.getItem("twUser")).uuid
				that.selfFalg = true
			}
			network(CONFIG.userHeader, {
				uuid: that.askData.uuid
			}).then((res) => {
				if(res.head.code == 0) {
					that.minData = res.details
				}
			})
			that.getData()
		},
		methods: {
			changeState(type) {
				var that = this
				that.changeType = type
			},
			getData() {
				var that = this
				if(that.more == 0 || that.switchShow) {
					return false;
				};
				that.switchShow = true;
				network(CONFIG.userShares, that.askData).then((res) => {
					var details = res.details;
					details.forEach(function(item, index) {
						item.image_src_list = item.image_src_list.length ? item.image_src_list.split(",") : [];
						item.image_src = that.minData.head_thumb;
						item.hideFollow = true;
					});
					that.listData = that.listData.concat(details);
					that.askData.start = res.result.start;
					that.more = res.result.more;
					that.switchShow = false;
					if(!that.listData.length) {
						that.noDataFlag = true;
					}
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
			// 文字展开
			detailsShow(index) {
				var that = this;
				Vue.set(that.listData[index], 'detailsShow', !that.listData[index].detailsShow)
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

			},
			confirmShow(index) {
				var that = this;
				that.followFlag = true;
			},
			//取关 这是因为取关需要下拉框进行确认！
			disFollow() {
				var that = this;
				that.followFlag = false;
				network(CONFIG.userFollow, {
					uuid: that.minData.uuid,
					follow: 'N'
				}).then((res) => {
					Vue.toast('已取消关注', {
						duration: 1500
					});
					that.minData.is_follow = 'N'
				});
			},
			follow(){
				var that = this ;
				if(!that.goLogin()){
					return false;
				}
				if(that.minData.is_follow == 'Y'){
					that.followFlag = true;
				}else{
					network(CONFIG.userFollow, {
						uuid: that.minData.uuid,
						follow: 'Y'
					}).then((res) => {
						if(res.result.flag == 1) {
							Vue.toast('关注成功', { duration: 1500 });
							that.minData.is_follow = 'Y'
						} 
					});	
				}
			},
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
		components: {
			share
		}
	}
</script>

<style scoped>
	@import '~vue-swipe/dist/vue-swipe.css';
	.self-edit {
		height: 10.6rem;
		background: #2B575F;
	}
	
	.self-edit .goback {
		margin-top: 0.8rem;
		display: inline-block;
		width: 0.5rem;
		height: 0.8rem;
		background-image: url(~@assets/img/arrow-left-white.png);
	}
	
	.self-edit .self-info {
		width: 17rem;
		height: 10.6rem;
		margin: 0 auto;
	}
	
	.self-edit .self-item {
		padding-top: 1.5rem;
		display: flex;
		justify-content: space-between;
	}
	
	.self-edit .portrait {
		width: 2.8rem;
		height: 2.8rem;
		border-radius: 50%;
	}
	
	.self-edit .intro {
		height: 1rem;
	}
	
	.self-edit .attention-fans,
	.self-edit .attention-fans-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.self-edit .attention-fans .active {
		background: #F7F7F7;
		color: #666;
	}
	.self-edit .attention-fans-info {
		width: 4.2rem;
	}
	
	.self-edit .attention-fans-info p {
		text-align: center;
	}
	
	.self-edit .attention-fans {
		margin-top: 2rem;
	}
	
	.self-edit .edit-info {
		display: inline-block;
		width: 5rem;
		height: 1.6rem;
		line-height: 1.6rem;
		text-align: center;
		border: 1px solid #fff;
		border-radius: 0.8rem;
	}
	
	.self-edit .state-experience {
		height: 2.2rem;
		line-height: 2.2rem;
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}
	
	.self-edit .state-experience p {
		width: 6.3rem;
		text-align: center;
	}
	
	.self-edit .state-experience span {
		width: 1.6rem;
		display: inline-block;
	}
	
	.self-edit .changeState {
		color: #333;
		border-bottom: 2px solid #333;
	}
	
	.self-edit .message-null {
		width: 7.4rem;
		margin: 0 auto;
		text-align: center;
		margin-top: 6.3rem;
	}
	
	.self-edit .message-null img {
		width: 100%;
	}
	
	.self-edit .message-null p {
		margin-top: 1.5rem;
	}
	
	.self-attention {
		width: 2.6rem;
		height: 1.4rem;
		background: #00CCA7;
		line-height: 1.4rem;
		border-radius: 3.5rem;
	}
</style>