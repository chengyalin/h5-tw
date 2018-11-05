<template>
	<div class="serviceRefundExchange">
		<div class="applyCancel-title">
			<p class="go-back bg-contain" @click="goBack"></p>
			<p class="font-16 font-darkGray font-bold">{{title == 1?'退货退款':'退换产品'}}</p>
			<p class="font-blue font-14" @click="chat">客服</p>
		</div>
		<span class="line-normal"></span>
		<p class="reason-content">
			<span class="font-darkGray">{{title == 1?'退货退款原因':'退换产品原因'}}</span><span class="float-right font-grey">{{askData.serviceReason}}</span>
		</p>
		<div class="explain bg-white">
			<textarea class="input" placeholder="退货退款的说明（100字内）" maxlength="100" v-model="askData.reason" v-if="title == 1"></textarea>
			<textarea class="input" placeholder="退换产品的说明（100字内）" maxlength="100" v-model="askData.reason" v-else></textarea>
			<div class="upload-image-list">
				<div class="item upload-image-item bg-buffer bg-contain vertical-middle relative" v-for="(item,index) in imageList" :style="{'background-image':'url('+item.imageUrl+')'}">
					<span v-if="item.loading" class="cover absolute left bottom right top"></span>
					<span v-else class="delete-btn absolute right top" @click="deleteImage(index)"></span>
				</span></div><label v-if = "imageList.length < 3" for="image" class="item upload-image-btn vertical-middle border-box relative"></label>
			</div>
			<input type="file" class="image-file" id="image" multiple="multiple" @change="chooseImage"/>
			<span class="font-12 font-BBB">可上传3张凭证</span>
		</div>
		<div class="bg-blue font-white text-center font-14 netSubmit" @click="submit">提交</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { publicChat , getMapSendDay } from '@assets/js/mUtils';
import { getObjectURL, getBase64Image } from '@assets/js/mUtils';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';


export default {
	data () {
  		return {
  			title: '',
  			askData: {},
  			imageList: []
  		}
  	},
  	mounted(){
  		var that = this 
  		that.title = that.$route.query.title
  		that.askData.orderNumber = that.$route.query.orderNumber
  		that.askData.serviceReason = that.$route.query.serviceReason
  	},
  	methods: {
  		 goBack(){
  			history.go(-1)
  		},
  		chat(){
			var that = this;
			publicChat();
		},
		chooseImage(e){
			var that = this;
			var length = that.imageList.length;
        		var getLength = e.target.files.length;
        		if(getLength +length > 3){
        			//Vue.toast("口碑最多能上传8张图片",{className: ['myToast-warning']});
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
			var that = this 
			if (that.title == 1) {
				that.askData.type = 1
			} else {
				that.askData.type = 2
			}
			if (!that.askData.reason) {
				Vue.toast('请填写说明',{duration:1500})
				return false
			}
			var arrUrl = []
			for(var i = 0;i<that.imageList.length;i++){
				arrUrl.push(that.imageList[i].imageUrl)
		    	if(that.imageList[i].loading){
		    		flag = true;
		    		break;
		    	}
		    };
			that.askData.serviceImage =	that.imageList.length?arrUrl.join(","):'';
			that.askData.reason = that.askData.reason
			network(CONFIG.orderInfoApplyServiceOrRefund, that.askData).then((res) => {
				if (res.head.code == 0) {
					that.$router.replace({path: '/self/serviceSuccess',query: {state:1,refundType:2,orderNumber:that.askData.orderNumber}});
				}
			})
		}
  	},
	components: {
	}
}
</script>

<style>
.serviceRefundExchange .applyCancel-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	background: #fff;
	align-items: center;
	justify-content: space-between;
}
.serviceRefundExchange .applyCancel-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.serviceRefundExchange .reason-content {
	padding: 0 0.9rem;
	height: 2.8rem;
	line-height: 2.8rem;
	background: #fff;
	margin-bottom: 0.4rem;
}
.serviceRefundExchange .explain {
	padding: 0.8rem;
}
.serviceRefundExchange .explain .input {
	border: none;
	width: 100%;
	height: 6rem;
}
.serviceRefundExchange .upload-image-list{
	padding: 0.8rem 0 0.5rem 0;
}
.serviceRefundExchange .item{
	width: 4rem;
	height: 4rem;
	margin-right: 0.3rem;
	margin-bottom: 0.3rem;
}
.serviceRefundExchange .item:nth-child(4n){
	margin-right: 0;
}
.serviceRefundExchange .item .cover{
	background: rgba(255,255,255,0.7);
}
.serviceRefundExchange .item .delete-btn{
	width: 0.7rem;
	height: 0.7rem;
	background: rgba(0,0,0,0.2) url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.4rem ;
}
.serviceRefundExchange .upload-image-btn{
	border: 0.05rem solid #DDDDDD;
}
.serviceRefundExchange .upload-image-btn:before,
.serviceRefundExchange .upload-image-btn:after{
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
.serviceRefundExchange .upload-image-btn:after{
	height: 1rem;
	width: 0.05rem;
}
.serviceRefundExchange .image-file{
	position: absolute;
	bottom: 0;
	height: 1px;
	opacity: 0.01;
}
.serviceRefundExchange .netSubmit {
	height: 2.2rem;
	line-height: 2.2rem;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
