<template>
	<div class="iqiyi-page">
		<img class="width-full block" src="https://resource.tanwuapp.com/FvPWgQMMAL0wDWmJrfpHUwVz1uu2">
		<img class="width-full block" src="https://resource.tanwuapp.com/Fk-v3R0y2AQqrY6XV7eG8sHIjZoX">
		<img class="width-full block" src="https://resource.tanwuapp.com/FphlpAEqImz5OYztfAsSqk63W5ok">
		<img class="width-full block" src="https://resource.tanwuapp.com/Fp2m4abB-JIGQeVlwPavFaOkgMcr">
		<img class="width-full block" src="https://resource.tanwuapp.com/Fo46Wo-ncke3QKDyBrZaLTU9jzv-">
		<img class="width-full block" src="https://resource.tanwuapp.com/FjPHdsVD5r91wr5fL1xBUyvhsMj3">
		<img class="width-full block" src="https://resource.tanwuapp.com/FsXFVuI8XB2HYWQMGq0mIHNpaTT-">
		<img class="width-full block" src="https://resource.tanwuapp.com/Fk-GrCkXPPhMNkJmxzLmWSTXP4Vr">
		<img class="width-full block" src="https://resource.tanwuapp.com/FlFovwdKnKaUUIZ7Q1lOEpuZGbXc">
		<div class="footer fixed left right fixd-center text-center">
			<img class="btn" @click="goProduct" src="https://resource.tanwuapp.com/FtXhzpJfKlhnzdUD3YsjQpzcXKZM" />
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	export default {
		data() {
			return {
				source:'',
				alipayFlag:false,
	            	alipayMiniappFlag:false,
	            	androidFlag:false,
	            	//安卓2.0的跳转方式不同
	            	version2Flag:false,
	            	mainData:{
	            		id:256,
	            		name:'爱奇艺 二代'
	            	}
			}
		},
		mounted() {
			var that = this;
			if(IFALIPAY){
				that.alipayFlag = true;
			}
			if(IFALIPAYMINIAPP){
				that.alipayMiniappFlag = true;
			}
			var query = that.$route.query || {};
			if(query.client_type == 'android'){
				that.androidFlag = true;
				if(query.version == 2){
					that.version2Flag = true;
				}
			}
			var source = "";
        		if(query.source){
            		source = query.source;
            		that.source = source;
            		localStorage.setItem("source",source);
            	}
        		localStorage.setItem("opeActivityTag",'iqiyi_'+source);
        		if(!IFALIPAYMINIAPP){
        			that.umeng('爱奇艺10送月卡', '访问', source);
        			var reqStr = {
	        			activityName:'iqiyi',
	        			source:source
	        		};
	        		network(CONFIG.systemClientLog,{
	        			platform:'h5',
					type:'info',
					url:'',
					reqStr:JSON.stringify(reqStr)
	        		}).then((res) => {});
        		}
		},
		methods: {
			goProduct(item){
				var that = this;
				var item = that.mainData;
				if(!IFALIPAYMINIAPP){
					that.umeng('爱奇艺10送月卡', '访问', item.name);
					var reqStr = {
		        			activityName:'iqiyi',
		        			source:that.source,
		        			productId:item.id,
		        			productName:item.name
		        		};
		        		network(CONFIG.systemClientLog,{
		        			platform:'h5',
						type:'info',
						url:'',
						reqStr:JSON.stringify(reqStr)
		        		}).then((res) => {});
				}
				if(IFALIPAYMINIAPP){
					my.navigateTo({url: '/pages/productDetails/productDetails?productId='+item.id});
				}else if(IFALIPAY){
					window.open('alipays://platformapi/startapp?appId=2017082408357898&page=pages/productDetails/productDetails&query=productId%3d'+item.id)
				}else if(that.androidFlag && that.version2Flag){
					var result = {
						productId:item.id
					}
					window.android.start('productDetails',JSON.stringify(result))
				}else{
					//兼容iOS 一定要加product_id 不然会崩
					window.location.href = "/#/productDetails?product_id="+item.id+'&productId='+item.id;
				}
			}
		}
	}
</script>

<style>
.iqiyi-page .footer {
	bottom: 0.4rem;
}
.iqiyi-page .btn{
	width: 90%;
}

</style>