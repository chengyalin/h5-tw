<template>
	<transition name = "anim-up">
	    <div class="public-popup public-popup-iframe fixed top right bottom left bg-white" v-if = "popupIframeFlag">
	        <span class="close-btn absolute" @click="iframeToggle"></span>
	        <div class="container height-full border-box">
		        	<div class="content width-full height-full">
		        		<iframe :src="popupIframeUrl" width="100%" height="100%"></iframe>
		        	</div>
	        </div>
	    </div>
	</transition>
</template>

<script>
  export default {
  	data() {
  		return {
  		}
  	},
  	props:['popupIframeFlag','popupIframeUrl'],
  	methods:{
  		iframeToggle(){
			var that = this;
           	that.$emit('iframeToggle');
		},
  	}
  }
</script>

<style>
.public-popup-iframe .close-btn{
	width: 1rem;
	height: 1rem;
	left: 0.5rem;
	top: 0.5rem;
	background:#999 url(~@assets/img/close-white.svg) no-repeat center;
	background-size:70% ;
}
.public-popup-iframe .container{
	padding-top: 2rem;
}
.public-popup-iframe .content{
	-webkit-overflow-scrolling: touch;
 	overflow-y: scroll;
 	overflow-x: hidden;
}
</style>