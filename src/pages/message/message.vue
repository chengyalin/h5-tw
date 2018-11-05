<template>
	<div class="message">
		<div class="title-content fixd-center">
			<p class="msg-title font-bold">
				消息
			</p>
			<div class="msg-title-info font-14 font-grey">
				<span class="msg-title-active"  @click="changeState(1)">通知<span :class="{active:changeMsg == 1}"></span></span>
				<span class="msg-title-active"  @click="changeState(2)">客服<span :class="{active:changeMsg == 2}"></span></span>
				<span class="msg-title-active"  @click="changeState(3)">关于我<span :class="{active:changeMsg == 3}"></span></span>
			</div>
		</div>
		<div style="width:100%;height:4.35rem;"></div>
		<div class="service-info">
			<!-- 通知 -->
			
			<div  class="inform"  v-if="changeMsg == 1">
				

				<ul v-if = "informData.length != 0 && !noDataFlag">
					<li v-for = "(item, index) in informData" :key = "item.pushId" >
						<!--物流-->
						<router-link :to="{path: '/orderDetails', query: {orderNo: item.extra}}" class="info-content" v-if = "item.type == 2">
							<p class="info-express-time font-12 font-white">{{ item.datetime | formatTime10 }}</p>
							<div class="info-express">
								<P class="font-14 font-darkGray font-bold"><span class="info-dian"></span>物流更新</P>
								<div class="info-detail">
									<div class="info-express-content">
										<P class="font-12 font-darkGray info-express-name">{{ item.details }}</P>
										<P class="font-12 font-lightGray">订单编号: {{ item.extra }} </P>
									</div>
									<div class="info-express-img bg-cover" :style="{'background-image': 'url('+ item.imageSrc +')'}">
										<!--<img src="../../assets/img/self/service.png"  />-->
									</div>
								</div>
							</div>
						</router-link>
						<!--优惠券-->
						<div class="info-content" v-if = "item.type == 0 && !noDataFlag">
							<p class="info-express-time  font-white">5.11</p>
							<div class="info-express">
								<P class="font-14 font-darkGray font-bold">优惠券即将过期</P>
								<P class="font-12 font-darkGray info-express-name">{{ item.details }}</P>
							</div>
						</div>
					</li>
				</ul>
				<div class="message-bg" v-else>
					<div class="message-null">
						<img src="~@assets/img/message-null.png" />
						<p class="font-14 font-lightGray">暂无任何消息</p>
					</div>
				</div>
			</div>
			<!-- 客服 -->
			<div class="service" v-else-if="changeMsg == 2">
				<p class="service-img bg-contain">
					 <!--<img class="service-banner" :src="help.bannerInfoList[0]." />--> 
				</p>
				<div  class="online-service">
					<P class="online-msg font-16 font-bold public-arrow-right " @click="chat">
						<img class="online-img" src="~@assets/img/self/service.png" /> <span>在线客服</span>
					</P>
					<span class="line-normal"></span>
					<ul>
						<li class="help-list" v-for="(item, index) in help" :key="item.id" @click="helpShow(index)">
							<span class="circle"></span>
							<span class="name font-14 font-darkGray">{{ item.title }}</span>
		
							<span v-if="item.helpFlag" class="arrows arrows2"></span>
							<span v-else class="arrows public-arrow-right"></span>
							<p v-if="item.helpFlag" class="help-list-info font-12 font-grey">
								{{ item.content }}
							</p>
							<span class="line-normal"></span>
						</li>
						<li class="help-list">
							<router-link to="self/help">
								<span class="circle"></span>
								<span class="name font-14 font-darkGray">更多租赁问题</span>
								 <span class="arrows public-arrow-right"></span>
							</router-link>
							
						</li>
					</ul>
				</div>
			</div>
			<!-- 关于我 -->
			<div v-else class="about-me">
				
				<ul v-if = "aboutMeData.length != 0 && !noDataFlag">
					<li class="self-info" v-for="(item, index) in aboutMeData" :key = "item.id">
						<p class="portrait" >
							<router-link :to="{path: '/self/selfEdit', query: {uuid: item.sourceUserUId}}">
								<img :src="item.sourceUserHeadThumb" />
							</router-link>
						</p>
						<div class="information">
							<p class="info-name font-black font-bold font-14">{{item.sourceUserName }}</p>
							
							<router-link to="/discover/share">
								<p v-if="item.actionType == 1" class="info-comment font-12"><span>赞了你</span></p>
							</router-link>
							<router-link to="/discover/share">
								<p v-if="item.actionType == 2" class="info-comment font-12"><span>关注了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							</router-link>
							<router-link to="/discover/share">
								<p v-if="item.actionType == 3" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}00</span></p>
							</router-link>
							<router-link :to="{path: '/videoDetails', query: {videoId: item.targetId}}">
								<p v-if="item.actionType == 4" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							</router-link>
							<router-link :to="{path: '/themeDetails', query: {themeId: item.targetId}}">
								<p v-if="item.actionType == 5" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							</router-link>
							<router-link to="/discover/share">
								<p v-if="item.actionType == 6" class="info-comment font-12"><span>评论了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							</router-link to="/discover/share">
							<router-link :to="{path: '/appraise', query: {productId: item.targetId}}">
								<p v-if="item.actionType == 7" class="info-comment font-12"><span>赞了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							</router-link>
							
							<!--<p v-if="item.actionType == 1" class="info-comment font-12"><span>赞了你</span></p>
							<p v-if="item.actionType == 2" class="info-comment font-12"><span>关注了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>-->
						<!--	<p v-if="item.actionType == 3" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>-->
							<!--<p v-if="item.actionType ==4" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							<p v-if="item.actionType == 5" class="info-comment font-12"><span>回复了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							<p v-if="item.actionType == 6" class="info-comment font-12"><span>评论了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>
							<p v-if="item.actionType == 7" class="info-comment font-12"><span>赞了你 </span> <span class="info-comment-content line-ellipsis">{{ item.targetComment }}</span></p>-->
							<p class="info-time font-12">{{item.addTime | formatTime10}}</p>
						</div>
						<div>
							<!-- 关注头像 -->
							<!-- <p class="portrait"><img src="../../assets/img/self/service.png" /></p> -->
							<!-- 点赞评论 -->
							<p v-if = "item.actionType != 2" class="portrait-comment bg-cover" :style="{'background-image': 'url('+ item.targetImgUrl +')'}"></p>
							<p v-else class="portrait-comment"></p>
						</div>
						<span class="line-normal"></span>
					</li>
				</ul>
				<div class="message-bg" v-else>
					<div class="message-null" >
						<img src="~@assets/img/message-null.png" />
						<p class="font-14 font-lightGray">暂无任何消息</p>
					</div>
				</div>
			</div>
		</div>
		<div class="footer"></div>
		<tabs></tabs>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import Tabs from '@components/tabs';
