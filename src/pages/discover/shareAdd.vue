<template>
	<div v-cloak class="shareAdd-page has-footer has-footer-iphoneX">
		<div class="shareAdd-header bg-white relative">
			<div class="public-padding-v">
				<textarea class="input" placeholder="晒晒你的科技生活吧！" maxlength="500" v-model="askData.detail"></textarea>
			</div>
			<ul class="tag-list font-12 font-grey public-padding-v">
				<li v-for="(item,index) in tagList" class="inline-block" :class="{active:item == askData.tag}" @click="askData.tag = item">#{{item}}</li>
			</ul>
		</div>
		<div class="public-padding-v">
			<div class="upload-image-list">
				<div class="item upload-image-item bg-buffer bg-contain vertical-middle relative" v-for="(item,index) in imageList" :style="{'background-image':'url('+item.image_src+')'}">
					<span v-if="item.loading" class="cover absolute left bottom right top"></span>
					<span v-else class="delete-btn absolute right top" @click="deleteImage(index)"></span>
				</div><label v-if = "imageList.length < 9" for="image" class="item upload-image-btn vertical-middle border-box relative"></label>
			</div>
			<input type="file" class="image-file" id="image" multiple="multiple" @change="chooseImage"/>
		</div>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white">
			<span class="bg-blue text-center font-white public-lineheight block"  @click="submit">完成</span>
		</div>
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
  				tag:''
  			},
  			tagList:[],
			imageList:[],
	  	}
  	},
  	mounted(){
		var that = this;
		if (that.$route.query.tag) {
			that.askData.tag =  that.$route.query.tag
		}
		that.getData();
	},
	methods:{
		getData(){
			var that = this;
            network(CONFIG.sharesTags,{},{method:'GET'}).then((res) => {
            		that.tagList = res.details;
			});
		},
		chooseImage(e){
			var that = this;
			var length = that.imageList.length;
        		var getLength = e.target.files.length;
        		if(getLength +length > 9){
        			Vue.toast('动态最多能上传9张图片',{duration:1500});
        			return false;
        		}
        		if(that.uploadToken){
        			for(let i = 0;i< getLength ;i++){
	        			(function(i){
	        				var src = getObjectURL(e.target.files[i]);
	            			that.imageList.splice(length+i,1,{image_src:src,loading:true});
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
		            			that.imageList.splice(length+i,1,{image_src:src,loading:true});
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
				    	var image = {
				    		image_src :CONFIG.imageHost+_data.key,
				    		image_width:width,
				    		image_hight:height
				    	};
				    	that.imageList.splice(index,1,image)
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
				Vue.toast('说点什么吧',{duration:1500});
				return false
			}
			that.askData.detail = that.askData.detail.trim();
			if(!that.imageList.length){
				Vue.toast('请选择照片',{duration:1500});
				return false
			}
		    var flag = false;
		    for(var i = 0;i<that.imageList.length;i++){
			    	if(that.imageList[i].loading){
			    		flag = true;
			    		break;
			    	}
		    };
		    if(flag){
		   	 	Vue.toast('图片正在上传请稍等',{duration:1500});
			    	return false;
		    };
		    that.askData.image_src_list = 	that.imageList.length?that.imageList:'';
		    Indicator.open();
		    network(CONFIG.shareInsert,that.askData).then((res) => {
				Indicator.close();
				that.$router.replace({path: '/shareSuccess'});
			});
		}
	}
}
</script>

<style>
.shareAdd-page .shareAdd-header {
	padding-top: 0.6rem;
	padding-bottom: 0.6rem;
}
.shareAdd-page .tag-list{
	padding-top: 1rem;
	overflow-x: auto;
	white-space: nowrap;
}
.shareAdd-page .tag-list li{
	padding: 0.4rem;
	background: #F7F7F7;
	border-radius: 1.6rem;
	margin-right: 0.5rem;
}
.shareAdd-page .tag-list li.active{
	background: #3ED8C4;
	color: #FFFFFF;
	font-weight: bold;
}
.shareAdd-page .input{
	width: 100%;
	height: 6.4rem;
	border: none;
	outline: none;
}
.shareAdd-page .input::-webkit-input-placeholder{
    color:#BBBBBB;
}
.shareAdd-page .input:focus{
	border: none;
	outline: none;
}
.shareAdd-page .upload-image-list{
	padding: 0.8rem 0 0.5rem 0;
}
.shareAdd-page .item{
	width: 4rem;
	height: 4rem;
	margin-right: 0.3rem;
	margin-bottom: 0.3rem;
	border-radius: 0.1rem;
}
.shareAdd-page .item:nth-child(4n){
	margin-right: 0;
}
.shareAdd-page .item .cover{
	background: rgba(255,255,255,0.7);
}
.shareAdd-page .item .delete-btn{
	width: 0.7rem;
	height: 0.7rem;
	background: rgba(0,0,0,0.2) url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.4rem ;
}
.shareAdd-page .upload-image-btn{
	border: 0.05rem solid #DDDDDD;
}
.shareAdd-page .upload-image-btn:before,
.shareAdd-page .upload-image-btn:after{
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
.shareAdd-page .upload-image-btn:after{
	height: 1rem;
	width: 0.05rem;
}
.shareAdd-page .image-file{
	position: absolute;
	bottom: 0;
	height: 1px;
	opacity: 0.01;
}
</style>