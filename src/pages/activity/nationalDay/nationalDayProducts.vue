<template>
	<div class="nationalDayProducts-page">
		<img class="block width-full" :src="mainData[typeIndex].image"/>
		<div class="content">
			<div class="coupon-wrap relative" :class="{'active':type == 'vr'}">
				<img class="block width-full" src="https://resource.tanwuapp.com/FhHgtQeDK0-jTwlLMcwtgGDFQBK6"/>
				<div class="main absolute top bottom right font-white" :class="{'active':havingFlag == 'Y'}" @click="receiveCoupons">
					<span class="value font-bold vertical-middle">{{mainData[typeIndex].value}}折券</span>
					<div class="vertical-middle">
						<p class="font-20 font-bold">{{mainData[typeIndex].name}}</p>
						<p class="font-12">9月15日-10月14日</p>
						<span class="get absolute text-center font-bold font-16">{{havingFlag == 'Y'?'你已领取':'立即领取'}}</span>
					</div>
				</div>
			</div>
			<div class="products-list">
				<div v-for="(item,index) in mainData[typeIndex].productList">
					<div v-if="item.type != 'iqiyi'" class="item bg-white relative" @click="copy(item)">
						<span class="image bg-contain absolute" :style="{'background-image':'url('+item.image+')'}"></span>
						<p class="name font-18">{{item.productName}}</p>
						<div class="rent-wrap">
							<span class="font-16">起租价¥:</span><span class="rent font-bold">{{item.rent | formatInt}}</span><span class="font-16">{{item.rent | formatDecimal}}/日</span>
						</div>
						<img class="btn" src="https://resource.tanwuapp.com/FmCXdYIE9wiHcjVPyV17KyfnpVwy"/>
					</div>
					<div v-else class="item-iqiyi text-center font-green">
						<p class="text1 font-26 font-bold">爱奇艺奇遇 II VR 五折专享</p>
						<p class="text2">租期10天及以上用户可获得爱奇艺月卡一张</p>
						<p class="text2">月卡随产品一同寄出</p>
					</div>
				</div>
			</div>
			<div class="rule-wrap relative">
				<img class="block width-full" src="https://resource.tanwuapp.com/FqiHJBZP576DWWVhmtRC_D1tE7b-"/>
				<span class="btn absolute" @click="ruleFlag = true"></span>
			</div>
			<div class="foot text-center">
				<img class="contact-btn" src="https://resource.tanwuapp.com/FpfljGF94B0GYXz1RMrimhxMJgXV" @click="chat"/>
				<p class="text text-center font-bold font-16">玩转数码 引领潮流 尽在探物</p>
				<img class="logo" src="https://resource.tanwuapp.com/FnBUNWFXW_Bqpra-RlJA06HetdN5"/>
			</div>
		</div>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="productFlag" @click="productFlag = false">
				<div class="public-popup-shadow"></div>
				<div class="product-popup-wrap absolute center text-center">
					<div class="relative">
						<img class="image" :src="selectItem.image"/>
						<img class="icon" src="https://resource.tanwuapp.com/FquEqlCpnUamIb4SS9WvP1CiBVAS"/>
						<p>吱口令已复制，打开支付宝下单租赁吧！</p>
					</div>
				</div>
			</div>
		</transition>
		<transition name="anim-up">
			<div class="public-popup fixed top right bottom left" v-if="ruleFlag" @click="ruleFlag = false">
				<div class="public-popup-shadow"></div>
				<div class="absolute center text-center">
					<img class="rule-image block width-full" src="https://resource.tanwuapp.com/FnOlIuLBXRPFL_oryQZ_JVtFjARi"/>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import { publicChat } from '@assets/js/mUtils';
	import VueClipboard from 'vue-clipboard2';
	Vue.use(VueClipboard)
	export default {
		data() {
			return {
				type:'camera',
				typeIndex:0,
				askData:{
	            		activityName:"nationalDay",
	            	},
	            	havingFlag:'N',
	            	source:'',
	            	activityLogs:[],
	            	alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	ruleFlag:false,
	            	couponRuleFlag:false,
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false,
	            	productFlag:false,
	            	ruleFlag:false,
	            	mainData:[
	            		{
            				type:'camera',
	            			value:'9',
	            			name:'相机专享',
	            			image:'https://resource.tanwuapp.com/FpWwMe4SJfBomtYe1jmW7k9IP4qi',
	            			productList:[
			            		{
			            			id:259,
			            			name:'索尼 黑卡6',
			            			productName:'索尼 DSC-RX100F M6 黑卡6数码相机',
			            			rent:35,
			            			image:'https://resource.tanwuapp.com/FrcUuMzZjoTNqbPJUpt3yZnT0aY3',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序德菁沃X倩秋2静蔌壳戌'
			            		},
			            		{
			            			id:278,
			            			name:'富士 X-T100',
			            			productName:'富士 X-T100 复古数码相机(含15-45mm镜头)',
			            			rent:18,
			            			image:'https://resource.tanwuapp.com/FmoqKVvH2tU735le_67K9pRjiGqk',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序迪迈维瀚星巧2静咦壳扰'
			            		},
			            		{
			            			id:171,
			            			name:'佳能EOS 200D',
			            			productName:'佳能EOS 200D套机(18-55mm IS STM镜头)',
			            			rent:15,
			            			image:'https://resource.tanwuapp.com/FrH_lt8ERT5lm7XuKn3u0-CEsntv',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序英h亮qEK2静莩颈富'
			            		}
			            	]
            			},
            			{
            				type:'vr',
	            			value:'7',
	            			name:'影音专享',
	            			image:'https://resource.tanwuapp.com/FmwXcy8R_OiyMThnTCwqeciVaEg1',
	            			productList:[
			            		{
			            			id:243,
			            			name:'极米 Z6',
			            			productName:'极米（XGIMI）Z6 家用投影机',
			            			rent:10,
			            			image:'https://resource.tanwuapp.com/FhwYIwpNCRp9J_4EYAW9h6A5Zjyj',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序衡I睿茜佳骏2静栉壳淄'
			            		},
			            		{
			            			type :'iqiyi'
			            		},
			            		{
			            			id:256,
			            			name:'爱奇艺奇遇 II',
			            			productName:'爱奇艺奇遇 II VR一体机',
			            			rent:7.5,
			            			image:'https://resource.tanwuapp.com/FpNQZC0tPajASoxr8_MDOFZDLcXt',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序茗F庭芬先丹2静瑰壳埤'
			            		}
			            	]
            			},
            			{
            				type:'drone',
	            			value:'8',
	            			name:'无人机专享',
	            			image:'https://resource.tanwuapp.com/FnqsEU1frdiCfMTsaWSBfD-L-Ip7',
	            			productList:[
			            		{
			            			id:100,
			            			name:'大疆 晓 全能版',
			            			productName:'大疆 晓 SPARK 无人机全能套装',
			            			rent:16,
			            			image:'https://resource.tanwuapp.com/Fl4AzkyAQvDlKQKaeKz03oy7kSgb',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序Y福正aC亮2静宿壳酐'
			            		},
			            		{
			            			id:197,
			            			name:'大疆 御 全能版',
			            			productName:'大疆 御 Mavic Air 无人机全能版',
			            			rent:45,
			            			image:'https://resource.tanwuapp.com/FmR5O08xCYEXzP0RzGMr6PJ7D5Cg',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序8萱品翰致赫2静桊壳岔'
			            		}
			            	]
            			},
            			{
            				type:'gopro',
	            			value:'9',
	            			name:'相机专项',
	            			image:'https://resource.tanwuapp.com/FsxusmMVVYRIuLfVLqKpFhZw7A60',
	            			productList:[
			            		{
			            			id:167,
			            			name:'GoPro HERO 6',
			            			productName:'GoPro HERO 6 Black 运动摄像机',
			            			rent:9,
			            			image:'https://resource.tanwuapp.com/FvB97UqRI801lLqBXRxxS32Y-rHu',
			            			link:'#吱口令#长按复制此条消息，打开支付宝即可使用[探物]小程序霆略Mk曙K2静哧氟疔'
			            		}
			            	]
            			}
            		],
            		selectItem:{}
			}
		},
		mounted(){
			var that = this;
			that.pageInit();
		},
		methods: {
			pageInit(){
				var that = this;
				var query = that.$route.query;
				that.type = query.type;
				switch (that.type){
					case 'camera':
						that.typeIndex = 0;
						break;
					case 'vr':
						that.typeIndex = 1;
						break;
					case 'drone':
						that.typeIndex = 2;
						break;
					case 'gopro':
						that.typeIndex = 3;
						break;
					default:
						break;
				};
				var source = "";
	        		if(query.source){
	            		source = query.source;
	            		that.source = source;
	            		localStorage.setItem("source",source);
	            	}
				that.umeng('国庆产品'+that.type, '访问', source);
	        		localStorage.setItem("opeActivityTag",'nationalProductsDay_'+source);
				that.activityInit();
				var reqStr = {
	        			activityName:that.askData.activityName,
	        			source:source
	        		};
	        		//活动访问统计
				network(CONFIG.systemClientLog,{
					platform:'h5',
					type:'info',
					url:CONFIG.activityExtendInit,
					reqStr:JSON.stringify(reqStr)
				},{codeFlag:true}).then((res) => {});
			},
			activityInit(){
            		var that = this;
            		network(CONFIG.activityExtendInit,that.askData,{codeFlag:true}).then((res) => {
					if(res.head.code == 0) {
						if(res.details.isReceiveAll){
							that.havingFlag = 'Y';
						}
					} 
				});
            	},
			receiveCoupons() {
				var that = this;
				if(that.havingFlag == "Y") {
					return false;
				};
				if(!that.goLogin()) {
					return false;
				}
				network(CONFIG.activityExtendGrantCoupon,that.askData).then((res) => {
					if(res.head.code == 0) {
						Vue.toast('领取成功', {
							duration: 1500
						});
						that.havingFlag = "Y";
					}
				});
			},
			copy(item){
				var that = this;
				if(item.link){
					that.$copyText(item.link).then(function (e) {
			        		that.selectItem = item;
						that.productFlag = true;
			        }, function (e) {
			        		Vue.toast('复制失败,请打开支付宝搜索探物', {duration: 3000})
			        })
				}else{
					 Vue.toast('复制失败,请打开支付宝搜索探物', {duration: 3000})
				}
				that.umeng('国庆产品'+that.type, '复制', item.name+'_'+that.source);
			},
			chat(){
				var that = this;
				publicChat();
			}
		},
		watch: {
			'$route': 'pageInit'
		},
	}
