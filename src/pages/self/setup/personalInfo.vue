<template>
	<div class="personal">
		<!--<div class="personalInfo" v-if = "personalInfo">-->
			<!--<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">个人资料</p>-->
			<!--<p class="font-blue font-14" @click="submitForm">完成</p>-->
		<!--</div>-->
		<div class="personalInfo" v-if = "changeNickname">
			<p class="go-back bg-contain"  @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">修改昵称</p>
			<p class="font-blue font-14"  @click="changeNicknameData">完成</p>
		</div>
		<div class="personalInfo" v-if = "introduction">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">简介</p>
			<p class="font-blue font-14" @click="introductionData">完成</p>
		</div>
		<div class="setup-list font-14 font-darkGray" v-if = "personalInfo">
			<ul>
				<li class="public-arrow-right personal-portrait">
					<div  class="goTo" > 
						<p>头像</p>
						<!--<div class="previewImg" :style="{'background-image':'url('+reviewBase64+')'}"></div>-->
						<!--<p @click="croppaFlag=true" class="portrait" :style="{'background-image':'url('+ personalData.head_thumb+')'}"></p>-->
						<p @click="avatarFlag=true" class="portrait" :style="{'background-image':'url('+ personalData.head_thumb+')'}"></p>
					</div>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right" @click="changeNicknameShow">
					<router-link  class="goTo" to=""> 
						<p>昵称</p>
						<p class="font-BBB">{{personalData.nick_name? personalData.nick_name:'未设置'}} </p>
					</router-link>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right">
					<!--<router-link  class="goTo" to=""> 
						<p>性别</p>
						<p class="font-BBB" > 
							<select class="font-blue" name="sex" v-model="personalData.sex">
								<option value="未设置"  selected = "selected" >未设置</option>
								<option value="男" >男</option>
								<option value="女" >女</option>
							</select>
						</p>
					</router-link>-->
					<div class="goTo" @click="sexVisible = true">
						<p>性别</p>
						<div class="font-BBB" @click="sexVisible = true">{{personalData.sex ? personalData.sex : '未设置'}}</div>
					</div>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right">
					<div  class="goTo" > 
						<p>位置</p>
						<p class="font-BBB" @click="address">{{personalData.user_address?personalData.user_address :'未设置'}} </p>
					</div>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right">
					<router-link  class="goTo" to=""> 
						<p>生日</p>
						<div class="font-BBB" @click="openPicker">{{personalData.user_birthday?personalData.user_birthday:'未设置'}}</div>
					</router-link>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right" @click="introductionShow">
					<router-link  class="goTo" to=""> 
						<p>简介</p>
						<p class="font-BBB">{{personalData.user_profile?personalData.user_profile:'未设置'}} </p>
					</router-link>
					<span class="line-normal"></span>
				</li>
			</ul>
		</div>
		<div class="changeNickname" v-if = "changeNickname">
			<input type="text" v-model="personalData.nick_name"  maxlength="16" placeholder="请输入昵称"/>
		</div>
		<div class="introduction" v-if = "introduction">
			<textarea placeholder=" 输入个人简介 (16字)" v-model="personalData.user_profile" maxlength="16"></textarea>
		</div>
		<!--性别选择器-->	
		<!--<div class="public-popup-shadow" v-if="sexVisible" @click="sexVisible = !sexVisible">
		     <div class="bg-white sex-popup">
		     	<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
		     </div>
		     
		</div>-->
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="sexVisible">
				<div class="public-popup-shadow" @click="sexVisible = false"></div>
				<div class="bg-white absolute bottom left right">
					<p class="public-popup-bottom-title text-center font-16 font-grey relative" @click="onValuesChange(0)">
						男
						<span class="line-normal absolute left bottom right"></span>
					</p>
					<div class="font-16 text-center public-lineheight"  @click="onValuesChange(1)">女</div>
					<div class="picker-btn font-16 text-center public-lineheight" @click="sexVisible = false">取消</div>
				</div>
			</div>
		</transition>
		<div>
	       <mt-datetime-picker
	                type="date"
	                ref="picker"
	                year-format="{value} 年"
	                month-format="{value} 月"
	                date-format="{value} 日"
	                @confirm="handleConfirm"
	                :startDate="startDate"
	             >
	        </mt-datetime-picker>
 		</div>

		<div class="avatar_bg" v-show="croppaFlag">
			<span class="btn" @click="changeAvatarFlag = true"></span>
			<div>
				<croppa 
					v-model="myCroppa"
					:show-remove-button="false"
					canvas-color="#f2f2f2"
					placeholder="点击选择图片"
					:placeholder-font-size="14"
					:prevent-white-space="true" 
					:width=croppaWidth 
	         		:height=croppaWidth>
				</croppa>
				<div style='display:flex;justify-content: space-between;margin-top:1rem;color:white'>
					<div @click="avartarClose(0)">关闭</div><div @click="avartarClose(1)">选取</div>
				</div> 
			</div>		
		</div>
		
		<div v-if="avatarFlag" class="avatar_bg public-popup-wrap bg-black">
				
				<span class="btn" @click="changeAvatarFlag = true"></span>
				<div class="font-white font-20 fixed save-btn" v-if = 'saveBtn' @click="avatarHide">保存</div>
				<span v-show="askData.head_thumb != personalData.head_thumb" class="save font-white"></span>
				<img class="avatar" :src="personalData.head_thumb" />
		</div>
		
		<div class="actionSheet-wrap"   v-if = "changeAvatarFlag">
			<ul v-if="userHeadThumbsFlag" class="actionSheet-avatar-list myStyleScrollbar">
				<li v-for="item in userHeadThumbs">
					<img :src="item" @click="avatarChange(1,item)"/>
				</li>
			</ul>
			<ul v-else  class="actionSheet-ul">
				<li class="item title">更换头像</li>
				<li class="item" @click="changeAvatar(1)">系统推荐</li>
				<li class="item" @click="changeAvatar(2)">拍照或相册</li>
			</ul>
			<div class="item cancel" @click="changeAvatarFlag = false;userHeadThumbsFlag = false;">取消</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';

