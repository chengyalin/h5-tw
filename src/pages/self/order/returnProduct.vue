<template>
	<div v-cloak class="returnProduct-page public-card-page">
		<div class="returnProduct-header bg-white public-padding-v">
			<div class="radius-1 public-card-content">
				<div class="product-wrap clearfix" v-for="(item,index) in listData" v-if="index < showNum || showFlag">
					<div class="content float-left">
						<p class="name line-ellipsis">{{item.productName}}</p>
						<div v-if="!item.skuName">
							<div class="point-item font-grey font-12 relative clearfix">
								<p class="vertical-middle">{{item.rentBeginDatetime | formatTime2}}-{{item.rentEndDatetime | formatTime2}} ({{item.orderTime}}{{item.renewDays == 0?'':' + '+item.renewDays}}天)</p>
								<span class="font-BBB float-right">×{{item.productCount}}</span>
							</div>
						</div>
						<div v-else>
							<div class="point-item font-grey font-12 relative long">
								<p class="vertical-middle">{{item.skuName}}</p>
							</div>
						</div>
						<div class="pack-btn font-12 font-green inline-block" @click="listFlagShow(index)">查看包装清单</div>
					</div>
					<div class="float-right text-right">
						<div class="image block bg-buffer bg-cover" :style="{'background-image':'url('+ item.imageSrc +')'}"></div>
					</div>
				</div>
			</div>
			<div v-if="listData.length > showNum" class="toggle-btn font-12 font-lightGray text-center" :class="{active:showFlag}" @click="showFlag = !showFlag">
				<span>{{showFlag?'收起':'展开'}}</span>
				<img class="icon" src="~@assets/img/arrow-down-gray.png"/>
			</div>
			<p class="font-12 font-BBB">温馨提示：归还时请检查好你的包裹，确保将包装清单中的物件完整归还，以免因缺件产生二次快递费用。</p>
		</div>
		<ul class="returnProduct-type-list bg-white public-padding-v">
			<li class="public-arrow-right" @click="select(0)">
				在线预约顺丰
			</li>
			<li class="public-arrow-right" @click="select(1)">
				自己联系
			</li>
			<li class="public-arrow-right" @click="select(2)">
				上门自还
			</li>
		</ul>
		<packList :packListData = "packListData" :listFlag = 'listFlag' @packListHidden="packListHidden"></packList>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import packList from '@components/packList';
export default {
	data () {
  		return {
  			showNum:2,
  			askData:{},
  			listData:[],
  			selectProductArray:[],
  			showFlag:false,
  			listFlag:false,
  			packListData:{},
	  	}
  	},
  	mounted(){
		var that = this;
		that.askData.orderNo = that.$route.query.orderNo;
		that.selectProductArray = that.$route.query.selectProductArray || [];
		that.initData();
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.orderProduct, that.askData,{method:'GET'}).then((res)=> {
				var details = res.details;
				if(details.length && that.selectProductArray.length){
					var listData = [];
					details.map((item,index) => {
						if(that.selectProductArray.indexOf(index) > -1){
							listData.push(item)
						}
					})
					that.listData = listData;
				}else{
					that.listData = details;
				}
			})
		},
		listFlagShow(index){
			var that = this;
			var packListData = that.listData[index];
			if(!packListData.packList){
				var list = packListData.productList.split(",");
				for( let i = 0 ; i < list.length ; i++){
					let arr = list[i].split("*");
					list[i] =  {
						name:arr[0],
						count:arr[1]
					}
				}
				packListData.packList = list;
			}
			that.packListData = packListData;
			that.listFlag = true
		},
		packListHidden(){
			var that = this;
			that.listFlag = false;
		},
		select(index){
			var that = this;
			var orderNumbers = [];
			that.listData.map(item => {
				orderNumbers.push(item.orderNumber);
			});
			if(index == 0){
				//为了刷新界面 不要瞎改这里
				window.location.href = "#/returnSF?type=sf&orderNumbers="+orderNumbers.join(',');
				//that.$router.replace({path: '/returnSF',query: { orderNumbers:orderNumbers.join(','),type:'sf'}});
			}else if(index == 1){
				window.location.href = "#/returnSF?orderNumbers="+orderNumbers.join(',');
				//that.$router.replace({path: '/returnSF',query: { orderNumbers:orderNumbers.join(',')}});
			}else{
				that.$router.replace({path: '/returnSelf',query: { orderNumbers:orderNumbers.join(',')}});
			}
		}
	},
	components: {
	    packList
	}
}
</script>

<style>
.returnProduct-page.public-card-page{
	padding-top: 0;
}
.returnProduct-page .returnProduct-header{
	padding-bottom: 1rem;
}
.returnProduct-page .public-card-content{
	margin-bottom: 0.2rem;
}
.returnProduct-page .public-card-content .product-wrap{
	padding-bottom: 0.5rem;
	border-bottom: 0.05rem solid #EEEEEE;
}
.returnProduct-page .public-card-content .product-wrap:last-child{
	border: none;
}
.returnProduct-page .public-card-content .product-wrap .content{
	width: 13rem;
}
.returnProduct-page .returnProduct-type-list{
	margin-top: 0.4rem;
}
.returnProduct-page .returnProduct-type-list li{
	padding:0.9rem 0;
	border-bottom: 0.05rem solid #EEEEEE;
}
.returnProduct-page .returnProduct-type-list li:last-child{
	border: none;
}
.returnProduct-page .toggle-btn{
	width: 2.5rem;
	margin: 0 auto 1rem auto;
}
.returnProduct-page .toggle-btn .icon{
	width: 0.5rem;
}
.returnProduct-page .toggle-btn.active .icon{
	transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
}
</style>