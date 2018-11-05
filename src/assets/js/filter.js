import Vue from 'vue'

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Vue.filter('formatMoney', function(value) {
    return "¥"+ parseFloat(value).toFixed(2);
});

Vue.filter('formatMoneyPositiveNumber', function(value) {
	value = value && value > 0 ? value : 0;
    return "¥"+ parseFloat(value).toFixed(2);
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
    return value>0?[year, month, day].map(formatNumber).join('.'):'';
});

//YYYY-MM-DD

Vue.filter('formatTime6', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].map(formatNumber).join('-');
});

//MM-DD

Vue.filter('formatTime7', function(value) {
	var date = new Date(parseInt(value));
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [ month, day].map(formatNumber).join('-');
});

//MM.DD

Vue.filter('formatTime8', function(value) {
	var date = new Date(parseInt(value));
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [ month, day].map(formatNumber).join('.');
});

//YYYY.MM.DD hh:mm:ss

Vue.filter('formatTime9', function(value) {
	var date = new Date(parseInt(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':');
});

//MM.DD hh:mm

Vue.filter('formatTime10', function(value) {
	var date = new Date(parseInt(value));
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return [month, day].map(formatNumber).join('.') + ' ' + [hour, minute].map(formatNumber).join(':');
});

//2小时前 发布

Vue.filter('formatTime11',function(value){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;
	var now = new Date().getTime();
	var diffValue = now - value;
	var result = "";
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
		var time = new Date(parseInt(value));
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
	return result + " 发布"
})

//countDown ss:dd
Vue.filter('formatCountDown', function(value) {
	var diff = parseInt(value);
	var minute =  Math.floor(diff / (1000 * 60 ));
    var second =  Math.floor((diff %(1000 * 60 )/1000));
    return (diff <= 0 || !diff)?"0:0":[minute,second].map(formatNumber).join(":");
});

//countDown 分：秒
Vue.filter('formatCountDown2', function(value) {
	var diff = parseInt(value);
	var minute =  Math.floor(diff / (1000 * 60 ));
    var second =  Math.floor((diff %(1000 * 60 )/1000));
    return (diff <= 0 || !diff)?"0分0秒":minute + '分' + second + '秒';
});

//取整
Vue.filter('formatInt', function(value) {
	return value?parseInt(value):0
});
//获取小数点+后面小数
Vue.filter('formatDecimal', function(value) {
	value = parseFloat(value).toFixed(2)
	value = value.split(".");
	if(value.length && value.length>1){
		return '.'+ value[1]
	}else{
		return '.00'
	}
});
//截取两位小数
Vue.filter('formatSub', function(value) {
	return '¥'+ (parseInt(value*100)/100).toFixed(2);
});