</script>

<style>
	.nationalDayProducts-page .content{
		background: -webkit-linear-gradient(#0c1848, #221865); 
		background: -o-linear-gradient(#0c1848, #221865); 
		background: -moz-linear-gradient(#0c1848, #221865); 
		background: linear-gradient(#0c1848, #221865);
	}
	.nationalDayProducts-page .coupon-wrap{
		width: 17.9rem;
		margin: 0 auto;
		top: -1.1rem;
	}
	.nationalDayProducts-page .coupon-wrap.active{
		top: -0.1rem;
		margin-bottom: 1rem;
	}
	.nationalDayProducts-page .coupon-wrap .main{
		left: 2.225rem;
		padding-top: 1.35rem;
	}
	.nationalDayProducts-page .coupon-wrap .main.active{
		color: #C5C5C5;
	}
	.nationalDayProducts-page .coupon-wrap .main .value{
		font-size: 2.3rem;
		line-height: 1;
		margin-right: 0.3rem;
	}
	.nationalDayProducts-page .coupon-wrap .main .get{
		position: absolute;
		top: 50%;
		right: 1.2rem;
		border:0.05rem solid #FFFFFF;
		padding: 0.2rem 0.1rem;
		width: 1rem;
		line-height: 1.05;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		border-radius: 0.1rem;
		text-shadow: 0 0 0.1rem rgba(0,0,0,0.5);
	}
	.nationalDayProducts-page .coupon-wrap .main.active .get{
		border-color: #C5C5C5;
	}
	.nationalDayProducts-page .products-list {
		padding: 0 0.675rem;
		padding-bottom: 0.55rem;
	}
	.nationalDayProducts-page .products-list .item{
		border: 0.1rem solid #41ECFF ;
		border-radius: 0.1rem;
		margin-bottom: 0.95rem;
		padding:0.65rem 0.5rem 0.5rem 9rem;
	}
	.nationalDayProducts-page .products-list .item-iqiyi{
		padding-top: 0.4rem;
		padding-bottom: 0.7rem;
	}
	.nationalDayProducts-page .products-list .item-iqiyi .text1{
		margin-bottom: 0.2rem;
	}
	.nationalDayProducts-page .products-list .item-iqiyi .text2{
		font-size: 0.75rem;
		line-height: 1.05rem;
	}
	.nationalDayProducts-page .products-list .item .image{
		left: 0.3rem;
		top: 0;
		bottom: 0;
		width: 8rem;
	}
	.nationalDayProducts-page .products-list .item .name{
		color: #1B0871;
		line-height: 1rem;
	}
	.nationalDayProducts-page .products-list .item .rent-wrap{
		color: #1C3BE2;
	}
	.nationalDayProducts-page .products-list .item .rent{
		font-size: 1.4rem;
	}
	.nationalDayProducts-page .products-list .item .btn{
		width: 6.15rem;
		margin-top: 0.3rem;
	}
	.nationalDayProducts-page .rule-wrap{
		width: 17.25rem;
		margin: 0 auto 1.5rem auto;
	}
	.nationalDayProducts-page .rule-wrap .btn{
		bottom: 1.6rem;
		left: 5rem;
		right: 5.3rem;
		height: 1.85rem;
		opacity: 0.7;
	}
	.nationalDayProducts-page .foot{
		padding-bottom: 1.27rem;
	}
	.nationalDayProducts-page .foot .contact-btn{
		width: 7.45rem;
	}
	.nationalDayProducts-page .foot .text{
		color: #8E9BFA ;
		 background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#8E9BFA), to(#3340E5 ));
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
	    margin-bottom: 0.85rem;
	    margin-top: 0.5rem;
	}
	.nationalDayProducts-page .foot .logo{
		width: 6.45rem;
	}
	.nationalDayProducts-page .product-popup-wrap {
		width: 14.3rem;
		padding-bottom: 1.1rem;
	}
	.nationalDayProducts-page .product-popup-wrap:before{
		content: '';
		background: #FFFFFF;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 3.4rem;
		border-radius: 0.3rem;
	}
	.nationalDayProducts-page .product-popup-wrap .image{
		width: 8.65rem;
		height: 7.05rem;
	}
	.nationalDayProducts-page .product-popup-wrap .icon{
		display: block;
		height: 1.25rem;
		margin: 0 auto 0.8rem auto;
		width: 1.3rem;
	}
	.nationalDayProducts-page .rule-image{
		width: 17.25rem;
	}
</style>