<template>
	<div class="iqiyi2018_10_23-page relative">

		<img class="block width-full" src="https://resource.tanwuapp.com/FrB2lumwL_ZNuZGPa3lPiqa_qnFy" />
		<div class="relative writeArea">
			<img class="block width-full" src="https://resource.tanwuapp.com/FhmfUxelXiwTT4q0oOfGP8Ex4H8w"/>
			<div class="absolute top left right">
				<ul class="input-list">
					<li class="relative">
						<input type="text" class="input" placeholder="请填写手机号" v-model="askData.phone"/>
						<span class="code-btn" @click="sendCode">{{sendFlag ? '剩余 '+ second +'s' : '获取验证码'}}</span>
					</li>
					<li>
						<input type="text" class="input" placeholder="填写验证码" v-model="askData.code"/>
					</li>
				</ul>
				<div class="agree-wrap">
					<span class="agree-checkbox vertical-bottom" :class="{active:agreeFlag}" @click="agreeFlag = !agreeFlag"></span>
					<span class="font-white vertical-bottom">同意</span><router-link to="/service-terms" class="font-white vertical-bottom">服务条款</router-link>
				</div>
				<!--<div class="submit-btn" :class="{active:!agreeFlag || havingFlag == 'Y'}" @click="submit">
					{{havingFlag == 'Y' ? '已兑换' : '参与兑换'}}
				</div>-->
        <div class="submit-btn" @click="submit" >
          参与兑换
        </div>
        <router-link to="/">
          <div  class="goHome">立即前往探物商城 ></div>
        </router-link>
			</div>
		</div>
		<div class="relative">
			<!--<img class="block width-full" src="https://resource.tanwuapp.com/Fg2CoM-A_eh6ll4BS_I8YFFZ1gSI" />-->
			<!--<img class="block width-full" src="~@assets/img/activity/rule.png" />-->
			<img class="block width-full" src="https://resource.tanwuapp.com/FoH8KWS9v0HXoxD-056KzI1ErWMl" />
			<div class="rule-wrap absolute top left bottom right ruleArea">
			<!--	<h2>#兑换规则</h2>
				<p>爱奇艺会员200积分可兑换探物30元指定产品抵用券1张；</p>
				<h2>#优惠券使用规则</h2>
				<p>此券可用于在探物平台租赁爱奇艺 VR 一体机尊享版、爱奇艺奇遇 II VR一体机两款产品且租金金额满99元时使用（不含安心享服务费用及押金）</p>-->
			</div>
		</div>
    <!--弹框-->
    <div class="MaskArea" v-if="maskAreaShow">
      <div class="blackMask"></div>
      <div class="showWord">
        <div class="close" @click="maskAreaShowHide"></div>
        <div v-if="havingFlag == 'N'">
          <h2 class="title">领取成功</h2>
          <p class="word">恭喜你获得30元探物抵用券 </p>
          <p class="word">立即前往探物商城体验新奇数码</p>
        </div>
        <div v-if="havingFlag == 'Y'">
          <h2 class="title">已领取过奖励哦</h2>
          <p class="word">立即前往探物商城体验新奇数码</p>
        </div>
        <router-link :to="{path: '/productDetails',query: {productId:256}}">
          <div  class="goBtn"></div>
        </router-link>
      </div>
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
        maskAreaShow:false,//弹框
				askData:{
					phone:'',
					code:'',
					"scene":'regAndLogin'
				},
				sendFlag:false,
				second:60,
				agreeFlag:true,
				activityAskData:{
	            		activityName:"iqyi_integral_covert",
	            	},
	            	havingFlag:'N',
	            	source:''
			}
		},
		mounted() {
			var that = this;
			// that.activityInit();
			var source = "";
			var query = that.$route.query || {};
        		if(query.source){
            		source = query.source;
            		that.source = source;
            		localStorage.setItem("source",source);
            	}
        		//活动访问统计
			var reqStr = {
        			activityName:that.activityAskData.activityName,
        			action:'访问',
        			source:source
        		};
			network(CONFIG.systemClientLog,{
				platform:'h5',
				type:'info',
				url:'',
				reqStr:JSON.stringify(reqStr)
			},{codeFlag:true}).then((res) => {});
		},
		methods: {
      maskAreaShowHide(){
        var that=this;
        that.maskAreaShow=false;
      },
      sendCode(){//发送验证码
        var that = this;
        if(!that.sendFlag){
          var reg_tel = /^1\d{10}$/;
          if(!reg_tel.test(that.askData.phone)) {
            Vue.toast('手机不合法',{duration:1500})
            return false;
          };
          that.sendFlag = true;
          that.countdown();
          var askData = {
            phone: that.askData.phone,
            useType: 0
          };
          network(CONFIG.userSMScode, askData, {codeFlag:true}).then((res) => {
            if (res.head.code == 0) {
              Vue.toast('发送成功',{duration:1500})
            } else {
              that.second = 1;
              Vue.toast(res.head.message,{duration:1500})
            }
          })
        }
      },
      countdown(){
        var that = this;
        var second = that.second;
        if(second <= 0) {
          that.second = 60;
          that.sendFlag = false;
          return false;
        };
        setTimeout(() => {
          that.second = that.second - 1;
          that.countdown();
        }, 1000)
      },

      receiveCoupons() {
        var that = this;
        network(CONFIG.activityExtendGrantCoupon,{
          activityName:that.activityAskData.activityName
        },{codeFlag:true}).then((res) => {
          if(res.head.code == 0) {
            that.maskAreaShow = !that.maskAreaShow;
            that.havingFlag = "N";
            Indicator.close();
            var reqStr = {
              activityName:that.activityAskData.activityName,
              action:'兑换优惠券',
              source:that.source
            };
            network(CONFIG.systemClientLog,{
              platform:'h5',
              type:'info',
              url:'',
              reqStr:JSON.stringify(reqStr)
            },{codeFlag:true}).then((res) => {});
          }else {
            Indicator.close();
            if (res.head.code == 201) {
              that.maskAreaShow = !that.maskAreaShow;
              that.havingFlag = "Y";
            }
          }
        });
      },
      submit(){
        var that = this;
        var reg_tel = /^1\d{10}$/;
        if(!reg_tel.test(that.askData.phone)) {
          Vue.toast('手机不合法',{duration:1500})
          return false;
        };
        if(!that.askData.code.trim()){
          Vue.toast("请输入收到的验证码",{className: ['myToast-warning']});
          return false;
        }
        if(!that.agreeFlag){
          Vue.toast('请先同意服务条款',{duration:1500})
          return false;
        }
        Indicator.open();
        network(CONFIG.activityLaterAction, that.askData, {codeFlag:true}).then((res) => {
          if (res.head.code == 0) {
            localStorage.setItem("twUser",JSON.stringify(res.details.resp));
            that.receiveCoupons();
          } else {
            Indicator.close();
            Vue.toast(res.head.message,{duration:1500})
          }
        })
      }
		}
	}
