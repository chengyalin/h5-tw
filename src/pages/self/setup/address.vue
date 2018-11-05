<template>
	<div class="address has-footer">
		<!--<div class="address-title">-->
			<!--<p class="go-back bg-contain"  @click="goback"></p>
			<p class="font-16 font-darkGray font-bold">收货地址</p>-->
			<!--<p class="font-blue font-14" ></p>-->
		<!--</div>-->
		<div class="address-null" v-if = "noDataFlag">
			<p class="address-img bg-cover"></p>
			<p class="address-null-title font-lightGray font-14">未添加收货地址～</p>
			<router-link to = "/self/addressSave" class="address-add font-white font-14">添加地址</router-link>
		</div>
		<div class="address-list" v-else>
			<ul v-if="selectFlag" class="list">
			  <li class="item" v-for = "(item, index) in address">
			  	<div class="select-item relative">
			  		<div class="produce-content font-darkGray font-14" @click="selectAddress(index)">
						<p class="address-name">
							<span>{{ item.name }}</span> 
							<span>{{ item.phone }}</span>
							<span class="default bg-contain" v-if="item.delivery_default == 'Y'"></span>
						</p>
						<div class="font-12 address-info">{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
					</div>
					<span class="line-normal absolute left bottom right"></span>
			  	</div>
			  </li>
			</ul>
			<ul v-else class="list">
			  <li class="item" v-for = "(item, index) in address">
			      <mt-cell-swipe
			          :right="[
			              {
			                  content: '<div><p>删</p><p>除</p></div>',
			                  style: { background: '#E6361F', color: '#fff', width: '2.1rem'},
			                  handler: () => deleteSection(item)
			              }
			          ]">
			           <div class="produce-content font-darkGray font-14">
							<p class="address-name">
								<span>{{ item.name }}</span> 
								<span>{{ item.phone }}</span>
								<span class="default bg-contain" v-if="item.delivery_default == 'Y'"></span>
								<span @click.stop = "goEdit(item.delivery_id)" class="address-edit bg-contain"></span>
							</p>
							<div class="font-12 address-info">{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
						</div>
						<span class="line-normal absolute left bottom right"></span>
			      </mt-cell-swipe>
			  </li>
			</ul>
			<p v-if="selectFlag" class="tip font-12 font-BBB public-padding-v">选择顺丰到付一般会根据收件地区提前2-3日发货，运输时间不计算租期，起租日会以你实际签收的第二天开始计算，延期收到产品租期会自动往后顺延。</p>
			<router-link to = "/self/addressSave" class="address-add-content font-14 font-white">
				新增地址
			</router-link>
		</div>
	</div>
</template>

<script>
//import Vue from 'vue'
import { CellSwipe } from 'mint-ui'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network'
import { setBodyColor } from '@assets/js/mUtils';

export default {
	data () {
  		return {
  			switchShow:false,
			more:1,
			askData:{
		      	"size":10,
		      	"start":-1
		    },
		    address: [],
		    noDataFlag: false,
		    selectFlag:false,
  		}
  	},
  	mounted(){
  		var that = this
		that.getData();
		setBodyColor(true);
		that.productId = that.$route.query.productId;
		that.selectFlag =  that.$route.query.selectFlag?true:false
  	},
  	methods: {
  		getData () {
  			var that = this;
        	if (that.more == 0 || that.switchShow) {
		        return false;
		    }
        	that.switchShow = true;
        	network(CONFIG.addresses, that.askData).then((res) => {
        		if (res.head.code == 0) {
        			that.address = that.address.concat(res.details) ;
					that.askData.start = res.result.start;
					that.more = res.result.more;
					that.switchShow = false;
					that.noDataFlag = that.address.length == 0?true:false;
        		}
        	})
			
  		},
  		goback(){
  			history.go(-1)
  		},
  		deleteSection (item) {
  			var that = this;
  			network(CONFIG.addressesDelete,{address_id:item.delivery_id}).then((res) => {
  				if(res.head.code == 0){
					var index = that.address.indexOf(item);
					that.address.splice(index,1);
					that.noDataFlag = that.address.length == 0?true:false;
				};
  			})
		},
  		goEdit(id){
  			var that = this;
  			that.$router.push({path: '/self/addressSave', query: {addressId: id}});
  		},
  		selectAddress(index){
  			var that = this;
			eventBus.$emit('selectAddress',that.address[index]);
			var askData = {
				address_id:that.address[index].delivery_id,
			}
			network(CONFIG.addressDefault, askData,{codeFlag:true}).then((res) => {})
	        that.$router.back();
  		}
  	},
  	destroyed(){
		setBodyColor();
	},
	components: {
		'mt-cell-swipe': CellSwipe
	}
}
</script>

<style>

.address .address-title {
	padding: 0 0.8rem;
	height: 2.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.address .address-title .go-back {
	/*display: inline-block;*/
	width: 0.5rem;
	height: 0.8rem;
	/*margin-top: 0.8rem;*/
	background-image: url(~@assets/img/arrow-left-black.png);
}

.address .address-img {
	width: 8.8rem;
	height: 5.5rem;
	margin: 0 auto;
	margin-top: 5.4rem;
	margin-bottom: 1.5rem;
	background-image: url(~@assets/img/address-null.png);
}
.address-add {
	display: block;
	margin: 0 auto;
	width: 8.3rem;
	height: 2.2rem;
	text-align: center;
	line-height: 2.2rem;
	background: #36646E;
}
.address .address-null-title {
	margin: 0 auto 9.5rem;
	text-align: center;
}
/* mint ui */
.address .mint-cell-wrapper .mint-cell-title {
	flex: 0;
	-webkit-box-flex: 0;
}
.address .mint-cell-swipe .mint-cell-wrapper {
	padding: 0.9rem;
	padding-left: 0;
	margin-left: 0.9rem;
}
.address .mint-cell {
	/*height: 3.7rem;*/
	/*background: red;*/
}
.address .produce-content{
		width: 18rem;
}
.address .produce-content p {
	line-height: 1.2rem;
	margin-right: 2.5rem;
}
.address .produce-content .default {
	display: inline-block;
	width: 1.2rem;
	height: 0.7rem;
	background-image: url(~@assets/img/default.png);
}
.address .address-info {
	margin-right: 2.5rem;
}
.address .mint-cell-swipe-button p{
	text-align: center;
	/*height: 2.2rem;*/
}
.address .mint-cell-swipe-button {
	line-height: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	/*margin: auto;*/
}
.address .mint-cell-swipe-button p:first-child {
	margin-top: 0.5rem;
}
.address .address-name {
	position: relative;
}
.address .address-edit {
	display: inline-block;
	width: 0.6rem;
	height: 0.6rem;
	background-image: url(~@assets/img/shoppingCart-edit.png);
	position: absolute;
	right: -1.5rem;
	top: 0.2rem;
}
.address .address-add-content {
	display: block;
	height: 2.2rem;
	line-height: 2.2rem;
	background: #36646E;
	text-align: center;
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
}
.address .tip{
	margin-top: 0.5rem;
}
.address .select-item{
	margin:0 0.9rem;
	padding: 0.9rem 0;
}
.address .select-item .produce-content{
	width: auto;
}
.address .select-item .produce-content p {
	margin: 0;
}
.address .select-item .address-info {
	margin: 0;
}
</style>
