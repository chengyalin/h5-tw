import Vue from 'vue'
import axios from "axios"
import md5 from 'js-md5'
import { CONFIG } from '@assets/js/config';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['key'] = md5("TWAPPTW");
if(IFALIPAY){
	axios.defaults.headers.common['alipayVersion'] = '2.0.0';
}else{
	axios.defaults.headers.common['version'] = '2.0.0';
}

export function network(url, params, code) {
	var params = params || {};
	var code = code || {};
	if(localStorage.getItem("twUser") && !params.token) {
		params.token = JSON.parse(localStorage.getItem("twUser")).token || '';
	};
	axios.defaults.headers.common['token'] = params.token;
	return axios({
		method: code.method || 'POST',
		url: url,
		data: params,
		params: params,
		timeout: 50000,
	}).then((res) => {
		return new Promise(function(resolve, reject) {
			//console.log(url);
			//console.log(params);
			//console.log(res.data)
			if(res.data.head && res.data.head.code && !code.codeFlag) {
				if(res.data.head.code == 1) {
					Indicator.close();
					localStorage.removeItem('twUser');
					localStorage.removeItem("selfInfo");
					//window.localStorage.clear();
					if(IFWECHAT){
						location.href = CONFIG.wechatAuthorization;
						//window.open(CONFIG.wechatAuthorization)
					}else{
						location.href = "#/login"
					}
				} else if(res.data.head.code == 100 || res.data.head.code == 101 || res.data.head.code == 201) {
					Indicator.close();
					Vue.toast(res.data.head.message,{duration:1500});
				} else if(res.data.head.code == 500) {
					Indicator.close();
					Vue.toast("网络异常",{duration:1500});
				} else {
					resolve(res.data);
				}
			} else {
				resolve(res.data);
			};
		})
	}).catch(error => {
		Vue.toast("请检查你的网络",{duration:1500});
	})
}