</script>

<style>
  .iqiyi2018_10_23-page{width:100%;overflow: hidden; }
  .iqiyi2018_10_23-page .rule-wrap{
/*		padding: 0 3.5rem 5.8rem 3.5rem;
		color: #D8363F;*/
	}
	.iqiyi2018_10_23-page .rule-wrap h2{
		font-size: 0.7rem;
		margin-bottom: 0.1rem;
		font-weight: bold;
	}
	.iqiyi2018_10_23-page .rule-wrap p{
		font-size: 0.65rem;
		line-height: 1.2;
		margin-bottom: 0.3rem;
	}
	.iqiyi2018_10_23-page .input-list{
    width: 17.78rem;
    margin: 0 auto;
	}
	.iqiyi2018_10_23-page .input-list li{
		position: relative;
    background: url(https://resource.tanwuapp.com/FsBqGJWK7gj6tTCts4NO0M6LWdcC) no-repeat center;
		background-size:contain ;
		width: 17.78rem;
		height: 3.025rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding-left: 0.6rem;
		padding-top: 0.8rem;
		margin-bottom: -0.3rem;
	}
	.iqiyi2018_10_23-page .input-list li .input{
		height: 1.4rem;
		line-height: 1.4rem;
		width: 10rem;
		background: transparent;
	}
	.iqiyi2018_10_23-page .input-list li .input:focus{
		background: none;
		outline: none;
		border: none;
	}
	.iqiyi2018_10_23-page .input-list li .code-btn{
		position: absolute;
		right: 1rem;
		top: 0.95rem;
		padding: 0.3rem 0;
		line-height: 1;
		color: #FFFFFF;
		background: #FB7248;
		border-radius: 1.1rem;
		width: 3.7rem;
		font-size: 0.55rem;
		text-align: center;
	}
	.iqiyi2018_10_23-page .submit-btn{
		display: block;
		margin: 0 auto;
		width: 13.65rem;
		height: 2.95rem;
    background: url(https://resource.tanwuapp.com/FusUy1YwQWzPFXRGP-VlRWhL-lxV) no-repeat center;
		background-size:contain ;
		text-align: center;
		line-height: 2.95rem;
		font-size: 1rem;
		color: #fff;
	}
	.iqiyi2018_10_23-page .submit-btn.active{
		color: #666666;
    pointer-events: none;
	}
	.iqiyi2018_10_23-page .agree-wrap{
	  width: 6rem;
		line-height: 1;
		font-size: 0.625rem;
		padding: 0.4rem 0.28rem;
    text-align: center;
	}
	.iqiyi2018_10_23-page .agree-wrap .agree-checkbox{
		position: relative;
		width: 0.875rem;
		height: 0.875rem;
		background: #FFFFFF;
		border-radius: 0.15rem;
		margin-right: 0.4rem;
	}
	.iqiyi2018_10_23-page .agree-wrap .agree-checkbox.active:after{
		content: "";
		position: absolute;
		top:0;
		right: -0.3rem;
		width: 0.95rem;
		height: 0.775rem;
		background: url('https://resource.tanwuapp.com/FgC-HoGr0utmCfZjuwxYfJmVLglG') no-repeat center;
		background-size:contain ;
	}

  .iqiyi2018_10_23-page .writeArea{}
  .iqiyi2018_10_23-page .ruleArea{
    width: 15.15rem;
    padding:3.1rem 1.85rem 0;
    margin: 0 auto;
    color: #6B363D;
  }
  .iqiyi2018_10_23-page .goHome{
    text-align: center;
    margin-top: 0.70rem;
    color: #D4323B;
    font-weight: 600;}


  .iqiyi2018_10_23-page .MaskArea{}

  .iqiyi2018_10_23-page .MaskArea .blackMask{position: fixed;width: 100%;height: 100%;top:0;left: 0;z-index: 3;background-color: #000;opacity: .7;}
  .iqiyi2018_10_23-page .MaskArea .showWord{width: 15.3rem;height: 13.3rem;background: url(https://resource.tanwuapp.com/FrY0jnVVOhMD6hZ4wiZCDDPhNVuV);background-size: cover;position: fixed;top:50%;left: 50%;margin-top: -6.65rem;margin-left: -7.65rem;z-index: 4;text-align: center;}
  .iqiyi2018_10_23-page .MaskArea  .showWord .close{width: 0.8rem;height: 0.8rem;background: url("https://resource.tanwuapp.com/Fio6BVoxdfWos4g0s7OXOcKEDjqC");background-size: cover; position: absolute;right: 0.9rem;top:0.9rem;}
  .iqiyi2018_10_23-page .MaskArea .showWord .title{font-size: 1rem;color:rgba(255,116,33,1);margin: 1.8rem 0 2.5rem;}
  .iqiyi2018_10_23-page .MaskArea .showWord .word{font-size: 0.7rem;color:rgba(254,133,58,1);line-height: 1.2rem;}
  .iqiyi2018_10_23-page .MaskArea .showWord .goBtn{display: block; width: 8.7rem;height: 2.08rem;background: url("https://resource.tanwuapp.com/FgVz9SlqjyoxA4odkhZ8OtbVi7q2");background-size: cover;margin: 1.68rem auto 0;}
</style>
