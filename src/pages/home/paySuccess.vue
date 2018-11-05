<template>
	<div class="paySuccess-page bg-white">
		<div class="content text-center">
			<img class="image" src="~@assets/img/paySuccess-person.png"/>
			<p class="font-blue font-16 font-bold">{{submitFlag ?'提交成功！':'支付成功！'}}</p>
			<p v-if = "depositFlag" class="tip font-grey">预授押金成功，请耐心等待审核结果</p>
			<p v-else-if = "submitFlag" class="tip active font-grey">审核中的订单可随时预授押金 提高订单通过率</p>
			<div class="display-flex-between public-lineheight font-bold public-padding-v">				
				<div class="btn font-blue bg-white text-center" @click="goIndex">
					返回首页
				</div>
				<div class="btn bg-blue font-white text-center" @click="goOrderDetail">
					查看订单
				</div>
			</div>
		</div>
		<div v-if="listData.length">
			<p class="font-20 font-bold public-padding-v">猜你喜欢</p>
			<ul class="closeProduct-list public-padding-v">
				<router-link class="display-flex-between" v-for = "(item,index) in listData" tag="li" :to = "{path:'/productDetails',query:{productId:item.product_id}}">
					<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.image_src+')'}"></span>
					<div class="content display-flex-between flex-column">
						<div>
							<p class="name font-darkGray font-bold line-ellipsis">{{item.name}}</p>
							<div class="star-wrap">
								<div class="star-list vertical-middle font-12 font-lightGray">
									<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
					                    <span v-if="item.avg_score >= starItem" class="star"></span>
					                    <span v-else-if="item.avg_score < starItem && (item.avg_score*1+1) > starItem" class="star" :style = "{'width':item.avg_score%1*100+'%'}"></span>
					                </div>
					                <span class="vertical-middle">{{item.appraiseScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraiseCount}}</span>
								</div>
							</div>
						</div>
						<div class="public-price-wrap">
							<span class="vertical-bottom font-red font-12 font-bold">￥</span><span class="price vertical-bottom font-red font-16 font-bold">{{item.rent | formatInt}}</span><span class="vertical-bottom font-red font-10">{{item.rent | formatDecimal}}</span>
							<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
						</div>
					</div>
				</router-link>
			</ul>
		</div>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor} from '@assets/js/mUtils';
import share from '@components/shareItem';
export default {
	data () {
  		return {
  			listData:[],
  			orderNo:'',
  			depositFlag:false,
  			submitFlag:false,
  			hbIsPayRent:false,
  			hbIsDeposit:false
	  	}
  	},
  	mounted(){
  		var that = this;
		setBodyColor(true);
		var query = that.$route.query;
		if(query.depositFlag){
			that.depositFlag = true;
		}
		if(query.submitFlag){
			that.submitFlag = true;
			document.title = '提交成功'
		}
		if(query.hbIsPayRent){
			that.hbIsPayRent = query.hbIsPayRent;
		}
		if(query.hbIsDeposit){
			that.hbIsDeposit = query.hbIsDeposit;
		}
		if(query.orderNo){
			that.orderNo = query.orderNo;
			that.initData();
		}
	},
	methods:{
		initData(){
			var that = this;
			network(CONFIG.productGuess,{},{method:'GET'}).then((res) => {
  				that.listData = res.details;
			});
		},
		goIndex(){
			var that = this;
			that.$router.replace({path: '/home'});
		},
		goOrderDetail(){
			var that = this;
			that.$router.replace({path: '/orderDetails',query: { orderNo:that.orderNo}});
		}
	},
	destroyed(){
		setBodyColor();
	},
	components: {
	    share
	},
	
}
</script>

<style>
.paySuccess-page > .content{
	padding-top: 2.8rem;
	padding-bottom: 3.5rem;
}
.paySuccess-page > .content .image{
	width: 5.5rem;
	margin-bottom: 1rem;
}
.paySuccess-page > .content .tip{
	margin-top: 0.5rem;
	margin-bottom: 3.8rem;
	margin: 0.5rem auto 3.8rem auto;
}
.paySuccess-page > .content .tip.active{
	width: 9.1rem;
}
.paySuccess-page > .content .btn{
	width: 8.1rem;
	border-radius: 0.1rem;
	border: 0.05rem solid #36646E;
}
.paySuccess-page .closeProduct-list{
	margin-top: 0.8rem;
}
</style>