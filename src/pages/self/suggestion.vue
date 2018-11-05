<template>
	<div class="suggestion">
		<div class="content font-14">
			<textarea placeholder="如果你对探物还不够满意，与其扔砖给差评，不如成为我们的军师哈～" v-model="askData.content" maxlength="500"></textarea>
		</div>
		<div class="bg-blue font-white text-center font-14 submit" @click="submit">提交</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';

export default {
	data () {
  		return {
  			askData: {
  				content: '',
  				feedType: 0,
  				clientType:'h5'
  			}
  		}
  	},
  	mounted(){
  		var that = this
  		
  	},
  	methods: {
  		submit(){
  			var that = this 
	  		if (that.askData.content == 0) {
	  			Vue.toast('请填写反馈意见',{duration:1500})
	  			return false
	  		}
	  		network(CONFIG.feedbackOpinion, that.askData).then((res) => {
	  			if (res.head.code == 0) {
	  				Vue.toast('提交成功',{duration:1500})
	  				setTimeout(() => {
						history.go(-1);
					},1000)
	  			} else {
	  				Vue.toast(res.head.message,{duration:1500})
	  			}
	  		})
  		}
  	},
	components: {
	}
}
</script>

<style>
.suggestion .content {
	padding: 0.9rem;
	background: #fff;
	height: 8.5rem;
}
.suggestion textarea{
	border: none;
	width: 100%;
}
.suggestion .submit {
	height: 2.2rem;
	line-height: 2.2rem;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
