import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
/**
 * 时间戳相差的天数
 */
export const getDiffByStamp = (stamp1,stamp2) => {
	var diffValue = Math.abs(stamp1 - stamp2);
  	return Math.floor(diffValue / (24 * 3600 * 1000)) + 1
}

//倒计时获取
export const  getCountDownTime = (dateTimeStamp,s)=> {
  var now =(new Date().getTime()/1000).toFixed(0);
  var end = parseInt(dateTimeStamp)/1000 + 30 * 60;
	var diffValue = end - now ;
	return s?(parseInt(diffValue/60)):(parseInt(diffValue%60))
}

//获取本地图片地址
export const getObjectURL = file => {
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

//获取base64图片
export const getBase64Image = img => {
    var canvas = document.createElement("canvas");
    var width = img.width;
    var height = img.height;
    if( width > 750 ){
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
//设置背景颜色
export const setBodyColor = (type,value) => {
	var value = value || 'bg-white';
	var body = document.getElementsByTagName("body")[0];
	if(type){
		body.classList.add(value);
	}else{
		body.classList.remove(value);
	}
};
//联系客服 美恰
export const publicChat = () => {
	if(!window.localStorage.getItem("twUser")){
		if(IFWECHAT){
			window.open(CONFIG.wechatAuthorization)
		}else{
			window.location.href = '#/login'
		}
		return false;
	}
	if(localStorage.getItem("userbaseInfo") || !localStorage.getItem("twUser")){
	    _MEIQIA('showPanel');
	}else{
		network(CONFIG.userbaseInfo,{},{codeFlag:true}).then((res) => {
			if(res.head.code == 0){
				var userbaseInfo = res.details;
				_MEIQIA('clientId', userbaseInfo.uid);
		    		_MEIQIA('metadata',userbaseInfo);
		    		localStorage.setItem('userbaseInfo',JSON.stringify(userbaseInfo));
			}
			_MEIQIA('showPanel');
		});
	}
}

//获取运输时间
export const getMapSendDay = (callback) => {
	var geolocation = new qq.maps.Geolocation("DYYBZ-54QES-UTTOU-6GJXO-YWY3O-22F4M", "tanwuapp");
	geolocation.getIpLocation(function(position){
		var city = position.city.replace("市",'').replace("区",'');
		var province = position.province.replace("省",'');
		localStorage.setItem("province",province);
		localStorage.setItem("city",city);
		var adcode = position.adcode;
		network(CONFIG.productSendDay,{province: position.province},{codeFlag:true}).then((res) => {
			if(res.head.code == 0){
				localStorage.setItem("mapSendDay",res.details.sendDay);
				if(callback){
					callback();
				}
			}
		});
	});
}

//获取地址
export const getMapAddress = (callback) => {
	var geolocation = new qq.maps.Geolocation("DYYBZ-54QES-UTTOU-6GJXO-YWY3O-22F4M", "tanwuapp");
	geolocation.getIpLocation(function(position){
		var city = position.city.replace("市",'').replace("区",'');
		localStorage.setItem("city",city);
		var province = position.province.replace("省",'');
		localStorage.setItem("province",province);
		if(callback){
			callback();
		}
	});
}

//获取所在端
export const getClient = (that) => {
	if(IFALIPAY){
		that.publicClient = 'alipay'
	}else if(IFWECHAT){
		that.publicClient = 'wechat'
	}else if(IFPCFLAG){
		that.publicClient = 'pc'
	}else if(IFUC){
		that.publicClient = 'uc'
	}
}

//获取时间
export const getTime = value => {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].join('-');
}

//登陆验证
Vue.prototype.goLogin = function(){
	var that = this;
	if(!window.localStorage.getItem("twUser")){
		if(IFWECHAT){
			window.open(CONFIG.wechatAuthorization)
		}else{
			location.href = "#/login"
		}
		return false;
	}else{
		return true;
	}
}

//返回
Vue.prototype.goBack = function(){
	var that = this;
	window.history.go(-1);
	/*
	if(document.referrer === ''){
		location.href = "#/"
	}else{
		window.history.go(-1)
	}
	*/
}

//打开完整域名
Vue.prototype.See = function(url){
	if(url && url.length){
		window.location.href = url
	}
}

//友盟统计
Vue.prototype.umeng = function(category,action,label){
	if(typeof _czc != "undefined"){
		_czc.push(['_trackEvent',category,action,label]);
	}
}
//获取参数 不知道为什么app的获取不了query 有毒
/*
Vue.prototype.getUrlParam = function(name) {
	var url = window.location.search;
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
        var str = url.substr(1);   
        strs = str.split("&");   
        for(var i = 0; i < strs.length; i ++) {   
             theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
        }   
    };
    return name == 'all'?theRequest:theRequest[name];   
};
*/