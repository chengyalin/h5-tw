//var host = "https://api.tanwuapp.com/iOS/1.5.4" // 正式库
//吉
//var host = "http://192.168.199.180:8080/iOS/1.5.1";
//帅
//var hostActivity = "http://192.168.199.76:8080"; 
//var hostActivity = "http://test.api.tanwuapp.cn"; // 测试库
//var hostActivity = "https://api.tanwuapp.com"; //正式库
//var host = "http://test.api.tanwuapp.cn/iOS/1.5.4" // 测试库

//var host = "https://150.api.tanwuapp.com/iOS/1.5.4" // 正式库
//var hostActivity = "https://150.api.tanwuapp.com" // 正式库

//var host = "https://prepub.api.tanwuapp.com/iOS/1.5.4" // 预发布库
//var hostActivity = "https://prepub.api.tanwuapp.com" // 预发布库

//var host = "https://dev.tanwuapp.cn/iOS/1.5.4" // 开发库
//var hostActivity = "https://dev.tanwuapp.cn" // 开发库

//var host = "https://alpha.api.tanwuapp.cn/iOS/1.5.4" // 测试库
//var hostActivity = "https://alpha.api.tanwuapp.cn" // 测试库

//var host = "https://api.tanwuapp.com/iOS/1.5.4" // 正式库
var hostActivity = "https://api.tanwuapp.com"; //正式库

//const hostActivity = "https://alpha.api2.tanwuapp.cn";
const host = hostActivity + "/iOS/1.5.4";