import { DatetimePicker,Toast,Popup,Picker  } from 'mint-ui';
import Croppa from 'vue-croppa';
import { getMapAddress, setBodyColor } from '@assets/js/mUtils'

//import 'vue-croppa/dist/vue-croppa.css';
Vue.use(Croppa);


export default {
	data () {
  		return {
  			personalInfo: true,
  			changeNickname: false,
  			introduction: false,
//			changeNicknameInfo: '', //修改昵称
//			introductionInfo: '', // 修改简介
  			personalFlag: false,
  			personalData: [],
  			
			sexVisible: false,  //选择器的显示与影藏

			croppaFlag: false,  //头像弹出层
			myCroppa: {},//裁剪对象
			reviewBase64:'', //预览
			croppaWidth: 200,
			askData: {},
			slots: [
			    {
	             flex: 1,
	             values: ['男','女'],
	             className: 'slot1',
	              textAlign: 'center',
	              flex: 1,
	              defaultIndex: 0
			    }
			],
//			sex: '未设置',
//			birthday:"未设置",  //出生日期
			startDate: new Date('1968-01-01'),
			changeAvatarFlag: false, 
			userHeadThumbsFlag: false,
  			userHeadThumbs: [],
  			avatarFlag: false,
  			saveBtn: false, // 保存
  		}
  	},
  	mounted(){
  		var that = this 
  		that.croppaWidth = IFPCFLAG?640:window.innerWidth;
  		setBodyColor(true);

  		that.getData()
　　　　	this.slots[0].defaultIndex = 0
		getMapAddress()
  	},
  	methods: {
  		// 选择系统头像或者相册
  		changeAvatar(type){
  			var that = this 
  			if (type == 1) {
  				if(that.userHeadThumbs.length>0){
					that.userHeadThumbsFlag = true;
				} else {
					// 系统头像
					that.saveBtn = true
					network(CONFIG.userHeadThumbs).then((res) => {
						if(res.head.code == 0){
							that.userHeadThumbsFlag = true;
							that.userHeadThumbs = res.details.pictures;
						};
					})
				}
  			} else if (type == 2) {
  				that.changeAvatarFlag = false; // 选择图片的弹出层
				that.croppaFlag = true; // 选择图片的弹出层
				that.avatarFlag = false // 预览图片 （已经选好）
				that.myCroppa.chooseFile();
  			}
  		},
		avartarClose(index){
			this.croppaFlag=false
			if(index==0){
				this.myCroppa.remove()
				this.getData()
			}else{
				this.personalData.head_thumb = this.myCroppa.generateDataUrl() 
				this.submitForm()
			}
			
		},
		avatarChange(type,str){
			var that = this;
			if(type == 1){
				that.personalData.head_thumb = str
				that.askData = {
	    			headThumb:that.personalData.head_thumb,
			        nickName:that.personalData.nick_name,
			        area: that.personalData.user_address,
			        birthday: that.personalData.user_birthday,
	    			sex: that.personalData.sex,
	    			intro: that.personalData.user_profile
	    		}
			}
//			that.submitPostRequest()
		},
		avatarHide(){
			var that = this
			that.dataUrl = '';
    		that.avatarFlag = false
    		that.croppaFlag = false
    		that.changeAvatarFlag = false
    		that.userHeadThumbsFlag = false
    		Vue.toast('头像保存成功', {duration: 1500 })
    		that.submitPostRequest()
		},
  		goBack () {
  			var that = this
  			that.personalInfo = true
  			that.changeNickname = false
  			that.introduction = false
  		},
  		getData () {
  			var that = this
  			network(CONFIG.userInfo, {}).then((res) => {
  				if (res.head.code == 0) {
  					that.personalData = res.details
  					that.personalFlag = true
  					localStorage.setItem('headThumb', res.details.head_thumb)
  				}
  			}) 
  		},
  		changeNicknameShow () {
  			var that = this
  			that.personalInfo = false
  			that.changeNickname = true
  			that.introduction = false
  		},
  		changeNicknameData () {
  			var that = this
  			if (that.personalData.nick_name.trim() == '') {
  				Vue.toast('昵称不能为空', {duration: 1500 })
  				return false;
  			} 
			that.personalInfo = true
  			that.changeNickname = false
  			that.introduction = false
  			that.submitForm()
  		},
  		introductionShow () {
  			var that = this
  			that.personalInfo = false
  			that.changeNickname = false
  			that.introduction = true
  		},
  		introductionData () {
  			var that = this
			
			that.personalInfo = true
  			that.changeNickname = false
  			that.introduction = false
  			this.submitForm()

  		},
  		// 性别选择器
		onValuesChange(sex) {
			if(sex == 0) {
				this.personalData.sex = '男'
			} else {
				this.personalData.sex = '女'
			}
		    this.sexVisible = false 
		    this.submitForm()
		},
		// 时间选择器
		openPicker () {
			this.$refs.picker.currentValue=new Date(this.personalData.user_birthday)
		    this.$refs.picker.open()
		    
		},
		handleConfirm (data) {
		    this.personalData.user_birthday = data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate();   //获取的时间为时间戳
			this.submitForm()
		},
    	putb64(){
    		var that = this;
    		var pic = that.personalData.head_thumb.replace("data:image/png;base64,", "");
		    var url = CONFIG.uploadFileUrlBase64;
		    var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange=function(){
			    if (xhr.readyState==4){ 
			    	var _data = JSON.parse(xhr.responseText);
			    	that.askData.headThumb = CONFIG.imageHost+_data.key;
			    	that.submitPostRequest();
			    }
		    };
		    xhr.open("POST", url, true);
		    xhr.setRequestHeader("Content-Type", "application/octet-stream");
		    xhr.setRequestHeader("Authorization", "UpToken "+that.uploadToken);
		    xhr.send(pic);
    	},
    	// 获取地址
    	address(){
    		var that = this 
			getMapAddress(function(){
				that.personalData.user_address = localStorage.getItem("province") + localStorage.getItem("city");
			})
			setTimeout(()=>{
				this.submitForm()
			},800)
    	},
    	submitForm(){
    		var that = this 
    		that.askData = {
    			headThumb:that.personalData.head_thumb,
		        nickName:that.personalData.nick_name,
		        area: that.personalData.user_address,
		        birthday: that.personalData.user_birthday,
    			sex: that.personalData.sex,
    			intro: that.personalData.user_profile
    		}
    		if (!that.personalData.head_thumb) {
    			Vue.toast('头像必传',{duration:1500})
	            return false;
    		}
    		if (!that.personalData.nick_name) {
    			Vue.toast('昵称不能为空',{duration:1500})
	            return false;
    		}
    		if (localStorage.getItem('headThumb') != that.personalData.head_thumb) {
    			if(that.uploadToken) {
    				that.putb64();
    			} else {
    				network(CONFIG.uploadToken, {}).then((res) => {
    					if (res.head.code == 0) {
    						that.uploadToken = res.details;
		    				that.putb64();
    					}
    				})
    			}
    		} else {
    			that.personalData.head_thumb = localStorage.getItem('headThumb')
    			that.submitPostRequest();
    		}
    	},
    	submitPostRequest(){
			var that = this 
    		network(CONFIG.userUpdate,that.askData).then((res) => {
    			if (res.head.code == 0) {
//  				Vue.toast('修改成功',{duration:1500})
    			}
    		})
    	}
  	},
  	destroyed(){
		setBodyColor();
	},
	components: {
//		'mt-picker': Picker,
		'mt-datetime-picker': DatetimePicker
	}
}
</script>

