<template>
	<transition name = "anim-up">
		<div class="public-popup fixed top right bottom left fixd-center" v-show = "calendarFlag">
			<div class="calendar-page relative width-full height-full flex flex-column" :class="{'bg-blue':tplData.clientFlag,'bg-gradient-normal':!tplData.clientFlag}">
				<div class="header left top right relative">
					<p class="select-item-wrap font-bold font-20">
						<span v-if = "tplData.startStamp" class="font-white">{{tplData.startStamp | formatTime7}} 起租</span>
						<span v-else class="font-white">请选择 起租日</span>
						<span :class = "{'font-white':!tplData.startStamp || tplData.endStamp}">/</span>
						<span v-if = "tplData.endStamp" class="font-white">{{tplData.endStamp | formatTime7}} 归还</span>
						<span v-else :class = "{'font-white':!tplData.startStamp}">{{tplData.startStamp?'请选择':''}}归还日</span>
					</p>
					<span v-if="tplData.clientFlag != 'iOS' && tplData.public_days.length" class="close absolute" @click="calendarHidden"></span>
					<p v-if = "tplData.startStamp && tplData.endStamp" class="tip font-12">共{{tplData.diff}}天，平均{{tplData.averagePrice * askData.total | formatMoney}}/天，合计{{tplData.averagePrice * tplData.diff * askData.total | formatMoney}}</p>
					<p v-else-if = "tplData.startStamp" class="tip font-12">租期越长价格越低哟～</p>
					<ul v-if="tipFlag" class="tip-list font-12">
						<li>该产品最少租赁{{mainData.products?mainData.products.minDay:mainData.product.minDay}}天，租期越长价格越低；</li>
						<li>实际起租日以收到产品后的第二天开始计算；</li>
						<li>非广东省用户请预留2-3天作为快递运输时间。</li>
					</ul>
					<p v-else-if = "!tplData.startStamp" class="tip font-12">展开租赁说明</p>
					<span class="tip-btn" :class="{active:tipFlag}" @click="tipToggle"></span>
					<ul class="weeks-list text-center display-flex-between font-bold font-12">
						<li v-for="(item,index) in weeks">{{item}}</li>
					</ul>
				</div>
				<div class="month-list bg-white">
					<div v-for="(publicItem,publicIndex) in tplData.public_days" class="relative">
			        		<div class="month absolute center width-full text-center">{{tplData.public_month[publicIndex]}}</div>
			            <div class="day-list font-darkGray font-12 clearfix text-center relative">
			                <div v-if="tplData.hasEmptyGrid[publicIndex]" class="item float-left" v-for="(item,index) in tplData.empytGrids[publicIndex]"></div>
			                <div class="item float-left relative flex-center flex-column" :class="{'active':(item.stamp >= tplData.startStamp && item.stamp <= tplData.endStamp),'ends first':(item.stamp == tplData.startStamp),'ends last':(item.stamp == tplData.endStamp),'disable':(item.ifSelect || (tplData.filterBegin && (item.stamp < tplData.filterBegin ||  item.stamp > tplData.filterEnd)))}" v-for="(item,index) in tplData.public_days[publicIndex]" @click="selectDate(item.stamp,(item.ifSelect?'disable':'default'),(tplData.filterBegin && (item.stamp < tplData.filterBegin ||  item.stamp > tplData.filterEnd))?'disable':'')">
			                		<p class="relative">{{item.num}}</p>
			                </div>
			            </div>
			        </div>
				</div>
			    <div class="confirm-btn absolute bg-BBB font-white font-bold text-center" :class="{'active':tplData.startStamp && tplData.endStamp}" @click="submit">
			    		<span class="vertical-middle">确认租期</span>
			    		<img class="vertical-middle icon" src="~@assets/img/arrow-right-white.png"/>
			    </div>
			</div>
		</div>
	</transition>
</template>

