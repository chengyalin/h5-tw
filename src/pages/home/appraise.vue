<template>
	<div v-cloak class="appraise-page has-footer has-footer-iphoneX">
		<!-- 唯一仅存的头部样式
		<header class="public-header bg-white">
			<p class="text-center font-darkGray font-16 font-bold">口碑评分</p>
		</header>
		-->
		<div v-if="mainData.score.avg_score" class="score font-20 font-darkGray font-bold relative public-padding-v">
			好评 {{mainData.praiseRate}}%
			<div class="star-wrap">
				<div class="star-list vertical-middle font-12 font-lightGray">
					<div class="star-item vertical-middle bg-full" v-for ="starItem in 5">
	                    <span v-if="mainData.score.avg_score >= starItem" class="star"></span>
	                    <span v-else-if="mainData.score.avg_score < starItem && (mainData.score.avg_score*1+1) > starItem" class="star" :style = "{'width':mainData.score.avg_score%1*100+'%'}"></span>
	                </div>
	                <span class="vertical-middle">{{mainData.score.avg_score}}</span>
				</div>
			</div>
		</div>
		<div v-if="mainData.tags.length && listData.length" class="appraise-tag-wrap public-padding-v">
			<ul class="appraise-tag-list font-grey font-12" :class="{'active':tagFlag && tagMoreFlag}" ref = "tagList">
				<li class="text-center vertical-middle" :class="{'active':!askData.tagId}" @click="selectTag('')">全部({{mainData.score.total}})</li>
				<li v-if="item.name" v-for = "(item,index) in mainData.tags" class="text-center vertical-middle" :class="{'active':item.id == askData.tagId}" @click="selectTag(item.id)">{{item.name}}({{item.total}})</li>
			</ul>
			<div v-if="tagMoreFlag" class="appraise-tag-btn text-center" :class="{active:!tagFlag}" @click="tagToggle">
				<span class="vertical-middle font-lightGray font-12">{{tagFlag?'展开':'收起'}}</span>
				<img class="icon vertical-middle" src="~@assets/img/arrow-down-gray.png"/>
			</div>
		</div>
		<div class="appraise-list public-padding-v">
			<div class="public-appraise-item relative" v-for="(item,index) in listData" :key = "item.appraise_id">
				<router-link :to="{path: '/self/selfEdit', query:{uuid: item.uuid}}" class="avatar bg-buffer bg-cover" :style="{'background-image':'url('+item.head_thumb+')'}"></router-link>
				<p class="name font-darkGray font-bold line-ellipsis">
					<span class="vertical-middle">{{item.nickname || '已重置'}}</span>
					<span v-if="item.productAppraiseType == 'ORDER'" class="vertical-middle public-tag-black font-white font-10">已体验</span>
				</p>
				<p class="time font-lightGray font-12">{{item.datetime | formatTime5}}</p>
				<span class="public-comment-like absolute top right font-lightGray" :class="{'active':item.is_praise == 'Y'}" @click="praise(index)">{{item.praise_count > 0 ? item.praise_count : ''}}</span>
				<div class="font-grey">
					{{item.details}}
				</div>
				<ul v-if="item.image_list_src.length" class="image-list"> 
					<li class="bg-cover vertical-top bg-buffer previewer-img relative" :class="'previewer-img'+index" @click="previewerShow(index,cIndex)" v-for="(cItem,cIndex) in item.image_list_src" :key = "item.appraise_id + cIndex" v-if = "cIndex < 3" :style="{'background-image':'url('+cItem+')'}">
						<span v-if="item.image_list_src.length > 3 && cIndex == 2" class="count absolute font-white font-10 font-bold">{{item.image_list_src.length}}张</span>
					</li>
				</ul>
				<div>
					<previewer :list="previewerList" ref="previewer" :options="item.options" @on-index-change="logIndexChange"></previewer>
				</div>
			</div>
		</div>
		<div v-if="noDataFlag && !listData.length" class="noData-wrap center fixed text-center width-full">
			<img class="noData-image" src="~@assets/img/message-null.png"/>
			<p class="font-lightGray">暂无任何口碑，快抢个沙发吧～</p>
		</div>
		<mt-spinner v-if="listData.length && more == 1" type="triple-bounce" color="#00DCC4"></mt-spinner>
		<div class="fixed left bottom right iphoneX-footer fixd-center bg-white">
			<span class="bg-blue text-center font-white public-lineheight block" @click="GoToAdd('/appraiseAdd',{productId:askData.product_id})">添加口碑</span>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { CONFIG } from '@assets/js/config';
