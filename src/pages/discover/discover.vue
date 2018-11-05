<template>
	<div class="discover-page has-footer bg-white border-box min-height-full">
		<div class="header bg-white font-26 font-bold font-BBB fixed top left right fixd-center">
			<router-link to="/discover/share" tag = "span" class="btn vertical-middle relative">动态</router-link>
            	<router-link to="/discover/information" class="btn vertical-middle relative">资讯</router-link>
            	<span class="line-normal absolute left bottom right"></span>
		</div>
		<router-view></router-view>
		<tabs></tabs>
	</div>
</template>

<script>
import Tabs from '@components/tabs';
export default {
	data () {
  		return {
  		}
  	},
	components: {
	    Tabs
	}
}
</script>

<style>
.discover-page{
	padding-top: 3.1rem;
}
.discover-page .header{
	box-shadow: 0 0 0 0.01rem rgba(0,0,0,0.1);
	padding-left: 0.9rem;
	line-height: 1.9rem;
	z-index: 10;
}
.discover-page .header .btn{
	padding-bottom: 0.4rem;
	padding-top: 0.8rem;
	margin-right: 1rem;
}
.discover-page .header .btn:after{
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	margin-left: -0.65rem;
	width: 1.3rem;
	height: 0.2rem;
}
.discover-page .header .btn.router-link-active{
	color: #333333;
}
.discover-page .header .btn.router-link-active:after{
	background: #333333;
}
</style>