<script>
import Vue from 'vue';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { getDiffByStamp } from '@assets/js/mUtils';
export default {
  	data() {
  		return {
  			tipFlag:false,
  			weeks:['日', '一', '二', '三', '四', '五', '六']
  		}
  	},
  	mounted() {
  		var that = this;
  		//这里有毒 为啥不能初始化一定要手动定义 
  		//因为你他妈是个瞎子！！！
  		//that.$set(that,'tipFlag',true)
  	},
  	props:['tplData','mainData','calendarFlag','askData','price'],
  	methods:{
  		initCalendar: function() {
        		var that = this;
        		var trueToday = new Date();
        		var daysCount = new Date(trueToday.getFullYear(), trueToday.getMonth()+1, 0 ).getDate();
        		//这里应该是  如果是最后一天的话就从下个月开始（我猜的）
        		var today = daysCount == trueToday.getDate()? new Date( Date.parse(new Date())+ 24 * 60 * 60 * 1000):trueToday;
    			var day = today.getDate();
	        	var month = today.getMonth();
	        	var year = today.getFullYear();
    			for(var i = 0 ; i < 4 ; i++){
    				var _month = month+1;
				that.tplData.public_year[i] = year;
				//第一个月份加年份 2.0版本删除
    				//that.tplData.public_month[i] = _month == 1 ? year+"."+_month : _month;
    				that.tplData.public_month[i] = _month;
    				that.calculateEmptyGrids(year, month, i);
        			that.calculateDays(year, month, i);
        			if(month > 10 ){
					year ++ ;
					month = 0;
				}else{
					month ++ ;
				};
    			};
			that.tplData.setStatus = 0;
			if(that.askData.begin_date){
				that.tplData.startStamp = that.askData.begin_date;
				that.tplData.endStamp = that.askData.end_date;
				that.tplData.diff = that.askData.time;
				that.tplData.averagePrice = that.getShortRent();
			};
			that.tipFlag = true
		},
		calculateEmptyGrids :function(year, month, status) {
			var that = this;
			var firstDayOfWeek = new Date(year, month , 1).getDay();
			let empytGrids = [];
			if(firstDayOfWeek > 0) {
				for(let i = 0; i < firstDayOfWeek; i++) {
					empytGrids.push(i);
				};
				that.tplData.hasEmptyGrid[status] = true;
				that.tplData.empytGrids[status] = empytGrids;
			} else {
				that.tplData.hasEmptyGrid[status] = false;
				that.tplData.empytGrids[status] = [];
			}
		},
		//日期选择器有待优化
		calculateDays : function(year, month, status) {
			var that = this;
			var days = [];
			var thisMonthDays = new Date(year, month+1, 0).getDate();
			var optional = that.tplData.optionalDate;
			for(let i = 1; i <= thisMonthDays; i++) {
				let thisStamp = Date.parse(new Date(year, month , i));
				let ifSelect = true;
				for(let j = 0; j < optional.length; j++) {
					if(thisStamp >= optional[j].begin && thisStamp <= optional[j].end) {
						ifSelect = false;
					};
				};
				days.push({
					"num": i,
					"stamp": thisStamp,
					"ifSelect": ifSelect
				});
			};
			that.tplData.public_days[status] = days;
		},
		calendarClear:function(){
			var that = this;
			var dataSave = that.tplData;
			that.tplData.setStatus = 0;
			that.tplData.startStamp = that.askData.begin_date || null;
			that.tplData.endStamp = that.askData.end_date || null;
			that.tplData.diff = that.askData.time || null;
			that.tplData.averagePrice = that.getShortRent() || null;
			Vue.set(that.tplData,'filterBegin', null);
			Vue.set(that.tplData,'filterEnd', null);
		},
		calendarHidden:function(){
			var that = this;
			if(!that.tplData.noCalendarClearFlag){
				that.calendarClear();
			}
           	that.$emit('calendarHidden');
		},
		selectDate:function(stamp,init,filter){
	        	var that = this;
		    if(init == "disable" || filter == "disable"){
				return false;
			};
			that.tipFlag = false;
			var optional = that.tplData.optionalDate;
			var selectStamp = stamp;
			if(that.tplData.setStatus == 0) {
				that.tplData.startStamp = selectStamp ;
				that.tplData.setStatus = 1 ;
				that.tplData.endStamp = null ;
				that.tplData.diff = 0 ;
				if( localStorage.getItem("mapSendDay") && that.tplData.startStamp < Date.parse(new Date())+(localStorage.getItem("mapSendDay")-1)*24*60*60*1000){
					Vue.toast("预计运输时间为"+localStorage.getItem("mapSendDay")+"天,请预留时间",{duration:1500})
				};
				if((that.mainData.products && that.mainData.products.productState != 2) || (that.mainData.product && that.mainData.product.productState != 2)) {
					network(CONFIG.optionalEndDate,{"product_id": that.tplData.productId,"begin_date": selectStamp}).then((res) => {
					    if(res.head.code == 0){
						    	var _filterBegin = parseInt(res.details.begin.substring(0, 10) + "000");
						    	var _filterEnd =  parseInt(res.details.end.substring(0, 10) + "000");
						    	Vue.set(that.tplData,'filterBegin', _filterBegin);
						    	Vue.set(that.tplData,'filterEnd', _filterEnd);
						}
					});
				};
			} else {
				if(that.tplData.startStamp == selectStamp) {
					return false;
				};
				if(selectStamp < that.tplData.startStamp) {
					that.tplData.diff = getDiffByStamp(selectStamp, that.tplData.startStamp);
					that.tplData.endStamp = that.tplData.startStamp;
					that.tplData.startStamp = selectStamp;
					if( localStorage.getItem("mapSendDay") && that.tplData.startStamp < Date.parse(new Date())+(localStorage.getItem("mapSendDay")-1)*24*60*60*1000){
						Vue.toast("预计运输时间为"+localStorage.getItem("mapSendDay")+"天,请预留时间",{duration:1500})
					};
				} else {
					that.tplData.diff = getDiffByStamp(selectStamp, that.tplData.startStamp);
					that.tplData.endStamp = selectStamp;
				};
				that.tplData.averagePrice = that.getShortRent();
				that.tplData.setStatus = 0;
				Vue.set(that.tplData,'filterBegin', null);
				Vue.set(that.tplData,'filterEnd', null);
			};
		},
		//根据价格曲线计算短租价格
		getShortRent(){
			var that = this;
			var averagePrice = 0;
			if(that.tplData.diff < that.price[0].date) {
				averagePrice = that.price[0].price;
			} else if(that.tplData.diff > that.price[that.price.length - 1].date) {
				averagePrice = that.price[that.price.length - 1].price;
			} else {
				for(let i = 0; i < that.price.length; i++) {
					if(that.tplData.diff == that.price[i].date) {
						averagePrice = that.price[i].price;
						break;
					};
				};
			};
			return averagePrice
		},
		tipToggle(){
			var that = this;
			that.tipFlag = !that.tipFlag;
		},
		submit:function(){
			var that = this;
			var minDay = that.mainData.products?that.mainData.products.minDay:that.mainData.product.minDay;
			if(that.tplData.diff < minDay){
				Vue.toast("该商品起租时间不能低于"+minDay+"天",{duration:1500})
				return false;
			}
			if(that.tplData.startStamp && that.tplData.endStamp){
				if(!that.tplData.clientFlag){
					that.$emit('calendarHidden');
				}
	           	that.$emit('submit');
			}	
		}
  	}
  	
}
</script>

