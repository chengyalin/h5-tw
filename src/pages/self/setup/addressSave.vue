<template>
	<div class="addressSave">
		<div class="address-title">
			<p class="go-back bg-contain" @click="goback"></p>
			<p class="font-16 font-darkGray font-bold">收货地址</p>
			<p class="font-blue font-14" @click="submitForm">完成</p>
		</div>
		<div class="addressSave-list">
			<ul>
				<li @click="isShowAddress=true">
					<p>{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</p>
					<span class="line-normal"></span>
				</li>
				<li>
					<input type="text" placeholder="详细地址" v-model="askData.address"/>
					<span class="line-normal"></span>
				</li>
				<li>
					<input type="text" placeholder="收货人姓名" v-model="askData.name"/>
					<span class="line-normal"></span>
				</li>
				<li>
					<input type="text" placeholder="联系方式" v-model="askData.phone"/>
					<span class="line-normal"></span>
				</li>
				<li class="address-default ">
					<div class="address-no-select bg-contain"  :class = "{'checked': askData.default == 'Y'}"  
						 @click="defaultShow"></div>
					<span>设为默认地址</span>

				</li>
			</ul>
		</div>
		<div class="public-popup-shadow" v-if="isShowAddress" @click="isShowAddress = !isShowAddress">
		　　<div class="bg-white citys">
				<mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { Picker } from 'mint-ui';
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network'
import  myaddress  from '@assets/js/citys.json'
import { setBodyColor } from '@assets/js/mUtils';
Vue.component(Picker.name, Picker);


export default {
	data () {
  		return {
  			addressDefault: false,
  			askData:{
				name:"",
				phone:"",
				address:"",
				city: "",
				default:"N",
			},
			cityData:[],
  			isShowAddress:false,
  			myAddressSlots: [
				{
　　　　　　　　　　flex: 1,
　　　　　　　　　　defaultIndex: 1,
　　　　　　　　　　values: Object.keys(myaddress), //省份数组
　　　　　　　　　　className: 'slot1',
　　　　　　　　　　textAlign: 'center'
　　　　　　　　}, {
　　　　　　　　　　divider: true,
　　　　　　　　　　content: '-',
　　　　　　　　　　className: 'slot2'
　　　　　　　　}, {
　　　　　　　　　　flex: 1,
　　　　　　　　　　values: [],
　　　　　　　　　　className: 'slot3',
　　　　　　　　　　textAlign: 'center'
　　　　　　　　},{
　　　　　　　　　　divider: true,
　　　　　　　　　　content: '-',
　　　　　　　　　　className: 'slot4'
　　　　　　　　},{
　　　　　　　　　　flex: 1,
　　　　　　　　　　values: [],
　　　　　　　　　　className: 'slot5',
　　　　　　　　　　textAlign: 'center'
　　　　　　　　}
  			],
  			myAddressProvince:'省份',
　　　　　　	myAddressCity:'城市',
　　　　　　	myAddresscounty:'区县',
  		}
  	},
  	mounted(){
  		var that = this
		setBodyColor(true);
  		if (that.$route.query.addressId){
	  		network(CONFIG.addressesInfo, {'address_id': that.$route.query.addressId}).then((res) => {
				if (res.head.code == 0) {
					var list = res.details
					list.address_id = that.$route.query.addressId
					list.default = res.details.delivery_default
					that.askData = list

					that.myAddressProvince = that.askData.province
			　　　　	that.myAddressCity = that.askData.city
			　　　	that.myAddresscounty = that.askData.area

				}
			})
	  	}
//		that.getData()

		this.$nextTick(() => { //vue里面全部加载好了再执行的函数 （类似于setTimeout）
　　　　　　this.myAddressSlots[0].defaultIndex = 0
　　　　　　// 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
　　　　　　
　　　　});

  	},
  	methods: {
  		goback(){
  			history.go(-1)
  		},
		defaultShow(){
			var that = this
			that.askData.default = (that.askData.default == 'N')?'Y':'N'
		},
		onMyAddressChange(picker, values) {
　　　　　　if(myaddress[values[0]]){ //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
　　　　　　　　picker.setSlotValues(1,Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
　　　　　　　　picker.setSlotValues(2,myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
　　　　　　　　this.myAddressProvince = values[0];
　　　　　　　　this.myAddressCity = values[1];
　　　　　　　　this.myAddresscounty = values[2];
　　　　　　}
		},

		// 关闭三级联动
//　　　	closeShowAddress (e){
//　　　　　　if(e.target == this.$refs.selectAddress){
//　　　　　　　　this.isShowAddress = !this.isShowAddress;
//　　　　　　}
//　　　　},

		submitForm () {
			var that = this;
			var reg_tel = /^1\d{10}$/;
			if (that.myAddressProvince == '省份'&& that.myAddressCity == '城市' && that.myAddresscounty == '区县' ) {
				Vue.toast('省份城市区县不能为空',{duration:1500})
		      	return false;
			}
			if (that.myAddressProvince == undefined || that.myAddressCity == undefined || that.myAddresscounty == undefined) {
				Vue.toast('省份城市区县不能为空',{duration:1500})
		      	return false;
			}
			if(!that.askData.address || that.askData.address.trim().length <1 ) {
				Vue.toast('详细地址不能为空',{duration:1500})
		      	return false;
			};
			if(!that.askData.name || that.askData.name.trim().length <1 ) {
				Vue.toast('收货人姓名不能为空',{duration:1500})
		      	return false;
			};
			if(!reg_tel.test(that.askData.phone)) {
				Vue.toast('手机不合法',{duration:1500})
		      	return false;
			};
			that.askData.default = that.askData.default
			that.askData.province = that.myAddressProvince
			that.askData.city = that.myAddressCity
			that.askData.area = that.myAddresscounty
			var thisUrl = that.askData.address_id?CONFIG.addressesUpdate:CONFIG.addressesSave;
			network(thisUrl, that.askData).then((res) => {

				if(res.head.code == 0) {
					Vue.toast('提交成功',{duration:1500})
//					var str = that.askData.address_id ? '修改地址成功' : '添加地址成功';
//					Vue.toast(str,{className: ['myToast-success']});
					setTimeout(() => {
						history.go(-1);
					},1000)
				}
			})

　　　　	},


  	},
	destroyed(){
		setBodyColor();
	},
	components: {
//		'mt-picker': Picker
	}
}
</script>

<style>
.address-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.address-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}
.addressSave-list {
	padding: 0 0.9rem;
}
.addressSave-list li {
	height: 2.6rem;
	line-break: 2.6rem;
}
.addressSave-list li input {
	height: 2.6rem;
	line-height: 2.6rem;
	width: 100%;
}
.addressSave-list li p {
	line-height: 2.6rem;
}
.address-default {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.address-default span{
	display: inline-block;
}
.address-no-select {
	width: 0.8rem;
	height: 0.8rem;
	border: 1px solid #666666;
	border-radius: 50%;
	margin-right: 0.5rem;
	display: inline-block;
}
.addressSave .address-default .checked{
	width: 0.9rem;
	margin-right: 0.5rem;
	border: none;
	background-image: url(~@assets/img/self/icon-select.png);
}
.citys {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
