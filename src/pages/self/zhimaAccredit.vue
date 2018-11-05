<template>
	<div class="zhimaAccredit">
		<div>
			<p class="font-26 font-darkGray text-center accredit-title">授权芝麻信用</p>
			<p class="font-grey font-14 text-center">授权芝麻信用后，你在体验产品时 </p>
			<p class="font-grey font-14 text-center">可根据芝麻信用分数等级减免产品押金。</p>
		</div>
		<p class="accredit-img bg-cover"></p>
		<div class="go-accredit font-14 font-white"><router-link tag = "p" replace to="/zhima" class="public-arrow-right">去授权</router-link></div>
		<p @click="goBack" class="font-12 font-grey text-center block">跳过授权</p>
		<div class="font-12 font-lightGray privacy block text-center"><span class="inline-block bg-cover privacy-img"></span> 仅用于你本人申请额度, 隐私信息严格保密</div>
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
  		setBodyColor(true);
  	},
	destroyed(){
		setBodyColor();
	},
	components: {
	}
}
</script>

<style>
.zhimaAccredit .accredit-title {
	margin-top: 4.3rem;
	margin-bottom: 0.7rem;
}
.zhimaAccredit .accredit-img {
	width: 13.8rem;
	height: 14.9rem;
	margin: 0.4rem auto 0.7rem;
	background-image:url(~@assets/img/accredit-img.png)
}
.zhimaAccredit .go-accredit {
	width: 12.5rem;
	height: 2.2rem;
	line-height: 2.2rem;
	background: #3ED8C4;
	margin: 0 auto;
	margin-bottom: 0.9rem;
	border-radius: 1.1rem;
}
.zhimaAccredit .go-accredit p {
	margin: 0 auto;
	width: 2.5rem;
}
.zhimaAccredit .go-accredit .public-arrow-right {
	background-image: url(~@assets/img/arrow-right-white.png);
}
.zhimaAccredit .privacy-img {
	width: 0.5rem;
	height: 0.6rem;
	background-image: url(~@assets/img/self/zhimaTick.png)
}
.zhimaAccredit .privacy {
	margin-top: 1.7rem;
}
</style>