<style>
.calendar-page .header{
	padding:0 1rem;
	color: rgba(255,255,255,0.4);
	box-shadow: 0 0 1.3rem rgba(0,0,0,0.5);
	z-index: 2;
}
.calendar-page .header .close{
	top: 0.3rem;
	right: 0.4rem;
	width: 1.6rem;
	height: 1.6rem;
	background: url(~@assets/img/close-white.svg) no-repeat center;
	background-size:0.8rem ;
}
.calendar-page .select-item-wrap{
	padding-top: 1rem;
	padding-bottom: 0.5rem;
}
.calendar-page .header .tip{
	padding-bottom: 1.2rem;
}
.calendar-page .header .tip-list{
	padding-bottom: 0.5rem;
	line-height: 1.33;
}
.calendar-page .header .tip-list li{
	position: relative;
	padding-left: 0.7rem;
	margin-bottom: 0.1rem;
}
.calendar-page .header .tip-list li:before{
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	width: 4px;
	height: 4px;
	border-radius: 100%;
	border: 2px solid rgba(255,255,255,0.4);
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
}
.calendar-page .header .tip-btn{
	position: absolute;
	right: 0.7rem;
	top: 2.6rem;
	width: 1rem;
	height: 1rem;
	background: url(~@assets/img/arrow-up-white.png) no-repeat center;
	background-size:0.5rem auto;
}
.calendar-page .header .tip-btn.active{
	top: auto;
	bottom: 2.3rem;
	background-image:url(~@assets/img/arrow-down-white.png) ;
}
.calendar-page .weeks-list{
	padding: 0.5rem 0;
}
.calendar-page .weeks-list li{
	width: 14.285%;
}
.calendar-page .month-list{
	height: 0;
	flex-grow: 1;
	-webkit-flex-grow: 1;
	top: 7.7rem;
	left: 0;
	bottom: 0;
	right: 0;
	padding: 0.5rem 0 5rem 0;
	overflow-y: auto;
	color: rgba(255,255,255,0.6);
}
.calendar-page .month{
	font-size: 9rem;
	color: #F7F7F7;
	z-index: 1;
}
.calendar-page .day-list{
	padding: 0 1rem;
	z-index: 2;
}
.calendar-page .day-list .item{
	width: 14.285%;
	height: 2.6rem;
}
.calendar-page .day-list .item.active{
	color: #3ED8C4;
	background: #ebfbf9;
}
.calendar-page .day-list .item.ends{
	color: #FFFFFF;
	background: #3ED8C4;
}
.calendar-page .day-list .item.first:after{
	content: '起租';
	position: relative;
	font-size: 0.5rem;
}
.calendar-page .day-list .item.last:after{
	content: '寄回';
	position: relative;
	font-size: 0.5rem;
}
.calendar-page .day-list .item.disable{
	color: #BBBBBB;
}
.calendar-page .confirm-btn{
	width: 4.8rem;
	line-height: 1;
	padding: 0.9rem 0;
	border-radius: 0.1rem;
	box-shadow: 0 0 0.5rem rgba(187,187,187,0.5);
	right: 1.3rem;
	bottom: 1.3rem;
	z-index: 3;
}
.calendar-page .confirm-btn.active{
	background-color: #36646E;
	box-shadow: 0 0 0.5rem rgba(54,100,100,0.5);
}
.calendar-page .confirm-btn .icon{
	width: 0.4rem;
}
</style>
