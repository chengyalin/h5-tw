<template>
	<footer class="footer-nav text-center bg-white font-grey fixd-center iphoneX-footer">
		<router-link to="/home" tag = "span" class="footer-item">
			<span class="footer-item-icon bg-contain footer-item-icon-home"></span>
			首页
		</router-link>
		<router-link to="/discover" tag = "span" class="footer-item">
			<span class="footer-item-icon bg-contain footer-item-icon-discover"></span>
			发现
		</router-link>
		<router-link to="/message" tag = "span" class="footer-item">
			<span class="footer-item-icon bg-contain footer-item-icon-message"></span>
			消息
		</router-link>
		<!--
		<div @click="message" class="footer-item" :class="{'router-link-active': messageFalg}">
			<span class="footer-item-icon bg-contain footer-item-icon-message"></span>
			消息
		</div>
		-->
		<router-link to="/self" tag = "span" class="footer-item">
			<span class="footer-item-icon bg-contain footer-item-icon-self"></span>
			我的
		</router-link>
    </footer>
</template>

<script>
  export default {
  	data() {
  		return {
  			messageFalg: false
  		}
  	},
  	mounted() {
  	},
  	methods: {
  		message(){
  			var that = this
  			if(!that.goLogin()){
				return false;
			} else {
				that.messageFalg = true
				that.$router.push('/message')
			}
  		}
  	}
  }
</script>
<style>
	.footer-item.router-link-active{
		color: #36646E;
	}
	.footer-item .footer-item-icon-home{
		background-image: url(~@assets/img/tab_home.png);
	}
	.footer-item.router-link-active .footer-item-icon-home{
		background-image: url(~@assets/img/tab_home_selected.png);
	}
	.footer-item .footer-item-icon-discover{
		background-image: url(~@assets/img/tab_discover.png);
	}
	.footer-item.router-link-active .footer-item-icon-discover{
		background-image: url(~@assets/img/tab_discover_selected.png);
	}
	.footer-item .footer-item-icon-message{
		background-image: url(~@assets/img/tab_message.png);
	}
	.footer-item.router-link-active .footer-item-icon-message{
		background-image: url(~@assets/img/tab_message_selected.png);
	}
	.footer-item .footer-item-icon-self{
		background-image: url(~@assets/img/tab_me.png);
	}
	.footer-item.router-link-active .footer-item-icon-self{
		background-image: url(~@assets/img/tab_me_selected.png);
	}
</style>
