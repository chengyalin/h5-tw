<template>
	<div class="help">
		<div class="help-title">
			<div class="help-title-info">
				<!--<router-link class="goBack bg-contain" to="/self"></router-link>-->
				<p class="font-26 font-darkGray">
					帮助中心
				</p>
				<div class="help-name font-lightGray">
					<p :class="{'active': problemState == 0}" @click="changeState(0)">
						<span>常见问题</span>
						<span class="line2" v-if="problemState == 0"></span>
					</p>
					<p :class="{'active': problemState == 1}" @click="changeState(1)">
						<span>租赁规则</span>
						<span class="line2" v-if="problemState == 1"></span>
					</p>
				</div>
			</div>
		</div>
		<div class="help-info">
			<ul>
				<li class="help-list" v-for="(item, index) in help" :key="item.id" @click="helpShow(index)">
					<span class="circle"></span>
					<span class="name font-14 font-darkGray">{{ item.title }}</span>

					<span v-if="item.helpFlag" class="arrows arrows2"></span>
					<span v-else class="arrows arrows1"></span>
					
					<div class="help-list-info font-grey"  v-if="item.helpFlag">
						<p class="font-12 font-grey item-content">
							{{ item.content }}
						</p>
						<div class="ifHelp font-12">
							<p class="helpful" :class="{'helpful-active': item.helpful }" @click="ifHelp(1, item.questionId, index)"><span class="bg-contain"></span>有帮助的</p>
							<p class="no-helpful" :class="{'no-helpful-active': item.nohelpful }" @click="ifHelp(0, item.questionId, index)"><span class="bg-contain"></span>没帮助，去反馈</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="service font-14 font-white"  @click="chat">
			联系客服
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { publicChat , getMapSendDay } from '@assets/js/mUtils';
import { setBodyColor } from '@assets/js/mUtils';


export default {
	data () {
  		return {
				problemState: 0,
				helpType: '常见问题',
				help: [],
				helpShowInfo: false,
				helpShowNum:null,
				// helpful: false,
				// nohelpful: false,
				askData: {
					counterKey: 'question',
					helpState: '',
					questionId: ''
				}
  		}
  },
	mounted () {
		var that = this
		that.problemState = 0
		setBodyColor(true)
		that.getData()
	},
	methods: {
		// 切换选择问题
		changeState (type) {
			var that = this
			that.problemState = type
			that.getData()
		},
		getData () {
			var that = this
			if (that.problemState == 1) {
				that.helpType = 2
				that.helpShowNum=null
			} else {
				that.helpType = 1
				that.helpShowNum=null
			}
			network(CONFIG.help, {'type': that.helpType}).then((res) => {
				if (res.head.code == 0) {
					var help = res.details.questions  // 先用一个变量接收对象
					help.forEach((item)=>{
						item.helpful = false
						item.nohelpful = false
						item.helpFlag = false	// 给一个对象赋值一个属性
 					})
					that.help = help	// 把变量赋值给全局变量
				}
			})
		},
		// 展开收起
		helpShow (index) {
			var that = this
			var listData = that.help 
			var helpFlag = that.help[index].helpFlag // 先用一个变量接收一个原来的状态值
			listData.forEach((item) => {
				item.helpFlag = false
			})
			listData[index].helpFlag = !helpFlag
			that.help = listData
		},
		// 有帮助的和没帮助的
		ifHelp (state, id, index) {
			var that = this
			
			that.askData.questionId = id
			that.askData.helpState = state
			network(CONFIG.ruleCountTools, that.askData).then((res) => {
				if (state == 1) {
					Vue.toast('感谢您的反馈',{duration:1500})
					that.help[index].helpful=true
					that.help[index].nohelpful=false
				}else if (state == 0) {
					that.help[index].helpful=false
					that.help[index].nohelpful=true;
					that.$router.push({path: '/self/suggestion'});
				}
			})
		
		},
		chat(){
			var that = this;
			publicChat();
		}
	},
	destroyed(){
		setBodyColor()
	},
	components: {
	}
}
</script>

<style scoped>
.help-title {
	width: 18.75rem;
	background: #fff;
	height: 3rem;
	margin-bottom: 2.3rem;
}
.help-title-info {
	padding: 0 0.8rem;
	padding-top: 0.8rem;
	box-shadow:  0.1rem 0.1rem 0.6rem rgba(0,0,0,.05);
}
.help .goBack {
	display: inline-block;
	width: 0.5rem;
	height: 0.8rem;
	margin-top: 0.8rem;
	background-image: url(~@assets/img/arrow-left-black.png);
}
.help-name {
	margin-top: 1.1rem;
	display: flex;
	justify-content: flex-start;
}
.help-name p {
	/*padding-bottom: 0.8rem;*/
	margin-right: 3rem;
}
.help .active {
	color: #333;
	/* border-bottom: 3px solid #333; */
}
.help .line2 {
	display: block;
	width: 1.3rem;
	height: 0.2rem;
	background: #333;
	margin: 0.5rem auto 0;
}
.help-info {
	margin-top: 0.8rem;
}
.help-list {
	padding: 0.7rem 0;
	width: 17rem;
	border-bottom: 0.05rem solid #EEEEEE;
	margin: 0 auto;
}
.help-list span {
	display: inline-block;
}
.help .circle {
	width: 0.2rem;
	height: 0.2rem;
	border-radius: 50%;
	border: 1px solid #DDDDDD;
	margin-right: 0.4rem;
	margin-bottom: 0.1rem;
}
.help .arrows {
	margin-top: 0.2rem;
	float: right;
	width: 0.6rem;
	height: 0.6rem;
	background-repeat: no-repeat;
	background-size: 0.6rem;
	background-position: right 0.1rem;
}
.help .arrows1 {
	background-image: url(~@assets/img/arrow-down-gray.png);
}
.help .arrows2 {
	background-image: url(~@assets/img/arrow-up-gray.png);
}
.help-list-info {
	margin-left: 1.1rem;
}
.help-list-info .item-content {
	margin-top: 0.4rem;
}
.help .ifHelp {
	display: flex;
	justify-content:flex-start;
}
.help .ifHelp p{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem 0.6rem;
	border: 1px solid #eee;
	margin-right: 0.6rem;
	margin-top: 1.4rem;
}
.help .ifHelp p span {
	width: 0.8rem;
	height: 0.8rem;
	margin-right: 0.3rem;
}
.help .helpful span{
	background-image: url(~@assets/img/help-helpful.png);
}
.help .no-helpful span{
	background-image: url(~@assets/img/help-noHelpful.png);
}
.help .ifHelp .helpful-active, .help .ifHelp .no-helpful-avtive {
	color: #36646E;
	border:0.05rem solid #36646E;
}
.help .ifHelp .helpful-active span{
	background-image: url(~@assets/img/help-helpful-active.png);
}
.help .ifHelp .no-helpful-active span{
	background-image: url(~@assets/img/help-noHelpful-active.png);
}
.help .service {
	width: 100%;
	height: 2.2rem;
	text-align: center;
	line-height: 2.2rem;
	background:#36646E;
	position: fixed;
	bottom: 0;
	left: 0;

}

</style>