var CONFIG = {

    uploadFileUrl: 'https://upload.qiniup.com',
    
    uploadFileUrlBase64: 'https://up.qbox.me/putb64/-1',
    
    imageHost:'https://resource.tanwuapp.com/',
    
    zhimaOpenAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016062101539662&scope=auth_zhima,auth_user&redirect_uri=https%3a%2f%2fm.tanwuapp.com/self/zhima.html',
    
    banners:host+'/banners',

    productTypes :host+'/productTypes',

    products :host+'/products',

    product :host+'/product/1',

    remindCheck :host+'/product/remind/check',

    remind :host+'/product/remind',

    addresses :host+'/user/addresses',

    addressesSave :host+'/user/address/save',

    addressesDelete :host+'/user/address/delete',

    addressesDefault :host+'/user/address/default',
    
    addressesInfo :host+'/user/address/info',

    addressesUpdate:host+'/user/address/update',

    openIdUrl:host+'/wx/user/login',

    checkSMScode:host+'/user/CheckSMScode', 

    checkTelCode:host+'/user/Register/SMScode',
    
    userLoginSMS:host+'/user/login/SMS',
    
    login:host+'/user/login',
    
    logout:host+'/user/logout',

    register:host+'/user/register',

    appraises:host+'/product/1/appraises',

    appraisesHeader:host+'/product/1/appraises/data',

    orderAppraiseSave:host+'/order/appraise/save',

    productAppraiseSave:host+'/product/appraise/save',
    
    productPrice: host+'/product/price',

    optionalDate:host+'/order/optional/date',

    orderInfo:host+'/order/info',

    orderSave:host+'/order/save',

    orderList:host+'/order/list',

    orderListType:host+'/order/type/list',

    orderDetails:host+'/order/details/info',

    orderDelete:host+'/order/delete',

    orderCancel:host+'/order/cancel',

    orderPay:host+'/pay/wechat/xcx/order',

    orderPayRelet:host+'/pay/wechat/xcx/order/renewal',
    
    productRefund: host+'/order/refund/check',

    productBrief:host+'/product/1/brief',

    express:host+'/express/list/others',

    help:host+'/help/question',

    loginThird:host+'/user/login/thirdParty',

    updataThirdInfo:host+'/user/update/thirdInfo',

    uploadToken:host+'/user/upload',

    aftersaleCheck: host+'/aftersale/check',

    aftersale:host+'/aftersale/service',

    reservationSave:host+'/order/reservation/save',

    reservationCancel:host+'/order/reservation/cancel',

    reservationCheck:host+'/order/reservation/check',    

    videoDetails:host+'/video/details',

    videos: host+'/special/videos',

    videoComment: host+'/video/comment/release',

    videoComments: host+'/video/comments',

    couponReceive: host+'/coupon/receive',

    orderNotAppraise: host+'/order/notAppraise',

    reservationExpress: host+'/order/reservation/express',

    optionalEndDate: host+'/order/optional/endDate',

    zmScore: host+'/pay/zmxy/score',

    appraiseCoupon: host+'/order/appraise/coupon',

    renewalInit: host+'/order/renewal/init',
    
    userHeader:host+'/user/header',
    
    user:host+'/user',
    
    productCollect :host+'/product/1/collect',
    
    videoCollect:host+'/video/collect',
    
    userInfo:host+'/user/info',
    
    userUpdate:host+'/user/update',
    
    userPassword:host+'/user/update/password',
    
    userSMScode:host+'/user/SMScode',
    
    userCheckSMScode:host+'/user/CheckSMScode',
    
    userForgetPwd:host+'/user/forget/pwd',
    
    feedbackOpinion:host+'/feedback/opinion',
    
    userCouponList:host+'/user/coupon/list',
    
    searchProducts:host+'/search/products',
    
    userbaseInfo:host+'/user/baseInfo',
    
    useAppraisesr:host+'/user/appraises',
    
    useCollects:host+'/user/collects',
    
    useCollectVideos:host+'/user/collect/videos',
    
    webAlipay:host+'/web/alipay',
    
    webAlipayRenewal:host+'/web/alipay/renewal',
    
    webQuery:host+'/web/alipay/query',
    
    webWechat:host+'/web/wechat',
    
    webWechatRenewal:host+'/web/wechat/renewal',
    
    pagZmxyInit:host+'/pay/zmxy/init',
    
    payZmxyAuth:host+'/pay/zmxy/auth',
    
    payZmxyScore:host+'/pay/zmxy/score',
    
    zmxyFaceInit:host+'/zmxy/face/init',
    
    zmxyFaceResult:host+'/zmxy/face/result',
    
    payZmxySign:host+'/pay/zmxy/sign',
    
    orderSelfs:host+'/order/selfs',
    
    searchKey:host+'/searchKey',
    
    userHeadThumbs:host+'/user/headThumbs',
    
    productsHotList:host+'/products/hotList',
    
    alipayRentCreate:host+'/alipay/rent/create',
    
    webLoginAuth:host+'/web/login/auth',
    
    productSendDay:host+'/product/sendDay',
    
    //wechatXcx:host+'/pay/wechat/xcx/order',
    
    themes:host+'/themes',
    
    themesInfo:host+'/theme/info',
    
    activityHoverCameraReceived:hostActivity+'/activity/hoverCamera/received',
    
    activityHoverCameraInit:hostActivity+'/activity/hoverCamera/init',
    
    activityHoverCameraOptional:hostActivity+'/activity/hoverCamera/optional',
    
    activityHoverCameraEndDatel:hostActivity+'/activity/hoverCamera/endDate',
    
    activityHoverCameraOrderInit:hostActivity+'/activity/hoverCamera/orderInit',
    
    activityHoverCameraSelfs:hostActivity+'/activity/hoverCamera/selfs',
    
    activityHoverCameraOrder:hostActivity+'/activity/hoverCamera/order',
    
    activityHoverCameraPrice:hostActivity+'/activity/hoverCamera/price',
    
    shareInit:host+'/share/init',
    
    shareCoupon:host+'/share/coupon',
    
    activityHoverCameraShareInit:hostActivity+'/activity/hoverCamera/shareInit',

	wechatAuthorization: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f44f85ee06b85f8&redirect_uri=http%3A%2F%2F150.api.tanwuapp.com%2Fwechat%2Fauth&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect',
	
	//wechatAuthorization: '../login.html',

	themeCommentRelease:host+'/theme/comment/release',
	
	themeComments:host+'/theme/comments',
	
	activityDiscountInit:hostActivity+'/activity/discount/init',
	
	activityDiscountReceive:hostActivity+'/activity/discount/receive',
	//双十一折扣
	activityDiscountList:hostActivity+'/activity/discount/list',
	//首页活动优惠券 初始化
	activityThanksgivingInit:hostActivity+'/activity/thanksgiving/init',
	//首页活动优惠券 领取
	activityThanksgivingSave:hostActivity+'/activity/thanksgiving/save',
	
	shoppingSave:host+'/shopping/save',
	
	shoppingList:host+'/shopping/list',
	
	shoppingDelete:host+'/shopping/delete',
	
	shoppingUpdate:host+'/shopping/update',
	
	shoppingOrderInit:host+'/shopping/order/init',
	
	shoppingOrderSave:host+'/shopping/order/save',
	
	orderInfoDetailsInfo:host+'/orderInfo/details/info',
	
	orderInfoTypeList:host+'/orderInfo/type/list',
	
	orderInfoList:host+'/orderInfo/list',
	
	orderInfoCancel:host+'/orderInfo/cancel',
	
	orderInfoApplyServiceOrRefund:host+'/orderInfo/applyServiceOrRefund',
	
	shoppingPaySign:host+'/shopping/paySign',
	//全部退款明细
	orderInfoRefundAllDetail:host+'/orderInfo/refund/allDetail',
	//订单退款明细
	orderInfoRefundDetail:host+'/orderInfo/refund/detail',
	//订单退款/售后详情
	orderInfoRefundInfo:host+'/orderInfo/refund/info',
	//预约产品寄回列表
	orderInfoReservationList:host+'/orderInfo/reservation/list',
	//预约产品寄回  初始化
	orderInfoReservationCheck:host+'/orderInfo/reservation/check',
	//预约产品寄回  提交
	orderInfoReservationSave:host+'/orderInfo/reservation/save',
	//预约产品寄回  详情
	orderInfoReservationInfo:host+'/orderInfo/reservation/info',
	//预约产品寄回  填写单号
	orderInfoReservationExpress:host+'/orderInfo/reservation/express',
	//预约产品寄回  填写单号
	orderInfoReservationSave:host+'/orderInfo/reservation/save',
	//续租 签名
	shoppingRenewPaySign:host+'/shopping/renewPaySign',
	//续租 初始化
	orderInfoRenewalInit:host+'/orderInfo/renewal/init',
	//续租 成功详情
	orderInfoRenewalSuccessInfo:host+'/orderInfo/renewal/successInfo',
	//跟踪订单 父/子订单
	orderInfoExpressParentInfo:host+'/orderInfo/express/parentInfo',
	//订单删除
	orderInfoDelete:host+'/orderInfo/delete',
	//首页活动弹框
	enterAppCueInfo:host+'/enterAppCueInfo',
	//双节抽奖
	activityLuckDraw:hostActivity+'/activity/luckDraw',
	//双节初始化
	activityShuangdanInit:hostActivity+'/activity/shuangdanInit',
	//判断用户使用领取过某优惠券
	userCheckCoupon:hostActivity+'/user/checkCoupon',
	//首页数据
	homes:host+"/homes",
	//长租产品 列表
	longProducts:host+"/longProducts",
	//长租产品 选择初始化
	productInit:host+"/product/init",
	//问题分类接口
	ruleTypes:host+"/rule/types",
	//产品、类型下的问题列表
	ruleList:host+"/rule/list",
	//退款、售后初始化
	serviceInit:host+"/service/init",
	//身份证校验
	authOcridcard:host+"/auth/ocridcard",
	//支付宝授权查询
	authAuthQuery:host+"/auth/authQuery",
	//支付宝code 查询用户
	authAuthStart:host+"/auth/authStart",
	//查询芝麻分
	authZhimaScore:host+"/auth/zhimaScore",
	//人脸识别初始化
	authFaceInit:host+"/auth/faceInit",
	// 人脸识别结果查询
	authFaceQuery:host+"/auth/faceQuery",
	//新年活动 初始化
	activityCommonInit:hostActivity+'/activity/commonInit',
	//新年活动 抽奖
	activityCommonDraw:hostActivity+'/activity/commonDraw',
	
	//动态 列表
	shares:host+"/shares",
	//动态 评论列表
	shareComments:host+"/share/1/comments",
	//动态 评论
	shareComment:host+"/share/1/comment",
	//动态 举报
	reportShare:host+"/report/share",
	//动态 删除
	shareDelete:host+"/share/delete",
	//动态 点赞
	sharePraise:host+"/share/1/praise",
	//动态标签 列表
	tagShares:host+"/tag/shares",
	//动态标签 缩略图
	labelSearch:host+"/label/search",
	//动态标签 详情
	userShareInfo:host+"/user/share/info",
	//动态提交
	shareInsert:host+"/share/insert",
	//个人动态
	userShares:host+"/user/shares",
	//个人动态
	notifyUnreadCount:host+"/notify/unread/count",
	//口碑 点赞
	appraisePraise:host+"/appraise/1/praise",
	
	//新版 热门体验
	productHotList:host+'/product/hotList',
	//总账单
	longRectQueryInstalmentBillsRest:host+'/longRect/queryInstalmentBillsRest',
	//总账单 详情
	longRectQueryBillDetailRest:host+'/longRect/queryBillDetailRest',
	//长租支付接口
	paymentLongPaySign:host+'/payment/longPaySign',
	
	longRectRemainWaitPayBill:host+'/longRect/remainWaitPayBill',
	
	longRectOrderDetailToBill:host+'/longRect/orderDetailToBill',
	
	longRectQueryCommonConfig:host+'/longRect/queryCommonConfig',
	
	longRectFullAmountBillDetail:host+'/longRect/fullAmountBillDetail',
	// 新用户落地页注册
	registerLaterAction:host+'/activity/registerLaterAction',
	// 活动 初始化
	activityExtendInit:hostActivity+'/activity/extendInit',
	// 活动 领券
	activityExtendGrantCoupon:hostActivity+'/activity/extendGrantCoupon',
	
};

