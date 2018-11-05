<template>
	<div class="suggestProduct-page bg-white">
		<div class="input-wrap bg-white">
			<textarea class="input" v-model="askData.content" placeholder="请输入产品品牌及型号，还可复制电商平台的链接噢～" maxlength="100"></textarea>
		</div>		
		<div class="fixed left bottom right bg-blue font-white public-lineheight text-center" @click="submit">完成</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
export default {
	data () {
  		return {
			askData:{
            		content:'',
            		feedType:1,
            		clientType:'h5'
            	}
  		}
  	},
  	mounted(){
	},
	methods:{
		submit(){
            	var that = this;
            	if(that.askData.content.trim().length){
            		Indicator.open();
            		network(CONFIG.feedbackOpinion,that.askData).then((res) => {
  					Indicator.close();
  					Vue.toast('谢谢你的建议',{duration:1500});
  					that.$router.back();
				});
            	}else{
            		Vue.toast('建议不能为空',{duration:1500})
            	}
       }
	}
}
</script>

<style>
.suggestProduct-page .input-wrap{
	padding: 0.8rem 0.9rem;
}
.suggestProduct-page .input{
	width: 100%;
	height: 5rem;
	outline: none;
	border: none;
}
.suggestProduct-page .input::-webkit-input-placeholder{
    color: #BBBBBB;
}
.suggestProduct-page .input:focus{
	outline: none;
	border: none;
}
</style>