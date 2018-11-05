<template>
	<div v-cloak class="selfs-page has-footer">
		<ul class="selfs-list public-padding-v">
			<li v-for="(item,index) in selfData" class="relative">
				<div class="flex flex-align-center" @click="selfIndex = index">
					<div class="checkbox">
						<span class="public-checkbox border-box block" :class="{'active':selfIndex == index}"></span>
					</div>
					<div>
						<p class="name font-bold">{{item.selfName}}</p>
						<p class="font-grey font-12">{{item.selfAddress[2]}}</p>
						<p class="font-grey font-12">{{item.selfAddress[0]}}&nbsp;&nbsp;{{item.selfAddress[1]}}</p>
					</div>
				</div>
				<span class="line-normal bg-BBB absolute left bottom right"></span>
			</li>
		</ul>
		<div class="fixed left bottom right bg-blue font-white text-center public-lineheight" @click="submit">完成</div>
	</div>
</template>

<script>
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';

export default {
	data () {
  		return {
			selfData:[],
			selfIndex:0
  		}
  	},
	mounted () {
		var that = this;
		setBodyColor(true);
		that.selfData = that.$route.query.selfData;
		that.selfIndex = that.$route.query.selfIndex;
	},
	methods: {
		submit(){
			var that = this;
			eventBus.$emit('selfIndex',that.selfIndex);
	        that.$router.back();
		}
	},
	destroyed(){
		setBodyColor();
	},
}
</script>

<style >
.selfs-page .selfs-list li{
	padding: 0.9rem 0;
}
.selfs-page .selfs-list li .name{
	margin-bottom: 0.1rem;
}
.selfs-page .selfs-list li .checkbox{
	width: 1.6rem;
}

</style>
