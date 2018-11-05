<template>
	<div class="calendarH5-page">
		<calendar :tplData = "tplData" :mainData = "mainData" :calendarFlag = "calendarFlag" :askData = "askData" :price = "price" @calendarHidden="calendarHidden" @submit="submit" ref="calendar"></calendar>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import calendar from '@components/calendar';
import { getDiffByStamp } from '@assets/js/mUtils'

export default {
	data () {
  		return {
  			mainData:{
  				products:{},
  				coupons:[],
  				similar_products:[],
  				videos:[],
  				product_appraise:{
  					list:[]
  				},
  			},
  			calendarFlag:true,//日期选择器弹出框
  			price:[],//长租价格曲线
            tplData:{//时间选择器数据
            		productId:0,
	            	setStatus:0,
	            	startStamp:null,
	            	endStamp:null,
	            	optionalDate:[],
	            	hasEmptyGrid:[],
	            	empytGrids:[],
	            	public_year:[],
	            	public_month:[],
	            	public_days:[],
	            	clientFlag:'app'
            },
            askData:{
            		total:1
            },
            client:'',
  		}
  	},
  	created(){
  		var that = this;
		window.initAndroid = that.initAndroid;
  	},
  	mounted(){
		var that = this;
		that.initIOS();
	},
	methods:{
		initAndroid(message){
			var that = this;
			that.client = message.client;
			that.productId = message.product_id;
			that.tplData.productId = that.productId;
            that.askData.total = message.count || 1;
            that.token = message.token;
            that.flag = message.flag;
            that.province = message.province;
            if(message.begin_date){
                	that.askData.begin_date = message.begin_date;
    				that.askData.end_date = message.end_date;
            };
            that.initData();
		},
		initIOS(){
			var that = this;
	        	function connectToSwiftWebViewBridge(callback) {
	            if (window.SwiftWebViewBridge) {
	                callback(SwiftWebViewBridge);
	            } else {
	                document.addEventListener('SwiftWebViewBridgeReady', function() {
	                    callback(SwiftWebViewBridge);
	                }, false);
	            }
	        }
	        connectToSwiftWebViewBridge(function(bridge) {
	            bridge.init(function(message, responseCallback) {
	                that.productId = message.product_id;
	                that.tplData.productId = that.productId;
	                that.askData.total = message.count || 1;
	                that.token = message.token;
	                that.params = message.params;
	                that.city = message.city;
	                that.tplData.clientFlag = 'iOS';
	                if(message.begin_date){
		                	that.askData.begin_date = message.begin_date;
		    				that.askData.end_date = message.end_date;
	                };
	                that.initData();
	                responseCallback({'JS Responds':'收到啦收到啦'});
	            });
	            bridge.registerHandlerForSwift('WXFHandler', function(data, responseCallback) {
	                var responseData = {
	                    'JS Responds': '^ triggered' 
	                };
	                responseCallback(responseData);
	            });
	            window.WXFSendDataToSwift = function() {
	                bridge.sendDataToSwift('Say Hello Swiftly to Swift');
	            };
	        });
		},
		initData(){
			var that = this;
			network(CONFIG.product,{ "product_id": that.productId }).then((res) => {
				that.mainData = res.details;
			});
            network(CONFIG.productPrice,{ "product_id": that.productId }).then((res) => {
				that.price = res.result.price;
				network(CONFIG.optionalDate,{ "product_id": that.productId }).then((res) => {
					var optionalDate = res.details.optionalDate;
					optionalDate.map(function(item,index){
						item.begin = item.begin.substring(0, 10) + "000";
						item.end = item.end.substring(0, 10) + "000";
						if(!index){
							that.firstDayStamp = item.begin;
						}
					})
					that.tplData.optionalDate = optionalDate;
					if(that.askData.begin_date && that.askData.end_date) {
	        				that.askData.time = getDiffByStamp(that.askData.begin_date, that.askData.end_date);
		        		}
					that.$refs.calendar.initCalendar();
				});
			});
			if(that.province){
				network(CONFIG.productSendDay,{province: that.province},{codeFlag:true}).then((res) => {
					if(res.head.code == 0){
						localStorage.setItem("mapSendDay",res.details.sendDay);
					}
				});
			}else{
				localStorage.setItem("mapSendDay",3);
			}
		},
		//隐藏时间选择器
		calendarHidden(){
			var that = this;
			if(that.client == 'android'){
				window.android.back()
			}else{
				SwiftWebViewBridge.callSwiftHandler("iOSCalenderCloseVCBridge", null, null);
			}
		},
		getShortRent(){
			var that = this;
			var averagePrice = 0;
			if(that.askData.time < that.price[0].date) {
				averagePrice = that.price[0].price;
			} else if(that.askData.time > that.price[that.price.length - 1].date) {
				averagePrice = that.price[that.price.length - 1].price;
			} else {
				for(let i = 0; i < that.price.length; i++) {
					if(that.askData.time == that.price[i].date) {
						averagePrice = that.price[i].price;
						break;
					};
				};
			};
			return averagePrice
		},
		submit(){
			var that = this;
			var result = {
				begin_date:that.tplData.startStamp,
				end_date:that.tplData.endStamp,
				averageRent:parseFloat(that.tplData.averagePrice * that.askData.total).toFixed(2),
				averageRentAll:parseFloat(that.tplData.averagePrice * that.tplData.diff * that.askData.total).toFixed(2),
				time:that.tplData.diff,
				flag:that.flag,
				params:that.params
			};
			if(that.client == 'android'){
				window.android.androidJs(JSON.stringify(result))
			}else{
				SwiftWebViewBridge.callSwiftHandler("iOSCalenderParamBridge", result, null);
			}
		}
	},
	components: {
	    calendar
	}
}
</script>

<style>
</style>