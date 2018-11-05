<template>
	<div class="zhimaSuccess">
		<div class="zhimaFace-banner-wrap bg-contain">
			<mt-swipe :auto="0">
				<mt-swipe-item>
					<div class="zhimaSuccess-part">
						<!--<img src="~@/assets/img/self/zhimaFace-bg.png" class="image width-full block"/>-->
						<div class="zhima-wrap relative text-center font-white bg-contain">
							<div class="free-price bg-contain">

								<div class="rot">
									<div class="zhimaIDcard-Free-lines">
										<p class="font-12 free-price-title">可用免押额度</p>
										<p class="font-18">￥<span class="limit">{{deposit}}</span> </p>
										<p v-if="totalDeposit" class="font-12">总额￥{{totalDeposit | formatMoney}}</p>
										<!--<p class="time font-10 ">更新时间：{{lastDate | formatTime5}}</p>-->
									</div>

									<div class="canvasstyle">
										<canvas id="canvascircle" style="position: relative;border-radius: 50%;overflow: hidden;"></canvas>
									</div>
								</div>
							</div>
						</div>
					</div>
				</mt-swipe-item>
				<mt-swipe-item>
					<div class="zhimaSuccess-part">
						<!--<img src="~@/assets/img/self/zhimaFace-bg.png" class="image width-full block"/>-->
						<div class="zhima-wrap relative text-center font-white bg-contain">
							<div class="canvas-wrap relative ">
								<canvas id="mycanvas"></canvas>
								<div class="score-wrap">
									<div class="center absolute">
										<p class="font-14 text1">芝麻分值</p>
										<p class="score">{{showScore | formatInt}}</p>
									</div>
									<span class="mark mark1">500</span>
									<span class="mark mark2">600</span>
									<span class="mark mark3">700</span>
									<span class="mark mark4">800</span>
									<span class="mark mark5">900</span>
									<p class="left right absolute time">更新时间：{{lastDate | formatTime5}}</p>
								</div>
							</div>
							<!--<p>您最高可减免押金为{{deposit}}元</p>-->
						</div>
					</div>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="zhimaFace-credit">
			<router-link to="/zhimaRule">
				<p class="font-darkGray font-20 zhimaFace-credit-title public-arrow-right">信用知识 <span class="font-12 font-lightGray float-right more">更多</span> </p>
			</router-link>
			<ul>
				<router-link to="/zhimaRule" tag = "li">
					<span class="dian"></span> 芝麻信用分减免规则
					<span class="line-normal"></span>
				</router-link>
				<router-link to="/zhimaRule" tag = "li">
					<span class="dian"></span> 什么是芝麻信用分
					<span class="line-normal"></span>
				</router-link>
			</ul>
		</div>
		<div v-if="products.length" class="home-product-swipe relative">
			<p class="font-darkGray font-20 zhimaFace-credit-title">猜你喜欢</p>
			<ul class="closeProduct-list public-padding-v relative">
				<router-link class="display-flex-between" v-for="(item,index) in products" :key="item.id" tag="li" :to="{path:'/productDetails',query:{productId:item.product_id}}">
					<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.image_src+')'}"></span>
					<div class="content display-flex-between flex-column">
						<div>
							<p class="name font-darkGray font-bold line-ellipsis">{{item.name}}</p>
							<div class="star-wrap">
								<div class="star-list vertical-middle font-12 font-lightGray">
									<div class="star-item vertical-middle bg-full" v-for="starItem in 5" :key="starItem.id">
										<span v-if="item.avg_score >= starItem" class="star"></span>
										<span v-else-if="item.avg_score < starItem && (item.avg_score*1+1) > starItem" class="star" :style="{'width':item.avg_score%1*100+'%'}"></span>
									</div>
									<span class="vertical-middle">{{item.avg_score}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraise_count}}</span>
								</div>
							</div>
						</div>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.product_rent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.productRent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/{{item.rent_unit}}</span>
						</div>
					</div>
				</router-link>
			</ul>
		</div>
		<div v-if="!faceFlag && ifAlipay" class="zhima-accredit-card font-14 font-white  text-center" @click="submitForm">
			<p class="public-arrow-right">
				人 脸 识 别 提 升 额 度
			</p>
		</div>
		<div class="zhima-accredit-card font-14 font-white  text-center" @click="submitForm" v-else-if="IdCardFlag == false">
			<p class="public-arrow-right">
				认证身份证照片 提升额度
			</p>
		</div>
		<div class="public-popup fixed top right bottom left" v-if="packFlag">
			<div class="public-popup-shadow">
				<div class="popup-bg">
					<p class="popup-portrait bg-cover"></p>
					<p class="font-darkGray font-16">恭喜！额度提升了¥{{balanceDeposit}}</p>
					<p class="total-price"><span class="font-18 symbol">￥</span>{{totalDeposit}}</p>
					<p class="font-12 font-3ED8C4">当前芝麻信用总额</p>
					<p class="popup-know font-white" @click="packFlag = false">我知道了</p>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