<style>
.personalInfo {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.personalInfo .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.personal .setup-list {
	font-size: 0.7rem;
	color: #333;
	padding: 0 0.9rem;
	margin: 0 auto;
}
.personal .setup-list li {
	width: 100%;
	line-height: 2.6rem;
	height: 2.6rem;
}
.personal .setup-list li .goTo {
	display: inline-block;
	width: 100%;
	height: 2.6rem;
	display: flex;
	justify-content: space-between;
}
.personal .setup-list .personal-portrait {
	height: 3.6rem;
	line-height: 3.6rem;
}
.personal .setup-list .personal-portrait .portrait {
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	margin-top: 0.6rem;
	background-size: 100%;
}
.personal .personal-portrait .goTo {
	line-height: 3.6rem;
	height: 3.6rem;
}
.personal .changeNickname {
	padding-left:0.5rem;
	height: 2.5rem;
	background: #fff;
}
.personal .changeNickname input {
	border: none;
	width: 95%;
	margin: 0 auto;
	height: 2.5rem;
}
.personal .introduction {
	background: #fff;
	width: 18.75rem;
	height: 6rem;
	
}
.personal .introduction textarea {
	border: none;
	width: 17rem;
	height: 5rem;
	margin-left: 0.7rem;
	margin-top: 0.3rem;
}
.personal .sex-popup {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}

.avatar_bg{
	width: 100vw;
	height: 100vh;
	background: black;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	box-sizing: border-box;
	padding-top: 30vh;
	justify-content: center;
}
.previewImg{
	width: 2.5rem;
	height: 2.5rem;
	background-size: 100%;
}
.personal .avatar_bg .btn{
	position: absolute;
	left:0.1rem;
	top: 0.1rem;
	width: 2rem;
	height: 2rem;
	background: url(~@assets/img/point-white.png) no-repeat center;
	background-size:1.3rem ;
}
.personal .avatar_bg  .save-btn {
	top: 0.5rem;
	right: 0.5rem;
}
.personal .actionSheet-wrap .actionSheet-avatar-list{
	white-space: nowrap;
	overflow-y: hidden;
	overflow-x: auto;
	padding: 1.9rem 0.6rem;
	background: rgba(252,252,252,0.8);
}
.personal .actionSheet-wrap .actionSheet-avatar-list li{
	display: inline-block;
	margin-right: 1rem;
}

.personal .actionSheet-wrap .actionSheet-avatar-list li img{
	width: 3.1rem;
	height: 3.1rem;
	border-radius: 100%;
}
.actionSheet-wrap{
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 30;
	padding: 0.5rem;
	text-align: center;
	z-index: 220;
}
.actionSheet-wrap ul,
.actionSheet-wrap .cancel{
	border-radius: 0.6rem;
	overflow: hidden;
}
.actionSheet-wrap .item{
	padding: 0.85rem 0;
	color: #0076FF;
	font-size: 1rem;
	background: rgba(252,252,252,0.95);
}
.actionSheet-wrap .item.hasTip{
	height: auto;
}
.actionSheet-wrap .item .tip{
	font-size: 0.7rem;
	color: #C34655;
}
.actionSheet-wrap .cancel{
	margin-top: 0.3rem;
	background: #fff;
}
.actionSheet-wrap .title{
	font-size:0.65rem ;
	color: #8F8E94;
	height: 2.3rem;
	line-height: 2.3rem;
	overflow: hidden;
	padding: 0;
}

.actionSheet-wrap .red{
	color: #ff0053;
}

.actionSheet-wrap ul .item{
	border-bottom: 1px solid rgba(77,77,77,0.2);
}

.actionSheet-wrap ul .item:last-child{
	border: none;
}
.public-popup-wrap{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 20;
}
.public-popup-wrap > img{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	width: 18.75rem;
	height: 18.75rem;
}
.public-popup-wrap > .btn{
	position: absolute;
	left:0.1rem;
	top: 0.1rem;
	width: 2rem;
	height: 2rem;
	background: url(~@assets/img/point-white.png) no-repeat center;
	background-size:1.3rem ;
	
}
.public-popup-wrap .save{
	position: absolute;
	right: 0.1rem;
	top: 0.1rem;
	line-height: 2rem;
	padding: 0 0.5rem;
}
</style>