var reg_pwd = /^[0-9a-zA-z]{6,}$/;
var reg_tel = /^1\d{10}$/;
var reg_zipcode = /^\d{6}$/;
var reg_idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 

function getUrlParam(name) {
//  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//  var r = window.location.search.substr(1).match(reg);
//  if (r != null) return unescape(r[2]); return null;
	var url = window.location.search;
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
        var str = url.substr(1);   
        strs = str.split("&");   
        for(var i = 0; i < strs.length; i ++) {   
              //就是这句的问题
             theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
             //之前用了unescape()
             //才会出现乱码  
        }   
    };
    return name == 'all'?theRequest:theRequest[name];   
};

//去除换行
function clearBr(value) { 
	value = value.replace(/<\/?.+?>/g,""); 
	value = value.replace(/[\r\n]/g, ""); 
	return value; 
};

//倒计时获取
function getCountDownTime(dateTimeStamp,s){
    var now =(new Date().getTime()/1000).toFixed(0); 
    var end = parseInt(dateTimeStamp)/1000 + 30 * 60; 
	var diffValue = end - now ;
	return s?(parseInt(diffValue/60)):(parseInt(diffValue%60))
};

//YYYY年MM月DD日
function getFormatTime1(value) {
	var date = new Date(parseInt(value)); 
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return value?year+"年"+month+"月"+day+"日":'';
};