import { Swipe, SwipeItem } from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

var canvas, ctx;
export default {
	data() {
		return {
			lastDate: '',
			deposit: 0,
			totalDeposit: 0,
			width: 200,
			scale: 1,
			deg: 0,
			lastDeg: 0,
			showScore: 0,
			score: 0,
			faceFlag: false,
			IdCardFlag: false,
			showModalFlag: false,
			zhimaFaceFlag: false,
			askData: {
				certNo: '',
				certName: '',
				phone: '',
				params: '',
				client: "web"
			},
			products: [],
			ifAlipay: '',
			packFlag: false,
			balanceDeposit: 0
		}
	},
	mounted() {
		var that = this;
		setBodyColor(true);
		that.ifAlipay = IFALIPAY;
		that.devicePixelRatio = window.devicePixelRatio || 1;
		that.innerWidth = IFPCFLAG ? 640 : window.innerWidth;
		that.scale = 375 / (that.innerWidth * that.devicePixelRatio);
		that.width = 235 / that.scale;
		canvas = document.getElementById("mycanvas");
		ctx = canvas.getContext("2d");
		canvas.width = that.width;
		canvas.height = that.width;
		canvas.style.width = that.width / that.devicePixelRatio + "px";
		canvas.style.height = that.width / that.devicePixelRatio + "px";

		var canvas1 = document.getElementById('canvascircle');
		var ctx1 = canvas1.getContext('2d');
		canvas1.width = canvas1.parentNode.offsetWidth;
		canvas1.height = canvas1.parentNode.offsetHeight;
		//如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		//初始角度为0
		var step = 0;
		//定义2条不同波浪的颜色
		var lines = [
			"rgba(255,255,255,0.3)",
			"rgba(255,255,255,0.3)"
		];

		function loop() {
			ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
			step++;
			//画2个不同颜色的矩形
			for(var j = lines.length - 1; j >= 0; j--) {
				ctx1.fillStyle = lines[j];
				//每个矩形的角度都不同，每个之间相差90度
				var angle = (step + j * 90) * Math.PI / 180; //角度转换成弧度
				var deltaHeight = Math.sin(angle) * 14; //矩形高度的变化量
				var deltaHeightRight = Math.cos(angle) * 14; //矩形高度的变化量(右上顶点)
				ctx1.beginPath(); //开始绘制路径
				ctx1.moveTo(0, canvas1.height / 1.4 + deltaHeight); //左上角
				ctx1.bezierCurveTo(canvas1.width / 2, canvas1.height / 1.1 + deltaHeight - 20, //起点控制点xy
					canvas1.width / 2, canvas1.height / 1.4 + deltaHeightRight - 20, //结束点控制点xy
					canvas1.width, canvas1.height / 1.4 + deltaHeightRight); //结束点xy
				ctx1.lineTo(canvas1.width, canvas1.height); //右下角
				ctx1.lineTo(0, canvas1.height); ////左下角
				ctx1.lineTo(0, canvas1.height / 1.4 + deltaHeight); //左上角
				ctx1.closePath(); //闭合路径
				ctx1.fill(); //填充路径
			}
			requestAnimFrame(loop); //动画
		}
		loop();
		


		if(localStorage.getItem("activityToken")) {
			that.askData.token = localStorage.getItem("activityToken");
			localStorage.removeItem("activityToken");
		};
		if(localStorage.getItem("zhimaInfo")) {
			var _askData = JSON.parse(localStorage.getItem("zhimaInfo"));
			that.askData.certNo = _askData.certNo;
			that.askData.certName = _askData.name;
			that.askData.phone = _askData.phone;
			that.askData.params = decodeURIComponent(that.$route.query.params);
		};
		that.getData()
		
		// 上传身份证之后额度提成会 提示弹窗
		if ( that.totalDeposit - localStorage.getItem("totalDeposit") > 0) {
			 that.balanceDeposit = that.totalDeposit - localStorage.getItem("totalDeposit")
			 that.packFlag = true
		}

	},
	methods: {
		canvasRun() {
			var that = this;
			ctx.clearRect(0, 0, that.width, that.width)
			var lGrd = ctx.createLinearGradient(0, that.width, that.width, that.width);
			lGrd.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
			lGrd.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
			lGrd.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
			ctx.beginPath();
			ctx.lineWidth = 10 / that.scale;
			ctx.setLineDash([6, 8 / that.scale]);
			ctx.strokeStyle = lGrd;
			ctx.arc(that.width / 2, that.width / 2, (that.width / 2 - 10 / that.scale), Math.PI * 0.75, (135 + that.deg) * Math.PI / 180, false);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 2 / that.scale;
			ctx.setLineDash([4 / that.scale, 8]);
			ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
			ctx.arc(that.width / 2, that.width / 2, (that.width / 2 - 40 / that.scale), Math.PI * 0.75, Math.PI / 4, false);
			ctx.stroke();

			ctx.font = 60 / that.scale + 'px';
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
			ctx.fillText('500', 0, 0);
		},
		getData() {
			var that = this
			that.askData.blackBox = typeof(_fmOpt) != "undefined" ? _fmOpt.getinfo() : "";
			if(IFALIPAY) {
				network(CONFIG.authZhimaScore, that.askData, {
					codeFlag: true
				}).then((res) => {
					if(res.head.code == 0) {
						if(res.details.invalid == 'true') {
							that.$router.push({path: '/zhima'});
						}
						that.faceFlag = res.details.isFace;
						that.IdCardFlag = res.details.isIdCard;
						that.products = res.details.products;
						that.deposit = res.details.deposit;
						that.totalDeposit = res.details.totalDeposit
						that.lastDate = res.details.lastDate;
						that.score = res.details.score ? parseInt(res.details.score) : 0;
						that.lastDeg = (that.score - 500) * 270 / 400;
						that.showScoreAdd = that.score / that.lastDeg * 12;
						if(!that.faceFlag && !that.IdCardFlag && !localStorage.getItem("zhimaFaceflag")) {
							that.zhimaFaceFlag = true;
							localStorage.setItem("zhimaFaceflag", true);
						};
						var timeInter = setInterval(() => {
							if(that.deg >= that.lastDeg) {
								that.showScore = that.score;
								window.clearInterval(timeInter);
							} else {
								that.deg = that.deg + 12;
								that.showScore = that.showScore + that.showScoreAdd;
								that.canvasRun();
							};
						}, 30);
					}else{
						Vue.toast(res.head.message, {
							duration: 1500
						});
					}
				})
			} else {
				network(CONFIG.payZmxyScore, that.askData, {
					codeFlag: true
				}).then((res) => {
					if(res.head.code == 0) {
						if(localStorage.getItem("zhimaInfo")) {
							localStorage.removeItem("zhimaInfo");
						}
						that.faceFlag = res.details.isFace == 'true';
						that.IdCardFlag = res.details.isIdCard == 'Y';
						that.products = res.details.products;
						that.deposit = res.details.deposit;
						that.totalDeposit = res.details.totalDeposit
						that.lastDate = res.details.lastDate;
						that.score = res.details.score ? parseInt(res.details.score) : 0;
						that.lastDeg = (that.score - 500) * 270 / 400;
						that.showScoreAdd = that.score / that.lastDeg * 12;
						var timeInter = setInterval(function() {
							if(that.deg >= that.lastDeg) {
								that.showScore = that.score;
								window.clearInterval(timeInter);
							} else {
								that.deg = that.deg + 12;
								that.showScore = that.showScore + that.showScoreAdd;
								that.canvasRun();
							};
						}, 30);
					}else{
						Vue.toast(res.head.message, {
							duration: 1500
						});
					}
				})
			}

		},
		submitForm() {
			var that = this
			if (that.ifAlipay && !that.faceFlag) {
				that.$router.push({path: '/zhimaFace',query: { totalDeposit: that.totalDeposit}});
			} else {
				that.$router.push({path: '/zhimaIDcard',query: { totalDeposit: that.totalDeposit}});
			}
		},
	},
	destroyed(){
		setBodyColor();
	},
	components: {
		'swipe': Swipe,
		'swipe-item': SwipeItem
	}
}
</script>