import { publicChat } from '@assets/js/mUtils';
import { setBodyColor } from '@assets/js/mUtils';


export default {
	data () {
  		return {
				help: [],
				changeMsg: 2,
				askData:{
			      pageSize:20,
			      pageNum:1
			    },
			    minData:{
			      size:20,
		          start:"-1"
			    },
			    switchShow:false,
		    	noDataFlag:false,
			    more: 1,
				askData: {},
				helpShowNum:null,
				aboutMeData: [],
				informData: [],
  		}
  },
	mounted () {
		var that = this
		that.getData() // 客服
		that.notifyComments() // 关于我
		that.informShow() // 通知
		
		window.addEventListener('scroll', that.scrollBottom)
		if (that.changeMsg != 2) {
			setBodyColor(true)
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
		window.scrollTo(0,0);
		setBodyColor();
		window.removeEventListener('scroll',that.scrollBottom);
 	},
	methods: {
		// 客服咨询问题
		getData () {
			var that = this
			network(CONFIG.help, {isCS: 'Y'}).then((res) => {
				if (res.head.code == 0) {
					var list = res.details.questions
					list.forEach((item) => {
						item.helpFlag = false
					})
					that.help = list
				}
			})
		},
		// 改变状态
		changeState (num) {
			var that = this
			that.changeMsg = num
			
			if (that.changeMsg == 1 || that.changeMsg == 3) {
				if ((that.aboutMeData.length == 0 && that.noDataFlag) || (that.informData.length == 0 && that.noDataFlag)) {
					setBodyColor(true)
				}
				
			} else {
				setBodyColor()
			}
		},
		// 关于我点赞评论
		notifyComments() {
			var that = this
			if (that.more == 0 || that.switchShow) {
		        return false;
		    };
			network(CONFIG.notifyAboutMe, that.askData, {method:'GET'}).then((res) => {
				if (res.head.code == 0) {
					that.aboutMeData = that.aboutMeData.concat(res.data)
					that.askData.pageNum++;
					that.more =  that.askData.pageNum <= res.page.pages;
					that.switchShow = false;
					if(!that.aboutMeData.length){
						that.noDataFlag = true;
					}
				}
			})
		},
		// 通知
		informShow () {
			var that= this 
			if (that.more == 0 || that.switchShow) {
		        return false;
		    };
			network(CONFIG.notifyPush, that.minData).then((res) => {
				if (res.head.code == 0) {
					that.informData = res.details
					that.minData.start = res.result.start;
					that.more = res.result.more;
					that.switchShow = false;
					if(!that.informData.length){
						that.noDataFlag = true;
					}
				}
				
				
			})
		},
		// 展开收起
		helpShow (index) {
			var that = this
			var listData = that.help
			var helpFlag = that.help[index].helpFlag
			listData.forEach((item) => {
				item.helpFlag = false
			})
			listData[index].helpFlag = !helpFlag
			that.help = listData
			
		},
		chat(){
			var that = this;
			publicChat();
		},
		scrollBottom(){
        		var that = this;
        		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if((scrollTop + clientHeight) == scrollHeight){
				that.notifyComments() // 关于我
				that.informShow() // 通知
			}
        }
		

	},
	components: {
	    Tabs
	}
}
</script>

<style scoped>

.message .title-content {
	padding-top: 0.4rem;
	background: #fff;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 2;
}

.message .msg-title {
	font-size: 1.3rem;
	margin-left: 0.9rem;
}
.message .msg-title-info {
	padding-left: 0.9rem;
	display: inline-block;
	height: 2.4rem;
	line-height: 2.8rem;
}
.message .msg-title-active {
	position: relative;
	margin-right: 1.5rem;
}

/*.message .service-info {
	margin: 0 auto;
}*/
.message .inform {
	margin: 0 auto;
	margin-top: 0.9rem;
	padding: 0 0.9rem;
}
.message .inform .info-content {
	display: block;
}

.message .info-express {
	background: #fff;
	padding: 0.5rem 1rem  0.5rem 1rem;
	margin-bottom: 0.6rem;
}
.message .info-detail {
	display: flex;
	justify-content: space-between;
}
.message .info-express-time {
	width: 3.3rem;
	height: 0.9rem;
	line-height: 0.9rem;
	background: #DDDDDD;
	text-align: center;
	border-radius: 1px;
	margin: 0 auto;
	margin-bottom: 0.5rem;
}
.message .info-express-content {
	width: 11.4rem;
}
.message .info-express-name {
	margin: 0.2rem 0 0.5rem;
}
.message .info-dian {
	display: inline-block;
	background: #3ED8C4;
	border-radius: 50%;
	width: 0.3rem;
	height: 0.3rem;
	margin-right: 0.4rem;
}
.message .info-express-img {
	width: 2.6rem;
	height: 2.6rem;
	
}
.message .service {
	/* padding: 0 1rem; */
	background: #fff;
	margin: 0.9rem 0.9rem 0;
}
.message .service-img {
	/*background: red;*/
	background-image: url(~@assets/img/service-img.png);
	width: 100%;
	height: 10rem;

}
.message .service-banner {
	/* width: 100%; */
	vertical-align: middle;
}
.message .online-service {
	width: 95%;
	margin: 0 auto;
	padding: 0.8rem 0 1.4rem;
	/*height: 12rem;*/
	/* padding: 0 1.5rem; */
}
.message .online-img {
	width: 1.8rem;
	height: 1.87rem;
	vertical-align: middle;

}
.message .online-msg {
	height: 3.3rem;
	line-height: 3.3rem;
	width: 15rem;
}
.message .online-problem {
	width: 100%;
	/* padding-right: 1.1rem; */
	height: 2.4rem;
	line-height: 2.4rem;
}
.message .online-problem span {
	display: inline-block;
}
.message .online-rot {
	width: 0.4rem;
	height: 0.4rem;
	border: 1px solid #ddd;
	border-radius: 50%;
	margin-right: 0.4rem;
}
.message .online-arrow {
	 width: 0.5rem;
	 height: 2.4rem;
	 float: right;
	 background-image: url(~@assets/img/self/arrows1.png);
	 background-repeat: no-repeat;
	 background-position: right 50%;
	 background-size: 0.4rem;
}
.message .active {
	position: absolute;
	left: 50%;
	bottom: -0.6rem;
	transform: translateX(-50%);
	-webkit-transform: translateX(-50%);
	display: inline-block;
	color: #333333;
	border-bottom: 0.15rem solid #333333;
	font-weight: bold;
	width: 1.3rem;
	padding-bottom: 0.8rem;
}
.message .self-info {
	display: flex;
	justify-content: center;
	padding-top: 0.9rem;
	padding-bottom: 0.9rem;
	position: relative;
}
.message .self-info .line-normal {
	position: absolute;
	left: 0;
	bottom: 0;
}
.message .message-null {
	width: 7.4rem;
	/*height: 6.3rem;*/
	margin: 0 auto;
	text-align: center;
	margin-top: 6.3rem;
}
.message .message-null img{
	width: 100%;
}
.message .message-null p {
	margin-top: 1.5rem;
}
.message .message-bg {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 4.7rem;
	background: #fff;
}
.message .portrait {
	width: 1.8rem;
	height: 1.8rem;
	border-radius: 50%;
}
.message .portrait img {
	border-radius: 50%;
	width: 100%;
	vertical-align: middle;
}
.message .information {
	width: 12.8rem;
	/*height: 4.7rem;*/
}
.message .information p {
	margin-left: 0.6rem;
}
.message .info-name {
	/*margin-top: 0.9rem;*/
}
.message .info-time,.message .info-comment {
	color: #666666;
	height: 1.1rem;
	line-height: 1.1rem;
}
.message .portrait-comment {
	width: 1.8rem;
	height: 1.8rem;
}
.message .info-comment {
	height: 1.1rem;
	line-height: 1.1rem;
	display: flex;
	justify-content: flex-start;
}
.message .info-comment span {
	display: inline-block;

}
.message .info-comment-content {
	width: 7.2rem;
	margin-left: 0.3rem;
}
.message .footer {
	height: 2.2rem;
}

.message .help-info {
	margin-top: 0.8rem;
}
.message .help-list {
	padding: 0.7rem 0 0rem;
	width: 15rem;
	margin: 0 auto;
}
.message .help-list:last-child {
	border-bottom: none;
}
.message .help-list span {
	display: inline-block;
}
.message .circle {
	width: 0.2rem;
	height: 0.2rem;
	border-radius: 50%;
	border: 0.1rem solid #DDDDDD;
	margin-right: 0.4rem;
	margin-bottom: 0.1rem;
}
.message .arrows {
	margin-top: 0.2rem;
	float: right;
	width: 0.6rem;
	height: 0.6rem;
	/*background-repeat: no-repeat;
	background-size: 0.6rem;
	background-position: right 0.1rem;*/
}
/*.message .arrows1 {
	background-image: url(~@assets/img/arrow-up-gray.png);
}*/
.message .arrows2 {
	background-repeat: no-repeat;
	background-size: 0.4rem;
	background-position: right 0.1rem;
	background-image: url(~@assets/img/arrow-down-gray.png);
}
/*.message .arrows3 {
	background-image: url(~@assets/img/arrow-right-gray.png);
	background-size: 0.3rem 0.5rem;
}*/
.message .help-list-info {
    margin-left: 0.85rem;
    margin-top: 0.2rem;
}
.message .about-me {
	padding: 0 0.9rem;
	margin-bottom: 2rem;
}
</style>
