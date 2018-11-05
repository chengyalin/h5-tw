<template>
	<div class="zhimaRule">
		<div class="zhimaRule-header relative font-white">
			<p class="title text-center font-26">芝麻信用免押金租赁规则</p>
		</div>
		<ul class="zhimaRule-list">
			<li class="zhimaRule-item">
				<p class="title font-18 font-bold font-black">什么是芝麻分？</p>
				<p class="words font-14 font-yellow">
					芝麻分是芝麻信用管理有限公司旗下的产品（支付宝中可查看），根据当前采集的个人用户信息进行加工、整理、计算后得出的信用评分，分值范围是350-950，分值越高代表信用水平越好，较高的芝麻分可以帮助个人获得更高效、更优质的服务。
				</p>
			</li>
			<li class="zhimaRule-item">
				<p class="title font-18 font-bold font-black">怎样获取押金减免资格？</p>
				<div class="words font-14 font-4A4A4A">
					在探物<span class="font-green">授权芝麻信用</span>的用户且芝麻分在650分及以上，即获得减免押金资格。
				</div>
				<div class="words font-14 font-4A4A4A">
					另外，通过<span class="font-green">人脸识别</span>、<span class="font-green">提交身份证</span>完整认证的用户可以增加押金减免额度。
				</div>
				<img class="image" src="~@assets/img/self/zhimaRule-01.png"/>
			</li>
			<li class="zhimaRule-item">
				<p class="title font-18 font-bold font-black">短租产品免押</p>
				<p class="words font-14 font-yellow">芝麻分达到650分及以上的用户能够减免押金，完成人脸识别和提交身份证认证能够提高减免额度。</p>
				<p class="words font-14 font-4A4A4A">下单时系统会自动根据芝麻分的高低按比例减免押金。</p>
				<img class="image" src="~@assets/img/self/zhimaRule-02.png"/>
				<p class="text-center" style="color: #052C3C;margin-top: 0.7rem;">押金只需1200元，立减4800元！</p>
			</li>
			<li class="zhimaRule-item">
				<p class="title font-18 font-bold font-black">长租产品免押</p>
				<p class="words font-14 font-yellow">只有通过完整三项认证的用户才有机会下单租赁长租产品。</p>
				<div class="words font-14 font-4A4A4A">
					认证一：授权芝麻信用且分数在650及以上；<br />
					认证二：通过人脸识别；<br />
					认证三：提交身份证照片。
				</div>
				<img class="image" src="~@assets/img/self/zhimaRule-03.png"/>
			</li>
		</ul>
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
/*zhimaRule start*/
.zhimaRule-header{
	height: 7.4rem;
	/*background: -webkit-linear-gradient(134deg, #5A49FF 0%, #53A0FD 38%, #3CEFC1 100%);
    background: -o-linear-gradient(134deg, #5A49FF 0%, #53A0FD 38%, #3CEFC1 100%);
    background: -moz-linear-gradient(134deg, #5A49FF 0%, #53A0FD 38%, #3CEFC1 100%);
    background: linear-gradient(134deg, #5A49FF 0%, #53A0FD 38%, #3CEFC1 100%);*/
    background: #3ED8C4;
    overflow: hidden;
}
.zhimaRule-header:after{
	content: "";
	position: absolute;
	width: 400%;
	height: 60rem;
	border-radius: 100%;
	background: white;
	bottom: -58rem;
	left: 50%;
	transform: translate(-50%,0);
}
.zhimaRule-header .backBtn{
	position: absolute;
	width: 2rem;
	height: 2rem;
	text-align: center;
	line-height: 2rem;
	right: 0;
	top: 0;
}
.zhimaRule-header .title{
	padding-top:1.5rem;
	font-size: 1.4rem;
}
.zhimaRule-list{
	padding: 0.8rem 1.4rem 0 1.4rem;
}
.zhimaRule-list .zhimaRule-item{
	padding-bottom: 2rem;
}
.zhimaRule-list .title{
	position: relative;
	margin-bottom: 1.2rem;
	padding-left: 0.8rem;
}
.zhimaRule-list .title:before{
	content: "";
	position: absolute;
	width: 0.2rem;
	height: 0.2rem;
	left: 0;
	top: 50%;
	margin-top: -0.2rem;
	border-radius: 100%;
	border: 1px solid #3ED8C4;
}
.zhimaRule-list .words{
	line-height: 1.1rem;
	letter-spacing: 0.015rem;
	margin-bottom: 1.5rem;
}
.zhimaRule-list .words.font-yellow{
	margin-bottom: 1rem;
}
.zhimaRule-list .image{
	display: block;
	width: 12.25rem;
	margin: 0 auto;
}
/*zhimaRule end*/
/*zhimaFace start*/
.zhimaFace-page .title{
	padding-top: 0.75rem;
}
.zhimaFace-page .image1{
	width: 10.6rem;
	height: 10.4rem;
	margin: 2.15rem auto 1.5rem auto;
}
.zhimaFace-page .tip-item{
	padding-left: 1.35rem;
	padding-bottom: 0.4rem;
}
.zhimaFace-page .tip-item .icon{
	width: 0.7rem;
	height: 0.7rem;
	text-align: center;
	line-height: 0.7rem;
	margin-right: 0.5rem;
	border-radius: 100%;
}
.zhimaFace-page .image-tip-wrap{
	margin-top: 0.6rem;
	padding-bottom: 1rem;
}
.zhimaFace-page .image-tip-wrap .item{
	margin: 0 0.85rem;
}
.zhimaFace-page .image-tip-wrap img{
	display: block;
	margin-bottom: 0.2rem;
	width: 3.95rem;
	height: 3.6rem;
}
.zhimaFace-page .zhimaIDcard-wrap-border{
	padding: 0.3rem;
	width: 14rem;
	border: 1px dashed #979797;
	border-radius: 0.4rem;
	margin: 0 auto;
	margin-top: 0.75rem;
}
.zhimaFace-page .zhimaIDcard-wrap{
	position: relative;
	display: block;
	height:8.4rem;
	border-radius: 0.3rem;
	border: 1px solid #979797;
	overflow: hidden;
}
.zhimaFace-page .zhimaIDcard-wrap .file{
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.01;
}
.zhimaFace-page .zhimaIDcard-wrap .label{
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
}
.zhimaFace-page .zhimaIDcard-wrap .cover{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0.7;
	background: #FFFFFF;
}
/*zhimaFace end*/
</style>
