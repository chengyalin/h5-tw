<template>
	<div class="zhimaIDcard">
		<div class="zhimaIDcard-upload ">
			<p class="font-14 font-darkGray">上传身份证头像面和国徽面照片</p>
			<p class="font-12 font-lightGray">你的身份证信息仅用于认证，我们将严格保障你的信息安全</p>
			<div class="zhimaIDcard-card">
				<div class="zhimaIDcard-wrap-border">
					<div class="zhimaIDcard-wrap bg-cover" :style="{'background-image':'url('+(cardFrontUrl?cardFrontUrl:'')+')'}" >
					<!--<div class="zhimaIDcard-wrap bg-cover">-->
						<p class="zhimaIDcard-portrait bg-contain" v-if = "portraitFlag"></p>
						<input id="image1" type="file" class="file" @change="chooseImage(1,$event)"/>
						<label for="image1" class="label"></label>
						<span v-if="cardFrontUrl && !askData.cardFrontUrl" class="cover"></span>
					</div>
				</div>
				<div class="zhimaIDcard-wrap-border">
					<div class="zhimaIDcard-wrap bg-cover" :style="{'background-image':'url('+(cardBackUrl?cardBackUrl:'')+')'}" >
						<p class="zhimaIDcard-portrait zhimaIDcard-national-emblem bg-contain" v-if = "nationalEmblemFlag"></p>
						<input id="image2" type="file" class="file" @change="chooseImage(2,$event)"/>
						<label for="image2" class="label"></label>
						<span v-if="cardBackUrl && !askData.cardBackUrl" class="cover"></span>
					</div>
				</div>
			</div>
			<div class="zhimaIDcard-card-title">
				<p v-if="portraitFlag" class="font-green">人像面</p>

				<div class="chaneg-img" v-else>
					<input id="image1" type="file" class="file" @change="chooseImage(1,$event)"/>
					<p class="chang-one font-12 font-white"><span class="upload"> <img src="~@assets/img/self/zhima-upload.png" />  </span>换一张</p>
				</div>
				<p v-if="nationalEmblemFlag" class="font-green">国徽面</p>

				<div class="chaneg-img" v-else>
					<input id="image2" type="file" class="file"  @change="chooseImage(2,$event)"/>
					<p class="chang-one font-12 font-white"><span class="upload"> <img src="~@assets/img/self/zhima-upload.png" />  </span>换一张</p>

				</div>
			</div>
		</div>
		<p style="background: #FAFAFA;height: 0.4rem;"></p>
		<div class="zhimaIDcard-upload">
			<P class="font-darkGray font-14 zhimaIDcard-explain-title zhimaIDcard-explain">认证成功后即可享受</P>
			<p class="font-12 font-lightGray zhimaIDcard-explain">短租产品：通过身份证信息认证后能提高免押额度；</p>
			<p class="font-12 font-lightGray zhimaIDcard-explain">长租产品：通过身份证信息认证后才可享受免押资格。</p>
		</div>
		<div class="zhima-accredit-card font-14 font-white  text-center" @click="submitForm">
			<p class="public-arrow-right">
				提交认证
			</p>
		</div>

		<!--<div class="public-popup-shadow">
			<div class="zhimaIDcard-popup">
				<p class="zhimaIDcard-popup-img"></p>
				<p class="zhimaIDcard-popup-title font-16 font-darkGray">恭喜！额度提升了¥</p>
				<p class="zhimaIDcard-popup-price"><span class="font-18">￥</span>7600？</p>
				<p class="font-3ED8C4 font-16">当前芝麻信用总额</p>
				<p class="zhimaIDcard-know">
					我知道了
				</p>
			</div>
		</div>-->
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
import { getObjectURL, getBase64Image } from '@assets/js/mUtils';