// 时间戳之间相差的天数 

function getDiff(stamp1,stamp2){
  var diffValue = Math.abs(stamp1 - stamp2);
  return Math.floor(diffValue / (24 * 3600 * 1000)) + 1
};


//¥100.00 保留两位小数

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function round2(number,fractionDigits){    
    return Math.round(number*Math.pow(10,fractionDigits))/Math.pow(10,fractionDigits);  
}  

	
Vue.filter('formatMoney', function(value) {
    return "¥"+ parseFloat(value).toFixed(2);
});

Vue.filter('formatMoney2', function(value) {
    return "¥"+ round2(parseFloat(value),2);
});
//YYYY年MM月DD日

Vue.filter('formatTime1', function(value) {
	var date = new Date(parseInt(value)); 
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return value?year+"年"+month+"月"+day+"日":'';
});

//MM月DD日

Vue.filter('formatTime2', function(value) {
	var date = new Date(parseInt(value)); 
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return value?month+"月"+day+"日":"-月-日";
});

//YYYY年MM月DD日 hh:mm:ss

Vue.filter('formatTime3', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + "年" + month + "月" + day + "日 " +  [hour, minute, second].map(formatNumber).join(':');
});

//YYYY-MM-DD hh:mm:ss

Vue.filter('formatTime4', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
});

