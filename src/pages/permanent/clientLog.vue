<template>
	<div class="clientLog-page">
		<ul class="clientLog-list public-padding-v">
			<li v-for="(item,index) in listData">
				{{item}}
			</li>
		</ul>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	export default {
		data () {
	  		return {
	  			listData:[]
	  		}
	  	},
	  	mounted(){
			var that = this;
        		network(CONFIG.systemClientLogView,{},{method:'GET'}).then((res) => {
				that.listData = res;
			});
		}
	}
</script>

<style>
.clientLog-list {
	padding-top: 0.9rem;
}
.clientLog-list li{
	margin-bottom: 0.9rem;
}
</style>