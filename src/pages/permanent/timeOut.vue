<template>
	<div class="noFound-page">
		<div class="noData-wrap center fixed text-center">
			<img class="noData-image" src="~@assets/img/message-null.png"/>
			<p class="font-lightGray">服务器开小差了，再试一次</p>
		</div>
		<div class="fixed btn public-lineheight bg-blue font-white text-center font-bold" @click="goBack"> 刷新一下</div>
	</div>
</template>

<script>
	import { setBodyColor } from '@assets/js/mUtils';
	export default {
	data () {
  		return {
  		}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
	},
	destroyed(){
		var that = this;
		setBodyColor();
	}
}
</script>

<style>
.noFound-page .noData-wrap {
	top: 30%;
}
.noFound-page .btn{
	bottom: 5.5rem;
	left: 5.3rem;
	right: 5.3rem;
}
</style>