//YYYY.MM.DD

Vue.filter('formatTime5', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return value>0?[year, month, day].join('.'):'';
});

//YYYY-MM-DD

Vue.filter('formatTime6', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].map(formatNumber).join('-');
});


//YYYY/MM/DD
Vue.filter('formatTime7', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return value>0?[year, month, day].join('/'):'';
});

//YYYY/MM/DD
Vue.filter('formatTime8', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':');
});

//countDown hh:ss:dd
Vue.filter('formatCountDown', function(value) {
	var diff = parseInt(value);
	var minute =  Math.floor(diff / (1000 * 60 ));
    var second =  Math.floor((diff %(1000 * 60 )/1000));
    return (diff<=0 || !diff)?"0:0":[minute,second].map(formatNumber).join(":");
});

Vue.filter('formatInt', function(value) {
	return parseInt(value);
});

Vue.filter('formatSplit1',function(value){
	var arr = value.split(",");
	return arr.join(" ")
})

Vue.filter('formatTimeDiff',function(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		result = "刚刚"
	}
	var yearC = diffValue / year;
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(yearC >= 1) {
		var time = new Date(parseInt(dateTimeStamp));
		result = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日"
	} else {
		if(monthC >= 1) {
			result = parseInt(monthC) + "月前"
		} else {
			if(dayC >= 1) {
				result = parseInt(dayC) + "天前"
			} else {
				if(hourC >= 1) {
					result = parseInt(hourC) + "小时前"
				} else {
					if(minC >= 1) {
						result = parseInt(minC) + "分钟前"
					} else {
						result = "刚刚"
					}
				}
			}
		}
	}
	return result
})

if(window['vue-easy-toast']){
	Vue.use(window['vue-easy-toast'].default);
};

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['key'] = hex_md5("TWAPPTW");
axios.defaults.headers.post['version'] = '1.5.4';
function postRequest(url, params,code) {
	return new Promise(function(resolve, reject){
		params = params || {};
		if(localStorage.getItem("twUser") && !params.token){
			var token = JSON.parse(localStorage.getItem("twUser")).token;
			params.token = token?token:'';
		};
		axios.post(url, params)
	  	.then(function (res) {
	  		//console.log("url",url);
	  		//console.log("askData",params);
	  		//console.log(res.data)
		    if(res.data.head && res.data.head.code && !code){
	        	if(res.data.head.code == 1){
		    		Vue.toast("登录状态失效",{className: ['myToast-warning']});
		    		var alipayOpenId = null,source = null;
		    		if(localStorage.getItem("alipayOpenId")){
						alipayOpenId = localStorage.getItem("alipayOpenId");
					};
					if(localStorage.getItem("source")){
						source = localStorage.getItem("source");
					};
					localStorage.clear();
					if(alipayOpenId){
						localStorage.setItem("alipayOpenId",alipayOpenId);
					};
					if(source){
						localStorage.setItem("source",source);
					};
					if(IFWECHAT){
						window.location.href = CONFIG.wechatAuthorization;
					}else{
						window.location.href = "/#/login";
						//window.location.href = "/login.html";
					};
		    	}else if (res.data.head.code == 100 || res.data.head.code == 101 || res.data.head.code == 201) {
		    		Vue.toast(res.data.head.message,{className: ['myToast-warning']});
	            }else if (res.data.head.code == 500) {
	            	Vue.toast("哎呦 服务器去野区采灵芝了",{className: ['myToast-warning']});
	            }else{
	            	resolve(res.data);
	            }
	        }else{
	        	resolve(res.data);
	        }
	  	})
	  	.catch(function (error) {
	    	//console.log(error);
	  	});
	});
};
	
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    var width = img.width;
    var height = img.height;
    if(width>750){
    	width = 750;
    	height = 750 * img.height / img.width;
    };
    canvas.width = width;  
    canvas.height = height; 
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height); 
    var dataURL = canvas.toDataURL("image/jpg", 1);
    return dataURL;
};

