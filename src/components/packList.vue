<template>
	<transition name = "anim-up">
		<div class="public-popup fixed top right bottom left fixd-center" v-if = "listFlag">
			<div class="public-popup-shadow" @click="hide"></div>
			<div class="bg-white absolute bottom left right">
				<p class="public-popup-bottom-title text-center font-16 font-darkGray font-bold relative">
					包装清单（{{packListData.packList.length}}）
					<span class="line-normal absolute left bottom right"></span>
				</p>
				<div class="packList-wrap">
					<div class="product-wrap display-flex-between">
						<span class="image bg-buffer bg-cover" :style="{'background-image':'url('+packListData.imageSrc+')'}"></span>
						<p class="name font-bold">{{packListData.productName}}</p>
					</div>
					<ul class="packList-list  font-12">
						<li v-for="(item,index) in packListData.packList" class="display-flex-between">
							<div class="name line-ellipsis relative">{{item.name}}</div>
							<div class="count font-grey text-right">*{{item.count}}</div>
						</li>
					</ul>
				</div>
				<div class="bg-blue font-white font-bold text-center public-lineheight"  @click="hide">完成</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
  	data() {
  		return {}
  	},
  	props:['packListData','listFlag'],
  	methods:{
  		hide(){
  			var that = this;
  			that.$emit('packListHidden');
  		}
  	}
}
</script>

<style>
</style>