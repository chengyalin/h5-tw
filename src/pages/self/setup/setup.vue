<template>
	<div class="setup">
		<div class="back">
			<p class="font-26 font-darkGray">设置</p>
		</div>
		<div class="setup-all">
			<ul>
				<li class="public-arrow-right">
					<router-link class="goTo" to="/self/personalInfo">
						个人资料
					</router-link>
					<span class="line-normal"></span>
				</li>
				<li class="public-arrow-right">
					<router-link  class="goTo" to="/self/address">
						收货地址
					</router-link>
					<span class="line-normal"></span>
				</li>
				<!--<li class="public-arrow-right arrow-right">
					<router-link  class="goTo" to="">
						<p style="height: 1.2rem;"></p>
						账号绑定
					</router-link>
					<span class="line-normal"></span>
				</li>-->
				<li class="public-arrow-right">
					<router-link  class="goTo" to="/self/passwordEdit">
						重置密码
					</router-link>
					<span class="line-normal"></span>
				</li>
				<!--<li class="setup-on-off">
					<p style="height: 1.2rem;"></p>
					<div>
						<p>通知设置</p>
						<img @click="setupOpen = !setupOpen" v-if="setupOpen" class="setup-img" src="~@/assets/img/self/open.png" />
						<img @click="setupOpen = !setupOpen" v-else class="setup-img" src="~@/assets/img/self/close.png" />
					</div>

					<span class="line-normal"></span>
				</li>-->
				<!--<li class="public-arrow-right">
					<router-link  class="goTo" to="">
						给探物评分
					</router-link>
				</li>-->
				<!--<li class="public-arrow-right">
					<router-link to="">
						清理缓存
					</router-link>
				</li>-->
			</ul>
		</div>
		<p class="logOff" @click="logOff">退出登录</p>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';

export default {
	data () {
  		return {
  			setupOpen: true
  		}
  	},
  	mounted(){
  		setBodyColor(true);
  	},
  	methods: {
  		logOff(){
  			var that = this
  			network(CONFIG.logout, {}).then((res) => {
  				if(res.head.code == 0){
  					localStorage.clear();
					that.goBack();
  				}
  			})
  		}
  	},
  	destroyed(){
		setBodyColor();
	},
	components: {
	}
}
</script>

<style>

.setup .back {
	width: 17rem;
	height: 4.2rem;
	line-height: 4.2rem;
	margin: 0 auto;
}
.setup .goBack {
	display: inline-block;
	width: 0.5rem;
	height: 0.8rem;
	margin-top: 0.8rem;
	/*background-image: url(~@assets/img/arrow-left-black.png);*/
}
.setup .setup-all {
	font-size: 0.7rem;
	color: #333;
	padding: 0 0.9rem;
	margin: 0 auto;
}
.setup .setup-all li {
	width: 100%;
	line-height: 2.6rem;
}
.setup .setup-all li .goTo {
	display: inline-block;
	width: 100%;
}
.setup .arrow-right {
	background-position:right 2.3rem;
}
.setup .logOff {
	border: 1px solid #36646E;
	width: 8.3rem;
	height: 2.2rem;
	margin: 0 auto;
	text-align: center;
	line-height: 2.2rem;
	color: #36646E;
	margin-top: 2.2rem;
}
.setup .setup-img {
	width: 2.2rem;
	height: 1.3rem;

}
.setup .setup-all .setup-on-off div{
	display: flex;
	height: 2.2rem;
	align-items: center;
	justify-content: space-between;
}
</style>