import { network } from '@assets/js/network';
import { setBodyColor } from '@assets/js/mUtils';
import { Previewer } from 'vux';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
export default {
	data () {
  		return {
			askData:{
		        size:20,
		        start:"-1"
		    },
		    switchShow:false,
		    noDataFlag:false,
			more:1,
			listData:[],
			mainData:{
				score:[],
				tags:[]
			},
			tagFlag :true,
			previewerList:[],
			tagMoreFlag:false
	  	}
  	},
  	mounted(){
		var that = this;
		setBodyColor(true);
		that.askData.product_id = that.$route.query.productId;
		that.getData();
		window.addEventListener('scroll', that.scrollBottom)
		network(CONFIG.appraisesHeader,that.askData).then((res) => {
		    that.mainData = res.details;
		    setTimeout(function() {
		    		if(that.$refs['tagList']){
					let height = that.$refs['tagList'].offsetHeight;
	             	if(height > 83){
	             		that.tagMoreFlag = true;
	         		}
				}
		    },20)
		});
	},
	activated(){
		var that = this;
		window.addEventListener('scroll', that.scrollBottom)
	},
	deactivated(){
		var that = this;
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom)
	},
	destroyed(){
		var that = this;
		window.scrollTo(0,0);
		window.removeEventListener('scroll',that.scrollBottom);
		setBodyColor();
	},
	methods:{
		getData(){
			var that = this;
			if (that.more == 0 || that.switchShow) {
		        return false;
		    };
		    that.switchShow = true;
            network(CONFIG.appraises,that.askData).then((res) => {
				var details = res.details;
			    details.forEach(function(item,index){
	                	item.image_list_src = item.image_list_src.length?item.image_list_src.split(","):[];
    			    });
               	that.listData = that.listData.concat(details);
				that.askData.start = res.result.start;
				that.more = res.result.more;
				that.switchShow = false;
				if(!that.listData.length){
					that.noDataFlag = true;
				}
			});
		},
		scrollBottom(){
	        	var that = this;
	        	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if((scrollTop + clientHeight) == scrollHeight){
				that.getData();
			}
        },
		GoTo(href,query){
			var that = this;
			that.$router.push({path: href,query: query});
		},
		GoToAdd(href,query){
			var that = this;
			if(!that.goLogin()){
				return false;
			}
			that.$router.push({path: href,query: query});
		},
		selectTag(id){
			var that = this;
			that.askData.tagId = !id || that.askData.tagId == id?'':id;
			that.askData.start = -1;
			that.more = 1;
			that.noDataFlag = false;
			that.listData = [];
			that.getData();
		},
		tagToggle(){
			var that = this;
			that.tagFlag = !that.tagFlag;
		},
		previewerShow(index,cIndex){
			var that = this;
			var list =  [];
			var details = that.listData[index].details,num = 40;
			that.listData[index].image_list_src.map(item=>{
				list.push({
					src:item
				})
			})
			that.listData[index].options = {
				getThumbBoundsFn (i) {
		          let thumbnail = document.querySelectorAll('.previewer-img'+index)[i]
		          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
		          let rect = thumbnail ? thumbnail.getBoundingClientRect():{}
		          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
		        }
			}
			that.previewerList = list;
			setTimeout(function(){
				that.$refs.previewer[index].show(cIndex);
				/* 备选 弹窗文字说明
				if(details.length > num){
					var btn = document.getElementsByClassName('pswp__caption__more')[index];
					var caption =  document.getElementsByClassName('pswp__caption__center')[index];
					btn.classList.add("active");
				}*/
			},100)
		},
		logIndexChange (arg) {
	    },
	    praise(index){
	    		var that = this;
	    		var item = that.listData[index];
	    		network(CONFIG.appraisePraise,{
	    			product_appraise_id:item.appraise_id,
            		praise:(item.is_praise =="Y")?"N":"Y",
            		be_uuid:item.uuid
	    		}).then((res) => {
				item.is_praise = (res.details.flag =="1")?"Y":"N";
	            item.praise_count = res.details.count;
			});
	    }
	},
	components: {
	    Previewer
	}
}
</script>

<style>
.appraise-page{
	overflow: hidden;
}
.appraise-page .score{
	margin: 0.8rem 0;
}
.appraise-page .star-wrap{
	position: absolute;
	right: 0.9rem;
	top: 0;
}
.appraise-tag-wrap{
	margin-bottom: 1.6rem;
}
.appraise-tag-btn{
	width: 3rem;
	margin: 0 auto;
	margin-top: 0.6rem;
}
.appraise-tag-btn .icon{
	width: 0.5rem;
}
.appraise-tag-btn.active .icon{
	transform: rotate(180deg);
}
.appraise-tag-list.active{
	height: 4rem;
	overflow: hidden;
}
.appraise-tag-list li{
	padding: 0.4rem 0.6rem;
	background: #F7F7F7;
	margin-right: 0.5rem;
	border-radius: 1.6rem;
	margin-bottom: 0.4rem;
}
.appraise-tag-list li.active{
	background: #3ED8C4;
	color: #FFFFFF;
	font-weight: bold;
}
.appraise-page .public-appraise-item{
	margin-bottom: 1.9rem;	
}
</style>