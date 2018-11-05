<template>
	<div v-cloak class="remark-page has-footer">
		<div class="textarea-wrap bg-white public-padding-v">
			<textarea class="textarea width-full block" placeholder="输入商品的备注信息 (100字)" v-model="remark" maxlength="100"></textarea>
		</div>
		<div class="fixed left bottom right bg-blue font-white text-center public-lineheight" @click="submit">完成</div>
	</div>
</template>

<script>

export default {
	data () {
  		return {
			remark:''
  		}
  	},
	mounted () {
		var that = this;
		that.remark = that.$route.query.remark;
	},
	methods: {
		submit(){
			var that = this;
			eventBus.$emit('remark',that.remark);
	        that.$router.back();
		}
	}
}
</script>

<style >
.remark-page .textarea-wrap{
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
}
.remark-page .textarea-wrap .textarea{
	height: 6.8rem;
	outline: none;
	border: none;
}
.remark-page .textarea-wrap .textarea::-webkit-input-placeholder{
    color:#BBBBBB;
}
.remark-page .textarea-wrap .textarea:focus{
	outline: none;
	border: none;
}
</style>