export default {
	data () {
  		return {
  			askData:{
        		cardFrontUrl:'',
        		cardBackUrl:'',
        		checkFlag:'Y'
        	},
        	cardFrontUrl:'',
        	cardBackUrl:'',
        	loadingFlag:false,
        	portraitFlag: true, // 人像
        	nationalEmblemFlag: true // 国徽面
  		}
  	},
  	mounted(){
  		var that = this;
  		setBodyColor(true);
		localStorage.setItem("totalDeposit", that.$route.query.totalDeposit)
    		network(CONFIG.uploadToken, {}).then((res) => {
	    	if(res.head.code == 0){
	    		that.uploadToken = res.details;
		    };
	    });
  	},
  	methods: {
  		goBack(){
  			history.go(-1)
  		},
  		chooseImage(index,e){
    		var that = this;
    		if(index == 1){
    			that.portraitFlag = false
    			that.cardFrontUrl=getObjectURL(e.target.files[0]);
    			that.askData.cardFrontUrl = "";
    			var image1 = new Image();
			    image1.src = that.cardFrontUrl;
			    image1.onload = function() {
			    	var imgData = getBase64Image(image1);
			    	that.putb64(imgData.replace("data:image/png;base64,", ""),1);
			    };
    		}else{
    			that.nationalEmblemFlag = false
    			that.cardBackUrl=getObjectURL(e.target.files[0]);
    			that.askData.cardBackUrl = ""
    			var image2 = new Image();
		    	image2.src = that.cardBackUrl;
			    image2.onload = function() {
			    	var imgData = getBase64Image(image2);
			    	that.putb64(imgData.replace("data:image/png;base64,", ""),2);
			    };
    		}
    	},
    	putb64(imgData,index){
        	var that = this;
		    var pic = imgData;
		    var url = CONFIG.uploadFileUrlBase64;
		    var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange=function(){
			    if (xhr.readyState==4){
			    	var _data = JSON.parse(xhr.responseText);
			    	if(index == 1){
			    		that.askData.cardFrontUrl = CONFIG.imageHost+_data.key
			    	}else if(index == 2){
			    		that.askData.cardBackUrl = CONFIG.imageHost+_data.key
			    	}

		    	}
		    };
		    xhr.open("POST", url, true);
		    xhr.setRequestHeader("Content-Type", "application/octet-stream");
		    xhr.setRequestHeader("Authorization", "UpToken "+that.uploadToken);
		    xhr.send(pic);
		},
		submitForm(){
			var that = this
	        if(!that.cardFrontUrl){
	        	Vue.toast('请上传人像面',{duration:1500})
		    	return false;
		    };
		    if(!that.cardBackUrl){
		    	Vue.toast('请上传国徽面',{duration:1500})
		    	return false;
		    };
		    if(!that.askData.cardFrontUrl || !that.askData.cardBackUrl){
		    	Vue.toast('图片正在上传请稍等',{duration:1500})
		    	return false;
		    };
		    network(CONFIG.authOcridcard, that.askData, {codeFlag: true}).then((res) => {
		    	if (res.head.code == 0) {
		    		Vue.toast('身份证验证成功',{duration:1500})
					that.goBack()
		    	}else {
		    		Vue.toast(res.head.message,{duration:1500});
		    	}
		    })
		}
  	},
	destroyed(){
		setBodyColor();
	}
}
</script>

