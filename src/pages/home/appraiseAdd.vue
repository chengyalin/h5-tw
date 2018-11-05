<template>
	<div v-cloak class="appraiseAdd-page has-footer has-footer-iphoneX">
		<div class="public-padding-v bg-white relative">
			<div class="product-part display-flex-between">
				<span class="image bg-cover bg-buffer block" :style="{'background-image':'url('+mainData.image_src+')'}"></span>
				<div v-if="mainData.productName" class="content">
					<p class="name font-darkGray font-bold line-ellipsis">{{mainData.productName}}</p>
					<div class="star-wrap">
						<div class="vertical-middle font-blue font-12 font-bold">
							好评 {{mainData.praiseRate}}%
						</div>
						<span class="point vertical-middle"></span>
						<div class="star-list vertical-middle font-12 font-lightGray">
							<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
			                    <span v-if="mainData.appraiseAvgScore >= starItem" class="star"></span>
			                    <span v-else-if="mainData.appraiseAvgScore < starItem && (mainData.appraiseAvgScore*1+1) > starItem" class="star" :style = "{'width':mainData.appraiseAvgScore%1*100+'%'}"></span>
			                </div>
			                <span class="vertical-middle">{{mainData.appraiseAvgScore}}</span>
						</div>
					</div>
				</div>
			</div>
			<textarea class="input" placeholder="体验过程满意吗？记录你的使用心得，让更多和你有相同兴趣的用户了解它吧!" maxlength="500" v-model="askData.detail"></textarea>
			<div class="upload-image-list">
				<div class="item upload-image-item bg-buffer bg-contain vertical-middle relative" v-for="(item,index) in imageList" :style="{'background-image':'url('+item.imageUrl+')'}">
					<span v-if="item.loading" class="cover absolute left bottom right top"></span>
					<span v-else class="delete-btn absolute right top" @click="deleteImage(index)"></span>
				</div><label v-if = "imageList.length < 9" for="image" class="item upload-image-btn vertical-middle border-box relative"></label>
			</div>
			<input type="file" class="image-file" id="image" multiple="multiple" @change="chooseImage"/>
		</div>
		<div class="score-part public-padding-v bg-white">
			<p class="font-bold">产品评分</p>
			<ul class="star-list">
				<li v-for="(item,index) in scoreType">
					<span class="title vertical-middle font-grey">{{item}}</span>
					<span class="star vertical-middle bg-contain" :class="{active:cItem <= score[index]}" v-for="cItem in 5" @click="select(index,cItem)"></span>
					<span v-if="score[index] > 0" class="font-lightGray font-12">{{score[index]}}分</span>
				</li>
			</ul>
		</div>
		<p class="tip text-right">
			<span class="font-green font-12" @click="tipFlag = true">什么是有效口碑？</span>
		</p>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white">
			<span class="bg-blue text-center font-white  public-lineheight block"@click="submit">完成</span>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="tipFlag">
				<div class="public-popup-shadow"></div>
				<div class="public-popup-center bg-white relative absolute center">
					<p class="public-popup-center-title text-center font-20 font-bold">
						有效口碑
					</p>
					<div class="public-popup-center-content">
						<ul class="public-popup-center-list">
							<li v-for="(item,index) in tips" class="relative">{{item}}</li>
						</ul>
					</div>
					<div class="btn font-16 font-blue text-center public-lineheight"  @click="tipFlag = false">我知道了</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { getObjectURL, getBase64Image } from '@assets/js/mUtils';