function getObjectURL(file) {
	var url = null ; 
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
};

function initChat(){
	if(!IFMINIAPPWECHAT){
		;(function(m, ei, q, i, a, j, s) {
	        m[i] = m[i] || function() {
	            (m[i].a = m[i].a || []).push(arguments)
	        };
	        j = ei.createElement(q),
	            s = ei.getElementsByTagName(q)[0];
	        j.async = true;
	        j.charset = 'UTF-8';
	        j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
	        s.parentNode.insertBefore(j, s);
	    })(window, document, 'script', '_MEIQIA');
	    _MEIQIA('entId', 62542);
	    _MEIQIA('withoutBtn');
	    if(IFUC){
	    	_MEIQIA('allSet', yourFunction);
		    _MEIQIA('init');
			function yourFunction() {
				var meiqia_1 = document.getElementById("MEIQIA-PANEL-HOLDER");
				meiqia_1.style.height = 0;
				var meiqia_2 = document.getElementById("MEIQIA-BTN-HOLDER");
				meiqia_2.onclick = function(){
					meiqia_1.style.height = 100 +"%";
					meiqia_1.style.width = 100 +"%";
				}	
	    	}
	    };
	}
		
};

var userbaseInfo = {};

function publicChat(){
	if(IFMINIAPPWECHAT){
		Vue.toast("暂时无法使用",{className: ['myToast-warning']});
		return false;
	}
	if(userbaseInfo.nickname || !localStorage.getItem("twUser")){
	    _MEIQIA('showPanel');
	}else{
		postRequest(CONFIG.userbaseInfo,{},true).then(function(res) {
			
		    if(res.head.code == 0){
		    	userbaseInfo = res.details;
		    	_MEIQIA('clientId', userbaseInfo.uid);
		    	_MEIQIA('metadata',userbaseInfo);
	      	};
			_MEIQIA('showPanel');
		});
	}
}

var pathname = window.location.pathname;
var _pathname = pathname.substring(pathname.lastIndexOf("/")+1,pathname.length);
if(getUrlParam("token") && getUrlParam("sign") && !getUrlParam("nologin") && _pathname != "shareCoupon.html" && _pathname != "hover_camera_details.html" && _pathname != "LabourDay.html" && _pathname != "childrenDay.html" &&  pathname.indexOf("activity")<0){
	postRequest(CONFIG.webLoginAuth,getUrlParam("all"),true).then(function(res){
		if(res.head.code == 0){
			localStorage.setItem("twUser",JSON.stringify(res.details));
		}
	});
};

function activityAllInit(callback){
	/*if(localStorage.getItem("twUser")){
		callback();
	}*/
	if(getUrlParam("wechatUnionid")){
		localStorage.setItem("wechatUnionid",getUrlParam("wechatUnionid"));
		localStorage.setItem("wechatOpenid",getUrlParam("wechatOpenid"));
		postRequest(CONFIG.loginThird,{
			third_account: getUrlParam("wechatUnionid"),
            loginType: "wechat",
            client_type: "wechat",
		},true).then(function(res){
		    if(res.head.code == 0){
		    	localStorage.setItem("twUser",JSON.stringify(res.details));
		    	callback();
		    }else{
		    	callback();
		    }
		});
	}else if(getUrlParam("token") && getUrlParam("sign")){
		postRequest(CONFIG.webLoginAuth,getUrlParam("all"),true).then(function(res) {
			if(res.head.code == 0){
				localStorage.setItem("twUser",JSON.stringify(res.details));
				callback();
			}
		});
	}else{
		callback();
	}
};
