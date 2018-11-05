<template>
	<div class="visitCus-page">
		<ul class="visitCus-list">
			<li v-for="(item,index) in mainData">
				<p v-if="index == 'userHeadThumb'">
					<span class="image" :style="{'background-image':'url('+item+')'}"></span>
				</p>
				<p v-else>{{index}} : {{item}}</p>
			</li>
		</ul>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';

	function sendMessage(type, data, iframeKey) {
		const params = {};
		params.type = type;
		params.data = data;
		params.resource = 'csbridge';
		params.iframeKey = iframeKey;
		window.parent.postMessage(JSON.stringify(params), '*');
	}
	export default {
		data() {
			return {
				askData: {},
				mainData: []
			}
		},
		mounted() {
			var that = this;
			var query = that.$route.query;
			that.askData.params = query.params;
			that.askData.key = query.key;
			var iframeKey = query.iframeKey;
			sendMessage('updateHeight', 600);
			network('https://150.api.tanwuapp.com/minialiapp/user/decrypt-cinfo', that.askData).then((res) => {
				if(res.details) {
					that.mainData = res.details.extInfo;
					sendMessage('updateUserInfo', {
						"userId": that.mainData.userId,
						"userName": that.mainData.userName
					}, iframeKey);
				}
			});
		}
	}
</script>

<style>
	.visitCus-list {
		list-style-type: none;
	}
	
	.visitCus-list li {
		font-size: 14px;
		margin-bottom: 2px;
	}
	
	.visitCus-list .image {
		display: block;
		width: 40px;
		height: 40px;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 100%;
	}
</style>