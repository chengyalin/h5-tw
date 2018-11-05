<template>
	<ul class="closeProduct-list public-padding-v">
		<router-link class="display-flex-between" v-for = "(item,index) in products" :key = "'product'+ item.productId" tag="li" :to = "{path:'/productDetails',query:{productId:item.productId}}">
			<span class="image bg-buffer bg-cover block" :style="{'background-image':'url('+item.productImage+')'}"></span>
			<div class="content display-flex-between flex-column">
				<div>
					<p class="name font-darkGray font-bold line-clamp-2">{{item.productName}}</p>
					<div class="star-wrap">
						<div class="star-list vertical-middle font-12 font-lightGray">
							<div class="star-item vertical-middle bg-full" v-for ="starItem in 5" :key="starItem.id">
			                    <span v-if="item.appraiseScore >= starItem" class="star"></span>
			                    <span v-else-if="item.appraiseScore < starItem && (item.appraiseScore*1+1) > starItem" class="star" :style = "{'width':item.appraiseScore%1*100+'%'}"></span>
			                </div>
			                <span class="vertical-middle">{{item.appraiseScore}}</span><span class="point vertical-middle"></span><span class="vertical-middle">口碑 {{item.appraiseCount}}</span>
						</div>
					</div>
				</div>
				<div class="public-price-wrap">
					<span class="vertical-bottom font-blue font-12 font-bold">￥</span><span class="price vertical-bottom font-blue font-16 font-bold">{{item.rent | formatInt}}</span><span class="vertical-bottom font-blue font-10">{{item.rent | formatDecimal}}</span>
					<span class="vertical-bottom font-grey font-10">/{{item.rentUnit}}</span>
				</div>
			</div>
		</router-link>
	</ul>
</template>

<script>
  export default {
  	data() {
  		return {
  		}
  	},
  	props:['products'],
  }
</script>

<style>
</style>