export default {
	data () {
  		return {
  			askData:{
  				detail:'',
  			},
  			tips:['从对产品真实体会的角度，用客观公正的态度去描述你的想法','我们希望你不要参杂个人情感对某品牌的恶意诋毁','用你的切身体会帮助更多用户了解产品，分享你的使用心得','发布的产品图片必须是个人拍摄，盗图内容无效'],
			scoreType:['外观造型','实用程度','描述相符'],
			score:[0,0,0],
			scoreFlag:false,
			tipFlag:false,
			imageList:[],
			mainData:{}
	  	}
  	},
  	mounted(){
		var that = this;
		that.askData.product_id = that.$route.query.productId;
		if (that.$route.query.orderNumber) {
			that.askData.order_number =  that.$route.query.orderNumber
		}
		that.getData();
	},
	methods:{
		getData(){
			var that = this;
            network(CONFIG.productBrief,that.askData).then((res) => {
				var details = res.details;
				that.mainData = details;
			});
		},
		select(index,score){
			var that = this;
			that.score.splice(index, 1, score);
			that.scoreFlag = that.score.indexOf(0) < 0
		},
		chooseImage(e){
			var that = this;
			var length = that.imageList.length;
        		var getLength = e.target.files.length;
        		if(getLength +length > 9){
        			Vue.toast('口碑最多能上传9张图片',{duration:1500});
        			return false;
        		}
        		if(that.uploadToken){
        			for(let i = 0;i< getLength ;i++){
	        			(function(i){
	        				var src = getObjectURL(e.target.files[i]);
	            			that.imageList.splice(length+i,1,{imageUrl:src,loading:true});
		            		var image = new Image();
					    image.src = src;
					    image.onload = function(){
					    		var imgData = getBase64Image(image);
						    	that.putb64(imgData.replace("data:image/png;base64,",""),length+i,image.width,image.height);
					    };
	        			})(i);
	        		}
        		}else{
        			network(CONFIG.uploadToken).then((res) => {
        				that.uploadToken = res.details;
					for(let i = 0;i< getLength ;i++){
		        			(function(i){
		        				var src = getObjectURL(e.target.files[i]);
		            			that.imageList.splice(length+i,1,{imageUrl:src,loading:true});
			            		var image = new Image();
						    image.src = src;
						    image.onload = function(){
						    		var imgData = getBase64Image(image);
							    	that.putb64(imgData.replace("data:image/png;base64,",""),length+i,image.width,image.height);
						    };
		        			})(i);
		        		}
				});
        		}
		},
		putb64(imgData,index,width,height){
        		var that = this;
		    var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange=function(){
			    if (xhr.readyState==4){ 
				    	var _data = JSON.parse(xhr.responseText);
				    	that.imageList.splice(index,1,{imageUrl:CONFIG.imageHost+_data.key})
			    	}
		    };
		    xhr.open("POST", CONFIG.uploadFileUrlBase64, true);
		    xhr.setRequestHeader("Content-Type", "application/octet-stream");
		    xhr.setRequestHeader("Authorization", "UpToken "+that.uploadToken);
		    xhr.send(imgData);
		},
		deleteImage(index){
			var that = this;	
			that.imageList.splice(index,1);
		},
		submit(){
			var that = this;
			if(!that.askData.detail.trim()){
				Vue.toast('请为产品评论',{duration:1500});
				return false
			}
			if(!that.scoreFlag){
				Vue.toast('请为产品评分',{duration:1500});
				return false
			}
			that.askData.detail = that.askData.detail.trim();
			that.askData.first_Score = that.score[0];
		    that.askData.second_Score = that.score[1];
		    that.askData.third_Score = that.score[2];
		    var flag = false,arr = [];
		    for(var i = 0;i<that.imageList.length;i++){
			    	if(that.imageList[i].loading){
			    		flag = true;
			    		break;
			    	}else{
			    		arr.push(that.imageList[i].imageUrl)
			    	}
		    };
		    if(flag){
		   	 	Vue.toast('图片正在上传请稍等',{duration:1500});
			    	return false;
		    };
		    that.askData.image_list_src = 	arr.length?arr.join(","):'';
		    Indicator.open();
		    network(that.askData.order_number?CONFIG.orderAppraiseSave:CONFIG.productAppraiseSave,that.askData).then((res) => {
				Indicator.close();
				var query = {};
				if(that.askData.order_number){
					query.orderNumber = that.askData.order_number;
					query.appraiseId = res.result.appraiseId;
				}
				that.$router.replace({path: '/appraiseSuccess',query: query});
			});
		}
	}
}
</script>

<style>
.appraiseAdd-page .product-part{
	padding-top: 0.8rem;
	padding-bottom: 1rem;
}
.appraiseAdd-page .product-part .image{
	width: 2.6rem;
	height: 2.6rem;
}
.appraiseAdd-page .product-part .content{
	width: 13.7rem;
}
.appraiseAdd-page .product-part .content .name{
	margin-bottom: 0.3rem;
	line-height: 1.3;
}
.appraiseAdd-page .star-wrap .point{
	margin: 0 0.1rem;
}
.appraiseAdd-page .input{
	width: 100%;
	height: 5.4rem;
	border: none;
	outline: none;
}
.appraiseAdd-page .input::-webkit-input-placeholder{
    color:#BBBBBB;
}
.appraiseAdd-page .input:focus{
	border: none;
	outline: none;
}
.appraiseAdd-page .upload-image-list{
	padding: 0.8rem 0 0.5rem 0;
}
.appraiseAdd-page .item{
	width: 4rem;
	height: 4rem;
	margin-right: 0.3rem;
	margin-bottom: 0.3rem;
	border-radius: 0.1rem;
}
.appraiseAdd-page .item:nth-child(4n){
	margin-right: 0;
}
.appraiseAdd-page .item .cover{
	background: rgba(255,255,255,0.7);
}
.appraiseAdd-page .item .delete-btn{
	width: 0.7rem;
	height: 0.7rem;
	background: rgba(0,0,0,0.2) url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.4rem ;
}
.appraiseAdd-page .upload-image-btn{
	border: 0.05rem solid #DDDDDD;
}
.appraiseAdd-page .upload-image-btn:before,
.appraiseAdd-page .upload-image-btn:after{
	content: "";
	position: absolute;
	background: #DDDDDD;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	-webkit-transform: translate(-50%,-50%);
	width: 1rem;
	height: 0.05rem;
}
.appraiseAdd-page .upload-image-btn:after{
	height: 1rem;
	width: 0.05rem;
}
.appraiseAdd-page .image-file{
	position: absolute;
	bottom: 0;
	height: 1px;
	opacity: 0.01;
}
.appraiseAdd-page .score-part{
	margin-top: 0.4rem;
	margin-bottom: 0.3rem;
	padding-top: 0.8rem;
	padding-bottom: 1.3rem;
}
.appraiseAdd-page .score-part .star-list li{
	margin-top: 0.7rem;
	line-height: 0.8rem;
}
.appraiseAdd-page .score-part .star-list .title{
	margin-right: 0.9rem;
}
.appraiseAdd-page .score-part .star-list .star{
	width: 0.8rem;
	height: 0.8rem;
	margin-right: 0.5rem;
	background-image: url(~@assets/img/star-darkGrey.png);
}
.appraiseAdd-page .score-part .star-list .star:before{
	content: "";
	display: block;
	width: 100%;
	height: 100%;
	background: url(~@assets/img/star-yellow.png) no-repeat center;
	background-size:contain ;
	opacity: 0.01;
}
.appraiseAdd-page .score-part .star-list .star.active{
	background: none;
}
.appraiseAdd-page .score-part .star-list .star.active:before{
	opacity: 1;
}
.appraiseAdd-page .tip{
	margin-right: 0.6rem;
}
</style>