<style>
@import '~vue-swipe/dist/vue-swipe.css';
.zhimaFace-banner-wrap {
	height: 13.6rem;
}

.zhimaFace-banner-wrap .image {
	width: 100%;
	height: 13.6rem;
}

.zhimaFace-credit-title {
	margin: 1.3rem 0 0.3rem;
}

.zhimaFace-credit {
	width: 17rem;
	margin: 0 auto;
}

.zhimaFace-credit .more {
	margin-top: 0.3rem;
}

.zhimaFace-credit li {
	height: 2.6rem;
	line-height: 2.6rem;
}

.dian {
	display: inline-block;
	width: 0.2rem;
	height: 0.2rem;
	border: 1px solid #3ED8C4;
	border-radius: 50%;
	margin-right: 0.4rem;
}

.zhimaSuccess .home-product-swipe {
	height: 15rem;
}

.zhimaSuccess .home-product-swipe .mint-swipe-indicator {
	opacity: 1!important;
	background: #f6f6f6!important;
}

.zhimaSuccess .home-product-swipe .mint-swipe-indicator.is-active {
	top: 0!important;
	width: 0.3rem!important;
	height: 0.3rem!important;
	background: #DDDDDD!important;
}

.zhimaSuccess .home-product-swipe .zhimaFace-credit-title {
	margin-left: 0.9rem;
}