<style>
.zhima-card {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.zhima-card .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.zhimaIDcard-upload {
	width: 17rem;
	margin: 0 auto;
	padding: 1rem 0 1.7rem;
}
.zhimaIDcard-upload .zhimaIDcard-explain {
	line-height: 1.1rem;
}
.zhimaIDcard-upload .zhimaIDcard-explain-title:before {
	content:'';
	width: 0.2rem;
	height: 0.2rem;
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-block;
	margin-right: 0.4rem;
}

.zhimaIDcard .title{
	padding-top: 0.75rem;
}
.zhimaIDcard .image1{
	width: 10.6rem;
	height: 10.4rem;
	margin: 2.15rem auto 1.5rem auto;
}
.zhimaIDcard .tip-item{
	padding-left: 1.35rem;
	padding-bottom: 0.4rem;
}
.zhimaIDcard .tip-item .icon{
	width: 0.7rem;
	height: 0.7rem;
	text-align: center;
	line-height: 0.7rem;
	margin-right: 0.5rem;
	border-radius: 100%;
}
.zhimaIDcard .image-tip-wrap{
	margin-top: 0.6rem;
	padding-bottom: 1rem;
}
.zhimaIDcard .image-tip-wrap .item{
	margin: 0 0.85rem;
}
.zhimaIDcard .image-tip-wrap img{
	display: block;
	margin-bottom: 0.2rem;
	width: 3.95rem;
	height: 3.6rem;
}
.zhimaIDcard-card {
	display: flex;
	justify-content: space-around;
}
.zhimaIDcard .zhimaIDcard-wrap-border{
	/*padding: 0.3rem;*/
	width: 8rem;
	border: 1px dashed #3ED8C4;
	border-radius: 0.4rem;
	margin: 0 auto;
	margin-top: 0.75rem;
}
.zhimaIDcard-card-title {

	display: flex;
	justify-content:space-around;
	margin-top: 0.7rem;
}
.zhimaIDcard-card-title  p {
	text-align: center;
	width: 8rem;
}
.zhimaIDcard .zhimaIDcard-wrap{
	width: 100%;
	position: relative;
	display: block;
	height:5.0rem;
	background: RGBA(62, 216, 196, 0.04);
	border-radius: 0.3rem;
	overflow: hidden;
	 background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
.zhimaIDcard .zhimaIDcard-wrap .file{
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.01;
}
.zhimaIDcard-card-title .file {
	opacity: 0.01;
	display: block;
	width: 3.6rem;
	height: 1.6rem;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
}
.zhimaIDcard-card-title  .chaneg-img {
	width: 3.6rem;
	height: 1.6rem;
	border-radius: 0.9rem;
	position: relative;
}
.zhimaIDcard-card-title .chang-one {
	width: 3.6rem;
	height: 1.6rem;
	line-height: 1.6rem;
	background: #BBBBBB;
	border-radius: 0.9rem;


}
.zhimaIDcard-card-title .chang-one .upload {
	display: inline-block;
	height: 0.6rem;
	width: 0.6rem;
	line-height: 0.6rem;
	margin-right: 0.2rem;
}
.zhimaIDcard-card-title .chang-one .upload img{
	width: 100%;
	display: inline-block;
	vertical-align: middle;
	/*padding-top: 0.5rem;*/

}
.zhimaIDcard .zhimaIDcard-wrap .label{
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
}
.zhimaIDcard .zhimaIDcard-wrap .cover{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0.7;
	background: #FFFFFF;
}
.zhimaIDcard .zhimaIDcard-portrait {
	width: 2.2rem;
	height: 2.2rem;
	background-image: url(~@assets/img/self/zhima-portrait.png);
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.zhimaIDcard .zhimaIDcard-national-emblem {
	background-image: url(~@assets/img/self/zhima-national-emblem.png);
}
.zhimaIDcard .zhima-accredit-card {
	display: block;
	background: #3ED8C4;
	width: 12.5rem;
	height: 2.2rem;
	line-height: 2.2rem;
	border-radius: 1.5rem;
	position: fixed;
	bottom: 1.3rem;
	left: 50%;
	transform: translateX(-50%);
}
.zhima-accredit-card p {
	width: 3.3rem;
	margin: 0 auto;
}
.zhima-accredit-card .public-arrow-right {
	background-image: url(~@/assets/img/self/arrows2.png);
}
.zhimaIDcard-popup {
	width: 15rem;
	height: 19.5rem;
	background: #fff;
	text-align: center;
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.zhimaIDcard-popup-img {
	margin: 1.5rem auto 1rem;
	background: #F6F6F6;
	width: 4.5rem;
	height: 4.5rem;
	border-radius: 50%;
}
.zhimaIDcard-popup-price {
	font-size: 2.5rem;
	color: #3ED8C4;
	position: relative;
}
/*.zhimaIDcard-popup-price span{
	position: absolute;
	left: 0;
	top: 0;
}*/
.zhimaIDcard-know {
	margin: 0 auto;
	margin-top: 2.7rem;
	background: #3ED8C4;
	color: #fff;
	width: 11.5rem;
	height: 2.2rem;
	text-align: center;
	line-height: 2.2rem;
}
</style>