.zhimaSuccess .closeProduct-list {
	padding-bottom: 2.6rem;
}

.zhimaSuccess .zhima-accredit-card {
	display: block;
	background: #3ED8C4;
	width: 12.5rem;
	height: 2.2rem;
	line-height: 2.2rem;
	border-radius: 1.5rem;
	position: fixed;
	bottom: 1.3rem;
	left: 50%;
	transform: translateX(-50%);
}

.zhimaSuccess .zhima-accredit-card p {
	width: 9rem;
	margin: 0 auto;
}

.zhimaSuccess .zhima-accredit-card .public-arrow-right {
	background-image: url(~@assets/img/self/arrows2.png);
}

.zhimaSuccess-part {
	background: #23e0d2;
}

.zhimaSuccess-part .zhima-wrap {
	/*background: #23e0d2;*/
	width: 18.75rem;
	height: 13.6rem;
	background-image: url(~@/assets/img/self/zhimaFace-bg.png);
	padding: 1.4rem 0 4rem 0;
}

.zhimaSuccess-part .canvas-warp canvas {
	display: block;
	margin: 0 auto;
}

.zhimaSuccess-part .score-wrap {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.zhimaSuccess-part .score-wrap .text1 {
	opacity: 0.7;
}

.zhimaSuccess-part .score-wrap .score {
	font-size: 2.5rem;
}

.zhimaSuccess-part .score-wrap .time {
	opacity: 0.7;
	bottom: 12%;
	font-size: 0.5rem;
}

.zhimaSuccess-part .score-wrap .mark {
	position: absolute;
	font-size: 0.7rem;
	color: #fff;
	top: 9%;
	left: 50%;
	width: 2rem;
	margin-left: -1rem;
	height: 41%;
	transform-origin: bottom;
}

.zhimaSuccess-part .score-wrap .mark1 {
	transform: rotate(-125deg);
	-webkit-transform: rotate(-125deg);
}

.zhimaSuccess-part .score-wrap .mark2 {
	transform: rotate(-65deg);
	-webkit-transform: rotate(-65deg);
}

.zhimaSuccess-part .score-wrap .mark4 {
	transform: rotate(65deg);
	-webkit-transform: rotate(65deg);
}

.zhimaSuccess-part .score-wrap .mark5 {
	transform: rotate(125deg);
	-webkit-transform: rotate(125deg);
}

.zhimaSuccess-part .free-price {
	width: 10.3rem;
	height: 10.3rem;
	margin: 0 auto;
	background-image: url(~@assets/img/self/zhima-free-price.png);
	padding-top: 0.1rem;
	padding-left: 0.1rem;
}

.free-price .rot {
	width: 10rem;
	height: 10rem;
	border-radius: 50%;
	position: relative;
	/*background: red;*/
	/*margin:0 auto ;*/
	/*padding-top: 0.5rem;*/
}

.free-price .rot .limit {
	font-size: 1.7rem;
}

.zhimaIDcard-Free-lines {
	position: absolute;
	top: 3.5rem;
	width: 9rem;
	text-align: center;
	left: 50%;
	transform: translate(-50%, -50%);
}

.zhimaIDcard-Free-lines .time {
	margin-top: 1rem;
	position: absolute;
	width: 10rem;
	text-align: center;
	background: red;
	left: 50%;
	transform: translateX(-50%);
	top: 4rem;
	z-index: 9;
}

.zhimaSuccess .canvasstyle {
	width: 9rem;
	height: 9rem;
	margin: 0.56rem auto;
	border-radius: 50%;
	position: relative;
	border: 1px#efefef solid;
	overflow: hidden;
}
.zhimaSuccess .popup-bg {
	width: 15rem;
	height: 19.5rem;
	background: #fff;
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.zhimaSuccess .popup-bg p {
	margin: 0 auto;
	text-align: center;
}
.zhimaSuccess .popup-bg .popup-portrait {
	background-image: url(~@assets/img/paySuccess-person.png);
	width: 5.3rem;
	height: 4rem;
	margin: 2.6rem auto 0.7rem;
}
.zhimaSuccess .popup-bg .total-price {
	color: #3ED8C4;
	font-size:2.5rem;
	/*position: relative;*/
}
/*.zhimaSuccess .popup-bg .symbol {
	position: absolute;
	left: 0;
	top: 0;
}*/
.zhimaSuccess .popup-bg .popup-know {
	width: 11.5rem;
	height: 2.2rem;
	line-height: 2.2rem;
	background: #3ED8C4;
	margin-top: 2.7rem;
}
</style>